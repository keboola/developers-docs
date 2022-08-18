---
title: Templates Structure
permalink: /cli/templates/structure/
---

* TOC
{:toc}

**Warning: "templates" is an experimental feature.**

## Repository

Templates repository is a directory stored in:
- Local filesystem.
- Git repository.
  - Must be a root directory, not a subdirectory.
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
  - `url` - url to author's website
- `templates` *(array)* - information about the project
  - `id` - template ID
  - `name` - a human-readable name
  - `description` - short description of the template
  - `path` - path to the template directory
  - `versions` *(array)*
    - `version` - [semantic version](https://semver.org/)
    - `description` - short description of the version
    - `stable` - is the template ready for production use?
    - `path` - path to the template version directory
    - `components` *(array)* - list of components used by the template

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

### Git integration

**Creating template**
- A command to manage a repository works with local directories.
- You can push changes into a git repository in the standard way using the `git` command.

**Using template**
- A template can be used in a project directly from a git repository.
- The repository must be defined in the [project manifest](/cli/structure/#manifest), in `templates.repositories` key.

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
  ┃       ┣ 🟪 config.jsonnet      but instead of JSON files there are JSONNET templates
  ┃       ┣ 🟪 meta.jsonet    
  ┃       ┣ 🟩 description.md
  ┃       ... 
  ┗ 📂 tests                     -  tests directory, not yet implemented
    ┗ 📂 ...
  
...
```

### Description

There are three types of template description:
- `description` field in the [repository.json](#repository):
  - Short description.
  - It is displayed on the overview of all templates.
- `description.md` file in the template [src directory](#template):
  - Longer description with MarkDown formatting support. 
  - It is displayed on the template detail page.
- `README.md` file in the template [src directory](#template):
  - Detailed information, changelog, data model ...
  - It is by default collapsed on the template detail page, in the `More Details` section.

### Versioning

Template is identified by `<repository>/<template-id>/<version>`,  e.g., `keboola/my-template/1.2.3`.
Each template version is stored in a separate directory, see [directory structure](#template).

Templates use [semantic versioning](https://semver.org/):
- Version format is `<major>.<minor>.<patch>`.
- For example, `v1.2.3`, prefix `v` is optional.
- Versions are defined in the [repository manifest](#manifest).
- Multiple versions of the template may be available at the same time.
- By default, the latest stable version is applied.
- Users don't have to enter the full version. For example:
  - `my-template/v1` references the latest available version `1.x.x`.
  - `my-template/v1.4` references the latest available version `1.4.x`.
- Name of the version directory doesn't matter.
  - It is recommended to call the directory according to the `<major>` version.
  - For example, for version `3.2.1` the directory name should be `v3`.

#### New Version

For **small changes** in the template, it is recommended to update the existing version.
- Increment `<minor>` or `<patch>` part of the version in the [repository manifest](#manifest).
- Changes will be clearly visible in git history, because the changes are made in an existing directory.
- Overwritten old version of the template will not be available.
- User will be able to upgrade to the new version.
- User will NOT be able to rollback.

For **larger changes** in the template, it is recommended to create a new `<major>` version.
- Copy the directory with the latest version, e.g., `v3` -> `v4`.
- Make changes and register the new version in the [repository manifest](#manifest), e.g., `4.0.0`.
- User will be able to upgrade to the new version, e.g., `v3` -> `v4`.
- User will be able to rollback, e.g., `v4` -> `v3`.

### Manifest

All configurations and configuration rows are defined in the manifest file `manifest.jsonnet`. 
Each template should have a `mainConfig` that can be started in the UI using the **Run button** after the template is used.
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

Files saved in `_common` directory in the [repository directory](#repository) can be accessed by every template using `<common>/` prefix.

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

## Next Steps
- [Jsonnet Files](/cli/templates/structure/jsonnet-files/)
- [User Inputs](/cli/templates/structure/inputs/)
