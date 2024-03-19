---
title: Delete Workspace
permalink: /cli/commands/remote/workspace/delete/
---

* TOC
{:toc}

**Delete a [workspace](https://help.keboola.com/transformations/workspace/).**

```
kbc remote workspace delete [flags]
```

### Options

`-W, --workspace-id string`
: ID of the workspace to be deleted. You can find it using the [List Workspaces](/cli/commands/remote/workspace/list/) command.

`-H, --storage-api-host <string>` 
: Keboola instance URL, e.g., "connection.keboola.com"

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc remote workspace delete -W <id>

Deleting the workspace "foo" (<id>), please wait.
Delete done.
```

## Next Steps

- [All Commands](/cli/commands/)
- [Learn more about Workspaces](https://help.keboola.com/transformations/workspace/)
