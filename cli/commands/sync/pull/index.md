---
title: Pull Command
permalink: /cli/commands/sync/pull/
---

* TOC 
{:toc}

**Sync [project](/cli/#subsystems) to the [local directory](/cli/structure/).**

```
kbc sync pull [flags]
```

Or shorter:
```
kbc pull [flags]
kbc pl [flags]
```

Local changes will be overwritten to match the state of the project. 

If your local state is invalid, the command will fail unless you use the `--force` flag.

## Options

`--dry-run`
: Preview all changes

`--force`
: Ignore invalid local state

[Global Options](/cli/commands/#global-options)

## Examples

```
➜ kbc pull --dry-run
Pulling objects to the local directory.
Plan for "pull" operation:
  × C main/extractor/keboola.ex-db-mysql/7511990/invoices
  × R main/extractor/keboola.ex-db-mysql/7511990/invoices/rows/customer
Pull done.
```

## Next Steps

- [All Commands](/cli/commands/)
- [Init](/cli/commands/sync/init/)
- [Push](/cli/commands/sync/push/)
- [Diff](/cli/commands/sync/diff/)
