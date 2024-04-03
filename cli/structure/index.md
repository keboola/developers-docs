---
title: Project Directory Structure
permalink: /cli/structure/
---

* TOC
{:toc}

Initial configuration of your local directory can be done using the [init command](/cli/commands/sync/init/). It initiates 
the directory and pulls configurations from the project.

The **Storage API token** to your project is stored in the file `.env.local` under `KBC_STORAGE_API_TOKEN` directive. 
Currently, it is necessary to use [Master tokens](https://help.keboola.com/management/project/tokens/#master-tokens).
Your token must be secret, so the file `.env.local` is included in the `.gitignore` file.

[Manifest - Naming](#naming) defines directories names.
It is usually not necessary to change this setting. 
It is guaranteed that each object (branch, config, row) will have its own unique directory, 
even if the objects have the same name.


The following is an example of a default project directory structure. 
Some files and directories are specific to component type. 
For example, transformations are represented by native files.
A more detailed description can be found in the chapters below.

<br>

```
🟫 .gitignore                   - excludes ".env.local" from git repository
🟫 .env.local                   - contains Storage API token
🟫 .env.dist                    - template for .env.local
📂 .keboola                     - project metadata directory
┗ 🟦 manifest.json              - object IDs, paths, naming and other configuration
🟩 description.md               - project description
📂 [branch-name]                - branch directory, e.g. main
┣ 🟦 meta.json
┣ 🟩 description.md
┣ 📂 _shared                    - shared codes directory
┃ ┗ 📂 [target-component]       - target, e.g., keboola.python-transfomation
┃   ┗ 📂 codes      
┃     ┗ 📂[code-name]           - shared code directory
┃       ┣ 🟫 code.[ext]         - native file, e.g., ".sql" or ".py"
┃       ┣ 🟦 config.json    
┃       ┣ 🟦 meta.json   
┃       ┗ 🟩 description.md
┗ 📂 [component-type]           - e.g., extractor, app, ...
  ┗ 📂 [component-id]           - e.g., keboola.ex-db-oracle
    ┗ 📂 [config-name]          - configuration directory, e.g., raw-data
      ┣ 🟦 config.json           
      ┣ 🟦 meta.json    
      ┣ 🟩 description.md    
      ┣ 📂 rows                 - only if the configuration has some rows
      ┃ ┗ 📂 [row-name]         - configuration row directory, e.g., prod-fact-table
      ┃   ┣ 🟦 config.json     
      ┃   ┣ 🟦 meta.json
      ┃   ┗ 🟩 description.md
      ┣ 📂 blocks               - only if the configuration is a transformation
      ┃ ┗ 📂 001-block-1        - block directory
      ┃   ┣ 🟦 meta.json   
      ┃   ┗ 📂 001-code-1       - code directory
      ┃     ┣ 🟫 code.[ext]     - native file, e.g., ".sql" or ".py"
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
      ┗ 📂 variables            - only if the configuration has defined some variables
        ┣ 🟦 config.json        - variables definition, name and type
        ┣ 🟦 meta.json
        ┣ 🟩 description.md
        ┗ 📂 values             - multiple sets of values can be defined
          ┗ 📂 default          - default values directory
            ┣ 🟦 config.json    - default values     
            ┣ 🟦 meta.json
            ┗ 🟩 description.md  
```

## Branches

The tool works with [dev branches](/components/branches/) by default. You can choose the branches from the project 
you want to work with locally in the [init](/cli/commands/sync/init/) command. You can ignore the dev branches concept and work with 
the main branch only, of course. But note that all its configurations will be stored in the directory `main`.

The directory of the main branch is called simply `main` and does not contain the branch ID. This way it is easily 
distinguishable from the other branches.

The directory contains `description.md` where you can write the description formatted in [Markdown](https://www.markdownguide.org/) 
and `meta.json` containing the name of the branch and flag if it is the default or not.

Example of `meta.json`:
```json
{
  "name": "Main",
  "isDefault": true
}
```

Then there are directories thematically grouping components: `extractor`, `other`, `transformation`, `writer`.

Example of a branch folder with components configurations:

{: .image-popup}
![Screenshot -- A configuration directory example](/cli/structure/directory-example.jpg)


## Configurations

The directory of each configuration contains `config.json` with parameters specific for each component, `description.md` 
where you can write description formatted in [Markdown](https://www.markdownguide.org/) and `meta.json` containing the name 
of the configuration.

Example of `config.json` for Generic Extractor:
```json
{
  "api": {
      "baseUrl": "https://wikipedia.org"
  }
}
```

Example of `meta.json`:
```json
{
  "name": "Wikipedia"
}
```

Configuration directories can be copied freely inside the project and between other projects. Their IDs are stored 
in the [manifest](/cli/structure/#manifest). So after the copy & paste, make sure to run 
the [persist command](/cli/commands/local/persist/), which generates a new ID for the configuration and saves it in the manifest.

## Configuration Rows

The directory structure of configuration rows is the same as the configuration itself. The component configuration
contains a directory `rows` that includes a directory for each row. That directory contains `config.json`, 
`description.md` and `meta.json`.

Example of `meta.json`:
```json
{
  "name": "share/cities2",
  "isDisabled": false
}
```

Example of a Google Drive Extractor configuration:

{: .image-popup}
![Screenshot -- A configuration rows directory example](/cli/structure/directory-rows-example.jpg)

## Transformations

In addition to other configurations, the transformations directories contain a `blocks` directory and in it a list of codes.
Codes are stored in native files according to the type of transformation. I.e., Snowflake transformations store the codes
in `.sql` files.

Example of a Snowflake Transformation configuration:

{: .image-popup}
![Screenshot -- A transformation directory example](/cli/structure/directory-transformation-example.jpg)

## Variables

The [variables](https://help.keboola.com/transformations/variables/#variables) directory in addition to the standard 
configuration layout contains the directory `values`.

Let's say you have these two variables in your transformation:

{: .image-popup}
![Screenshot -- Variables in the UI](/cli/structure/variables-ui.jpg)

When you [pull](/cli/commands/sync/pull/) them to the local directory, it will look like this:

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
under the `_shared` subdirectory so that they can be reused between different configurations.

If you create shared code from your block:

{: .image-popup}
![Screenshot -- Shared code directory](/cli/structure/shared-code-ui.jpg)

It will move to the `_shared` directory:

{: .image-popup}
![Screenshot -- Shared code directory](/cli/structure/shared-code-directory.jpg)

And the code in the transformation file `blocks/block-1/join/code.sql` will be changed to:

{: .image-popup}
![Screenshot -- Shared code code](/cli/structure/shared-code-code.jpg)


## Schedules

[Orchestrator](https://help.keboola.com/orchestrator/running) or any other component can have a schedule to be run 
automatically and periodically. The schedule resides in a configuration directory.

{: .image-popup}
![Screenshot -- Scheduler directory](/cli/structure/scheduler-directory.jpg)

The schedule's `config.json` contains [crontab](https://crontab.guru/) format of the schedule, timezone, and flag 
if it should be enabled or not. 

This example shows a schedule to be run at minute 40 past every hour:

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

The Orchestrator directories contain the `phases` directory and in it a list of tasks.

Example:

{: .image-popup}
![Screenshot -- An orchestration directory](/cli/structure/directory-orchestration-example.jpg)

A `phase.json` example:

```json
{
  "name": "Transformation",
  "dependsOn": [
    "001-extraction"
  ]
}
```

A `task.json` example:

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

## Manifest

The local state of the project is stored in the manifest file `.keboola/manifest.json`. It is not recommended to modify
this file manually.

This is its basic structure:

- `version` - current major version, now `2`
- `project` - information about the project
  - `id` - ID of the project
  - `apiHost` - URL of the Keboola instance (e.g., `connection.keboola.com`)
- `allowTargetEnv` - boolean, default `false`
  - If `true`, environment variables `KBC_PROJECT_ID` and `KBC_BRANCH_ID` can be used to temporary override the target project and branch.
  - The IDs in the manifest will remain unchanged.
  - Mapping is bidirectional, it is performed on the manifest save and load.
  - See also the [--allow-target-env](/cli/commands/sync/init/#options) option of the [kbc sync init](/cli/commands/sync/init/) command.
- `sortBy` - name of the configuration property used for sorting (default `id`)
- `naming` - rules for directory names, [see the details](/cli/structure/#naming)
- `allowedBranches` - array of branches to work with
- `ignoredComponents` - array of components to not work with
- `templates`
  - `repositories` (*array*):
    - local repository:
      - `type` = `dir`
      - `name` - repository name
      - `url` - absolute or relative path to a local directory
        - relative path must be relative to the project directory
    - git repository:
      - `type` = `git`
      - `name` - repository name
      - `url` - URL of the git repository
        - e.g. `https://github.com/keboola/keboola-as-code-templates.git`
      - `ref` - git `branch` or `tag`, e.g. `main` or `v1.2.3`
- `branches` - array of used branches
  - `id` - ID of the branch
  - `path` - name of the directory containing the branch configuration (e.g., `main`)
- `configurations` - array of component configurations
  - `branchId` - ID of the branch the configuration belongs to
  - `componentId` - ID of the component (e.g., `keboola.ex-aws-s3`)
  - `id` - ID of the configuration
  - `path` - path to the configuration in the local directory (e.g., `extractor/keboola.ex-aws-s3/7241111/my-aws-s3-data-source`)
  - `rows` - array of configuration rows (if the component supports rows)
    - `id` - ID of the row
    - `path` - path to the row from the configuration directory (e.g., `rows/cities`)

### Naming

Names of the directories of different configuration types are subject to the rules defined in 
the [manifest](/cli/structure/#manifest) under the `naming` section. These are the default values:

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

If you want to include object IDs in directory names, use these values:

```json
{
    "branch": "{branch_id}-{branch_name}",
    "config": "{component_type}/{component_id}/{config_id}-{config_name}",
    "configRow": "rows/{config_row_id}-{config_row_name}"
    "schedulerConfig": "schedules/{config_name}",
    "sharedCodeConfig": "_shared/{target_component_id}",
    "sharedCodeConfigRow": "codes/{config_row_name}",
    "variablesConfig": "variables",
    "variablesValuesRow": "values/{config_row_name}"
  }
```

You can change them according to your wishes and let the project directory be rebuilt using the
[fix-paths](/cli/commands/local/fix-paths/) command.

## Next Steps

- [Commands](/cli/commands/)
