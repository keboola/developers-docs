---
title: Code Pattern Interface
permalink: /extend/component/code-patterns/interface/
---

* TOC
{:toc}

This page describes how the code patterns works internally, as a part of Keboola Connection.

## Common Interface

Code pattern is a special type of the [Component](/extend/component/), therefore, common interface applies to it. 
In the links below you can find the basic information to integrate your own components into Keboola Conneciton.
- [Component Common Interface](/extend/common-interface/) 
- [Environment](/extend/common-interface/environment/)
- [Implementation Notes](/extend/component/implementation/)

**Let's highlight the most important information.**
- Component code is wrapped in a [Docker](/extend/component/docker-tutorial/) image.
- Component gets the [Configuration File](#configuration).
- The correct exit code must be used.
    - See [Return Values](/extend/common-interface/environment/#return-values)
    - See [Handling User and Application errors](https://developers.keboola.com/extend/common-interface/actions/#handling-user-and-application-errors).
- The [Storage API Token](https://help.keboola.com/management/project/tokens/) can be forwarded to the `KBC_TOKEN` environment variable.
    - For example, if you need to know the details about the table in the input mapping.
    - It must be enabled and approved by us.
    - Read more in the [Environment](/extend/common-interface/environment/).


## Code Generation Process

This section shows how the code generation process works from start to end.

- First, there must be a [published](/extend/publish/) code pattern component, for example `keboola.example-pattern`.
- The component must have configured [Supported Transformations](#supported-components).
    - For example, it supports `keboola.snowflake-transformation`.
- [Create a transformation with the code pattern](https://help.keboola.com/transformations/code-patterns/#new-transformation-with-code-pattern) in the user interface.
- Click the **Generate Code** button.
- User interface calls the [Generate Action](#generate-action) on the `keboola.example-pattern` component.
- The action finishes with the correct exit code:
    - If **success**, `exit code = 0`
        - The component `stdout` contains JSON in the [Output Format](#output-format). 
        - The code blocks in the [parameters](#output-format) are stored to the transformation.
    - If **failure** `exit code = 1 or 2`
        - The error is processed according to the exit code, see [Return Values](/extend/common-interface/environment/#return-values).
        - The previous version of the generated code remains in the transformation.
- The generated code is read-only displayed in the user interface.


## Generate Action

There are two types of the component’s actions:
- [Asynchronous, background](/integrate/jobs/) **run** action.
- [Synchronous actions](/extend/common-interface/actions/) with limited execution time.

Code patterns:
- do not implement the **run** action.
- implement only the **generate** [synchronous action](/extend/common-interface/actions/).

Expected behavior of the **generate** action :
- The action is started by the [Run component action](https://kebooladocker.docs.apiary.io/#reference/actions/run-custom-component-action/process-action) API call.
- The `CMD` process defined in the `Dockerfile` is [started in the container](/extend/component/docker-tutorial/#running-docker-images-in-kbc).
- The component's generates a transformation code based on the [Configration](#configuration).
- The result is written in the [Output Format](#output-format) to `stdout`.
- The process ends successfully with `exit code = 0` (or with other [Return Value](/extend/common-interface/environment/#return-values) in an error occured).
- API returns the result of the action.
- The user interface modifies the transformation's configuration and saves it. 


### Configuration

The [Configuration File](/extend/common-interface/config-file/) `config.json` file in the `KBC_DATADIR` contains:
- **`action`** key, with the `generate` value, name of the [Action](/extend/common-interface/actions/).
- **`storage`** key contains current input and output mapping from the transformation.
    - In the [Configuration File - Tables](/extend/common-interface/config-file/#tables) is described a schema and examples.
    - In the [Overview - Input and Output Mapping](https://help.keboola.com/transformations/code-patterns/#input-and-output-mapping) is shown exemplary user interface.
- **`parameters`** key modifies generated code.
    - **`_componentId`** key contains the id of the target transformation component.
        - For example `keboola.snowflake-transformation`.
        - Based on this, it is possible to modify the generated code, e.g. for various SQL dialects.
    - The other keys are provided from the [Parameters Form](https://help.keboola.com/transformations/code-patterns/#parameters-form), filled in by the user.
        - The schema of the form is defined [in the Configuration Schema](#configuration-schema).
        - The values should be [validated](/extend/common-interface/config-file/#validation) in the component's code.
    
**Note**: Read more about `KBC_DATADIR` environment variable in the [Environment](/extend/common-interface/environment/).

Example configuration. Examples of the `storage` key can be found [here](/extend/common-interface/config-file/#tables).
```json
{ 
  "action": "generate",
  "storage": {
    "input": {
      "tables": ["..."]
     },
     "output": {
       "tables": ["..."]
     }
  },
  "parameters": {
    "_componentId": "keboola.snowflake-transformation",
    "form_parameter_1": "value 1",
    "form_parameter_2": "value 2"
  }
}
```


### Output Format

The component must write the generated code to `stdout` in the following JSON format:
- **`storage`** key contains a new transformation's input and output mapping.
    - It is optional, if absent, the mapping remains unchanged.
    - It is copied into the transformation's configuration `storage` key.
    - In the [Configuration File - Tables](/extend/common-interface/config-file/#tables) is a schema and examples.
- **`parameters`** key with the generated code.
    - It is copied into the transformation's configuration `parameters` key.
    - [Schema](https://help.keboola.com/transformations/#writing-scripts) `blocks` -> `codes` -> `script` must be used. See below.
    - Each statement must be a separate item in the `script` array.

Example output. Examples of the `storage` key can be found [here](/extend/common-interface/config-file/#tables).
```json
{
  "storage": {
    "input": {
      "tables": ["..."]
     },
     "output": {
       "tables": ["..."]
     }
  },
  "parameters": {
    "blocks": [
      {
        "name": "Generated block",
        "codes": [
          {
            "name": "Generated code",
            "script": [
              "CREATE TABLE table1;",
              "SELECT foo1, foo2 FROM table2 INTO bar;"
            ]
          }
        ]
      }
    ]   
  }
}
```

## Developer Portal

Component must be registered in the [Keboola Developer Portal](https://components.keboola.com/),
see [Component Quick Start](/extend/component/tutorial/).

 
For code pattern component it is necessary to take following extra steps.

First, create a component with the `Code Pattern` type.

{: .image-popup}
![Screenshot -- Add component](/extend/component/code-patterns/interface-1-add-component.png)

Open the component edit page and modify the settings described in the following sections.

{: .image-popup}
![Screenshot -- Edit component page](/extend/component/code-patterns/interface-5-edit-component.png)

### Configuration Schema

- [Parameters Form](https://help.keboola.com/transformations/code-patterns/#parameters-form) in the user interface
is generated from the [Configration Schema](/extend/component/ui-options/configuration-schema/).
- Click on the **Preview** button, to see the preview of the form. 


{: .image-popup}
![Screenshot -- Configuration schema](/extend/component/code-patterns/interface-2-schema.png)

### Supported Components

Each code pattern can generate a code for one or more types of the transformation's component.
- An array of these component ids must be entered in the [Configration Schema](/extend/component/ui-options/configuration-schema/).  
- At the root level, to the `supported_components` key.

{: .image-popup}
![Screenshot -- List of the supported components](/extend/component/code-patterns/interface-3-supported-list.png)


Now, when creating one of the listed transformation's component,  
then the [published](/extend/publish/) code pattern will be available in the select box.

{: .image-popup}
![Screenshot -- Create a new transformation](/extend/component/code-patterns/interface-4-new-transformation.png)

The code pattern's [Configuration](/extend/component/code-patterns/interface#configuration) contains `parameters._componentId` key,
so it is possible to distinguish for which transformation's component the code is generated.

## Next Steps
- [Tutorial](/extend/component/code-patterns/tutorial) helps you to implement your first code pattern.
- [Code Patterns Help](https://help.keboola.com/transformations/code-patterns/) shows the code patterns from the user's point of view.
