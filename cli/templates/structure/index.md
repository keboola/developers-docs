---
title: Templates Structure
permalink: /cli/templates/structure/
---

* TOC
{:toc}

## Repository

The templates repository is a directory stored in:
- Local filesystem.
- Git repository.
  - It must be a root directory, not a subdirectory.
  - One git repository is one template repository.

The repository contains a manifest and directories with templates.

```
📂 .keboola             - metadata directory
┗ 🟦 repository.json    - manifest, paths and versions
📂 [template]           - template directory, see below
┗ 📂 [template version]
  ┗ ...
...
```

### Repository Manifest

All templates are listed in the repository manifest file `.keboola/repository.json`.

Repository manifest structure:
- `version` - current major version, now `2`
- `author` - repository author
  - `name` - author name
  - `url` - URL to the author's website
- `templates` *(array)* - information about the project
  - `id` - template ID
  - `name` - a human-readable name
  - `description` - short description of the template
  - `requirements` - requirements of the project
    - `backends` - *string[]* - list of project backends, e.g., `["snowflake","bigquery"]`
      - At least one must match the project backends.
    - `components` - *string[]* - list of project components, e.g., `["keboola.wr-db-snowflake"]`
      - All must match the project components.
    - `features` - *string[]* - list of project features, e.g., `["foo","bar"]`
      - All must match the project features.
  - `categories` - *string[]* - list of template categories, e.g., `["Data Extraction", "E-Commerce"]`
    - Optional: If it is not set, the template is in the `Other` category.
  - `deprecated` - *bool* - default `false`
    - A deprecated template is excluded from the list.
    - Metadata of the deprecated template can be obtained for existing instances.
  - `path` - path to the template directory
    - Required if `deprecated=false`.
    - It must not be set for deprecated templates if `deprecated=true`. 
  - `versions` *(array)*
    - `version` - [semantic version](https://semver.org/)
    - `description` - short description of the version
    - `stable` - is the template ready for production use?
    - `path` - path to the template version directory
      - Required if `deprecated=false`.
      - It must not be set for deprecated templates if `deprecated=true`.
    - `components` *(array)* - list of components used by the template

#### Snowflake writer

**Snowflake writer (data destination) component ID differs** on AWS and Azure stacks because staging storage differs.
- Component ID `keboola.wr-db-snowflake` is used for AWS stacks.
- Component ID `keboola.wr-snowflake-blob-storage` is used for Azure stacks.
- Please use:
  - Placeholder `<keboola.wr-db-snowflake>` in the `repository.json` in the `components` list.
  - Jsonnet function `SnowflakeWriterComponentId()` in [Jsonnet Files](/cli/templates/structure/jsonnet-files/).

#### Example

```json
{
  "version": 2,
  "author": {
    "name": "Keboola",
    "url": "https://keboola.com"
  },
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
        },
        {
          "version": "1.2.3",
          "description": "Version notes.",
          "stable": true,
          "path": "v1"
        }
      ]
    }
  ]
}

```

### Git Integration

**Creating template**
- A command to manage a repository works with local directories.
- You can push changes into a git repository in the standard way using the `git` command.

**Using template**
- A template can be used in a project directly from a git repository.
- The repository must be defined in the [project manifest](/cli/structure/#manifest) in `templates.repositories` key.

## Template

A template directory is stored in the [repository](#repository) and contains directories with template [versions](#versioning).

```
📂 [template]
┗ 📂 [template version]
  ┣ 📂 src
  ┃ ┗ 🟪 inputs.jsonnet          - definition of user inputs
  ┃ ┣ 🟪 manifest.jsonnet        - template manifest, object IDs and paths
  ┃ ┣ 🟩 description.md          - description which is displayed on the template detail page
  ┃ ┣ 🟩 README.md               - detailed information, changelog, ...
  ┃ ┗ 📂 [component-type]        
  ┃   ┗ 📂 [component-id]
  ┃     ┗ 📂 [config-name]       - structure is similar to the project structure,
  ┃       ┣ 🟪 config.jsonnet      but instead of JSON files, there are JSONNET templates
  ┃       ┣ 🟪 meta.jsonet    
  ┃       ┣ 🟩 description.md
  ┃       ... 
  ┗ 📂 tests                     -  tests directory
    ┣ 📂 [test name]
    ┃ ┣ 📂 expected-out          - expected structure of the project directory 
    ┃ ┃                            after applying the template in the test 
    ┃ ┗ 🟪 inputs.json           - sample inputs used to apply the template in the test
    ┗ ...
...
```

### Description

There are three types of template descriptions:
- `description` field in the [repository.json](#repository):
  - Short description.
  - It is displayed on the overview of all templates.
- `description.md` file in the template [src directory](#template):
  - Longer description with MarkDown formatting support. 
  - It is displayed on the template detail page.
- `README.md` file in the template [src directory](#template):
  - Detailed information, changelog, data model ...
  - It is, by default, collapsed on the template detail page in the `More Details` section.

### Versioning

A template is identified by `<repository>/<template-id>/<version>`,  e.g., `keboola/my-template/1.2.3`.
Each template version is stored in a separate directory; see the [directory structure](#template).

Templates use [semantic versioning](https://semver.org/):
- Version format is `<major>.<minor>.<patch>`.
- For example, `v1.2.3`; the prefix `v` is optional.
- Versions are defined in the [repository manifest](#manifest).
- Multiple versions of the template may be available at the same time.
- By default, the latest stable version is applied.
- Users don't have to enter the full version. For example:
  - `my-template/v1` references the latest available version `1.x.x`.
  - `my-template/v1.4` references the latest available version `1.4.x`.
- The name of the version directory doesn't matter.
  - It is recommended that the directory be called according to the `<major>` version.
  - For example, for version `3.2.1`, the directory name should be `v3`.

#### New Version


It is recommended that the existing version be updated for **small changes** in the template.
- Increment `<minor>` or `<patch>` part of the version in the [repository manifest](#manifest).
- Changes will be clearly visible in git history because the changes are made in an existing directory.
- The overwritten old version of the template will not be available.
- Users will be able to upgrade to the new version.
- Users will **not** be able to roll back.

For **more significant changes** in the template, it is recommended to create a new `<major>` version.
- Copy the directory with the latest version, e.g., `v3` -> `v4`.
- Make changes and register the new version in the [repository manifest](#manifest), e.g., `4.0.0`.
- Users will be able to upgrade to the new version, e.g., `v3` -> `v4`.
- Users will be able to roll back, e.g., `v4` -> `v3`.

### Manifest

All configurations and configuration rows are defined in the manifest file `manifest.jsonnet`. 
Each template should have a `mainConfig` that can be started in the UI by pressing the **Run** button after the template is used.
This is usually the main orchestration/flow.

Template manifest structure:
- `mainConfig` - main configuration
  - `componentId` - ID of the component
  - `id` - human-readable ID of the configuration defined by [`ConfigId` function](/cli/templates/structure/jsonnet-files/#functions)
- `configurations` - array of component configurations
  - `componentId` - ID of the component
  - `id` - human-readable ID of the configuration defined by [`ConfigId` function](/cli/templates/structure/jsonnet-files/#functions)
  - `path` - path to the configuration from the template version directory
  - `rows` - array of configuration rows (if the component supports rows)
    - `id` - human-readable ID of the row defined by [`ConfigRowId` function](/cli/templates/structure/jsonnet-files/#functions)
    - `path` - path to the row from the configuration directory

#### Example

```jsonnet
{
  mainConfig: {
    componentId: "keboola.orchestrator",
    id: ConfigId("orchestrator"),
  },
  configurations: [
    {
      componentId: "keboola.ex-db-mysql",
      id: ConfigId("country"),
      path: "extractor/keboola.ex-db-mysql/country",
      rows: [
        {
          id: ConfigRowId("people"),
          path: "rows/people",
        },
        {
          id: ConfigRowId("cities"),
          path: "rows/cities",
        },
      ],
    },
  ],
}
```

### Inputs

All user inputs are defined in the `inputs.jsonnet`.

Read more in [Template Inputs](/cli/templates/structure/inputs/).

### Common Directory

Files saved in the `_common` directory in the [repository directory](#repository) can be accessed by every template using the `<common>/` prefix.

#### Example

Use of the `_common` directory in `manifest.jsonnet`:
```jsonnet
{
  configurations: [
    {
      componentId: "ex-generic-v2",
      id: ConfigId("myconfig"),
      path: "<common>/foo/bar/extractor/ex-generic-v2/myconfig",
      rows: [],
    }
  ],
}
```

Use of the `_common` directory in a Jsonnet file (`config.jsonnet`):
```jsonnet
local part1 = import "lib/part1.jsonnet";
local part2 = import "/<common>/foo/bar/extractor/ex-generic-v2/myconfig/lib/part2.jsonnet";
std.mergePatch(part1, part2)
```

### Data Apps

A data app (configuration of the `keboola.data-apps` component) contains the deployment ID, 
which is stored in `parmeters.id` in the configuration.

This ID is not set when the configuration is created. 
It will be set when the data app is deployed.

This ID must be kept during the template upgrade to a new version. 

It happens automatically; no extra work is required.

## Next Steps
- [Jsonnet Files](/cli/templates/structure/jsonnet-files/)
- [User Inputs](/cli/templates/structure/inputs/)
- [Tests](/cli/templates/tests/)
