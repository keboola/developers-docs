---
title: Login
permalink: /extend/generic-extractor/api/authentication/login/
---

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
