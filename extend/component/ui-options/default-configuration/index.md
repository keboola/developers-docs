---
title: Default Configuration
permalink: /extend/component/ui-options/default-configuration/
---

* TOC
{:toc}

There are situations when you want to help users to speed up configuration of
the component in [Keboola Connection](/overview).

In those situations you can use *Default Configuration* and *Default Row Configuration*
options when configuring your component in [Keboola Developer Portal](https://components.keboola.com/).

{: .image-popup}
![Setting Default Configuration in Developer Portal](/extend/component/ui-options/default-configuration/developer-portal-01.png)

## Default configuration

If you define *Default configuration* for your component, then all new configurations
will be created with this configuration.

Let's assume your component has this JSON set as *Default Configuration*:

{% highlight json %}

{
    "parameters": {
        "debug": true
    }
}

{% endhighlight %}

Then, after new configuration creation, the configuration JSON will look like this:

{% highlight json %}

{
    "changeDescription": "Configuration created",
    "configuration": {
        "parameters": {
            "debug": true
        }
    },
    "created": "2021-06-17T12:14:50+0200",
    "description": "",
    "id": "719629255",
    "name": "My DynamoDB Data Source",
    "state": {},
    "version": 1
}

{% endhighlight %}

## Default Row configuration

The same applies also for rows. If component has *Default Row configuration*
defined, e.g. like this:

{% highlight json %}

{
    "parameters": {
        "verbose": false
    }
}

{% endhighlight %}

Then adding a new row to configuration will use also the default values, and the final configuration
will look like this:

{% highlight json %}

{
    "changeDescription": "Configuration created",
    "configuration": {
        "parameters": {
            "debug": true
        }
    },
    "created": "2021-06-17T12:14:50+0200",
    "description": "",
    "id": "719629255",
    "name": "My DynamoDB Data Source",
    "state": {},
    "version": 2,
    "rowsSortOrder": [],
    "rows": [
        {
            "id": "30645",
            "name": "Test",
            "description": "",
            "isDisabled": false,
            "version": 1,
            "created": "2021-06-17T12:22:19+0200",
            "changeDescription": "Create query Test",
            "state": {},
            "configuration": {
                "parameters": {
                    "verbose": false
                }
            }
        }
    ]
}

{% endhighlight %}
