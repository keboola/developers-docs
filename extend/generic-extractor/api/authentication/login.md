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
            "type": "login"
            TODO
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
- `expires` (optional, mixed) --- Either an integer value specifying a fixed number of seconds after which the *login request* will be sent again. Or an object with properties:
    - `response` (required, string) --- A path in the JSON response which contains the expiration time (TODO je to cas nebo pocet sekund?)
    - `relative` (optional, boolean) --- When true, the expiration time is relative to the current time. Default value is `false`.

Note that the values in `apiRequest.headers` and `apiRequest.query` take precedence over the values specified in the `api.http.defaultOptions.headers`.

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
            "header": {
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

All consecutive request will be sent to the endpoints specified in the [`jobs`](todo) section and they will contain the header

    X-ApiToken: a1b2c3d435f6

### Configuration with Query Parameters


Sign in to the service to obtain fresh credentials for accessing the API.
A **JSON** response is expected to be returned from the "login" endpoint.

## Configuration

- **authentication.type**: `login`
- **authentication.loginRequest**: Describe the request to log into the service
    - **endpoint**: `string` (required)
    - **params**: `object`
    - **method**: `string`: [`GET`&#124;`POST`&#124;`FORM`]
    - **headers**: `object`
- **authentication.apiRequest**: Defines how to use the result from login
    - **headers**: Use values from the response in request headers
        - `[$headerName => $responsePath]`
    - **query**: Use values from the response in request query
        - `[$queryParameter => $responsePath]`
- **authentication.expires** (optional):
    - If set to an integer, the login action will be performed every `n` seconds, where `n` is the value
    - If set to an object, it *must* contain `response` key with its value containing the path to expiry time in the response
        - `relative` key sets whether the expiry value is relative to current time. False by default.


## Example:

### Configuration:

{% highlight json %}
{
    "api": {
        "authentication": {
            "type": "login",
            "loginRequest": {
                "endpoint": "Security/Login",
                "headers": {
                    "Content-Type": "application/json"
                },
                "method": "POST",
                "params": {
                    "UserName": {
                        "attr": "username"
                    },
                    "PassWord": {
                        "attr": "password"
                    }
                }
            },
            "apiRequest": {
                "headers": {
                    "X-Api-Token": "Ticket"
                }
            }
        }
    },
    "config": {
        "username": "whoever",
        "password": "soSecret",
        "jobs": [
            {
                "endpoint": "reports"
            }
        ]
    }
}
{% endhighlight %}

This example will first send the following request:

```
POST Security/Login
Host: ...(baseUrl)...
Content-Type: application/json

{
    "UserName": "whoever",
    "PassWord": "soSecret"
}
```

And expect a reply such as:

```
{
    "Ticket": "12345abcde"
}
```

Then the value from `Ticket` in the JSON will be used as a `X-Api-Token` header in actual API requests:

```
GET reports
Host: ...(baseUrl)...
X-Api-Token: 12345abcde
```
