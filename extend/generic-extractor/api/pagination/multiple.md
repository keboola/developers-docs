---
title: Multiple Scroller
permalink: /extend/generic-extractor/api/pagination/multiple/
---

* TOC
{:toc}

Setting pagination method to `multiple` allows you to use multiple scrollers on a single API.
This type of pagination contains definition of all scrollers used in the entire configuration.
Each [job](/extend/generic-extractor/jobs/) is then assigned a 
[`scroller`]((/extend/generic-extractor/config/jobs/#scroller) in it's configuration.
This is useful mainly if the API has inconsistent pagination methods among various API calls. 
It may be also useful in case you need to vary parameters -- e.g. set different page sizes for
different endpoints.

{% highlight json %}
{
    "api": {
        "pagination": {
            "method": "multiple",
            "scrollers": {
                "resource_scroller": {
                    "method": "offset",
                    "limit": 100
                },
                "search_scroller": {
                    "method": "pagenum"
                }
            }
        },
        ...
    },
    ...
}
{% endhighlight %}

## Configuration
The following configuration parameters are supported for the `multiple` method of pagination:

- `scrollers` (required, object) -- An object with configuration of the scrollers (see below).
- `default` (optional, string) -- Name of a scroller used for jobs without a specified scroller. If not 
specified, then jobs with no scroller will not use any type of pagination.

The `scrollers` configuration is an object whose keys are arbitrary scroller names. The values of the 
keys are standard scroller configurations. Any of the supported 
[paging strategies](/extend/generic-extractor/api/pagination/#paging-strategy) can be used and 
multiple paging strategies can be mixed. The configurations are the same is if there was a single scroller.
The name of the scroller must be used in a specific [job `scroller` parameter](/extend/generic-extractor/jobs/#scroller).
A `default` scroller can be set (must be one of the names defined in `scrollers`). In that case, all jobs
without an assigned scroller will use the default one.

### Stopping Condition
There are no specific stopping conditions for `multiple` pagination. Each scroller acts upon its 
normal stopping conditions.

## Examples
Assume you have an API which has several endpoints (`/users`, `/orders`, `/search`, ...). Most endpoints
use offset pagination strategy (i.e. results are split into pages of same size, next page is obtained by 
setting offset to multiple of the page size). The `/search` endpoint uses page number pagination strategy
because the retrieved pages are not of equal size. The following configuration extracts from two endpoint
with different paging strategies.

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "multiple",
                "scrollers": {
                    "list_scroller": {
                        "method": "offset",
                        "limit": "2"
                    },
                    "search_scroller": {
                        "method": "pagenum"
                    }
                },
                "default": "list_scroller"
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users"
                },
                {
                    "endpoint": "search",
                    "scroller": "search_scroller"
                }
            ]
        }
    }
}
{% endhighlight %}

The `api.pagination.scrollers` defines both pagination methods: 

{% highlight json %}
"scrollers": {
    "list_scroller": {
        "method": "offset",
        "limit": "2"
    },
    "search_scroller": {
        "method": "pagenum"
    }
}
{% endhighlight %}

It is then important to actually use the scroller in the `job.scroller` configuration for endpoint `/search`. 
The endpoint `/users` has no assigned scroller, therefore it uses the default one, which is `list_scroller`.

See [Full Example](todo:062-pagination-multiple-scrollers)