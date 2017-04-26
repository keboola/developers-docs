---
title: Page Number Scroller
permalink: /extend/generic-extractor/api/pagination/pagenum/
---

* TOC
{:toc}

The Offset scroller handles a pagination strategy in which the API splits the results into pages
of the same size (limit parameter) and navigates through them using the **item offset** parameter. 
If you need to use the *item offset*, use the [Offset Scroller](/extend/generic-extractor/api/pagination/offset/).

{% highlight json %}
{
    "api": {
        "pagination": {
            "method": "pagenum",
            "limit": 100,
            "limitParam": "count",
            ...
        },
        ...
    }
}
{% endhighlight %}

## Configuration Parameters
The following configuration parameters are supported for the `pagenum` method of pagination:

- `limit` (optional, integer) --- Page size
- `limitParam`(optional, string) --- Name of the parameter in which the API expects the page size. The default value is `limit`.
- `pageParam` (optional, string) --- Name of the parameter in which the API expects the page number. The default value is `page`.
- `firstPageParams` (optional, boolean) --- When false, the first page will be retrieved without the page parameters. The default value is `true`.
- `firstPage` (optional, integer) --- Index of the first page. The default value is `1`.

### Stopping Condition
The `pagenum` scroller uses similar stopping condition as the [`offset` scroller](/extend/generic-extractor/api/pagination/offset/#stopping-condition). 
That is to say that the extraction is stopped in case of underflow --- when the API returns less items then requested 
(including zero). However, in the `pagenum` scroller, the `limit` parameter is not required and has no 
default value. This means that if you omit it, the scrolling will stop only if an empty page is encountered.

## Examples

### Basic Scrolling
The most simple scrolling setup is the following:

{% highlight json %}
"pagination": {
    "method": "pagenum"
}
{% endhighlight %}

The first request is sent with the parameter `page=1`, for example `/users?page=1`.
The next request will have `page=2`, for example `/users?page=2`.
See [example [051]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/051-pagination-pagenum-basic).

### Renaming Parameters
The `limitParam` and `pageParam` configuration options allow you to rename the limit and 
offset for the needs of a specific API:

{% highlight json %}
"pagination": {
    "method": "pagenum",
    "limit": 20,
    "limitParam": "count",
    "pageParam": "set"
}
{% endhighlight %}

Here the API expects the parameters `count` and `set`. The first request will be sent with the parameters `count=20` 
and `set=1`; for example, `/users?set=1&count=20`. See [example [052]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/052-pagination-pagenum-rename).

**Important:** Without setting a value for the `limit` option, the `limitParam` will not be sent at all 
(no matter how you name it).

### Overriding Parameters
It is possible to override the limit parameter of a specific API job. 
This is useful when you want to use different limits for different API endpoints.

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "pagenum",
                "limit": 200,
                "limitParam": "count",
                "pageParam": "set",
                "firstPage": 0,
                "firstPageParams": false
            }
        },
        "config": {
            "jobs": [
                {
                    "endpoint": "users",
                    "dataField": "items",
                    "params": {
                        "count": 2
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

In the above configuration, the first request is sent to `/users?count=2` because the 
`limit` parameter was renamed to `count`. Then the default value of `count` was overridden for the 
`users` API endpoint in `jobs.params.count`. The `firstPageParams` is set to false, which means that
the page parameter (named `count`) is **not** sent in the first request. The second API 
request is sent to `/users?count=2&set=1`. Because the `firstPage` option is set to `0`, the 
second page has index `1`.

See [example [058]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/058-pagination-response-param-override).
