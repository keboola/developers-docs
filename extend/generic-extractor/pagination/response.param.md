---
title: Response parameter scroller
permalink: /extend/generic-extractor/pagination/response.param/
---

## Response parameter scroller
Create a request using a parameter from previous response

## Configuration

- **method**: `response.param`
- **responseParam**:
    - path within response that points to a value used for scrolling
    - pagination ends if the value is empty
- **queryParam**:
    - request parameter to set to the value from response
- **includeParams**: `false`
    - whether params from job configuration are used in next page request
- **scrollRequest**:
    - can be used to override settings (`endpoint`, `method`, ...) of the initial request

## Simple Example

### Configuration:

    {
        "api": {
            "pagination": {
                "method": "response.param",
                "responseParam": "next_cursor",
                "queryParam": "cursor"
            }
        }
    }

### Response:

    {
        "results": [...],
        "next_cursor": "asdf"
    }

### Query created from previous response

    ?cursor=asdf

## Advanced Example

### Configuration:

    {
        "api": {
            "pagination": {
                "method": "response.param",
                "responseParam": "_scroll_id",
                "queryParam": "scroll_id",
                "scrollRequest": {
                    "endpoint": "_search/scroll",
                    "method": "GET",
                    "params": {
                        "scroll": "1m"
                    }
                }
            }
        }
    }

### Response:

    {
        "results": [...],
        "_scroll_id": "abcd"
    }

### Request

    GET /_search/scroll?scroll_id=abcd&scroll=1m
