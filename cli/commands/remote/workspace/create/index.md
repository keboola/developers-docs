---
title: Create Workspace
permalink: /cli/commands/remote/workspace/create/
---

* TOC
{:toc}

**Create a new [workspace](https://help.keboola.com/transformations/workspace/).**

```
kbc remote workspace create [flags]
```

### Options

`--name <string>`
: Name of the workspace to be created

`--type <string>`
: Type of the workspace to be created

`--size <string>`
: Size of the workspace to be created. It is ignored for database workspaces.

`-H, --storage-api-host <string>` 
: Keboola Connection instance URL, e.g. "connection.keboola.com"

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc remote workspace create --name foo --type snowflake

Creating a new workspace, please wait.
Created the new workspace "foo" (<id>).
Credentials:
  Host: <host>
  User: <user>
  Password: <password>
  Database: <database>
  Schema: <schema>
  Warehouse: <warehouse>
```

## Next Steps

- [All Commands](/cli/commands/)
- [Learn more about Workspaces](https://help.keboola.com/transformations/workspace/)
