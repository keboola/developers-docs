---
title: Jobs Tutorial
permalink: /extend/generic-extractor/tutorial/jobs/
---

* TOC
{:toc}

In this tutorial so far you went through [basic configuration](/extend/generic-extractor/tutorial/)
of Generic Extractor and also through [configuration of pagination](/extend/generic-extractor/tutorial/pagination/).
In this part of the tutorial you will learn how to use sub-jobs of gneeric extractor.

Let's more closely examine the `campaigns` resource of the Mailchimp API. Apart from 
retriving multiple campaings `/campaign` endpoint. It can also retrieve detailed information
about a single campaing `/campaign/{campaign_id}`. And it also has **sub-resources**.

{: .image-popup}
![Screenshot - Mailchimp documentation](/extend/generic-extractor/tutorial/mailchimp-api-docs-1.png)

The sub-resources are `/campaigns/{campaign_id}/content`, `/campaigns/{campaign_id}/feedback` 
and `/campaigns/{campaign_id}/send-checklist`. The `{campaign_id}` expression 
represents a placeholder which should be replaced by a specific campaign Id.
To retrieve the sub-resource, you have to use child jobs. In 
the [previous part](/extend/generic-extractor/tutorial/) you ended up
with this job property in Generic Extractor configuration:

{% highlight json %}
"jobs": [
    {
        "endpoint": "campaigns",
        "dataField": "campaigns"
    }
]
{% endhighlight %}

## Child Jobs
Sub-resources are retrieved through configuration of the `children` property. The structure
of the `children` property is the same as the structure of `jobs` property, but it must additionally
define `placeholders`.

{% highlight json %}
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
            }
        ]
    }
]
{% endhighlight %}

You also need to set the `dataField` property to `items`. This is because the response 
contains two array properties `items` and `_links`, as you can see
in the [Documentation](http://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/send-checklist/).

The `childern` are essential executed for each item retrieved from the parent 
endpoint. The `placeholders` setting connects together the placeholeders used in the `endpoint` property
and data in the actual response. That means tha `campaign_id` refers to the placeholder 
in endpoint `campaigns/{campaign_id}/send-checklist` and `id` refers to property of the JSON object in response.
To find that, you need to examine the [sample response](http://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/):

{: .image-popup}
![Screenshot - Mailchimp docs](/extend/generic-extractor/tutorial/mailchimp-api-docs-2.png)

Also notice, that the placeholder name is completely arbitrary (i.e. it is just a concidence that
it is also named `campaign_id` in the Mailchimp documentation). Therefore, the following configuration is 
also valid:

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
                            "endpoint": "campaigns/{cid}/send-checklist",
                            "dataField": "items",
                            "placeholders": {
                                "cid": "id"
                            }
                        }
                    ]
                }
            ]
        }
    }
}
{% endhighlight %}

If you run the above configuration, you'll obtain a new table named 
e.g. `in.c-ge-tutorial.campaigns__campaign_id__send-checklist`. The table
contains messages that occured during checking your campaign.
You'll see something like this:

{: .image-popup}
![Screenshot - Job Table](/extend/generic-extractor/tutorial/job-table-1.png)

Note that apart from the API response properties `type`, `heading` and
`details` an additional field `parent_id` was added. This contains the value of the 
placeholder (`campaign_id`) for the particular request. I.e. to join the 
the two tables together in SQL, you would use the join condition: 

    campaigns.id=campaigns__campaign_id__send-checklist.parent_id

You have to remember to what table the `parent_id` column refers to though.

## Multiple Jobs
You probably noticed that the `jobs` property is an array. This of course means 
that you can retrieve multiple endpoints in a single configuration. Let's pick
the campaign `content` sub-resource too:

{% highlight json %}
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
                "placeholders": {
                    "campaign_id": "id"
                }
            }
        ]
    }
]
{% endhighlight %}

The question is what to put in the `dataField`. If you examine the [sample response](http://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/content/)
It looks like this:

{% highlight json %}

{
  "plain_text": "** Designing...*|END:IF|*",
  "html": "<!DOCTYPE html...</html>",
  "_links": [
    {
      "rel": "parent",
      "href": "https://usX.api.mailchimp.com/3.0/campaigns/42694e9e57",
      "method": "GET",
      "targetSchema": "https://api.mailchimp.com/schema/3.0/Campaigns/Instance.json"
    },
    ...
  ]
}

{% endhighlight %}

If you use no `dataField` like in the above configuration and run it, you'll obtain a table like this:

{: .image-popup}
![Screenshot - Job Table](/extend/generic-extractor/tutorial/job-table-1.png)

This is definitelly not what you expected. Instead of obtaining the campaign content, you 
got the `_links` property from the response. This is because Generic Extractor automaticaly 
picks an array in the response. To tell Generic extractor that you want to the entire
response as a *single table record*, you need to set `dataField` to the [path](todo) in the object.
Because you want to use the *entire* response, you'll set `dataField` to `.` to start 
in the root.

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

If you run the above configuration, you will get a table `in.c-ge-tutorial.campaigns__campaign_id__content`
with columns `plain_text`, `html` and some others. 

You will also get a table `in.c-ge-tutorial.campaigns__campaign_id__content__links`. This table 
represents the `links` property of `content` resource. The links table contains the 
`JSON_parentId` column which contins a generated hash such as 
`campaigns/{campaign_id}/content_1c3b951ece2a05c1239b06e99cf804c2` whose value is inserted into
the `links` column of the campaign content table. This is done automatically because once
you said that the entire response was supposed to be a single table row, the array `_links` 
property will not fit into a single value of a table.

## Summary
In this part of the tutorial you have shown how to extract sub-resources using child jobs and
how to extract resources composed directly of properties (not having an array of items).
Now you probably think that the dreaded `_links` property which is all over the Mailchimp API 
gave us too much trouble already and you should somehow ignore it. The answer to 
it is **mapping**, which is described in the
[next part](/extend/generic-extractor/tutorial/mapping/) of the tutorial. Also you might have 
noticed that there are some duplciate records in the `in.c-ge-tutorial.campaigns__campaign_id__content` 
table. You'll see into this as well.
