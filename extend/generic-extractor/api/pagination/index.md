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
and the extraction is stopped. 

    TODO - je na to nejakej message? 

(see [Full Example](todo:043-paging-stop-underflow)
Note that the *emptiness* is evaluated on the extracted array as [autodected](todo) or 
specified by the [`dataField`](todo) configuration. That means that the entire response
may be non-empty (see [Full Example](todo:044-paging-stop-underflow-struct).

If the API returns the last page, it is the same as the previous page and the second check kicks in
and the extraction is stopped too. 
You will see
this in Generic extractor logs as a message

    Same result obtained twice TODO

(see [Full Example](todo:042-paging-stop-same-2)

If the API returns the first page (uncommon), it is not same as the previous page and therefore another
request is sent to `users?offset=6&limit=2`. Then the result is as the previous page and the
second check kicks in and the extraction is stopped too.
(see [Full Example](todo:042-paging-stop-same-2)

TODO: co z toho plati univerzalne a co jen pro offset?

### Next Page Flag
The above describes automatic behavior of Generic Extractor regarding scrolling stopping. 
Using *Next Page Flag* allows you to do a manual setup of the stopping strategy. Using
*Next Page Flag* means that Generic Extractor analyzes the response and looks for a
particular field (the flag) and decides whether to continue scrolling based on the 
value (or presence) of that flag.

Next page flag is configured using three options:

- `field` -- path to a field containing [boolean](todo) value,
- `stopOn` -- stop scrolling on `true` or `false`
- `ifNotSet` -- if the field does not exist in the response, consider its value either `true` or `false`.

For example:

{% highlight json %}
"pagination": {
    "nextPageFlag": {
        "field": "results.hasMore",
        "stopOn": false,
        "ifNotSet": false
    },
    ...
}
{% endhighlight %}

means that the scrolling will **continue** till the field `results.hasMore` is present in the response and true.
(see [Full Example](todo:045-next-page-flag-has-more).

The configuration:

{% highlight json %}
"pagination": {
    "nextPageFlag": {
        "field": "results.hasMore",
        "stopOn": false,
        "ifNotSet": true
    },
    ...
}
{% endhighlight %}

means that the scrolling will **continue** until the field `results.hasMore` is false.
(see [Full Example](todo:046-next-page-flag-has-more-2)

On the other hand, the configuration:

{% highlight json %}
"pagination": {
    "nextPageFlag": {
        "field": "results.isLast",
        "stopOn": true,
        "ifNotSet": false
    },
    ...
}
{% endhighlight %}

will **stop** scrolling when the field `result.isLast` is present in the response and true.

- stejnej vysledek
- nextPageFlag (je to v json schema? - co jsem tim kurva myslel)
- min vysledku nez pozadovano (applies to offset)
 
## Common scrolling parameters
Parameters used by all scroller methods

### nextPageFlag

Looks within responses to find a boolean field determining whether to continue scrolling or not.

## Usage:

### Configuration

- **field**: Path in the response to a boolean property that indicates whether to continue or not
- **stopOn**: Whether the pagination should be stopped on `true` or `false`
- **ifNotSet**:(optional) Whether to assume `true` or `false` if the `field` doesn't exist in the response. If not set, the scrolling stops when the value is not present

### Example

Configuration:

    {
        "pagination": {
            "nextPageFlag": {
                "field": "hasMore",
                "stopOn": false,
                "ifNotSet": false
            },
            "type": "..."
        }
    }

Response:

    {
        "results": [...],
        "hasMore": true
    }
