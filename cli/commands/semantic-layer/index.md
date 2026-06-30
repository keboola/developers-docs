---
title: Semantic Layer
permalink: /cli/commands/semantic-layer/
---

* TOC
{:toc}

 
-Reads `KBAGENT_SERVE_URL` + `KBAGENT_SERVE_TOKEN` env vars. The scheduler auto-injects these (plus `KBAGENT_CONFIG_DIR`) into every AI-agent / `cli_command` subprocess. Outside a serve subprocess context the command refuses to run with exit code 2. **Inside a scheduled-agent task, prefer `kbagent http get /openapi.json` then a typed call over forking another `kbagent` CLI -- the HTTP path always sees the operator's live config (not the global `~/.config/keboola-agent-cli/` one).**
Manage Keboola metastore models -- datasets, metrics, relationships, constraints, glossary terms. Metastore URL derived from the stack URL by replacing `connection.` with `metastore.` (cloud/region-agnostic). Auth: same `X-StorageApi-Token` as Storage. Hidden alias: `kbagent sl ...` is equivalent to `kbagent semantic-layer ...`. See [semantic-layer-workflow.md](semantic-layer-workflow.md) for full recipes.
 
## semantic-layer model list

```
kbagent semantic-layer model list --project P
```

list all models in a project. Output: `{models: [{id, name, sql_dialect, description}, ...]}`. Use to disambiguate when `--model` is required and the project has more than one model.

## semantic-layer model create

```
kbagent semantic-layer model create --project P --name N [--description D] [--sql-dialect Snowflake]
```

create a new model. `--sql-dialect` defaults to `Snowflake`. Returns the new model UUID; subsequent commands accept either name or UUID via `--model`.

## semantic-layer model delete

```
kbagent semantic-layer model delete --project P --model M [--yes]
```

delete a model **and cascade-delete every child entity** (datasets, metrics, relationships, constraints, glossary terms) in `reversed(PUSH_ORDER)` (constraints first, datasets last) before the parent. Confirmation prompt unless `--yes`. **Cascade is unconditional in 0.43.4+** -- before that release the call only DELETEd the parent, silently leaking children pointing at the dead `modelUUID` and breaking subsequent `build` / `import` retries with HTTP 422 name collisions (closes #306). On any child-DELETE failure the parent is **preserved** and the response carries `details.cascade = {attempted, deleted, failures: [{type, id, name, error}], parent_deleted: False, model_uuid}` so the user can re-run after fixing the underlying error. Happy-path envelope adds `cascade.deleted` per-type counts. Legacy `orphaned_children` top-level key kept for back-compat (same shape, meaning flipped from "leaked" to "cascaded") but **deprecated -- removal scheduled for a future minor release**; new callers should read `cascade.deleted` instead. See [gotchas.md](gotchas.md) for the meaning-flip + deprecation note.

## semantic-layer show

```
kbagent semantic-layer show --project P [--model M] [--type T]
```

show a model's entities. `--type` filters to `dataset | metric | relationship | constraint | glossary`. Without `--type` prints a per-type count summary. `--model` is optional when the project has exactly one model.

## semantic-layer search-context

```
kbagent semantic-layer search-context --project P [--pattern G ...] [--type model|dataset|metric|relationship|constraint|glossary|all] [--limit N]
```

(since 0.47.0) -- project-wide glob search across semantic-layer entity names. Mirrors the upstream `keboola-mcp-server search_semantic_context` MCP tool so a downstream caller can drop the MCP dependency for the pre-flight "is the model populated?" check. Patterns are case-sensitive `fnmatch`, repeatable (union); default `*`. Default `--type all` searches every CHILD type (`model` searches semantic models). `--limit N` short-circuits both per-type and outer loops. Envelope: `{project, contexts: [{id, type, name, description, attributes}], total_count}`; the `type` field is the CLI-friendly singular (no `semantic-` prefix).

## semantic-layer get-context

```
kbagent semantic-layer get-context --project P --context-id ID
```

(since 0.47.0) -- single-entry fetch by id, irrespective of type. Probes `semantic-model` first then every CHILD type (dataset / metric / relationship / constraint / glossary) until a 200 lands. 404 on any one type is non-terminal; only a full miss raises `NOT_FOUND` (exit 1). Non-404 errors (500, etc.) propagate immediately rather than being swallowed by the next probe.

## semantic-layer validate

```
kbagent semantic-layer validate --project P [--model M] [--deep]
```

structural validation. Basic mode runs local checks: duplicate names, dangling rel/metric refs, SUM-on-PCT (warning), constraint orphans (metrics in `metrics[]` that no longer exist), severity-suffix mismatches between API `severity` and the 4-band name suffix. `--deep` adds parallel Snowflake column-existence probes via the in-process StorageService: phantom dataset fields, phantom column refs in metric SQL, AGG-on-STRING errors. Response: `{valid: bool, deep: bool, errors: [{type, item, detail}], warnings: [...]}`.

## semantic-layer export

```
kbagent semantic-layer export --project P [--model M] [--output PATH]
```

snapshot the model to a self-describing JSON file (default `./sl_export_{model_name}_{YYYYMMDD_HHMMSS}.json`). Schema-versioned for round-trip via `import` / `diff`.

## semantic-layer diff

```
kbagent semantic-layer diff (--project-a A | --file-a P) (--project-b B | --file-b P) [--model-a M] [--model-b M]
```

three-way diff: project<->project, project<->file, file<->file. Mutually exclusive per side: pass exactly one of `--project-a` / `--file-a`, ditto for B. Output groups changes per entity type: `added[] / removed[] / changed[{name, diff_keys[]}]`.

## semantic-layer add metric

```
kbagent semantic-layer add metric --project P [--model M] --name N --sql SQL --dataset TABLE_ID [--description D] [--yes]
```

add a metric. `--dataset` is a Storage tableId (e.g. `out.c-foo.fact_orders`) -- the metric's dataset field stores the tableId, not the dataset name. `--yes` skips the dataset-mismatch confirmation.

## semantic-layer add dataset

```
kbagent semantic-layer add dataset --project P [--model M] --name N --table-id TABLE_ID [--description D] [--grain G] [--primary-key COL ...] [--deep-fields]
```

add a dataset. FQN is auto-derived from `--table-id`. `--primary-key` is repeatable for composite PKs. `--deep-fields` fetches the storage schema and synthesises role-classified `fields[]`: PK_/FK_->`key`, *_DATE/*_DT->`timestamp`, numeric amount/value/rate->`measure`, else `dimension`.

## semantic-layer add relationship

```
kbagent semantic-layer add relationship --project P [--model M] --name N --from TABLE_ID --to TABLE_ID --on EXPR [--type left|inner]
```

add a join relationship. `--type` defaults to `left`.

## semantic-layer add constraint

```
kbagent semantic-layer add constraint --project P [--model M] --name N --constraint-type T --rule "EXPR" --metrics M1,M2 [--severity error|warning|info]
```

add a constraint. `--constraint-type` is the closed enum `inequality|equality|range|composition|exclusion|temporal|conditional`. `--rule` is a **STRING expression** (e.g. `"value >= 0"`), NEVER a `{bounds: {min, max}}` object (sl-builder docs are wrong -- see [gotchas.md](gotchas.md)). `--metrics` is a comma-separated list of metric names that must already exist in the model. `--severity` defaults to `warning`. Name regex `^[a-z][a-z0-9_]*$`; the 4-band health convention lives in the name suffix `_critical / _warning / _healthy / _review`, distinct from the 3-value API `severity`.

## semantic-layer add glossary

```
kbagent semantic-layer add glossary --project P [--model M] --term TERM [--definition D]
```

add a glossary term.

## semantic-layer edit metric

```
kbagent semantic-layer edit metric --project P [--model M] --name N [--new-name N2] [--new-sql SQL] [--new-dataset TABLE_ID] [--new-description D] [--yes]
```

edit a metric. The metastore has NO PATCH endpoint, so this is DELETE+POST. Rename CASCADES through every constraint whose `metrics[]` includes the old name (DELETE old constraint + POST new with updated `metrics[]`). Prints the old/new CODE_METRIC computed via `re.sub(r"[^A-Z0-9]+", "_", name.upper()).strip("_")`. `--yes` skips the confirm prompt. On POST failure the service re-POSTs `original_attrs` and reports rollback success/failure explicitly in the envelope. **Partial-state envelope (since v0.41.10)**: when metric rename succeeds but one or more dependent constraints fail to repoint, the response sets `partial_state: true` and `recovery_hint: "<text>"` at the envelope's top level (was previously buried in `cascaded_constraints[i].status == 'failed'`). Human-mode CLI prints a bright red `PARTIAL STATE` banner above the per-entry list. Recovery recipe: `kbagent semantic-layer validate` to surface the dangling refs, then re-run each failed cascade via `edit constraint --new-metrics ...`.

## semantic-layer edit dataset

```
kbagent semantic-layer edit dataset --project P [--model M] --name N [--new-name N2] [--new-description D] [--new-grain G]
```

edit a dataset. No cascade -- metrics reference the dataset's tableId, not its name.

## semantic-layer edit constraint

```
kbagent semantic-layer edit constraint --project P [--model M] --name N [--new-name N2] [--new-rule "EXPR"] [--new-constraint-type T] [--new-severity error|warning|info] [--new-metrics M1,M2]
```

edit a constraint (DELETE+POST). Local validators enforce the name regex, constraintType enum, severity enum, and that every entry in `--new-metrics` exists in the model.

## semantic-layer edit relationship

```
kbagent semantic-layer edit relationship --project P [--model M] --name N [--new-name N2] [--new-from TABLE_ID] [--new-to TABLE_ID] [--new-on EXPR] [--new-type left|inner]
```

edit a relationship (DELETE+POST). No constraint cascade. Rollback on POST failure.

## semantic-layer edit glossary

```
kbagent semantic-layer edit glossary --project P [--model M] --term TERM [--new-term T2] [--new-definition D]
```

edit a glossary entry (DELETE+POST). `--new-term` is a destructive cascade through any downstream consumer that joins on the term; warns but allows.

## semantic-layer remove metric

```
kbagent semantic-layer remove metric --project P [--model M] --name N [--yes]
```

destructive. Pre-deletion scan lists every constraint whose `metrics[]` includes the target name; warning is ALWAYS printed (even with `--yes`) about the resulting orphan + dangling `DIM_METRIC_THRESHOLD` reference. Non-TTY without `--yes` refuses with exit 2.

## semantic-layer remove dataset

```
kbagent semantic-layer remove dataset --project P [--model M] --name N [--yes]
```

destructive. Confirmation prompt unless `--yes`.

## semantic-layer remove constraint

```
kbagent semantic-layer remove constraint --project P [--model M] --name N [--yes]
```

destructive. Confirmation prompt unless `--yes`.

## semantic-layer remove relationship

```
kbagent semantic-layer remove relationship --project P [--model M] --name N [--yes]
```

destructive. Relationships aren't referenced by other entities; no orphan-check.

## semantic-layer remove glossary

```
kbagent semantic-layer remove glossary --project P [--model M] --term TERM [--yes]
```

destructive. Glossary entries aren't referenced by other entities; no orphan-check.

## semantic-layer import

```
kbagent semantic-layer import --project P --file PATH [--model M] [--types T,T,...] [--dry-run] [--yes] [--overwrite]
```

replay a snapshot. Default: SKIP on conflict (no surprise overwrites). `--overwrite` opts into DELETE+POST for conflicting items. `--types` filters to a subset (`datasets,metrics,relationships,glossary,constraints`). Dependency-ordered push: datasets -> metrics -> relationships -> glossary -> constraints. Response: `imported: {<type>: {created, skipped, overwritten, failed: [{name, reason}]}}`.

## semantic-layer promote

```
kbagent semantic-layer promote --from-project A --to-project B [--from-model M] [--to-model M] [--types T,T,...] [--dry-run] [--yes]
```

cross-project model copy with `modelUUID` rewrite to the target model's UUID. Classifies items NEW / IDENTICAL / CHANGED (deep-equality after stripping `modelUUID` + timestamps). Additive + overwrite only: NEVER deletes target items absent from source. Holds two MetastoreClients in try/finally. Response: per-type counts + `changes[]` with `diff_keys` and `failed[]`.

## semantic-layer build

```
kbagent semantic-layer build --project P [--model M] --tables T,T,... [--name N] [--dry-run] [--keep-on-failure] [--output PATH]
```

non-interactive heuristic builder. **AI caveat**: the existing `ai_client` has no arbitrary-JSON endpoint, so `build` falls back to a deterministic heuristic synthesising one dataset + one COUNT(*) metric + one glossary entry per table (FQN derived; fields[] role-classified). Response carries `fallback_used: "heuristic"`. The push loop walks all 5 child types in dependency order -- this **fixes** the `sl-build` skill bug where `semantic-constraint` was silently dropped. `--model` omitted creates a new model (default name `kbagent_build_model` or `--name N`). **Rollback on push failure (since v0.41.10)**: every successfully-POSTed child is DELETEd in reverse PUSH_ORDER, and the model itself is DELETEd if we created it during this call. The wrapped `KeboolaApiError` carries `details.rollback={attempted, posted_children, deleted, failed_deletes, model_created_here, model_deleted, model_uuid}` so operators get full diagnostics. Pass `--keep-on-failure` to preserve the partial state for forensic inspection (mirrors `data-app create --keep-on-failure`); the wrapped error then carries `details.rollback.attempted=False, reason='keep_on_failure'`.

## semantic-layer token

```
kbagent semantic-layer token --encrypt --project P --component-id C
```

encrypt the project's storage token for a transformation's `user_properties`. Builds `{"#metastore_token": <token>}` from the project's already-stored Storage API token and delegates to the existing EncryptService. `--encrypt` is currently required; other modes are refused with `USAGE_ERROR` (exit 2). Output (human): the raw envelope ready to paste. JSON: full `{encrypted, component_id, project}`.


### Reference data (dimension members, e.g. a Chart of Accounts) (since 0.55.0)

`semantic-reference-data` is a per-dimension member store: ONE record per dimension holding the full member list in a `members[]` array. The driving use case is a Chart of Accounts (the account list + all attributes) held in the metastore instead of a hardcoded Storage table. It is deliberately kept **outside** `build` / `export` / `diff` / cascade / `PUSH_ORDER` — its members come from `DIM_COA`, not from AI generation — so it has its own self-contained CRUD surface. Member field names mirror the `DIM_COA` columns 1:1 (snake_case: `account_code`, `account_name`, `parent_code`, `is_leaf`, `level_1_code`, `cf_category`, …).

## semantic-layer reference-data list

```
kbagent semantic-layer reference-data list --project P [--model M]
```

list dimension records (summaries: `id`, `dimension_name`, `model_uuid`, `dataset_id`, `member_count`). `--model` filters to one model. Members are omitted from the summary; use `get` for them.

## semantic-layer reference-data get

```
kbagent semantic-layer reference-data get --project P (--id ID | --dimension D)
```

fetch one record with all members. Resolve by record UUID (`--id`) or by `--dimension`. The dimension is **unique per project**, so the lookup is project-wide and needs no model. Passing both `--id` and `--dimension` (or neither) is a usage error (exit 2). Returns `{id, dimension_name, model_uuid, dataset_id, member_count, revision, members[]}`.

## semantic-layer reference-data set

```
kbagent semantic-layer reference-data set --project P [--model M] --dimension D --members-file PATH [--dataset-id T] [--description X]
```

create-or-replace. `--members-file` is a JSON array of member objects (`-` reads stdin). **Idempotent** on `dimension`: the lookup is project-wide (the envelope `name` = dimension is unique per project per type), so an existing record is replaced in place via `PUT` (the metastore increments `meta.revision`, preserving history) — distinct from the DELETE+POST used by `edit` — regardless of which `--model` is passed (the resolved model is stored on the record); otherwise a new record is `POST`-ed. Response: `{id, dimension_name, member_count, action: "created"|"updated"}`.

## semantic-layer reference-data delete

```
kbagent semantic-layer reference-data delete --project P --id ID [--yes]
```

delete by UUID (server-side soft-delete; the record stays in revision history). Non-TTY without `--yes` refuses with exit 2.


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [semantic-layer workflow](/cli/guides/semantic-layer-workflow/)
