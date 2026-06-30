---
title: Development Branches
permalink: /cli/commands/branch/
---

* TOC
{:toc}

## branch list

```
kbagent branch list [--project NAME]
```

list dev branches

## branch create

```
kbagent branch create --project ALIAS --name "..." [--description "..."]
```

create and auto-activate branch

## branch use

```
kbagent branch use --project ALIAS --branch ID
```

switch active branch

## branch reset

```
kbagent branch reset --project ALIAS
```

reset to main/production

## branch delete

```
kbagent branch delete --project ALIAS --branch ID
```

delete branch (resets if active)

## branch merge

```
kbagent branch merge --project ALIAS [--branch ID]
```

get merge URL (does NOT merge via API)

## branch metadata-list

```
kbagent branch metadata-list --project NAME [--branch ID|default]
```

list all metadata entries on a branch (id, key, value, provider, timestamp). `--branch` defaults to `default` (main branch)

## branch metadata-get

```
kbagent branch metadata-get --project NAME --key KEY [--branch ID|default]
```

read a single metadata value by key. Exits with `NOT_FOUND` (exit 1) if absent

## branch metadata-set

```
kbagent branch metadata-set --project NAME --key KEY [--text STR | --file PATH | --stdin] [--branch ID|default]
```

set a key/value. Useful for `KBC.projectDescription` and similar dashboard-visible fields. Pass exactly one of `--text`, `--file`, or `--stdin`

## branch metadata-delete

```
kbagent branch metadata-delete --project NAME --metadata-id ID [--branch ID|default]
```

delete a metadata entry by its numeric ID (from `metadata-list`)


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [branch workflow](/cli/guides/branch-workflow/)
