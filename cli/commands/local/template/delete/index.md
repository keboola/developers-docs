---
title: Delete Template Instance
permalink: /cli/commands/local/template/delete/
---

* TOC
{:toc}

**Delete a [template](/cli/templates/structure/#template) instance from the [local directory](/cli/structure/).**

```
kbc local template delete [flags]
```

Deletes all component configurations that were created from a template.

### Options

`-b, --branch string <string>`
: branch ID or name

`-i, --instance <string>`
: Id of the template instance

`--dry-run`
: Preview the list of configs to be deleted

[Global Options](/cli/commands/#global-options)

### Examples

See [Use Template Tutorial](/cli/templates/tutorial/#use-template).

```
➜ kbc local template delete -b main -i inst1 --dry-run

Plan for "delete-template" operation:
  x C main/extractor/keboola.ex-db-mysql/my-data-source
  x C main/extractor/keboola.ex-db-mysql/my-data-source-2
Dry run, nothing changed.
Delete done.
```

## Next Steps

- [Templates](/cli/templates/)
- [Create Template Tutorial](/cli/templates/tutorial/)
- [Use Template Tutorial](/cli/templates/tutorial/#use-template)
