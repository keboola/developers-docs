---
title: Storage
permalink: /cli/commands/storage/
---

* TOC
{:toc}

## Storage

### storage buckets

```
kbagent storage buckets [--project NAME] [--branch ID]
```

list buckets with sharing/linked info (branch-aware)

### storage bucket-detail

```
kbagent storage bucket-detail --project NAME --bucket-id ID [--branch ID]
```

bucket detail with backend-native direct-access paths (branch-aware). Output adapts to backend: Snowflake -> `snowflake_database` / `snowflake_schema` / per-table `snowflake_path` quoted with `"..."`. BigQuery -> `bigquery_dataset` (and `bigquery_project` when surfaced via API `databaseName`) / per-table `bigquery_path` quoted with backticks. Always-present backend-agnostic keys: `sql_dialect` (`"snowflake"` / `"bigquery"`) and per-table `sql_path` -- prefer these in agent code instead of branching on backend yourself

### storage tables

```
kbagent storage tables [--project NAME ...] [--bucket-id ID] [--branch ID]
```

list tables across all connected projects in parallel (multi-project by default, same as `storage buckets`); repeat `--project` to target a subset; `--bucket-id` is applied independently per project (missing buckets become per-project errors); `--branch` requires exactly one `--project`

### storage table-detail

```
kbagent storage table-detail --project NAME --table-id ID [--branch ID]
```

table detail with columns, types, primary key, row count (branch-aware)

### storage create-bucket

```
kbagent storage create-bucket --project NAME --stage STAGE --name NAME [--description D] [--backend B] [--branch ID]
```

create bucket (branch-aware). With `--branch ID` on a project lacking the `storage-branches` feature (legacy fake-branch), response carries `legacy_branch_storage: true` and human mode prints a warning -- the runner will create a parallel `out.c-<branch_id>-*` bucket at job time. See `storage-types-workflow.md`

### storage create-table

```
kbagent storage create-table --project NAME --bucket-id ID --name NAME --column col:TYPE[(length)] [...] [--primary-key COL] [--not-null COL ...] [--default NAME=VALUE ...] [--branch ID] [--if-not-exists]
```

create typed table. Base types `STRING/INTEGER/NUMERIC/FLOAT/BOOLEAN/DATE/TIMESTAMP` plus native backend types with length (`VARCHAR(40)`, `NUMBER(18,2)`, `TIMESTAMP_TZ`, `VARIANT`, etc.) -- type/length validation delegated to the Storage API. `--not-null` marks a column `nullable=false`; `--default NAME=VALUE` sets a DEFAULT expression (booleans must be lowercase `true`/`false`). In a dev branch, the target bucket is auto-materialized if it has not yet been written to there -- response surfaces this via `auto_created_bucket: bool`. On legacy fake-branch projects (no `storage-branches` feature), `legacy_branch_storage: true` flags that the runner will use a separate `out.c-<branch_id>-*` bucket at job time. `--if-not-exists` (0.47.0+) turns a duplicate-display-name failure into `action: skipped` when the table really exists at the expected id (safe for parallel workers). Since 0.47.1 the skipped envelope reports the EXISTING table's actual `columns`/`primary_key`/`name`, mirrors the request under `requested_columns`/`requested_primary_key`, and sets `schema_drift: true` when they diverge. See `storage-types-workflow.md`

### storage upload-table

```
kbagent storage upload-table --project NAME --table-id ID --file PATH [--incremental] [--branch ID]
```

upload CSV (branch-aware)

### storage download-table

```
kbagent storage download-table --project NAME --table-id ID [--output FILE] [--columns COL ...] [--limit N] [--where-column COL --where-value VAL ... [--where-operator eq|neq]] [--changed-since WHEN] [--changed-until WHEN] [--branch ID]
```

export table to CSV (branch-aware). `--where-column` + `--where-value` (repeatable, OR within the set) + `--where-operator eq|neq` filter rows server-side; `--changed-since`/`--changed-until` (unix ts or strtotime like `-2 days`) filter by import time -- the credential-only, no-workspace way to pull a filtered/incremental slice (0.62.0+)

### storage add-column

```
kbagent storage add-column --project NAME --table-id ID --column COL:TYPE[(length)] [--not-null] [--default VALUE] [--branch ID]
```

add a single column to an existing table (0.62.0+). Same `name:TYPE(length)` grammar as `create-table --column`; a bare `name` adds an untyped STRING column. Synchronous endpoint (no job to wait on). `--not-null` needs an empty table or a `--default`. Mirror of `delete-column`

### storage delete-table

```
kbagent storage delete-table --project NAME --table-id ID [--table-id ...] [--force] [--dry-run] [--yes] [--branch ID]
```

delete tables, --force cascade-deletes aliased tables (branch-aware)

### storage truncate-table

```
kbagent storage truncate-table --project NAME --table-id ID [--table-id ...] [--dry-run] [--yes] [--branch ID]
```

(since v0.32.0) -- delete all rows while preserving table schema, primary key, descriptions, sharing edges, and downstream dependents. Batch via repeated `--table-id`. Endpoint is uniformly async-via-job on every branch (returns a queued `tableRowsDelete` job; client polls via `_wait_for_storage_job` before returning). Idempotent (truncating an empty table is a no-op). Use when re-seeding a table without losing the schema contract

### storage delete-column

```
kbagent storage delete-column --project NAME --table-id ID --column COL [--column ...] [--force] [--dry-run] [--yes] [--branch ID]
```

delete columns from a table (branch-aware)

### storage delete-bucket

```
kbagent storage delete-bucket --project NAME --bucket-id ID [--bucket-id ...] [--force] [--dry-run] [--yes] [--branch ID]
```

delete buckets (branch-aware)

### storage swap-tables

```
kbagent storage swap-tables --project NAME --table-id ID --target-table-id ID --branch ID [--dry-run] [--yes]
```

(since v0.28.0) -- swap two storage tables in any branch, including the default/production branch (POST `/tables/{id}/swap`). Both tables exchange physical positions; aliases are NOT transferred (they keep pointing at the same physical position and therefore expose the OTHER table's data after the swap). Service refuses without a branch (active branch via `branch use` works too). Use to flip a typed rebuild ("data_change_log") into the original name ("data") without touching downstream config references

### storage clone-table

```
kbagent storage clone-table --project NAME --table-id ID --branch ID [--dry-run]
```

(since v0.52.0) -- pull (clone) a production table into a dev branch (POST `/tables/{id}/pull`, operationName `devBranchTablePull`). On `storage-branches` projects a dev branch reads prod tables transparently until the first write, so an in-branch schema mutation (`swap-tables`, dropping a column) fails with a misleading "bucket not found" until the table is materialized branch-local; `clone-table` does that. One-way (default -> branch). Service refuses without a branch (active branch via `branch use` works too). Permission class `write`

### storage describe-bucket

```
kbagent storage describe-bucket --project NAME --bucket-id ID [--text STR | --file PATH | --stdin] [--branch ID]
```

set a bucket description (stored as `KBC.description` in bucket metadata, upsert). Provide exactly one of `--text`, `--file`, `--stdin`. Read back via `storage bucket-detail`

### storage describe-table

```
kbagent storage describe-table --project NAME --table-id ID [--text STR | --file PATH | --stdin] [--branch ID]
```

set a table description (stored as `KBC.description` in table metadata, upsert). Provide exactly one of `--text`, `--file`, `--stdin`. Read back via `storage table-detail`

### storage describe-column

```
kbagent storage describe-column --project NAME --table-id ID --column NAME=DESCRIPTION [--column ...] [--branch ID]
```

set one or more column descriptions. Stored as `KBC.column.{name}.description` keys in the table's metadata (Keboola has no user-writable column-metadata endpoint). Read back in `storage table-detail` under `column_details[].description`

### storage describe-batch

```
kbagent storage describe-batch --project NAME --from-file PATH [--branch ID]
```

apply bucket/table/column descriptions from a YAML file (top-level `buckets`, `tables`, `columns` sections, all optional). Partial-failure tolerant: per-item errors are collected and reported, the batch does not abort. Non-zero exit only when at least one item failed

## Storage Files

### storage files

```
kbagent storage files --project NAME [--tag TAG ...] [--limit N] [--offset N] [--query Q] [--branch ID]
```

list Storage Files, optionally filtered by tag/query

### storage file-detail

```
kbagent storage file-detail --project NAME --file-id ID
```

file metadata (size, tags, sliced, provider)

### storage file-upload

```
kbagent storage file-upload --project NAME --file PATH [--name NAME] [--tag TAG ...] [--permanent] [--branch ID]
```

upload a file to Storage

### storage file-download

```
kbagent storage file-download --project NAME [--file-id ID | --tag TAG ...] [--output FILE|DIR]
```

download a Storage File. Auto-detects sliced `.parquet` files and writes per-slice into a directory (never concatenates -- parquet slices have their own footers)

### storage file-tag

```
kbagent storage file-tag --project NAME --file-id ID [--add TAG ...] [--remove TAG ...]
```

add/remove tags on a file

### storage file-delete

```
kbagent storage file-delete --project NAME --file-id ID [--file-id ...] [--dry-run] [--yes]
```

delete Storage Files

### storage load-file

```
kbagent storage load-file --project NAME --file-id ID --table-id ID [--incremental] [--delimiter D] [--enclosure E] [--branch ID]
```

import a Storage File into a table (CSV)

### storage unload-table

```
kbagent storage unload-table --project NAME --table-id ID [--columns COL ...] [--limit N] [--tag TAG ...] [--download] [--output FILE|DIR] [--file-type csv|parquet] [--branch ID]
```

export a table to a Storage File. `--file-type parquet` produces sliced Parquet; `--download` saves each slice as its own file under `./{project}/{table_id}.parquet/` (default) together with `_manifest.json`


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [storage workflow](/cli/guides/storage-types-workflow/)
