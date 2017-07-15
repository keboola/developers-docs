---
title: API Configuration
permalink: /extend/generic-extractor/configuration/api/
---

* TOC
{:toc}

*To configure your first Generic Extractor, follow our [tutorial](/extend/generic-extractor/tutorial/basic/).*
*Use [Parameter Map](/extend/generic-extractor/map/) to help you navigate among various
configuration options.*

The API section of Generic Extractor configuration **describes global characteristics of an API**. These include
[HTTP headers](/extend/generic-extractor/tutorial/rest/#headers), authentication and pagination methods.

A sample API configuration can look like this:

{% highlight json %}
{
    ...,
    "api": {
        "baseUrl": "https://example.com/v3.0/",
        "pagination": {
            "method": "offset",
            "offsetParam": "offset",
            "limitParam": "count"
        },
        "authentication": {
            "type": "basic"
        },
        "retryConfig": {
            "account": 3
        },
        "http": {
            "headers": {
                "Accept": "application/json"
            },
            "defaultOptions": {
                "params": {
                    "company": 123
                }
            },
            "requiredHeaders": ["X-AppKey"]
        }
    }
}
{% endhighlight %}

## Base URL
The `baseUrl` configuration **defines the URL to which the API requests should be sent**. We
recommend that the URL ends with a slash so that the `jobs.endpoint` can be set easily.
See the [`endpoint` configuration](/extend/generic-extractor/configuration/config/jobs/#endpoint) for a detailed description of
how `api.baseUrl` and `jobs.endpoint` work together.

## Pagination
Pagination (or scrolling) **describes how the API pages through a large set of results**. Because
there are many different pagination strategies, the configuration is described on a
[separate page](/extend/generic-extractor/configuration/api/pagination/).

## Authentication
Authentication (authorization) needs to be configured for any API which is not public.
Because there are many authorization methods used by different APIs, there are also many
[configuration options](/extend/generic-extractor/configuration/api/authentication/).

## Retry Configuration
By default, Generic Extractor **automatically retries failed HTTP requests** --- repeatedly, and on most errors.
This is one of the big advantages over writing your own extractor from scratch. Tweak the retry setting to optimize
the speed of an extraction or to avoid unwanted flooding of the API.

Every HTTP response contains a [Status code](/extend/generic-extractor/tutorial/rest/#http-status) and,
optionally, a Header describing the situation or further actions. Status codes 2xx (beginning with 2; e.g., 200
OK) represent success and no action is needed for them. Status codes 3xx (e.g., 301 Moved Permanently) represent
redirection and are automatically handled by Generic Extractor (the redirection is followed).

This leaves us with status codes 4xx (e.g., 404 Not Found) and 5xx (e.g., 500 Internal Server Error). The 4xx codes
represent the codes whose error is on the client side. 5xx represent errors on the server side. When
retrying, this distinction is really irrelevant because we need to use the codes that represent transient/temporary
errors. Unfortunately, there is no definitive official list of those. When it comes to communicating with
a real world API, the typical examples of transient errors are:

- Network outage/malfunction
- Target server maintenance/outage
- API throttling/rate limiting

The rate limiting behaviour is not universally agreed upon. A nice API should return a
`503 Service Unavailable` status together with a `Retry-After` HTTP header specifying number of
seconds to wait before the next request. This is, however, not supported by many APIs.
**Adjusting to the API rate limiting is the main reason for changing Retry Configuration**.

The next aspect to consider is "when to retry". Even if the error is transient, retrying
immediately (within few milliseconds) usually makes no sense because the error is probably still not gone.
There are two retry strategies:

- Either the API sends a `Retry-After` header (or its equivalent), or
- Generic Extractor uses an [exponential backoff algorithm](https://en.wikipedia.org/wiki/Exponential_backoff).

### API Retry Strategy
Per the HTTP specification, the API may send the [`Retry-After`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After)
header which should contain number of seconds to pause/sleep before the next request. Generic Extractor
supports some extensions to this. First, the *Retry Header* name may be customized. Second, the header
value may be as follows:

- Number of seconds before the next request
- [Unix timestamp](https://en.wikipedia.org/wiki/Unix_time) of the time of the next request
- String date in [RFC 1123 format](http://php.net/manual/en/class.datetime.php#datetime.constants.rfc1123) of the
time of the next request

The second and third options are often called **Rate Limit Reset** as they describe when the next successful request
can be made (i.e., the limit is reset).

### Backoff Strategy
The exponential backoff in Generic Extractor is defined as `truncate(2^(retry\_number - 1)) * 1000` seconds.
This means that the first retry (zero-based index) will be after 0 seconds (`(2^(0-1)) = 0.5`, truncated to 0).
The retry delays are the following:

|retry|1|2|3|4|5|6|7|8|9|10|11|12|
|---|---|---|---|---|---|---|---|---|---|---|---|---|
|delay|0s|1s|2s|4s|8s|16s|32s|64s|128s (~2min)|256s (~4min)|512s (~8.5min)|1024s (~17min)|

The default number of retries is **10** which means that the retries stop after
511 seconds (~8.5 minutes).

### Configuration
The default Retry configuration `retryConfig` is:

{% highlight json %}
{
    "http": {
        "retryHeader": "Retry-After",
        "codes": [500, 502, 503, 504, 408, 420, 429],
        "maxRetries": 10
    },
    "curl": {
        "codes": [28, 6, 7, 35, 52, 56]
    }
}
{% endhighlight %}

The above defined `curl.codes` cover the common network errors. You can find a full list of
supported codes in the [cURL documentation](https://curl.haxx.se/libcurl/c/libcurl-errors.html).
There is no way to set the actual backoff strategy as it is derived automatically from the
content of the HTTP header specified in `retryHeader`. Generic Extractor will fallback to the
exponential backoff strategy in case the header contents are invalid (that includes, e.g., a typo
in the header name). Make sure to check that the backoff is correct --- the times can be verified
in the [debug](/extend/generic-extractor/running/#debug-mode) messages:

    Http request failed, retrying in 1s

If the exponential backoff is used, you will see its sequence of times.
See an [example](/extend/generic-extractor/configuration/api/#retry-configuration).

## Default HTTP Options
The `http` configuration option allows you to set the default headers and parameters sent with each API call
(defined later in the [`jobs` section](/extend/generic-extractor/configuration/config/jobs/#request-parameters)).

### Headers
The `http.headers` configuration allows you to **set the default headers sent with
each API call**. The configuration is an object where names are the names of
the headers and values are their values --- for instance:

{% highlight json %}
"http": {
    "headers": {
        "Accept": "application/json",
        "Accept-Encoding": "gzip"
    }
}
{% endhighlight %}

See the full [example](/extend/generic-extractor/configuration/api/#default-headers).

### Request Parameters
The `http.defaultOptions.params` configuration allows you to **set the
[request parameters](/extend/generic-extractor/tutorial/rest/#url) to be
sent with each API request**. The same rules apply as to the
[`jobs.params`](/extend/generic-extractor/configuration/config/jobs/#request-parameters).

See an [example](/extend/generic-extractor/configuration/api/#default-headers).

### Required Headers
Similar to the `http.headers` option, the `http.requiredHeaders` option allows you to **set the HTTP header
for every API request**. The difference is that the `requiredHeaders` configuration specifies **only the header names**.
The actual values must be provided in the [`config`](/extend/generic-extractor/configuration/config/)
configuration section. This is useful in case the header values change dynamically or they are provided as part
of [template configuration](/extend/generic-extractor/registration/).

If the `api` configuration section looks like this:

{% highlight json %}
"http": {
    "requiredHeaders": ["Accept", "Accept-Encoding"]
}
{% endhighlight %}

then the header values must be provided in the `config` configuration section:
{% highlight json %}
"http": {
    "headers": {
        "Accept": "application/json",
        "Accept-Encoding": "gzip"
    }
}
{% endhighlight %}

Failing to provide the header values in the `config` section will cause an error:

    Missing required header Accept in config.http.headers!

See the full [example](/extend/generic-extractor/configuration/api/#required-headers).

## Examples

### Retry Configuration
Assume that you have an API which implements throttling in the following way: when
the number of requests is exceeded, it returns an empty response with the status code `202` and
a timestamp when a new requests can be made in the `X-RetryAfter` HTTP header.
Then create the following API configuration to make Generic Extractor handle the
situation:

{% highlight json %}
"api": {
    "baseUrl": "http://example.com/",
    "retryConfig": {
        "http": {
            "retryHeader": "X-RetryAfter",
            "codes": [500, 502, 503, 504, 408, 420, 429, 202]
        },
        "maxRetries": 3
    }
}
{% endhighlight %}

Notice that it is necessary to add the response code `202` to the existing default codes. I.e., setting
`"codes": [202]` is likely very wrong.

See [example [EX037]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/037-retry-header).

### Default Headers
Assume that you have an API which returns a JSON response only if the client sends an
`Accept: application/json` header. Additionally, if the client sends an
`Accept-Encoding: gzip` header, the HTTP transmission will be compressed (and thus faster).
The following configuration sends both headers with every API request:

{% highlight json %}
"api": {
    "baseUrl": "http://example.com/",
    "http": {
        "headers": {
            "Accept": "application/json",
            "Accept-Encoding": "gzip"
        }
    }
}
{% endhighlight %}

See [example [EX038]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/038-default-headers).

### Default Parameters
Assume that you have an API requiring all requests to contain a filter
for the account to which they belong. This is done by passing the `account=XXX` parameter.
The following configuration sends the parameter with every API request:

{% highlight json %}
"api": {
    "baseUrl": "http://example.com/",
    "http": {
        "defaultOptions": {
            "params": {
                "account": 123
            }
        }
    }
}
{% endhighlight %}

For this use case, the [query authentication](/extend/generic-extractor/configuration/api/authentication/query/)
may also be used.

See [example [EX039]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/039-default-parameters).

### Required Headers
Assume that an API requires the header `X-AppKey` to be sent with each
API request. The following API configuration can be used:

{% highlight json %}
"api": {
    "baseUrl": "http://example.com",
    "http": {
        "requiredHeaders": ["X-AppKey"]
    }
},
{% endhighlight %}

Then the actual header value must be added to the `config` section.

{% highlight json %}
"http": {
    "headers": {
        "X-AppKey": "ThisIsSecret"
    }
}
{% endhighlight %}

For this use case, the [authentication](/extend/generic-extractor/configuration/api/authentication/) may also be used.
See [example [EX040]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/040-required-headers).
