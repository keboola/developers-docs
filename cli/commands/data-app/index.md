---
title: Data Apps
permalink: /cli/commands/data-app/
---

* TOC
{:toc}

Lifecycle for `keboola.data-apps`. Combines Storage API (config body, git block, encrypted secrets, runtime size) with Data Science API (`/apps` -- deployment record, state, URL, configVersion). The CLI encapsulates the §9 redeploy contract so callers cannot pin to the empty-shell v2; see `data-app-workflow.md` for the gotcha inventory and recipes. Since v0.33.0 the JSON output envelope's data-app id key is `app_id` (renamed from bare `id` for symmetry with the `--app-id` input flag); `config_id` is unchanged.
## data-app list

```
kbagent data-app list [--project NAME ...] [--branch ID]
```

list data apps across projects (Data Science index merged with Storage names). Since v0.43.9 filters out workspace/sandbox deployments (`componentId=keboola.sandboxes`, `type=snowflake`/`bigquery`) that the Data Science `/apps` collection also returns, so the listing matches the Apps UI. Envelope carries `component_id` per app.

## data-app detail

```
kbagent data-app detail --project NAME --app-id ID [--branch ID]
```

merged view (state, desired, url, configVersion, slug, git block with PAT redacted)

## data-app create

```
kbagent data-app create --project ALIAS --name NAME --slug SLUG (--git-repo URL | --use-managed-git-repo) [--git-public/--no-git-public] [--git-username USER] [--git-pat-env VAR | --git-pat-file PATH | --git-pat-encrypted KBC::Project...] [--auth password|public] [--size tiny|small|medium|large] [--auto-suspend SECONDS] [--type python-js|python|streamlit|r|...] [--branch ID] [--no-deploy] [--wait] [--timeout SECONDS] [--keep-on-failure] [--dry-run]
```

POST shell + encrypt PAT + PUT Storage config (with auto-injected `parameters.id`) + PATCH deploy with the §9 trio. Cleanup-in-finally on failure unless `--keep-on-failure`. Default `--auth password` mints a 20-char hex simpleAuth password (retrievable via `data-app password`). **Exactly one git source required.** `--use-managed-git-repo` (since 0.65.0) provisions an EMPTY Keboola-hosted repo (POST `useManagedGitRepo:true`), writes NO `parameters.dataApp.git` block, and forces `--no-deploy` (empty repo, nothing to run); mutually exclusive with `--git-repo` and all `--git-*`/PAT flags. Managed-repo deploy WORKS with no credential wiring (verified live -- tic-tac-toe deployed and serving from a Keboola-managed repo). Full flow to a RUNNING app: `git-credentials-create --type http_token --permissions readWrite` -> `git push` your code to the managed repo URL (`data-app git-repo` shows it) -> `data-app deploy`. The platform injects the clone credentials at deploy time, so nothing extra is wired into the config; the minted credential is only used to authenticate YOUR push.

## data-app deploy

```
kbagent data-app deploy --project NAME --app-id ID [--config-version N] [--wait] [--timeout SECONDS] [--branch ID]
```

the §9 redeploy contract. Default reads latest Storage version; `--config-version` pins an older version (rollback). Since 0.65.0: omits `configVersion` for a PURE managed repo (no git block -- deploys from `app.managedGitRepoId`, and the platform injects the clone credentials) and pins the LATEST Storage `configVersion` when a git block is present (external repos). An explicit `--config-version` always wins.

## data-app start

```
kbagent data-app start --project NAME --app-id ID [--wait] [--timeout SECONDS]
```

wake an auto-suspended app at the currently-pinned version. Distinct from deploy: does NOT bump configVersion.

## data-app stop

```
kbagent data-app stop --project NAME --app-id ID [--wait] [--timeout SECONDS]
```

stop a running app (URL and Storage config preserved).

## data-app delete

```
kbagent data-app delete --project NAME --app-id ID [--yes]
```

destructive, cascades to Storage config; URL retired permanently.

## data-app password

```
kbagent data-app password --project NAME --app-id ID
```

read the simpleAuth password. Manage token via interactive prompt by default, or `--allow-env-manage-token` + `KBC_MANAGE_API_TOKEN` for CI on 0.29.0+. Auto-generated, not rotatable -- delete + recreate to mint a new one.

## data-app logs

```
kbagent data-app logs --project NAME --app-id ID [--lines N] [--since ISO8601]
```

tail container logs (Data Science `/apps/{id}/logs/tail`). Plain-text body covering the full spin-up trace ([TIMING] git_clone, Cloning into /app, uv install, supervisord, runtime stack traces). Default `--lines 500`; pass `--lines 0` for the full current buffer (no server-side cap). `--lines` and `--since` are mutually exclusive on the server; `--since` requires a timezone (Z or +00:00). App must be running or recently-stopped — never-started apps return 400 "App X is not running" (recover with `data-app start` or `data-app deploy`). Closes the upstream `keboola-mcp-server` gap where `get_data_apps` hardcodes a 20-line cap; this CLI surface is unconstrained. The log buffer can echo runtime secrets the app printed to stdout/stderr — consider hygiene before piping `--json` output into AI agent context.

## data-app runs

```
kbagent data-app runs --project NAME --app-id ID [--limit N]
```

(since 0.65.0) -- list deployment attempts newest-first (Data Science `/apps/{id}/runs`), each with `failure_reason` + `startup_logs`. Captures setup-phase failures (e.g. git-clone errors) that produce NO container logs, so unlike `data-app logs` it works on never-started / failed apps where `data-app logs` returns HTTP 400. This is the way to find WHY a deploy reverted to stopped. Auth: ordinary project storage token only.

## data-app secrets-set

```
kbagent data-app secrets-set --project ALIAS --app-id ID --secret '#KEY=VALUE' [--secret ...] [--secrets-file PATH] [--branch ID] [--allow-plaintext-on-encrypt-failure] [--dry-run] [--no-hint-next]
```

encrypt and write `#`-prefixed secrets to `parameters.dataApp.secrets`. Per-project KMS encryption, fail-closed. Read-modify-write at the service layer (NOT Storage `merge=True` -- shallow). Runtime exposes each key as an env var with `#` stripped, `-` -> `_`, uppercased. Adding bumps the Storage version; the running container keeps the OLD config until the next `data-app deploy`.

## data-app secrets-list

```
kbagent data-app secrets-list --project ALIAS --app-id ID [--branch ID] [--show-fingerprint]
```

list secret keys + derived runtime env-var names. Never echoes encrypted ciphertext in full. `--show-fingerprint` opt-in for a short ciphertext fingerprint.

## data-app secrets-get

```
kbagent data-app secrets-get --project ALIAS --app-id ID --key 'KEY' [--branch ID]
```

show ONE key from `parameters.dataApp.secrets`. The leading `#` is OPTIONAL (since v0.43.9); the block holds both encrypted secrets (`#`) and plain unencrypted env-var values, and `secrets-list` enumerates both. For an ENCRYPTED secret it stays metadata-only (`encrypted: true`, `value: null`, fingerprint/prefix) -- the decrypted plaintext is NEVER echoed (Encryption API is one-way). For a PLAIN value it returns the literal value (`encrypted: false`), which is already visible via `config detail`. NOT_FOUND on absent key (exact match, no `#KEY`<->`KEY` fuzzing); never enumerates siblings.

## data-app secrets-remove

```
kbagent data-app secrets-remove --project ALIAS --app-id ID --key 'KEY' [--key ...] [--branch ID] [--yes] [--dry-run]
```

destructive (can break a running app at next deploy). Leading `#` OPTIONAL (since v0.43.9): removes both encrypted secrets and plain env-var keys. Idempotent: missing keys exit 0 with `removed: 0`.

## data-app validate-repo

```
kbagent data-app validate-repo --git-repo URL [--git-branch BRANCH] [--git-public/--no-git-public] [--git-pat-env VAR | --git-pat-file PATH] [--type python-js] [--strict]
```

pre-flight Golden-Rule check for a data-app git repo (https://help.keboola.com/data-apps/python-js/). GitHub-only; ≤5 API calls (1 tree + ≤4 contents) regardless of repo size. `--type` restricted to `python-js` in 0.28.0; streamlit / pure-Python / R / Node-only follow-up. `--strict` treats WARNs as failures.

## data-app git-repo

```
kbagent data-app git-repo --project NAME --app-id ID
```

(since 0.63.3) -- show the clone URLs (`ssh_url` / `https_url`) of the app's configured git repo + `is_managed_git_repo` (sandboxes-service `GET /apps/{id}/git-repo`). Read-only, project storage token only. **GOTCHA**: returns 409 `no Git repository configured` until the app has been DEPLOYED at least once -- the git block is synced from the Storage config into the Data Science app record at deploy time; a `--no-deploy` app has no git repo from the service's point of view.

## data-app git-branches

```
kbagent data-app git-branches --project NAME --app-id ID
```

(since 0.63.3) -- list remote branches with commit metadata (`branch`, `sha`, `comment`, `author{name,email}`, `date`); raw top-level array from the server. Same deploy-once precondition as `git-repo`.

## data-app git-entrypoints

```
kbagent data-app git-entrypoints --project NAME --app-id ID
```

(since 0.63.3) -- list root-level `.py` entrypoint files on the configured branch; extension hardcoded to `py` server-side (non-Python entrypoints not listable). Same deploy-once precondition.

## data-app git-credentials

```
kbagent data-app git-credentials --project NAME --app-id ID
```

(since 0.63.3) -- list the credentials of the app's MANAGED git repo (`id`, `type`, `permissions`, `name`, `owner_admin_id`, `created_at`). The secret is NEVER returned here. Needs an admin storage token; external repos have none.

## data-app git-credentials-create

```
kbagent data-app git-credentials-create --project NAME --app-id ID --type ssh_key|http_token --permissions readOnly|readWrite [--public-key KEY | --public-key-file PATH] [--name LABEL] [--yes]
```

(since 0.63.3) -- mint a git credential for the app's MANAGED git repo. `ssh_key` requires a public key; `http_token` returns a ONE-TIME secret (shown once, never retrievable again -- mirrors `data-app password`). Needs an admin storage token. Apps from `data-app create --git-repo` are EXTERNAL => 409 `no managed Git repository`. Confirmation unless `--yes`/`--json`. For a managed-repo app this credential authenticates YOUR `git push` of the code; the deploy itself uses the platform's injected clone credentials -- no further wiring needed.


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [data-app workflow](/cli/guides/data-app-workflow/)
