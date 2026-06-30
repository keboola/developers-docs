---
title: Workspaces
permalink: /cli/commands/workspace/
---

* TOC
{:toc}

## workspace create

```
kbagent workspace create --project ALIAS [--name NAME] [--ui] [--read-only]
```

create workspace (headless ~1s, `--ui` ~15s). Since v0.47.1: Snowflake headless workspaces return a `private_key` PEM field; `password` is empty. BigQuery workspaces keep the default password credential shape.

## workspace list

```
kbagent workspace list [--project NAME ...] [--orphaned] [--branch ID] [--qs-compatible]
```

list workspaces. `--project` repeatable; `--orphaned` filters to workspaces whose backing `keboola.sandboxes` config is missing. **Since v0.42.0 (#304)**: each entry carries `login_type`, `read_only`, `qs_compatible`, `database`, `warehouse`. New `Login Type` / `RO` / `QS` columns in human mode. `--qs-compatible` pre-filters to RO + whitelisted-loginType workspaces (the canonical data-app shape). **Updated v0.58.0**: `qs_compatible` is keyed by `(backend, loginType)` -- BigQuery workspaces (loginType `default`) now report `qs_compatible: true` and pass `--qs-compatible`; pre-0.58.0 every BigQuery workspace was wrongly excluded (Snowflake's own legacy `default` stays `false`). `--branch` requires exactly one `--project`; without `--branch`, the command behaves like `storage buckets` and uses production with an `Info: Using production branch for read (active dev branch X ignored; pass --branch X to override)` banner when an alias is pinned to a dev branch

## workspace detail

```
kbagent workspace detail --project ALIAS --workspace-id ID [--branch ID]
```

show connection details. **Since v0.42.0 (#304)**: response carries `login_type`, `read_only`, `qs_compatible`; human mode adds `Login type:` / `Read-only:` / `Query Service compatible:` rows. **Updated v0.58.0**: BigQuery `default` workspaces now report `qs_compatible: true` (was `false`). `--branch` opt-in mirrors `workspace list`

## workspace delete

```
kbagent workspace delete --project ALIAS --workspace-id ID
```

delete workspace

## workspace password

```
kbagent workspace password --project ALIAS --workspace-id ID
```

reset and return new password

## workspace load

```
kbagent workspace load --project ALIAS --workspace-id ID --tables TABLE_ID [...] [--preserve]
```

load storage tables

## workspace query

```
kbagent workspace query --project ALIAS --workspace-id ID --sql "..." [--file F] [--transactional] [--full] [--limit N]
```

run SQL via Query Service. **Fast inline results since v0.59.0**: default reads the result set inline via `GET /api/v1/queries/{job}/{stmt}/results` (JSON `columns`+`rows`, no CSV-file materialization), capped at `--limit` rows (default 500) and marked `truncated` when there are more; pass `--full` for the complete CSV export (slower, uncapped). Each statement still carries `csv_data` (synthesized from the inline rows) so older parsers keep working. **Backend-agnostic since v0.58.0**: runs against both Snowflake and BigQuery workspaces. Mind the dialect: Snowflake quotes identifiers with `"..."`, BigQuery with backticks `` `...` ``

## workspace gc

```
kbagent workspace gc [--project NAME ...] [--dry-run] [--yes]
```

garbage-collect orphaned workspaces (and any lingering `keboola.sandboxes` configs). `--dry-run` previews without deleting; `--project` repeatable, omit to GC across all connected projects

## workspace from-transformation

```
kbagent workspace from-transformation --project ALIAS --component-id ID --config-id ID [--row-id ID]
```

workspace from existing transform


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [workspace workflow](/cli/guides/workspace-workflow/)
