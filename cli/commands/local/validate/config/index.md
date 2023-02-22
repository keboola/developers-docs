---
title: Validate Config Command
permalink: /cli/commands/local/validate/config/
---

* TOC
{:toc}


**Validate a [configuration JSON file](/extend/common-interface/config-file/).**

```
kbc local validate config component.id config.json [flags]
```

Each [component](/extend/component/) definition optionally contains a **schema of the configuration `parameters` key**.

The command validates the content of the specified JSON file against the schema. 
It can be used both in a project [local directory](/cli/structure/) and also separately.

## Options

[Global Options](/cli/commands/#global-options)

## Example

A successful run, the configuration is valid:
```
➜ kbc local validate config keboola.ex-azure-cost-management config.json
Validation done.
```

A validation error:
```
➜ kbc local validate config keboola.ex-azure-cost-management config.json
Error: missing properties: "subscriptionId"
```

If there is no schema in the component definition, a warning is printed:
```
➜ kbc local validate config ex-generic-v2 config.json
Component "ex-generic-v2" has no configuration JSON schema.
Validation done.
```

## Next Steps

- [All Commands](/cli/commands/)
- [Validate Local Project](/cli/commands/local/validate/)
