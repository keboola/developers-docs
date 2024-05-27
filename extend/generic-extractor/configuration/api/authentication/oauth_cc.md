---
title: oAuth 2.0 Client Credentials Authentication
permalink: /extend/generic-extractor/configuration/api/authentication/oauth_cc/
---

oAuth 2.0 Client Credentials authentication performs tha [oAuth 2.0 client_credentials flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow)

This method is available through UI and is implemented via the [Login](/extend/generic-extractor/configuration/api/authentication/login/) method

{: .image-popup}
![img.png](/extend/generic-extractor/configuration/api/authentication/oauth_cc.png)

### Configuration parameters

- `Login Request type`
  - `Basic Auth` - the client_id and client_secret are sent in the Authorization header as a Basic authorization, e.g. `Authorization: Basic base64(client_id:client_secret)`
  - `Post Form` - the client_id and client_secret are sent as form data in the POST request body. e.g. `{login_url}?client_id=client_id&client_secret=client_secret`
- `Client ID` - the client_id value
- `Client Secret` - the client_secret value
- `Access Token URL` - the URL where the access token is requested. e.g. `https://login-demo.io/oauth/v2/oauth-token`
- `Scope` - the scope of the access token. This is specific per API and can be left empty

### JSON

In the underlying JSON the method is implemented as follows:

Place your secret into the `config.#__CLIENT_SECRET` and ID into the `config.#__CLIENT_ID` parameter. The `Authorization` header is then constructed using the `concat` function.

**Basic Auth**

{% highlight json %}
{
    "api": {
      ...,
      "authentication": {
        "type": "login",
        "format": "json",
        "loginRequest": {
          "endpoint": "https://login-demo.io/oauth/v2/oauth-token",
          "method": "FORM",
          "headers": {
            "Accept": "application/json",
            "Authorization": {
              "function": "concat",
              "args": [
                "Basic ",
                {
                  "function": "base64_encode",
                  "args": [
                    {
                      "function": "concat",
                      "args": [
                        {
                          "attr": "__CLIENT_ID"
                        },
                        ":",
                        {
                          "attr": "#__CLIENT_SECRET"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          },
          "params": {
            "grant_type": "client_credentials",
            "scope": "read"
          }
        },
        "apiRequest": {
          "headers": {
            "Authorization": {
              "function": "concat",
              "args": [
                "Bearer ",
                {
                  "response": "access_token"
                }
              ]
            }
          }
        }
      }
  },
    "config": {
       "__CLIENT_ID": "CLIENT ID"
       "#__CLIENT_SECRET": "secret",
       "jobs": [...]
    }
}
{% endhighlight %}



**Post Form**

{% highlight json %}
{
    "api": {
    ...,
    "authentication": {
      "type": "login",
      "format": "json",
      "loginRequest": {
        "endpoint": "https://login-demo.io/oauth/v2/oauth-token",
        "method": "FORM",
        "headers": {
          "Accept": "application/json"
        },
        "params": {
          "grant_type": "client_credentials",
          "scope": "read",
          "client_id": {
            "attr": "__CLIENT_ID"
          },
          "client_secret": {
            "attr": "#__CLIENT_SECRET"
          }
        }
      },
      "apiRequest": {
        "headers": {
          "Authorization": {
            "function": "concat",
            "args": [
              "Bearer ",
              {
                "response": "access_token"
              }
            ]
          }
        }
      }
    }
  },
    "config": {
       "__CLIENT_ID": "CLIENT ID"
       "#__CLIENT_SECRET": "secret",
       "jobs": [...]
    }
}
{% endhighlight %}

