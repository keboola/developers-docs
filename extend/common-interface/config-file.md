---
title: Configuration File Specification
permalink: /extend/common-interface/config-file/
---

* TOC
{:toc}

Configuration files are one of the [possible channels](/extend/common-interface/) for exchanging data
between components and Keboola Connection (KBC).

To create a sample configuration file (together with the data directory),
use the [Input Data API call](/extend/component/running/#preparing-the-data-folder) via the
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
- `image_parameters`: Configured in the [component settings](https://components.keboola.com/). Contains arbitrary
parameters passed to the component. They cannot be modified by the end-user. The typical use for this section are
global component parameters (such as token, URL, version of your API).
- `authorization`: Contains Oauth2 [authorization contents](/extend/common-interface/oauth/).
- `action`: Name of the [action](/extend/common-interface/actions/) to execute; defaults to `run`. All
actions except `run` have a strict execution time limit of 30 seconds.
See [actions](/extend/common-interface/actions/) for more details.


## State File
The state file is used to store the component state for the next run. It provides a two-way communication between
KBC configuration state storage and the component. The state file only works if the API call
references a stored configuration (`config` is used, not `configData`).

The location of the state file is:

- `/data/in/state.json` loaded from a configuration state storage
- `/data/out/state.json` saved to a configuration state storage

The component reads the input state file and writes any content to the output state
file (valid JSON) that
will be available to the next API call. A missing or an empty file will remove the state value.
A state object is saved to configuration storage only when actually running the app
(not in [sandbox API calls](https://kebooladocker.docs.apiary.io/#reference/sandbox). The state must be a valid JSON file.

### State File Properties
Because the state is stored as part of a
[Component configuration](http://docs.keboola.apiary.io/#reference/component-configurations),
the value of the state object is somewhat limited (should not generally exceed 1MB). It should not
be used to store large amounts of data.

Also, the end-user cannot easily access the data through the UI.
The data can be, however, modified outside of the component itself using the
[Component configuration](http://docs.keboola.apiary.io/#reference/component-configurations) API calls.

**Important:** The state file is not thread-safe. If multiple instances of the *same configuration*
are run simultaneously in the *same project*, the one writing data later wins. Use the state file more
as an HTTP Cookie than as a Database. A typical use for the state file would be saving the last record
loaded from some API to enable incremental loads.

## Usage File

Unlike the state file, the **usage file is one way only** and has a pre-defined structure.
The usage file is used to pass information from the component to Keboola Connection.
Metrics stored are used to determine how much resources the job consumed and translate the usage to KBC
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

To keep track of the consumed resources in the case of an component failure, **it is recommended to
write the usage file regularly** during the component run, not only at the end.

*Note: As the structure of the state file is pre-defined, the content of the usage file is strictly
validated and a wrong format will cause an component failure.*

## Examples
To create an example configuration, use the [Input Data API call](/extend/component/running/#preparing-the-data-folder). You will get a
`data.zip` archive in your *Storage* --- *File uploads*, which will contain the `config.json` file.
You can also use these configuration structure to create an API request for
actually [running a component](http://docs.kebooladocker.apiary.io/#reference/run/create-a-job).
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
                    "delete_where_values": [],
                    "delete_where_operator": "eq",
                    "delimiter": ",",
                    "enclosure": "\""
                },
                {
                    "source": "destination1.csv",
                    "destination": "out.c-main.test2"
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
Input mapping parameters are similar to the [Storage API export table options ](http://docs.keboola.apiary.io/#tables).
If `destination` is not set, the CSV file will have the same name as the table (without adding `.csv` suffix).
The tables element in a configuration of the **input mapping** is an array and supports the following attributes:

- `source`
- `destination`
- `days` (internally converted to `changed_since`)
- `columns`
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
  - `delete_where_column`
  - `delete_where_operator`
  - `delete_where_values`
  - `delimiter`
  - `enclosure`

#### Input Mapping --- Basic
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


#### Input Mapping --- Incremental Load
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

#### Input Mapping --- Select Columns

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

#### Input Mapping --- Filtered Table

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

#### Output Mapping --- Basic
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

#### Output Mapping --- Headless CSV
Upload CSV file `/data/out/tables/data.csv` that does not have headers on the first line to table `out.c-main.data`.

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

#### Output Mapping --- Set Additional Properties
Incrementally upload `/data/out/tables/data.csv` to `out.c-main.data`.
with a compound primary key set on columns `column1` and `column2`.

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

#### Output Mapping --- Delete Rows
Delete data from the `destination` table before uploading the CSV
file (only makes sense with `incremental: true`).

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

#### Input Mapping --- Query

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
*File uploads* in *Storage*, this may produce something like:

    /data/in/files/75807542_fooBar.zip
    /data/in/files/75807542_fooBar.zip.manifest
    /data/in/files/75807657_fooBarBaz.zip
    /data/in/files/75807657_fooBarBaz.zip.manifest

#### Input Mapping --- Run Id
Use the `filter_by_run_id` option to select only files which are related to the job
currently being executed. If `filter_by_run_id` is specified, we will download only files which
satisfy the filter (either `tags` or `query`) *and* were uploaded by a parent job (a job with same
or parent runId). This allows you to further limit downloaded files only to those related to a
current chain of jobs.

{% highlight json %}
{
    "storage": {
        "input": {
            "files": [
                {
                    "tags": ["fooBar"],
                    "filter_by_run_id": true
                }
            ]
        }
    }
}
{% endhighlight %}

This will download only files with the `fooBar` tag that were produced by a parent job to
the currently running Docker.

#### Output Mapping --- Basic
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

#### Incremental Processing
Docker containers may be used to process unknown files incrementally. This means that when a container is run,
it will download any files not yet downloaded, and process them. To achieve this behavior, it is necessary
to select only the files which have not been processed yet and tag the processed files.
To achieve the former, use a proper
[ElasticSearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax).
The latter is achieved using the `processed_tags` setting. The `processed_tags` setting is an array of tags
which will be added to the *input* files once they are downloaded. A sample contents of `configData`:

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

The above request will download every file with the `toprocess` tag **except** for the files having the `downloaded` tag. It will mark each such file with the `downloaded` tag; therefore the query will exclude them on the next run.
This allows you to set up an incremental file processing pipeline.
