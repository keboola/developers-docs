---
title: Lineage
permalink: /cli/commands/lineage/
---

* TOC
{:toc}

## lineage build

```
kbagent lineage build -d DIR -o FILE [--refresh] [--ai]
```

build column-level lineage graph from sync'd data

## lineage show

```
kbagent lineage show -l FILE --downstream "project:table" [--columns] [-c COL] [--format text|mermaid|html|er]
```

query downstream dependencies from cache

## lineage show

```
kbagent lineage show -l FILE --upstream "project:table" [--columns] [-c COL] [--format text|mermaid|html|er]
```

query upstream dependencies from cache

## lineage info

```
kbagent lineage info -l FILE
```

show graph contents: projects, tables, most connected nodes

## lineage server

```
kbagent lineage server -l FILE [--port N]
```

interactive lineage browser in web browser

## sharing edges

```
kbagent sharing edges [--project NAME]
```

cross-project data flow edges via bucket sharing


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [lineage workflow](/cli/guides/lineage-deep-workflow/)
