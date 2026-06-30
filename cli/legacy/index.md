---
title: Legacy CLI (Keboola as Code)
permalink: /cli/legacy/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

The legacy Keboola CLI (Command Line Interface), known also as "Keboola as Code", is a set of commands for operating your cloud data 
pipeline. It is available to install in the Windows, macOS, and Linux environments.

> This is the legacy `kbc` CLI. It is **deprecated** and no longer actively maintained — it remains documented here for
> existing users and scripts. For new projects, use the current [Keboola CLI (`kbagent`)](/cli/).

The whole Keboola project is represented by a local [directory structure](/cli/legacy/structure/#directory-structure). 
[Component configurations](https://help.keboola.com/components) are represented by [JSON files](/cli/legacy/structure/#configurations).

## Use Cases

Keboola CLI can be used, for example, to:
- Pull your entire project to a local directory in seconds. See the [init](/cli/legacy/commands/sync/init/) and [pull](/cli/legacy/commands/sync/pull/) commands.
- Bulk edit [component configurations](https://help.keboola.com/components) in your IDE.
- Compare the local version with the current project state. See the [diff](/cli/legacy/commands/sync/diff/) command.
- Copy a [configuration](https://help.keboola.com/components) as a directory in the project and between projects. See the [persist](/cli/legacy/commands/local/persist/) command.
- Apply all changes back to the project in a moment. See the [push](/cli/legacy/commands/sync/push/) command.
- Manage project history in a git repository.
- Automate the whole process in a CI/CD pipeline. See [GitHub Integration](/cli/legacy/github-integration/). Use the `--skip-workflows` flag during initialization to avoid interactive prompts in automated environments.
- Merge and rebase Keboola Branches via Git. Learn more in the [Example Use Cases]() section.
- Distribute a single project definition into multiple projects. See the [Example Use Cases]() section.
- Multi-stage (and multi-project) environment management via Git. See the [Example Use Cases]() section. 
- Locally develop and test your dbt transformation code.

## Subsystems

A brief overview of supported subsystems of the project.

### Configurations

- [Component configurations](https://help.keboola.com/components) and [configuration rows](https://help.keboola.com/components/#configuration-rows) are fully supported.
- This includes all special types of components, such as:
  - [Transformations](/cli/legacy/structure/#transformations), [Variables](/cli/legacy/structure/#variables), [Shared Codes](/cli/legacy/structure/#shared-code), [Schedules](/cli/legacy/structure/#schedules) and [Orchestrations](/cli/legacy/structure/#orchestrations).   

### Development Branches

- A [branch](https://help.keboola.com/components/branches/)  can be [pulled](/cli/legacy/commands/sync/pull/) and then edited or deleted locally. 
- Changes can be [pushed](/cli/legacy/commands/sync/push/) back to the project.
- There is one limitation, **a branch cannot be created locally**. 
  - A branch must be created directly in the project, from the `main` branch.
  - See the [Create Branch](/cli/legacy/commands/remote/create/branch/) command.

### Storage

At the moment, all [Storage](https://help.keboola.com/storage/) related operations are sub-commands of the [kbc remote](/cli/legacy/commands/remote/) command. They operate directly on a project. This means that any changes you make using the CLI are immediately applied to your project. We have plans to add support for managing buckets and tables locally using definition files just like component configurations.


#### Files

- To upload a file, use the [file upload](/cli/legacy/commands/remote/file/upload/) command.
- To download a file, use the [file download](/cli/legacy/commands/remote/file/download/) command.

#### Buckets and tables

These commands can be used to manage the [buckets](https://help.keboola.com/storage/buckets/) and [tables](https://help.keboola.com/storage/tables/) in your project:
- To create a new bucket, use the [create bucket](/cli/legacy/commands/remote/create/bucket/) command. 
- To create a new table, use the [create table](/cli/legacy/commands/remote/table/create) command.

The resulting [tables](https://help.keboola.com/storage/tables/) will be empty, so you may want to use:
- The [table import](/cli/legacy/commands/remote/table/import/) command to import data. 
- The [table unload](/cli/legacy/commands/remote/table/unload/) command can be used to take data out of a table and store it in a file.

For convenience, you can use combined commands:
- The [table upload](/cli/legacy/commands/remote/table/upload/) command combines the [file upload](/cli/legacy/commands/remote/file/upload/) + [table import](/cli/legacy/commands/remote/table/import/) operations.
- The [table download](/cli/legacy/commands/remote/table/download/) command combines the [table unload](/cli/legacy/commands/remote/table/unload/) + [file download](/cli/legacy/commands/remote/file/download/) operations.

These commands may be a little heavy if you are dealing with a lot of data.
- If you just want a quick sample, use the [table preview](/cli/legacy/commands/remote/table/preview/) command.

## Next Steps

- [Installation](/cli/legacy/installation/)
- [Getting Started](/cli/legacy/getting-started/)
- [Directory Structure](/cli/legacy/structure/)
- [Commands](/cli/legacy/commands/)
