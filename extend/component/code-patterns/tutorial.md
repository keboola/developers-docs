---
title: Code Pattern Quick Start
permalink: /extend/component/code-patterns/tutorial
---

* TOC
{:toc}

In the [Overview](/extend/component/code-patterns/overview) you could see the code patterns from the user's point of view.
In the [Interface](/extend/component/code-patterns/interface) is described how the code patterns work internally.
This page explains how to create your own code pattern component.

Code Pattern is a type of the [Component](/extend/component/), 
so its creation is partially described in the [Component Quick Start](/extend/component/tutorial/).
Here are explained only the extra steps, that are specific for the code patterns.

## Creating Component

Follow the [Component Quick Start](/extend/component/tutorial/).
- [Before You Start](/extend/component/tutorial/#before-you-start) 
- [Creating Component](/extend/component/tutorial/#creating-component)
- [Creating Deployment Account](/extend/component/tutorial/#creating-deployment-account)

Use the `Code Pattern` type, when creating a component.

{: .image-popup}
![Screenshot -- Add component](/extend/component/code-patterns/tutorial-1-add-component.png)

Modify the settings described in the [Interface - Developer Portal](/extend/component/code-patterns/interface#developer-portal).

## Implementation

Follow the [Component Quick Start](/extend/component/tutorial/).
- [Initializing Component](/extend/component/tutorial/#initializing-component) 
- [Building Component](/extend/component/tutorial/#building-component)

Learn how the whole process works in the [Code Generation Process](/extend/component/code-patterns/interface#code-generation-process).

**Implement the Generate Action** as specified in [Interface - Generate Action](/extend/component/code-patterns/interface#generate-action).
- First, load the [Configuration](/extend/component/code-patterns/interface#configuration).
- Validate the configuration, `action = generate` is expected.
- Other actions should not be implemented (not even `run`).
- In case of error, use correct [Return Value](/extend/common-interface/environment/#return-values).
- Generate code based on the configuration.
- Write the result in [Output Format](/extend/component/code-patterns/interface#output-format) on `stdout`.
- Exit with the `exit code = 0` if success.

## Running Component

The code pattern component is specific. 

It **cannot** be run as described in [Component Quick Start - Running Component](/extend/component/tutorial/#running-component).

The code pattern component will be **invisible in the user interface until it is [published](#publishing-component)**.

But there are two other ways to try it as a component.

### Run via API

The first way is to call the [Generate Action](/extend/component/code-patterns/interface#generate-action) via the API.
- In this way, you can test that the component returns the desired results based on the specified inputs.
- Usa the [Run component action](https://kebooladocker.docs.apiary.io/#reference/actions/run-custom-component-action/process-action) API call.
- The [API token](https://help.keboola.com/management/project/tokens/) is needed.

### Modify transformation via API

The second way is to modify the transformation to use an unpublished code pattern.

#### Create a Empty Transformation

First, click **Transformations** on the project menu.

Then click **New Transformation** to create a new transformation.

{: .image-popup}
![Screenshot -- Transformations page](/extend/component/code-patterns/tutorial-2-project.png)

In the modal click on the selected **type of the transformation**.

{: .image-popup}
![Screenshot -- Add new transformation modal](/extend/component/code-patterns/tutorial-3-modal.png)

Fill in the **name** and optionally the **description**. 

Do not select any code pattern.

{: .image-popup}
![Screenshot -- Net transformation](/extend/component/code-patterns/tutorial-4-new-transformation.png)

You have created an empty transformation.

#### Set Code Pattern to Transformation

**Make note of the component and configuration id from the URL.**  You will need them in the API calls.

```
/admin/projects/{PROJECT_ID}/transformations-v2/{COMPONENT_ID}/{CONFIGURATION_ID}
```

**Set the code pattern to transformation via [Storage API](/overview/api/).**

Load the configuration in the JSON format via the [Configuration Detail](https://keboola.docs.apiary.io/#reference/component-configurations/manage-configurations/configuration-detail) API call.

```
curl \ 
  --include \
  --header "X-StorageApi-Token: {API_TOKEN}" \
'{STORAGE API}/v2/storage/components/{COMPONENT_ID}/configs/{CONFIGURATION_ID}'
```

Example response, some keys omitted.

``` json
{
  "id": "1234",
  "name": "API test",
  "configuration": {}
}
```

It is necessary to set the **id of the code pattern component** to the configuration.
```json
{
  "configuration": {
    "runtime": {
      "codePattern": {
        "componentId": "keboola.example-pattern"
      }
    }
  }
}
```

Update the configuration via the [Update Configuration](https://keboola.docs.apiary.io/#reference/component-configurations/manage-configurations/update-configuration) API call. 
JSON must be url-encoded.

```
curl 
 --include \
 --request PUT \
 --header "X-StorageApi-Token: {API_TOKEN}" \
 --header "Content-Type: application/x-www-form-urlencoded" \
 --data-binary "configuration=%7B%22runtime%22%3A%7B%22codePattern%22%3A%7B%22componentId%22%3A%22keboola.example-pattern%22%7D%7D%7D" \
'{STORAGE API}/v2/storage/components/{COMPONENT_ID}/configs/{CONFIGURATION_ID}'
```

Example response, some keys omitted.

``` json
{
  "id": "1234",
  "name": "API test",
  "configuration": {
    "runtime": {
      "codePattern": {
        "componentId": "keboola.example-pattern"
        }
      }
   }
}
```

The transformation now uses the code pattern, and you can **test it in the [user interface](/extend/component/code-patterns/overview#configuration)**.

## Publishing Component

Make sure the component is set up according the [Interface - Developer Portal](/extend/component/code-patterns/interface#developer-portal).

Follow the [Publish Component](/extend/publish/) tutorial.

[](/extend/publish/)

## Next Steps

- [Overview](/extend/component/code-patterns/overview) shows the code patterns from the user's point of view.
- [Interface](/extend/component/code-patterns/interface) describes how the code patterns work internally.
