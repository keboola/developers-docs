---
title: Login
permalink: /extend/generic-extractor/api/authentication/login/
---

Login authentication is used in case when you need to send a one time **login request** to obtain temporary
credentials which are then used to authenticate all the other API requests. A sample Login
authentication looks like this:

{% highlight json %}
{
    "api": {
        ...,
        "authentication": {
            "type": "login",
            "loginRequest": {
                "endpoint": "login",
                "method": "GET",
                "headers": {
                    "X-Login": "JohnDoe",
                    "X-Password": "TopSecret"
                }
            },
            "apiRequest": {
                "headers": {
                    "X-ApiToken": "authorization.token"
                }
            }
        }
    },
    "config": {
        ...
    }
}
{% endhighlight %}

## Configuration Parameters
The following configuration parameters are supported for the `login` type of authentication:

- `loginRequest` (required, object) --- An [job-like](/extend/generic-extractor/config/jobs/) object which describes the login request, it has the following properties:
    - `endpoint` (required, string) --- API Endpoint for the login request, the same rules as for the [Job `endpoint`](/extend/generic-extractor/config/jobs/#specifying-endpoint) apply here.
    - `params` (optional, object) --- An object wih key-value properties containing request parameters. Object keys are parameters names, values are transformed the [same way as in jobs](/extend/generic-extractor/config/jobs/#request-parameters).
    - `method` (optional, string) --- HTTP method to send the request, this defines how the [parameters are sent](/extend/generic-extractor/config/jobs/#request-parameters) to the API. Default value is `GET`.
    - `headers` (optional, object) --- An object with key-value properties containing HTTP headers. The names will be used as HTTP header names, and the values will be used as the value of the respective header.
- `apiRequest` (optional, object) --- An object which defines how the result of the *login request* will be used in the actual API request, contains properties:
    - `headers` (optional, object) --- An object with key-value properties containing HTTP headers. The names are header names, the values are paths in the JSON response from which the actual values are extracted.
    - `query` (optional, object) --- An object with key-value properties containing URL query parameters. The names are parameter names, the values are paths in the JSON response from which the actual values are extracted.
- `expires` (optional, mixed) --- Either an integer value specifying a fixed number of seconds after which the *login request* will be sent again (see [example](#expiration-basic)). Or an object with properties:
    - `response` (required, string) --- A path in the JSON response which contains the expiration time. It can be either:
        - a string which can be processed by the [`strtotime` function](http://php.net/manual/en/function.strtotime.php) (see [example](#expiration-from-response))
        - or a numeric [timestamp](https://en.wikipedia.org/wiki/Unix_time) (with `"relative": false`),
        - or a number of seconds for which the credentials are valid (with `"relative": true`).
    - `relative` (optional, boolean) --- When true, the expiration time is relative to the current time. Default value is `false`.

Note that the values in `apiRequest.headers` and `apiRequest.query` take precedence over the values specified in the `api.http.defaultOptions.headers` (see
[example](#parameter-overriding).

## Examples

### Configuration with Headers
Let's say you have an API which requires every API call be authorized with `X-ApiToken` header. The value of that header (an API token) is obtained
by calling `/login` endpoint with headers `X-Login` and `X-Password`. The `/login` endpoint response looks like this:

{% highlight json %}
{
	"authorization": {
		"token": "a1b2c3d435f6"
	}
}
{% endhighlight %}

The following API configuration deals with the authentication:

{% highlight json %}
"api": {
    "baseUrl": "http://example.com",
    "authentication": {
        "type": "login",
        "loginRequest": {
            "endpoint": "login",
            "method": "GET",
            "headers": {
                "X-Login": "JohnDoe",
                "X-Password": "TopSecret"
            }
        },
        "apiRequest": {
            "headers": {
                "X-ApiToken": "authorization.token"
            }
        }
    }
}
{% endhighlight %}

The first request will be sent to `/login` with the HTTP headers:

    X-Login: JohnDoe
    X-Password: TopSecret

All consecutive request will be sent to the endpoints specified in the [`jobs`](/extend/generic-extractor/config/jobs/) section and they will contain the header

    X-ApiToken: a1b2c3d435f6

See [Full Example](todo:079-login-auth-headers)


### Configuration with Query Parameters
Let's say you have an API which requires a [HTTP POST](https://en.wikipedia.org/wiki/POST_(HTTP)) request with `username` and `password` to endpoint `/login/form`.
On successful login it returns a response:

{% highlight json %}
{
	"authentication": [
		{
			"secret": "a1b2c3d435f6"
		},
		{
			"token": {
				"id": 123
			}
		}
	]
}
{% endhighlight %}

The actual API requests then must contain `secretKey` and `tokenId` parameters in the URL. The following `authentication` configuration takes care of the
situation:

{% highlight json %}
"authentication": {
    "type": "login",
    "loginRequest": {
        "endpoint": "login/form",
        "method": "FORM",
        "params": {
            "username": "JohnDoe",
            "password": "TopSecret"
        }
    },
    "apiRequest": {
        "query": {
            "secretKey": "authentication.0.secret",
            "tokenId": "authentication.1.token.id"
        }
    }
}
{% endhighlight %}

The first API request will be sent as:

    POST /login/form

    username=JohnDoe&password=TopSecret

The [FORM method](/extend/generic-extractor/config/jobs/#form) send the parameters
as [application/x-www-form-urlencoded](https://en.wikipedia.org/wiki/POST_(HTTP)#Use_for_submitting_web_forms). The `apiRequest.query` settings then
map the response values to the parameters of the other API calls, so the second API call will be sent as:

    GET /users?secretKey=a1b2c3d435f6&tokenId=123

See [Full Example](todo:080-login-auth-query)

### Parameter Overriding
The above examples show how to use query parameters and headers separately. However they can be mixed freely and they can also be
mixed with parameters and headers entered elsewhere in the configuration. The following example shows how parameters from
different places are merged together:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "http": {
                "defaultOptions": {
                    "headers": {
                        "X-Mode": "development",
                        "X-Account-Id": 123
                    },
                    "params": {
                        "debug": "1",
                        "orderBy": "default",
                        "secretKey": "123"
                    }
                }
            },
            "authentication": {
                "type": "login",
                "loginRequest": {
                    "endpoint": "login",
                    "method": "POST",
                    "params": {
                        "username": "JohnDoe",
                        "password": "TopSecret"
                    }
                },
                "apiRequest": {
                    "query": {
                        "apiToken": "authorization.token",
                        "secretKey": "authorization.secretKey",
                        "customerId": "authorization.accountId"
                    },
                    "headers": {
                        "X-SecretKey": "authorization.secretKey",
                        "X-Account-Id": "authorization.accountId"
                    }
                }
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "users",
                    "params": {
                        "orderBy": "userName",
                        "secretKey": "none",
                        "customerId": "234"
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

The above configuration sends first request as:

    POST /login

    {"username":"JohnDoe","password":"TopSecret"}

With headers:

    Content-Type: application/json

Notice that in case of the *login request* both `headers` and `params` from `api.defaultOptions` are ignored. Only the
`headers` and `params` from `api.authentication.loginRequest` are used (and encoded as JSON because of `"method": "POST"`).
The second API call will be sent as:

    GET /users?debug=1&orderBy=userName&secretKey[0]=none&secretKey[1]=a1b2c3d435f6&customerId[0]=234&customerId[1]=abc&apiToken=987654

With headers:

    X-Mode: development
    X-Account-Id: abc
    X-SecretKey: a1b2c3d435f6

The request URL contains the following query parameters:

- `debug=1` --- coming from `api.http.defaultOptions.params` option,
- `orderBy=userName` --- coming from `config.jobs.params` option, which overrides the value specified in `api.http.defaultOptions.params`,
- `secretKey[0]=none` --- coming from `config.jobs.params` option, which overrides the value specified in `api.http.defaultOptions.params`,
- `secretKey[1]=a1b2c3d435f6` --- coming from `api.authentication.apiRequest.query` option,
- `customerId[0]=234` --- coming from `config.jobs.params` option,
- `customerId[1]=abc` --- coming from `api.authentication.apiRequest.query` option,
- `apiToken=987654` --- coming from `api.authentication.apiRequest.query` option.

The request headers contain:

- `X-Mode` --- coming from `api.http.defaultOptions.headers` option,
- `X-Account-Id` --- coming from `api.authentication.apiRequest.headers` option, which overrides the values specified in `api.http.defaultOptions.headers`,
- `X-SecretKey` --- coming from `api.authentication.apiRequest.headers` option.

As you can see, the headers specified elsewhere are **overwritten** by the `api.authentication.apiRequest` while the parameters specified elsewhere
are **merged** with the `api.authentication.apiRequest`.

See [Full Example](todo:081-login-auth-headers-query-override)

### Expiration Basic
It is possible that the credentials provided by the *login request* have a time limited validity. This is handled by the `expires` option. If
the obtained credentials are always valid for example for 1 hour, you would modify the [first example](#configuration-with-headers) to this:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "login",
                "loginRequest": {
                    "endpoint": "login",
                    "method": "GET",
                    "headers": {
                        "X-Login": "JohnDoe",
                        "X-Password": "TopSecret"
                    }
                },
                "apiRequest": {
                    "headers": {
                        "X-ApiToken": "authorization.token"
                    }
                },
                "expires": "3600"
            }
        }
    }
}
{% endhighlight %}

This causes Generic Extractor to call the *login request* every hour.

See [Full Example](todo:082-login-auth-expires)

### Expiration from Response
It is possible that the credentials provided by the *login request* have a time limited validity. This is handled by the `expires` option. If
the validity of the credentials is returned in the response, you would modify the [first example](#configuration-with-headers) to this:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "login",
                "loginRequest": {
                    "endpoint": "login",
                    "method": "GET",
                    "headers": {
                        "X-Login": "JohnDoe",
                        "X-Password": "TopSecret"
                    }
                },
                "apiRequest": {
                    "headers": {
                        "X-ApiToken": "authorization.token"
                    }
                },
                "expires": {
                    "response": "authorization.expires"
                }
            }
        }
    }
}
{% endhighlight %}

This assumes, that the response of the *login request* looks like this:

{% highlight json %}
{
	"authorization": {
		"token": "a1b2c3d435f6",
		"expires": "2017-02-20 12:34:45"
	}
}
{% endhighlight %}

See [Full Example](todo:083-login-auth-expires-date)

### Expiration from Response
In case the API returns credentials validity in the *login request* and that validity is expressed in seconds, you need to use the
`expires` option together with setting `relative` to `true`. The result is the behavior of the [first example](#configuration-with-headers)
but the value is taken from the response as in the [second example](#expiration-from-response).

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "authentication": {
                "type": "login",
                "loginRequest": {
                    "endpoint": "login",
                    "method": "GET",
                    "headers": {
                        "X-Login": "JohnDoe",
                        "X-Password": "TopSecret"
                    }
                },
                "apiRequest": {
                    "headers": {
                        "X-ApiToken": "authorization.token"
                    }
                },
                "expires": {
                    "response": "authorization.expires",
                    "relative": true
                }
            }
        }
    }
}
{% endhighlight %}

This assumes, that the response of the *login request* looks like this:

{% highlight json %}
{
	"authorization": {
		"token": "a1b2c3d435f6",
		"expires": 3600
	}
}
{% endhighlight %}

See [Full Example](todo:084-login-auth-expires-seconds)
