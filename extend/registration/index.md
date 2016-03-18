---
title: Component Registration
permalink: /extend/registration/
---

## Introduction
As described in the [architecture overview](/architecture/), KBC consists of many different components. Only those components that are registered in our **Component List** are generally available in KBC. The list is provided by our [Storage Component API](http://docs.keboola.apiary.io/#) in the dedicated [Components section](http://docs.keboola.apiary.io/#reference/components). 

While a [Custom Science extension](/extend/custom-science/) requires registration only when offered to all KBC users, registering a [Docker extension](/extend/docker/) is mandatory at all times.

That being said, any KBC user can use any registered component, unless:

- the KBC user (or their token) has a [limited access to the component](/token-permissions/)
- the component itself limits where it can run (in what projects and for which users)

## Using a Private Repository
If your image cannot be public, you can use a private docker repository on both DockerHub and Quay.io.

### DockerHub

An account has to be created in order to access your private DockerHub repositories. Please provide us with your `email`, `username`, `password` and `server` properties from the login credentials. Better yet - create a new user that has an access to the desired repository and surrender it to us. 

DockerHub offers 1 free private repository per account.

### Quay.io

Quay.io offers convenient robot accounts. Provide us with a robot `username` and `token` with a read-only access to the desired repository and we're good to go.

{: .image-popup}
![Quay.io screenshot](/extend/registration/quayioprivate.png)
 
Private Quay.io repositories are paid.
 
## Registration
The registration process is simple, but it must be done by Keboola. To register your extension, 
please fill in the [checklist](/extend/registration/checklist) and contact us.

### UI Options
Each extension will receive a **Generic UI**. The generic UI will always show a text field for entering the 
component configuration in JSON format. Additionally, you can request other parts of the generic UI by 
adding any of `tableInput`, `tableOutput`, `fileInput`, `fileOutput`, `genericDockerUI` flags in the checklist. Each of 
the options is shown below:

#### genericDockerUI
This provides a basic textarea for setting extension parameters as a JSON, the textarea has 
JSON validation and syntax highlighting.

{: .image-popup}
![Generic configuration screenshot](/extend/registration/configuration.png)

#### tableInput
This flag provides a UI for setting the table input mapping. With this UI you can set:

- *source* - the name of the table in Storage
- *destination* - the name of the .csv file passed to the application
- *columns* - select only some columns of the source table
- *days* - load only rows modified in the specified number of days; useful for incremental loads
- *data filter* - a simple filter for selecting specified rows only

{: .image-popup}
![Table input screenshot](/extend/registration/table-input-1.png)

{: .image-popup}
![Table input detail screenshot](/extend/registration/table-input-2.png)

#### tableOutput
This flag provides a UI for setting the table output mapping. With this UI you can set:

- *source* - the name of the .csv file retrieved from the application
- *destination* - the name of the table in Storage, the destination bucket should exist already
- *incremental* - if checked, the loaded data will be appended to the contents of the destination table
- *primary key* - set the primary key for your destination table - multiple columns are allowed
- *delete rows* - delete some rows from the destination table using a simple filter

{: .image-popup}
![Table output screenshot](/extend/registration/table-output-1.png)

{: .image-popup}
![Table output detail screenshot](/extend/registration/table-output-2.png)

#### fileInput
This flag provides a UI for setting the file input mapping. With this UI you can set:

- *file tags* - select files by the file tags listed in *File Uploads*
- *query* - [ElasticSearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)
to select files from *File Uploads*
- *processed tags* - used for [incremental processing](/extend/common-interface/#incremental-processing)

{: .image-popup}
![File input screenshot](/extend/registration/file-input-1.png)

{: .image-popup}
![File input detail screenshot](/extend/registration/file-input-2.png)

#### fileOutput
This flag provides a UI for setting the file output mapping. With this UI you can set:

- *source* - the name of the file produced by the application
- *file tags* - the file tags assigned to the produced file
- *is public* - the file is accessible to anyone knowing its URL
- *is permanent* - the file won't be deleted after 180 days

{: .image-popup}
![File output screenshot](/extend/registration/file-output-1.png)

{: .image-popup}
![File output detail screenshot](/extend/registration/file-output-2.png)

### Hide your Extension from the KBC App Store
If you want to test your extension before making it available to all users, it can be 
hidden from the list of all components (UI flag `excludeFromNewList`). 
However, this does not really prevent anyone from using it.
To use a non-published extension, create the configuration with 
the [component API](http://docs.keboola.apiary.io/#reference/components/create-config/create-config). 
Or visit directly the following URL: https://connection.keboola.com/admin/projects/{projectId}/applications/{componentId}.
The *projectid* is your KBC project ID. The *componentId* (e.g. _myCompany.acmeApplication_) is provided upon your extension registration.

