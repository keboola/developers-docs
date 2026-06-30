---
title: Schedules
permalink: /cli/commands/schedule/
---

* TOC
{:toc}

## schedule list

```
kbagent schedule list [--project NAME ...] [--enabled-only] [--branch ID]
```

fleet-wide list of every `keboola.scheduler` config across one, many, or all projects (parallel fan-out, no --project = all). Each row has `project_alias`, `schedule_id`, `schedule_name`, `parent_component_id`, `parent_config_id`, `parent_name`, `cron`, `timezone`, `enabled`. Answers "which configs are running on cron triggers across N projects?" without enumerating flows

## schedule detail

```
kbagent schedule detail --project NAME --schedule-id ID [--branch ID]
```

single-schedule detail: cron, timezone, enabled, raw `configuration`, plus the parent config's `parent_name` (orphaned schedules return `parent_name=""` rather than failing)

## schedule find

```
kbagent schedule find [--cron-window START-END] [--not-run-since DAYS] [--project NAME ...] [--branch ID]
```

audit filter (AND semantics). `--cron-window "02:00-04:00"` keeps rows whose cron's hour field is entirely inside the window (hour-level approximation -- see [gotchas.md](gotchas.md)). `--not-run-since N` keeps rows whose parent config's latest job is older than N days (or never ran). Without filters: equivalent to `schedule list` plus `last_run_at` + `matches_cron_window` columns

- See [schedule-workflow.md](schedule-workflow.md) for the audit walk-through


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [schedule workflow](/cli/guides/schedule-workflow/)
