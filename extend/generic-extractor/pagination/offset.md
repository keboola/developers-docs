---
title: Offset scroller
permalink: /extend/generic-extractor/pagination/offset/
---

## Offset
Traverse the result using increments of an offset parameter. Stops scrolling once the response contains less results than `limit`.

## Configuration
- **method**: `offset`
- **limit**: integer
    - If a *limit* is set in configuration's **params** field, it will be overriden by its value
    - If the API limits the results count to a lower value than this setting, the scrolling will stop after first page, as it stops once the results count is lower than configured count
- **limitParam**(optional)
    - sets which query parameter should contain the limit value (default to `limit`)
- **offsetParam**(optional)
    - sets which query parameter should contain the offset value (default to `offset`)
- **firstPageParams**(optional)
    - Whether or not include limit and offset params in the first request (default: `true`)
- **offsetFromJob**(optional)
    - Use offset specified in job config for first request (default: `false`)

## Example:

### Configuration:

    {
        "pagination": {
            "method": "offset",
            "limit": 100,
            "limitParam": "count",
            "offsetParam": "skip"
        }
    }

### Requests created by scroller

    ?count=100&skip=0
    ?count=100&skip=100
    ?count=100&skip=200
    ...
