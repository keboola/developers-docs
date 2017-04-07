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

## Jobs
Jobs configuration describes API endpoints (resources) which will be extracted. This
includes configuration of HTTP method and parameters. The `jobs` configuration is 
described in a [separate article](/extend/generic-extractor/config/jobs/).

## Mappings
Mappings configuration describes how the JSON response is converted into 
CSV files that will be imported into Storage. The `mappings` configuration 
is described in a [separate article](/extend/generic-extractor/config/mappings/).

## Debug
The `debug` option allows you to turn on more verbose logging which shows 
all HTTP requests sent by the Generic Extractor. Default value is `false`.
You can read more about running Generic Extractor in a 
[separate article](/extend/generic-extractor/running/).

## Output Bucket

## HTTP

## Incremental Output

## User Data



## Config Items

### `incrementalOutput`
- Sets the incremental flag for Docker bundle

### `outputBucket`
- Used **only** if the application doesn't use the default_bucket flag in KBC

### `http`
- Values for required headers defined in [api](/extend/generic-extractor/api/)'s `requiredHeaders`
- See example in the [API config documentation](/extend/generic-extractor/api/)

### `userData`
- A set of `key:value` pairs that will be added to the `root` of all endpoints' results
- Example:

        {
            "config": {
                "userData": {
                    "some": "tag",
                    "another": "identifier"
                }
            }
        }

    - With this config, if the usual result CSV would look like this:

            "id","username"
            "1","Joe",
            "2","Garry"

    - ...the result will instead look like this:

            "id","username","some","another"
            "1","Joe","tag","identifier"
            "2","Garry","tag","identifier"

