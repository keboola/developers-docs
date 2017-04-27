---
title: Generic Extractor Tutorial
permalink: /extend/generic-extractor/tutorial/
---

* TOC
{:toc}

This tutorial will guide you through configuring Generic Extractor on a new API.

We will use the API of [MailChimp](https://mailchimp.com/) --- an email marketing service, as it is fairly 
easy to understand and has excellent documentation. 

Note that there already is a MailChimp extractor available in KBC, so you do not need to 
configure Generic Extractor to extract data from the MailChimp API.
The MailChimp extractor available in KBC is in fact a 
[registered configuration](/extend/generic-extractor/registration/) of Generic Extractor.

## Prepare
There are a few things you need to do and know to get started. For a basic understanding of **HTTP
requests** and **REST API**, read our [quick introduction to REST](/extend/generic-extractor/tutorial/rest/). 
Also, learn how to write **JSON configurations** in our [quick introduction to JSON](/extend/generic-extractor/tutorial/json/).

Next, you need a **MailChimp account, API key and data**. [Create your account](https://login.mailchimp.com/signup/), 
free of charge, if you do not have one already. Then, follow the 
MailChimp wizard or [help](https://us13.admin.mailchimp.com/campaigns/) and fill the account with data:

- Create a new Campaign (choose the *regular type*). 
- Create a new List and add some addresses to it (preferably yours).
- Go back to Campaigns, click your campaign and hit "Next" in the bottom right corner.
- Design a test email and send it.
- Check that you have received the email and read it.

To gain access to the MailChimp API, go to your Account detail and under Extras find the option to 
[generate your API Key](http://kb.mailchimp.com/integrations/api-integrations/about-api-keys#Find-or-Generate-Your-API-Key). 
It will look like this: `c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13`. 

## Get Started
Now it is time to review the [MailChimp API](http://developer.mailchimp.com/documentation/mailchimp/). 
There are plenty of documentation guides available. To explore the API and review what information is in 
each resource, use, for example, the [Playground](https://us1.api.mailchimp.com/playground/).

Then review basic properties of the API outlined in the 
[Getting Started Guide](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/#resources).
The following are the crucial parts for our use-case:

- The root API URL is `https://<dc>.api.mailchimp.com/3.0`, where `<dc>` refers to a data center for your
account. The data center is the last part of the API key; if the API key is 
`c40xxxxxxxxxxxxxxxxxxxxxxxxxxxxx-us13`, the root URL is `https://us13.api.mailchimp.com/3.0`.
- API Authentication can be done using *HTTP Basic Authentication* where you use **any string** for 
username and the API key for password.

Now go straight to the documentation of the 
[**Campaign** resource](http://developer.mailchimp.com/documentation/mailchimp/reference/campaigns/).
Because you intend to extract data from MailChimp, the only part you are interested in is the **Read Method**.

{: .image-popup}
![Screenshot - Read Campaign Documentation](/extend/generic-extractor/tutorial/mailchimp-api-docs-1.png)

The documentation lists the URL (`/campaigns`) of the **Campaign Resource**, the query string 
parameters (these go into the URL) -- such as `fields`, `count`, etc. It also lists example 
requests and responses. The response body is in [JSON](/extend/generic-extractor/tutorial/json) format and starts like this:

{% highlight json %}
{
  "campaigns": [
    {
      "id": "42694e9e57",
      "type": "regular",
      "create_time": "2015-09-15T14:40:36+00:00",
      ...
{% endhighlight %}

## Next Steps
Now you have pretty much everything to actually start extracting the data and 
continue with Generic Extractor configuration:

- [Basic configuration](/extend/generic-extractor/tutorial/basic/)
- [Pagination](/extend/generic-extractor/tutorial/pagination/)
- [Jobs](/extend/generic-extractor/tutorial/jobs/)
- [Mapping](/extend/generic-extractor/tutorial/mapping/)
