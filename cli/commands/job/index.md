---
title: Jobs
permalink: /cli/commands/job/
---

* TOC
{:toc}

## job list

```
kbagent job list [--project NAME] [--component-id ID] [--config-id ID] [--status STATUS] [--limit N]
```

list jobs (default 50, max 500)

## job detail

```
kbagent job detail --project NAME --job-id ID
```

full job detail with timing and result message

## job run

```
kbagent job run --project NAME --component-id ID --config-id ID [--row-id ID ...] [--wait] [--timeout N] [--branch ID] [--mode run|debug] [--variable-values-id ID] [--no-variables] [--poll-strategy exponential|fixed] [--log-tail-lines N] [--idempotency-key KEY] [--force-rerun]
```

run a job, optionally wait for completion (branch-aware). `--idempotency-key KEY` (since v0.63.0) makes a replayed run safe: on a second `job run` with the same key, a prior still-running or non-failed job is returned (JSON gains `idempotent_replay: true`, human mode prints a note) instead of creating a duplicate side effect; a prior FAILED run is re-run. Dedup is **client-side** (the Queue API has no server idempotency token -- verified against the live spec) and persisted to `<config-dir>/job_idempotency.json`, so it is scoped to one machine. Reusing a key for a *different* component/config exits with `INVALID_ARGUMENT` rather than returning the wrong job; `--force-rerun` ignores the stored entry and always creates a fresh job. For configs with linked `keboola.variables` (root-level `configuration.variables_id`), kbagent auto-resolves a `variableValuesId` so transformations bind to the deployed values row. `--variable-values-id` overrides; `--no-variables` skips resolution. `NO_VARIABLE_ROWS` when the linked variables config has zero rows -- fix via `kbagent config variables-set`. `--mode debug` (since v0.43.6) sets the Queue API job `mode` body field to `"debug"`: the component runs with the same configuration + inputs but the worker redirects output to a Storage File tagged `debug-<jobId>` instead of writing to destination buckets. Use for dry-runs, reproducing a failing job on a production config without touching downstream tables, or harvesting the worker's output bytes (download via `storage file-download --tag debug-<jobId>`) to feed into VCR fixtures or component test cases. Default `--mode run` is unchanged. Invalid values (`--mode anything-else`) exit 2 at the Click choice gate before any wire call. Under `--wait`, polls with an exponential curve (2s x 30 -> 5s x 48 -> 15s); `--poll-strategy fixed` keeps a constant 1s interval. On FAILED/WARNING/TERMINATED, the last `--log-tail-lines` events (default 200, **0 disables -- recommended for automation pipelines**) are attached as `logTail` in the JSON result (or `details.logTail` on errors). If `--timeout` expires, kbagent issues `kill_job` on the remote and exits **7** (`JOB_TIMEOUT_TERMINATED`) with the cancelled `details.job` + `details.logTail`; if the kill itself fails, exits **4** (`QUEUE_JOB_TIMEOUT`, `retryable=true`). Use jq pattern `.error.details.logTail? // .data.logTail? // []` to pick up the tail regardless of exit code.

## job terminate

```
kbagent job terminate --project NAME (--job-id ID [--job-id ...] | --status any|created|waiting|processing [--component-id ID] [--config-id ID] [--branch ID] [--limit N]) [--dry-run] [--yes]
```

kill running Queue API jobs. Use to stop runaway loops or clean up pile-ups from repeated `job run` calls. Two modes: by ID (single/batch) or by filter (`--status any` catches every killable state). Response partitions IDs into `killed / already_finished / not_found / failed`; safe to re-run idempotently. Kill is async -- poll `job detail` for `isFinished=true`.


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
