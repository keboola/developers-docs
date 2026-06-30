---
title: Projects & Members
permalink: /cli/commands/project/
---

* TOC
{:toc}

## Project Management

### project add

```
kbagent project add --project NAME --url URL --token TOKEN
```

connect a project (token verified via API)

### project list

```
kbagent project list
```

list all connected projects (tokens masked)

### project remove

```
kbagent project remove --project NAME
```

disconnect a project

### project edit

```
kbagent project edit --project NAME [--url URL] [--token TOKEN] [--new-alias NEW] [--dry-run]
```

update connection details and/or rename the alias. `--new-alias` cascades through config.json (`projects` key + `default_project` if matched) and the nested sync directory `<cwd>/<old-alias>/` when present (-2 collision suffix, git-mv with shutil fallback). Lineage cache rebuild is manual (see gotchas, since v0.31.0). Combined with `--url` / `--token` in one call, those mutations target the new alias post-rename. `--dry-run` previews everything (collision check, planned disk-rename method, lineage-cache warning) without mutating state -- same exit codes as live for validation errors

### project status

```
kbagent project status [--project NAME]
```

test connectivity and response time

### project description-get

```
kbagent project description-get --project NAME
```

read the dashboard project description (KBC.projectDescription on the default branch). Returns `{"description": ""}` if not set, not an error

### project description-set

```
kbagent project description-set --project NAME [--text STR | --file PATH | --stdin]
```

set the dashboard project description (markdown). Pass exactly one of `--text`, `--file`, or `--stdin`. Writes to `KBC.projectDescription` on the default branch -- always the main branch, regardless of any active dev branch

### project use

```
kbagent project use ALIAS
```

pin `ALIAS` as the persistent default project. Stored as `default_project` in config.json. Overridden at runtime by `KBAGENT_PROJECT=ALIAS` (env, beats pin) and by `--project ALIAS` (CLI flag, beats both)

### project current

```
kbagent project current
```

print the effective default project and its source (`env` / `pin` / `none`). Reports both the env override AND the persisted pin so misconfigurations are visible. Returns `{"alias": null, "source": "none"}` when neither is set

### project info

```
kbagent project info --project NAME
```

show detailed project metadata

## Project Members & Invitations (since v0.29.0)

All seven commands authenticate via `KBC_MANAGE_API_TOKEN` (Manage API), not the project's Storage token. Allowed roles are exactly `admin`, `guest`, `readOnly`, `share` -- the API self-reports this list in its 400 validation error and `constants.PROJECT_ROLES` mirrors it.

### project invite

```
kbagent project invite --project ALIAS --email EMAIL --role admin|guest|readOnly|share [--reason TEXT] [--dry-run]
```

single-shot invitation. Returns `{"status": "ok", "invitation_id": ..., ...}`. Re-inviting an already-invited or already-member email returns `{"status": "noop", "note": "already_invited" | "already_member"}` (HTTP 400 from the Manage API, normalised to a no-op).

### project invite

```
kbagent project invite --from-csv FILE [--default-role ROLE] [--workers N] [--dry-run]
```

bulk invitation. CSV header required; columns: `email`, `project` (alias) or `project_id` (numeric), `role` (optional with `--default-role`), `reason` (optional). Parallelised via `ThreadPoolExecutor` (default 8 workers). Single-stack-URL invariant per file: rows referencing different stacks raise `ConfigError` upfront. Result is `{"total","succeeded","noop","failed","rows":[...]}`; `rows[]` order is *not deterministic*. Exit 0 even with `failed > 0` -- inspect the JSON.

### project member-list

```
kbagent project member-list --project ALIAS [--include-pending]
```

list active members. Each member dict carries `id`, `email`, `name`, `role`, `status`, `mfa_enabled`. With `--include-pending`, the response also includes `pending_invitations: [...]`.

### project invitation-list

```
kbagent project invitation-list --project ALIAS
```

list pending (unaccepted) invitations only.

### project invitation-cancel

```
kbagent project invitation-cancel --project ALIAS --email EMAIL [--invitation-id ID] [--yes]
```

cancel a pending invitation. Without `--invitation-id`, the service resolves it by listing pending invitations and matching `--email` (case-insensitive). 204 No Content on success; `KeboolaApiError(NOT_FOUND)` if the email has no pending invitation.

### project member-remove

```
kbagent project member-remove --project ALIAS --email EMAIL [--yes]
```

destructive: remove an active member. The service resolves `--email` to the numeric `user_id` (case-insensitive) and DELETEs `/manage/projects/{id}/users/{userId}`. Re-add the user via `project invite`.

### project member-set-role

```
kbagent project member-set-role --project ALIAS --email EMAIL --role admin|guest|readOnly|share
```

change an existing member's role. Uses **PATCH** `/manage/projects/{id}/users/{userId}` with `{"role": "..."}`. PUT does *not* work on this endpoint -- pre-v0.29.0 implementations that tried PUT got a misleading 404.


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [project workflow](/cli/guides/member-workflow/)
