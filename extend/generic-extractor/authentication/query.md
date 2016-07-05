---
title: Query Authentication
permalink: /extend/generic-extractor/authentication/query/
---

Used to generate signatures, or just insert config values into request query

## Configuration

- **authentication.type**: `query`
- **authentication.query**: An object that describes each query parameter, where each key in the object is the actual query parameter, and its value is either its value, pointer to a config value or an [user function](/extend/generic-extractor/user-functions/)

## Example:

### Configuration:

{% highlight json %}
{
    "api": {
        "authentication": {
            "type": "url.query",
            "query": {
                "apiKey": {
                    "attr": "apiKey"
                },
                "sig": {
                    "function": "md5",
                    "args": [
                        {
                            "function": "concat",
                            "args": [
                                {
                                    "attr": "apiKey"
                                },
                                {
                                    "attr": "#secret"
                                },
                                {
                                    "function": "time"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    "config": {
        "apiKey": "asdf1234",
        "#secret": "KBC::ComponentEncrypted==gvrevgrew\grewvgr\ev6\u45bu\65^|VH|^vh==",
        "jobs": []
    }
}
{% endhighlight %}

- The first item will look for the *apiKey* query parameter value in the config attribute named *apiKey*
- The second item will generate a *sig* parameter value from MD5 of merged configuration table attributes *apiKey* and *secret*, followed by current *time()* at the time of the request (time() being the PHP function)
- Allowed functions are listed below in the *User functions* section
- If you're using any config parameter by using `"attr": "parameterName"`, it has to be identical string to the one in the actual config, including eventual `#` if KBC Docker's encryption is used.

- Data available in query functions:
    - **attr**: An attribute from `config` (first level only)
    - **query**: A value from a query parameter
        - Ex.: `{ "query": "par1" }` will return `val1` if the request query contains `?par1=val1`
    - **request**: Information about the request
        - Available information:
            - `url`
            - `path`
            - `queryString`
            - `method`
            - `hostname`
            - `port`
            - `resource`

- For an example that includes request data in a function, please refer to the [OAuth 20 HMAC example part](/extend/generic-extractor/authentication/oauth/20/#example-for-mac-authentication).
