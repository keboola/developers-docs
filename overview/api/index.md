---
title: Our APIs
permalink: /overview/api/
---

* TOC
{:toc}

All our [Keboola components](/overview/) have a public API on [apiary](https://apiary.io/). We recommend using either the Apiary Console or Postman Client for sending requests to our
API. Most of our APIs accept and return data in JSON format.
Many of these APIs require a *Storage API token*, specified in the `X-StorageApi-Token` header.

## List of Keboola APIs

All parts of the Keboola platform can be controlled via an API.
The main APIs for our components are:

| API                                                                                                         | Description                                                                                                                                                         |
|-------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Keboola Storage API](https://keboola.docs.apiary.io/)                                                      | [Storage](/integrate/storage/) is the main Keboola component storing all data.                                                                                      |
| [Keboola Management API](https://keboolamanagementapi.docs.apiary.io/)                                      | API managing Keboola projects and users (and notifications and features).                                                                                           |
| [AI API](https://ai.keboola.com/docs/swagger.yaml)                                                          | API for supporting AI features.                                                                                                                                     |
| [Billing API](https://keboolabillingapi.docs.apiary.io/#)                                                   | Billing API for Pay as You Go projects.                                                                                                                             |
| [Developer Portal API](https://kebooladeveloperportal.docs.apiary.io/#)                                     | Developer Portal is an application separated from Keboola for [creating components](/extend/component/).                                                            |
| [Editor API](https://editor.keboola.com/docs/swagger.yaml)                                                  | API for managing SQL editor sessions.                                                                                                                               |
| [Encryption API](https://keboolaencryption.docs.apiary.io/#)                                                | Provides [Encryption](/overview/encryption/).                                                                                                                       |
| [Importer API](https://app.swaggerhub.com/apis-docs/keboola/import)                                         | [Importer](/integrate/storage/api/importer/) is a helper service for easy table imports.                                                                            |
| [Notifications API](https://app.swaggerhub.com/apis/odinuv/notifications-service)                           | API to subscribe to events, e.g., failed orchestrations.                                                                                                            |
| [OAuth Broker API](https://oauthapi3.docs.apiary.io/#)                                                      | OAuth Broker is a component managing [OAuth authorizations](/extend/common-interface/oauth/#authorize) of other components.                                         |
| [Query API](https://query.keboola.com/api/v1/documentation)                                                 | Query is a service for running SQL queries on Snowflake and BigQuery.                                                                                               |
| [Queue API](https://app.swaggerhub.com/apis-docs/keboola/job-queue-api)                                     | Queue is a service for [running components](/extend/docker-runner/) and managing [Jobs](/integrate/jobs/).                                                          |
| [Scheduler API](https://app.swaggerhub.com/apis/odinuv/scheduler)                                           | API to automate configurations.                                                                                                                                     |
| [Stream API](https://stream.keboola.com/v1/documentation/)                                                  | The Keboola Stream API allows you to ingest small and frequent events into your project's storage.                                                                  |
| [Synchronous Actions API](https://app.swaggerhub.com/apis/odinuv/sync-actions)                              | API to trigger [Synchronous Actions](/extend/common-interface/actions/). This is a partial replacement of Docker Runner API and may not be available on all stacks. |
| [Templates API](https://templates.keboola.com/v1/documentation/)                                            | The Keboola Templates API allows you to apply a [template](/cli/templates/).                                                                                        |
| [Vault](https://vault.keboola.com/docs/swagger.yaml)                                                        | Service handling variables & credentials storage.                                                                                                                   |
| [Workspaces API](https://sandboxes.keboola.com/documentation)                                               | Workspaces API for V2 workspaces.                                                                                                                                   |

If you're unsure which API to use, refer to our [integration guide](/integrate/). It describes the roles of different APIs and contains examples of commonly
performed actions.

## Stacks and Endpoints
Keboola is available in multiple [stacks](https://help.keboola.com/overview/#stacks), which can be 
either multi-tenant or single-tenant. Current multi-tenant stacks are:

- US Virginia AWS – [connection.keboola.com](https://connection.keboola.com/)
- US Virginia GCP - [connection.us-east4.gcp.keboola.com](https://connection.us-east4.gcp.keboola.com/)
- EU Frankfurt AWS – [connection.eu-central-1.keboola.com](https://connection.eu-central-1.keboola.com/)
- EU Ireland Azure – [connection.north-europe.azure.keboola.com](https://connection.north-europe.azure.keboola.com/)
- EU Frankfurt GCP - [connection.europe-west3.gcp.keboola.com](https://connection.europe-west3.gcp.keboola.com/)

Each stack operates as an independent instance of Keboola services.
In all the API documentation above, the AWS US stack is used.

Single-tenant stacks are available for a single enterprise customer, with a domain name 
in the format `connection.CUSTOMER_NAME.keboola.com`.

If you are using another stack, modify the endpoints accordingly.
Otherwise, you may encounter `Invalid Token` or unauthorized errors. The *authoritative list* of available endpoints is provided by the [Storage API Index Call](https://keboola.docs.apiary.io/#reference/miscellaneous/api-index/component-list). The following is a sample response:

{% highlight json %}
{
    ...,
  "services": [
        {
            "id": "import",
            "url": "https://import.keboola.com"
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
- `oauth` --- [OAuth Manager Service](/extend/common-interface/oauth/)
- `queue` --- [Service for Running Components](/extend/docker-runner/)
- `billing` --- Service for Computing Credits
- `encryption` --- Service for [Encryption](https://developers.keboola.com/overview/encryption/)
- `sandboxes` --- Workspace Manager Service
- `scheduler` --- [Service for Configuring Schedules](https://developers.keboola.com/automate/set-schedule/)
- `sync-actions` --- [Service for Running Synchronous Actions](/extend/common-interface/actions/)
- `notification` --- Service for Configuring Job Notifications
- `templates` --- [Service for Applying Templates](https://developers.keboola.com/cli/templates/)

For convenience, the following table lists active services and their URLs, though for an authoritative answer 
and in application integrations, we strongly suggest using the above API call.

| API                    | Service        | Region           | URL                                                 |
|------------------------|----------------|------------------|-----------------------------------------------------|
| AI                     | `ai`           | US Virginia AWS  | https://ai.keboola.com                              |
| AI                     | `ai`           | US Virginia GCP  | https://ai.us-east4.gcp.keboola.com                 |
| AI                     | `ai`           | EU Frankfurt AWS | https://ai.eu-central-1.keboola.com                 |
| AI                     | `ai`           | EU Ireland Azure | https://ai.north-europe.azure.keboola.com           |
| AI                     | `ai`           | EU Frankfurt GCP | https://ai.europe-west3.gcp.keboola.com             |
| Billing                | `billing`      | US Virginia AWS  | https://billing.keboola.com                         |
| Billing                | `billing`      | US Virginia GCP  | https://billing.us-east4.gcp.keboola.com            |
| Billing                | `billing`      | EU Frankfurt AWS | https://billing.eu-central-1.keboola.com            |
| Billing                | `billing`      | EU Ireland Azure | https://billing.north-europe.azure.keboola.com      |
| Billing                | `billing`      | EU Frankfurt GCP | https://billing.europe-west3.gcp.keboola.com        |
| Developer Portal       | `developer`    | US Virginia AWS  | https://developer.keboola.com                       |
| Developer Portal       | `developer`    | US Virginia GCP  | https://developer.us-east4.gcp.keboola.com          |
| Developer Portal       | `developer`    | EU Frankfurt AWS | https://developer.eu-central-1.keboola.com          |
| Developer Portal       | `developer`    | EU Ireland Azure | https://developer.north-europe.azure.keboola.com    |
| Developer Portal       | `developer`    | EU Frankfurt GCP | https://developer.europe-west3.gcp.keboola.com      |
| Editor                 | `editor`       | US Virginia AWS  | https://editor.keboola.com                          |
| Editor                 | `editor`       | US Virginia GCP  | https://editor.us-east4.gcp.keboola.com             |
| Editor                 | `editor`       | EU Frankfurt AWS | https://editor.eu-central-1.keboola.com             |
| Editor                 | `editor`       | EU Ireland Azure | https://editor.north-europe.azure.keboola.com       |
| Editor                 | `editor`       | EU Frankfurt GCP | https://editor.europe-west3.gcp.keboola.com         |
| Encryption             | `encryption`   | US Virginia AWS  | https://encryption.keboola.com                      |
| Encryption             | `encryption`   | US Virginia GCP  | https://encryption.us-east4.gcp.keboola.com         |
| Encryption             | `encryption`   | EU Frankfurt AWS | https://encryption.eu-central-1.keboola.com         |
| Encryption             | `encryption`   | EU Ireland Azure | https://encryption.north-europe.azure.keboola.com   |
| Encryption             | `encryption`   | EU Frankfurt GCP | https://encryption.europe-west3.gcp.keboola.com     |
| Importer               | `import`       | US Virginia AWS  | https://import.keboola.com                          |
| Importer               | `import`       | US Virginia GCP  | https://import.us-east4.gcp.keboola.com             |
| Importer               | `import`       | EU Frankfurt AWS | https://import.eu-central-1.keboola.com             |
| Importer               | `import`       | EU Ireland Azure | https://import.north-europe.azure.keboola.com       |
| Importer               | `import`       | EU Frankfurt GCP | https://import.europe-west3.gcp.keboola.com         |
| Management             | `management`   | US Virginia AWS  | https://management.keboola.com                      |
| Management             | `management`   | US Virginia GCP  | https://management.us-east4.gcp.keboola.com         |
| Management             | `management`   | EU Frankfurt AWS | https://management.eu-central-1.keboola.com         |
| Management             | `management`   | EU Ireland Azure | https://management.north-europe.azure.keboola.com   |
| Management             | `management`   | EU Frankfurt GCP | https://management.europe-west3.gcp.keboola.com     |
| Notification           | `notification` | US Virginia AWS  | https://notification.keboola.com                    |
| Notification           | `notification` | US Virginia GCP  | https://notification.us-east4.gcp.keboola.com       |
| Notification           | `notification` | EU Frankfurt AWS | https://notification.eu-central-1.keboola.com       |
| Notification           | `notification` | EU Ireland Azure | https://notification.north-europe.azure.keboola.com |
| Notification           | `notification` | EU Frankfurt GCP | https://notification.europe-west3.gcp.keboola.com   |
| OAuth                  | `oauth`        | US Virginia AWS  | https://oauth.keboola.com                           |
| OAuth                  | `oauth`        | US Virginia GCP  | https://oauth.europe-west3.gcp.keboola.com          |
| OAuth                  | `oauth`        | EU Frankfurt AWS | https://oauth.eu-central-1.keboola.com              |
| OAuth                  | `oauth`        | EU Ireland Azure | https://oauth.north-europe.azure.keboola.com        |
| OAuth                  | `oauth`        | EU Frankfurt GCP | https://oauth.europe-west3.gcp.keboola.com          |
| Query                  | `query`        | US Virginia AWS  | https://query.keboola.com                           |
| Query                  | `query`        | US Virginia GCP  | https://query.us-east4.gcp.keboola.com              |
| Query                  | `query`        | EU Frankfurt AWS | https://query.eu-central-1.keboola.com              |
| Query                  | `query`        | EU Ireland Azure | https://query.north-europe.azure.keboola.com        |
| Query                  | `query`        | EU Frankfurt GCP | https://query.europe-west3.gcp.keboola.com          |
| Queue                  | `queue`        | US Virginia AWS  | https://queue.keboola.com                           |
| Queue                  | `queue`        | US Virginia GCP  | https://queue.us-east4.gcp.keboola.com              |
| Queue                  | `queue`        | EU Frankfurt AWS | https://queue.eu-central-1.keboola.com              |
| Queue                  | `queue`        | EU Ireland Azure | https://queue.north-europe.azure.keboola.com        |
| Queue                  | `queue`        | EU Frankfurt GCP | https://queue.europe-west3.gcp.keboola.com          |
| Scheduler              | `scheduler`    | US Virginia AWS  | https://scheduler.keboola.com                       |
| Scheduler              | `scheduler`    | US Virginia GCP  | https://scheduler.us-east4.gcp.keboola.com          |
| Scheduler              | `scheduler`    | EU Frankfurt AWS | https://scheduler.eu-central-1.keboola.com          |
| Scheduler              | `scheduler`    | EU Ireland Azure | https://scheduler.north-europe.azure.keboola.com    |
| Scheduler              | `scheduler`    | EU Frankfurt GCP | https://scheduler.europe-west3.gcp.keboola.com      |
| Storage                |                | US Virginia AWS  | https://connection.keboola.com/                     |
| Storage                |                | US Virginia GCP  | https://connection.us-east4.gcp.keboola.com         |
| Storage                |                | EU Frankfurt AWS | https://connection.eu-central-1.keboola.com/        |
| Storage                |                | EU Ireland Azure | https://connection.north-europe.azure.keboola.com/  |
| Storage                |                | EU Frankfurt GCP | https://connection.europe-west3.gcp.keboola.com/    |
| Stream                 | `stream`       | US Virginia AWS  | https://stream.keboola.com                          |
| Stream                 | `stream`       | US Virginia GCP  | https://stream.us-east4.gcp.keboola.com             |
| Stream                 | `stream`       | EU Frankfurt AWS | https://stream.eu-central-1.keboola.com             |
| Stream                 | `stream`       | EU Ireland Azure | https://stream.north-europe.azure.keboola.com       |
| Stream                 | `stream`       | EU Frankfurt GCP | https://stream.europe-west3.gcp.keboola.com         |
| Sync Actions           | `sync-actions` | US Virginia AWS  | https://sync-actions.keboola.com/                   |
| Sync Actions           | `sync-actions` | US Virginia GCP  | https://sync-actions.us-east4.gcp.keboola.com       |
| Sync Actions           | `sync-actions` | EU Frankfurt AWS | https://sync-actions.eu-central-1.keboola.com       |
| Sync Actions           | `sync-actions` | EU Ireland Azure | https://sync-actions.north-europe.azure.keboola.com |
| Sync Actions           | `sync-actions` | EU Frankfurt GCP | https://sync-actions.europe-west3.gcp.keboola.com   |
| Templates              | `templates`    | US Virginia AWS  | https://templates.keboola.com                       |
| Templates              | `templates`    | US Virginia GCP  | https://templates.us-east4.gcp.keboola.com          |
| Templates              | `templates`    | EU Frankfurt AWS | https://templates.eu-central-1.keboola.com          |
| Templates              | `templates`    | EU Ireland Azure | https://templates.north-europe.azure.keboola.com    |
| Templates              | `templates`    | EU Frankfurt GCP | https://templates.europe-west3.gcp.keboola.com      |
| Vault                  | `vault`        | US Virginia AWS  | https://vault.keboola.com                           |
| Vault                  | `vault`        | US Virginia GCP  | https://vault.us-east4.gcp.keboola.com              |
| Vault                  | `vault`        | EU Frankfurt AWS | https://vault.eu-central-1.keboola.com              |
| Vault                  | `vault`        | EU Ireland Azure | https://vault.north-europe.azure.keboola.com        |
| Vault                  | `vault`        | EU Frankfurt GCP | https://vault.europe-west3.gcp.keboola.com          |
| Workspaces / Sandboxes | `sandboxes`    | US Virginia AWS  | https://sandboxes.keboola.com                       |
| Workspaces / Sandboxes | `sandboxes`    | US Virginia GCP  | https://sandboxes.us-east4.gcp.keboola.com          |
| Workspaces / Sandboxes | `sandboxes`    | EU Frankfurt AWS | https://sandboxes.eu-central-1.keboola.com          |
| Workspaces / Sandboxes | `sandboxes`    | EU Ireland Azure | https://sandboxes.north-europe.azure.keboola.com    |
| Workspaces / Sandboxes | `sandboxes`    | EU Frankfurt GCP | https://sandboxes.europe-west3.gcp.keboola.com      |


***Important**: Each stack also uses its own set of [IP addresses](https://help.keboola.com/extractors/ip-addresses/).*

## Calling API

There are several ways to send requests to our APIs:

### Apiary Console
Send requests to our API directly from the Apiary console by clicking on **Switch to console** or **Try**.
Fill in the request headers and parameters, then click **Call Resource**.

{: .image-popup}
![Apiary console](/overview/api/apiary-console.png)

The Apiary console is fine if you send API requests only occasionally. It requires no application installation;
however, it has no history and no other useful features.

### Postman Client
[Postman](https://www.getpostman.com/) is a generic HTTP API client, suitable for more regular API work.
We also provide a collection of [useful API calls](https://documenter.getpostman.com/view/3086797/kbc-samples/77h845D?version=latest#9b9f3e7b-de3b-4c90-bad6-a8760e3852eb) with examples.
The collection contains code examples in various languages; the requests can also be imported into the Postman application.

{: .image-popup}
![Postman Docs](/overview/api/postman-import.png)

### cURL
[cURL](https://curl.haxx.se/) is a common library with a [command-line interface (CLI)](https://curl.haxx.se/docs/manpage.html).
You can use the cURL CLI to create simple scripts for interacting with Keboola APIs. For example, to [run a job](/integrate/jobs/):

{% highlight shell %}
curl --location --request POST 'https://queue.keboola.com/jobs' \
--header 'X-StorageApi-Token: YourStorageToken' \
--header 'Content-Type: application/json' \
--data-raw '{
    "mode": "run",
    "component": "keboola.ex-db-mysql",
    "config": "sampledatabase"
}'
{% endhighlight %}
