---
title: Fix Paths Command
permalink: /cli/legacy/commands/local/fix-paths/
redirect_from:
  - /cli/commands/local/fix-paths/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Ensure that all local paths match [configured naming](/cli/legacy/structure/#naming).**

```
kbc local fix-paths [flags]
```

The command unifies names of configurations, rows, and other directories based on [configured naming](/cli/legacy/structure/#naming).
For example, if the configuration name in `meta.json` changes, this command renames the directory by that name.
It is run automatically after [pull](/cli/legacy/commands/sync/pull/). 

## Options

`--dry-run`
: Preview all paths that would be affected

[Global Options](/cli/legacy/commands/#global-options)

## Examples

When you have a config and rename it in its `meta.json`, run the command afterwards. It will rename the directory:

```
➜ kbc fix-paths --dry-run
Plan for "rename" operation:
  - main/extractor/ex-generic-v2/{wiki-001 -> wiki-2}
Dry run, nothing changed.
Fix paths done.
```

## Next Steps

- [All Commands](/cli/legacy/commands/)
- [Persist](/cli/legacy/commands/local/persist)
