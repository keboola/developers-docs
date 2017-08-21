---
title: Docker Runner
permalink: /integrate/docker-runner/processors/
---

* TOC
{:toc}

Processors are additional components which may be used before or after running an arbitrary component 
(extractor, writer, ...). When [Docker Runner](/integrate/docker-runner/) runs a docker image, a processor 
may be used to pre-process the inputs (files or tables) supplied to that image, or it may be used to post-process 
the image outputs. For example, if an extractor extracts CSV data in a non-UTF8 encoding, you can use the 
[`inconv` processor](https://github.com/keboola/processor-iconv/blob/master/README.md) as a post-processor to 
convert the CSV to UTF-8 as expected by [Storage](https://help.keboola.com/storage/).

## Configuration
Processors are technically supported in any configuration. However, the option may not always be available in 
the UI. To manually configure processors, you have to use the [Component Configuration API](http://docs.keboola.apiary.io/#reference/component-configurations). By running the
[Get Configuration Detail](http://docs.keboola.apiary.io/#reference/component-configurations/manage-configurations/configuration-detail)
request for a specific component ID and configuration ID, you obtain the actual configuration contents, for example:

{% highlight json %}
{
    "id": "308777544",
    "name": "test processor",
    "description": "Sample configuration",
    "created": "2017-08-15T17:56:27+0200",
    "creatorToken": {
        "id": 27978,
        "description": "ondrej.popelka@keboola.com"
    },
    "version": 7,
    "changeDescription": "",
    "isDeleted": false,
    "configuration": {
        "parameters": {
            "port": null,
            "user": "sample-user",
            "#pass": "KBC::ComponentProjectEncrypted==UqmyW3WbQ=",
            "ftpUrl": "ftp.example.com",
            "mappings": [
                {
                    "compression": "NONE",
                    "ftpPath": "/html/tmp/sample2.tsv",
                    "delimiter": "\\t",
                    "srcCharset": "UTF-8",
                    "sapiPath": "in.c-processor-test.sample2-tsv",
                    "pkey": [],
                    "enclosure": "'",
                    "prefix": "",
                    "isFolder": 0,
                    "incremental": 0,
                    "extension": "csv"
                }
            ],
            "protocol": "FTP",
            "timezone": "Europe/Prague"
        },
        "processors": {
            "after": [
                {
                    "definition": {
                        "component": "keboola.processor-headers"
                    },
                    "parameters": {
                        "delimiter": "|",
                        "enclosure": "'"
                    }
                }
            ]
        }
    },
    "rows": [],
    "state": [],
    "currentVersion": {
        "created": "2017-08-16T21:20:37+0200",
        "creatorToken": {
            "id": 27978,
            "description": "ondrej.popelka@keboola.com"
        },
        "changeDescription": ""
    }
}
{% endhighlight %}

From this, the actual configuration is the contents of the `configuration` node. Therefore:

{% highlight json %}
{
    "parameters": {
        "port": null,
        "user": "sample-user",
        "#pass": "KBC::ComponentProjectEncrypted==UqmyW3WbQ=",
        "ftpUrl": "ftp.example.com",
        "mappings": [
            {
                "compression": "NONE",
                "ftpPath": "/html/tmp/sample2.tsv",
                "delimiter": "\\t",
                "srcCharset": "UTF-8",
                "sapiPath": "in.c-processor-test.sample2-tsv",
                "pkey": [],
                "enclosure": "'",
                "prefix": "",
                "isFolder": 0,
                "incremental": 0,
                "extension": "csv"
            }
        ],
        "protocol": "FTP",
        "timezone": "Europe/Prague"
    },
    "processors": {
        "after": [
            {
                "definition": {
                    "component": "keboola.processor-headers"
                },
                "parameters": {
                    "delimiter": "|",
                    "enclosure": "'"
                }
            }
        ]
    }
}
{% endhighlight %}

Processors are configured in the `processors` section in the `before` array or the `after` array (rarely both). 
The above configuration defines that a `keboola.processor-headers` processor (the headers processor fills missing 
columns in a CSV file) will run **after** this particular configuration of an FTP extractor is finished,
but **before** its results are loaded into Storage. After the processor is finished, its outputs are loaded
into Storage as if they were the outputs of the extractor itself.

To save the configuration, you need to use the [Update Configuration API call](http://docs.keboola.apiary.io/#reference/component-configurations/manage-configurations/update-configuration). 
It is also advisable to [minify the JSON](http://www.cleancss.com/json-minify/) to avoid whitespace issues. 
Also note that if the configuration contains literal `+`, it has to be [urlencoded](https://www.urlencoder.org/) as `%2B`.

### Available Processors
To obtain a list of available processors, use the [List apps public API](http://docs.kebooladeveloperportal.apiary.io/#reference/0/public-api/list-published-apps) 
of the Developer portal. By sending a `GET` request to `https://apps.keboola.com/apps`, you'll obtain a list of all
public KBC components. Processors are components with the type `processor`, for example:

{% highlight json %}
{
    "id": "keboola.processor-headers",
    "isPublic": true,
    "createdOn": "2017-08-16T14:17:39.000Z",
    "createdBy": "ondrej.popelka@keboola.com",
    "deletedOn": null,
    "isDeprecated": false,
    "expiredOn": null,
    "replacementApp": null,
    "version": 7,
    "name": "Headers",
    "type": "processor",
    "shortDescription": null,
    "longDescription": null,
    "licenseUrl": null,
    "documentationUrl": "https://github.com/keboola/processor-headers",
    "requiredMemory": null,
    "processTimeout": null,
    "encryption": true,
    "network": "bridge",
    "defaultBucket": false,
    "defaultBucketStage": null,
    "forwardToken": false,
    "forwardTokenDetails": false,
    "injectEnvironment": true,
    "cpuShares": null,
    "uiOptions": [],
    "imageParameters": null,
    "testConfiguration": null,
    "configurationSchema": null,
    "configurationDescription": null,
    "configurationFormat": "json",
    "emptyConfiguration": null,
    "actions": [],
    "fees": false,
    "limits": null,
    "logger": "standard",
    "loggerConfiguration": null,
    "stagingStorageInput": "local",
    "permissions": [],
    "uri": "docker/keboola.processor-headers",
    "vendor": {
        "id": "keboola",
        "name": "Keboola",
        "address": "Křižíkova 488/115, Praha, CZ",
        "email": "support@keboola.com"
    },
    "repository": {
        "type": "ecr",
        "uri": "147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/keboola.processor-headers",
        "tag": "0.1.1",
        "options": {
            "region": "us-east-1"
        }
    },
    "icon": {
        "32": null,
        "64": null
    }
}
{% endhighlight %}

The important parts are `id`, which is required for configuration, and `documentationUrl`, which describes
additional parameters of the processor.

### Configuring parameters
A processor may allow (or require) parameters. These are entered in the `parameters` section. 
The below configuration sets the value for two parameters --- `delimiter` and `enclosure`:

{% highlight json %}
{
    "processors": {
        "after": [
            {
                "definition": {
                    "component": "keboola.processor-headers"
                },
                "parameters": {
                    "delimiter": "|",
                    "enclosure": "'"
                }
            }
        ]
    }
}
{% endhighlight %}

The names and allowed values of parameters are fully up to the processor interpretation and validation.

## Implementing Processors
Implementing a processor is in principle the same as implementing any other 
[docker extension](https://developers.keboola.com/extend/docker/). However, processors are designed to be 
[Single Responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle) components. This 
means, for example, that processors should require no or very little configuration, should not communicate 
over a network and should be fast. To maintain the implementation of processors as simple as possible, 
simple scalar parameters can be injected into the environment variables. For instance, the parameters:

{% highlight json %}
{
    "parameters": {
        "delimiter": "|",
        "enclosure": "'"
    }
}
{% endhighlight %}

will be available in the processor as the environment variables `KBC_PARAMETER_DELIMITER` and 
`KBC_PARAMETER_ENCLOSURE`. This simplifies the implementation in that it is not necessary to process the 
[configuration file](https://developers.keboola.com/extend/common-interface/config-file/). This parameter 
injection works only if the values of the parameters are scalar. If you need non-scalar values, you have to pass them through the config file (and disable `injectEnvironment` component setting).

### Processor Registration 
The process of processor registration is the same as the 
[registration of any other component](https://developers.keboola.com/extend/registration/). However, many 
of the fields do not apply. The following fields are important:

- Vendor
- Application name and Application type (`processor`)
- Short and Full Description
- Component Documentation (`documentationUrl`)
- Whether to inject the environment variables (`injectEnvironment`)










