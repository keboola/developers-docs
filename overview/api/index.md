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
| [Encryption API](https://keboolaencryption.docs.apiary.io/#) | Provides [Encryption](/overview/encryption/). | [APIB](https://github.com/keboola/encryption-api/blob/master/apiary.apib)
| [Docker Runner API](http://docs.kebooladocker.apiary.io/#) | [Docker Runner](/extend/docker-runner/) is the component running other KBC components. | [APIB](https://github.com/keboola/docker-bundle/blob/master/apiary.apib)
| [JSON Parser API](http://docs.jsonparserapi.apiary.io/#) | JSON Parser is a service [converting JSON files to CSV](https://json-parser.keboola.com/). | [APIB](https://github.com/keboola/jsonparser-api/blob/master/apiary.apib)
| [Transformation API](http://docs.keboolatransformationapi.apiary.io/) | [Transformations](/integrate/transformations/) is the component running [SQL/R/Python transformations](https://help.keboola.com/manipulation/transformations/). | ---
| [Provisioning API](http://docs.provisioningapi.apiary.io/) | Provisioning is a service creating accounts for [sandboxes](https://help.keboola.com/manipulation/transformations/sandbox/), [transformations](https://help.keboola.com/manipulation/transformations/) and database writers. | [APIB](https://github.com/keboola/provisioning-client/blob/master/apiary.apib)
| [Provisioning Management API](http://docs.provisioningmanagementapi.apiary.io/) | API managing servers for [sandboxes](https://help.keboola.com/manipulation/transformations/sandbox/), [transformations](https://help.keboola.com/manipulation/transformations/). | [APIB](https://github.com/keboola/provisioning-bundle/blob/master/apiary.apib)
| [Syrup Queue API](http://docs.syrupqueue.apiary.io/#) | Syrup Queue is a component managing [Jobs](/integrate/jobs/). | [APIB](https://github.com/keboola/syrup-queue/blob/master/apiary.apib)
| [OAuth Manager API v2](http://docs.oauthv2.apiary.io/) | OAuth Manager (v2) is a component managing [OAuth authorizations](/extend/common-interface/oauth/#authorize) of other components. | [APIB](https://github.com/keboola/oauth-v2-bundle/blob/master/apiary.apib)
| [OAuth Manager API v3](https://oauthapi3.docs.apiary.io/#) | OAuth Manager (v3) is a component managing [OAuth authorizations](/extend/common-interface/oauth/#authorize) of other components. | [Swagger](https://github.com/keboola/oauth-api/blob/master/swagger.yaml)
| [GoodData Writer API](http://docs.keboolagooddatawriterv2.apiary.io/#) | GoodData Writer is a component [loading data into GoodData](https://help.keboola.com/tutorial/write/gooddata/). | [APIB](https://github.com/keboola/gooddata-writer/blob/master/apiary.apib)
| [Orchestrator API](http://docs.keboolaorchestratorv2api.apiary.io/#) | Orchestrator is a component [automating and scheduling tasks](https://help.keboola.com/tutorial/automate/) in your project. | [APIB](https://github.com/keboola/orchestrator-bundle/blob/master/apiary.apib)
| [Developer Portal API](http://docs.kebooladeveloperportal.apiary.io/#) | Developer Portal is an application separated from KBC for [creating components](/extend/component/). | [APIB](https://github.com/keboola/developer-portal/blob/master/apiary.apib)

If you don't know which API to use, see our [integration guide](/integrate/), which describes different roles of the APIs and contains examples of commonly
performed actions.

## Regions and Endpoints
Keboola Connection is available in multiple regions --- currently in the US (connection.keboola.com), EU (connection.eu-central-1.keboola.com) and AU (connection.ap-southeast-2.keboola.com).
Each region instance is a completely independent **full stack** of Keboola Connection services.
In all the API documentation above, the US region is used.

If you are using another region, modify the endpoints accordingly.
Otherwise you will obtain an `Invalid Token` or unauthorized errors. The *authoritative list* of available endpoints is provided by the [Storage API Index Call](https://keboola.docs.apiary.io/#reference/miscellaneous/api-index/component-list). The following is a sample response:

{% highlight json %}
{
    ...,
    "services": [
        {
            "id": "docker-runner",
            "url": "https:\/\/docker-runner.keboola.com"
        },
        {
            "id": "import",
            "url": "https:\/\/import.keboola.com"
        },
        {
            "id": "syrup",
            "url": "https:\/\/syrup.keboola.com"
        }
    ]
}
{% endhighlight %}

The services listed above are:

- `docker-runner` --- [Service for Running Sync Actions](/extend/common-interface/actions/)
- `import` --- [Storage Importer Service](/integrate/storage/api/importer/)
- `syrup` --- [Service for Running Components](/extend/docker-runner/)

|API|Service|Region|URL|
|---|-------|------|---|
|Storage||US|https://connection.keboola.com/|
|Storage||EU|https://connection.eu-central-1.keboola.com/|
|Storage||AU|https://connection.ap-southeast-2.keboola.com/|
|Run Jobs|`syrup`|US|https://syrup.keboola.com|
|Run Jobs|`syrup`|EU|https://syrup.eu-central-1.keboola.com|
|Run Jobs|`syrup`|AU|https://syrup.ap-southeast-2.keboola.com|
|Sync Actions|`docker-runner`|US|https://docker-runner.keboola.com|
|Sync Actions|`docker-runner`|EU|https://docker-runner.eu-central-1.keboola.com|
|Sync Actions|`docker-runner`|AU|https://docker-runner.ap-southeast-2.keboola.com|
|Importer|`import`|US|https://import.keboola.com|
|Importer|`import`|EU|https://import.eu-central-1.keboola.com|
|Importer|`import`|AU|https://import.ap-southeast-2.keboola.com|

**Important**: Each of the stacks also uses its own set of [IP addresses](https://help.keboola.com/extractors/ip-addresses/).

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
[Postman](https://www.getpostman.com/) is a generic HTTP API client. Use it if you work with KBC APIs on a more regular basis.
We also provide a collection of [useful API calls](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D#4c9c7c9f-6cd6-58e7-27e3-aef62538e0ba) with examples.
The collection contains code examples in various languages; the requests can also be imported into the Postman application.

{: .image-popup}
![Postman Docs](/overview/api/postman-import.png)

### cURL
[cURL](https://curl.haxx.se/) is a common library used by many systems. There is also
a [command-line interface (CLI)](https://curl.haxx.se/docs/manpage.html) available.
You can use the cURL CLI to create simple scripts working with KBC APIs. For example, to [Run a Job](/integrate/jobs/),
use

{% highlight shell %}
curl --data "{\"config\": \"sampledatabase\"}" --header "X-StorageAPI-Token: YourStorageToken" https://syrup.keboola.com/keboola.ex-db-mysql/run
{% endhighlight %}
