---
title: Generic Extractor Tutorial
permalink: /extend/generic-extractor/tutorial/
---

* TOC
{:toc}

This tutorial will guide you through configuration of generic extractor on a new API.
We will use [Mailchimp](https://mailchimp.com/) API as it is fairly easy to understand 
and has excellent documentation. Mailchimp is a service for email marketing.
Note that there is already a Mailchimp extractor available in KBC, so you do not need to 
configure Generic Extractor to be able to extract data from the Mailchimp API.
The Mailchimp extractor available in KBC is in fact a 
[registered configuration](/extend/generic-extractor/registering-generic-extractor) of generic extractor.

## Preparing
Before you start, you should have a basic understanding of HTTP request and 
REST API. If you are not familiar with these concepts, please read our 
[quick introduction to REST](/extend/generic-extractor/tutorial/rest/). Also 
you should be capable of writing JSON configurations. If not go through our
[quick introduction to JSON](/extend/generic-extractor/tutorial/json/).

Before you start working with the Mailchimp API, you need an account and API Key and
some data in that account. If you do not have an account, you can 
[create it](https://login.mailchimp.com/signup/) free of charge. If you created a fresh account,
you also need to fill it with some data.

- **Create a New Campaign** (choose **Regular Type**). 
- Follow the instructions to **Create a new List** and add some addresses to it (preferably yours).
- Go back to Campaigns, click your campaign and hit "Next" at the bottom right corner.
- Design a test email and if you follow the wizard, you should be ready to send the email.
- Check that you received the email and read it.

The Mailchimp wizards should guide you in the above process. If you get lost, check out
[their help](https://us13.admin.mailchimp.com/campaigns/). To obtain Mailchimp API
go to your **Account** detail and under **Extras** you can find the option to
generate an API Key. You can check out the 
[Mailchimp guide](http://kb.mailchimp.com/integrations/api-integrations/about-api-keys#Find-or-Generate-Your-API-Key)
in case of trouble. The API key looks like this `c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13`.

## Getting Started
Now it's time to review the [Mailchimp API](http://developer.mailchimp.com/documentation/mailchimp/). 
There are plenty of documentation guides available. For example, you can use the 
[Playground](https://us1.api.mailchimp.com/playground/) to explore the API and review what
information is contained in each resource.

You also need to review basic properties of the API outlined in the 
[Getting Started Guide](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/#resources).
The crucial parts for our use-case are:

- The root API URL is `https://<dc>.api.mailchimp.com/3.0`, where `<dc>` refers to a data center for your
account. Data center is the last part of the API key, so in case the API key is 
`c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13`, then the root URL is `https://us13.api.mailchimp.com/3.0`.
- API Authentication can be done using *HTTP Basic Authentication* where you use **any string** for username and
the API key for password.

No you can go straight to the documentation of the 
[**Campaign** resource](http://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/).

Because you intend to extract data from Mailchimp, the only part you are interested in is the **Read Method**.

{: .image-popup}
![Screenshot - Read Campaign Documentation](/extend/generic-extractor/tutorial/mailchimp-api-docs-1.png)

The documentation list the URL (`/campaigns`) of the **Campaign Resource**, the query string 
parameters (these go into the URL) -- such as `fields`, `count`, etc. Then it lists example 
request and response. The response body is in in [JSON](/extend/generic-extractor/tutorial/json) format and starts like this:

{% highlight json %}
{
  "campaigns": [
    {
      "id": "42694e9e57",
      "type": "regular",
      "create_time": "2015-09-15T14:40:36+00:00",
      ...
{% endhighlight %}

Now you have pretty much everything to actually start extracting the data and 
continue with Generic Extractor configuration:

- [Basic ocnfiguration](/extend/generic-extractor/tutorial/pagination/)
- [Pagination](/extend/generic-extractor/tutorial/pagination/)
- [Jobs](/extend/generic-extractor/tutorial/jobs/)
- [Mapping](/extend/generic-extractor/tutorial/mapping/)
