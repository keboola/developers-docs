---
title: Authentication
permalink: /extend/generic-extractor/api/authentication/
---

Unless the API you want to extract from is completely public, you need some 
authentication and possibly authorization method. There are many available
authentication methods. Generic Extractor supports:

- [URL query](/extend/generic-extactor/api/authentication/query/) based authentication,
- [basic HTTP](/extend/generic-extractor/api/authentication/basic/) authentication,
- [form login](/extend/generic-extractor/api/authentication/login) (using POST request) authentication,
- [OAuth 1.0](/extend/generic-extractor/api/authentication/oauth1) authentication,
- [OAuth 2.0](/extend/generic-extractor/api/authentication/oauth2) authentication.

Example authentication configuration looks like this: 

{% highlight json %}
{
    "api": {
        "authentication": {
            "type": "url.query",
            "query": {
                "apiKey": "2267709"
            }
        }
    },
    "config": {
        ...
    }
}
{% endhighlight %}

## Authentication
Authenticate using one of supported methods

sifrovani
pouzit authentication misto parametru v jobu

## OAuth
See the [OAuth](/extend/generic-extractor/authentication/oauth/) section for information on setting up OAuth APIs using the generic extractor

