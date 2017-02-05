---
title: Login using OAuth 2.0 Authentication (under construction)
permalink: /extend/generic-extractor/authentication/oauth/20-login/
---

This authentication method is nearly identical to the [login](/extend/generic-extractor/authentication/login/) method, with the exception that instead of using `attr` to access config attributes, it gives you access to user and application tokens using the `consumer` and `user` object, as long as the user data (returned by the OAuth 2.0 API) are a valid JSON.

## Configuration:

- **authentication.type**: `oauth20.login`
- See [login](/extend/generic-extractor/authentication/login/) and the example below

## Example:

### Configuration:

{% highlight json %}
{

    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "{\"status\": \"ok\",\"access_token\": \"asdf1234\", \"refresh_token\": \"fdsa4321\"}",
                "appKey": "clId",
                "#appSecret": "clScrt"
            }
        }
    },
    "parameters": {
        "api": {
            "authentication": {
                "type":"oauth20.login",
                "loginRequest": {
                    "endpoint":"https://www.googleapis.com/oauth2/v4/token",
                    "params": {
                        "refresh_token": {
                            "user":"refresh_token"
                        },
                        "client_id": {
                            "consumer":"client_id"
                        },
                        "client_secret": {
                            "consumer":"client_secret"
                        },
                        "grant_type":"refresh_token"
                    },
                    "method":"FORM",
                    "headers": {
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                },
                "apiRequest": {
                    "query": {
                        "access_token":"access_token"
                    }
                }
            }
        }
    }
}
{% endhighlight %}

- **consumer.client_id** contains the value of `appKey`
- **consumer.client_secret** contains decrypted value of `appSecret` from the OAuth API.

This Google API example requires the JSON, that is stored in [OAuth API](docs.oauthv2.apiary.io) to contain a `refresh_token` property, such as:

{% highlight json %}
{
    "access_token": "asdf1234",
    "refresh_token": "fdsa4321"
}
{% endhighlight %}

..where the `access_token` is disregarded and one returned by the "login" is used instead.
