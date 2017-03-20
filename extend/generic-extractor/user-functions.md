---
title: User Functions (under construction)
permalink: /extend/generic-extractor/user-functions/
---

## User functions

Use [php-codebuilder](https://github.com/keboola/php-codebuilder) library for advanced functionality, such as dynamically transforming strings or date values in API call parameters.

parameters :
    - OR contain an [user function](/extend/generic-extractor/user-functions/) as described below, for example to load value from parameters:
    - Example

            {
                "start_date": {
                    "function":"date",
                    "args": [
                        "Y-m-d+H:i",
                        {
                            "time":"previousStart"
                        }
                    ]
                }
            }



        - You can also use an [user function](/extend/generic-extractor/user-functions/) on the value from a parent using an object as the placeholder value
        - That object MUST contain a `path` key that would be the value of the placeholer, and a `function`. To access the value in the function arguments, use `{"placeholder": "value"}`
            - Example:

                    {
                        "placeholders": {
                            "1:id": {
                                "path": "id",
                                "function": "urlencode",
                                "args": [
                                    {
                                        "placeholder": "value"
                                    }
                                ]
                            }
                        }
                    }

        - Further documentation can be found at [keboola/php-filter](https://github.com/keboola/php-filter)


### `baseUrl`
- Either a string with base URL of the API (eg `https://connection.keboola.com/v2/`)
- OR an [user function](/extend/generic-extractor/user-functions/), if there's a configurable part of the base URL, such as a subdomain, or an account ID..
- Example using a function:

        {
            "api": {
                "function": "concat",
                "args": [
                    "https://",
                    { "attr": "domain" },
                    ".zendesk.com/api/v2/"
                ]
            },
            "config": {
                "domain": "yourDomain"
            }
        }

    - for *https://__yourDomain__.zendesk.com/api/v2/*
    - uses `config` part, where attribute **domain** would contain `yourDomain`

