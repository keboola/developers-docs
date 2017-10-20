---
title: Component Registration
permalink: /extend/registration/
redirect_from: /extend/registration/checklist/
---

* TOC
{:toc}

## Introduction
As described in the [architecture overview](/overview/), Keboola Connection (KBC) consists of many different components.
Only those components that are registered in our **Component List** are generally available in KBC.
The list is provided by our [Storage Component API](http://docs.keboola.apiary.io/#) in the dedicated [Components section](http://docs.keboola.apiary.io/#reference/components).
The list of Components is manages using [Keboola Developer](https://apps.keboola.com/) portal.

While a [Custom Science extension](/extend/custom-science/) requires registration only when offered to all KBC users,
registering a [Docker extension](/extend/docker/) is mandatory at all times.

That being said, any KBC user can use any registered component, unless

- the KBC user (or their token) has a [limited access to the component](https://help.keboola.com/storage/tokens/),
- the component itself limits where it can run (in what projects and for which users).

## Registration
To register and application, you need to have an account in [Keboola Developer Portal](https://apps.keboola.com/auth/create-account).
The registration is free and quick, it requires a working email (to which a confirmation email will be sent) and
a mobile phone for a mandatory two-factor authorization. When you log in to the developer portal, you have to join a
**vendor**. A vendor is organization of developers. Every application in KBC has to belong to vendor. If you work for no company, we
suggest to create a vendor with your name. Even if you want to create a single component, it still has to belong to a vendor.

If you join an existing vendor, an administrator of that vendor has to approve your request. If you want to create a
new vendor, a Keboola Administrator has to approve your request.

{: .image-popup}
![Screenshot -- Join a vendor](/extend/registration/join-vendor.png)

To add an application, follow the instructions and fill in the application name and ID:

{: .image-popup}
![Screenshot -- Create application](/extend/registration/register-app.png)

**Do not use the words 'extractor', 'writer' or 'application' in application name.**
When creating an application, you will obtain the **Component ID** (in form `vendor.app-id`) -- e.g. `ujovlado.ex-wuzzzup`.
Once you have the Component ID, you can create configurations for the application. You can also review the
application in Keboola Connection by visiting a URL:

    https://connection.keboola.com/admin/projects/{PROJECT_ID}/extractors/{COMPONENT_ID}

Note however that the configuration will not be runnable until you configure the **Repository** section of the
application.

**Important: changes made in Developer Portal take up to 5 minutes to propagate to all Keboola Connection instances in all regions.**

## Application Repository
We offer free hosting of your images in **[AWS ECR](https://aws.amazon.com/ecr/)** under our own account.
All repositories in AWS ECR are private. When registering your component, you will receive
[credentials for deployment](/extend/docker/registration/deployment/) to the repository and you can either push the
images manually or use a CI pipeline to push images.

We also support DockerHub and Quay.io registries, both public and private. However, we recommend that you use AWS ECR
unless you require DockerHub or Quay for some reason (e.g. that the image is public).
The main benefit of AWS ECR is its reliability, as Quay.io and DockerHub are more prone to outages and are beyond our control.

### Generic Extractor
For registering a component based on [Generic Extractor](https://developers.keboola.com/extend/generic-extractor/), use the following repository:

    147946154733.dkr.ecr.us-east-1.amazonaws.com/developer-portal-v2/ex-generic-v2

For a list of available tags, see [Generic Extractor repository](https://github.com/keboola/generic-extractor/releases).
It is also possible to use the `latest` tag, which points to the highest available tag. However we recommend that you
register your component with a specific tag and update manually to avoid problems with breaking changes in future Generic
Extractor releases.

### Custom Science
When registering Custom science applications, one of [our images](https://developers.keboola.com/extend/docker/images/)
should be used. The registration of Custom Science applications is not supported yet on developer portal, so please
[contact us on support](mailto:support@keboola.com).
If you are registering a [Custom Science](/extend/custom-science/) extension and want to use a private git repository,
provide us with [encrypted credentials to the git repository](/extend/custom-science/development/#encryption-beforehand).

## UI Options
Each extension needs to specify how its user interface (UI) will look. Without any configuration, the component cannot
be configured via UI (it can still be configured through the API though).

will receive a **Generic UI**. The generic UI will always show a text field for entering the
component configuration in JSON format. Additionally, you can request other parts of the generic UI by
adding any of the `genericDockerUI`, `genericDockerUI-tableInput`, `genericDockerUI-tableOutput`,
`genericDockerUI-fileInput`, `genericDockerUI-fileOutput`  flags in the checklist. All of the flags
may combined freely.

Each of the options is shown below:

### genericDockerUI
This provides a basic textarea for setting extension parameters as a JSON; the textarea has
JSON validation and syntax highlighting.

{: .image-popup}
![Generic configuration screenshot](/extend/registration/configuration.png)

Defining a [configuration schema](/extend/registration/configuration-schema/) will replace the JSON textarea with a form.

### genericDockerUI-tableInput
This flag provides a UI for setting the table input [mapping](https://help.keboola.com/manipulation/transformations/mappings/).
With this UI, you can set:

- *Source* --- the name of the table in Storage
- Destination *file name* --- the name of the .csv file passed to the application
- *Columns* --- select only some columns of the source table
- *Days* --- load only rows modified in the specified number of days; useful for incremental loads; set to 0 to load all data
- *Data filter* --- a simple filter for selecting specified rows only

{: .image-popup}
![Table input screenshot](/extend/registration/table-input-0.png)

{: .image-popup}
![Table input detail screenshot](/extend/registration/table-input-1.png)

{: .image-popup}
![Table input result screenshot](/extend/registration/table-input-2.png)

### genericDockerUI-tableOutput
This flag provides a UI for setting the table output [mapping](https://help.keboola.com/manipulation/transformations/mappings/). With this UI, you can set:

- *Source* --- the name of the .csv file retrieved from the application
- *Destination* --- the name of the table in Storage, the destination bucket should exist already
- *Incremental* --- if checked, the loaded data will be appended to the contents of the destination table
- *Primary key* --- set the primary key for your destination table --- multiple columns are allowed
- *Delete rows* --- delete some rows from the destination table using a simple filter

{: .image-popup}
![Table output screenshot](/extend/registration/table-output-0.png)

{: .image-popup}
![Table output detail screenshot](/extend/registration/table-output-1.png)

{: .image-popup}
![Table output result screenshot](/extend/registration/table-output-2.png)

### genericDockerUI-processors
This flag provides UI for [Processor configuration](/extend/docker-runner/processors/).
It provides a basic textarea for setting processors and their parameters as a JSON; the textarea has
JSON validation and syntax highlighting.

{: .image-popup}
![Processors screenshot](/extend/registration/processors.png)

### genericDockerUI-fileInput
This flag provides a UI for setting the file input mapping. With this UI, you can set:

- *File tags* --- select files by the file tags listed in *File Uploads*
- *Query* --- [ElasticSearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)
to select files from *File Uploads*
- *Processed tags* --- used for [incremental processing](/extend/common-interface/config-file/#incremental-processing)

{: .image-popup}
![File input screenshot](/extend/registration/file-input-0.png)

{: .image-popup}
![File input detail screenshot](/extend/registration/file-input-1.png)

{: .image-popup}
![File input result screenshot](/extend/registration/file-input-2.png)

### genericDockerUI-fileOutput
This flag provides a UI for setting the file output mapping. With this UI, you can set:

- *Source* --- the name of the file produced by the application
- *File tags* --- the file tags assigned to the produced file
- *Is public* --- the file is accessible to anyone knowing its URL
- *Is permanent* --- the file will not be deleted after 180 days

{: .image-popup}
![File output screenshot](/extend/registration/file-output-0.png)

{: .image-popup}
![File output detail screenshot](/extend/registration/file-output-1.png)

{: .image-popup}
![File output result screenshot](/extend/registration/file-output-2.png)

### genericDockerUI-authorization
This flag provides UI for setting [OAuth2 Authorization](/extend/common-interface/oauth/). However, to
actually activate OAuth for your component, you have to [contact us on support](mailto:support@keboola.com).

{: .image-popup}
![Authorization screenshot](/extend/registration/auth-0.png)

{: .image-popup}
![Authorization detail screenshot](/extend/registration/auth-1.png)

### genericTemplatesUI
This flag is used to provide UI for components based on [Generic Extractor](/extend/generic-extractor/registration/).

### genericDockerUI-runtime
This flag provides UI for setting parameters for [Custom Science](/extend/custom-science/).
We recommend that you [contact us on support](mailto:support@keboola.com) when registering a Custom Science application.

{: .image-popup}
![Runtime configuration screenshot](/extend/registration/runtime-0.png)

{: .image-popup}
![Runtime configuration screenshot](/extend/registration/runtime-1.png)

## Publish your Extension in KBC App Store
When you register an extension (be it either [Docker Extension](/extend/docker/) or [Custom Science](/extend/custom-science/) or
[Generic Extractor](/extend/generic-extractor/)), it is not published. A component not published
can be used without limitations but it is not accessible in the KBC UI. This means that it can only be
used only by directly visiting a link with the specific component ID or via the API. Unpublished components are also not part
of the [Public Component list](https://apps.keboola.com/apps). A configuration of non-public component is accessible the same way as any other component.

To publish an application, you have to request an application approval from Keboola. This is done in
[Keboola Developer](https://apps.keboola.com/) portal by requesting approval from the application list. A member of our staff will review
your application and will publish the application or contact you with required changes.

{: .image-popup}
![Approval screenshot](/extend/registration/approve.png)

The goal of the review is to maintain
reasonable end-user experience and application reliability. The following best practices should be followed:

- Application name and description:
    - Name should not contain words like `extractor`, `application`, `writer`. (Good: *Cloudera Impala*, Bad: *Cloudera Extractor*)
    - Short description is more of a description of the service (which allow the user to find it) then a description of the component. (Good: *Native analytic database for Apache Hadoop.* Bad: *This extractor extracts data from Cloudera Impala*)
    - Long description should provide additional information about the **data** extracted/written. What will the end-user obtain? What must the end-user provide? The long description should not contain instructions how to configure the component. This is because the long description is displayed before the end-user attempts to configure the component. However, if there are any special requirements (external approval, specific account setting), they should be stated. (Good: *This component allows you to extract currency exchange rates as published by European Central Bank (ECB) The exchange rates are available from base currency (either USD or EUR) to 30 destination currencies (AUD, BGN, BRL, CAD, CNY, CZK, EUR, GBP, HKD, HRK, HUF, CHF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PLN, RON, RUB, SEK, SGD, THB, TRY, ZAR). Rates are available for all working days from 4th of January 1999 up to present.*)
    - Application Icon must be representative and not blurred :)
    - The application must correctly state the data flow --- UI flags `appInfo.dataOut` (typically writers), `appInfo.dataIn` (typically extractors).
    - Licensing information must be valid and Vendor description must be current.
- Application Configuration:
    - Use only the necessary flags (i.e. if there are no output files, don't use `genericDockerUI-fileOutput`).
    - Use [Configuration Schema](/extend/registration/configuration-schema/).
    - Use Configuration description if the configuration is not trivial / self-explainable. Provide links to resources (e.g. when doing Elastic extractor, not everyone is familiar with ElasticSearch query syntax).
- Application Internals:
    - Make sure that the amount consumed **memory does not depend** on the amount of processed data. Use streaming or processing in chunks to maintain a limited amount of consumed memory. If not possible, then state the expected usage in the **Application Limits**.
    - The application must distinguish between [User and Application errors](/extend/common-interface/environment/#return-values).
    - The application must validate its parameters, invalid configuration must result in an user error.
    - The events produced must be reasonable. Provide status messages if possible and with reasonable frequency. Avoid internal messages with no meaning to the end-user. Avoid flooding the event log or sending data files in the event log.
    - Set up [Continuos Deployment](/extend/docker/registration/deployment/) so that you can keep the application up-date.
