---
title: Page Number Scroller
permalink: /extend/generic-extractor/api/pagination/pagenum/
---

The Offset scroller handles pagination strategy in which the API splits the results into pages
of the same size (limit parameter) and navigates through them using the **item offset** parameter. 
If you need to use the *item offset*, use the [Offset Scroller](/extend/generic-extractor/pagination/offset/).

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
The following configuration parameters are supported for the `pagenum` type of pagination:

- `limit` (optional, integer) -- page size
- `limitParam`(optional, string) -- name of the parameter in which the API expects page size, default value is `limit`;
- `pageParam` (optional, string) -- name of the parameter in which the API expects the page number, default value is `page`;
- `firstPageParams` (optional, boolean) -- when false, the first page will be retrieved without the page parameters, default value is `true`;
- `firstPage` (optional, integer) -- index of the first page, default value is `1`.

The `limit` parameter has no default value. This means that if you omit it, it is not possible to 
use the [*underflow* stopping condition](/extend/generic-extractor/api/pagination/#stopping-strategy).

## Examples

### Basic Scrolling
The most simple scrolling setup is the following:

{% highlight json %}
"pagination": {
    "method": "pagenum"
}
{% endhighlight %}

The first request is sent with parameter `page=1` e.g. `/users?page=1`.
The next request will have `page=2` e.g. `/users?page=2`.
See [Full Example](todo:051-pagination-pagenum-basic)

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

In the above example the API expects parameters `count` and `set`. With the above configuration,
the first request will be sent with parameters `count=20` and `page=1` -- e.g. `/users?set=1&count=2`.
See [Full Example](todo:052-pagination-pagenum-rename). **Important:** without setting a value for the `limit`
option, the `limitParam` will not be sent at all (no matter how you name it).

### Overriding Parameters
It is possible to override the limit parameter in parameters of a 
specific API job. This is useful in case you want to use different limits for different
API endpoints.

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

In the above configuration, the first request will be sent to `/users?count=2`. This is because the 
`limit` parameter was renamed to `count`. Then the default value of count was overridden for the 
`users` API endpoint in `jobs.params.count`. The `firstPageParams` is set to false, which means that
the page parameter (named `count`) is **not** sent in the first request. The second API 
request will be sent to `/users?count=2&set=1`. Because the `firstPage` option was set to `0`, the 
second page has index `1`.

See [Full Example](todo:053-pagination-pagenum-override)
