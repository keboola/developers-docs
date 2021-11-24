---
title: Create Component Configuration
permalink: /cli/commands/create-config/
---

* TOC
{:toc}

```
kbc create config [flags]
```

Create a new configuration in your local directory and assign it a unique ID (i.e., the [persist](/cli/commands/persist/) 
command is called automatically). To save it to the project, call [push](/cli/commands/push/) afterwards. You will 
be prompted for a name, a branch, and a component ID.

*Tip: You can create a new configuration by copying an existing one and running the [persist](/cli/commands/persist/) 
command.*

### Options

`-b, --branch string <string>`
: Id or name of the branch

`-c, --component-id <string>`
: Id of the component

`-n, --name <string>`
: Name of the new configuration

[Global Options](/cli/commands/#global-options)

### Examples

```
➜ kbc create config

? Enter a name for the new config invoices

? Select the target branch Main (4908)

? Select the target component MySQL extractor (keboola.ex-db-mysql)
Created new config "main/extractor/keboola.ex-db-mysql/invoices"
```

```
➜ kbc create config -n invoices -b main -c keboola.ex-db-mysql
Created new config "main/extractor/keboola.ex-db-mysql/invoices"
```

## Next Steps

- [Create Row](/cli/commands/create-row/)
