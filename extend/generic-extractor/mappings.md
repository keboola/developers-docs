---
title: Mappings (under construction)
permalink: /extend/generic-extractor/mappings/
---

Manually map the JSON data to CSV files for some or all `dataType`s.
Ideally, the built in JSON parser would analyze and parse the result into a table with no configuration. However, that also assumes the data is not known before received from the API, and doesn't allow setting a primary key. In some cases with very complicated JSONs, it could also result into a hardly useful yet large amount of tables on the output, in which case it is often better to create the mapping and define what columns/tables will be created.

## Configuration

- **mappings** attribute can be used to force the extractor to map the response into columns in a CSV file as described in the [JSON to CSV Mapper documentation](https://github.com/keboola/php-csvmap).
Each property in the `mappings` object must follow the mapper settings, where the key is the `dataType` of a `job`. Note that if a `dataType` is not set, it is generated from the endpoint and might be confusing if ommited.

- If there's no mapping for a `dataType`, the standard JSON parser processes the result.

- In a [recursive job](/extend/generic-extractor/recursion/), the placeholer prepended by `parent_` is available as `type: user` to link the child to a parent. See example below:

    Jobs:

        {
          "jobs": [
            {
              "endpoint": "orgs/keboola/repos",
              "dataType": "repos",
              "children": [
                {
                  "endpoint": "repos/keboola/{1:name}/issues",
                  "placeholders": {
                    "1:name": "name"
                  },
                  "dataType": "issues"
                }
              ]
            }
          ]
        }

    Mappings (of the child):

        {
          "mappings": {
            "issues": {
              "parent_name": {
                "type": "user",
                "mapping": {
                  "destination": "repo_name"
                }
              },
              "title": {
                "mapping": {
                  "destination": "title"
                }
              },
              "id": {
                "mapping": {
                  "destination": "id",
                  "primaryKey": true,
                  "propertyOrder": 1
                }
              }
            }
          }
        }

    The `parent_name` is the `parent_` prefix together with the value of placeholder `1:name`.

## Example

### Config

{% highlight json %}
{
  "mappings": {
    "data": {
      "id": {
        "mapping": {
          "destination": "id",
          "primaryKey": true
        }
      },
      "status": {
        "mapping": {
          "destination": "st"
        }
      }
    }
  },
  "jobs": [
    {
      "endpoint": "data.json",
      "dataType": "data"
    }
  ]
}
{% endhighlight %}

### Data

{% highlight json %}
{
    "results": [
        {
            "id": 1,
            "status": "new"
        },
        {
            "id": 2,
            "status": "active"
        }
    ]
}
{% endhighlight %}

### Result CSV

{% highlight csv %}
"id","st"
"1","new",
"2","active"
{% endhighlight %}

The `id` column will also be set as a primary key in the table imported to KBC/Storage, according to the mapping
