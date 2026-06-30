---
title: Create Configuration
permalink: /cli/legacy/commands/local/create/config/
redirect_from:
  - /cli/commands/local/create/config/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Create an empty [configuration](https://help.keboola.com/components/).**

```
kbc local create config [flags]
```

Or shorter:

```
kbc create config [flags]
```

```
kbc c config [flags]
```

Create an empty configuration in your [local directory](/cli/legacy/structure/) and assign it a unique ID (i.e., the [persist](/cli/legacy/commands/local/persist/) 
command is called automatically). To save it to the project, run the [kbc sync push](/cli/legacy/commands/sync/push/) command afterwards. You will 
be prompted for a name, a branch, and a component ID.

Some components have a default content that will be used (if specified by the component author). 
For others, `config.json` will only contain an empty JSON document `{}`.


*Tip: You can create a new configuration by copying an existing one and running the [persist](/cli/legacy/commands/local/persist/) 
command.*

### Options

`-b, --branch string <string>`
: Id or name of the branch

`-c, --component-id <string>`
: Id of the component

`-n, --name <string>`
: Name of the new configuration

[Global Options](/cli/legacy/commands/#global-options)

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

- [All Commands](/cli/legacy/commands/)
- [Create Configuration Row](/cli/legacy/commands/local/create/row/)
- [Create Branch](/cli/legacy/commands/remote/create/brabch/)
