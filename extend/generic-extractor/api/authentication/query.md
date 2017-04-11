---
title: Query Authentication
permalink: /extend/generic-extractor/authentication/api/query/
---

Query Authentication provides the simplest authentication method in which
the credentials are sent in the [request URL](/extend/generic-extractor/tutorial/rest#url).
This is most often used with APIs which are authenticated using API tokens and
signatures. Dynamic values of query parameters can be generated using 
[user functions](/extend/generic-extractor/user-functions/).

{% highlight json %}
{
    "api": {
        "authentication": {
            "type": "query",
            "query": {
                "apikey": "2267709"
            }
        },
        ...
    }
}
{% endhighlight %}

## Configuration Parameters
The following configuration parameters are supported for the `query` type of pagination:

- `query` (required, object) --- An object whose properties represent key-value pairs of the URL query.

## Examples

### Basic Configuration
Let's say that you have na API which requires that an `api-token` parameter (with value 2267709) is sent with
each request to the API. The following authentication configuration does exactly that:

{% highlight json %}
"authentication": {
    "type": "query",
    "query": {
        "api-token": "2267709"
    }
}
{% endhighlight %}

For this use case, it is also possible to use [`defaultOptions` setting](/extend/generic-extractor/api/#default-parameters).
However we recommend using the `authentication` setting for credentials so that the Generic Extractor
configuration does not become a complete mess.

See the [full example](todo:077-query-auth).
