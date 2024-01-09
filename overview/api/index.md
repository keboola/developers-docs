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
| [KBC Storage API](https://keboola.docs.apiary.io/) | [Storage](/integrate/storage/) is the main KBC component storing all data. |
| [KBC Management API](https://keboolamanagementapi.docs.apiary.io/) | API managing KBC projects and users (and notifications and features). |
| [Encryption API](https://keboolaencryption.docs.apiary.io/#) | Provides [Encryption](/overview/encryption/). |
| [Docker Runner API](https://kebooladocker.docs.apiary.io/#) | [Docker Runner](/extend/docker-runner/) is the component running other KBC components. |
| [JSON Parser API](https://jsonparserapi.docs.apiary.io/#) | JSON Parser is a service [converting JSON files to CSV](https://json-parser.keboola.com/). |
| [Transformation API](https://keboolatransformationapi.docs.apiary.io/#) | [Transformations](/integrate/transformations/) is the component running [SQL/R/Python transformations](https://help.keboola.com/manipulation/transformations/). |
| [Provisioning API](https://provisioningapi.docs.apiary.io/#) | Provisioning is a service creating accounts for [sandboxes](https://help.keboola.com/manipulation/transformations/sandbox/), [transformations](https://help.keboola.com/manipulation/transformations/) and database writers. |
| [Provisioning Management API](https://provisioningmanagementapi.docs.apiary.io/#) | API managing servers for [sandboxes](https://help.keboola.com/manipulation/transformations/sandbox/), [transformations](https://help.keboola.com/manipulation/transformations/). |
| [Syrup Queue API](https://syrupqueue.docs.apiary.io/#) | Syrup Queue is a component managing [Jobs](/integrate/jobs/). Being replaced by Queue API. |
| [Queue API](https://app.swaggerhub.com/apis-docs/keboola/job-queue-api) | Queue is a service for [running components](/extend/docker-runner/) and managing [Jobs](/integrate/jobs/). |
| [OAuth Broker API](https://oauthapi3.docs.apiary.io/#) | OAuth Broker is a component managing [OAuth authorizations](/extend/common-interface/oauth/#authorize) of other components. |
| [Orchestrator API](https://keboolaorchestratorv2api.docs.apiary.io/#) | Orchestrator is a component [automating and scheduling tasks](https://help.keboola.com/tutorial/automate/) in your project. For legacy orchestrations only. |
| [Importer API](https://app.swaggerhub.com/apis-docs/keboola/import) | [Importer](/integrate/storage/api/importer/) is a helper service for easy table imports |
| [Developer Portal API](https://kebooladeveloperportal.docs.apiary.io/#) | Developer Portal is an application separated from KBC for [creating components](/extend/component/). |
| [Billing API](https://keboolabillingapi.docs.apiary.io/#) | Billing API for Pay as You Go projects. |
| [Workspaces API](https://sandboxes.keboola.com/documentation) | Workspaces API for V2 workspaces. |
| [Synchronous Actions API](https://app.swaggerhub.com/apis/odinuv/sync-actions) | API to trigger [Synchronous Actions](/extend/common-interface/actions/). This is a partial replacement of Docker Runner API and may not be available on all stacks. |
| [Scheduler API](https://app.swaggerhub.com/apis/odinuv/scheduler) | API to automate configurations (replacement for Orchestrator API) |
| [Notifications API](https://app.swaggerhub.com/apis/odinuv/notifications-service) | API to subscribe to events, e.g., failed orchestrations (replacement for Orchestrator API) |
| [Templates API](https://templates.keboola.com/v1/documentation/) | The Keboola Templates API allows you to apply a [template](/cli/templates/). |
| [Buffer API](https://buffer.keboola.com/v1/documentation/) | The Keboola Buffer API allows you to ingest small and frequent events into your project’s storage. |
| [Vault](https://vault.keboola.com/docs/swagger.yaml) | Service handling variables & credentials storage. |

If you don't know which API to use, see our [integration guide](/integrate/). It describes different roles of the APIs and contains examples of commonly
performed actions.

## Stacks and Endpoints
Keboola Connection is available in multiple [stacks](https://help.keboola.com/overview/#stacks). These can be 
either multi-tenant or single-tenant. Current multi-tenant stacks are:

- US Virginia AWS – [connection.keboola.com](https://connection.keboola.com/),
- EU Frankfurt AWS – [connection.eu-central-1.keboola.com](https://connection.eu-central-1.keboola.com/).
- EU Ireland Azure – [connection.north-europe.azure.keboola.com](https://connection.north-europe.azure.keboola.com/).
- EU Frankfurt GCP - [connection.europe-west3.gcp.keboola.com](https://connection.europe-west3.gcp.keboola.com/)

Each stack is a completely independent instance of Keboola Connection services.
In all the API documentation above, the AWS US stack is used.

Single-tenant stacks are available for a single enterprise customer with a domain name 
in form `connection.CUSTOMER_NAME.keboola.com`.

If you are using another stack, modify the endpoints accordingly.
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
            "id": "queue",
            "url": "https://queue.keboola.com"
        },
        {
            "id": "billing",
            "url": "https://billing.keboola.com"
        },
        {
            "id": "encryption",
            "url": "https://encryption.keboola.com"
        },
        {
            "id": "sandboxes",
            "url": "https://sandboxes.keboola.com"
        },
        {
            "id": "mlflow",
            "url": "https://mlflow.keboola.com"
        },
        {
            "id": "spark",
            "url": "https://spark.keboola.com"
        },
        {
            "id": "scheduler",
            "url": "https://scheduler.keboola.com"
        },
        {
            "id": "sync-actions",
            "url": "https://sync-actions.keboola.com"
        },
        {
            "id": "notification",
            "url": "https://notification.keboola.com"
        },
        {
            "id": "templates",
            "url": "https://templates.keboola.com"
        }
    ],
}
{% endhighlight %}

The services listed above are:

- `docker-runner` --- [Legacy Service for Running Sync Actions](/extend/common-interface/actions/)
- `import` --- [Storage Importer Service](/integrate/storage/api/importer/)
- `syrup` --- [Service for Running Components](/extend/docker-runner/)
- `oauth` --- [OAuth Manager Service](/extend/common-interface/oauth/)
- `queue` --- [Service for Running Components](/extend/docker-runner/)
- `billing` --- Service for Computing Credits
- `encryption` --- Service for [Encryption](https://developers.keboola.com/overview/encryption/).
- `sandboxes` --- Workspace Manager Service
- `mlflow` --- MLFlow Models Manager Service
- `scheduler` --- [Service for Configuring Schedules](https://developers.keboola.com/automate/set-schedule/)
- `sync-actions` --- [Service for Running Synchronous Actions](/extend/common-interface/actions/)
- `notification` --- Service for Configuring Job Notifications
- `templates` --- [Service for Applying Templates](https://developers.keboola.com/cli/templates/)

For convenience, the following table lists active services and their URLs, though for an authoritative answer 
and in application integrations, we strongly suggest using the above API call.

| API | Service | Region | URL |
| --- | ------- | ------ | --- |
| Billing | `billing` | US Virginia AWS | https://billing.keboola.com |
| Billing | `billing` | EU Frankfurt AWS | https://billing.eu-central-1.keboola.com |
| Billing | `billing` | EU Ireland Azure | https://billing.north-europe.azure.keboola.com |
| Billing | `billing` | EU Frankfurt GCP | https://billing.europe-west3.gcp.keboola.com |
| Encryption | `encryption` | US Virginia AWS | https://encryption.keboola.com |
| Encryption | `encryption` | EU Frankfurt AWS | https://encryption.eu-central-1.keboola.com |
| Encryption | `encryption` | EU Ireland Azure | https://encryption.north-europe.azure.keboola.com |
| Encryption | `encryption` | EU Frankfurt GCP | https://encryption.europe-west3.gcp.keboola.com |
| Importer | `import` | US Virginia AWS | https://import.keboola.com |
| Importer | `import` | EU Frankfurt AWS | https://import.eu-central-1.keboola.com |
| Importer | `import` | EU Ireland Azure | https://import.north-europe.azure.keboola.com |
| Importer | `import` | EU Frankfurt GCP | https://import.europe-west3.gcp.keboola.com |
| MLFlow | `mlflow` | US Virginia AWS | https://mlflow.keboola.com |
| MLFlow | `mlflow` | EU Frankfurt AWS | https://mlflow.eu-central-1.keboola.com |
| MLFlow | `mlflow` | EU Ireland Azure | https://mlflow.north-europe.azure.keboola.com |
| MLFlow | `mlflow` | EU Frankfurt GCP | https://mlflow.europe-west3.gcp.keboola.com |
| Notification | `notification` | US Virginia AWS | https://notification.keboola.com |
| Notification | `notification` | EU Frankfurt AWS | https://notification.eu-central-1.keboola.com |
| Notification | `notification` | EU Ireland Azure | https://notification.north-europe.azure.keboola.com |
| Notification | `notification` | EU Frankfurt GCP | https://notification.europe-west3.gcp.keboola.com |
| OAuth | `oauth` | US Virginia AWS | https://oauth.keboola.com |
| OAuth | `oauth` | EU Frankfurt AWS | https://oauth.eu-central-1.keboola.com |
| OAuth | `oauth` | EU Ireland Azure | https://oauth.north-europe.azure.keboola.com |
| OAuth | `oauth` | EU Frankfurt GCP | https://oauth.europe-west3.gcp.keboola.com |
| Queue | `queue` | US Virginia AWS | https://queue.keboola.com |
| Queue | `queue` | EU Frankfurt AWS | https://queue.eu-central-1.keboola.com |
| Queue | `queue` | EU Ireland Azure | https://queue.north-europe.azure.keboola.com |
| Queue | `queue` | EU Frankfurt GCP | https://queue.europe-west3.gcp.keboola.com |
| Scheduler | `scheduler` | US Virginia AWS | https://scheduler.keboola.com |
| Scheduler | `scheduler` | EU Frankfurt AWS | https://scheduler.eu-central-1.keboola.com |
| Scheduler | `scheduler` | EU Ireland Azure | https://scheduler.north-europe.azure.keboola.com |
| Scheduler | `scheduler` | EU Frankfurt GCP | https://scheduler.europe-west3.gcp.keboola.com |
| Storage |  | US Virginia AWS | https://connection.keboola.com/ |
| Storage |  | EU Frankfurt AWS | https://connection.eu-central-1.keboola.com/ |
| Storage |  | EU Ireland Azure | https://connection.north-europe.azure.keboola.com/ |
| Storage |  | EU Frankfurt GCP | https://connection.europe-west3.gcp.keboola.com/ |
| Sync Actions | `sync-actions` | US Virginia AWS | https://sync-actions.keboola.com/ |
| Sync Actions | `sync-actions` | EU Frankfurt AWS | https://sync-actions.eu-central-1.keboola.com |
| Sync Actions | `sync-actions` | EU Ireland Azure | https://sync-actions.north-europe.azure.keboola.com |
| Sync Actions | `sync-actions` | EU Frankfurt GCP | https://sync-actions.europe-west3.gcp.keboola.com |
| Templates | `templates` | US Virginia AWS | https://templates.keboola.com |
| Templates | `templates` | EU Frankfurt AWS | https://templates.eu-central-1.keboola.com |
| Templates | `templates` | EU Ireland Azure | https://templates.north-europe.azure.keboola.com |
| Templates | `templates` | EU Frankfurt GCP | https://templates.europe-west3.gcp.keboola.com |
| Workspaces / Sandboxes | `sandboxes` | US Virginia AWS | https://sandboxes.keboola.com |
| Workspaces / Sandboxes | `sandboxes` | EU Frankfurt AWS | https://sandboxes.eu-central-1.keboola.com |
| Workspaces / Sandboxes | `sandboxes` | EU Ireland Azure | https://sandboxes.north-europe.azure.keboola.com |
| Workspaces / Sandboxes | `sandboxes` | EU Frankfurt GCP | https://sandboxes.europe-west3.gcp.keboola.com |


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
