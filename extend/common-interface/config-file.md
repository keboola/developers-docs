---
title: Configuration File Specification
permalink: /extend/common-interface/config-file/
---

* TOC
{:toc}

Configuration files are one of the [possible channels](/extend/common-interface/) for exchanging data
between components and Keboola.

To create a sample configuration file (together with the data directory),
use the [Debug API call](/extend/component/running/#preparing-the-data-folder) via the
[Docker Runner API](https://kebooladocker.docs.apiary.io/#reference/sandbox/input-data).
You will get a zip archive containing all the resources you need in your component.

All configuration files are always stored in `JSON` format.

## Configuration File Structure
Each configuration file has the following root nodes:

- `storage`: Contains both the input and output [mapping](https://help.keboola.com/manipulation/transformations/mappings/) for both files and tables.
This section is important if your component uses a dynamic input/output mapping.
Simple components can be created with a static input/output mapping.
They do not use this configuration section at all (see [Tutorial](/extend/component/tutorial/)).
- `parameters`: Contains arbitrary parameters passed from the UI to the component. This section can be used in any
way you wish. Your component should validate the contents of this section. For passing sensitive
data, use [encryption](/overview/encryption/). This section is not available in Transformations.
- `image_parameters`: See [below](#image-parameters).
- `authorization`: Contains Oauth2 [authorization contents](/extend/common-interface/oauth/) or 
[Workspace credentials](/extend/common-interface/folders/#exchanging-data-via-workspace) .
- `action`: Name of the [action](/extend/common-interface/actions/) to execute; defaults to `run`. All
actions except `run` have a strict execution time limit of 30 seconds.
See [actions](/extend/common-interface/actions/) for more details.

### Validation
Your application should implement validation of the `parameters` section, which is passed without modification from the UI.
Your application might also implement validation of the `storage` section if you have some specific requirements on the
input mapping or output mapping setting (e.g., certain number of tables, certain names). If you chose to do any validation
outside the `parameters` section, it must always be forward compatible -- i.e. benevolent. While we maintain backward compatibility
very carefully, it is possible for new keys to appear in the configuration structure as we introduce new features.

### Image Parameters
The `image_parameters` section contains configuration options, which are the same for every configuration of a component.
They cannot be modified by the end-user. This section is typically used for global component
parameters (such as a token, URL, version of your API) which, for any reason, are not practical to be part of the component image itself.
The `image_parameters` contents are configured in the [component settings](https://components.keboola.com/) in JSON format in two
text fields: **Image Parameters** and **Stack Parameters**.

Both JSONs are merged into the `image_parameters` of the configuration file. The *Stack Parameters* 
provide different values for different [Keboola Stacks](/overview/api/#regions-and-endpoints). Values in
*Stack Parameters* are merged with those in *Image Parameters* with *Stack Parameters* having a higher priority.
*Stack Parameters* are indexed with [Storage URL](/overview/api/#regions-and-endpoints) or the given region.

Given the following *Image Parameters*:

{% highlight json %}
{
    "name": "my-app-name",
    "token": "default"
}
{% endhighlight %}

And the following *Stack Parameters*:

{% highlight json %}
{
    "connection.keboola.com": {
        "url": "https://my-us-api/",
        "token": "abc"
    },
    "connection.eu-central-1.keboola.com": {
        "url": "https://my-eu-api/",
        "token": "def"
    }
}
{% endhighlight %}

The component will receive the following `image_parameters` in the configuration file when run in the **EU region**:
{% highlight json %}
{
    "image_parameters": {
        "name": "my-app-name",
        "url": "https://my-eu-api/",
        "token": "def"
    }
}
{% endhighlight %}

The component will receive the following `image_parameters` in the configuration file when run in the **US region**:
{% highlight json %}
{
    "image_parameters": {
        "name": "my-app-name",
        "url": "https://my-us-api/",
        "token": "abc"
    }
}
{% endhighlight %}

When working with the API, note that the [Developer Portal API](https://kebooladeveloperportal.docs.apiary.io/)
(specifically the [Component Detail API call](https://kebooladeveloperportal.docs.apiary.io/#reference/0/app/get-app-detail))
shows separate `stack_parameters` and `image_parameters`, because the API is region agnostic.

However, when working with the [Storage API](https://keboola.docs.apiary.io/)
(specifically the [Component list API call](https://keboola.docs.apiary.io/#reference/miscellaneous/api-index/component-list)),
the `stack_parameters` and `image_parameters` values are already merged and only those designated for the
current region are visible.

#### Encryption
Both *Image Parameters* and *Stack Parameters* support [encrypted values](/overview/encryption/). In practice, however,
the encrypted values must always be stored in *Stack Parameters*, because ciphers are not transferable between regions
(i.e. an encrypted value is only usable in the region in which it was encrypted).

As with configurations, the encrypted values must be prefixed with the hash sign `#`. However, unlike in Keboola configurations,
you **have to encrypt values manually via the API** -- they will not be encrypted automatically when you store *Stack Parameters*!
When using the [encryption API](https://keboolaencryption.docs.apiary.io/#), provide only the `componentId`
parameter (using `projectId` or `configId` will make the cipher unusable).
Also take care to use the correct [API URL](https://developers.keboola.com/overview/api/#regions-and-endpoints) to obtain
ciphers for each region you need.

## State File
The state file is used to store the component state for the next run. It provides a two-way communication between
Keboola configuration state storage and the component. The state file only works if the API call
references a stored configuration (`config` is used, not `configData`).

The location of the state file is:

- `/data/in/state.json` loaded from a configuration state storage
- `/data/out/state.json` saved to a configuration state storage

The component reads the input state file and writes any content to the output state
file (valid JSON) that
will be available to the next API call. A missing or an empty file will remove the state value.
A state object is saved to configuration storage only when actually running the app
(not in [debug API calls](https://kebooladocker.docs.apiary.io/#reference/debug). The state must be a valid JSON file.
[Encryption](/overview/encryption/#encrypting-data-with-api) is applied to the state the same way it is applied to
configurations, `KBC::ProjectSecure::` ciphers are used. 

### State File Properties
Because the state is stored as part of a
[component configuration](https://keboola.docs.apiary.io/#reference/components-and-configurations),
the value of the state object is somewhat limited (should not generally exceed 1MB). It should not
be used to store large amounts of data.

Also, the end-user cannot easily access the data through the UI.
The data can be, however, modified outside of the component itself using the
[component configuration](https://keboola.docs.apiary.io/#reference/components-and-configurations) API calls.
Note however that the content in the contents of the state file is nested:

I.e., assume that the component generates a state file with the following contents:


{% highlight json %}
{
    "time": {
        "previousStart": 1587980435
    }
}
{% endhighlight %}

If you read the configuration through the Component configuration API call, you'll see:

{% highlight json %}
"state": {
    "component": {
        "time": {
            "previousStart": 1587980435
        }
    },
    "storage": {
      "input": {
        "tables": []
      }
    }
  }
{% endhighlight %}

That means the contents of the state file are nested inside the `component` node. There
is also a `storage` node, which is related to the 
[Automatic incremental processing](https://help.keboola.com/storage/tables/#automatic-incremental-processing).

You need to maintain the above structure when manually changing the configuration via the API.

**Important:** The state file is not thread-safe. If multiple instances of the **same configuration**
are run simultaneously in the **same project**, the one writing data later wins. Use the state file more
as an HTTP cookie than as a database. A typical use for the state file would be saving the last record
loaded from some API to enable incremental loads.

## Usage File

Unlike the state file, the **usage file is one way only** and has a pre-defined structure.
The usage file is used to pass information from the component to Keboola.
Metrics stored are used to determine how much resources the job consumed and translate the usage to Keboola
credits; this is very useful when you need your customers to pay using your component or service.

The usage file is located at `/data/out/usage.json`. It should contain an array of objects
keeping information about the consumed resources. The objects have to contain only two keys, `metric`
and `value`, as in the example bellow:

{% highlight json %}
[
    {
        "metric": "API calls",
        "value": 150
    }
]
{% endhighlight %}

This structure is processed and stored within a job, so it can be analyzed, processed and aggregated later.

To keep track of the consumed resources in the case of a component failure, **it is recommended to
write the usage file regularly** during the component run, not only at the end.

*Note: As the structure of the state file is pre-defined, the content of the usage file is strictly
validated and a wrong format will cause a component failure.*

## Examples
To create an example configuration, use the [Debug API call](/extend/component/running/#preparing-the-data-folder). You will get a
`stage_0.zip` archive in your **Storage** > **File Uploads**, which will contain the `config.json` file.
You can also use these configuration structure to create an API request for
actually [running a component](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job).
If you want to manually pass configuration options in the API request, be sure to wrap it around in the `configData` node.

A sample configuration file might look like this:

{% highlight json %}
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-main.test",
                    "destination": "source.csv",
                    "limit": 50,
                    "columns": [],
                    "where_values": [],
                    "where_operator": "eq"
                },
                {
                    "source": "pokus.snaz.test",
                    "destination": "source1.csv"
                }
            ],
            "files": []
        },
        "output": {
            "tables": [
                {
                    "source": "destination.csv",
                    "destination": "out.c-main.test",
                    "incremental": false,
                    "colummns": [],
                    "primary_key": [],
                    "delete_where": [],
                    "delimiter": ",",
                    "enclosure": "\""
                },
                {
                    "source": "write-alwayss.csv",
                    "destination": "out.c-main.output-even-on-error"
                    "write_always": true
                }
            ],
            "files": []
        }
    },
    "parameters": {
        "multiplier": 2
    },
    "image_parameters": [],
    "action": "run"
}
{% endhighlight %}

### Tables
Tables from the input mapping are mounted to `/data/in/tables`.
Input mapping parameters are similar to the [Storage API export table options](https://keboola.docs.apiary.io/#reference/tables/unload-data-asynchronously).
If `destination` is not set, the CSV file will have the same name as the table (without adding `.csv` suffix).
The tables element in a configuration of the **input mapping** is an array and supports the following attributes:

- `source`
- `destination`
- `days` (internally converted to `changed_since`)
- `columns`
- `column_types`
- `where_column`
- `where_operator`
- `where_values`
- `limit`

The output mapping parameters are similar
to the [Transformation API output mapping ](https://help.keboola.com/manipulation/transformations/).
`destination` is the only required parameter. If `source` is not set, the CSV file is expected to have the same name
as the `destination` table.
The tables element in a configuration of the **output mapping** is an array and supports the following attributes:

  - `source`
  - `destination`
  - `incremental`
  - `columns`
  - `primary_key`
  - `delete_where` - Defines rules for deleting records before loading new data
  - `delete_where_column` - **[DEPRECATED]** Use `delete_where` instead
  - `delete_where_operator` - **[DEPRECATED]** Use `delete_where` instead
  - `delete_where_values` - **[DEPRECATED]** Use `delete_where` instead
  - `delimiter`
  - `enclosure`
  - `write_always`

#### Input mapping --- basic
Download tables `in.c-ex-salesforce.Leads` and `in.c-ex-salesforce.Accounts` to `/data/tables/in/leads.csv`
and `/data/tables/in/accounts.csv`.

{% highlight json %}
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-ex-salesforce.Leads",
                    "destination": "leads.csv"
                },
                {
                    "source": "in.c-ex-salesforce.Accounts",
                    "destination": "accounts.csv"
                }
            ]
        }
    }
}
{% endhighlight %}

In an API request, this would be passed as:

{% highlight json %}
{
    "configData": {
        "storage": {
            "input": {
                "tables": [
                    {
                        "source": "in.c-ex-salesforce.Leads",
                        "destination": "leads.csv"
                    },
                    {
                        "source": "in.c-ex-salesforce.Accounts",
                        "destination": "accounts.csv"
                    }
                ]
            }
        }
    }
}
{% endhighlight %}


#### Input mapping --- incremental load
Download 2 days of data from the `in.c-storage.StoredData` table to `/data/tables/in/in.c-storage.StoredData`.

{% highlight json %}
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-storage.StoredData",
                    "days": "2"
                }
            ]
        }
    }
}
{% endhighlight %}

#### Input mapping --- select columns

{% highlight json %}
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-ex-salesforce.Leads",
                    "columns": ["Id", "Revenue", "Date", "Status"]
                }
            ]
        }
    }
}
{% endhighlight %}

#### Input mapping --- column types
This is applicable only to [workspace mapping](/extend/common-interface/folders/#exchanging-data-via-workspace), for CSV files this setting has no effect. The `column_types` setting maps to [Storage API load options](https://keboola.docs.apiary.io/#reference/workspaces/load-data/load-data). It also acts the same way as `columns` setting allowing you to limit the table columns.
If both `column_types` and `columns` setting are used, then the listed columns must match. If you omit `columns` and use only `column_types` (recommended) then `columns` will be propagated automatically from `column_types`.

{% highlight json %}
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-ex-salesforce.Leads",
                    "column_types": [
                        {
                            "source": "Id",
                            "type": "VARCHAR",
                            "destination": "id",
                            "length": "255",
                            "nullable": false,
                            "convert_empty_values_to_null": false
                        }
                    ]
                }
            ]
        }
    }
}
{% endhighlight %}

#### Input mapping --- filtered table

{% highlight json %}
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-ex-salesforce.Leads",
                    "destination": "closed_leads.csv",
                    "where_column": "Status",
                    "where_values": ["Closed Won", "Closed Lost"],
                    "where_operator": "eq"
                }
            ]
        }
    }
}
{% endhighlight %}

#### Output mapping --- basic
Upload `/data/out/tables/out.c-main.data.csv` to `out.c-main.data`.

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "out.c-main.data.csv",
                    "destination": "out.c-main.data"
                }
            ]
        }
    }
}
{% endhighlight %}

#### Output mapping --- headless CSV
Upload `/data/out/tables/data.csv`, a CSV file without headers on its first line, to the table `out.c-main.data`.

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "data.csv",
                    "destination": "out.c-main.data",
                    "columns": ["column1", "column2"]
                }
            ]
        }
    }
}
{% endhighlight %}

#### Output mapping --- set additional properties
Incrementally upload `/data/out/tables/data.csv` to `out.c-main.data`
with a compound primary key set on the columns `column1` and `column2`.

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "data.csv",
                    "destination": "out.c-main.data",
                    "incremental": true,
                    "primary_key": ["column1", "column2"]
                }
            ]
        }
    }
}
{% endhighlight %}

#### Output mapping --- write even if the job fails
If you have a table that you are updating during the execution of the job 
and you want to output that table even if the job fails then you can use the `write_always` flag 

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "always-output.csv",
                    "destination": "out.c-main.always-output",
                    "write_always": true
                }
            ]
        }
    }
}
{% endhighlight %}

#### Output mapping --- delete rows
Delete data from the `destination` table before uploading the CSV file (only makes sense with `incremental: true`).

The `delete_where` parameter provides a flexible way to specify which records should be deleted from the target table before loading new data into it. It supports time-based filters and multiple filter conditions:

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "data.csv",
                    "destination": "out.c-main.Leads",
                    "incremental": true,
                    "delete_where": [
                        {
                            "changed_since": "-7 days",
                            "changed_until": "-2 days",
                            "where_filters": [
                                {
                                    "column": "Status",
                                    "operator": "eq",
                                    "values_from_set": ["Closed"]
                                },
                                {
                                    "column": "Status",
                                    "operator": "eq",
                                    "values_from_workspace": {
                                        "workspace_id": "123",
                                        "table": "statuses",
                                        "column": "status_name"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
{% endhighlight %}

**Parameters:**

- `changed_since` (optional) - Starting point for time-based deletion. Can be specified as:
  - Relative time (e.g., "-2 days", "-1 month")
  - Unix timestamp (e.g., "1360138863")
  - ISO 8601 date (e.g., "2013-02-12T15:19:21+00:00")
- `changed_until` (optional) - End point for time-based deletion. Accepts the same formats as `changed_since`
- `where_filters` (optional) - Array of filter conditions:
  - `column` - Name of the column to filter on
  - `operator` - One of: `eq` (equals), `ne` (not equals)
  - `values_from_set` - Array of specific values to match against
  - `values_from_workspace` - Reference values from a workspace table:
    - `workspace_id` - ID of the workspace. Optional when exchanging data through [database workspace](/extend/common-interface/folders/#exchanging-data-via-database-workspace)
    - `table` - Name of the table in the workspace.
    - `column` - Name of the column containing values. If not specified, the column name from `where_filters.column` will be used

**Note:** For each `where_filters` item, you must use only one method to specify values - either `values_from_set` or `values_from_workspace`. Using multiple value sources in a single filter is not allowed.

You can combine multiple rules and filters to create complex deletion conditions. Each rule in the `delete_where` array is processed independently.

##### Simple Example
Here's a basic example of deleting records with a specific status:

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "data.csv",
                    "destination": "out.c-main.Leads",
                    "incremental": true,
                    "delete_where": [
                        {
                            "where_filters": [
                                {
                                    "column": "Status",
                                    "operator": "eq",
                                    "values_from_set": ["Closed", "Cancelled"]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
{% endhighlight %}

This configuration performs a DELETE operation equivalent to the following SQL:

```sql
DELETE FROM "out.c-main.Leads"
WHERE "Status" IN ('Closed', 'Cancelled')
```

When using `operator: "ne"` (not equals), the operation will use SQL's NOT IN clause instead of IN. For example, if you specify `values_from_set: ["Active", "Pending"]` with `operator: "ne"`, it will delete all records where the column value is NOT one of the specified values.

##### Multiple Filters
Multiple filters in a single `where_filters` array are combined using AND operator. For example:

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "data.csv",
                    "destination": "out.c-main.Leads",
                    "incremental": true,
                    "delete_where": [
                        {
                            "where_filters": [
                                {
                                    "column": "Status",
                                    "operator": "eq",
                                    "values_from_set": ["Closed", "Cancelled"]
                                },
                                {
                                    "column": "Region",
                                    "operator": "ne",
                                    "values_from_set": ["EU"]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
{% endhighlight %}

This configuration performs a DELETE operation equivalent to the following SQL:

```sql
DELETE FROM "out.c-main.Leads"
WHERE "Status" IN ('Closed', 'Cancelled')
  AND "Region" NOT IN ('EU')
```

**Important Note:** Multiple rules in the `delete_where` array are processed independently (as separate DELETE statements)

##### Independent Rules Processing
When multiple rules are specified in the `delete_where` array, each rule is processed as a separate DELETE statement. For example:

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "data.csv",
                    "destination": "out.c-main.Leads",
                    "incremental": true,
                    "delete_where": [
                        {
                            "where_filters": [
                                {
                                    "column": "Status",
                                    "operator": "eq",
                                    "values_from_set": ["Closed"]
                                }
                            ]
                        },
                        {
                            "where_filters": [
                                {
                                    "column": "Region",
                                    "operator": "eq",
                                    "values_from_set": ["EU"]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
}
{% endhighlight %}

This configuration performs two separate DELETE operations equivalent to:

```sql
DELETE FROM "out.c-main.Leads"
WHERE "Status" IN ('Closed');

DELETE FROM "out.c-main.Leads"
WHERE "Region" IN ('EU');
```

##### Legacy Delete Configuration (Deprecated)
For backward compatibility, the following parameters are still supported but not recommended for new implementations:

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "data.csv",
                    "destination": "out.c-main.Leads",
                    "incremental": true,
                    "delete_where_column": "Status",
                    "delete_where_values": ["Closed"],
                    "delete_where_operator": "eq"
                }
            ]
        }
    }
}
{% endhighlight %}

### Files
Another way of downloading files from file uploads is to use an
[Elasticsearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)
or filtering with tags. Note that the results of a file mapping are limited to 10 files (to prevent accidental downloads).
If you need more files, use multiple file mappings.

All files matching the search will be downloaded to the `/data/in/files` folder.
The name of each file has the `fileId_fileName` format. Each file will also contain a
[manifest](/extend/common-interface/manifest-files/) with all information about the file.

#### Input mapping --- query

{% highlight json %}
{
    "storage": {
        "input": {
            "files": [
                {
                    "tags": ["docker-demo"],
                    "query": "name:.zip"
                }
            ]
        }
    }
}
{% endhighlight %}

This will download with files with matching `.zip` **and** having the `docker-demo` tag. Depending on the contents of your
**File uploads** in **Storage**, this may produce something like:

    /data/in/files/75807542_fooBar.zip
    /data/in/files/75807542_fooBar.zip.manifest
    /data/in/files/75807657_fooBarBaz.zip
    /data/in/files/75807657_fooBarBaz.zip.manifest

#### Output mapping --- basic
Define additional properties for uploaded files in the output mapping configuration.
If that file is not present in the `/data/out/files` folder, an error will be thrown.

{% highlight json %}
{
    "storage": {
        "output": {
            "files": [
                {
                    "source": "file.csv",
                    "tags": ["processed-file", "csv"]
                },
                {
                    "source": "image.jpg",
                    "is_public": true,
                    "is_permanent": true,
                    "tags": ["image", "pie-chart"]
                }
            ]
        }
    }
}
{% endhighlight %}

#### Incremental processing
Docker containers may be used to process unknown files incrementally. This means that when a container is run,
it will download any files not yet downloaded and process them. To achieve this behavior, it is necessary
to select only the files which have not been processed yet and tag the processed files.
To achieve the former, use a proper
[Elasticsearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax).
The latter is achieved using the `processed_tags` setting. The `processed_tags` setting is an array of tags
which will be added to the **input** files once they are downloaded. A sample contents of `configData`:

{% highlight json %}
{
    "storage": {
        "input": {
            "files": [
                {
                    "query": "tags: toprocess AND NOT tags: downloaded",
                    "processed_tags": ["downloaded"]
                }
            ]
        }
    }
}
{% endhighlight %}

The above request will download every file with the `toprocess` tag **except** for the files having the `downloaded` tag. 
It will mark each such file with the `downloaded` tag; therefore the query will exclude them on the next run.
This allows you to set up an incremental file processing pipeline.
