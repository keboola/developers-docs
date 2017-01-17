---
title: Our APIs
permalink: /overview/api/
---

* TOC
{:toc}

All our [KBC components](/overview/) have a public API on [apiary](https://apiary.io/). For sending requests to our 
API, we recommend either the Apiary Console or Postman Client. Most of our APIs take and produce data in JSON format. 
Many of them require a *Storage API token*, which is entered in the `X-StorageApi-Token` header.

## List of Keboola APIs

All parts of the Keboola Connection platform can be controlled via an API.
The main APIs for our components are:

|---
| API | Description | APIB
|-|-|-
| [KBC Storage API](http://docs.keboola.apiary.io/#) | [Storage](/integrate/storage/) is the main KBC component storing all data. | [APIB](https://github.com/keboola/storage-api-php-client/blob/master/apiary.apib)
| [KBC Management API](http://docs.keboolamanagementapi.apiary.io/#) | API managing KBC projects and users (and notifications and features). | [APIB](https://github.com/keboola/kbc-manage-api-php-client/blob/master/apiary.apib)
| [Docker Runner API](http://docs.kebooladocker.apiary.io/#) | [Docker Runner](/integrate/docker-bundle/) is the component running other KBC components. | [APIB](https://github.com/keboola/docker-bundle/blob/master/apiary.apib)
| [JSON Parser API](http://docs.jsonparserapi.apiary.io/#) | JSON Parser is a service [converting JSON files to CSV](https://json-parser.keboola.com/). | [APIB](https://github.com/keboola/jsonparser-api/blob/master/apiary.apib)
| [Transformation API](http://docs.keboolatransformationapi.apiary.io/) | [Transformations](/integrate/transformations/) is the component running [SQL/R/Python transformations](https://help.keboola.com/manipulation/transformations/). | ---
| [Provisioning API](http://docs.provisioningapi.apiary.io/) | Provisioning is a service creating accounts for [sandboxes](https://help.keboola.com/manipulation/transformations/sandbox/), [transformations](https://help.keboola.com/manipulation/transformations/) and database writers. | [APIB](https://github.com/keboola/provisioning-client/blob/master/apiary.apib)
| [Provisioning Management API](http://docs.provisioningmanagementapi.apiary.io/) | API managing servers for [sandboxes](https://help.keboola.com/manipulation/transformations/sandbox/), [transformations](https://help.keboola.com/manipulation/transformations/). | [APIB](https://github.com/keboola/provisioning-bundle/blob/master/apiary.apib)
| [Syrup Queue API](http://docs.syrupqueue.apiary.io/#) | Syrup Queue is a component managing [Jobs](/overview/jobs/). | [APIB](https://github.com/keboola/syrup-queue/blob/master/apiary.apib)
| [OAuth Manager API](http://docs.oauthv2.apiary.io/) | OAuth2 is a component managing [OAuth authorizations](/extend/common-interface/oauth/#authorize) of other components. | [APIB](https://github.com/keboola/oauth-v2-bundle/blob/master/apiary.apib)
| [GoodData Writer API](http://docs.keboolagooddatawriterv2.apiary.io/#) | GoodData Writer is a component [loading data into GoodData](https://help.keboola.com/tutorial/write/gooddata/). | [APIB](https://github.com/keboola/gooddata-writer/blob/master/apiary.apib) 
| [Orchestrator API](http://docs.keboolaorchestratorv2api.apiary.io/#) | Orchestrator is a component [automating and scheduling tasks](https://help.keboola.com/tutorial/automate/) in your project. | [APIB](https://github.com/keboola/orchestrator-bundle/blob/master/apiary.apib)
| [Developer Portal API](http://docs.kebooladeveloperportal.apiary.io/#) | Developer Portal is an application separated from KBC for [registering components](/extend/registration/). | [APIB](https://github.com/keboola/developer-portal/blob/master/apiary.apib)

## Calling API

There are several ways of sending requests to our APIs.

### Apiary Console
Send requests to our API directly from the Apiary console by clicking on **Switch to console** or **Try**. 
Then fill the request headers and parameters and **Call Resource**.

{: .image-popup}
![Apiary console](/overview/api/apiary-console.png)

The Apiary console is fine if you send API requests only occasionally. It requires no application installation; 
however, it has no history and no other useful features.
 
### Postman Client
[Postman](https://www.getpostman.com/) is a generic HTTP API client. Use it if you work with KBC API on a more regular basis. 
We also provide a collection of useful API calls. They can be imported either by clicking the following button,

[![Run in Postman](https://run.pstmn.io/button.png)](https://app.getpostman.com/run-collection/7dc2e4b41225738f5411)

or with the following procedure: 

- Get and run [Postman](https://www.getpostman.com/)
- Go to **Import** - **From URL** 
- Enter [https://www.getpostman.com/collections/87da6ac847f5edcac776](https://www.getpostman.com/collections/87da6ac847f5edcac776)

{: .image-popup}
![Apiary console](/overview/api/postman-import.png)

### cURL
[cURL](https://curl.haxx.se/) is a common library used by many systems. There is also 
a [command-line interface (CLI)](https://curl.haxx.se/docs/manpage.html) available. 
You can use the cURL CLI to create simple scripts working with KBC API. For example, to [Run a Job](/overview/jobs/), 
use

{% highlight shell %}
curl --data "{\"config\": \"sampledatabase\"}" --header "X-StorageAPI-Token: YourStorageToken" https://syrup.keboola.com/keboola.ex-db-mysql/run 
{% endhighlight %}

To call the [encryption API](/overview/encryption/) for [R Custom Science](/extend/custom-science/), use

{% highlight shell %}
curl --data "sometext" --header "X-StorageAPI-Token: YourStorageToken" --header "Content-Type: text/plain" https://syrup.keboola.com/docker/dca-custom-science-r/encrypt
{% endhighlight %}

