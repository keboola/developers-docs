---
title: Cursor scroller (under construction)
permalink: /extend/generic-extractor/pagination/cursor/
---

## Cursor
Looks within the response **data** for an ID of the highest OR lowest value, which is then used as a parameter for scrolling.

## Configuration
- **method**: `cursor`
- **idKey**: A key within the response that contains the ID used in next request
- **param**: Name of the parameter in next request that will be set to value from previous response
- **increment**: Numeric value that can be used to increment (or decrement using a negative value) the value from response
- **reverse**: If set to true, the scroller looks for the **lowest** value (`false` => **highest** by default)

## Example:

### Configuration:

    {
        "pagination": {
            "method": "cursor",
            "idKey": "id",
            "param": "min_id",
            "increment": 1
        }
    }

### Response:

    [
        {
            "id": 123,
            "..."
        },
        {
            "id": 456,
            "..."
        }
    ]

### Query created from above response

    ?min_id=457

A `min_id` parameter contains value from highest `id` key in the response, incremented by `1`
