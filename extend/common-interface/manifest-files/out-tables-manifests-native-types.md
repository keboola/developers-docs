---
title: /data/out/tables manifests with Native Types
permalink: /extend/common-interface/manifest-files/out-tables-manifests-native-types/
---

An output table manifest sets options for transferring a table to Storage. The following examples list available
manifest fields; **all of them are optional**. The `destination` field overrides the table name generated
from the file name; it can (and commonly is) overridden by the end-user configuration.

{% highlight json %}
{
    "destination": "out.c-main.Leads",
    "incremental": true,
    "delimiter": "\t",
    "enclosure": "\"",
    "manifest_type": "output",
    "has_header": true,
    "table_metadata": ...
}
{% endhighlight %}

The `table_metadata` fields allow you to set
[Metadata](https://keboola.docs.apiary.io/#reference/metadata) for the table.
The `table_metadata` field corresponds to the [Table Metadata API call](https://keboola.docs.apiary.io/#reference/metadata/table-metadata/create-or-update).
The `key` and `value` of the object are passed directly to the API; the `provider` value is
filled by the Id of the running component (e.g., `keboola.ex-db-snowflake`).

{% highlight json %}
{
    ...
    "table_metadata": {
        "KBC.description": "Best table",
        "something else": "a value"
    }
}
{% endhighlight %}

Additionally, the following options will cause the specified rows to be deleted from the source table before the new
table is imported. See an [example](/extend/common-interface/config-file/#output-mapping---delete-rows).
Using this option makes sense only with [incremental loads](/extend/generic-extractor/incremental/).

{% highlight json %}
{
    ...
    "delete_where_column": "column name",
    "delete_where_values": ["value1", "value2"],
    "delete_where_operator": "eq"
}
{% endhighlight %}

The `schema` field allow you to create a table with Native Data Types columns.
Each object in the `schema` array represents one column:
- The `name` field specifies the column name.
- The `data_type` field defines the data type for different storage systems, referred to as "Native Types".
- The `base` type is always required, while other types like Snowflake and BigQuery are optional.
- The `nullable` field indicates if the column can be null.
- The `primary_key` field specifies if the column is a primary key.
- The `description` field provides a description of the column.
- The `metadata` field allows setting additional metadata for the column.

{% highlight json %}
{
    "schema": [
        {
            "name": "id",
            "data_type": {
                "base": {
                    "type": "INTEGER",
                    "length": "11",
                    "default": "123"
                },
                "snowflake": {
                    "type": "GEOMETRY",
                    "length": "123,123,4455",
                    "default": "POINT(1 1)"
                },
                "bigquery": {
                    "type": "VARCHAR",
                    "length": "123",
                    "default": null
                }
            },
            "nullable": false,
            "primary_key": true,
            "description": "This is a primary key",
            "metadata": {
                "KBC.description": "This is a primary key",
                "KBC.someOther": "value"
            }
        }
    ]
}
{% endhighlight %}
