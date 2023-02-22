---
title: Validate Schema Command
permalink: /cli/commands/local/validate/schema/
---

* TOC
{:toc}


**Validate a [configuration](/extend/common-interface/config-file/)/[row](https://help.keboola.com/components/#configuration-rows) JSON file by a JSON schema file**

```
kbc local validate schema schema.json config.json [flags]
```

Validate content of the specified JSON file
against the specified JSON schema file.

The JSON schema should contain a schema for the `parameters` key,
just like configuration/row schema in a [component](/extend/component/) definition.

The main purpose of this command is to **test 
a new JSON schema before it is changed in a component definition**.
It can be used in a project [local directory](/cli/structure/) but also separately.

## Options

[Global Options](/cli/commands/#global-options)

## Example

Successful run, the JSON file is valid:
```
➜ kbc local validate schema schema.json config.json
Validation done.
```

A validation error:
```
➜ kbc local validate schema schema.json config.json
Error: missing properties: "subscriptionId"
```

## Next Steps

- [All Commands](/cli/commands/)
- [Validate Local Project](/cli/commands/local/validate/)
