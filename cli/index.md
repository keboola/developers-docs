---
title: CLI
permalink: /cli/
---

* TOC
{:toc}

The **Keboola CLI** (`kbagent`) is a single command-line tool to manage all your Keboola projects. It is stateless
(no project clone or `init` — run it from any directory), works across multiple projects at once, and is designed to be
driven by AI agents such as Claude Code, Cursor, and Gemini — while working great standalone too.

The CLI is open source and developed at [github.com/keboola/cli](https://github.com/keboola/cli).

## Why kbagent

- **Stateless** — connect once, then run from anywhere; no local project directory to clone or keep in sync.
- **Multi-project** — operate on and search across all your connected projects in parallel, including a search
  inside configuration bodies (not just names).
- **AI-native** — structured JSON output and machine-readable error codes, with the
  [Keboola MCP server](/integrate/mcp/) bundled and auto-updated for use with Claude Code, Cursor, Gemini, and others.
- **Full project control** — Storage (buckets, tables, files), configuration CRUD, job execution with log tailing,
  and development branches with a permission firewall so automation can't touch production.
- **One-line, cross-platform install** — a single command on macOS, Linux, and WSL; the installer bootstraps its own
  managed Python so there is nothing to set up first.
- **Actively maintained** — the official Keboola CLI going forward.

## Quick start

Install (macOS, Linux, or WSL):

```bash
curl -LsSf https://raw.githubusercontent.com/keboola/cli/main/install.sh | sh
```

Connect a project — no directory, no `init`, no clone:

```bash
kbagent project add --project <name> --url <stack-url> --token <token>
```

Verify the connection:

```bash
kbagent doctor
```

See [Installation](/cli/installation/) and [Getting Started](/cli/getting-started/) for the full walkthrough.

## Next steps

- [Installation](/cli/installation/) — install options, the optional web UI, and auto-updates.
- [Getting Started](/cli/getting-started/) — connect one project, many projects, or a whole organization, then run your first commands.
- [Commands & Capabilities](/cli/commands/) — what the CLI can do, and where to find the full reference.
- [AI Agents & Permissions](/cli/ai-agents/) — drive the CLI from Claude Code / Cursor / Gemini, safely.

## Documentation and reference

The full command reference, tutorials, and use cases live in the CLI repository and are kept up to date with every
release:

- [Repository and README](https://github.com/keboola/cli) — overview, features, and latest install instructions.
- [Tutorial](https://github.com/keboola/cli/blob/main/docs/TUTORIAL.md) — a guided walkthrough of the core workflows.
- [Command guide](https://github.com/keboola/cli/blob/main/docs/guide.md) — full command and flag reference.
- [Use cases](https://github.com/keboola/cli/blob/main/docs/use-cases.md) — CI/CD, GitOps, multi-project, and data-platform-as-code patterns.
- [Error codes](https://github.com/keboola/cli/blob/main/docs/error-codes.md) — machine-readable error reference.
- [Web server & dashboard](https://github.com/keboola/cli/blob/main/docs/web-server.md) — the optional local web UI and scheduled agent tasks.

## Coming from the old kbc CLI?

The previous Go CLI (`kbc`, "Keboola as Code") is now **deprecated** but still works for existing projects and scripts.
Its documentation has moved to [Legacy CLI (Keboola as Code)](/cli/legacy/). New projects should use `kbagent` as
described above.
