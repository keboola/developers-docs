---
title: Sharing
permalink: /cli/commands/sharing/
---

* TOC
{:toc}

Bucket sharing + linking across projects in the same organization. `sharing edges` (above, under Data Lineage) visualises the resulting data-flow graph.
## sharing list

```
kbagent sharing list [--project NAME]
```

list shared buckets available for linking

## sharing share

```
kbagent sharing share --project ALIAS --bucket-id ID --type TYPE [--target-project-ids IDs] [--target-users EMAILS]
```

enable sharing on a bucket

## sharing unshare

```
kbagent sharing unshare --project ALIAS --bucket-id ID
```

disable sharing on a bucket

## sharing link

```
kbagent sharing link --project ALIAS --source-project-id ID --bucket-id ID [--name NAME]
```

link a shared bucket into a project

## sharing unlink

```
kbagent sharing unlink --project ALIAS --bucket-id ID
```

remove a linked bucket from a project


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [sharing workflow](/cli/guides/sharing-workflow/)
