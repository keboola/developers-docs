---
title: Login using OAuth 2.0 Authentication
permalink: /extend/generic-extractor/api/authentication/oauth20-login/
---

* TOC
{:toc}

The OAuth Login method is useful when you need to send a one-time **login request** to obtain temporary credentials 
for authentication of all the other API requests. A sample OAuth Login authentication looks like this:

{% highlight json %}
{
    "api": {
        ...,
        "authentication": {
            "type": "oauth20.login",
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
The configuration parameters are identical to the [Login](/extend/generic-extractor/api/authentication/login/) method.
The difference however is in the [function context](/extend/generic-extractor/functions/oauth-2-0-login-authentication-context).
The **login request** is assumed to require OAuth2 authorization and its response must be in JSON format (plaintext is not supported).

## Examples

### Basic Configuration
The following configuration shows how to set up a OAuth *login request*:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://mock-server:80/105-oauth2-login/",
            "authentication": {
                "type": "oauth20.login",
                "loginRequest": {
                    "endpoint": "token",
                    "headers": {
                        "X-Refresh-Token": {
                            "user": "refresh_token"
                        },
                        "X-App-Key": {
                            "consumer": "client_id"
                        }
                    }
                },
                "apiRequest": {
                    "headers": {
                        "X-Access-Token": "credentials.access_token"
                    }
                }
            }
        },
        "config": {
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
                "#data": "{\"status\": \"ok\",\"refresh_token\": \"1234abcd5678efgh\"}",
                "appKey": "someId",
                "#appSecret": "clientSecret"
            }
        }
    }
}
{% endhighlight %}

First an OAuth login is negotiated. The result of this authentication is response from the API (inserted into `authorization.oauth_api.credentials.#data` property): 

{% highlight json %}
{
    "status": "ok",
    "refresh_token": "1234abcd5678efgh"
}
{% endhighlight %}

This is sent to the `/token` endpoint with the following headers:

    X-Refresh-Token: 1234abcd5678efgh
    X-App-Key: someId

This API call then returns the following response:

{% highlight json %}
{
	"credentials": {
		"validUntil": "2017-10-04 12:45:09",
		"access_token": "mkoijn098uhbygv"
	}
}
{% endhighlight %}

From that, the value of `credentials.access_token` property is taken and inserted into `X-Access-Token` header
and sent to other API requests (`/users`).
