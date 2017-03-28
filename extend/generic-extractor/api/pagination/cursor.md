---
title: Cursor Scroller
permalink: /extend/generic-extractor/api/pagination/cursor/
---

The Cursors Scroller can be used with an API which expects the client to maintain a cursor (pointer)
to the last obtained item. For example on first request it returns items with ID 1-100, for the second
request, you must tell the API to start with ID 101. 

{% highlight json %}
{
    "api": {
        "pagination": {
            "method": "cursor",
            "idKey": "id",
            "param": "startWith",
            "increment": 1
        },
        ...
    }
}
{% endhighlight %}

## Configuration Parameters
The following configuration parameters are supported for the `cursor` method of pagination:

- `idKey` (required, string) -- A path to key which contains a value of the cursor, the path is entered relative to the exported items.
- `param` (require, string) -- Name of the [query string](/extend/generic-extractor/tutorial/rest/#url) parameter in which the above *cursor value* should be sent to the API.
- `increment` (optional, integer) -- Value by which the cursor value will be incremented/decremented. Default value is `0`.
- `reverse` (optional, boolean) -- When true, the cursor is reversed. Default value is `false`.

In default mode, Generic Extractor examines the response and finds the **maximum** value in the
property specified in the `idKey`. Then it adds `increment` to the value and sends it to the 
API in a parameter whose name is in the `param` value. If the cursor is set to reverse, then
the **minimum** value of the `idKey` is taken. The `increment` is added to that value, so it should be probably
set to negative when using `reverse=true`.
The request parameter specified in the `param` configuration overwrites a parameter of the same name defined in
[job parameters](/extend/generic-extractor/jobs/#request-parameters). Other job parameters are carried over without modification (see [example](#reverse-configuration).

### Stopping Condition
The pagination ends when the `dataField` of the response contains no items. Because of this, each 
run with the `cursor` scroller produces a similar warning:
    
    Warning: datafield 'items' contains no data!

This is expected behavior. [Common stopping conditions](/extend/generic-extractor/api/pagination/#stopping-strategy) also apply.

## Examples

### Basic Configuration
Let's say you have an API which has an endpoint `/users` which returns the following response:

{% highlight json %}
{
    "items": [
        {
            "name": "Jimmy Doe",
            "fields": {
                "id": 345
            }
        },
        {
            "name": "Jenny Doe",
            "fields": {
                "id": 456            
            }
        }
    ]
}
{% endhighlight %}

For next page of results, the API requires you to send a request to `/users?continueAfter=456`. The following 
configuration handles the case:

{% highlight json %}
"pagination": {
    "method": "cursor",
    "idKey": "fields.id",
    "param": "continueAfter"
}
{% endhighlight %}

Notice that the `idKey` parameter is relative to the extracted array of items (`fields.id` and not `items[].fields.id`).

See [Full Example](todo:060-pagination-cursor-basic)

### Reverse Configuration
Some APIs return items from newest item and therefore need to query for offset in reverse order. Let's say a 
request to `/users?startWith=last` will produce:

{% highlight json %}
{
    "items": [
        {
            "id": 345,
            "name": "Jimmy Doe"
        },
        {
            "id": 456,
            "name": "Jenny Doe"
        }
    ]
}
{% endhighlight %}

To retrieve a next set of results, you need to send a request to `GET /users?startWith=344` -- i.e. with the
ID lower then the lowest already retrieved one. The following configuration does exactly that:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "http://example.com/",
            "pagination": {
                "method": "cursor",
                "idKey": "id",
                "param": "startWith",
                "increment": -1,
                "reverse": true
            }
        },
        "config": {
            "debug": true,
            "outputBucket": "mock-server",
            "jobs": [
                {
                    "endpoint": "users",
                    "dataField": "items",
                    "params": {
                        "startWith": "last"
                    }
                }
            ]
        }
    }
}
{% endhighlight %}

The important part is `"reverse": true` which cause Generic Extractor to look for the lowest value of 
property specified in `idKey` (user id). Another important part is `"increment": -1` which causes the
ID to be lowered by 1 between the requests. Also notice that the initial value of the API parameter
`startWith` is specified in the `jobs.params` configuration and it is overridden by the scroller
in subsequent requests.

See [Full Example](todo:061-pagination-cursor-reverse)
