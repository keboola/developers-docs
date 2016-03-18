---
title: Configuration file Specification
permalink: /extend/common-interface/config-file/
---

Any dockerized application and Keboola Connection, uses 
predefined set of [structured folders](/extend/common-interface/), 
files and [configuration file](/extend/common-interface/config-file/) which is specifid below.
Additionaly, there are also [environment specification](/extend/common-interface/environment) in which 
the application is executed.

To create a sample configuration file (toghether with the data directory), you can 
use [create sandbox](/extend/common-interface/) via the
[Docker bundle API](http://docs.kebooladocker.apiary.io/#reference/sandbox). 
You'll get all the resources in a ZIP archive you need to access in your app. 

## Configuration file format
For [docker extensions](/extend/docker/), the configuration file format is specified, during
[registration](/extend/registration/) as either JSON or Yaml. For Docker extensions which are not
yet registred, you can choose freely. For [Custom Science](/extend/custom-science/) and 
for [Transformations](https://help.keboola.com/???), the format is always JSON. There are no differences
in the contents of the file, the choice of format is purely formal. Note however that the configuration file 
extension changes (`.json` for JSON and `.yml` for Yaml)

## Configuration file structure
The configuration files has the following root nodes:

- `storage` - Contains both input and output mapping for both files and tables. This section is important if your
application uses dynamic input/output mapping. Simple applications can be created with static input/output mapping
which do not use this configuration section at all (see [Custom Science Quick Start](/extend/custom-science/quick-start/)).  
- `parameters` - Contains arbitrary parameters passed from UI to the application. This section can be used in any
way you wish. Your application should validate the contents of this section. For passing sensitive 
data, you should use [encryption](/overview/encryption/). This section is not available in Transformations.
- `image_parameters` - Available only for [registered docker extensions](/extend/registration/). Contains arbitrary
paramters passed to the application, which cannot be modified by the end user. The typical use for this section are 
global application parameters (such as token, URL, version of your API) 
- `authorization` - Available only for [registered docker extensions](/extend/registration/). Contains Oauth2 
[autorization contents](/extend/common-interface/oauth/). 

 
## State file

State file is used to store component state for the next run. It provides a two-way communication between 
Keboola Connection configuration state storage and the application. State file only works if the API call 
references a stored configuration (`config` is used, not `configData`).

The location of state file is: 

- `/data/in/state.yml` or `/data/in/state.json` loaded from configuration state storage
- `/data/out/state.yml` or `/data/out/state.json` saved to configuration state storage

The application can read the input state file and write any content to the output state 
file (valid JSON or YAML) and that 
will be available to the next API call. Missing or empty file will remove the state value. 
State object is is saved to configuration storage only when actually running the app 
(not in [sandbox API calls](/extend/common-interface/sadnbox/). State must be a valid JSON or Yaml.

### State file properties
Because state is stored as part of 
[Component configuration](http://docs.keboola.apiary.io/#reference/component-configurations),
the value of the state object is somewhat limited (should not generally exceed 1MB). It should not
be used to store large amounts of data. Also the end-user cannot easily access the data through UI.
The data can be however modified outside of the dockerized application itself using the
[Component configuration](http://docs.keboola.apiary.io/#reference/component-configurations) API calls.

Also note that the statefile is not thread-safe in that if multiple instances of the *same configuration*
in a *same project* are run simulatnously, the one, who writes data later wins. Use the state file more
like a HTTP Cookie then like a Database. Typical use for the state file would be saving last record 
loaded from some API to enable incremental loads.  

     
## Examples
To create an example configuration, use the [sandbox API calls](/extend/common-interface/sandbox/). You will get a 
`data.zip` archive in your *Storage* - *File uploads* which will contain the config.json or config.yml file.
You can also use these structures to create API request for [creating sandbox](/extend/common-interface/sandbox/)
and also for actually [running dockerizied applications](http://docs.kebooladocker.apiary.io/#reference/run/create-a-job).
If you want to manually pass configuration options in the API request, be sure to wrap it around in `configData` node. 

Sample configuration file might look like this:

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
                    "primary_key": [],
                    "delete_where_values": [],
                    "delete_where_operator": "eq",
                    "delimiter": ",",
                    "enclosure": "\"",
                    "escaped_by": ""
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
    "image_parameters": []
}  
{% endhighlight %}

### Tables
Tables from input mapping are mounted to `/data/in/tables`. 
Input mapping parameters are similar to [Storage API export table options ](http://docs.keboola.apiary.io/#tables). 
If `destination` is not set, the CSV file will have the same name as the table (without adding `.csv` suffix).
The tables element in configuration of **input mapping** is an array and supports these attributes:

- `source`
- `destination`
- `changed_since`
- `columns`
- `where_column`
- `where_operator`
- `where_values`
- `limit`

Output mapping parameters are similar 
to [Transformation API output mapping ](http://wiki.keboola.com/home/keboola-connection/devel-space/integrating-with-kbc/transformations/intro#TOC-Output-mapping). 
`destination` is the only required parameter. If `source` is not set, the CSV file is expected to have the same name 
as the `destination` table. 
The tables element in configuration of **output mapping** is an array and supports these attributes:

  - `source`
  - `destination`
  - `incremental`
  - `primary_key`
  - `delete_where_column`
  - `delete_where_operator`
  - `delete_where_values`
  - `delimiter`
  - `enclosure`

#### Input mapping - Basic
Download tables `in.c-ex-salesforce.Leads` and `in.c-ex-salesforce.Accounts` to `/data/tables/in/leads.csv` 
and `/data/tables/in/accounts.csv`

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
    
In an API request this would be passed as:

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


#### Input mapping - Incremental load
Download 2 days of data from table `in.c-storage.StoredData` to `/data/tables/in/in.c-storage.StoredData`

{% highlight json %}
{
    "storage": {
        "input": {
            "tables": [
                {
                    "source": "in.c-storage.StoredData",
                    "changed_since": "-2 days"
                }
            ]
        }
    }
}
{% endhighlight %}

#### Input mapping - Select columns

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

#### Input mapping - Filtered table

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

### Output mapping - Basic
Upload `/data/out/tables/out.c-main.data.csv` to `out.c-main.data`

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": {
                [
                    "source": "out.c-main.data.csv",
                    "destination": "out.c-main.data"
                ]
            }
        }
    }
}
{% endhighlight %}

### Output mapping - Set additional properties
Upload `/data/out/tables/data.csv` to `out.c-main.data`.
with a primary key and incrementally.

{% highlight json %}
{
    "storage": {
        "output": {
            "tables": [
                {
                    "source": "data.csv",
                    "destination": "out.c-main.data",
                    "incremental": true,
                    "primary_key": ["id"]
                }
            ]
        }
    }
}
{% endhighlight %}
    
### Output mapping - Delete rows
Delete data from `destination` table before uploading the CSV 
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
You can also download files from file uploads using an 
[Elasticsearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax) 
or filtering using tags. Note that the results of a file mapping are limited to 10 files (to prevent accidental downloads). 
If you need more files you can use multiple file mappings.  

All files that will match the search will be downloaded to the `/data/in/files` folder. 
The name of each file has the format `fileId_fileName`. Each file will also contain a 
[manifest](/extend/common-interface/manifest-files/) with all information about the file.

#### Input mapping - Query

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

Will download with files with matching `.zip` **and** having tag `docker-demo`, depdending on the contents of your 
*File uploads* in *Storage*, this may produce something like:

    /data/in/files/75807542_fooBar.zip
    /data/in/files/75807542_fooBar.zip.manifest
    /data/in/files/75807657_fooBarBaz.zip
    /data/in/files/75807657_fooBarBaz.zip.manifest        
 
#### Input mapping - Run Id
You can also use `filter_by_run_id` option to select only files which are related to the job 
currently beeing executed. If `filter_by_run_id` is specified, we will download only files which 
satisfy the filter (either `tags` or `query`) *and* were uploaded by a parent job (a job with same 
or parent runId). This allows you to further limit downloaded files only to thoose related to a 
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

This will download only file which have the tag `fooBar` and were produced by a parent job to
the currently running docker.

#### Output mapping - Basic
You can define additional properties for uploaded files in the output mapping configuration. If 
that file is not present in the `/data/out/files` folder, an error will be throws. 

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

### Incremental Processing
Docker containers may be used to process unknown files incrementally. This means that when a container is run, 
it will download any files not yet downloaded, and process them. To achieve this behavior, it is necessary 
to select only the files which have not been processed yet and tag processed files. 
The former can be achieved by using proper
[ElasticSearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)  
and the latter is achieved using the `processed_tags` setting. `processed_tags` setting is an array of tags
which will be added to the *input* files once they are downloaded. A sample contents of `configData`:

{% highlight json %}   
{
    "storage": {
        "input": {
            "files": [
                {
                    "query": "tags: toprocess AND NOT tags: downloaded",
                    "processed_tags": ["downloaded", "my-image"]
                }
            ]
        }
    }
}
{% endhighlight %}

The above request will download every file with tag `toprocess` except for files which have 
tag `downloaded`. It will mark each such file with tags `my-image` and `downloaded` and tag 
to all processed files and the query will exclude them on the next run. 
This allows you to set up incremental file processing pipeline. 

 




