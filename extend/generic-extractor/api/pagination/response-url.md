---
title: Response URL Scroller
permalink: /extend/generic-extractor/api/pagination/response-url/
---

The Response URL Scroller can be used with an API which provides the URL of the 
next page in the response. This scroller is suitable for APIs supporting the 
[JSON API specification](http://jsonapi.org/format/#fetching-pagination).

{% highlight json %}
{
    "api": {
        "pagination": {
            "method": "response.url",
            "urlKey": "links.next"
        },
        ...
    }
}
{% endhighlight %}

## Configuration Parameters
The following configuration parameters are supported for the `response.url` method of pagination:

- `urlKey` (optional, string) -- path in the response to the field which contains URL of the next request. Default value is `next_page`.
- `paramIsQuery` (optional, boolean) -- when true, the URL is assumed to be only 
[query string](/extend/generic-extractor/tutorial/rest/#url) parameters. When false a URL with path is assumed. Default value is `false`.
- `includeParams` (optional, boolean) -- when true, the [job parameters](/extend/generic-extractor/jobs/#request-parameters) are added to the provided URL. Default value is `false`.

If `includeParams` is true, then the [job parameters](/extend/generic-extractor/jobs/#request-parameters) are merged into
the parameters of the URL in the response. If `paramIsQuery` is false, then the parameters in the response **are overridden**
by the parameters in the job. If `paramIsQuery` is true, then the parameters in the response
**override** the parameters in the job. See [examples below](todo).

### Stopping Condition
The pagination ends when the value of `urlKey` parameters is empty -- the key is not present at all, is null,
is an empty string or is `false`. Take care when configuring the `urlKey` parameter. If you e.g. misspell the
name of the key, the extraction will not go beyond the first page.
[Common stopping conditions](/extend/generic-extractor/api/pagination/#stopping-strategy) also apply.

## Examples

### Basic Configuration
To configure pagination for an API which supports the [JSON API specification](http://jsonapi.org/format/#fetching-pagination),
all you need to do is the configuration below:

{% highlight json %}
"pagination": {
    "method": "response.url",
    "urlKey": "links.next"
}
{% endhighlight %}

The configuration expects that a response contains a `links.next` field with the URL of the next page, e.g.:

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
    ],
    "links": {
        "next": "/users?page=2"
    }
}
{% endhighlight %}

The URL maybe either *absolute link* (`http://example.com/users?page=2`) or *absolute path* (`/users?page=2`). 
If the the URL is *relative* (`users?page=2`) it is appended to the endpoint URL.

See [Full Example](todo:054-pagination-response-url-basic)

### Merging Parameters
If you need to pass additional parameters to each of the page URLs, you need to use the `includeParams` parameter.

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "response.url",
                "urlKey": "links.next",
                "includeParams": true
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataField": "items",
                    "params": {
                        "account": 123
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

Sample response:

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
    ],
    "links": {
        "next": "/users?page=2"
    }
}
{% endhighlight %}

In the above configuration, the `account` parameter is sent with every API request. If it weren't for the
`includeParams` option, it would be sent **only with the first request**. Note that adding 
a `jobs.params.page` parameter would overwrite the `page` parameter in the response URL and thus 
would probably break the paging.

See [Full Example](todo:055-pagination-response-url-params)

### Overriding Parameters
Sometimes the API does not pass the entire URL, but only the [query string](/extend/generic-extractor/tutorial/rest/#url)
parameters which should be used for querying the next page.

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
    ],
    "links": {
        "next": "?page=2"
    }
 }
{% endhighlight %}

You must then use the `paramsIsQuery` configuration, so that the Generic Extractor can produce a 
valid URL.

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://mock-server:80/056-pagination-response-url-params-override/",
            "pagination": {
                "method": "response.url",
                "urlKey": "links.next",
                "paramIsQuery": true,
                "includeParams": true
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataField": "items",
                    "params": {
                        "account": 123,
                        "page": "start"
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

Also notice that with the above 
configuration the `page` parameter specified in the job is used only for the first page, because it 
is overridden by the `page` parameter given in the response. That is -- the first request is sent to
`/users?account=123&page=start` the second request is sent to `/users?account=123&page=2`.
