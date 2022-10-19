---
title: List Workspaces
permalink: /cli/commands/remote/workspace/list/
---

* TOC
{:toc}

**Print a list of [workspaces](https://help.keboola.com/transformations/workspace/).**

```
kbc remote workspace list [flags]
```

### Options

`-H, --storage-api-host <string>`
: Keboola Connection instance url, eg. "connection.keboola.com"

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc remote workspace list

Loading workspaces, please wait.
Found workspaces:
  foo (ID: <id>, Type: snowflake)
  bar (ID: <id>, Type: snowflake)
  baz (ID: <id>, Type: python, Size: small)
```

## Next Steps

- [All Commands](/cli/commands/)
- [Learn more about Workspaces](https://help.keboola.com/transformations/workspace/)
