---
title: Global Flags, Environment & Exit Codes
permalink: /cli/commands/reference/
---

* TOC
{:toc}

## Global Flags

| Flag | Description |
|------|-------------|
| `--json / -j` | Structured JSON output |
| `--verbose / -v` | Verbose output |
| `--no-color` | Disable colors |
| `--config-dir` | Override config directory |

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `KBC_TOKEN` | Fallback for `--token`. Also the credential source for headless `__env__` mode (see `KBAGENT_PROJECT_FROM_ENV`) |
| `KBC_STORAGE_API_URL` | Default stack URL. Also the stack source for headless `__env__` mode |
| `KBAGENT_PROJECT_FROM_ENV` | Set to `1`/`true`/`yes`/`on` to synthesize an in-memory project `__env__` from `KBC_TOKEN` + `KBC_STORAGE_API_URL` (since 0.50.0). Headless / token-only: no `project add`, no `config.json` on disk; token stays in memory (never persisted). Use `--project __env__`. Works for CLI and `kbagent serve`. Fails fast if creds missing |
| `KBC_MANAGE_API_TOKEN` | Manage API token (org setup, project refresh, data-app password). Default-DENY since 0.28.0: requires top-level `--allow-env-manage-token` to opt in, otherwise ignored with a warning. |
| `KBAGENT_CONFIG_DIR` | Override config directory |
| `KBAGENT_SERVE_URL` | Self-URL of `kbagent serve` (used by `kbagent http`; auto-injected into scheduled-agent subprocesses) |
| `KBAGENT_SERVE_TOKEN` | Bearer token for `kbagent serve` (paired with `KBAGENT_SERVE_URL`; auto-injected into scheduled-agent subprocesses) |

## Exit Codes

`0` success, `1` general error, `2` usage error, `3` auth error, `4` network error, `5` config error


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
