---
title: Push Command
permalink: /cli/legacy/commands/sync/push/
redirect_from:
  - /cli/commands/sync/push/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Sync a [local directory](/cli/legacy/structure/) to the [project](/cli/legacy/#subsystems).**

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

[Global Options](/cli/legacy/commands/#global-options)

## Example

When you [create a configuration](/cli/legacy/commands/local/create/config/) of the MySQL extractor, the command will look like this:

```
➜ kbc push --dry-run

Plan for "push" operation:
  + C main/extractor/keboola.ex-db-mysql/7511990/invoices
  + R main/extractor/keboola.ex-db-mysql/7511990/invoices/rows/customer
Dry run, nothing changed.
Push done.
```

## Next Steps

- [All Commands](/cli/legacy/commands/)
- [Init](/cli/legacy/commands/sync/init/)
- [Pull](/cli/legacy/commands/sync/pull/)
- [Diff](/cli/legacy/commands/sync/diff/)
