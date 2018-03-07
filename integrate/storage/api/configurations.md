---
title: Component Configurations Tutorial
permalink: /integrate/storage/api/configurations/
---

* TOC
{:toc}

[Configurations](https://help.keboola.com/storage/configurations/) are an important part of a KBC project. Most operations are
available in the UI, use the API if you want to manipulate them programmatically.

When working with the [component configurations API](http://docs.keboola.apiary.io/#reference/component-configurations),
you usually need to know the `componentId`.
You can see a list of public components in [the developer portal](https://components.keboola.com/components), or you can get a list of all available components with the [API index call](http://docs.keboola.apiary.io/#reference/miscellaneous/api-index/get),
see [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#f0e321e0-6533-0074-662d-fe4ab85a15d5).

It will give you something like this:

{% highlight json %}
{
    "host": "6f151bc57e25",
    "api": "storage",
    "version": "v2",
    "revision": "11dc5566bfe7d09ec93dfa7c252423904408891e",
    "documentation": "http://docs.keboola.apiary.io/",
    "components": [
        {
            "id": "keboola.ex-db-snowflake",
            "type": "extractor",
            "name": "Snowflake",
            "description": "Cloud-Native Elastic Data Warehouse Service",
            "data": {
                "definition": {
                    "type": "aws-ecr",
                    "uri": "147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/keboola.ex-db-snowflake",
                    "tag": "1.2.5"
                },
                "vendor": {...}
            },
            "flags": [
                "genericDockerUI",
                "encrypt"
            ],
            "uri": "https://syrup.keboola.com/docker/keboola.ex-db-snowflake",
            "documentationUrl": "https://github.com/keboola/db-extractor-snowflake/blob/master/README.md"
        }
    ],
    "services": [...],
    "urlTemplates": {...}
}
{% endhighlight %}

From here, you can select a particular component. In the following examples, we
will use `keboola.ex-db-snowflake` --- the Snowflake Database Extractor.

### Inspecting Configuration
To obtain configuration details, use the [List Configs call](http://docs.keboola.apiary.io/#reference/component-configurations/component-configs/list-configs),
which will return all the configuration details. This means

- the configuration itself (`configuration`) --- section on configuration follows;
- configuration rows (`rows`) --- additional data of the configuration; and
- configuration state (`state`) --- [component state](/extend/common-interface/config-file/#state-file).

Please note that the contents
of the `configuration`, `rows` and `state` section depend purely on the component itself. See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#0e4f6c71-89af-ca3f-ee04-fabc1a4529ad)

A sample result for Snowflake extractor looks like this:

{% highlight json %}
[
    {
        "id": "328864809",
        "name": "Sample database",
        "description": "",
        "created": "2017-11-06T13:28:48+0100",
        "creatorToken": {
            "id": 27865,
            "description": "ondrej.popelka@keboola.com"
        },
        "version": 3,
        "changeDescription": "Create query account",
        "isDeleted": false,
        "configuration": {
            "parameters": {
                "db": {
                    "port": 443,
                    "ssh": {
                        "sshPort": 22
                    },
                    "host": "kebooladev.snowflakecomputing.com",
                    "user": "HELP_TUTORIAL",
                    "#password": "KBC::ComponentProjectEncrypted==r1C314c+6+W50aKQp6yyKjgaN31q+2gyo28R+L5u8cmbf2taSWlrzR5AfhDOIYFMH5b8XUj2K16iHWMHLrUWaA==",
                    "database": "HELP_TUTORIAL",
                    "schema": "HELP_TUTORIAL",
                    "warehouse": "DEV"
                },
                "tables": [
                    {
                        "enabled": true,
                        "incremental": false,
                        "outputTable": "in.c-keboola-ex-db-snowflake.account",
                        "primaryKey": [],
                        "query": "SELECT * FROM account;",
                        "id": 25998,
                        "name": "account"
                    }
                ]
            }
        },
        "rowsSortOrder": [],
        "rows": [],
        "state": [],
        "currentVersion": {
            "created": "2017-11-06T13:30:12+0100",
            "creatorToken": {
                "id": 27865,
                "description": "ondrej.popelka@keboola.com"
            },
            "changeDescription": "Create query account"
        }
    }
]
{% endhighlight %}

The important part is the configuration id `328864809`, which is required in the
following examples.

### Configuration Versions
When you [update a configuration](http://docs.keboola.apiary.io/#reference/component-configurations/manage-configs/update-config),
actually a new configuration version is created. In the above calls, only the last (active/published) configuration
is returned. To obtain a list of all recorded versions, use the
[list versions call](http://docs.keboola.apiary.io/#reference/component-configurations/list-configs-versions/versions-list).
See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#0e4f6c71-89af-ca3f-ee04-fabc1a4529ad)
which would give you the following output:

{% highlight json %}
[
  {
    "version": 2,
    "created": "2016-05-30T18:04:04+0200",
    "creatorToken": {
      "id": 53044,
      "description": "ondrej.popelka@keboola.com"
    },
    "changeDescription": "",
    "name": "Sample database",
    "description": ""
  },
  {
    "version": 1,
    "created": "2016-05-30T18:01:42+0200",
    "creatorToken": {
      "id": 53044,
      "description": "ondrej.popelka@keboola.com"
    },
    "changeDescription": "",
    "name": "Sample database",
    "description": ""
  }
]
{% endhighlight %}

The field `version` represents the `version_id` in the following API example.

### Creating a Configuration Copy
When you have chosen a particular version, you can create a new independent
[configuration copy](http://docs.keboola.apiary.io/#reference/component-configurations/copy-configs/create-config-copy)
out of it. See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#0e4f6c71-89af-ca3f-ee04-fabc1a4529ad)
how to create a new configuration called `test-copy` from version `3` of the `328864809` configuration
for the `keboola.ex-db-snowflake` component.

It will return the ID of the newly created configuration:
{% highlight json %}
{
    "id": "328874097"
}
{% endhighlight %}

### Modifying a configuration
Modifying a configuration version means that a new version is created. For modifying a configuration, use the
[Update configuration](https://keboola.docs.apiary.io/#reference/component-configurations/manage-configurations/update-configuration) API call.

See an [example](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#0e4f6c71-89af-ca3f-ee04-fabc1a4529ad) for modifying a
configuration to `{"foo": "bar"}`. Notice that configuration must be sent in a form field as the endpoint does not accept pure JSON (yet).
You should always check the component configuration documentation for the supported configuration options. Using unsupported options may lead to
funny results.
