---
title: CLI
permalink: /cli/
---

* TOC
{:toc}

Keboola CLI (Command Line Interface), known also as "Keboola as Code", is a set of commands for operating your cloud data 
pipeline. It is available to install in the Windows, macOS, and Linux environments.

The whole Keboola project is represented by a local [directory structure](/cli/structure/#directory-structure). 
[Component configurations](https://help.keboola.com/components) are represented by [JSON files](/cli/structure/#configurations).

## Use Cases

Keboola CLI can be used, for example, to:
- Pull your entire project to a local directory in seconds. See the [init](/cli/commands/sync/init/) and [pull](/cli/commands/sync/pull/) commands.
- Bulk edit [component configurations](https://help.keboola.com/components) in your IDE.
- Compare the local version with the current project state. See the [diff](/cli/commands/sync/diff/) command.
- Copy a [configuration](https://help.keboola.com/components) as a directory in the project and between projects. See the [persist](/cli/commands/local/persist/) command.
- Apply all changes back to the project in a moment. See the [push](/cli/commands/sync/push/) command.
- Manage project history in a git repository.
- Automate the whole process in a CI/CD pipeline. See [GitHub Integration](/cli/github-integration/).
- Locally develop and test your dbt transformation code.

## Subsystems

A brief overview of supported subsystems of the project.

### Configurations

- [Component configurations](https://help.keboola.com/components) and [configuration rows](https://help.keboola.com/components/#configuration-rows) are fully supported.
- This includes all special types of components, such as:
  - [Transformations](/cli/structure/#transformations), [Variables](/cli/structure/#variables), [Shared Codes](/cli/structure/#shared-code), [Schedules](/cli/structure/#schedules) and [Orchestrations](/cli/structure/#orchestrations).   

### Development Branches

- A [branch](https://help.keboola.com/components/branches/)  can be [pulled](/cli/commands/sync/pull/) and then edited or deleted locally. 
- Changes can be [pushed](/cli/commands/sync/push/) back to the project.
- There is one limitation, **a branch cannot be created locally**. 
  - A branch must be created directly in the project, from the `main` branch.
  - See the [Create Branch](/cli/commands/remote/create/branch/) command.

### Storage

At the moment, all [Storage](https://help.keboola.com/storage/) related operations are sub-commands of the [kbc remote](/cli/commands/remote/) command. They operate directly on a project. This means that any changes you make using the CLI are immediately applied to your project. We have plans to add support for managing buckets and tables locally using definition files just like component configurations.


#### Files

- To upload a file, use the [file upload](/cli/commands/remote/file/upload/) command.
- To download a file, use the [file download](/cli/commands/remote/file/download/) command.

#### Buckets and tables

These commands can be used to manage the [buckets](https://help.keboola.com/storage/buckets/) and [tables](https://help.keboola.com/storage/tables/) in your project:
- To create a new bucket, use the [create bucket](/cli/commands/remote/create/bucket/) command. 
- To create a new table, use the [create table](/cli/commands/remote/create/table/) command.

The resulting [tables](https://help.keboola.com/storage/tables/) will be empty, so you may want to use:
- The [table import](/cli/commands/remote/table/import/) command to import data. 
- The [table unload](/cli/commands/remote/table/unload/) command can be used to take data out of a table and store it in a file.

For convenience, you can use combined commands:
- The [table upload](/cli/commands/remote/table/upload/) command combines the [file upload](/cli/commands/remote/file/upload/) + [table import](/cli/commands/remote/table/import/) operations.
- The [table download](/cli/commands/remote/table/download/) command combines the [table unload](/cli/commands/remote/table/unload/) + [file download](/cli/commands/remote/file/download/) operations.

These commands may be a little heavy if you are dealing with a lot of data.
- If you just want a quick sample, use the [table preview](/cli/commands/remote/table/preview/) command.

## Next Steps

- [Installation](/cli/installation/)
- [Getting Started](/cli/getting-started/)
- [Directory Structure](/cli/structure/)
- [Commands](/cli/commands/)
