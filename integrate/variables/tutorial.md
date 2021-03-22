---
title: Variables Tutorial
permalink: /integrate/variables/tutorial/
---

* TOC
{:toc}

This tutorial will guide you through basic usage of [Variables](/integrate/variables/) in the component configuration.
The result will be the parametrized configuration of the [Generic Extractor](/extend/generic-extractor),
but this approach can be applied to any component. 

In the examples, we use the `curl` console tool to interact with our APIs.

## Define API endpoints

First, store the [API endpoints](/overview/api/) as environment variables, so we don't have to repeat ourselves.

We will need:
- [Storage API](/integrate/storage/api/) to store the variable definitions and the extractor configuration -
- [Docker Runner API](/extend/docker-runner/) to run the extractor job from the configuration.

```shell
export STORAGE_API_HOST="https://connection.keboola.com"
export RUNNER_API_HOST="https://docker-runner.keboola.com"
```

## Obtain Storage API Token

A [Storage API Token](https://help.keboola.com/management/project/tokens/) is needed to interact with the Storage and Docker Runner APIs.

Obtain a Storage API token from the user interface of your project, see this [Guide](https://help.keboola.com/management/project/tokens).

Then store the token to the environment variable.
```shell
export TOKEN="..."
```

## Define variables

The next step is to define the variables in a [Variable Configuration](/integrate/variables/#variable-configuration).

Define name and type of the variables.
```shell
export VARIABLE_CONFIG_NAME="Extractor variables"
export VARIABLE_CONFIG='
{
    "variables": [
        {
            "name": "outputBucket",
            "type": "string"
        },
        {
            "name": "id",
            "type": "int"
        }
    ]
}
'
```

Use [Create Configuration API call](https://keboola.docs.apiary.io/#reference/components-and-configurations/component-configurations/create-configuration) to store *variable configuration*.
```shell
curl --include \
     --request POST \
     --header "Content-Type: application/x-www-form-urlencoded" \
     --header "X-StorageApi-Token: $TOKEN" \
     --data-urlencode "name=$VARIABLE_CONFIG_NAME" \
     --data-urlencode "configuration=$VARIABLE_CONFIG" \
"$STORAGE_API_HOST/v2/storage/components/keboola.variables/configs"
```

Example API call result.
```json
{
  "id":"1234",
  "name":"Extractor variables",
  "description":"..."
}
```

Save *variable configuration* `id` from the the result to the environment variable.
```shell
export VARIABLE_CONFIG_ID="1234"
```

**The created *variable configuration* defines the names and types of variables.**

You can create additional configurations that contain (default) [Variable Values](/integrate/variables/#variable-values).

In this example, the values of the variables are entered directly to the [run API call](#run-extractor-configuration) (see bellow),
so configuration with the variable values is not used.

## Create extractor configuration

Define *extractor configuration* with variables {% raw %}`{{placeholders}}`{% endraw %}.

```shell
{% raw %}
export COMPONENT_ID="ex-generic-v2"
export EXTRACTOR_CONFIG_NAME="Extractor configuration"
export EXTRACTOR_CONFIG='
{
    "parameters": {
        "api": {
            "baseUrl": "https://jsonplaceholder.typicode.com/"
        },
        "config": {
            "debug": true,
            "outputBucket": "{{outputBucket}}",
            "jobs": [
                {
                    "endpoint": "posts/{{id}}/comments"
                }
            ]
        }
    },
    "variables_id": "'$VARIABLE_CONFIG_ID'"
}
'
{% endraw %}
```

Use [Create Configuration API call](https://keboola.docs.apiary.io/#reference/components-and-configurations/component-configurations/create-configuration) to store extractor configuration.
```shell
curl --include \
     --request POST \
     --header "Content-Type: application/x-www-form-urlencoded" \
     --header "X-StorageApi-Token: $TOKEN" \
     --data-urlencode "name=$EXTRACTOR_CONFIG_NAME" \
     --data-urlencode "configuration=$EXTRACTOR_CONFIG" \
"$STORAGE_API_HOST/v2/storage/components/$COMPONENT_ID/configs"
```

Example API call result.
```json
{
    "id":"4567",
    "name":"Extractor configuration",
    "description":"..."
}
```

Save *extractor configuration* `id` from the result to the environment variable.
```shell
export EXTRACTOR_CONFIG_ID="4567"
```

## Run extractor configuration

Define values of the variables.
```shell
export VARIABLES_VALUES='
[
    {"name": "outputBucket", "value": "my-bucket"},
    {"name": "id", "value": 1}
]
'
```

In this example are values of the variables part of the run job request.

For other ways to define values see the [Variables documentation](/integrate/variables/#variable-values).

Use [Run Job API call](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job/run-job) to run *extractor configuration*.
```shell
curl --include \
     --request POST \
     --header "Content-Type: application/json" \
     --header "X-StorageApi-Token: $TOKEN" \
     --data-binary '
        {
            "config": "'$EXTRACTOR_CONFIG_ID'",
            "variableValuesData": {
                "values": '$VARIABLES_VALUES'
            }
        }
     ' \
"$RUNNER_API_HOST/docker/$COMPONENT_ID/run"
```

## Check the job result

The status of a running job can be seen via API or UI.

In the picture we can see that the entered values of the variables were used.

{: .image-popup}
![Screenshot -- Job](/integrate/variables/tutorial-1.png)

A note about the replaced variables is in the job logs.

{: .image-popup}
![Screenshot -- Job Logs](/integrate/variables/tutorial-2.png)

See the [Variables documentation](/integrate/variables/#variable-values) for more information.

