---
title: Page number scroller (under construction)
permalink: /extend/generic-extractor/pagination/pagenum/
---

## Page number
Traverse the result using increments of a page number parameter. Stops scrolling once the response contains less results than `limit` if set, **or** an empty page is received **or** a response matches the previous.

## Configuration
- **pagination.method**: `pagenum`
- **pagination.pageParam**:(optional) `page` by default
- **pagination.limit**:(optional) integer
    - define the page size
    - if limit is omitted, the pagination will end once an empty page is received. Otherwise it stops once the reply contains less entries than the limit.
- **pagination.limitParam**:(optional)
    - query parameter name to use for *limit*
- **pagination.firstPage**: (optional) `1` by default. Set the first page number.
- **pagination.firstPageParams**(optional)
    - Whether or not include limit and page params in the first request (default to `true`)

## Example:

### Configuration:

    {
        "pagination": {
            "method": "pagenum",
            "pageParam": "page",
            "limit": 500,
            "limitParam": "count"
        }
    }

### Requests created by scroller

    ?count=500&page=1
    ?count=500&page=2
    ?count=500&page=3
    ...
