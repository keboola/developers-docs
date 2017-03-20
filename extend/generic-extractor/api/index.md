---
title: API Configuration
permalink: /extend/generic-extractor/api/
---

* TOC
{:toc}

The API section of configuration describes global characteristics of the API. These include
HTTP headers, authentication and pagination methods. 

### Base URL
The `baseUrl` configuration defines the URL to which the API requests should be sent to. We
recommend that the URL ends with slash so that the `jobs.endpoint` can be set easily.
See the [`endpoint` configuration](/extend/generic-extractor/jobs/#endpoint) for detailed description
how `api.baseUrl` and `jobs.endpoint` work together.


## Config items


### `pagination`
- Configure scrolling through pages of results
- [link](/extend/generic-extractor/pagination/)

### `auhentication`
- Configure how the user authenticates with the API
- [link](/extend/generic-extractor/authentication/)

### `retryConfig`
- Set the retry limit, rate limit reset header and HTTP codes to retry if the API returns an error
- **headerName**: (string) `Retry-After`
    - Name of the header with information when can we access the API again
- **httpCodes**: (array) `[500, 502, 503, 504, 408, 420, 429]`
    - HTTP codes on which to retry
- **maxRetries**: (int) `10`
    - Maximum retry attempts (useful for exponential backoff, if the limit reset header is not present)
- Example:

        {
            "api": {
                "retryConfig": {
                    "maxRetries": 3,
                    "httpCodes": [429, 503],
                    "headerName": "X-Rate-Limit-Reset"
                }
            }
        }

### `http`
- Set default values for headers and parameters across the API
- Also allows to define headers that have to be presented in `config` part
- `headers`
    - Default headers that are sent with all requests
    - Example:

            {
                "api": {
                    "http": {
                        "headers": {
                            "Accept": "application/json",
                            "Accept-Encoding": "gzip"
                        }
                    }
                }
            }

- `defaultOptions`
    - `params`
        - Key:Value pairs of default values that'll be sent with all requests in GET/POST/FORM
        - Example:

                {
                    "api": {
                        "http": {
                            "defaultOptions": {
                                "params": {
                                    "format": "json"
                                }
                            }
                        }
                    }
                }

- `requiredHeaders`
    - Headers that will be **required** in the [config](/extend/generic-extractor/config/) part
    - Example:

            {
                "api": {
                    "http": {
                        "requiredHeaders": [
                            "App-Key",
                            "X-User-Email"
                        ]
                    }
                },
                "config": {
                    "http": {
                        "headers": {
                            "App-Key": "a1s2d3f4",
                            "X-User-Email": "joe@somewhere.com"
                        }
                    }
                }
            }

    - The `config.http.headers` object must have an item with a key that matches each one of the items in `api.http.requiredHeaders`
