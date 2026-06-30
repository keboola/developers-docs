---
title: Server & Self-Call HTTP
permalink: /cli/commands/serve/
---

* TOC
{:toc}

## http get

```
kbagent http get PATH [--timeout SECONDS]
```

GET an endpoint on the running `kbagent serve`

## http post

```
kbagent http post PATH [--body JSON|@file|-] [--timeout SECONDS]
```

POST with optional JSON body

## http patch

```
kbagent http patch PATH [--body JSON|@file|-] [--timeout SECONDS]
```

PATCH with optional JSON body

## http delete

```
kbagent http delete PATH [--timeout SECONDS]
```

DELETE an endpoint


Reads `KBAGENT_SERVE_URL` + `KBAGENT_SERVE_TOKEN` env vars. The scheduler auto-injects these (plus `KBAGENT_CONFIG_DIR`) into every AI-agent / `cli_command` subprocess. Outside a serve subprocess context the command refuses to run with exit code 2. **Inside a scheduled-agent task, prefer `kbagent http get /openapi.json` then a typed call over forking another `kbagent` CLI -- the HTTP path always sees the operator's live config (not the global `~/.config/keboola-agent-cli/` one).**


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
