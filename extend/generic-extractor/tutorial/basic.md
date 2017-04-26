---
title: Basic Configuration
permalink: /extend/generic-extractor/tutorial/basic/
---

* TOC
{:toc}

Before you start configuring Generic Extractor, you should have a basic understanding
of [REST API](/extend/generic-extractor/tutorial/rest/) and the 
[JSON format](/extend/generic-extractor/tutorial/json/). This tutorial uses the 
[MailChimp API](http://developer.mailchimp.com/documentation/mailchimp/reference/overview/), so
have that documentation at hand. You also need to have the 
[MailChimp API key](/extend/generic-extractor/tutorial/#get-started).

## Configuration
Generic Extractor configuration is written in [JSON format](/extend/generic-extractor/tutorial/json/) 
and is composed of several sections. The main parts and their nesting are shown in the below schema:

{: .image-popup}
![Schema - Generic Extractor configuration](/extend/generic-extractor/generic-intro.png)

### API Section
The first configuration part is the `api` section where you set the basic properties of the API. 
In the most simple case, this is the `baseUrl` property and `authentication`. The below JSON snippet shows 
the exact configuration (note that `config` is outside `authentication`):

{% highlight json %}
{
    "api": {
        "baseUrl": "https://us13.api.mailchimp.com/3.0/",
        "authentication": {
            "type": "basic"
        }
    }
}
{% endhighlight %}

**Important:** Make sure that the `baseUrl` URL ends with a slash!

### Configuration Section
The `config` section describes the actual extraction. Its most important parts are the `outputBucket` and 
`jobs` properties. `outputBucket` must be set to an id of a [Storage Bucket](https://help.keboola.com/storage/buckets/) 
where the data will be stored. If no bucket exists, it will be created. 

It also contains the authentication parameters `username` and `password`. So you will start with this 
configuration section:

{% highlight json %}
"config": {
    "username": "dummy",
    "#password": "c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13",
    "outputBucket": "ge-tutorial",
    "jobs": []    
}
{% endhighlight %}

The `password` property is prefixed with the hash mark `#`, which means that the 
value will be [encrypted](https://developers.keboola.com/overview/encryption/) once 
you save the configuration. 

#### Jobs Section
The `jobs` section is the most complex part of the configuration. The first part
of the `jobs` configuration is the `endpoint`:

{% highlight json %}
"jobs": [
    {
        "endpoint": "campaigns"
    }
]
{% endhighlight %}

**Important:** Make sure **not to** start the URL with a slash. If you do so, the URL 
will be absolute from the domain: `https://us13.api.mailchimp.com/campaigns`, which is not valid (it is 
missing the `3.0` part). An alternative would be to put `/3.0/campaigns` in the `endpoint` property.

Now you are getting close to a runnable configuration:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "https://us13.api.mailchimp.com/3.0/",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "username": "dummy",
            "#password": "c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13",
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "campaigns"
                }
            ]
        }
    }
}
{% endhighlight %}

If you try to run this configuration, you will obtain an error similar to this:

    More than one array found in the response! Use the 'dataField' parameter to specify a key to the data array. 
    (endpoint: campaigns, arrays in the response root: campaigns, _links) 

This means that the extractor got the response, but cannot automatically process it. If you examine the 
sample [response in the documentation](http://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/#),
you will see that it is an object with three items `campaigns`, `total_items` and `_links`:

{% highlight json %}
{
  "campaigns": [
    {
      "id": "42694e9e57",
      "type": "regular",
      ...
    },
    {
      "id": "f6276207cc",
      "type": "regular",
      ...
    }
  ],
  "total_items": 2,
  "_links": [
    {
      "rel": "parent",
      "href": "https://usX.api.mailchimp.com/3.0/",
      "method": "GET",
      "targetSchema": "https://api.mailchimp.com/schema/3.0/Root.json"
    },
    {
      "rel": "self",
      "href": "https://usX.api.mailchimp.com/3.0/campaigns",
      "method": "GET",
      "targetSchema": "https://api.mailchimp.com/schema/3.0/Campaigns/Collection.json",
      "schema": "https://api.mailchimp.com/schema/3.0/CollectionLinks/Campaigns.json"
    }
  ]
}
{% endhighlight %}

Generic Extractor expects the response to be an array of items. If it receives an object, it
searches through its properties to find an array. If it finds multiple arrays, it becomes confused
because it is unclear which array you want. To fix this, you need to add the `dataField` parameter
as the error message suggests:

{% highlight json %}
{
    "parameters": {
        "api": {
            "baseUrl": "https://us13.api.mailchimp.com/3.0/",
            "authentication": {
                "type": "basic"
            }
        },
        "config": {
            "username": "dummy",
            "#password": "c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13",
            "outputBucket": "ge-tutorial",
            "jobs": [
                {
                    "endpoint": "campaigns",
                    "dataField": "campaigns"
                }
            ]
        }
    }
}
{% endhighlight %}

**Important:** It may seem confusing that both the `endpoint` and `dataField` properties are set to `campaigns`. 
This is just a coincidence; the `endpoint` property refers to the `campaigns` in the resource URL. 
The `dataField` refers to the `campaigns` property in the JSON retrieved as the API response.

You can now run the above configuration by simply pasting it into the Generic Extractor configuration field:

{: .image-popup}
![Screenshot - Generic Extractor configuration](/extend/generic-extractor/tutorial/config-1.png)

Notice that when you save the configuration, the `#password` property gets 
[encrypted](https://developers.keboola.com/overview/encryption/).
Hit the *Run* button and go to the job details to see what happened:

{: .image-popup}
![Screenshot - Generic Extractor job](/extend/generic-extractor/tutorial/job-1.png)

The extraction produced two tables. The `in.c-ge-tutorial.campaigns` table contains all the 
fields of a campaign and as many rows as you have campaigns. 

{: .image-popup}
![Screenshot - Campaigns Table](/extend/generic-extractor/tutorial/table-campaigns-sample.png)

The table `in.c-ge-tutorial.campaigns__links` contains the contents of the `_links` property. 
Because the `_links` property is a nested array within a single campaign object, it cannot be easily 
represented in a single column of the `campaigns` table. Generic Extractor therefore replaces the column 
value with a generated key, for example, `campaigns_75d5b14d79d034cd07a9d95d5f0ca5bd` and automatically 
creates a new table which has the column `JSON_parentId` with that value so that you can join the tables together.

## Summary
The above tutorial demonstrates a very basic configuration of Generic Extractor. The extractor is capable 
of doing much more; see other parts of this tutorial for explanation of

- [Pagination](/extend/generic-extractor/tutorial/pagination/),
- [Jobs](/extend/generic-extractor/tutorial/jobs/), and
- [Mapping](/extend/generic-extractor/tutorial/mapping/).
