---
title: Processors
permalink: /extend/component/processors/
redirect_from:
    - /integrate/docker-runner/processors/
    - /extend/docker-runner/processors/
---

* TOC
{:toc}

Processors are additional components which may be used before or after running an arbitrary component
(extractor, writer, ...). When [Docker Runner](/extend/docker-runner/) runs a docker image, a processor
may be used to pre-process the inputs (files or tables) supplied to that image, or it may be used to post-process
the image outputs. For example, if an extractor extracts CSV data in a non-UTF8 encoding, you can use the
[`iconv` processor](https://github.com/keboola/processor-iconv/blob/master/README.md) as a post-processor to
convert the CSV to UTF-8 as expected by [Storage](https://help.keboola.com/storage/). See the
[tutorial](/extend/component/tutorial/configuration/) for a quick example of using processors.

## Configuration
Processors are technically supported in any configuration. However, the option may not always be
[available in the UI](/extend/component/ui-options/#genericdockerui-processors). To manually configure processors,
you have to use the [Component Configuration API](http://docs.keboola.apiary.io/#reference/component-configurations). By running the
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
You can obtain a list of available processors using the
[Developer Portal UI](https://components.keboola.com/components) or using the [List apps public API](http://docs.kebooladeveloperportal.apiary.io/#reference/0/public-api/list-published-apps)
of the Developer portal. The important parts are `id`, which is required for configuration,
and `documentationUrl`, which describes additional parameters of the processor.

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
[component](/extend/component/). However, processors are designed to be
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
[configuration file](/extend/common-interface/config-file/). This parameter
injection works only if the values of the parameters are scalar. If you need non-scalar values, you have to pass them through the config file (and disable `injectEnvironment` component setting).

### Publishing a Processor
The process of processor registration is the same as the
[publishing any other component](/extend/publish/). However, many of the fields do not apply.
The following fields are important:

- Vendor
- Component name and component type (`processor`)
- Short and Full Description
- Component Documentation (`documentationUrl`)
- Whether to inject the environment variables (`injectEnvironment`)
