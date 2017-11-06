---
title: TDE Exporter
permalink: /integrate/storage/api/tde-exporter/
---

* TOC
{:toc}

[TDE Exporter](https://github.com/keboola/tde-exporter) exports tables from KBC Storage into the
[TDE file format (Tableau Data Extract)](http://www.tableau.com/about/blog/2014/7/understanding-tableau-data-extracts-part1).
This component is normally a part of the [Tableau Writer](https://help.keboola.com/tutorial/write/),
but it can also be used as a standalone component.

Users can [run a TDE exporter job](/overview/jobs/) as any other KBC component or register it
as an orchestration task. After the exporter finishes, the resulting TDE files will be available in the
*Storage* --- *File uploads* section where you can download them via UI or [API](/integrate/storage/api/import-export/).

##  Running the Component
The TDE Exporter is a Keboola [Docker component](/extend/docker/) supporting both
[stored](/integrate/storage/api/configurations/) and
custom configurations supplied directly in the `run` request.

### Stored Configuration
To run the TDE exporter with a stored configuration, first
[create the configuration](http://docs.keboola.apiary.io/#reference/component-configurations/component-configs/create-config).
See [below](#custom-configuration) for the required configuration contents.
This call will give you the ID of the newly created configuration (for instance, `new-configuration-id`).
Then [create a job](/integrate/jobs/) with the specified configuration:

{% highlight json %}
{
    "config": "new-configuration-id"
}
{% endhighlight %}

### Custom Configuration
You can specify the entire configuration in the API call. The JSON configuration conforms
to the [general configuration format](/extend/common-interface/config-file/). The specific part
is only the `parameters` section. A sample request to the `in.c-main.old-table` export table would look like this:

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

- `tags`: array of tags that will be assigned to the resulting file in Storage File Uploads.
- `typedefs`: definitions of data types mapping source tables columns to destination TDE columns.

The type definitions are entered as an object whose name must match the name of the table in the
`storage.input.tables.source` node (`in.c-main.old-table` in the above example). Object properties
are names of the table columns; each must have the `type` property which is one of the
[supported column types](https://onlinehelp.tableau.com/current/pro/online/mac/en-us/datafields_typesandroles_datatypes.html):
`boolean`, `number`, `decimal`, `date`, `datetime` and `string`.

## Date and DateTime
Data for these data types can be specified in the format used
in the [strptime function](http://pubs.opengroup.org/onlinepubs/009695399/functions/strptime.html). The format is specified as part of the column's type definition. For example:

{% highlight json %}
{
    "col1": {
        "type": "date",
        "format":"%m-%d-%Y"
    }
}
{% endhighlight %}

If no format is specified, the following default formats are used:

- For `date`: `%Y-%m-%d`
- For `datetime`: `%Y-%m-%d %H:%M:%S or %Y-%m-%d %H:%M:%S.%f`
