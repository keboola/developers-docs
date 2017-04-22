---
title: OAuth 1.0 Authentication (under construction)
permalink: /extend/generic-extractor/api/authentication/oauth/10/
---

- Use OAuth 1.0 tokens
- Using OAuth in ex-generic-v2 in KBC currently requires the application to be registered under the API's component ID and cannot be configured in Generic extractor itself

This requires the `authorization.oauth_api.credentials` object in configuration to contain `#data`, `appKey` and `#appSecret`, where `#data` **must** contain a JSON encoded object with `oauth_token` and `oauth_token_secret` properties. `appKey` **must** contain the consumer key, and `#appSecret` **must** contain the consumer secret.

Use [Keboola Docker and OAuth API integration](https://github.com/keboola/docker-bundle/blob/master/ENVIRONMENT.md#oauth-api-v2-integration) to generate the authorization configuration section.

- **authentication.type**: `oauth10`

### Configuration

#### Example minimum `config.json`:

    {
        "authorization": {
            "oauth_api": {
                "credentials": {
                    "#data": "{\"oauth_token\":\"userToken\",\"oauth_token_secret\":\"tokenSecret\"}",
                    "appKey": 1234,
                    "#appSecret": "asdf"
                }
            }
        },
        "parameters": {
            "api": {
                "authentication": {
                    "type": "oauth10"
                }
            }
        }
    }
