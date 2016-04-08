---
title: Component Registration
permalink: /extend/registration/
---

* TOC
{:toc}

## Introduction
As described in the [architecture overview](/overview/), KBC consists of many different components. Only those components that are registered in our **Component List** are generally available in KBC. The list is provided by our [Storage Component API](http://docs.keboola.apiary.io/#) in the dedicated [Components section](http://docs.keboola.apiary.io/#reference/components). 

While a [Custom Science extension](/extend/custom-science/) requires registration only when offered to all KBC users, registering a [Docker extension](/extend/docker/) is mandatory at all times.

That being said, any KBC user can use any registered component, unless

- the KBC user (or their token) has a [limited access to the component](http://help.keboola.com/storage/tokens/),
- the component itself limits where it can run (in what projects and for which users).

## Using a Private Repository
If your image cannot be public, you can use a private Docker repository on both DockerHub and Quay.io. If you are 
registering a [Custom Science](/extend/custom-science/) extension and you want to use private git repository, you need to provide us with [encrypted credentials to the git repository](/extend/custom-science/development/#encryption-beforehand).

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
This flag provides a UI for setting the table input mapping. With this UI, you can set:

- *Source* -- the name of the table in Storage
- Destination *file name* -- the name of the .csv file passed to the application
- *Columns* -- select only some columns of the source table
- *Days* -- load only rows modified in the specified number of days; useful for incremental loads
- *Data filter* -- a simple filter for selecting specified rows only

{: .image-popup}
![Table input screenshot](/extend/registration/table-input-1.png)

{: .image-popup}
![Table input detail screenshot](/extend/registration/table-input-2.png)

#### tableOutput
This flag provides a UI for setting the table output mapping. With this UI, you can set:

- *Source* -- the name of the .csv file retrieved from the application
- *Destination* -- the name of the table in Storage, the destination bucket should exist already
- *Incremental* -- if checked, the loaded data will be appended to the contents of the destination table
- *Primary key* -- set the primary key for your destination table - multiple columns are allowed
- *Delete rows* -- delete some rows from the destination table using a simple filter

{: .image-popup}
![Table output screenshot](/extend/registration/table-output-1.png)

{: .image-popup}
![Table output detail screenshot](/extend/registration/table-output-2.png)

#### fileInput
This flag provides a UI for setting the file input mapping. With this UI, you can set:

- *File tags* -- select files by the file tags listed in *File Uploads*
- *Query* -- [ElasticSearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)
to select files from *File Uploads*
- *Processed tags* -- used for [incremental processing](/extend/common-interface/config-file/#incremental-processing)

{: .image-popup}
![File input screenshot](/extend/registration/file-input-1.png)

{: .image-popup}
![File input detail screenshot](/extend/registration/file-input-2.png)

#### fileOutput
This flag provides a UI for setting the file output mapping. With this UI, you can set:

- *Source* -- the name of the file produced by the application
- *File tags* -- the file tags assigned to the produced file
- *Is public* -- the file is accessible to anyone knowing its URL
- *Is permanent* -- the file won't be deleted after 180 days

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

