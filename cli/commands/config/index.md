---
title: Configurations
permalink: /cli/commands/config/
---

* TOC
{:toc}

## config list

```
kbagent config list [--project NAME] [--component-type TYPE] [--component-id ID] [--branch ID] [--include-rows]
```

list configs across projects (branch-aware). With `--include-rows` each row extends to include the full `configuration` and `rows` body (noticeably larger payload -- use only when the bodies are needed; the summary default covers name/description/component/last_modified/folder)

## config detail

```
kbagent config detail --project NAME [--project ...] --component-id ID [--config-id ID] [--branch ID] [--with-state]
```

**two modes.** **Single** (with `--config-id`): full config dict, shape unchanged from previous releases (callers depending on `.id`, `.configuration`, `.rows` etc. are unaffected). **Bulk** (omit `--config-id`): returns `{"configs": [...], "errors": [...]}` with every configuration of `--component-id` across one or many projects -- each row tagged with `project_alias`/`branch_id`. One HTTP request per project via `list_components_with_configs` (not one per config; a project with 100 Snowflake writers returns in a single round-trip). `--project` is repeatable in bulk mode; `--config-id` with multiple `--project` is rejected (exit 2) because a single config lives in one project. `--with-state` attaches the runtime `state` dict: single-mode triggers an extra `get_config_state` call, bulk-mode adds `include=state` to the listing call (no N+1)

## config search

```
kbagent config search --query PATTERN [--project NAME] [-i] [-r] [--branch ID]
```

search config bodies for string/regex (branch-aware)

## config update

```
kbagent config update --project NAME --component-id ID --config-id ID [--name N] [--description D] [--configuration JSON|@file|-] [--configuration-file PATH] [--set PATH=VALUE ...] [--merge] [--dry-run] [--branch ID] [--allow-plaintext-on-encrypt-failure]
```

update metadata and/or configuration content. **`#`-prefixed secrets auto-encrypt via the Encryption API before write (fail-closed; since 0.54.0, #378)** -- `--allow-plaintext-on-encrypt-failure` overrides, `--dry-run` keeps plaintext in the diff (ciphertext is non-deterministic). Note `--set '#password=...'` sets a *top-level* key; for a nested secret use `--set 'parameters.#password=...'`. `--set` targets a nested key (e.g. `parameters.db.host=new-host`). `--merge` deep-merges into existing config (preserves sibling keys). `--dry-run` previews changes without applying. Paths are relative to the configuration root (unlike MCP's `update_config` which uses paths relative to `parameters`). **Auto-normalize (0.28.0+; #245 / 0.31.0+; #274)**: `parameters.blocks[].codes[].script` is fixed before pushing to Storage API. **String -> array** (0.28.0+; #245): SQL transformations get statement-level split (respects `'...'` / `"..."` / `$$..$$` / `--` / `#` / `//` / `/* ... */`); Python / R / `kds-team.app-custom-python` get `[script]` wrap. **List-element re-split** (0.31.0+; #274): when `script` is already a list but an element packs multiple `;`-separated statements, each SQL element is re-run through `split_statements()` and replaced inline. Closes the ODBC `Actual statement count N did not match the desired statement count 1` (SQL state 0A000) runtime crash that survives the 0.28.0 string fix. The result envelope's `normalizations: [{path, action: "sql_split"|"wrap_array"|"sql_resplit", before_type, after_type, after_length, before_length?}]` records every change (empty when nothing was malformed; `sql_resplit` adds `before_length` and a `[E]` suffix on `path` pointing at the original element index). Bypassing kbagent (raw REST, MCP `update_sql_transformation` / `create_sql_transformation`) does NOT inherit either pass -- prefer `kbagent config update` for SQL transformation body changes.

## config set-default-bucket

```
kbagent config set-default-bucket --project NAME --component-id ID --config-id ID (--bucket BUCKET_ID | --clear) [--dry-run] [--branch ID]
```

set or clear `configuration.storage.output.default_bucket` on a configuration. Discoverable shortcut for the raw-mode workaround at https://keboola.atlassian.net/wiki/spaces/SUP/pages/3770155030/. Read-modify-write that preserves sibling keys; returns `{"changed": false}` when the value already matches the requested state. Honored by output tables that don't pin their own `destination`.

## config rename

```
kbagent config rename --project NAME --component-id ID --config-id ID --name "New Name" [--branch ID] [--directory DIR]
```

rename a configuration (API update + local sync directory rename with git mv support)

## config delete

```
kbagent config delete --project NAME --component-id ID --config-id ID [--branch ID]
```

delete a configuration

## config new

```
kbagent config new --component-id ID [--project NAME] [--name NAME] [--output-dir DIR] [--push --no-files --description D --configuration JSON|@file|- --configuration-file PATH --no-validate --branch ID --dry-run --allow-plaintext-on-encrypt-failure]
```

**two modes**. **Default (no `--push`)**: scaffold new config from component schema; writes files to `--output-dir` or prints to stdout. **Zero API calls.** **With `--push`** (0.33.0+, requires `--project` + non-empty `--name`): also POSTs to `/v2/storage/components/{cid}/configs` for a one-shot remote create. `#`-prefixed secrets in the pushed body auto-encrypt via the Encryption API first (fail-closed; since 0.54.0, #378; `--allow-plaintext-on-encrypt-failure` overrides). `--no-files` skips the filesystem step entirely (FIIA-style empty-shell pattern). `--configuration` / `--configuration-file` override the POSTed body (default is `{}`, with validation auto-skipped for the default empty shell). `--dry-run` previews the planned POST + validation result without creating. Schema validation runs by default when an explicit body is given (fail-closed: `ConfigError` exit 5 on mismatch) but skips silently if the AI Service has no schema for the component or returns an error; `--no-validate` opts out. Works for ALL component types including `keboola.snowflake-transformation` (unlike `tool call create_config`, which refuses that component).

## config variables-set

```
kbagent config variables-set --project NAME --component-id ID --config-id ID --var KEY=VALUE [--var ...] [--replace] [--variables-id ID] [--values-id ID] [--branch ID] [--dry-run] [--allow-plaintext-on-encrypt-failure] [--yes]
```

attach variable values to a config. Auto-creates a sibling `keboola.variables` config + default row on first use and links it via the parent's `runtime.variables_id` / `variables_values_id`. Defaults to merge; `--replace` drops keys not in `--var`. `#`-prefixed values encrypt via the Encryption API (fail-closed; exit non-zero on `ENCRYPTION_FAILED`). See `variables-workflow.md`

## config variables-get

```
kbagent config variables-get --project NAME --component-id ID --config-id ID [--branch ID]
```

resolve `variables_id` + `values_id` from the parent config and fetch the current KEY=VALUE map. Returns `{linked: bool, variables_id, values_id, values}`; `linked=false` means the parent has no variables attached

## config variables-clear

```
kbagent config variables-clear --project NAME --component-id ID --config-id ID [--branch ID] [--yes]
```

unlink variables from the parent config (strips `variables_id` + `variables_values_id`). **Does NOT delete** the backing `keboola.variables` config -- use `config delete` explicitly if you've verified nothing else references it

## config metadata-list

```
kbagent config metadata-list --project NAME --component-id ID --config-id ID [--branch ID]
```

list all metadata entries on a configuration (id, key, value, provider, timestamp). Branch-aware

## config get-metadata

```
kbagent config get-metadata --project NAME --component-id ID --config-id ID --key KEY [--branch ID]
```

read a single metadata value by key. Exits with `NOT_FOUND` (exit 1) if absent

## config set-metadata

```
kbagent config set-metadata --project NAME --component-id ID --config-id ID --key KEY --value VALUE [--branch ID]
```

set (upsert) a metadata key/value on a configuration. Common keys: `KBC.configuration.folderName`, plus any custom `KBC.*` agent-facing tags

## config delete-metadata

```
kbagent config delete-metadata --project NAME --component-id ID --config-id ID --metadata-id ID [--branch ID] [--yes]
```

delete a configuration metadata entry by its numeric ID (from `metadata-list`)

## config set-folder

```
kbagent config set-folder --project NAME --component-id ID --config-id ID --name FOLDER [--branch ID]
```

set (or clear, with empty `--name`) the `KBC.configuration.folderName` metadata, which groups configs into named folders in the Keboola UI. See `config-metadata-workflow.md`

## config row-create

```
kbagent config row-create --project NAME --component-id ID --config-id ID --name ROW_NAME [--description D] [--configuration JSON|@file|-] [--is-disabled] [--branch ID] [--allow-plaintext-on-encrypt-failure]
```

create a new configuration row. Returns the full row dict with `id`, `name`, `version`. Optional `--configuration` accepts JSON inline, `@file`, or stdin (`-`). `#`-prefixed secrets auto-encrypt before write (fail-closed; since 0.54.0, #378).

## config row-update

```
kbagent config row-update --project NAME --component-id ID --config-id ID --row-id ID [--name N] [--description D] [--configuration JSON|@file|-] [--is-disabled | --is-enabled] [--branch ID] [--allow-plaintext-on-encrypt-failure]
```

update an existing configuration row. Pass only the fields you want to change; omitted fields are preserved. `--is-disabled` / `--is-enabled` toggle the row's enabled state. `#`-prefixed secrets auto-encrypt before write (fail-closed; since 0.54.0, #378).

## config row-delete

```
kbagent config row-delete --project NAME --component-id ID --config-id ID --row-id ID [--branch ID] [--yes]
```

delete a configuration row. Destructive (gated behind `--allow-destructive`). Branch-aware. Without `--yes` and outside `--json` mode, prompts for interactive confirmation; `--json` mode auto-skips the prompt.

## config oauth-url

```
kbagent config oauth-url --project NAME --component-id ID --config-id ID [--redirect-url URL]
```

return the OAuth authorization URL for a component that uses OAuth authentication. **Requires a master Storage API token** (canManageTokens privilege) -- non-master tokens fail with `MISSING_MASTER_TOKEN` exit 3 on a fail-fast pre-flight check before any HTTP write happens. Open the URL in a browser to complete the OAuth flow.


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [config workflow](/cli/guides/config-metadata-workflow/)
