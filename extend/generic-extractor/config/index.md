---
title: Generic Extractor Configuration
permalink: /extend/generic-extractor/config/
---

* TOC
{:toc}

The `config` section describes the configuration of the extraction. This incudes mainly 
API endpoints, properties of HTTP requests and mapping between source JSON and target CSV.
The `config` section is one of the two main parts 
(the second part is [`api`](/extend/generic-extractor/api/) of the Generic Extractor configuration.

A sample API configuration can look like this:

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
from within [functions](/extend/generic-extractor/functions/). The keys prefixed by
the hash character `#` are [automatically encrypted](/overview/encryption/) when the configuration is
saved. It is advisable to store sensitive information in such fields. Note however that they 
are not automatic aliases to un-encrypted fields. That means, when you use a `#password` field, you 
must always refer to it as `#password` (e.g. in [functions](/extend/generic-extractor/functions)).
Also, you cannot encrypt any Generic Extractor configuration fields (such as `jobs`, `mappings`, ...).

## Jobs
Jobs configuration describes API endpoints (resources) which will be extracted. This
includes configuration of HTTP method and parameters. The `jobs` configuration is 
**required** and is described in a [separate article](/extend/generic-extractor/config/jobs/).

## Output Bucket
The `outputBucket` option defines the name of the [Storage Bucket](https://help.keboola.com/storage/buckets/) 
in which the extracted tables will be stored. The configuration is **required** unless
the extractor is [registered](todo) as standalone component with the 
[Default Bucket](/extend/common-interface/folders/#default-bucket) option.

The following configuration will make Generic Extractor place all extracted tables 
(the names of the tables are defined by the [`dataType`](/extend/generic-extractor/jobs/#dataType) setting) 
in the `ge-tutorial` bucket:

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
Mappings configuration describes how the JSON response is converted into 
CSV files that will be imported into Storage. The `mappings` configuration is optional and 
is described in a [separate article](/extend/generic-extractor/config/mappings/).

## Debug
The `debug` boolean option allows you to turn on more verbose logging which shows 
all HTTP requests sent by the Generic Extractor. Default value is `false`.
You can read more about running Generic Extractor in a 
[separate article](/extend/generic-extractor/running/).

## HTTP
The `http` option allows you to set HTTP headers sent with every request. This
serves primarily the purpose of providing values for 
[`api.http.requiredHeaders` option](/extend/generic-extractor/api/#required-headers).
It is also possible to use `http` option without the `api.http.requiredHeaders` in 
which case, it is essentially equal to [`api.http.headers`](/extend/generic-extractor/api/#default-headers).

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

See the [full example](todo:074-http-headers).

## Incremental Output
The `incrementalOutput` boolean option allows you to turn on incremental loading for loading 
the extracted data into [Storage](http://help.keboola.com/storage/). This flag in no way affects
the extraction of data. When `incrementalOutput` is set to `true`, the contents of the target 
table in Storage will not be cleared. Default value is `false`. How to configure
Generic Extractor to extract data in increments from an API, is described in a 
[dedicated article](/extend/generic-extractor/incremental/).

See the [full example](todo:075-incremental-output).

## User Data
The `userData` option allows you to add arbitrary data to extracted records. 
The `userData` is an object with arbitrary property names. The property names will be added as columns to all 
extracted records from parent jobs, the property values will be the columns values. It is also possible to 
use [user functions](/extend/generic-extractor/user-functions/) as `userData` property values.

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

And the following response:

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

Will produce the following `users` table:

{% highlight json %}
|id|name|tag|mode|
|123|John Doe|fullExtract|development|
|234|Jane Doe|fullExtract|development|
{% endhighlight %}

The `userData` values are added to parent jobs only, they will not affect 
[child jobs](/extend/generic-extractor/config/jobs/children) anyhow. If the result table contains
columns with the same names as `userData` properties, the original column will be overwritten 
by the values of `userData`.

See the [full example](todo:076-user-data).
