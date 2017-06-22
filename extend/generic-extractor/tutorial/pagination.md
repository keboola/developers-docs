---
title: Pagination Tutorial
permalink: /extend/generic-extractor/tutorial/pagination/
---

* TOC
{:toc}

Pagination breaks a result with a large number of items into separate pages and is used very commonly in 
many API calls. 

In the previous part of the tutorial, you [fetched campaigns from 
the MailChimp API](/extend/generic-extractor/tutorial/). If you created a new account, chances are that you probably have 
only one campaign. You should now create some more campaigns (you do not have to configure them anyhow).

If the API has consistent pagination for all resources (which the
[MailChimp API has](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/#pagination)),
then the pagination is defined in the `api` section of the configuration.

## Preparation
The MailChimp API uses the [`offset` pagination method](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/#pagination);
it means that each page has a fixed `limit` (by default 10 items), and you need to use the offset to move 
that fixed-size page over the next set of results. For the first page, the `offset` is 0, for the second 
page, the `offset` is 10. This is the same kind of pagination as in SQL.

The offset pagination method is configured with the following basic properties:

- `method` --- for MailChimp, set this property to `offset`.
- `offsetParam` --- name of the API parameter which defines the [page offset](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/#pagination)
- `limitParam` -- name of the API parameters which define the [page size (limit)](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/#pagination)

So for MailChimp, configure the pagination this way:

{% highlight json %}
"api": {
    "baseUrl": "https://us13.api.mailchimp.com/3.0/",
    "authentication": {
        "type": "basic"
    },
    "pagination": {
        "method": "offset",
        "offsetParam": "offset",
        "limitParam": "count"
    }
},
{% endhighlight %}

## Running
Now make sure that you have more than one campaign in your account. The entire Generic Extractor  
configuration will look like this:

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
                "limitParam": "count"
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

## Testing
Because you probably have less than ten (the default page size) campaigns in your MailChimp account, 
there is no way to tell whether the pagination works or not. Let's make sure then, by setting the `limit` 
to 1 and turning the `debug` mode on, that you can see all the requests sent by Generic Extractor.

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
                    "dataField": "campaigns"
                }
            ]
        }
    }
}
{% endhighlight %}

Run the configuration and review the events produced by the job. You should see something like this:

{: .image-popup}
![Screenshot - Debug Events](/extend/generic-extractor/tutorial/job-2.png)

The oldest events are at the bottom, so you can see that the extractor started by sending an HTTP request:

    GET /3.0/campaigns/?count=1&offset=0

Then it continued with 

    GET /3.0/campaigns/?count=1&offset=1
    GET /3.0/campaigns/?count=1&offset=2

and so on. You should also see a warning that the `dataField 'campaigns' contains no data`. 
This is expected because Generic Extractor tries bigger offsets until the number of returned items is 
less than the page size. With the page size set to 1, this means that the last page will contain no data.

## Summary
In this part of the tutorial, you learned how to set up simple pagination. This is very important
because most APIs use some sort of pagination and without proper setting you would be 
getting incomplete data. The next two parts of our tutorial deal with setting up jobs and mapping:

- [Jobs](/extend/generic-extractor/tutorial/jobs/) --- describe the API endpoints 
		(resources) to be extracted.
- [Mapping](/extend/generic-extractor/tutorial/mapping/) --- describes how the JSON 
		response is converted into CSV files that will be imported into Storage.
