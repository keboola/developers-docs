---
title: Validate Local Project Command
permalink: /cli/commands/local/validate/
---

* TOC
{:toc}


**Validate the [local project directory](/cli/structure/).**

```
kbc local validate [flags]
```

Or shorter:
```
kbc v [flags]
```

Validate the directory structure and file contents of the local directory. Configurations of components having a JSON schema
will be validated against the schema.

## Options

[Global Options](/cli/commands/#global-options)

## Example

```
➜ kbc validate
Everything is good.
```

## Sub Commands

|---
| Command | Description
|-|-|-
| [kbc local validate config](/cli/commands/local/validate/config/) | Validate a configuration JSON file. |
| [kbc local validate row](/cli/commands/local/validate/row/) | Validate a configuration row JSON file. |
| [kbc local validate schema](/cli/commands/local/validate/schema/) | Validate a configuration/row JSON file by a JSON schema file. |


## Next Steps

- [All Commands](/cli/commands/)
- [Diff](/cli/commands/sync/diff/)
- [Push](/cli/commands/sync/push/)
- [Fix Paths](/cli/commands/local/fix-paths/)
