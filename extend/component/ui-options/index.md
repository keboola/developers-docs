---
title: UI Options
permalink: /extend/component/ui-options/
---

* TOC
{:toc}

Each component needs to specify how its user interface (UI) will look. Otherwise the component cannot
be configured via the UI (it can still be configured using the API though).

The most basic UI configuration is `genericDockerUI`. The generic UI will always show a text field for entering the
component configuration in JSON format. Other parts of the UI are turned on using other [UI options](/extend/component/ui-options/)
(for example, `genericDockerUI-tableInput`, `genericDockerUI-tableOutput`). All of the [UI options](/extend/component/ui-options/) may be combined freely.

## genericDockerUI
This provides a basic text area for setting component parameters as a JSON; the text area has
JSON validation and syntax highlighting.

{: .image-popup}
![Generic configuration screenshot](/extend/component/ui-options/configuration.png)

The configuration provided in this input is available in the `parameters` section of the
[configuration file](/extend/common-interface/config-file/#configuration-file-structure).
Defining a [configuration schema](/extend/component/ui-options/configuration-schema/) will replace the JSON text area with a form.

## genericDockerUI-tableInput
This flag provides a UI for setting the table input [mapping](https://help.keboola.com/manipulation/transformations/mappings/).
You can set the following options:

- *Source* --- the name of the table in Storage
- Destination *file name* --- the name of the .csv file passed to the component
- *Columns* --- select only some columns of the source table
- *Days* --- load only rows modified in the specified number of days; useful for incremental loads; set to 0 to load all data
- *Data filter* --- a simple filter for selecting specified rows only

{: .image-popup}
![Table input screenshot](/extend/component/ui-options/table-input-0.png)

{: .image-popup}
![Table input detail screenshot](/extend/component/ui-options/table-input-1.png)

{: .image-popup}
![Table input result screenshot](/extend/component/ui-options/table-input-2.png)

The configuration provided in this input is available in the `storage.input` section of the
[configuration file](/extend/common-interface/config-file/#configuration-file-structure).

## genericDockerUI-tableOutput
This flag provides a UI for setting the table output [mapping](https://help.keboola.com/manipulation/transformations/mappings/). This UI part **should not be used**
if the component is using the [default bucket](/extend/common-interface/folders/#default-bucket) setting.

With this UI, you can set the following options:

- *Source* --- the name of the .csv file retrieved from the component
- *Destination* --- the name of the table in Storage, the destination bucket should exist already
- *Incremental* --- if checked, the loaded data will be appended to the contents of the destination table
- *Primary key* --- set the primary key for your destination table --- multiple columns are allowed
- *Delete rows* --- delete some rows from the destination table using a simple filter

{: .image-popup}
![Table output screenshot](/extend/component/ui-options/table-output-0.png)

{: .image-popup}
![Table output detail screenshot](/extend/component/ui-options/table-output-1.png)

{: .image-popup}
![Table output result screenshot](/extend/component/ui-options/table-output-2.png)

The configuration provided in this input is available in the `storage.output` section of the
[configuration file](/extend/common-interface/config-file/#configuration-file-structure).

## genericDockerUI-processors
This flag provides a UI for the [processor configuration](/extend/component/processors/).
It offers a basic text area for setting the processors and their parameters as a JSON; the text area has
JSON validation and syntax highlighting.

{: .image-popup}
![Processors screenshot](/extend/component/ui-options/processors.png)

## genericDockerUI-fileInput
This flag provides a UI for setting the file input mapping. You can set the following options:

- *File tags* --- select files by the file tags listed in **File Uploads**
- *Query* --- [ElasticSearch query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#query-string-syntax)
to select files from **File Uploads**
- *Processed tags* --- used for [incremental processing](/extend/common-interface/config-file/#incremental-processing)

{: .image-popup}
![File input screenshot](/extend/component/ui-options/file-input-0.png)

{: .image-popup}
![File input detail screenshot](/extend/component/ui-options/file-input-1.png)

{: .image-popup}
![File input result screenshot](/extend/component/ui-options/file-input-2.png)

The configuration provided in this input is available in the `storage.input` section of the
[configuration file](/extend/common-interface/config-file/#configuration-file-structure).

## genericDockerUI-fileOutput
This flag provides a UI for setting the file output mapping. You can set the following options:

- *Source* --- the name of the file produced by the component
- *File tags* --- the file tags assigned to the produced file
- *Is public* --- the file is accessible to anyone knowing its URL
- *Is permanent* --- the file will not be deleted after 180 days

{: .image-popup}
![File output screenshot](/extend/component/ui-options/file-output-0.png)

{: .image-popup}
![File output detail screenshot](/extend/component/ui-options/file-output-1.png)

{: .image-popup}
![File output result screenshot](/extend/component/ui-options/file-output-2.png)

The configuration provided in this input is available in the `storage.output` section of the
[configuration file](/extend/common-interface/config-file/#configuration-file-structure).

## genericDockerUI-authorization
This flag provides a UI for setting [OAuth2 Authorization](/extend/common-interface/oauth/). However, to
actually activate OAuth for your component, you have to [contact our support](mailto:support@keboola.com).

{: .image-popup}
![Authorization screenshot](/extend/component/ui-options/auth-0.png)

{: .image-popup}
![Authorization detail screenshot](/extend/component/ui-options/auth-1.png)

The configuration provided in this input is available in the `authorization` section of the
[configuration file](/extend/common-interface/config-file/#configuration-file-structure).

## genericTemplatesUI
This flag is used to provide a UI for components based on the [Generic Extractor](/extend/generic-extractor/). It allows the end user to select a
[Generic Extractor template](/extend/generic-extractor/publish/).

## genericDockerUI-runtime
This flag is **deprecated**. It provides a UI for setting parameters for Custom Science.
