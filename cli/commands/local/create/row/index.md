---
title: Create Configuration Row
permalink: /cli/commands/local/create/row/
---

* TOC
{:toc}

**Create an empty [configuration row](https://help.keboola.com/components/#configuration-rows).**

```
kbc local create row [flags]
```

Or shorter:
```
kbc create row [flags]
kbc c row [flags]
```

Create a new configuration row in your [local directory](/cli/structure/) and assign it a unique ID (i.e., the [persist](/cli/commands/local/persist/)
command is called automatically). To save it to the project, call [push](/cli/commands/local/push/) afterwards. You will
be prompted for a name, a branch, and a component ID.

Some components have a default content that will be used (if specified by the component author).
For others, `config.json` will only contain an empty JSON document `{}`.

*Tip: You can create a new configuration row by copying an existing one and running the [persist](/cli/commands/local/persist/) command.*

### Options

`-b, --branch string <string>`
: Id or name of the branch

`-c, --config <string>`
: Id or name of the configuration

`-n, --name <string>`
: Name of the new configuration row

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc create row

? Enter a name for the new config row customer

? Select the target branch Main (4908)

? Select the target config invoices (7475544)
Created new config row "main/extractor/keboola.ex-db-mysql/invoices/rows/customer"
```

```
➜ kbc create config -n customer -b main -c invoices
Created new config row "main/extractor/keboola.ex-db-mysql/invoices/rows/customer"
```

## Next Steps

- [All Commands](/cli/commands/)
- [Create Configuration](/cli/commands/local/create/config/)
- [Create Branch](/cli/commands/remote/create/brabch/)
