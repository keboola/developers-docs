---
title: Pagination
permalink: /extend/generic-extractor/pagination/
---

## Pagination
Use different methods to scroll across the result from API


## Common scrolling parameters
Parameters used by all scroller methods

### nextPageFlag

Looks within responses to find a boolean field determining whether to continue scrolling or not.

## Usage:

### Configuration

- **field**: Path in the response to a boolean property that indicates whether to continue or not
- **stopOn**: Whether the pagination should be stopped on `true` or `false`
- **ifNotSet**:(optional) Whether to assume `true` or `false` if the `field` doesn't exist in the response. If not set, the scrolling stops when the value is not present

### Example

Configuration:

    {
        "pagination": {
            "nextPageFlag": {
                "field": "hasMore",
                "stopOn": false,
                "ifNotSet": false
            },
            "type": "..."
        }
    }

Response:

    {
        "results": [...],
        "hasMore": true
    }
