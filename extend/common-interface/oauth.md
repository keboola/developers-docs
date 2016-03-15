---
title: Oauth2 Interface Specification
permalink: /extend/common-interface/oauth
---

[OAuth API V2](https://github.com/keboola/oauth-v2-bundle) integration provides a safe way to retrieve stored autorizations. 

When you're building an application that communicates with a 3rd party API and that API authorizes using OAuth, 
Keboola Connection stores the users' credentials/access tokens in OAuth API V2 and they are revealed and 
decrypted only for a target component and project. End users can be assured, that their authorized access will not leak.

This feature is available only for [registered extensions](/extend/registration/).

## Initialize 
You must create a configuration for the given component and project in OAuth API V2. 
The `OAUTH_API_ID` is the id provided when storing authorization via OAuth API V2.

    {

        "storage": { ... },
        "parameters": { ... },
        "authorization": {
            "oauth_api": {
                "id": "{OAUTH_API_ID}"
            }
        }
    }

## Authorize
[Docker Bundle](/overview/docker-bundle/) then retrieves, decrypts and injects the credentials to the 
configuration file in the `authorization.oauth_api.credentials` attribute.

    {
        "storage": { ... }
        "parameters": { ... }
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

Configuration node `authorization.oauth_api.credentials.#data` stores the response from 
the authorized API as a raw string. You need to parse the string accordingly as OAuth API V2 has intentionally  
no knowledge about the authorized APIs.

Note: None of the [sandbox API calls](/extend/common-interface/sandbox) do 
decrypt `authorization.oauth_api.credentials.#data` and `authorization.oauth_api.credentials.#appSecret` keys. 

