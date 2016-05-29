---
title: Response URL scroller
permalink: /extend/generic-extractor/pagination/response-url/
---

## Response URL scroller
Create a request using URL from previous response

## Configuration

- **method**: `response.url`
- **urlKey**: `next_page`
    - path within response object that points to the URL
    - if value of that key is empty, pagination ends
- **paramIsQuery**: `false`
    - Enable if the response only contains a query string to use with the same endpoint
- **includeParams**: `false`
    - whether or not to add "params" from the configuration to the URL's query from response
    - if enabled and the next page URL has the same query parameters as the "params" field, values from the "params" override ones from the response

## Example

### Configuration:

    {
        "api": {
            "pagination": {
                "method": "response.url",
                "urlKey": "next_page",
            }
        }
    }

### Response:

    {
        "results": [...],
        "next_page": "/resource/page/2"
    }

### Next request URL

    /resource/page/2
