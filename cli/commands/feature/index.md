---
title: Feature Flags
permalink: /cli/commands/feature/
---

* TOC
{:toc}

Requires a **super-admin** Manage API token (same kind as `org setup`). Same default-deny token policy: interactive hidden prompt by default, or `--allow-env-manage-token` + `KBC_MANAGE_API_TOKEN` for CI. `--project ALIAS` resolves the stack URL (and, for project ops, the numeric `project_id`) from config -- the alias is the only handle you pass.
## feature list

```
kbagent feature list --project ALIAS
```

the stack-wide feature catalogue (`GET /manage/features`). Returns `{alias, stack_url, features: [{name, title, description, type, ...}]}`. Only `name` is a stable identifier; extra fields pass through unmodified.

## feature project-show

```
kbagent feature project-show --project ALIAS
```

features assigned to a project, read from the project object's `features` array. Returns `{alias, project_id, project_name, features: [...]}`.

## feature project-add

```
kbagent feature project-add --project ALIAS --feature NAME [--dry-run] [--yes]
```

enable a feature on a project (`POST /manage/projects/{id}/features`, body `{"feature": NAME}`). Permission class `admin`.

## feature project-remove

```
kbagent feature project-remove --project ALIAS --feature NAME [--dry-run] [--yes]
```

disable a feature on a project (`DELETE /manage/projects/{id}/features/{name}`). Permission class `destructive`.

## feature user-show

```
kbagent feature user-show --project ALIAS --email EMAIL
```

features assigned to a user (`GET /manage/users/{email}`). Returns `{alias, stack_url, email, features: [...]}`.

## feature user-add

```
kbagent feature user-add --project ALIAS --email EMAIL --feature NAME [--dry-run] [--yes]
```

enable a feature on a user (`POST /manage/users/{email}/features`).

## feature user-remove

```
kbagent feature user-remove --project ALIAS --email EMAIL --feature NAME [--dry-run] [--yes]
```

disable a feature on a user (`DELETE /manage/users/{email}/features/{name}`).


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
