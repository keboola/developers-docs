---
title: Validate Local Project Command
permalink: /cli/legacy/commands/local/validate/
redirect_from:
  - /cli/commands/local/validate/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}


**Validate the [local project directory](/cli/legacy/structure/).**

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

[Global Options](/cli/legacy/commands/#global-options)

## Example

```
➜ kbc validate
Everything is good.
```

## Sub Commands

|---
| Command | Description
|-|-|-
| [kbc local validate config](/cli/legacy/commands/local/validate/config/) | Validate a configuration JSON file. |
| [kbc local validate row](/cli/legacy/commands/local/validate/row/) | Validate a configuration row JSON file. |
| [kbc local validate schema](/cli/legacy/commands/local/validate/schema/) | Validate a configuration/row JSON file by a JSON schema file. |


## Next Steps

- [All Commands](/cli/legacy/commands/)
- [Diff](/cli/legacy/commands/sync/diff/)
- [Push](/cli/legacy/commands/sync/push/)
- [Fix Paths](/cli/legacy/commands/local/fix-paths/)
