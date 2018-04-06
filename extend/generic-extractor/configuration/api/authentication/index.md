---
title: Authentication
permalink: /extend/generic-extractor/configuration/api/authentication/
---

*To configure your first Generic Extractor, follow our [tutorial](/extend/generic-extractor/tutorial/).*
*Use [Parameter Map](/extend/generic-extractor/map/) to help you navigate among various
configuration options.*

Unless the API you want to extract from is completely public, you need an authentication and possibly also an authorization method.
There are many authentication methods available. Generic Extractor supports the following ones:

- [URL Query](/extend/generic-extractor/configuration/api/authentication/query/) authentication --- sends credentials in the URL of each API request.
- [Basic HTTP](/extend/generic-extractor/configuration/api/authentication/basic/) authentication --- sends credentials in the `Authorization` header of each API request.
- [Login](/extend/generic-extractor/configuration/api/authentication/login/) authentication --- obtains temporary credentials (token) by logging in,
and then sends them in the URL or headers of each API request.
- [OAuth 1.0](/extend/generic-extractor/configuration/api/authentication/oauth10/) authentication --- authenticates with [OAuth 1.0 scheme](#oauth).
- [OAuth 2.0](/extend/generic-extractor/configuration/api/authentication/oauth20/) authentication --- authenticates with [OAuth 2.0 scheme](#oauth).
- [OAuth 2.0 Login](/extend/generic-extractor/configuration/api/authentication/oauth20-login/) authentication ---
crossover between the [OAuth 2.0](/extend/generic-extractor/configuration/api/authentication/oauth20/) and
[Login](/extend/generic-extractor/configuration/api/authentication/login/) authentication.

Use the authentication method supported by the target API. If the API supports multiple
authentication methods, the [URL Query](/extend/generic-extractor/configuration/api/authentication/query/) and
[Basic HTTP](/extend/generic-extractor/configuration/api/authentication/basic/) methods are the easiest to set up; but they
are also the least secure.

An example authentication configuration looks like this:

{% highlight json %}
{
    "api": {
        "authentication": {
            "type": "query",
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
Due to the principles of OAuth, this authentication method is supported only for [published components](/extend/generic-extractor/publish/).
The OAuth protocol defines a scheme in which credentials are exchanged between the following:

- Consumer (Generic Extractor)
- Service provider (the API itself)
- End-user (the person authenticating against the API)

The OAuth specification defines what kind of information is exchanged in which steps. It is not a precise
specification and leaves quite some freedom to the implementation. Also, there are two versions of
OAuth --- 1.0 and 2.0. They are completely incompatible (both the authentication steps and the exchanged fields differ).
Both [OAuth 1.0](/extend/generic-extractor/configuration/api/authentication/oauth10/)
and  [OAuth 2.0](/extend/generic-extractor/configuration/api/authentication/oauth20/)
are supported by Generic Extractor. If you are developing a new component using Generic Extractor
[templates](/extend/generic-extractor/publish/#submission) and want to use and test OAuth authentication,
[inject the necessary credentials](/extend/common-interface/oauth/#credentials-injection) simply by passing them
in the `authorization` property of the configuration.
