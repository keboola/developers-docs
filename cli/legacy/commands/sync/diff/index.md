---
title: Diff Command
permalink: /cli/legacy/commands/sync/diff/
redirect_from:
  - /cli/commands/sync/diff/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Show differences between a [local directory](/cli/legacy/structure/) and a [project](/cli/legacy/#subsystems).**

```
kbc sync diff [flags]
```

Or shorter:
```
kbc diff [flags]
kbc d [flags]
```

## Options

`--details`
: Show changed fields

[Global Options](/cli/legacy/commands/#global-options)

## Examples

When you change a configuration option of one component (e.g., an output table for a sheet 
in the [Google Drive extractor](/components/extractors/storage/google-drive/)), the output will look like this:

```
➜ kbc diff
* changed
- remote state
+ local state

Diff:
* R main/extractor/keboola.ex-aws-s3/my-aws-s-3-data-source/rows/share-cities-2 | changed: configuration
+ C main/extractor/keboola.ex-db-mysql/invoices
+ R main/extractor/keboola.ex-db-mysql/invoices/rows/customer

Use --details flag to list the changed fields.
```

If you want more details:

```
➜ kbc diff --details
* changed
- remote state
+ local state

Diff:
* R main/extractor/keboola.ex-aws-s3/my-aws-s-3-data-source/rows/jakubm-share-cities-2
  configuration:
    parameters.key:
      - cities2.csv
      + cities.csv
+ C main/extractor/keboola.ex-db-mysql/invoices
+ R main/extractor/keboola.ex-db-mysql/invoices/rows/customer
```

## Next Steps

- [All Commands](/cli/legacy/commands/)
- [Init](/cli/legacy/commands/sync/init/)
- [Pull](/cli/legacy/commands/sync/pull/)
- [Push](/cli/legacy/commands/sync/push/)
