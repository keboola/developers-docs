---
title: Data Streams
permalink: /cli/commands/stream/
---

* TOC
{:toc}

Uses the per-project Storage token (no manage token). Control plane = `stream.<region>` (derived from `connection.<region>`). The OTLP ingest endpoint (`stream-in.<region>/otlp/<projectId>/<sourceName>/<secret>`) is returned in `source.otlp.url` with the secret in the path -- **masked by default, `--reveal` to print it**. `create-source --type otlp` auto-provisions the logs/metrics/traces sinks (bucket `in.c-otlp-<source>`) so data lands; `--no-sinks` opts out. See `stream-workflow.md`.
## stream list

```
kbagent stream list --project NAME [--branch ID]
```

list sources (id, name, type, secret-free base endpoint)

## stream create-source

```
kbagent stream create-source --project NAME --name NAME [--type otlp|http] [--branch ID] [--if-not-exists] [--no-sinks] [--reveal]
```

create a source; for OTLP auto-creates 3 sinks (idempotent); polls the async task and returns the endpoint. `--if-not-exists` returns an existing same-named source as `status=skipped`

## stream detail

```
kbagent stream detail [SOURCE_ID | --name NAME] --project NAME [--branch ID] [--reveal]
```

base + per-signal endpoints (`/v1/logs|/v1/traces|/v1/metrics`), protocol `http/protobuf`, destination bucket/tables (from sinks). Secret masked unless `--reveal`

## stream delete

```
kbagent stream delete SOURCE_ID --project NAME [--branch ID] [--dry-run] [--yes|--force]
```

delete a source (destructive; async task polled to completion)


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [stream workflow](/cli/guides/stream-workflow/)
