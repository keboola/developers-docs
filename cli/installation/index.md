---
title: Installation
permalink: /cli/installation/
---

* TOC
{:toc}

Install the Keboola CLI (`kbagent`) with a single command on macOS, Linux, or WSL:

```bash
curl -LsSf https://raw.githubusercontent.com/keboola/cli/main/install.sh | sh
```

The installer first bootstraps [`uv`](https://docs.astral.sh/uv/) (a fast Python package manager) if it is missing,
then runs on uv's own managed Python — so **no system Python or version setup is required**. It installs a prebuilt
wheel from the latest GitHub release, which takes a few seconds rather than building from source.

By default the install includes the optional `[server]` extras (the web UI and scheduled agent tasks). For a
CLI-only install, set `KBAGENT_NO_SERVER=1` before running the command.

## Verify

```bash
kbagent doctor
```

`kbagent doctor` checks your token validity, CLI version, the bundled MCP server, and the Claude Code plugin. Use
`kbagent doctor --fix` to auto-fix common issues.

## Install from source or pin a version

To build from source or pin a specific ref, install directly with `uv`:

```bash
uv tool install git+https://github.com/keboola/cli
```

## Optional web UI

`kbagent` ships an optional browser dashboard that covers everything the CLI exposes — projects, configs, storage,
jobs, flows, schedules, MCP tools, lineage, and scheduled AI agents with a cost/token timeline:

```bash
uv tool install --with 'keboola-cli[server]' 'git+https://github.com/keboola/cli'
kbagent serve --ui
# Open the URL printed at startup — the browser is auto-authenticated.
```

See the [web server documentation](https://github.com/keboola/cli/blob/main/docs/web-server.md) for the full setup
and endpoint reference.

## Auto-updates

`kbagent` self-updates itself **and** its bundled `keboola-mcp-server` dependency on every launch, so you are never
running against a stale MCP server. After an update it shows what changed; run `kbagent changelog` to see the full
history. To opt out, set `export KBAGENT_AUTO_UPDATE=false`, or update manually with `kbagent update`.

## Next steps

- [Getting Started](/cli/getting-started/) — connect a project and run your first commands.
- [Commands & Capabilities](/cli/commands/) — what the CLI can do.

## Looking for the old kbc CLI?

Installation instructions for the deprecated Go CLI (`kbc`, "Keboola as Code") have moved to
[Legacy CLI → Installation](/cli/legacy/installation/).
