---
title: Workspace Detail
permalink: /cli/commands/remote/workspace/detail/
---

* TOC
{:toc}

**Print the credentials and details of a [workspace](https://help.keboola.com/transformations/workspace/)**

```
kbc remote workspace detail [flags]
```

### Options

`-W, --workspace-id string`
: Id of the workspace to be detailed. You can find it using the [List Workspaces](/cli/commands/remote/workspace/list/) command.

`-H, --storage-api-host <string>` 
: Keboola Connection instance URL, e.g. "connection.keboola.com"

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc remote workspace detail -W <id>

Workspace "foo"
ID: <id>
Type: snowflake
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
