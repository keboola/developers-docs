---
title: Component Registration
permalink: /extend/registration/
---

## Introduction
As described in the [architecture overview](/architecture/), KBC consists of many different components. If you want your [Docker extension](/extend/docker/) or [Custom Science extension](/extend/custom-science/) to be generally available in KBC, it must be registered in our **component list**. The Component list itself is provided by [Storage Component API](http://docs.keboola.apiary.io/#) in the dedicated [Components section](http://docs.keboola.apiary.io/#reference/components). 
Only registered components can be run by KBC users, and any KBC user can use any component with the following exceptions:

- the KBC user (or their token) has [limited access to the component](/token-permissions/)
- the component itself limits where (in what projects, for which users) it can run

Note that it is not at all necessary to register your Custom Science extension as a component, unless you want other 
KBC users to use it. 
However, it is always necessary to register your Docker extension, even if it supposed to be used only in a single project.

## Using private repository
If your image cannot be public, you can use private docker repository and in that case you would need to provide 
us with `email`, `username`, `password` and `server` properties from the login credentials.

## Registration
The registration process is simple, but it must be done by Keboola. To register your extension, 
please fill in the [checklist](/extend/registration/checklist) and contact us.

### UI Options
Each extension will receive a **Generic UI**. The generic UI will always show a text field for entering the 
component configuration in JSON format. Additionally, you can request other parts of the generic UI by 
adding any of `tableInput`, `tableOutput`, `fileInput`, `fileOutput`, `genericDockerUI` flags in the checklist. Each of 
the options is shown below:

#### genericDockerUI
This provides basic textarea for setting extension parameters as a JSON, the textarea has 
JSON validation and syntax highlighting.

![Generic configuration screenshot](/extend/registration/configuration.png)

#### tableInput
This flag provides UI for setting table input mapping. With this UI you can set:

- source (name of table in Storage)
- destination (name of .csv file passed to the application)
- columns (select only some columns of the source table)
- days (load only rows modified in the specified number of days - useful for incremental loads)
- data filter (a simple filter for selecting only specified rows)

![Table input screenshot](/extend/registration/table-input-1.png)
![Table input detail screenshot](/extend/registration/table-input-2.png)

#### tableOutput
This flag provides UI for setting table output mapping. With this UI you can set:

- source (name of .csv file retrieved from the application)
- destination (name of table in Storage, destination bucket should exist already)
- incremental (if checked, the loaded data will be appended to the contents of the destination table)
- primary key (set primary key for destination table - multiple columns are allowed)
- delete rows (delete some rows from the destination table using a simple filter)

![Table output screenshot](/extend/registration/table-output-1.png)
![Table output detail screenshot](/extend/registration/table-output-2.png)

#### fileInput
This flag provides UI for setting file input mapping. With this UI you can set:
- file tags (select files by file tags listed in *File Uploads*)
- query ([ElasticSearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)
to select files from *File Uploads*)
- processed tags (used for [incremental processing](/extend/common-interface/#incremental-processing))

![File input screenshot](/extend/registration/file-input-1.png)
![File input detail screenshot](/extend/registration/file-input-2.png)

#### fileOutput
This flag provides UI for setting file output mapping. With this UI you can set:
- source (name of file produced by the application)
- file tags (file tags assigned to produced file)
- is public (file is accesible to anyone knowing its URL)
- is permanent (file won't be deleted after 180 days)

![File output screenshot](/extend/registration/file-output-1.png)
![File output detail screenshot](/extend/registration/file-output-2.png)

### Hide Extension from KBC App Store
You might want to test your extension before it is made available to all users. This is possible - the extension can be 
hidden from the list of all components (UI flag `excludeFromNewList`). 
This is useful if you want to continue testing and developing the application without making it available to all KBC users.
However, this does not really prevent anyone from using it.
To use a non-published extension, you can create the configuration using 
the [component API](http://docs.keboola.apiary.io/#reference/components/create-config/create-config). 
Or visit directly the following URL: https://connection.keboola.com/admin/projects/{projectId}/applications/{componentId}
*projectid* is simply the ID of your KBC project and when your extension is registered, 
you will obtain *componentId* (e.g. _myCompany.acmeApplication_).

