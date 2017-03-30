---
title: Offset scroller
permalink: /extend/generic-extractor/api/pagination/offset/
---

* TOC
{:toc}

The Offset scroller handles pagination strategy in which the API splits the results into pages
of the same size (limit parameter) and navigates through them using the **item offset** parameter. This 
is similar to paging in SQL language. If you need to use *page offset*, use the 
[Page Number Scroller](/extend/generic-extractor/pagination/pagenum/).

Example of configuration:

{% highlight json %}
{
    "api": {
        "pagination": {
            "method": "offset",
            "limit": 100,
            "limitParam": "count",
            ...
        },
        ...
    }
}
{% endhighlight %}

## Configuration Parameters
The following configuration parameters are supported for the `offset` method of pagination:
- `limit` (required, integer) -- page siz;
- `limitParam` (optional, string) -- name of the parameter in which the API expects page size, default value is `limit`;
- `offsetParam` (optional, string) -- name of the parameter in which the API expects the item offset, default value is `offset`;
- `firstPageParams` (optional, boolean) -- when false, the first page will be retrieved without the page parameters, default value is `true`;
- `offsetFromJob` (optional, boolean) -- when true, the offset parameter value will be taken from job parameters, default value is `false;

The value for limit is configured by the `limit` parameter, but it may be overridden in 
[job parameters](/extend/generic-extractor/jobs/#request-parameters). The value for offset 
is taken computed automatically starting from 0, but
it may be overridden in the job parameters if `offsetFromJob` is set to true.
**Important:** you mustn't set the limit parameter above the limit supported by the API. Setting the 
limit to e.g. 1000 if the API returns 100 items at most would cause the extraction to stop after
the first page. This is because the [underflow condition](/extend/generic-extractor/api/pagination/#stopping-strategy)
would be triggered.

### Stopping Condition
Scrolling is stopped when the result contains less items than requested -- specified in the
`limit` configuration (*underflow*). This also includes when no items are returned or the 
response is empty.

Let's say that you have an API endpoint `users` which takes parameters `limit` and `offset`. 
There are four users in total. The response looks as this:

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
the second two users. Then generic extractor will then query `users?offset=4&limit=2`. 

If the response is empty (the API returns an empty page) -- i.e. `[]` the *underflow* check kicks in 
and the extraction is stopped. See [Full Example](todo:043-paging-stop-underflow)

Note that the *emptiness* is evaluated on the extracted array as [autodected](todo) or 
specified by the [`dataField`](todo) configuration. That means that the entire response
may be non-empty (see [Full Example](todo:044-paging-stop-underflow-struct).
Also, you'll see a warning in the logs

    WARNING: dataField `results.users.items` contains no data!

Which is expected.

[Common stopping conditions](/extend/generic-extractor/api/pagination/#stopping-strategy) also apply.

## Examples

### Basic Scrolling
The most simple scrolling setup is the following:

{% highlight json %}
"pagination": {
    "method": "offset",
    "limit": "20"
}
{% endhighlight %}

The first request is sent with parameters `limit=20` and `offset=0` e.g. `/users?limit=20&offset=0`.
The next request will have `limit=20` and `offset=20` e.g. `/users?limit=20&offset=20`.
See [Full Example](todo:043-paging-stop-underflow)

### Renaming Parameters
The `limitParam` and `offsetParam` configuration options allow you to rename the limit and 
offset for the needs of a specific API:

{% highlight json %}
"pagination": {
    "method": "offset",
    "limitParam": "count",
    "offsetParam": "skip",
    "limit": "100"
}
{% endhighlight %}

In the above example the API expects parameters `count` and `skip`. With the above configuration,
the first request will be sent with parameters `count=100` and `skip=0` -- e.g. `/users?count=2&skip=0`.
See [Full Example](todo:049-pagination-rename)

### Overriding Limit and Offset
It is possible to override both limit and offset parameters in parameters of a 
specific API job. This is useful in case you want to use different limits for different
API endpoints.

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "offset",
                "limitParam": "count",
                "offsetParam": "skip",
                "offsetFromJob": true,
                "limit": "20"
            }
        },
        "config": {
            "jobs": [
                {
                    "endpoint": "users",
                    "dataField": "items",
                    "params": {
                        "count": 2,
                        "skip": 2
                    }
                },
                {
                    "endpoint": "orders",
                    "dataField": "items",
                    "params": {
                        "count": 10
                    }
                }
            ]            
        }
    }
}
{% endhighlight %}

In the above configuration, the first API request to the `users` endpoint will be
`GET /users?count=2&skip=2`. This is because the values `count=2` and `skip=2` are taken from the 
job `params`. Notice that the job params names must correspond to the names of the offset and 
limit parameters (`skip` and `count` in this case). The limit parameter is overridden to 5 
(this is done always, no setting is necessary). The offset parameter is overridden to 2
(this requires setting `offsetFromJob`). Without setting `offsetFromJob` the `jobs.params.skip` value 
would be ignored. 
The entire endpoint configuration means that the first two items of the `users` endpoint will be skipped.

For the `orders` endpoint the `skip` (offset) parameter is not overridden, therefore it starts at zero.
The `count` (limit) parameter is set to 10. Therefore the first request to that endpoint will be
`GET /orders?count=10&skip=0`. 

See [Full Example](todo:050-pagination-override)
