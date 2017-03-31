---
title: Pagination
permalink: /extend/generic-extractor/api/pagination/
---

* TOC
{:toc}

[Pagination](https://en.wikipedia.org/wiki/Pagination) (or paging) describes how an API splits a large list of items into separate pages. Pagination may also be 
called *scrolling* or *traversing* (scrolling through a large result set), sometimes it is also referred to as
*setting a [cursor](https://en.wikipedia.org/wiki/Cursor_(databases))* (pointing to a current result). Almost every API has some form of pagination because 
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
Generic extractor supports the following paging strategies (scrollers), these are configured
using the `method` option:

- [`response.url`](/extend/generic-extractor/api/pagination/response-url/) -- uses URL provided in the response
- [`offset`](/extend/generic-extractor/api/pagination/offset/) -- uses page size (limit) and **item offset** (like in SQL)
- [`pagenum`](/extend/generic-extractor/api/pagination/pagenum/) -- uses page size (limit) and **page number**
- [`response.param`](/extend/generic-extractor/api/pagination/response-param/) -- uses some value (token) provided in the response.
- [`cursor`](/extend/generic-extractor/api/pagination/cursor/) -- uses an identifier of the item in response to maintain a scrolling cursor.
- [`multiple`](/extend/generic-extractor/api/pagination/multiple/) -- allows to set different scrollers for different API endpoints.

Choosing pagination strategy
- kdyz je url pouzij url
- kdyz je neco v response, pouzij response
- fallbak je offset a pagenum ktery jsou lowlevel
- kdyz je offset hodnota (treba ID), tak pouzit cursor, kdyz je to index, tak pouzit offset

## Stopping Strategy
There are three situations when generic extractor will stop scrolling if:

- the `nextPageFlag` configuration,
- the `forceStop` configuration,
- the *same result* is obtained twice.

Apart from those, each pagination method may have their own 
[stopping strategies](#combining-multiple-stopping-strategies).

The *same result* condition deals with the situation when there is no clear limit to 
stop the scrolling. Generic extractor will keep requesting higher and higher pages from the API.
Let's say that there are 150 pages of results in total. When Generic Extractor asks for page 151, different 
situations can arise:

- most common -- the API returns empty page (scrolling with 
[`pagenum`](/extend/generic-extractor/api/pagination/pagenum/) and 
[`offset`](/extend/generic-extractor/api/pagination/pagenum/) methods will stop, other methods will probably stop 
too (depends on how empty the response is)),
- less common -- the API keeps returning the last page, the extraction is stopped when a page is obtained twice -- see below.
- even less common -- the API keeps returning the first page, the extraction is stopped when a page is obtained twice -- see below.
- less common -- the API returns an error -- in this case a different stopping condition has to be used
([`nextFlag`](#next-page-flag) or [`forceStop`](#force-stop)).

If the API returns the last page and it is the same as the 
previous page, the extraction is stopped. You will see this in Generic extractor logs as a message:

    Job '1234567890' finished when last response matched the previous!

(see [Full Example](todo:041-paging-stop-same)

If the API returns the first page, it is not same as the previous page and therefore another
request is sent to `users?offset=6&limit=2`. Then the result is as the previous page and the
same check kicks in and the extraction is stopped too. However the results from the first page
will be duplicated.
(see [Full Example](todo:042-paging-stop-same-2)

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
the stopping conditions must be met. In other words, the scrolling continues until any of the
stopping conditions is true. To this you need to account specific stopping strategies for 
each scroller. For example with the following configuration:

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

The scrolling will stop if **any** of the following is true:

- an empty page is encountered (`offset` scroller specific),
- a page contains less then 10 items (`offset` scroller specific),
- a page contains the same items as the previous page,
- 20 pages were extracted (`forceStop`),
- if a field `isLast` is present in the response and is true (`nextPageFlag`).

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