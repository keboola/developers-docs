---
title: Agent Tasks
permalink: /cli/commands/agent/
---

* TOC
{:toc}

CLI parity for the `/agents` REST surface. Reads/writes `<config_dir>/agents.json` -- the same on-disk format the in-process scheduler inside `kbagent serve` consumes. CRUD + ad-hoc `run` work offline; the cron loop that fires scheduled tasks still requires `kbagent serve` running. See [agent-tasks-cli-workflow.md](agent-tasks-cli-workflow.md) for full walkthroughs; [agent-tasks-rest-workflow.md](agent-tasks-rest-workflow.md) covers the REST/SSE form for AI-agent subprocesses.

**ID forms (since v0.44.0):** every subcommand that takes `TASK_ID` / `RUN_ID` accepts it positionally (`agent show TASK_ID`) **or** via a named flag (`--id` / `--task-id`, plus `--run-id` for `run-detail` / `run-events`). The flag aliases bring agent commands in line with the rest of the CLI, which identifies entities by flag everywhere else (`--job-id`, `--config-id`, `--app-id`, ...). Passing both forms with conflicting values is a usage error (exit 2).

## agent list

```
kbagent agent list
```

list all registered tasks (id / name / cron / type / state / last-run / next-run).

## agent show

```
kbagent agent show TASK_ID
```

full task detail including the action payload.

## agent create

```
kbagent agent create --name N [--description D] [--cron CRON] [--manual] [--enabled/--disabled] (--type ai_agent --cli claude|codex|gemini --prompt P [--extra-arg ...] [--timeout SECONDS] | --type cli_command --argv ARG [--argv ARG ...] [--timeout SECONDS] | --type mcp_tool --tool TOOL [--mcp-project ALIAS] [--mcp-branch ID] [--input JSON|@file|-] [--timeout SECONDS] | --from-file PATH|@path|-) [--trigger-task-id ID --trigger-on success|error|always]
```

persist a new task. Convenience flags cover the typical single-action case; `--from-file` accepts the full `{"type": ..., "params": ...}` JSON envelope. **`--extra-arg` / `extra_args` on an `ai_agent` task are honored only when `kbagent serve` runs with a truthy `KBAGENT_ALLOW_AI_EXTRA_ARGS` (since v0.60.2); otherwise they are dropped with a warning** -- see [gotchas.md](gotchas.md).

## agent update

```
kbagent agent update TASK_ID [--name N] [--description D] [--cron C] [--enabled/--disabled] [--manual/--auto] [--clear-trigger] [--trigger-task-id ID --trigger-on ...]
```

patch one or more fields. Omitted flags leave the field unchanged. `--manual` nulls `next_run_at`; `--auto` recomputes it from the cron expression.

## agent delete

```
kbagent agent delete TASK_ID [--yes]
```

permanent removal. Run history on disk is preserved.

## agent run

```
kbagent agent run TASK_ID [--stream] [--runtime-prompt TEXT | --runtime-input JSON|@file|-]
```

trigger immediately. `--stream` prints one line per event in human mode, NDJSON in `--json` mode. `--runtime-prompt` appends ad-hoc text to an ai_agent's persisted prompt for this run only; `--runtime-input` merges arbitrary JSON into the action params (mcp_tool: shallow-merge into `params.input`; cli_command: appends to `params.argv`).

## agent runs

```
kbagent agent runs TASK_ID [--limit N]
```

run history (newest first; default limit 50).

## agent run-detail

```
kbagent agent run-detail TASK_ID RUN_ID
```

single AgentRun record (status / summary / output / error).

## agent run-events

```
kbagent agent run-events TASK_ID RUN_ID
```

replay the persisted ai_agent event timeline (only present for ai_agent runs from v0.10+).

## agent test

```
kbagent agent test [--type ... | --from-file PATH] [--stream] [--name N] [common action flags]
```

execute an action ad-hoc; nothing is persisted. Same dispatcher as the cron scheduler, useful for sanity-checking a prompt / tool / argv before saving.

## agent cron-preview

```
kbagent agent cron-preview --cron "..." [--count N]
```

validate a cron expression and show the next N firings (UTC, capped at 20).

## agent prompt-improve

```
kbagent agent prompt-improve --goal "..." [--draft "..."] [--cli claude|codex|gemini] [--project ALIAS] [--extra-arg X ...] [--stream/--no-stream]
```

AI-polished single-shot prompt for an unattended agent task. The final `done` event's `data.prompt` carries the cleaned body ready to drop into `agent create --prompt ...`. `--extra-arg` is subject to the `KBAGENT_ALLOW_AI_EXTRA_ARGS` opt-in (since v0.60.2) -- see [gotchas.md](gotchas.md).


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [agent workflow](/cli/guides/agent-tasks-cli-workflow/)
