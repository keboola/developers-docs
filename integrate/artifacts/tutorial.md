---
title: Artifacts Tutorial
permalink: /integrate/artifacts/tutorial/
---

* TOC
{:toc}

This tutorial will show you how to work with artifacts.
In the following example we will use Python Transformation component to produce and consume artifacts.
But these principles would work inside any component.

In the examples, we use the `curl` console tool to interact with our APIs.

*Note: `artifacts` feature needs to be enabled in your project. Please contact [support@keboola.com](mailto:support@keboola.com) to enable the feature in your project*

## Example 1 - Produce artifact

This is very simple example. We will just create a Python Transformation, which will write a file to the artifacts "upload" folder.
This file will be then uploaded as "artifact" to File Storage. 

1. In Keboola Connection project, create a new Python Transformation and paste this code into it:
    ```
    import os
    path = "/data/artifacts/out/current"
    if not os.path.exists(path):os.makedirs(path)
    with open("/data/artifacts/out/current/myartifact1", "w") as file:
      file.write("this is my artifact file content")
    ```
   
    {: .image-popup}
    ![Screenshot -- Job](/integrate/artifacts/artifacts-tutorial-1.png)

2. Run the transformation - it should upload the file to File Storage as "artifact"

    {: .image-popup}
    ![Screenshot -- Job](/integrate/artifacts/artifacts-tutorial-2.png)

3. The file is now visible in File Storage with appropriate tags

   {: .image-popup}
   ![Screenshot -- Job](/integrate/artifacts/artifacts-tutorial-2.png)


## Example 2 - Produce & consume artifacts

To consume (download) artifacts for component to work with, we need to enable and configure artifacts download in the configuration of a component.

### Create configuration

We will create another configuration of Python Transformation via API.
We will need [Storage API Token](https://help.keboola.com/management/project/tokens/) to do this:

1. Obtain a Storage API token from the user interface of your project, see this [Guide](https://help.keboola.com/management/project/tokens).
2. Store the token and url to the environment variable.

    ```shell
    export STORAGE_API_HOST="https://connection.keboola.com"
    export TOKEN="..."
    ```
   
3. Run this curl command to create the configuration:
    ```shell
    curl -X POST "$STORAGE_API_HOST/v2/storage/branch/default/components/keboola.python-transformation-v2/configs" \
    -H "X-StorageApi-Token: $TOKEN" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'configuration={"parameters":{"blocks":[{"name":"Block 1","codes":[{"name":"artifacts","script":["import os\nimport glob\n\n# Download\nprint(glob.glob(\"/data/artifacts/in/runs/*/*\")) \n\n# Upload\npath = \"/data/artifacts/current\"\nif not os.path.exists(path):os.makedirs(path)\nwith open(\"/data/artifacts/in/current/myartifact1\", \"w\") as file:\n  file.write(\"value1\")"]}]}]},"artifacts":{"runs":{"enabled":true,"filter":{"limit":5}}}}' \
    --data-urlencode 'name=Artifacts upload & download' \
    --data-urlencode 'description=Test Artifacts upload & download'
    ```
   
4. Here's the configuration related to artifacts from the previous command:
    This will enable download of artifacts of type `runs` with limit 5, which means this will download artifacts created by the last 5 runs of the same component configuration
    ```json
    {
      "artifacts":{
        "runs":{
          "enabled":true,
          "filter":{
            "limit":5
          }
        }
      }
    }
    ```
5. The script from the configuration will read files from `/data/artifacts/in/runs/*/*` and write them to the output - these are artifact files downloaded. 
   The script will also generate a new artifact and write it to `/data/artifacts/in/current/myartifact1` as in previous example.

    ```python
    import os
    import glob
   
    # Download
    print(glob.glob("/data/artifacts/in/runs/*/*")) 
   
    # Upload
    path = "/data/artifacts/out/current"
    if not os.path.exists(path):os.makedirs(path)
    with open("/data/artifacts/out/current/myartifact1", "w") as file:
      file.write("value1")
    ```

## Example 3 - Consume artifacts from different component
Similar to previous example we will create a configuration of Python Transformation component. 
But this time we will download artifacts produced by the configuration from `Example 2`.

1. Export the id of the previously created configuration into an environment variable:
    ```shell
    export CONFIG_ID="..."
    ```
   
2. Run curl command
    ```shell
    curl -X POST "$STORAGE_API_HOST/v2/storage/branch/default/components/keboola.python-transformation-v2/configs" \
    -H "X-StorageApi-Token: $TOKEN" \
    -H 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'configuration={"parameters":{"blocks":[{"name":"Block 1","codes":[{"name":"artifacts","script":["import os\nimport glob\n\n# Download\nprint(glob.glob(\"/data/artifacts/in/custom/*/*\"))"]}]}]},"artifacts":{"custom":{"enabled":true,"component_id":"keboola.python-transformation","config_id":"$CONFIG_ID","branch_id":"default","filter":{"limit":5}}}}' \
    --data-urlencode 'name=Artifacts upload & download' \
    --data-urlencode 'description=Test Artifacts upload & download'    
    ```
   
3. The whole configuration now looks like this:
    ```json
    {
        "parameters": {
            "blocks": [
                {
                    "name": "Block 1",
                    "codes": [
                        {
                            "name": "artifacts",
                            "script": [
                                "import os\nimport glob\n\n# Download\nprint(glob.glob(\"/data/artifacts/in/custom/*/*\"))"
                            ]
                        }
                    ]
                }
            ]
        },
        "artifacts": {
            "custom": {
                "enabled": true,
                "component_id": "keboola.python-transformation",
                "config_id": "$CONFIG_ID",
                "branch_id": "default",
                "filter": {
                    "limit": 5
                }
            }
        }
    }
    ```
