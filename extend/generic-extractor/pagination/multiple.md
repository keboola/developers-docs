---
title: Multiple scrollers
permalink: /extend/generic-extractor/pagination/multiple/
---

## Multiple scrollers
Allows setting scrollers per request.

### Example configuration:

```
pagination:
    method: multiple
    #default: param_timeline # NoScroller if not defined
    scrollers:
        param_next_cursor: # Uses response.param next_cursor for Twitter https://dev.twitter.com/rest/reference/get/followers/list
            method: response.param
            # settings of response.param scroller for listing followers etc
        param_next_results: # Uses response.param
            method: response.param
            # settings of such scroller
        cursor_timeline: # Uses cursor scroller for timelines
            method: cursor
            idKey: id
            param: max_id
            reverse: true
            increment: -1
```
