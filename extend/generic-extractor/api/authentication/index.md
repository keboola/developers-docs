---
title: Authentication
permalink: /extend/generic-extractor/api/authentication/
---

Unless the API you want to extract from is completely public, you need an authentication and possibly also an authorization method. 
There are many authentication methods available. Generic Extractor supports the following ones:

- [URL Query](/extend/generic-extractor/api/authentication/query/) authentication --- sends credentials in the URL of each API request
- [Basic HTTP](/extend/generic-extractor/api/authentication/basic/) authentication --- sends credentials in the `Authorization` header of each API request
- [Login](/extend/generic-extractor/api/authentication/login) authentication --- obtains temporary credentials (token) by logging in, 
and then sends them in the URL or headers of each API request
- [OAuth 1.0](/extend/generic-extractor/api/authentication/oauth10/) authentication --- authenticates with [OAuth 1.0 scheme](#oauth) 
- [OAuth 2.0](/extend/generic-extractor/api/authentication/oauth20/) authentication --- authenticates with [OAuth 2.0 scheme](#oauth) 
- [OAuth 2.0 Login](/extend/generic-extractor/api/authentication/oauth20/) authentication --- crossover between [OAuth 2.0](/extend/generic-extractor/api/authentication/oauth20/) and [Login](/extend/generic-extractor/api/authentication/login/) authentication.

Use the authentication method supported by the target API. If the API supports multiple 
authorization methods, the [URL Query](/extend/generic-extractor/api/authentication/query/) and
[Basic HTTP](/extend/generic-extractor/api/authentication/basic/) methods are the easiest to set up; but they
are also the least secure.

An example authentication configuration looks like this: 

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

## OAuth
Generic Extractor also supports authentication using the [OAuth](https://en.wikipedia.org/wiki/OAuth) standard.
Due to the nature of OAuth, this is authentication method is supported only for [registered components](todo).
The OAuth protocol defines a scheme in which credentials are exchanged between a:

- consumer (Generic Extractor)
- service provider (the API itself)
- end-user (the person authenticating against the API)

The OAuth specification defines what kind of information is exchanged in which steps. It is not a precise
specification and leaves quite some freedom to the implementation. Also there are two versions of 
OAuth -- 1.0 and 2.0. They are completely incompatible (both the authentication steps and the exchanged fields differ).
Both [OAuth 1.0](/extend/generic-extractor/api/authentication/oauth10/)
and  [OAuth 2.0](/extend/generic-extractor/api/authentication/oauth20/)
are supported by Generic Extractor. If you are developing a new component using Generic Extractor
[templates](todo) and you want to use and test OAuth authentication, you can 
[inject the necessary credentials](/extend/common-interface/oauth/#credentials-injection) simply by passing them
in `authorization` property of the configuration.
