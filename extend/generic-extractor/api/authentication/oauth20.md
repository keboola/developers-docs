---
title: OAuth 2.0 Authentication
permalink: /extend/generic-extractor/api/authentication/oauth20/
---

OAuth 2.0 Authentication is one of the [two OAuth methods](/extend/generic-extractor/api/authentication/#oauth) and
is supported only for [registered components](todo). The OAuth 2.0 authentication is configured by setting
type to `oauth20`:

{% highlight json %}
{
    "api": {
        ...,
        "authentication": {
            "type": "oauth20"
        }
    },
    "config": {
        ...
    }
}
{% endhighlight %}

The OAuth 2.0 Authentication process is described by the [following diagram](http://docs.spring.io/spring-social/docs/1.0.0.M3/reference/html/serviceprovider.html):

![Diagram - OAuth 2.0 authentication](/extend/generic-extractor/api/authentication/oauth20-diagram.png)

On the diagram, the step `6` represents the end of authentication and the actual communication with 
the API (extraction of data) may begin.
The final authorization section for configuration for Generic Extractor is generated between
steps `5` and `6`. When a component is registered the steps `1` --- `6` of the process are handled by 
KBC (and end-user). 

When you want to **develop and test** a new component with OAuth authorization, you need to go through 
the steps `1` --- `6` manually. At the step `5`, you will obtain a response which needs to be put
in the `authorization.oauth_api.credentials.data` section of the configuration. The response can be 
either plaintext or a JSON. Let's you obtain a simple plaintext string:

    SomeToken1234abcd567ef

The following configuration needs to be supplied to Generic Extractor:

{% highlight json %}
{
    "parameters": {
        "api": {
            ...
        },
        "config": {
            ...
        }
    },
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "SomeToken1234abcd567ef",
                "appKey": "clientId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
{% endhighlight %}

The `authorization` fields has a single property `oauth_api` which has a single property `credentials`. This 
has three child properties:

- `#data` -- contains the response from the service provider, the response is plaintext string or a JSON string (not an object!),
- `appKey` -- contains the Client ID (use empty string if  not used by the service provider),
- `#appSecret` -- contains the Client Secret (use empty string if not used by the service provider).

Not that the properties `appKey` and `#appSecret` must exist even if not used by the API, set them
to empty strings. For more information about OAuth 2, see the [official documentation](https://oauth.net/2/)
or [see more information about KBC-OAuth integration](/extend/common-interface/oauth).

## Configuration Parameters
The following configuration parameters are supported for the `oauth20` type of authentication:

- `format` (optional, string) --- If the OAuth service provider response is JSON, use the only possible 
value -- `json`. If the response is not JSON, do not specify format at all (plaintext is assumed).
- `headers` (optional, object) --- An object whose properties represent key-value pairs of the URL query.
- `query` (optional, object) --- An object whose properties represent key-value pairs sent as HTTP headers.

At least one of `headers` or `query` options should always be specified, otherwise no authentication
will be sent with the API requests. Both fields also allow and practically require using [functions](/extend/generic-extractor/functions/) to generate an OAuth signature. Specific authentication values
are available in the [OAuth function context](/extend/generic-extractor/functions/oauth-2-0-authentication-context).

## Examples

### Bearer Authentication
The most basic OAuth authentication method is with "Bearer Token". If you have an API which supports 
this authentication method, the following configuration can be used:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "https://example.com/",
            "authentication": {
                "type": "oauth20",
                "format": "json",
                "headers": {
                    "Authorization": {
                        "function": "concat",
                        "args": [
                            "Bearer ",
                            {
                                "authorization": "data"
                            }
                        ]
                    }
                }
            }
        }
    },
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "SomeToken1234abcd567ef",
                "appKey": "clientId",
                "#appSecret": "clientSecret"
            }
        }
    }    
}
{% endhighlight %}

The response obtained from the service provider (the API) is a plaintext string `SomeToken1234abcd567ef` which
is simply a token you need to use to access other API calls. The `api.authentication.headers` section creates
the header `Authorization: Bearer SomeToken1234abcd567ef` using the 
[`concat` function](/extend/generic-extractor/functions/#concat).
See the [full example](todo:103-oauth2-bearer)

### HMAC Authentication
If you have na API which requires a [HMAC](https://en.wikipedia.org/wiki/Hash-based_message_authentication_code) 
signed token, you have to generate the correct signature using [functions](/extend/generic-extractor/functions).
The following example assumes that you obtain the following response from the API when authenticated:

{% highlight json %}
{
    "status": "ok",
    "access_token": "testToken",
    "mac_secret": "iAreSoSecret123"
}
{% endhighlight %}

The user token is represented by the `access_token` and the token secret (MAC secret) is contained in the
`mac_secret` property. The following configuration generates the MAC signed `Authorization` header:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "https://example.com/",
            "authentication": {
                "type": "oauth20",
                "format": "json",
                "headers": {
                    "Authorization": {
                        "function": "concat",
                        "args": [
                            "MAC id=\"",
                            {
                                "authorization": "data.access_token"
                            },
                            "\", ts=\"",
                            {
                                "authorization": "timestamp"
                            },
                            "\", nonce=\"",
                            {
                                "authorization": "nonce"
                            },
                            "\", mac=\"",
                            {
                                "function": "md5",
                                "args": [
                                    {
                                        "function": "hash_hmac",
                                        "args": [
                                            "sha256",
                                            {
                                                "function": "implode",
                                                "args": [
                                                    "\n",
                                                    [
                                                        {
                                                            "authorization": "timestamp"
                                                        },
                                                        {
                                                            "authorization": "nonce"
                                                        },
                                                        {
                                                            "request": "method"
                                                        },
                                                        {
                                                            "request": "resource"
                                                        },
                                                        {
                                                            "request": "hostname"
                                                        },
                                                        {
                                                            "request": "port"
                                                        },
                                                        "\n"
                                                    ]
                                                ]
                                            },
                                            {
                                                "authorization": "data.mac_secret"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataType": "users"
                }
            ]
        }
    },
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "{\"status\": \"ok\",\"access_token\": \"testToken\", \"mac_secret\": \"iAreSoSecret123\"}",
                "appKey": "clientId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
{% endhighlight %}

The above configuration generates a header like:

    Authorization: MAC id="testToken", ts="1492958193", nonce="605cce2a2f687253", mac="ae96f93def8f02770f30e858e074b2a7

The configuration looks probably rather complicated. Most of it is to generate the `mac` value in the above header. 
The first step is the [`implode` function](/extend/generic-extractor/functions/#implode), which generates a 
[Normalized request string](https://tools.ietf.org/html/draft-ietf-oauth-v2-http-mac-01#section-3.2.1). This is then
passed to the [`hash_hmac` function](/extend/generic-extractor/functions/#hash_hmac) along with the
parameters `sha256` (which specifies the hashing algorithm) and hashing key taken from `authorization` property
`data.mac_secret`. The last (topmost) step is the [`concat` function](/extend/generic-extractor/function/#concat) which
concatenates all parts of the `Authorization` header. See [full example](todo:104-oauth2-hmac).
