---
title: Validate Command
permalink: /cli/commands/local/validate/
---

* TOC
{:toc}


**Validate the [local directory](/cli/structure/).**

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

## Next Steps

- [All Commands](/cli/commands/)
- [Diff](/cli/commands/sync/diff/)
- [Push](/cli/commands/sync/push/)
- [Fix Paths](/cli/commands/local/fix-paths/)
