---
title: OAuth2 Interface Specification
permalink: /extend/common-interface/oauth/
---

[OAuth API V2](https://github.com/keboola/oauth-v2-bundle) integration provides a safe way to retrieve stored authorizations.

When you are building an application that communicates with a 3rd party API and that API authorizes using OAuth,
Keboola Connection stores the users' credentials/access tokens in OAuth API V2; they are revealed and
decrypted only for a target component and project. End-users can be assured that their authorized access will not leak.

This feature is available only for [registered extensions](/extend/registration/).

## Initialize
Create a configuration for the given component and project in OAuth API V2.
The `OAUTH_API_ID` is the id provided when storing authorization via OAuth API V2.

{% highlight json %}
{

    "storage": { ... },
    "parameters": { ... },
    "authorization": {
        "oauth_api": {
            "id": "{OAUTH_API_ID}"
        }
    }
}
{% endhighlight %}

## Authorize
[Docker Runner](/overview/docker-bundle/) then retrieves, decrypts and injects the credentials to the
configuration file in the `authorization.oauth_api.credentials` attribute.

{% highlight json %}
{
    "storage": { ... },
    "parameters": { ... },
    "authorization": {
        "oauth_api": {
            "id": "{OAUTH_API_ID}",
            "credentials": {
                "id": "main",
                "authorizedFor": "Myself",
                "creator": {
                    "id": "1234",
                    "description": "me@keboola.com"
                },
                "created": "2016-01-31 00:13:30",
                "oauthVersion": "2.0",
                "appKey": "w51u7j30oghe412",
                "#data": "KBC::Encrypted==ENCODEDSTRING==",
                "#appSecret": "KBC::Encrypted==ENCODEDSTRING=="
            }
        }
    }
}
{% endhighlight %}

The `authorization.oauth_api.credentials.#data` configuration node stores the response from
the authorized API as a raw string. You need to parse the string accordingly as OAuth API V2 has intentionally
no knowledge about the authorized APIs.

Note: None of the [sandbox API calls](/extend/common-interface/sandbox)
decrypt the `authorization.oauth_api.credentials.#data` and `authorization.oauth_api.credentials.#appSecret` keys.

