---
title: Query Authentication
permalink: /extend/generic-extractor/configuration/api/authentication/query/
---

Query Authentication provides the simplest authentication method, in which
the credentials are sent in the [request URL](/extend/generic-extractor/tutorial/rest#url).
This is most often used with APIs which are authenticated using API tokens and
signatures. Dynamic values of query parameters can be generated using 
[user functions](/extend/generic-extractor/functions/). 

A sample Query authentication configuration looks like this:

{% highlight json %}
{
    "api": {
        ...,
        "authentication": {
            "type": "query",
            "query": {
                "apikey": "2267709"
            }
        }
    }
}
{% endhighlight %}

## Configuration Parameters
The following configuration parameters are supported for the `query` type of authentication:

- `query` (required, object) --- an object whose properties represent key-value pairs of the URL query

## Basic Configuration Example
Let's say you have an API which requires an `api-token` parameter (with value 2267709) to be sent with
each request. The following authentication configuration does exactly that:

{% highlight json %}
"authentication": {
    "type": "query",
    "query": {
        "api-token": "2267709"
    }
}
{% endhighlight %}

For this use case, it is also possible to use the [`defaultOptions` setting](/extend/generic-extractor/configuration/api/#default-parameters).
However, we recommend using the `authentication` setting for credentials so that the Generic Extractor
configuration does not become a complete mess.

See [example [EX077]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/077-query-auth).
