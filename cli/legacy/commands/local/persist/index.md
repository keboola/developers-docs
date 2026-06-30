---
title: Persist Command
permalink: /cli/legacy/commands/local/persist/
redirect_from:
  - /cli/commands/local/persist/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Detect new directories with a [configuration](https://help.keboola.com/components/) or a [configuration row](https://help.keboola.com/components/#configuration-rows) in the [local directory](/cli/legacy/structure/).**

```
kbc local persist [flags]
```

Or shorter:
```
kbc p [flags]
```

Propagate changes in the [local directory](/cli/legacy/structure/) to the manifest. When you manually create a configuration or a row (e.g., by 
copy & paste of another existing configuration), the command will add its record to the [manifest](/cli/legacy/structure/#manifest) and generate a new ID. 
When you delete a configuration/row directory, the command will remove its record from the [manifest](/cli/legacy/structure/#manifest). If you want 
to propagate the changes to the project, call the [push](/cli/legacy/commands/sync/push/) command afterwards.

## Options

`--dry-run`
: Preview all changes

[Global Options](/cli/legacy/commands/#global-options)

## Examples

When you copy & paste a directory of a MySQL extractor configuration, the command will look like this:

```
➜ kbc persist --dry-run
Plan for "persist" operation:
  + C main/extractor/keboola.ex-db-mysql/invoices 2
  + R main/extractor/keboola.ex-db-mysql/invoices 2/rows/customer
Dry run, nothing changed.
Persist done.
```

## Next Steps

- [All Commands](/cli/legacy/commands/)
- [Diff](/cli/legacy/commands/sync/diff/)
- [Push](/cli/legacy/commands/sync/push/)
- [Fix Paths](/cli/legacy/commands/local/fix-paths/)
