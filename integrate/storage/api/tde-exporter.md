---
title: TDE Exporter
permalink: /integrate/storage/api/tde-exporter/
---

* TOC
{:toc}

[TDE Exporter](https://github.com/keboola/tde-exporter) exports tables from KBC Storage into
[TDE file format (Tableau Data Extract)](http://www.tableau.com/about/blog/2014/7/understanding-tableau-data-extracts-part1).
This component is normally part of [Tableu Writer](https://help.keboola.com/overview/tutorial/write/),
but it can also be used as a standalone component.

User can [run TDE exporter job](/overview/jobs/) as any other KBC component or register it
as an orchestration task. After the Exporter finishes, the resulting TDE files will be avaliable in
*Storage* - *File uploads* section where you can download them via UI or [API](/integrate/storage/api/import-export/).

##  Running the component
TDE-exporter is Keboola [Docker component](/extend/docker/) that supports both
[stored configurations](/integrate/storage/api/configurations/) and
custom configuration supplied in directly in the `run` request.

### Stored configuration
To run the TDE exporter with a stored configuration, you first need to
[create the configuration](http://docs.keboola.apiary.io/#reference/component-configurations/component-configs/create-config).
See [below](#custom-configuration) for the required configuration contents.
This call will give you ID of the newly created configuration (e.g. `new-configuration-id`),
then do a HTTP POST request to `https://syrup.keboola.com/docker/tde-exporter/run`, with request body:

{% highlight json %}
{
    "config": "new-configuration-id"
}
{% endhighlight %}

Using [cURL](/overview/api/#curl), you would do:

{% highlight bash %}
curl --request POST --header "X-StorageAPI-Token: storage-token" --data "{\"config\": \"odinuv-test-90\"}" https://syrup.keboola.com/docker/tde-exporter/run
{% endhighlight %}

### Custom configuration
You can specify the entire configuration in the API call. The configuration JSON conforms
to [general configuration format](/extend/common-interface/config-file/). The spefic part
is only `parameters` section. A sample request to export table
`in.c-main.old-table` would look like this:

{% highlight json %}
{
	"configData": {
		"storage": {
			"input": {
				"tables": [{
					"source": "in.c-main.old-table"
				}]
			}
		},
		"parameters": {
			"tags": ["sometag"],
			"typedefs": {
				"in.c-main.old-table": {
					"id": {
						"type": "number"
					},
					"col1": {
						"type": "string"
					}
				}
			}
		}
	}
}
{% endhighlight %}

The `parameters` section contains:

- `tags`: array of tags that will be assigned to the resulting file in Storage File uploads.
- `typedefs`: definitions of data types mapping of source tables columns to destination TDE columns.

Type definitions are entered as object whose name must match the name of table in
`storage.input.tables.source` node (`in.c-main.old-table` in the above example). Object properties
are names of colums of the table, where each must have a property `type` which is one of the
[supported column types](https://onlinehelp.tableau.com/current/pro/online/mac/en-us/datafields_typesandroles_datatypes.html):
`boolean`, `number`, `decimal`, `date`, `datetime`, `string`.

## Date and DateTime
Data for these datatypes can be specified in format used by
in [strptime function](http://pubs.opengroup.org/onlinepubs/009695399/functions/strptime.html) Format is specified in
the type definiftions column definition e.g.

{% highlight json %}
{
    "col1": {
        "type": "date",
        "format":"%m-%d-%Y"
    }
}
{% endhighlight %}

If no format is specified then default formats is used:
- default format for `date` is `%Y-%m-%d`
- default format for `datetime` is `%Y-%m-%d %H:%M:%S or %Y-%m-%d %H:%M:%S.%f`
