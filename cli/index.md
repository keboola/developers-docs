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

Keboola CLI can be used for example to:
- Pull your entire project to a local directory in seconds. See [init](/cli/commands/sync/init/) and [pull](/cli/commands/sync/pull/) commands.
- Bulk edit [component configurations](https://help.keboola.com/components) in your IDE.
- Compare the local version with the current project state. See [diff](/cli/commands/sync/diff/) command.
- Copy [configuration](https://help.keboola.com/components) as a directory in the project and between projects. See [persist](/cli/commands/local/persist/) command.
- Apply all changes back to the project in a moment. See [push](/cli/commands/sync/push/) command.
- Manage project history in a git repository.
- Automate the whole process in a CI/CD pipeline. See [GitHub Integration](/cli/github-integration/).

## Subsystems

Brief overview of supported subsystems of the project.

### Configurations

- [Component configurations](https://help.keboola.com/components) and [configuration rows](https://help.keboola.com/components/#configuration-rows) are fully supported.
- This includes all special types of components, such as:
  - [Transformations](/cli/structure/#transformations), [Variables](/cli/structure/#variables), [Shared Codes](/cli/structure/#shared-code), [Schedules](/cli/structure/#schedules) and [Orchestrations](/cli/structure/#orchestrations).   

### Development Branches

- [Branch](https://help.keboola.com/components/branches/)  can be [pulled](/cli/commands/sync/pull/) and then edited or deleted locally. 
- Changes can be [pushed](/cli/commands/sync/push/) back to the project.
- There is one limitation, **branch cannot be created locally**. 
  - Branch must be created directly in the project, from the `main` branch.
  - See [Create Branch](/cli/commands/remote/create/branch/) command.

### Storage

- [Storage](https://help.keboola.com/storage/) is NOT supported at this time.
- It is not possible to work with table definitions or contents.
- We plan to add storage support in the future.

## Next Steps

- [Installation](/cli/installation/)
- [Getting Started](/cli/getting-started/)
- [Directory Structure](/cli/structure/)
- [Commands](/cli/commands/)
