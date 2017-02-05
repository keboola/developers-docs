---
title: OAuth 2.0 Authentication (under construction)
permalink: /extend/generic-extractor/authentication/oauth/20/
---

Uses [User functions](/extend/generic-extractor/user-functions/) to use tokens in headers or query. Instead of `attr` or `time` parameters, you should use `authorization` to access the OAuth data. If the data is a raw token string, use `authorization: data` to access it. If it's a JSON string, use `authentication.format: json` and access its values isong the `.` annotation, like in example below (`authorization: data.access_token`).

The **query** and **request** information can also be used just like in the `querry` authentication method.

- **authentication.type**: `oauth20`

### Data available in user functions

#### Authorization object
- Access using `{"authorization": "key"}`

- **data**
    - Either a plaintext string or an object if `authentication.format` is set to `json`
    - If `data` is an object, access its nodes using `data.key`, eg: `data.access_token` (see MAC example)
- **clientId**
    - Client ID of the registered OAuth application (`appKey` in the OAuth data in `authorization` object supplied by KBC's Docker)
- **nonce**
    - Randomly generated string
- **timestamp**
    - Current Unix timestamp at the time of the request

#### Request object
{% comment %}
TODO create own section for this & query for methods using Signature
{% endcomment %}
- Access using `{"request": "key"}`

- **url**
    - Full URL of the request
    - Example: `http://example.com/resource?param=value`
- **path**
    - Example: `/resource`
- **queryString**
    - Example: `param=value`
- **method**
    - Example: `GET`
- **hostname**
    - Example: `example.com`
- **port**
    - Example: `8080`
- **resource**
    - Example: `/resource?k=v`

#### Query object
- Access using `{"query": "queryParameter"}`

- Example query string: `?search=keboola&since=2015-01-05

- **search**
    - `{"query": "search"}` will contain `keboola`
- **since**
    - `{"query": "since"}` will contain `2015-01-05`

### Example config for **Bearer** token use:
- Note there **must** be `appKey` and `#appSecret` in the authorization data, even if it is not used anywhere in the config

{% highlight json %}
{
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "{\"status\": \"ok\",\"access_token\": \"testToken\"}",
                "appKey": "clId",
                "#appSecret": "clScrt"
            }
        }
    },
    "parameters": {
        "api": {
            "authentication": {
                "type": "oauth20",
                "format": "json",
                "headers": {
                    "Authorization": {
                        "function": "concat",
                        "args": [
                            "Bearer ",
                            {
                                "authorization": "data.access_token"
                            }
                        ]
                    }
                }
            }
        }
    }
}
{% endhighlight %}

### Example for **MAC** authentication:
- Assumes the user token is in the OAuth data JSON in `access_token` key, and MAC secret is in the same JSON in `mac_secret` key.


{% highlight json %}
{
    "authorization": {
        "oauth_api": {
            "credentials": {
                "#data": "{\"status\": \"ok\",\"access_token\": \"testToken\", \"mac_secret\": \"iAreSoSecret123\"}",
                "appKey": "clId",
                "#appSecret": "clScrt"
            }
        }
    },
    "parameters": {
        "api": {
            "baseUrl": "http://private-53977-extractormock.apiary-mock.com/",
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
        }
    }
}
{% endhighlight %}
