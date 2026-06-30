---
title: Flows
permalink: /cli/commands/flow/
---

* TOC
{:toc}

> Since 0.57.0 the `flow` group targets `keboola.flow` (Conditional Flows) ONLY; `keboola.orchestrator` is dropped and `--component-id` is removed from every subcommand. IDs are **strings**; phases use `next[].goto` (a phase id or `null`) + optional `condition`; tasks are typed (`job`/`notification`/`variable`). The old `dependsOn` template is invalid. Execute a flow with `kbagent job run --component-id keboola.flow --config-id ID`. See `flow-workflow.md`.
## flow list

```
kbagent flow list [--project NAME] [--branch ID] [--with-schedules]
```

list conditional flows (keboola.flow) across one or all projects. Legacy keboola.orchestrator configs are NOT listed; their total appears as `legacy_orchestrator_count` (+ a warning). `--with-schedules` enriches each row with `schedules: [{schedule_id, cron, timezone, enabled}, ...]` via one extra keboola.scheduler list call per project (not per flow)

## flow detail

```
kbagent flow detail --project NAME --flow-id ID [--branch ID]
```

full phase/task breakdown; per-phase transitions (`→ goto [condition | default]`), typed-task badges, retry info; JSON is the raw body unchanged

## flow schema

```
kbagent flow schema [--full --project NAME]
```

plain form prints the offline conditional-flow YAML template (string ids, `next[].goto`, typed tasks). `--full` fetches and dumps the **live** JSON Schema from the stack (AI Service `configurationSchema` for `keboola.flow`) and **requires `--project`** -- the schema is no longer bundled

## flow validate

```
kbagent flow validate --file @path.yaml|- [--project NAME]
```

validate a definition. With `--project`: fetch the live schema from the stack for full structural + semantic validation (a fetch failure degrades to semantic-only + a note). Without `--project`: semantic-only validation + a note that structural validation was skipped (no schema source). Exit 0 valid (warnings still printed), exit 2 on errors; `--json` lists `{valid, errors, warnings, notes}`

## flow new

```
kbagent flow new --project NAME --name NAME [--description D] [--file @path.yaml|-|JSON] [--branch ID]
```

create a conditional flow; validated against the **live** CF schema fetched from the stack before the API call (`INVALID_FLOW_DEFINITION` on failure). A schema-fetch failure does NOT block the write: structural check skipped, semantic checks still run, a `structural schema validation skipped` warning is surfaced

## flow update

```
kbagent flow update --project NAME --flow-id ID [--name N] [--description D] [--file @path.yaml|-|JSON] [--branch ID]
```

update name, description, or phases/tasks; `--file` is a full-replace of phases+tasks; merge-aware validation against the live CF schema (same graceful semantic-only degradation on fetch failure); requires at least one of --name/--description/--file

## flow delete

```
kbagent flow delete --project NAME --flow-id ID [--branch ID] [--yes]
```

delete a flow config (confirmation guard)

## flow schedule

```
kbagent flow schedule --project NAME --flow-id ID --cron "0 6 * * *" [--timezone TZ] [--disabled] [--branch ID]
```

attach a cron schedule (stored as keboola.scheduler config, target.componentId=keboola.flow); replaces any existing schedule

## flow schedule-remove

```
kbagent flow schedule-remove --project NAME --flow-id ID [--branch ID] [--yes]
```

remove all cron schedules attached to a flow; idempotent


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [flow workflow](/cli/guides/flow-workflow/)
