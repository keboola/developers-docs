---
title: Mapping Tutorial
permalink: /extend/generic-extractor/tutorial/mapping/
---

* TOC
{:toc}

In the [previous part](/extend/generic-extractor/tutorial/jobs/) of the tutorial
you extracted the content of a Mailchimp campaign. In this part of the tutorial
you will clean up the response a little bit.

The initial configuration is this one:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "https://us13.api.mailchimp.com/3.0/",
            "authentication": {
                "type": "basic"
            },
            "pagination": {
                "method": "offset",
                "offsetParam": "offset",
                "limitParam": "count",
                "limit": 1
            }
        },
        "config": {
            "debug": true,
            "username": "dummy",
            "#password": "c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13",
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "campaigns",
                    "dataField": "campaigns",
                    "children": [
                        {
                            "endpoint": "campaigns/{campaign_id}/send-checklist",
                            "dataField": "items",
                            "placeholders": {
                                "campaign_id": "id"
                            }
                        },
                        {
                            "endpoint": "campaigns/{campaign_id}/content",
                            "dataField": ".",
                            "placeholders": {
                                "campaign_id": "id"
                            }
                        }
                    ]
                }
            ]
        }
    }
}
{% endhighlight %}

This extracts Mailchimp campaigns, together with the `send-checklist` items and
together with the campaign `content`. There are some parts of the content resource you are probably not 
interested in and also the table contains duplicates.

Technical Note: If you are curious, how the duplicates got there, it is because you set the pagination and
the pagination applies to all request. If you examine the job events, you'll see that
a request `GET /3.0/campaigns/f7ed43aaea/content?count=1&offset=0` has been sent. I.e that the 
pagination applies to **all API requests**. This means that generic extractor tries to page the 
unpaged `/content` resource. This may ultimately lead to duplicates because the extraction of that
resource is terminated only after the resource returns same response twice.

## Mapping
Mappings define the shape of the output produced by generic extractor. Mapping is defined
in the `config.mappings` property. To be able to use mappings you must first define a 
`dataType` in the job property. I.e:

{% highlight json %}
{
    "endpoint": "campaigns/{campaign_id}/content",
    "dataField": ".",
    "dataType": "content",
    "placeholders": {
        "campaign_id": "id"
    }
}
{% endhighlight %}

The value of `dataType` property is an arbitrary name. Apart from identifying
the resource type it is also used as the *output table name*. If you run
the job, the content will be stored in `in.c-ge-tutorial.content`.

When a resource is assigned an internal `dataType`, a mapping can be created 
for it. Mapping is stored in `config.mappings` property and identified by the 
resource data type. Each item in the mapping is identified by property name 
of the resource and must contain `mapping.destination` with target column 
name in the output table. For example:

{% highlight json %}
"mappings": {
    "content": {
        "plain_text": {
            "mapping": {
                "destination": "text"
            }
        }
{% endhighlight %}

The above mappings setting defines that for the `content` data type, the 
resource property `plain_text` will be stored in table column `text`. No other
properties of the content resource will be imported. I.e. the mapping defines
all columns of the output table.

I.e if you are interested in having the `plain_text` and `html` version of the 
campaign content, you can use a mapping like this:

{% highlight json %}
"mappings": {
    "content": {
        "plain_text": {
            "mapping": {
                "destination": "text"
            }
        },
        "html": {
            "mapping": {
                "destination": "html"
            }
        }
    }
}
{% endhighlight %}

Note that the `destination` value is arbitrary, but it must be a valid column nam.
The data type name (`content`) must match the value of the `dataType` property 
se defined in some of the jobs.

## Parent Reference
The above mapping works, but is missing the campaign id so you wouldn't be able to 
match the content to some campaign record. Therefore you need to extract campaign id 
from the context (i.e. from the job parameter). This can be done using a special `user` mapping.

When mapping `type` is set to `user`, you can use a special prefix `parent_` to refer to
a `placeholder` defined in a job. That is, you can create the following mapping:

{% highlight json %}
"mappings": {
    "content": {
        "parent_id": {
            "type": "user",
            "mapping": {
                "destination": "campaign_id"
            }
        }
    }
}
{% endhighlight %}

The above configuration defines a mapping for the `content` data type so that
in the result table named `content` a column `campaign_id` will be created.
The content of that column will be the value of the `id` placeholder 
(`parent_id` minus the `parent_` prefix) in the respective job.

Apart from specifying what columns should be present in the output table, the 
mapping allows to set that a column is part of a primary key. The entire configuration would 
then look like this:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "https://us13.api.mailchimp.com/3.0/",
            "authentication": {
                "type": "basic"
            },
            "pagination": {
                "method": "offset",
                "offsetParam": "offset",
                "limitParam": "count",
                "limit": 10
            }
        },
        "config": {
            "debug": true,
            "username": "dummy",
            "#password": "c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13",
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "campaigns",
                    "dataField": "campaigns",
                    "children": [
                        {
                            "endpoint": "campaigns/{campaign_id}/send-checklist",
                            "dataField": "items",
                            "placeholders": {
                                "campaign_id": "id"
                            }
                        },
                        {
                            "endpoint": "campaigns/{campaign_id}/content",
                            "dataField": ".",
                            "dataType": "content",
                            "placeholders": {
                                "campaign_id": "id"
                            }
                        }
                    ]
                }
            ],
            "mappings": {
                "content": {
                    "parent_id": {
                        "type": "user",
                        "mapping": {
                            "destination": "campaign_id",
                            "primaryKey": true
                        }
                    },
                    "plain_text": {
                        "mapping": {
                            "destination": "text"
                        }
                    },
                    "html": {
                        "mapping": {
                            "destination": "html"
                        }
                    }
                }
            }
        }
    }
}
{% endhighlight %}

## Review
Because the above configuration proably looks quite complex, let's review what parts are connected
and how. Note that the values colored blue have been choosen arbitrarily when the configuration 
was created:

{: .image-popup}
![Configuration Schema](/extend/generic-extractor/tutorial/configuration-schema.svg)

## Summary
Mapping lets you define preciesely what the output of the extraction will look like and 
also define primary keys. If you are doing a one time ad-hoc extraction, you may skip 
setting up mapping and clean the extracted data later in 
[transformations](https://help.keboola.com/manipulation/transformations/). If you
intend to use your configuration regulary or make it into its own component, it is recommennded to
set up mapping.
