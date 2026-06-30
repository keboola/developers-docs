---
title: "Reading Synced Data -- Guide for AI Agents"
permalink: /cli/guides/reading-synced-data/
---

* TOC
{:toc}

{% raw %}
After `kbagent sync pull`, the local directory contains everything you need
to understand a Keboola project: configs, storage schema, job history, and
optionally data samples.

## Directory structure

```
project-alias/
  .keboola/manifest.json              # internal tracking (don't parse this)
  main/                               # branch directory
    extractor/
      keboola.ex-db-mysql/
        my-config/
          _config.yml                  # config parameters (YAML)
          _description.md              # human description
          _jobs.jsonl                  # recent jobs for this config
          rows/
            row-name/
              _config.yml
    transformation/
      keboola.snowflake-transformation/
        daily-etl/
          _config.yml
          _description.md
          _jobs.jsonl
          transform.sql                # SQL code with block markers
          code/                        # individual SQL files per block
  storage/
    buckets.json                       # all buckets
    tables/
      in-c-main/                       # bucket ID (dots replaced with dashes)
        users.json                     # table schema + metadata
        orders.json
    samples/                           # only with --with-samples
      in-c-main/
        users/
          sample.csv                   # CSV data preview (max 100 rows)
```

## Reading _jobs.jsonl (per-config job history)

Each line is a standalone JSON object. Most recent job first.

```jsonl
{"id":"1299889107","status":"success","start_time":"2026-03-25T08:01:44Z","end_time":"2026-03-25T08:03:41Z","duration_seconds":117}
{"id":"1299857083","status":"error","start_time":"2026-03-24T08:01:32Z","end_time":"2026-03-24T08:02:01Z","duration_seconds":11,"error_message":"Table not found"}
{"id":"1299718646","status":"success","start_time":"2026-03-23T08:01:50Z","end_time":"2026-03-23T08:03:15Z","duration_seconds":85}
```

### Fields

| Field | Always present | Description |
|-------|---------------|-------------|
| `id` | yes | Job ID |
| `status` | yes | `success`, `error`, `warning`, `terminated`, `cancelled` |
| `start_time` | yes | ISO 8601 timestamp |
| `end_time` | yes | ISO 8601 timestamp |
| `duration_seconds` | yes | Wall clock duration |
| `error_message` | only on error/warning | What went wrong |
| `mode` | only if not "run" | e.g. `debug` |

### Python: find failing configs

```python
import json
from pathlib import Path

project_root = Path("my-project/main")

for jobs_file in project_root.rglob("_jobs.jsonl"):
    config_dir = jobs_file.parent
    jobs = [json.loads(line) for line in jobs_file.read_text().splitlines() if line.strip()]

    # Check if most recent job failed
    if jobs and jobs[0]["status"] == "error":
        print(f"FAILING: {config_dir.relative_to(project_root)}")
        print(f"  Error: {jobs[0].get('error_message', 'unknown')}")
        print(f"  Since: {jobs[0]['start_time']}")

    # Check for repeated failures (all recent jobs failed)
    if jobs and all(j["status"] == "error" for j in jobs):
        print(f"BROKEN: {config_dir.relative_to(project_root)} ({len(jobs)} failures in a row)")
```

### Python: job success rate per config

```python
import json
from pathlib import Path

for jobs_file in Path("my-project/main").rglob("_jobs.jsonl"):
    jobs = [json.loads(line) for line in jobs_file.read_text().splitlines() if line.strip()]
    if not jobs:
        continue
    success = sum(1 for j in jobs if j["status"] == "success")
    total = len(jobs)
    rate = success / total * 100
    name = jobs_file.parent.relative_to("my-project/main")
    print(f"{name}: {rate:.0f}% success ({success}/{total})")
```

## Reading storage metadata

### buckets.json

```python
import json

buckets = json.loads(Path("my-project/storage/buckets.json").read_text())
for b in buckets:
    print(f"{b['id']}: {b['tables_count']} tables, {b['data_size_bytes'] / 1e6:.1f} MB")
```

Fields: `id`, `name`, `stage` (in/out), `description`, `tables_count`, `data_size_bytes`, `metadata`.

### Table metadata (storage/tables/{bucket}/{table}.json)

```python
import json
from pathlib import Path

for table_file in Path("my-project/storage/tables").rglob("*.json"):
    t = json.loads(table_file.read_text())
    print(f"{t['id']}: {t['rows_count']} rows, {len(t['columns'])} columns")
    print(f"  Primary key: {t['primary_key']}")
    print(f"  Last import: {t['last_import_date']}")
    # Column list
    for col in t["columns"][:5]:
        print(f"    - {col}")
    if len(t["columns"]) > 5:
        print(f"    ... and {len(t['columns']) - 5} more")
```

Fields: `id`, `name`, `primary_key` (list), `columns` (list), `rows_count`,
`data_size_bytes`, `last_import_date`, `last_change_date`, `description`,
`metadata` (list), `column_metadata` (dict).

### Python: find largest tables

```python
import json
from pathlib import Path

tables = []
for f in Path("my-project/storage/tables").rglob("*.json"):
    t = json.loads(f.read_text())
    tables.append(t)

for t in sorted(tables, key=lambda x: x["rows_count"], reverse=True)[:10]:
    mb = t["data_size_bytes"] / 1e6
    print(f"{t['id']}: {t['rows_count']:,} rows ({mb:.1f} MB)")
```

## Reading _config.yml

YAML format with promoted fields from the API JSON.

```python
import yaml
from pathlib import Path

config = yaml.safe_load(Path("my-project/main/extractor/.../my-config/_config.yml").read_text())

print(f"Name: {config.get('name')}")
print(f"Description: {config.get('description', '')}")

# Parameters (component-specific settings)
params = config.get("parameters", {})

# Input/output table mappings
input_tables = config.get("input", {}).get("tables", [])
output_tables = config.get("output", {}).get("tables", [])

# Keboola metadata (component ID, config ID)
kbc = config.get("_keboola", {})
print(f"Component: {kbc.get('component_id')}, Config ID: {kbc.get('config_id')}")
```

## Reading data samples

Samples are standard CSV files. Tables with >30 columns are auto-trimmed
to the first 30 columns. Encrypted columns (names starting with `#`) have
values replaced with `***ENCRYPTED***`.

```python
import csv
from pathlib import Path

sample_file = Path("my-project/storage/samples/in-c-main/users/sample.csv")
with open(sample_file) as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)
```

## Common agent tasks

### Task: understand a project quickly

```bash
# 1. Pull everything
kbagent sync pull --project prod --with-samples

# 2. Read these files in order:
#    storage/buckets.json          -> what data exists
#    storage/tables/*/             -> table schemas
#    main/transformation/*/        -> what transformations run
#    main/*/.../_jobs.jsonl        -> what's healthy vs broken
```

### Task: debug a failing transformation

```bash
# 1. Find the failing config
#    Read _jobs.jsonl files to find error_message

# 2. Read the transformation
#    _config.yml for input/output table mappings
#    transform.sql or transform.py for the code

# 3. Check input table schemas
#    storage/tables/{bucket}/{table}.json for column names and types

# 4. Optionally, look at sample data
#    storage/samples/{bucket}/{table}/sample.csv
```

### Task: audit all configs across projects

```bash
# Pull all projects
kbagent sync pull --all-projects

# Then walk the directory tree:
# project-a/main/extractor/.../_config.yml
# project-a/main/transformation/.../_config.yml
# project-b/main/extractor/.../_config.yml
# ...
```
{% endraw %}
