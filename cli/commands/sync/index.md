---
title: Sync (GitOps)
permalink: /cli/commands/sync/
---

* TOC
{:toc}

## sync init

```
kbagent sync init --project ALIAS [--directory DIR] [--git-branching] [--adopt-existing]
```

initialize sync working directory; `--adopt-existing` (since v0.22.0) adopts a `.keboola/manifest.json` already written by the kbc Go CLI without overwriting (idempotent; validates `project_id` against the alias token)

## sync pull

```
kbagent sync pull --project ALIAS [--all-projects] [--force] [--dry-run] [--with-samples] [--no-storage] [--no-jobs] [--job-limit N] [--branch ID]
```

download configs to local files. For large projects (>100 configs), automatically fetches jobs per-config when the grouped API limit is insufficient. `--force` is conflict-aware (since 0.53.0): a locally-modified config whose remote is unchanged is **preserved** (pending delta stays pushable, never silently re-stamped); a true merge conflict (local AND remote both changed since last pull) **aborts** the pull (exit 1, `SYNC_CONFLICT`; `--json` lists `details.conflicts`); local-untouched + remote-changed takes remote. To discard local edits on purpose, delete the file/dir and pull. `--branch` (0.47.0+) per-invocation dev-branch override, beats every other branch source.

## sync push

```
kbagent sync push --project ALIAS [--all-projects] [--dry-run] [--force] [--allow-plaintext-on-encrypt-failure] [--branch ID] [--no-name-drift-warnings]
```

push local changes (auto-encrypts secrets, fails if encryption fails). Fresh-CREATE writeback updates placeholder manifest entries in place (since 0.47.0) and propagates any `KBC.configuration.*` metadata via `set_config_metadata`. Fresh-CREATE variable binding (since 0.47.2): when a `keboola.variables` config + its values row are created alongside a transformation in the same push, the transformation's `variables_id` / `variables_values_id` placeholders are rebound to the assigned ULIDs and the row's `values` are hoisted even without a `_keboola` block, so `job run` succeeds with no post-push `config variables-set` step (unresolvable/ambiguous links surface a `variable_link` entry in `errors[]`, never a broken link). `--branch` (0.47.0+) per-invocation override; when no `<branch_name>/` subtree exists on disk (since 0.47.2) the local default tree (`main/`) is promoted to the target branch (API writes still target the branch id); `--no-name-drift-warnings` (0.47.0+) drops the cosmetic warnings array.

## sync clone

```
kbagent sync clone --source DIR --target ALIAS --target-dir DIR [--bucket-map FILE] [--variable-values FILE] [--instance-rename FILE] [--dry-run] [--branch ID]
```

clone a reference synced project into a **fresh** target project and parameterize it (since v0.63.0). Copies the reference tree at `--source` into `--target-dir`, applies declarative overrides from JSON/YAML files (`--bucket-map` `{old_bucket_id: new_bucket_id}` rewrites storage input/output table refs; `--variable-values` `{var_name: value}` overrides `keboola.variables` rows; `--instance-rename` `{old_path_prefix: new_path_prefix}` renames config dirs + manifest paths), re-points the manifest at the target project, and pushes. Because the reference's config ids do not exist in the fresh target, every config is CREATEd fresh and **keboola.flow task `configId`s + transformation variable links are remapped reference->ULID** by push Phase C/D (the push result carries `flow_task_remaps`). **Idempotent**: re-running with an existing `--target-dir` skips copy/overrides and just pushes, reporting `no_changes` / `created: 0`. Fails fast (`CONFIG_ERROR`) if the target already contains the reference's configs -- clone requires a fresh/empty target. `SyncService.clone_project(...)` returns a typed `CloneResult` for in-process SDK callers.

## sync diff

```
kbagent sync diff --project ALIAS [--all-projects] [--branch ID]
```

3-way diff (local vs base vs remote), detects conflicts. `--branch` (0.47.0+) per-invocation dev-branch override.

## sync status

```
kbagent sync status [--directory DIR]
```

show locally modified/added/deleted configs. Also surfaces `plaintext_secret_warnings` (since 0.55.0): in-sync configs/rows whose `#`-secrets are still plaintext on the remote (a leftover from pre-0.54.0 writes; #378). Pending (un-pushed) edits are not flagged. Fix = re-push on >=0.54.0 + rotate (version history keeps the plaintext).

## sync branch-link

```
kbagent sync branch-link --project ALIAS [--branch-id ID] [--branch-name NAME]
```

link git branch to Keboola dev branch

## sync branch-unlink

```
kbagent sync branch-unlink [--directory DIR]
```

remove git-to-Keboola branch mapping

## sync branch-status

```
kbagent sync branch-status [--directory DIR]
```

show current branch mapping


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [sync workflow](/cli/guides/sync-workflow/)
