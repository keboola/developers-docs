---
title: Component Configurations Tutorial
permalink: /integrate/storage/api/configurations/
---

* TOC
{:toc}

When working with the [component configurations API](http://docs.keboola.apiary.io/#reference/component-configurations), 
you usually need to know the `componentId`. 
You can get a list of all available components with the [API index call](http://docs.keboola.apiary.io/#reference/miscellaneous/api-index/get).
It is one of the few API calls that do not require a Storage API token:

{% highlight bash %}
curl https://connection.keboola.com/v2/storage
{% endhighlight %}

It will give you something like this:

{% highlight json %}
{
  "host": "kbc-vpc-sapi-API-i-a528a139",
  "api": "storage",
  "version": "v2",
  "revision": "2da5001f458cd14b03f547a62ed3e897d7baa93c",
  "documentation": "http://docs.keboola.apiary.io/",
  "components": [
      ...
    {
      "id": "keboola.ex-db-mysql",
      "type": "extractor",
      "name": "MySQL",
      "description": "World's most popular open source database",
      "configurationDescription": null,
      "uri": "https://syrup.keboola.com/docker/keboola.ex-db-mysql",
      ...
    }
    ...
  ],
  "urlTemplates": {
    "orchestrationJob": "/admin/projects/&&projectId&&/orchestrations/&&orchestrationId&&/jobs/&&jobId&&"
  }
}
{% endhighlight %}

From here, you can select a particular component. In the following examples, we
will use `keboola.ex-db-mysql` --- the MySQL Database Extractor.

### Inspecting Configuration
To obtain configuration details, use the [List Configs call](http://docs.keboola.apiary.io/#reference/component-configurations/component-configs/list-configs),
which will return all the configuration details. This means 

- the configuration itself (`configuration`) --- section on configuration follows; 
- configuration rows (`rows`) --- additional data of the configuration; and 
- configuration state (`state`) --- [component state](/extend/common-interface/config-file/#state-file). 

Please note that the contents
of the `configuration`, `rows` and `state` section depend purely on the component itself. For example,
retrieving the configurations for MySQL database extractor, you would call:

{% highlight bash %}
curl --header "X-StorageAPI-Token: storage-token" https://connection.keboola.com/v2/storage/components/keboola.ex-db-mysql/configs
{% endhighlight %}

and obtain a result similar to this:

{% highlight json %}
[
  {
    "id": "sample-database-82",
    "name": "Sample database",
    "description": "",
    "created": "2016-05-30T18:01:42+0200",
    "creatorToken": {
      "id": 53044,
      "description": "ondrej.popelka@keboola.com"
    },
    "version": 5,
    "changeDescription": "",
    "configuration": {
      "parameters": {
        "db": {
          "port": 3306,
          "ssh": {
            "sshPort": 22
          },
          "host": "datagirls.keboola.com",
          "user": "datagirls",
          "#password": "KBC::ComponentProjectEncrypted==+AH99sr+A7I6bQ+qFKb2q5GIJpuLjAbKzkotmLKrD/LXu0aMjxr7dJFfbj6jSsMqs5YqFqIRVmhqC5RfVAXgQg==",
          "database": "datagirls"
        },
        "tables": [
          {
            "enabled": true,
            "incremental": false,
            "outputTable": "in.c-tutorial.opportunity",
            "primaryKey": [],
            "query": "SELECT * FROM sfdc_opportunity;",
            "id": 78082,
            "name": "opportunity"
          }
        ]
      }
    },
    "rows": [],
    "state": {}
  }
]
{% endhighlight %}

The important part is the configuration id `sample-database-82`, which is required in the
following examples.

### Configuration Versions
When you [update a configuration](http://docs.keboola.apiary.io/#reference/component-configurations/manage-configs/update-config),
actually a new configuration version is created. In the above calls, only the last (active/published) configuration
is returned. To obtain a list of all recorded versions, use the
[list versions call](http://docs.keboola.apiary.io/#reference/component-configurations/list-configs-versions/versions-list).

For example, to return a list of versions of the `sample-database-82` configuration for the
`keboola.ex-db-mysql` component, you would use

{% highlight bash %}
curl --header "X-StorageAPI-Token: storage-token" https://connection.keboola.com/v2/storage/components/keboola.ex-db-mysql/configs/sample-database-82/versions
{% endhighlight %}

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

The field `version` represents the `version_id` in the following API examples.

### Creating a Configuration Copy
When you have chosen a particular version, you can create a new independent
[configuration copy](http://docs.keboola.apiary.io/#reference/component-configurations/copy-configs/create-config-copy)
out of it. For example, to create a new configuration called `test-copy` from version `2` of the `sample-database-82` configuration 
for the `keboola.ex-db-mysql` component, you would use:

{% highlight bash %}
curl --request POST --header "X-StorageAPI-Token: storage-token" --form "name=test-copy" https://connection.keboola.com/v2/storage/components/keboola.ex-db-mysql/configs/sample-database-82/versions/2/create
{% endhighlight %}

It will return the ID of the newly created configuration:
{% highlight json %}
{
  "id": 1
}
{% endhighlight %}