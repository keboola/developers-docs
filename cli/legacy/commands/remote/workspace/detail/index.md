---
title: Workspace Detail
permalink: /cli/legacy/commands/remote/workspace/detail/
redirect_from:
  - /cli/commands/remote/workspace/detail/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Print the credentials and details of a [workspace](https://help.keboola.com/transformations/workspace/)**

```
kbc remote workspace detail [flags]
```

### Options

`-W, --workspace-id string`
: ID of the workspace to be detailed. You can find it using the [List Workspaces](/cli/legacy/commands/remote/workspace/list/) command.

`-H, --storage-api-host <string>` 
: Keboola instance URL, e.g., "connection.keboola.com"

[Global Options](/cli/legacy/commands/#global-options)

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

- [All Commands](/cli/legacy/commands/)
- [Learn more about Workspaces](https://help.keboola.com/transformations/workspace/)
