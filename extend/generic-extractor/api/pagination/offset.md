---
title: Offset Scroller
permalink: /extend/generic-extractor/api/pagination/offset/
---

* TOC
{:toc}

The Offset scroller handles a pagination strategy in which the API splits the results into pages
of the same size (limit parameter) and navigates through them using the **item offset** parameter. This 
is similar to paging in SQL language. If you need to use *page offset*, use the 
[Page Number Scroller](/extend/generic-extractor/api/pagination/pagenum/).

An example configuration:

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

- `limit` (required, integer) --- Page size
- `limitParam` (optional, string) --- Name of the parameter in which the API expects the page size. The default value is `limit`.
- `offsetParam` (optional, string) --- Name of the parameter in which the API expects the item offset. The default value is `offset`.
- `firstPageParams` (optional, boolean) --- When false, the first page is retrieved without the page parameters. The default value is `true`.
- `offsetFromJob` (optional, boolean) --- When true, the offset parameter value is taken from the job parameters. The default value is `false`.

The limit value is configured by the `limit` parameter, but it may be overridden in 
the [job parameters](/extend/generic-extractor/config/jobs/#request-parameters). The offset value is computed automatically starting from 0, but it may be overridden in the job parameters if `offsetFromJob` is set to true.

**Important:** You must not set the limit parameter above the limit supported by the API. Setting the 
limit to, e.g., 1000 if the API returns 100 items at most would cause the extraction to stop after
the first page. This is because the [underflow condition](/extend/generic-extractor/api/pagination/#stopping-strategy)
would be triggered.

### Stopping Condition
Scrolling is stopped when the result contains less items than requested --- specified in the
`limit` configuration (*underflow*). This also includes an instance when no items are returned, or the 
response is empty.

Let's say that you have an API endpoint `users` which takes the parameters `limit` and `offset`. 
There are four users in total. The response looks as follows:

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

Querying `users?offset=0&limit=2` returns the first two users. Querying `users?offset=2limit` returns
the second two users. Generic Extractor will then query `users?offset=4&limit=2`. 

If the response is empty (the API returns an empty page, `[])`, the *underflow* check kicks in 
and the extraction is stopped. See a [full example](todo:043-paging-stop-underflow).

Note that the *emptiness* is evaluated on the extracted array as [auto-detected](todo) or 
specified by the [`dataField`](todo) configuration. That means that the entire response
may be non-empty. See a [full example](todo:044-paging-stop-underflow-struct).

You will also see the following warning in the logs:

    WARNING: dataField `results.users.items` contains no data!

which is expected.

All [common stopping conditions](/extend/generic-extractor/api/pagination/#stopping-strategy) apply as well.

## Examples

### Basic Scrolling
This is the simplest scrolling setup:

{% highlight json %}
"pagination": {
    "method": "offset",
    "limit": "20"
}
{% endhighlight %}

The first request is sent with the parameters `limit=20` and `offset=0`, for example, `/users?limit=20&offset=0`.
The next request has `limit=20` and `offset=20`, for example, `/users?limit=20&offset=20`.
See the [full example](todo:043-paging-stop-underflow).

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

Here the API expects the parameters `count` and `skip`. The first request will be sent with the arameters `count=100` 
and `skip=0`; for example `/users?count=2&skip=0`. See the [full example](todo:049-pagination-rename).

### Overriding Limit and Offset
It is possible to override both the limit and offset parameters of a specific API job. 
This is useful in case you want to use different limits for different API endpoints.

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
job `params`. Notice that the job `params` names must correspond to the names of the offset and 
limit parameters (`skip` and `count` in this case). The limit parameter is always overridden to 5, 
no setting is necessary. The offset parameter is overridden to 2; this requires setting `offsetFromJob`. 
Without setting `offsetFromJob` the `jobs.params.skip` value would be ignored. 
The entire endpoint configuration means that the first two items of the `users` endpoint will be skipped.

For the `orders` endpoint the `skip` (offset) parameter is not overridden, and therefore it starts at zero.
The `count` (limit) parameter is set to 10. Therefore the first request to that endpoint will be
`GET /orders?count=10&skip=0`. 

See the [full example](todo:050-pagination-override).
