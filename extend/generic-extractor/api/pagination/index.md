---
title: Pagination
permalink: /extend/generic-extractor/api/pagination/
---

Pagination (or paging) describes how an API splits a large list of items into [separate pages](todowiki). 
Pagination may also be 
called *scrolling* or *traversing* (scrolling through a large result set), sometimes it is also referred to as
*setting a cursor* (pointing to a current result). Almost every API has some form of pagination because 
returning lists of results is impractical for many reasons (memory overflows, transfer takes too long, processing takes too long, ...). This makes pagination setting important if you want to retrieve large results. If you
are doing only an ad-hoc query to an API and you want to retrieve thousands of items at most, you may
get away without setting pagination at all.

When configuring Generic Extractor there is a slight distinction between *pagination* and *scrolling*:

- **pagination** -- describes paging of the entire API,
- **scrolling** (scroller) -- describes paging of a single resource.

As long as the API uses the same pagination method for all resources, there is no need to distinct between the 
two. Setting up pagination for Generic Extractor boils down to two crucial questions:

- How to obtain the next set of items? (*scrolling strategy*)
- How to determine that all items were obtained? (When stop scrolling) (*stopping strategy*)

An example pagination configuration looks like this:

{% highlight json %}
{
    ...,
    "api": {
        "pagination" todo
    }
}
{% endhighlight %}

## Scrolling Strategy
- cursor
- offset 
- pagenum
- response-param
- response-url
- multiple

## Stopping Strategy

- stejnej vysledek
- nextPageFlag (je to v json schema?)
- min vysledku nez pozadovano (applies to offset)
 
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
