---
title: Multiple scrollers
permalink: /extend/generic-extractor/pagination/multiple/
---

## Multiple scrollers
Allows setting scrollers for each endpoint.

## Configuration:
- **method**: `multiple`
- **scrollers**:
    - An object where each key represents an identifier of a scroller, which can then be used in job's `scroller` parameter to choose which scroller should it use
    - Each value in the object **must** be a configuration of another scroller (eg `response.param` scroller with all of its parameters)
- **default**: A default scroller identifier for jobs where no `scroller` is set. If not set, jobs with no scroller will not use any pagination.

## Example

    {
        "api": {
            "pagination": {
                "method": "multiple",
                "scrollers": {
                    "param_next_results": {
                        "method": "response.param"
                    },
                    "cursor_timeline": {
                        "method": "cursor",
                        "idKey": "id",
                        "param": "max_id",
                        "reverse": true,
                        "increment": -1
                    }
                }
            }
        },
        "config": {
            "jobs": [
                {
                    "endpoint": "statuses/user_timeline",
                    "scroller": "cursor_timeline"
                },
                {
                    "endpoint": "search",
                    "scroller": "param_next_results",
                    "params": {
                        "q": "..."
                    }
                }
            ]
        }
    }
