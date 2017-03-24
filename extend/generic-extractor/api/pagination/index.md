---
title: Pagination
permalink: /extend/generic-extractor/api/pagination/
---

Pagination (or paging) describes how an API splits a large list of items into [separate pages](todowiki). 
Pagination may also be 
called *scrolling* or *traversing* (scrolling through a large result set), sometimes it is also referred to as
*setting a cursor* (pointing to a current result). Almost every API has some form of pagination because 
returning lists of results is impractical for many reasons (memory overflows, transfer takes too long, processing takes too long, ...). This makes pagination setting important if you want to retrieve large results. If you
are doing only an ad-hoc query to an API and you want to retrieve thousands of items at most, you may
get away without setting pagination at all.

When configuring Generic Extractor there is a slight distinction between *pagination* and *scrolling*:

- **pagination** -- describes paging of the entire API,
- **scrolling** (scroller) -- describes paging of a single resource.

As long as the API uses the same pagination method for all resources, there is no need to distinct between the 
two. Setting up pagination for Generic Extractor boils down to two crucial questions:

- How to obtain the next set of items? (*paging strategy*)
- How to determine that all items were obtained? (When stop scrolling) (*stopping strategy*)

An example pagination configuration looks like this:

{% highlight json %}
{
    ...,
    "pagination": {
        "method": "offset",
        "limit": "2"
    }
}
{% endhighlight %}

## Paging Strategy
Generic extractor supports the following paging strategies:

- [`offset`](todo) -- uses limit and offset to create pages (like in SQL)
- cursor
- offset 
- pagenum
- response-param
- response-url
- multiple

## Stopping Strategy
There are three situations when generic extractor will stop scrolling:

- the `nextPageFlag` configuration,
- the `forceStop` configuration,
- the same result is obtained twice,
- the result contains less items than requested (*underflow*)

This last two options can be demonstrated on a basic `offset` pagination type. Let's say that you
have an API endpoint `users` which takes parameters `limit` and `offset`. There are four users in
total. The response looks as this:

{% highlight json %}
[
    {
        "id": 345,
        "name": "Jimmy Doe"
    },
    {
        "id": 456,
        "name": "Jenny Doe"
    }
]
{% endhighlight %}

Querying `users?offset=0&limit=2` returns the first two users. Querying `users?offset=2limit`
the second two users. Then generic extractor will query `users?offset=4&limit=2`. 

If the response is empty (the API returns an empty page) -- i.e. `[]` the *underflow* check kicks in 
and the extraction is stopped. See [Full Example](todo:043-paging-stop-underflow)

Note that the *emptiness* is evaluated on the extracted array as [autodected](todo) or 
specified by the [`dataField`](todo) configuration. That means that the entire response
may be non-empty (see [Full Example](todo:044-paging-stop-underflow-struct).
Also, you'll see a warning in the logs

    WARNING: dataField `results.users.items` contains no data!

Which is expected.

If the API returns the last page, it is the same as the previous page and the second check kicks in
and the extraction is stopped too. 
You will see
this in Generic extractor logs as a message

    Job '1234567890' finished when last response matched the previous!

(see [Full Example](todo:041-paging-stop-same)

If the API returns the first page (uncommon), it is not same as the previous page and therefore another
request is sent to `users?offset=6&limit=2`. Then the result is as the previous page and the
second check kicks in and the extraction is stopped too. However the results from the first page
will be duplicated.
(see [Full Example](todo:042-paging-stop-same-2)

TODO: co z toho plati univerzalne a co jen pro offset?

### Next Page Flag
The above describes automatic behavior of Generic Extractor regarding scrolling stopping. 
Using *Next Page Flag* allows you to do a manual setup of the stopping strategy. Using
*Next Page Flag* means that Generic Extractor analyzes the response and looks for a
particular field (the flag) and decides whether to continue scrolling based on the 
value (or presence) of that flag.

Next page flag is configured using three options:

- `field` (required) -- Name of field containing some value. The field must be in root of the response. 
    The field will be converted to [boolean](/extend/generic-extractor/tutorial/json/#data-values).
- `stopOn` (required) -- Value to which the field will be compared to. When the values are equal, the scrolling stops.
- `ifNotSet` -- Assumed value of the `field` in case it is not present in response. Defaults to the `stopOn` value.

The boolean conversion has the following rules:

- `false`, `0`, `null`, string `"0"`, empty array `[]` is `false`,
- everything else is `true`.

Example `nextPageFlag` setting:

{% highlight json %}
"pagination": {
    "nextPageFlag": {
        "field": "moreItems",
        "stopOn": false,
        "ifNotSet": true
    },
    ...
}
{% endhighlight %}

See [Next Page Flag Examples](#next-page-flag-examples)

### Force Stop
Force stop configuration allows you to stop scrolling when some extraction limits are hit.
The supported options are:
 
- `pages` -- maximum number of pages to extract
- `time` -- maximum number of seconds the extraction should run
- `volume` -- maximum number of bytes which can be extracted

Example `forceStop` setting:

{% highlight json %}
"pagination": {
    "forceStop": {
        "pages": 20,
        "time": 3600
    },
    ...
}
{% endhighlight %}

The volume of response is measured as number of bytes in compressed JSON. Therefore the response 

{% highlight json %}
{
    "items": [
        {
            "id": 123,
            "name": "John Doe"
        },
        {
            "id": 234,
            "name": "Jane Doe"
        }
    ]
}
{% endhighlight %}

is compressed (minified) to:

{% highlight json %}
    {"items":[{"id":123,"name":"John Doe"},{"id":234,"name":"Jane Doe"}]}
{% endhighlight %}

which makes it 69 bytes long.

### Combining Multiple Stopping Strategies
All stopping strategies are evaluated simultaneously and for the scrolling to continue, none of
the stopping conditions must be met. Or in other words, the scrolling continues until any of the
stopping conditions is true. For example with the following configuration:

{% highlight json %}
"pagination": {
    "nextPageFlag": {
        "field": "isLast",
        "stopOn": true
    },
    "forceStop": {
        "pages": 20
    },    
    "method": "offset",
    "limit": "10"
}
{% endhighlight %}

The scrolling will stop if:

- an empty page is encountered,
- a page contains less then 10 items,
- a page contains the same items as the previous page,
- 20 pages were extracted,
- if a field `isLast` is present in the response and is true.

## Next Page Flag Examples

### Has-More Type Scrolling
Assume that the API returns a response which contains a `hasMore` field. The field is present in 
every response and has always the value `true` except for the last response where it is `false`.
The following pagination configuration can be used to configure the stopping strategy:

{% highlight json %}
"pagination": {
    "nextPageFlag": {
        "field": "hasMore",
        "stopOn": false,
        "ifNotSet": false
    },
    ...
}
{% endhighlight %}

means that the scrolling will **continue** till the field `hasMore` is present in the response and true.
In this case setting `ifNotSet` is not necessary.

See [Full Example](todo:045-next-page-flag-has-more)

### Non-Boolean Has-More Type Scrolling
Assume that the API returns a response which contains a `hasMore` field. The field is present only in the
last response and has the value `"no"` there.
The following pagination configuration can be used to configure the stopping strategy:

The configuration:

{% highlight json %}
"pagination": {
    "nextPageFlag": {
        "field": "hasMore",
        "stopOn": true,
        "ifNotSet": false
    },
    ...
}
{% endhighlight %}

means that the scrolling will **continue** until the field `hasMore` is present. This takes advantage of the
boolean conversion which converts the value `"no"` to true. If the field `hasMore` is not present, it defaults
to false. In this case setting `ifNotSet` is mandatory.

See [Full Example](todo:046-next-page-flag-has-more-2).

### Is-Last type of Scrolling
Assume that the API returns a response which contains a `isLast` field. The field is present only in the
last response and has the value `true` there.
The following pagination configuration can be used to configure the stopping strategy:

{% highlight json %}
"pagination": {
    "nextPageFlag": {
        "field": "isLast",
        "stopOn": true,
        "ifNotSet": false
    },
    ...
}
{% endhighlight %}

The above configuration will **stop** scrolling when the field `isLast` is present in the 
response and true. Because the field `isLast` is not present at all times, the `ifNotSet` configuration
is required.

(see [Full Example](todo:047-next-page-flag-is-last).

## Examples

### Force Stop
The following configuration will stop scrolling after extracting two pages of results or
after extracting 69 bytes of minifed JSON data (whichever comes first).

{% highlight json %}
"pagination": {
    "forceStop": {
        "pages": 2,
        "volume": 69
    },
    "method": "offset",
    "limit": "2"
}
{% endhighlight %}

(see [Full Example](todo:048-force-stop).
