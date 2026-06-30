---
title: Validate Row Command
permalink: /cli/legacy/commands/local/validate/row/
redirect_from:
  - /cli/commands/local/validate/row/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}


**Validate a [configuration row JSON file](https://help.keboola.com/components/#configuration-rows).**

```
kbc local validate row component.id row.json [flags]
```

Each [component](/extend/component/) definition optionally contains a **schema of the configuration row `parameters` key**.

The command validates the content of the specified JSON file against the schema.
It can be used both in a project [local directory](/cli/legacy/structure/) and also separately.

## Options

[Global Options](/cli/legacy/commands/#global-options)

## Example

A successful run, the configuration row is valid:
```
➜ kbc local validate row keboola.ex-azure-cost-management row.json
Validation done.
```

A validation error:
```
➜ kbc local validate row keboola.ex-azure-cost-management row.json
Error:
- "export": missing properties: "aggregation"
- "export.groupingDimensions": expected array, but got string
```

If there is no schema in the component definition, a warning is printed:
```
➜ kbc local validate row ex-generic-v2 row.json
Component "ex-generic-v2" has no configuration row JSON schema.
Validation done.
```

## Next Steps

- [All Commands](/cli/legacy/commands/)
- [Validate Local Project](/cli/legacy/commands/local/validate/)
