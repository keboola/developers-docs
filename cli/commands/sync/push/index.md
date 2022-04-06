---
title: Push Command
permalink: /cli/commands/sync/push/
---

* TOC
{:toc}

**Sync a [local directory](/cli/structure/) to the [project](/cli/#subsystems).**

```
kbc sync push [flags]
```

Or shorter:
```
kbc push [flags]
kbc ph [flags]
```

The project state will be overwritten to match the local state.

## Options

`--dry-run`
: Preview all changes

`--encrypt`
: Encrypt unencrypted values before the push

`--force`
: Delete configurations missing in the local directory

[Global Options](/cli/commands/#global-options)

## Example

When you [create a configuration](/cli/commands/local/create/config/) of the MySQL extractor, the command will look like this:

```
➜ kbc push --dry-run

Plan for "push" operation:
  + C main/extractor/keboola.ex-db-mysql/7511990/invoices
  + R main/extractor/keboola.ex-db-mysql/7511990/invoices/rows/customer
Dry run, nothing changed.
Push done.
```

## Next Steps

- [All Commands](/cli/commands/)
- [Init](/cli/commands/sync/init/)
- [Pull](/cli/commands/sync/pull/)
- [Diff](/cli/commands/sync/diff/)
