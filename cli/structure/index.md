---
title: Project Directory Structure
permalink: /cli/structure/
---

* TOC
{:toc}

The initial configuration of your local directory can be done using the [init command](/cli/commands/sync/init/). This command initializes 
the directory and pulls configurations from the project.

The **Storage API token** for your project is stored in the `.env.local` file under the `KBC_STORAGE_API_TOKEN` directive. 
Currently, you must use a [master token](https://help.keboola.com/management/project/tokens/#master-tokens).
To maintain security, `.env.local` is automatically included in the .gitignore file to prevent it from being committed to your Git repository.

[Manifest - Naming](#naming) defines directory names. Typically, this setting does not need to be changed. 
Each object (branch, configuration, row) is guaranteed to have a unique directory, even if objects share the same name.

Below is an example of a default project directory structure. Some files and directories are specific to the component type. 
For example, transformations are represented by native files. A more detailed description can be found in the chapters below.

<br>

```
🟫 .gitignore                   - excludes ".env.local" from the Git repository
🟫 .env.local                   - contains the Storage API token
🟫 .env.dist                    - template for ".env.local"
📂 .keboola                     - project metadata directory
┣ 🟦 manifest.json              - contains object IDs, paths, naming and other configuration details
┣ 🟦 project.json               - project cache for local commands, including backends and features
┗ 🟫 .kbcignore                 - optional file listing paths to configurations to exclude from CLI sync
🟩 description.md               - project description
📂 [branch-name]                - branch directory (e.g., "main")
┣ 🟦 meta.json                  
┣ 🟩 description.md             
┣ 📂 _shared                    - shared code directory
┃ ┗ 📂 [target-component]       - target component (e.g., "keboola.python-transfomation")
┃   ┗ 📂 codes      
┃     ┗ 📂[code-name]           - shared code directory
┃       ┣ 🟫 code.[ext]         - native file (e.g., ".sql" or ".py")
┃       ┣ 🟦 config.json    
┃       ┣ 🟦 meta.json   
┃       ┗ 🟩 description.md
┗ 📂 [component-type]           - e.g., extractor, app, ...
  ┗ 📂 [component-id]           - e.g., keboola.ex-db-oracle
    ┗ 📂 [config-name]          - configuration directory (e.g., "raw-data")
      ┣ 🟦 config.json           
      ┣ 🟦 meta.json    
      ┣ 🟩 description.md    
      ┣ 📂 rows                 - only if the configuration has some rows
      ┃ ┗ 📂 [row-name]         - configuration row directory (e.g., "prod-fact-table")
      ┃   ┣ 🟦 config.json     
      ┃   ┣ 🟦 meta.json
      ┃   ┗ 🟩 description.md
      ┣ 📂 blocks               - only if the configuration is a transformation
      ┃ ┗ 📂 001-block-1        - block directory
      ┃   ┣ 🟦 meta.json   
      ┃   ┗ 📂 001-code-1       - code directory
      ┃     ┣ 🟫 code.[ext]     - native file (e.g., ".sql" or ".py")
      ┃     ┗ 🟦 meta.json   
      ┣ 📂 phases               - only if the configuration is an orchestration
      ┃ ┗ 📂 001-phase          - phase directory
      ┃   ┣ 🟦 phase.json   
      ┃   ┗ 📂 001-task         - task directory
      ┃     ┗ 🟦 task.json   
      ┣ 📂 schedules            - only if the configuration has some schedules
      ┃ ┗ 📂 [schedule-name]    - schedule directory
      ┃   ┣ 🟦 config.json     
      ┃   ┣ 🟦 meta.json
      ┃   ┗ 🟩 description.md
      ┗ 📂 variables            - only if the configuration has some variables defined
        ┣ 🟦 config.json        - variable definition, name, and type
        ┣ 🟦 meta.json
        ┣ 🟩 description.md
        ┗ 📂 values             - multiple sets of values can be defined
          ┗ 📂 default          - default values directory
            ┣ 🟦 config.json    - default values     
            ┣ 🟦 meta.json
            ┗ 🟩 description.md  
```

## Branches

The tool works with [development branches](/components/branches/) by default. You can specify which branches from the project 
you want to work with locally during the [init](/cli/commands/sync/init/) command. Alternatively, you can ignore the development branches concept and work exclusively
with the main branch. However, note that all configurations will then be stored in the `main` directory.

The main branch directory is simply named `main` and does not include the branch ID. This makes it easily distinguishable from the other branches.

Each branch directory contains:

- `description.md`: Use this file to write a branch description formatted in [Markdown](https://www.markdownguide.org/).
- `meta.json`: Contains the name of the branch and a flag indicating whether it is the default branch.

Example of `meta.json`:
```json
{
  "name": "Main",
  "isDefault": true
}
```

Within the branch directory, configurations are organized into thematic directories: `extractor`, `other`, `transformation`, and `writer`.

Example of a branch folder with components configurations:

{: .image-popup}
![Screenshot -- A configuration directory example](/cli/structure/directory-example.jpg)


## Configurations

Each configuration directory contains the following files:

- `config.json`: Includes parameters specific to the component.
- `description.md`: A description file formatted in [Markdown](https://www.markdownguide.org/).
- `meta.json`: Contains the name of the configuration.

Example of `config.json` for the Generic extractor:
```json
{
  "parameters": {
    "api": {
      "baseUrl": "https://wikipedia.org"
    } 
  }
}
```

Example of `meta.json`:
```json
{
  "name": "Wikipedia"
}
```

Configuration directories can be copied freely within the project and between projects. Their IDs are stored 
in the [manifest](/cli/structure/#manifest). After copying, run the [persist command](/cli/commands/local/persist/) to generate a new ID for the configuration and update it in the manifest.

## Configuration Rows

The directory structure for configuration rows is identical to that of configurations. The component configuration
includes a `rows` directory, which contains a subdirectory for each row. Each row directory includes `config.json`, 
`description.md`, and `meta.json`.

Example of `meta.json`:
```json
{
  "name": "share/cities2",
  "isDisabled": false
}
```

Example of a Google Drive extractor configuration:

{: .image-popup}
![Screenshot -- A configuration rows directory example](/cli/structure/directory-rows-example.jpg)

## Transformations

In addition to standard configurations, transformation directories include a `blocks` directory containing a list of codes.
Codes are stored as native files corresponding to the transformation type. For example, Snowflake transformations store codes
in `.sql` files.

Example of a Snowflake transformation configuration:

{: .image-popup}
![Screenshot -- A transformation directory example](/cli/structure/directory-transformation-example.jpg)

## Variables

The [variables](https://help.keboola.com/transformations/variables/#variables) directory, in addition to the standard 
configuration layout, contains a `values` subdirectory.

For example, suppose you have the following two variables in your transformation:

{: .image-popup}
![Screenshot -- Variables in the UI](/cli/structure/variables-ui.jpg)

When you [pull](/cli/commands/sync/pull/) them to the local directory, the structure will look like this:

{: .image-popup}
![Screenshot -- Configuration directory with the variables](/cli/structure/variables-directory.jpg)

Variables configuration in `variables/config.json`:

```json
{
  "variables": [
    {
      "name": "state",
      "type": "string"
    },
    {
      "name": "city",
      "type": "string"
    }
  ]
}
```

Default values configuration in `variables/values/default/config.json`:

```json
{
  "values": [
    {
      "name": "state",
      "value": "NY"
    },
    {
      "name": "city",
      "value": "Boston"
    }
  ]
}
```

## Shared Code

[Shared code](https://help.keboola.com/transformations/variables/#shared-code) blocks are stored in the branch directory 
under the `_shared` subdirectory, enabling reuse across different configurations.

If you create shared code from a block:

{: .image-popup}
![Screenshot -- Shared code directory](/cli/structure/shared-code-ui.jpg)

It will move to the `_shared` directory:

{: .image-popup}
![Screenshot -- Shared code directory](/cli/structure/shared-code-directory.jpg)

The code in the transformation file `blocks/block-1/join/code.sql` will then be replaced with:

{: .image-popup}
![Screenshot -- Shared code code](/cli/structure/shared-code-code.jpg)


## Schedules

The [Orchestrator](https://help.keboola.com/orchestrator/running) or any other component can have a schedule to run 
automatically and periodically. The schedule configuration is stored within a specific directory.

{: .image-popup}
![Screenshot -- Scheduler directory](/cli/structure/scheduler-directory.jpg)

The `config.json` file for the schedule contains the schedule in [crontab](https://crontab.guru/) format, the timezone, and a flag 
indiciating whether the schedule is enabled. 

For example, the following configuration runs at the 40th minute of every hour:

```json
{
  "schedule": {
    "cronTab": "40 */1 * * *",
    "timezone": "UTC",
    "state": "enabled"
  },
  "target": {
    "mode": "run"
  }
}
```

## Orchestrations

Orchestrator directories include the `phases` directory, which contains a list of tasks for execution.

Example:

{: .image-popup}
![Screenshot -- An orchestration directory](/cli/structure/directory-orchestration-example.png)

Example `phase.json`:

```json
{
  "name": "Transformation",
  "dependsOn": [
    "001-extraction"
  ]
}
```

Example `task.json`:

```json
{
  "name": "keboola.snowflake-transformation-7241628",
  "task": {
    "mode": "run",
    "configPath": "transformation/keboola.snowflake-transformation/address-completion"
  },
  "continueOnFailure": false,
  "enabled": true
}
```

Using `kbcdir.jsonnet` for different orchestration phases. Individual directories in the phases folder that are intended for a different backend of the project can be ignored by setting the value to true in the file.

A `kbcdir.jsonnet` example:
```jsonnet
{
  "isIgnored":false 
}
```

## Manifest

The local state of the project is stored in the `.keboola/manifest.json` file. It is not recommended to modify
this file manually.

### Basic Manifest Structure

- `version`: Current major version (e.g., `2`)
- `project`: Information about the project
  - `id`: ID of the project
  - `apiHost`: URL of the Keboola instance (e.g., `connection.keboola.com`)
- `allowTargetEnv`: Boolean (default: `false`)
  - If `true`, allows environment variables `KBC_PROJECT_ID` and `KBC_BRANCH_ID` to temporary override the target project and branch without modifying the manifest.
  - The mapping is bidirectional and occurs during the manifest's save and load operations.
  - For more information, see the [--allow-target-env](/cli/commands/sync/init/#options) option in the [kbc sync init](/cli/commands/sync/init/) command.
- `sortBy`: Property name used for sorting configurations (default: `id`)
- `naming`: Rules for directory naming ([see details](/cli/structure/#naming))
- `allowedBranches`: Array of branches to work with
- `ignoredComponents`: Array of components to exclude
- `templates`: 
  - `repositories` (*array*):
    - Local repository:
      - `type` = `dir`
      - `name`: Repository name
      - `url`: Absolute or relative path to a local directory
        - Relative path must be relative to the project directory.
    - Git-based repository:
      - `type` = `git`
      - `name`: Repository name
      - `url`: URL of the Git repository
        - E.g., `https://github.com/keboola/keboola-as-code-templates.git`
      - `ref`: Git `branch` or `tag` (e.g., `main` or `v1.2.3`)
- `branches`: List of used branches
  - `id`: Branch ID
  - `path`: Directory name (e.g., `main`)
- `configurations`: List of component configurations
  - `branchId`: Branch ID
  - `componentId`: Component ID (e.g., `keboola.ex-aws-s3`)
  - `id`: Configuration ID
  - `path`: Path to the configuration in the local directory (e.g., `extractor/keboola.ex-aws-s3/7241111/my-aws-s3-data-source`)
  - `rows`: List of configuration rows (if the component supports rows)
    - `id`: Row ID
    - `path`: Path to the row from the configuration directory (e.g., `rows/cities`)

### Naming

Directory names for configurations follow the rules in the [manifest](/cli/structure/#manifest) under the `naming` section.  
These are the default values:

```json
{
    "branch": "{branch_name}",
    "config": "{component_type}/{component_id}/{config_name}",
    "configRow": "rows/{config_row_name}",
    "schedulerConfig": "schedules/{config_name}",
    "sharedCodeConfig": "_shared/{target_component_id}",
    "sharedCodeConfigRow": "codes/{config_row_name}",
    "variablesConfig": "variables",
    "variablesValuesRow": "values/{config_row_name}"
  }
```

To include object IDs in directory names, use these values:

```json
{
    "branch": "{branch_id}-{branch_name}",
    "config": "{component_type}/{component_id}/{config_id}-{config_name}",
    "configRow": "rows/{config_row_id}-{config_row_name}",
    "schedulerConfig": "schedules/{config_name}",
    "sharedCodeConfig": "_shared/{target_component_id}",
    "sharedCodeConfigRow": "codes/{config_row_name}",
    "variablesConfig": "variables",
    "variablesValuesRow": "values/{config_row_name}"
  }
```

Use the [fix-paths](/cli/commands/local/fix-paths/) command to rebuild the directory structure with updated naming rules.

## Project Cache

The project cache is stored in `.keboola/project.json` and is used by local commands without making authorized requests to the Storage API.

This is its basic structure:

- `backends`: List of project backends
- `features`: List of project features
- `defaultBranchId`: ID of the default branch

Example:

```json
{
  "backends": [
    "snowflake"
  ],
  "features": [
    "workspace-snowflake-dynamic-backend-size",
    "input-mapping-read-only-storage",
    "syrup-jobs-limit-10",
    "oauth-v3"
  ],
  "defaultBranchId": 123
}
```
## .kbcignore

You can exclude specific configurations from the sync process by creating a `.kbcignore` file in the `.keboola` directory.
 
It is a plain text file where each line specifies a path to a configuration or configuration row in the format 
`{component_id}/{configuration_id}/{row_id}`. The `row_id` is optional for [row-based configurations](https://help.keboola.com/components/#configuration-rows).

Example `.kbcignore` file:
    
```
keboola.python-transformation-v2/1197618481
keboola.keboola.wr-db-snowflake/1196309603/1196309605
```

This excludes:

- The configuration of the Python transformation (`keboola.python-transformation-v2`)  with the ID `1197618481`. 
- Row  ID `1196309605` in the configuration of the Snowflake writer (`keboola.keboola.wr-db-snowflake`) with the ID `1196309603`.

As a result, the `kbc sync pull` and `kbc sync push` commands will not synchronize these configurations.

**`kbc push` operation**

The `kbc push` command will skip the excluded configurations and will not push them back to the project, even if they exist or have been modified in the local folder structure. 
The log will display the following message:

```
➜ kbc push
Plan for "push" operation:
  × main/transformation/keboola.python-transformation-v2/dev-l0-sample-data - IGNORED
Skipped remote objects deletion, use "--force" to delete them.
Push done.
```

The log clearly identifies configurations that were ignored, even if they are absent in the local folder structure.

**`kbc pull` operation**

The `kbc pull` command will exclude the matched configurations and not pull them from the project. 

<div class="clearfix"></div><div class="alert alert-warning">
    <p><strong>Warning:</strong><br>
        If the matched configuration is already present locally, it will be deleted from both the filesystem and manifest.json.</p>
</div>


If the configuration was already present locally, the log will indicate its deletion as shown below:

```
➜ kbc pull
Plan for "pull" operation:
  × C main/writer/keboola.wr-db-snowflake/my-snowflake-data-destination
  × R main/writer/keboola.wr-db-snowflake/my-snowflake-data-destination/rows/test-sheet1
Pull done.
```

## Next Steps

- [Commands](/cli/commands/)
