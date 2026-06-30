---
title: Setup & Info
permalink: /cli/commands/setup/
---

* TOC
{:toc}

## Setup & Info

### init

```
kbagent init [--from-global] [--project ALIAS ...]
```

create local `.kbagent/` workspace in current directory; `--project ALIAS` (repeatable) copies only the named project(s) from the global config and implies `--from-global`

### doctor

```
kbagent doctor [--fix]
```

health check for CLI config and MCP server

### version

```
kbagent version [--beta]
```

show version info and dependency update status. `--beta` (since v0.42.0) reports the latest pre-release (beta / rc) instead of the latest stable. Env override: `KBAGENT_INCLUDE_PRERELEASE=1`

### update

```
kbagent update [--beta]
```

self-update to latest version. `--beta` (since v0.42.0) opts into pre-release versions (PEP 440 betas / rc, e.g. `0.43.0b1`). Default behaviour: GitHub's `/releases/latest` endpoint filters prereleases server-side, so the startup auto-update hook never silently lands on a beta. Resolver-level opt-in (`--prerelease=allow` for uv, `--pre` for pip) is added automatically when `--beta` is set

### changelog

```
kbagent changelog [--limit N] [--full]
```

show recent changelog (default: last 5 versions, one-line summary per version; `--full` / `-v` expands every note). After auto-update, "What's new" is printed automatically (summarised). Manual trigger: `KBAGENT_UPDATED_FROM=0.17.0 kbagent version`

### context

```
kbagent context
```

print full CLI reference for AI agents

## Utility

### init

```
kbagent init [--from-global] [--project ALIAS ...]
```

create local `.kbagent/` workspace (per-directory isolation); `--project ALIAS` (repeatable) copies only the named project(s) and implies `--from-global`

### doctor

```
kbagent doctor [--fix]
```

health checks; `--fix` auto-installs MCP server binary. Includes a `sync_secrets` check (since 0.55.0): when run inside a sync working tree (`.keboola/manifest.json`), warns if any in-sync config holds plaintext `#`-secrets (#378); `skip` outside a sync tree

### version

```
kbagent version
```

show version and check for MCP server updates

### context

```
kbagent context
```

full usage instructions for AI agents


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
