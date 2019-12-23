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
| API | Description
|-|-|-
| [KBC Storage API](https://keboola.docs.apiary.io/) | [Storage](/integrate/storage/) is the main KBC component storing all data. 
| [KBC Management API](https://keboolamanagementapi.docs.apiary.io/) | API managing KBC projects and users (and notifications and features). 
| [Encryption API](https://keboolaencryption.docs.apiary.io/#) | Provides [Encryption](/overview/encryption/). 
| [Docker Runner API](https://kebooladocker.docs.apiary.io/#) | [Docker Runner](/extend/docker-runner/) is the component running other KBC components. 
| [JSON Parser API](https://jsonparserapi.docs.apiary.io/#) | JSON Parser is a service [converting JSON files to CSV](https://json-parser.keboola.com/). 
| [Transformation API](https://keboolatransformationapi.docs.apiary.io/#) | [Transformations](/integrate/transformations/) is the component running [SQL/R/Python transformations](https://help.keboola.com/manipulation/transformations/). 
| [Provisioning API](https://provisioningapi.docs.apiary.io/#) | Provisioning is a service creating accounts for [sandboxes](https://help.keboola.com/manipulation/transformations/sandbox/), [transformations](https://help.keboola.com/manipulation/transformations/) and database writers. 
| [Provisioning Management API](https://provisioningmanagementapi.docs.apiary.io/#) | API managing servers for [sandboxes](https://help.keboola.com/manipulation/transformations/sandbox/), [transformations](https://help.keboola.com/manipulation/transformations/). 
| [Syrup Queue API](https://syrupqueue.docs.apiary.io/#) | Syrup Queue is a component managing [Jobs](/integrate/jobs/). 
| [OAuth Broker API](https://oauthapi3.docs.apiary.io/#) | OAuth Broker is a component managing [OAuth authorizations](/extend/common-interface/oauth/#authorize) of other components. 
| [GoodData Provisioning API](https://keboolagooddataprovisioning.docs.apiary.io/#) | GoodData provisioning is an application for managing GoodData projects and users. 
| [Orchestrator API](https://keboolaorchestratorv2api.docs.apiary.io/#) | Orchestrator is a component [automating and scheduling tasks](https://help.keboola.com/tutorial/automate/) in your project. 
| [Importer API](https://app.swaggerhub.com/apis-docs/keboola/import/1.0.0) | [Importer](/integrate/storage/api/importer/) is a helper service for easy table imports 
| [Developer Portal API](https://kebooladeveloperportal.docs.apiary.io/#) | Developer Portal is an application separated from KBC for [creating components](/extend/component/).

If you don't know which API to use, see our [integration guide](/integrate/). It describes different roles of the APIs and contains examples of commonly
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
            "url": "https://docker-runner.keboola.com"
        },
        {
            "id": "import",
            "url": "https://import.keboola.com"
        },
        {
            "id": "syrup",
            "url": "https://syrup.keboola.com"
        },
        {
            "id": "oauth",
            "url": "https://oauth.keboola.com"
        },
        {
            "id": "sqldep-analyzer",
            "url": "https://sqldep.keboola.com"
        },
        {
            "id": "sync-actions",
            "url": "https://sync-actions.keboola.com/"
        },
        {
            "id": "gooddata-provisioning",
            "url": "https://gooddata-provisioning.keboola.com"
        },
        {
            "id": "graph",
            "url": "https://graph.keboola.com"
        },
        {
            "id": "encryption",
            "url": "https://encryption.keboola.com"
        }
    ]
}
{% endhighlight %}

The services listed above are:

- `docker-runner` --- [Legacy Service for Running Sync Actions](/extend/common-interface/actions/)
- `import` --- [Storage Importer Service](/integrate/storage/api/importer/)
- `syrup` --- [Service for Running Components](/extend/docker-runner/)
- `oauth` --- [OAuth Manager Service](/extend/common-interface/oauth/)
- `sqldep-analyzer` --- SQLdep Integration Service for SQL query validation.
- `sync-actions` --- [Service for Running Sync Actions](/extend/common-interface/actions/)
- `gooddata-provisioning` --- [Service for User and Project management of GoodData projects](https://keboolagooddataprovisioning.docs.apiary.io/#)
- `graph` --- Service for generating project lineage and graphs.
- `encryption` --- Service for [encryption](https://developers.keboola.com/overview/encryption/).

|API|Service|Region|URL|
|---|-------|------|---|
|Storage||US|https://connection.keboola.com/|
|Storage||EU|https://connection.eu-central-1.keboola.com/|
|Run Jobs|`syrup`|US|https://syrup.keboola.com|
|Run Jobs|`syrup`|EU|https://syrup.eu-central-1.keboola.com|
|Sync Actions|`docker-runner`|US|https://docker-runner.keboola.com|
|Sync Actions|`docker-runner`|EU|https://docker-runner.eu-central-1.keboola.com|
|Importer|`import`|US|https://import.keboola.com|
|Importer|`import`|EU|https://import.eu-central-1.keboola.com|
|OAuth|`oauth`|US|https://oauth.keboola.com|
|OAuth|`oauth`|EU|https://oauth.eu-central-1.keboola.com|
|SQLdep Analyzer|`sqldep-analyzer`|US|https://sqldep.keboola.com|
|SQLdep Analyzer|`sqldep-analyzer`|EU|https://sqldep.eu-central-1.keboola.com|
|Sync Actions|`sync-actions`|US|https://sync-actions.keboola.com/|
|Sync Actions|`sync-actions`|EU|https://sync-actions.eu-central-1.keboola.com|
|GoodData Provisioning|`gooddata-provisioning`|US|https://gooddata-provisioning.keboola.com|
|GoodData Provisioning|`gooddata-provisioning`|EU|https://gooddata-provisioning.eu-central-1.keboola.com|
|Graph|`graph`|US|https://graph.keboola.com|
|Graph|`graph`|EU|https://graph.eu-central-1.keboola.com|
|Encryption|`encryption`|US|https://encryption.keboola.com|
|Encryption|`encryption`|EU|https://encryption.eu-central-1.keboola.com|

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
We also provide a collection of [useful API calls](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb) with examples.
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
