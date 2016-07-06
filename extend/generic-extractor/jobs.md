---
title: Generic Extractor Jobs
permalink: /extend/generic-extractor/jobs/
---

Jobs is an **array** containing descriptions of resources that will be exported from the API.

## Configuration

- **endpoint**: A path in the API
    - Required
- **params**: Parameters of the API call, to be sent in either GET query, POST Json or Form data, depending on the **method** setting
    - Optional. If no parameters are needed for the resource, this can be omitted.
    - Each parameter in the JSON encoded object may either contain a string, eg: `{""start_date"": ""2014-12-26""}`
    - OR contain an [user function](/extend/generic-extractor/user-functions/) as described below, for example to load value from parameters:
    - Example

            {
                "start_date": {
                    "function":"date",
                    "args": [
                        "Y-m-d+H:i",
                        {
                            "time":"previousStart"
                        }
                    ]
                }
            }

- **method**: One of `GET`, `POST` and `FORM`, where `POST` sends the parameters as a **JSON** in a POST request, while `FORM` uses **form data** in POST
    - `GET` is default
    - Optional
- **dataType**: Sets name for the data result, used by the parser - both automatic [JSON parser](https://github.com/keboola/php-jsonparser#parse-characteristics) and [manual mapping](#TODO). This value is also used to name the output table.
    - Optional. If not set, the type is generated from `endpoint`
    - Multiple resources can share the same **dataType**, but their structure should be identical or very similar.
- **dataField**: Allows to override which field of the response will be exported.
    - If there's multiple arrays in the response "root" the extractor may not know which array to export and fail
    - If the response is an array, the whole response is used by default
    - If there's no array within the root, the path to response data **must** be specified in *dataField*
    - Can contain a path to nested value, dot separater (eg `result.results.products`)
    - `dataField` can also be an object containing `path`
- **responseFilter**: Allows filtering data from API response to leave them unparsed and store as a JSON.
    - Filtered data will be imported as a JSON encoded string.
    - Value of this parameter can be either a string containing path to data to be filtered within response data, or an array of such values.
    - Example:

            {
                "results": [
                    {
                        "id": 1,
                        "data": "scalar"
                    },
                    {
                        "id": 2
                        "data": { "object": "can\"t really parse this into the same column!" }
                    }
                ]
            }

    - To be able to work with such response, set `"responseFilter": "data"` - it should be a path within each object of the response array, **not** including the key of the response array
    - To filter values within nested arrays, use `"responseFilter": "data.array[].key"`
    - Example:

            {
                "results": [
                    {
                        "id": 1,
                        "data": {
                            "array": [
                                { "key": "value" }.
                                { "key": { "another": "value" }}
                            ]
                        }
                    }
                ]
            }

    - This would be another unparseable object, so the filter above would just convert the `{ 'another': 'value' }` object to a string
    - To filter an entire array, use `array` as the value for *responseFilter*. To filter each array item individually, use `array[]`.
- **responseFilterDelimiter**: Allows changing delimiter if you need nesting in **responseFilter**, for instance if your data contains keys containing `.`, which is the default delimiter.
    - Example:

            {
                "results": [
                    {
                        "data.stuff": {
                            something: [1,2,3]
                        }
                    }
                ]
            }

    - Use `'responseFilter': 'data.stuff/something'` together with `'responseFilterDelimiter': '/'` to filter the array in `something`

- There are additional settings for [recursive jobs](/extend/generic-extractor/recursion/)

## Example

{% highlight json %}
{
    "config": {
        "jobs": [
            {
                "endpoint": "users",
                "params": {
                    "type": "customer",
                    "last_seen_after": {
                        "time": "previousStart"
                    }
                }
            }
        ]
    }
}
{% endhighlight %}

This config would create a request such as the following:

`GET users?type=customer&last_seen_after=1467845525`

..where the timestamp would be the time of last execution of the extractor configuration.
