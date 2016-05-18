---
title: Cursor scroller
permalink: /extend/generic-extractor/pagination/cursor/
---

## Cursor
Looks within the response **data** for an ID which is then used as a parameter for scrolling.

### Example configuration:

```
pagination:
    method: cursor
    idKey: id
    param: max_id
    increment: -1 # subtract 1 from the last ID
    reverse: true # look for the **lowest** ID instead of highest
```
