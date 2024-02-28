---
title: Create Template Tutorial
permalink: /cli/templates/tutorial/
---

* TOC
{:toc}

This tutorial will guide you through the process of creating and using a template.
First, make sure you have the [latest version](https://github.com/keboola/keboola-as-code/releases) of the Keboola CLI.

```sh
kbc --version
```


## Create Repository

Create an empty directory for template repository and enter it:
```sh
mkdir my-repository
cd my-repository
```

Initialize the repository directory, run command:
```sh
kbc template repository init
```

Example output:
```
Created metadata directory ".keboola".
Created repository manifest file ".keboola/repository.json".
Repository init done.
```

Optionally, you can initialize the directory as a git repository.
```
git init
git add -A
git commit -m "Initial commit"
```

## Create Template

The template can be created from any existing project in [Keboola](https://help.keboola.com/overview/).

### Set Editor

First, set an editor that will be used to edit values.
`EDITOR` or `VISUAL` environment variable must be set.

For example, use `nano` console editor.
```sh
export EDITOR="nano"
```

You can also use a GUI editor, for example [Visual Studio Code](https://code.visualstudio.com/).
```sh
export EDITOR="code --new-window --wait"
```

Or [Sublime Text](https://www.sublimetext.com/) editor.
```sh
export EDITOR="subl --new-window --wait"
```

### Source Project

Specify source project by Storage API [host](https://help.keboola.com/overview/#stacks) and [token](https://help.keboola.com/management/project/tokens/).

In the repository directory create `.env.local` file:
```
KBC_STORAGE_API_HOST=connection.keboola.com
KBC_STORAGE_API_TOKEN=...
```

File `.env.local` must be kept locally. Create`.gitignore` file:
```
.env.local
```

Alternatively, if you don't create the `.env.local` file, you will be prompted to enter these values interactively.

### Start Dialog

Start interactive dialog to create template. It will guide you through creating the template step by step.
```sh
kbc template create
```

### ID and Name

Enter template name and ID:
```
Please enter a template public name for users.
For example "Lorem Ipsum Ecommerce".
? Template name: My Template

Please enter a template internal ID.
Allowed characters: a-z, A-Z, 0-9, "-".
For example "lorem-ipsum-ecommerce".
? Template ID: my-template
```

Enter a short description of the template using the [editor](#set-editor):
```
Please enter a short template description.
?  [Enter to launch editor]
```

### Branch and Configurations

Select source branch and configurations to be included in the template:
```
? Select source branch: Main (251718)

? Select configurations to be included in the template:  
[Use arrows to move, space to select, <right> to all, <left> to none, type to filter]
> [x]  My MySQL Data Source (keboola.ex-db-mysql:810414442)
  [ ]  MySQL with demo data (keboola.ex-sample-data:810416777)
  [x]  Test transformation (keboola.snowflake-transformation:810416570)

```

### Configurations IDs

For each configuration and configuration row specify a human-readable ID:
```
Please enter a human readable ID for each config and config row.
?  [Enter to launch editor]
```

Example definition file that opens in the editor:
```md
<!--
Please enter a human-readable ID for each configuration. For example "L0-raw-data-ex".
Allowed characters: a-z, A-Z, 0-9, "-".
These IDs will be used in the template.

Please edit each line below "## Config ..." and "### Row ...".
Do not edit lines starting with "#"!
-->

## Config "My MySQL Data Source" keboola.ex-db-mysql:810414442
my-data-source

### Row "table1" keboola.ex-db-mysql:810414442:48061
table1

### Row "table2" keboola.ex-db-mysql:810414442:12883
table2

## Config "Test transformation" keboola.snowflake-transformation:810416570
my-transformation
```

When you have finished editing, save the file and close the editor.

### Select User Inputs

Potential [user inputs](/cli/templates/structure/inputs/) are detected in the `parameters` fields, in all configurations and configuration rows.

```
Please select which fields in the configurations should be user inputs.
?  [Enter to launch editor]
```

Follow the instructions in the definition file:
1. **Mark which fields should be user inputs.**
    - Encrypted values are automatically pre-marked.
    - User inputs are marked with `[x]`.
    - Ignored fields are marked with`[ ]`.
2. **Modify `<input-id>` if the pre-generated value is not sufficient.**

Example definition file that opens in the editor:
```md
<!--
Please define user inputs for the template.
Edit lines below "## Config ..." and "### Row ...".
Do not edit "<field.path>" and lines starting with "#"!

Line format: <mark> <input-id> <field.path> <example>

1. Mark which fields should be user inputs.
[x] "input-id" "field.path"   <<< this field will be user input
[ ] "input-id" "field.path"   <<< this field will be scalar value

2. Modify "<input-id>" if the pre-generated value is not sufficient.
Allowed characters: a-z, A-Z, 0-9, "-".
-->

## Config "My MySQL Data Source" keboola.ex-db-mysql:810414442
[x] mysql-password            `parameters.db.#password`
[x] mysql-database            `parameters.db.database`    <!-- database -->
[x] mysql-host                `parameters.db.host`        <!-- my-mysql.com -->
[x] mysql-port                `parameters.db.port`        <!-- 3306 -->
[x] mysql-user                `parameters.db.user`        <!-- username -->

### Row "table1" keboola.ex-db-mysql:810414442:48061
[ ] ex-db-mysql-incremental   `parameters.incremental`    <!-- false -->
[ ] ex-db-mysql-output-table  `parameters.outputTable`    <!-- in.c-keboola-ex-db-m... -->
[ ] ex-db-mysql-primary-key   `parameters.primaryKey`
[ ] ex-db-mysql-query         `parameters.query`          <!-- SELECT `id`, `name` ... -->

### Row "table2" keboola.ex-db-mysql:810414442:12883
[ ] ex-db-mysql-incremental   `parameters.incremental`    <!-- false -->
[ ] ex-db-mysql-output-table  `parameters.outputTable`    <!-- in.c-keboola-ex-db-m... -->
[ ] ex-db-mysql-primary-key   `parameters.primaryKey`
[ ] ex-db-mysql-query         `parameters.query`          <!-- SELECT `id`, `name` ... -->
```

When you have finished editing, save the file and close the editor.

### Complete User Inputs

```
Please complete the user inputs specification.
?  [Enter to launch editor]
```

Follow the instructions in the definition file:
1. **Complete the [user inputs](/cli/templates/structure/inputs/).**
2. **Sort the user inputs.**
    - Move text blocks with definitions.
    - Assign the inputs to different steps. A preview of the created steps structure is suggested in the comment.
    - User will be asked for inputs in the specified order.

```md
<!--
Please complete definition ...

Preview of steps and groups you created:
- Group 1: Default Group
  - Step "step-1": Default Step - Description
-->

## Input "mysql-host" (string)
name: MySQL Host
description: 
kind: input
rules: 
showIf: 
default:
step: step-1

## Input "mysql-port" (int)
name: MySQL Port
description: 
kind: input
rules: 
showIf: 
default: 3306
step: step-1

## Input "mysql-user" (string)
name: MySQL User
description: 
kind: input
rules: 
showIf: 
default:
step: step-1

## Input "mysql-password" (string)
name: MySQL Password
description: 
kind: hidden
rules: 
showIf: 
default:
step: step-1

## Input "mysql-database" (string)
name: MySQL Database
description: 
kind: input
rules: 
showIf: 
default:
step: step-1
```

### All Done

After completing all the steps, the template is saved in the repository directory.
You can add detailed information about the template to the `README.md` file.

#### Console output
```
Created template dir "my-template/v0".
Created template manifest file "src/manifest.jsonnet".
Created template inputs file "src/inputs.jsonnet".
Created readme file "README.md".
Plan for "pull" operation:
  + C extractor/keboola.ex-db-mysql/my-data-source
  + R extractor/keboola.ex-db-mysql/my-data-source/rows/table1
  + R extractor/keboola.ex-db-mysql/my-data-source/rows/table2
  + C transformation/keboola.snowflake-transformation/my-transformation
Pull done.
Template "my-template/v0" has been created.
```
#### Resulting directory structure
```
📂 [repository]
┣ 📂 .keboola
┃ ┗ 🟦 repository.json
┗ 📂 my-template
  ┗ 📂 v0
    ┣ 🟩 README.md
    ┗ 📂 src
       ┣ 🟪 inputs.jsonnet
       ┣ 🟪 manifest.jsonnet
       ┣ 📂 extractor
       ┃ ┗ 📂 keboola.ex-db-mysql
       ┃   ┗ 📂 my-data-source
       ┃      ┣ 🟪 config.jsonnet
       ┃      ┣ 🟪 meta.jsonnet
       ┃      ┣ 🟩 description.md
       ┃      ┗ 📂 rows
       ┃        ┣ 📂 table1
       ┃        ┃ ┣ 🟪 config.jsonnet
       ┃        ┃ ┣ 🟪 meta.jsonnet
       ┃        ┃ ┗ 🟩 description.md
       ┃        ┗ 📂 table2
       ┃          ┣ 🟪 config.jsonnet
       ┃          ┣ 🟪 meta.jsonnet
       ┃          ┗ 🟩 description.md
       ┗ 📂 transformation
         ┗ 📂 keboola.snowflake-transformation
           ┗ 📂 my-transformation
              ┣ 🟪 config.jsonnet
              ┣ 🟪 meta.jsonnet
              ┣ 🟩 description.md
              ┗ 📂 blocks
                 ┗ 📂 001-block-1
                    ┣ 🟪 meta.jsonnet
                    ┗ 📂 001-code-1
                       ┣ 🟪 meta.jsonnet
                       ┗ 🟫 code.sql       
```

#### Repository manifest

Template record is added to the `.keboola/repository.json`:
```json
{
  "version": 2,
  "templates": [
    {
      "id": "my-template",
      "name": "My Template",
      "description": "Full workflow to ...",
      "path": "my-template",
      "versions": [
        {
          "version": "0.0.1",
          "description": "",
          "stable": false,
          "path": "v0"
        }
      ]
    }
  ]
}
```

#### Template manifest

IDs and paths are defined in `my-template/v0/src/manifest.jsonnet`:
```jsonnet
{
  configurations: [
    {
      componentId: "keboola.ex-db-mysql",
      id: ConfigId("my-data-source"),
      path: "extractor/keboola.ex-db-mysql/my-data-source",
      rows: [
        {
          id: ConfigRowId("table1"),
          path: "rows/table1",
        },
        {
          id: ConfigRowId("table2"),
          path: "rows/table2",
        },
      ],
    },
    {
      componentId: "keboola.snowflake-transformation",
      id: ConfigId("my-transformation"),
      path: "transformation/keboola.snowflake-transformation/my-transformation",
      rows: [],
    },
  ],
}
```

#### User inputs

User inputs are defined in `my-template/v0/src/inputs.jsonnet`:
```jsonnet
{
  inputs: [
    {
      id: "mysql-host",
      name: "MySQL Host",
      description: "",
      type: "string",
      kind: "input",
    },
    {
      id: "mysql-port",
      name: "MySQL Port",
      description: "",
      type: "int",
      kind: "input",
      default: 3306,
    },
    {
      id: "mysql-user",
      name: "MySQL User",
      description: "",
      type: "string",
      kind: "input",
    },
    {
      id: "mysql-password",
      name: "MySQL Password",
      description: "",
      type: "string",
      kind: "hidden",
    },
    {
      id: "mysql-database",
      name: "MySQL Database",
      description: "",
      type: "string",
      kind: "input",
    },
  ],
}
```

Example configuration with user inputs:
```jsonnet
# my-template/v0/src/extractor/keboola.ex-db-mysql/my-data-source/config.jsonnet
{
  parameters: {
    db: {
      port: Input("mysql-port"),
      host: Input("mysql-host"),
      user: Input("mysql-user"),
      "#password": Input("mysql-password"),
      database: Input("mysql-database"),
    },
  },
}
```

You can further customize the template as needed.

## Use Template

To use template you need a local [project directory](/cli/structure/). 
If you do not have one, use [kbc sync init](/cli/commands/sync/init/) command.
The template is applied locally. Command [kbc sync push](/cli/commands/sync/push/) can be used to push changes to the project.


Template repositories are defined in the [project manifest](/cli/structure/#manifest).
First step is to add our custom repository to the project manifest.
Template repository can be stored in a git repository or in a local directory.


### Add Git Repository

First, push template repository to a public git repository. 
Repository directory must be root directory of the git repository.

Then edit [.keboola/manifest.json](/cli/structure/#manifest) file in the project directory in which you want to use the template.
Add repository definition to `templates.repositories` key.
Key `url` is URL of the public git repository. Key `ref` is `branch` or `tag` used internally by `git checkout`.

Example `.keboola/manifest.json`:
```
....
  "templates": {
    "repositories": [
        "type": "git",
        "name": "my-repository",
        "url": "https://github.com/my-org/my-repository.git",
        "ref": "main"
    ]
  },
....
```

### Add Local Repository

Edit [.keboola/manifest.json](/cli/structure/#manifest) file in the project directory in which you want to use the template.
Add repository definition to `templates.repositories` key.
Key `path` is relative or absolute path to the repository directory. Relative path must be relative to the project directory.

Example `.keboola/manifest.json`:
```
....
  "templates": {
    "repositories": [
      {
        "type": "dir",
        "name": "my-repository",
        "path": "/path/to/repository"
      }
    ]
  },
....
```

### Start Dialog

Use template, run [command](/cli/commands/local/template/use/) in the project directory:
```
kbc local template use my-repository/my-template/v0
```

The last parameter `v0` is the version, it can have different forms, see [versioning](/cli/templates/structure/#versioning).

Select target branch where the template should be applied:
```
? Select target branch:  [Use arrows to move, type to filter]
> Main (251721)
```

Fill in all [user inputs](/cli/templates/structure/inputs/).
```
? MySQL Host: my-mysql.com

? MySQL Port: 3306
...
```

Example console output:
```
Plan for "encrypt" operation:
  C main/extractor/keboola.ex-db-mysql/my-data-source
    parameters.db.#password
Encrypt done.
New objects from "my-repository/my-template/v0" template:
  + C main/extractor/keboola.ex-db-mysql/my-data-source
  + R main/extractor/keboola.ex-db-mysql/my-data-source/rows/table1
  + R main/extractor/keboola.ex-db-mysql/my-data-source/rows/table2
  + C main/transformation/keboola.snowflake-transformation/my-transformation
Template "my-repository/my-template/v0" has been applied.
```

The template can be applied multiple times.

### Push Changes

The template was applied to the local directory only.
You can see the changes with [kbc sync diff](/cli/commands/sync/diff/) command. 


If you are satisfied with the changes, you can push changes to the project and see the new configurations in the UI.
Run command:

```
kbc sync push
```

Example output:
```
Plan for "push" operation:
  + C main/extractor/keboola.ex-db-mysql/my-data-source
  + R main/extractor/keboola.ex-db-mysql/my-data-source/rows/table1
  + R main/extractor/keboola.ex-db-mysql/my-data-source/rows/table2
  + C main/transformation/keboola.snowflake-transformation/test-transformation
  + C main/transformation/keboola.snowflake-transformation/my-transformation
Push done.
```

## Next Steps
- [Template Structure](/cli/templates/structure/)
- [User Inputs](/cli/templates/structure/inputs/)
