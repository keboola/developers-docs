---
title: Extraction Configuration
permalink: /extend/generic-extractor/configuration/config/
---

* TOC
{:toc}

*To configure your first Generic Extractor, follow our [tutorial](/extend/generic-extractor/tutorial/).*
*Use [Parameter Map](/extend/generic-extractor/map/) to help you navigate among various 
configuration options.*

The `config` section of Generic Extractor configuration **describes the actual extraction**, including properties of HTTP requests, 
and mapping between source JSON and target CSV. 
  
A sample `config` configuration can look like this:

{% highlight json %}
{
    ...,
    "config": {
        "debug": false,
        "outputBucket": "ge-tutorial",
        "incrementalOutput": false,
        "jobs": [
            ...
        ],
        "mappings": {
            ...
        },
        "http": {
            ...
        },
        "userData": {
            ...
        }
    }
}
{% endhighlight %}

Apart from the properties listed below, the `config` section can contain any number of
other properties which are not used by Generic Extractor itself, but may be referenced
from within [functions](/extend/generic-extractor/functions/). 

The keys prefixed by the hash character `#` are [automatically encrypted](/overview/encryption/) when the 
configuration is saved. It is advisable to store sensitive information in such fields. Note, however, they 
are not automatic aliases to un-encrypted fields. That means that when using a `#password` field, you 
must always refer to it as `#password` (for instance, in [functions](/extend/generic-extractor/functions)).
Also, you cannot encrypt any Generic Extractor configuration fields (such as `jobs`, `mappings`, ...).

## Jobs
The Jobs configuration describes the API endpoints (resources) which will be extracted. This
includes configuring the HTTP method and parameters. The `jobs` configuration is 
**required** and is described in a [separate article](/extend/generic-extractor/configuration/config/jobs/).

## Output Bucket
The `outputBucket` option defines the name of the [Storage Bucket](https://help.keboola.com/storage/buckets/) 
in which the extracted tables will be stored. The configuration is **required** unless
the extractor is [registered](/extend/generic-extractor/registration/) as a standalone component with the 
[Default Bucket](/extend/common-interface/folders/#default-bucket) option.

The following configuration will make Generic Extractor put all extracted tables in the `ge-tutorial` bucket
(the names of the tables are defined by the [`dataType`](/extend/generic-extractor/configuration/config/jobs/#dataType) setting):

{% highlight json %}
{
    ...,
    "config": {
        "outputBucket": "ge-tutorial",
        ...
    }
}
{% endhighlight %}

If you omit the `outputBucket` configuration, you will receive an error similar to this:

    CSV file 'campaigns' file name is not a valid table identifier, either set output mapping for 'campaigns' or make sure that the file name is a valid Storage table identifier.

## Mappings
The Mappings configuration describes how the JSON response is converted into 
CSV files that will be imported into Storage. The `mappings` configuration is **optional** and 
is described in a [separate article](/extend/generic-extractor/configuration/config/mappings/).

## Debug
The `debug` boolean option allows you to turn on more verbose logging which shows 
all HTTP requests sent by Generic Extractor. The default value is `false`.
Read more about running Generic Extractor in a [separate article](/extend/generic-extractor/running/).

## HTTP
The `http` option allows you to set the HTTP headers sent with every request. This primarily serves the purpose of providing values for [`api.http.requiredHeaders` option](/extend/generic-extractor/configuration/api/#required-headers).
It is also possible to use the `http` option without `api.http.requiredHeaders` in 
which case it is essentially equal to [`api.http.headers`](/extend/generic-extractor/configuration/api/#default-headers).

{% highlight json %}
{
    ...,
    "config": {
        "http": {
            "headers": {
                "X-AppKey": "ThisIsSecret"
            }
        },
        ...        
    }
}
{% endhighlight %}

See [example [EX074]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/074-http-headers).

## Incremental Output
The `incrementalOutput` boolean option allows you to load the extracted data into 
[Storage](http://help.keboola.com/storage/) incrementally. This flag in no way affects the data extraction. 
When `incrementalOutput` is set to `true`, the contents of the target table in Storage will not be cleared. 
The default value is `false`. 

How to configure Generic Extractor to extract data in increments from an API 
is described in a [dedicated article](/extend/generic-extractor/incremental/).

See [example [EX075]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/075-incremental-output).

## User Data
The `userData` option allows you to add arbitrary data to extracted records. 
It is an object with arbitrary property names which are added as columns to all records extracted 
from parent jobs. The property values are the columns values. It is also possible to use 
[functions](/extend/generic-extractor/functions/) as `userData` property values.

The following configuration:

{% highlight json %}
{
    "config": {
        "userData": {
            "tag": "fullExtract",
            "mode": "development"
        }
    }
}
{% endhighlight %}

and the following response:

{% highlight json %}
[
    {
        "id": 123,
        "name": "John Doe"
    },
    {
        "id": 234,
        "name": "Jane Doe"
    }
]
{% endhighlight %}

will produce the following `users` table:

{% highlight json %}
|id|name|tag|mode|
|123|John Doe|fullExtract|development|
|234|Jane Doe|fullExtract|development|
{% endhighlight %}

The `userData` values are added to the parent jobs only. They will not affect the
[child jobs](/extend/generic-extractor/configuration/config/jobs/children). If the result table contains
columns with the same names as the `userData` properties, the original column will be overwritten 
by the values of `userData`.

See [example [EX076]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/076-user-data).
