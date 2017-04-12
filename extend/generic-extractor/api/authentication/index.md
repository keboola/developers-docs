---
title: Authentication
permalink: /extend/generic-extractor/api/authentication/
---

Unless the API you want to extract from is completely public, you need some 
authentication and possibly authorization method. There are many available
authentication methods. Generic Extractor supports:

- [URL Query](/extend/generic-extractor/api/authentication/query/) authentication which sends credentials in the URL of each API request.
- [Basic HTTP](/extend/generic-extractor/api/authentication/basic/) authentication which sends credentials in the `Authorization` header of each API request.
- [Login](/extend/generic-extractor/api/authentication/login) authentication which first obtains temporary credentials (token) by logging in and then sends them in the URL or headers of each API request.
- [OAuth 1.0](/extend/generic-extractor/api/authentication/oauth1) authentication,
- [OAuth 2.0](/extend/generic-extractor/api/authentication/oauth2) authentication.

You have to use the authentication method supported by the target API. If the API supports multiple 
authorization methods then the [URL Query](/extend/generic-extractor/api/authentication/query/) and
[Basic HTTP](/extend/generic-extractor/api/authentication/basic/) methods are easiest to set up but they
are also least secure.

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

