---
title: Permissions
permalink: /cli/commands/permissions/
---

* TOC
{:toc}

## Permission flags (top-level, session-only)

- `--deny-writes` -- block all write/destructive/admin operations for this single invocation. Merges with any persisted permission policy; never written to config.json. Exit code 6 (PERMISSION_DENIED) on blocked operations
- `--deny-destructive` -- block only destructive operations (delete-table, delete-bucket, terminate-job, etc.) for this invocation. Pure-write ops like create-table stay allowed. Use this when you want to keep build-up capabilities but lock out tear-downs
- `--allow-env-manage-token` -- opt in to reading `KBC_MANAGE_API_TOKEN` from env (default-deny since v0.29.0). Without it the env var is ignored and an interactive hidden prompt is required for `org setup` / `project refresh` / `data-app password`. Closes the AI-exfiltration risk where any subprocess inherits the manage token via env. Session-only; not persisted; no env-var equivalent (intentional, would re-create the hole). REPL forwards this flag to nested invocations the same way it forwards the deny-* flags
- All three flags compose: `kbagent --deny-writes --deny-destructive --allow-env-manage-token ...` is the safest CI-friendly invocation

## Permissions (session firewall commands)

The `permissions` subcommands persist a write/destructive policy to config.json (the `--deny-*` flags above are the one-shot form). The engine guards against agent mistakes; it is not a sandbox.
### permissions list

```
kbagent permissions list [--category read|write|destructive|admin]
```

list all operations with their risk category and current allowed/denied status

### permissions show

```
kbagent permissions show
```

show the current active permission policy

### permissions set

```
kbagent permissions set --mode allow|deny [--allow PATTERN ...] [--deny PATTERN ...]
```

set the permission policy (firewall rules); patterns like `cli:write`, `cli:destructive`, `tool:write`

### permissions reset

```
kbagent permissions reset
```

remove all permission restrictions

### permissions check

```
kbagent permissions check OPERATION
```

check if a specific operation is allowed (e.g. `permissions check storage.delete-table`)


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [permissions workflow](/cli/guides/permissions-workflow/)
