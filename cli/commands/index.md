---
title: Commands
permalink: /cli/commands/
---

* TOC
{:toc}

# kbagent Command Reference

All commands support `--json` for structured output. Multi-project flags (`--project`) can be repeated.

This is the full per-area command reference for the Keboola CLI (`kbagent`). Each page lists the commands in that
area with their flags and behavior. The reference is mirrored from the
[keboola/cli repository](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md); for the always-current version, run `kbagent context` or `kbagent <command> --help`.

## Command areas

- [Setup & Info](/cli/commands/setup/)
- [Projects & Members](/cli/commands/project/)
- [Organization](/cli/commands/org/)
- [Permissions](/cli/commands/permissions/)
- [Feature Flags](/cli/commands/feature/)
- [Components](/cli/commands/component/)
- [Configurations](/cli/commands/config/)
- [Search](/cli/commands/search/)
- [Jobs](/cli/commands/job/)
- [Storage](/cli/commands/storage/)
- [Data Streams](/cli/commands/stream/)
- [Lineage](/cli/commands/lineage/)
- [Sharing](/cli/commands/sharing/)
- [Development Branches](/cli/commands/branch/)
- [Workspaces](/cli/commands/workspace/)
- [Data Apps](/cli/commands/data-app/)
- [MCP Tools](/cli/commands/mcp/)
- [Kai (AI Assistant)](/cli/commands/kai/)
- [Flows](/cli/commands/flow/)
- [Schedules](/cli/commands/schedule/)
- [Sync (GitOps)](/cli/commands/sync/)
- [Encryption](/cli/commands/encrypt/)
- [Developer Portal](/cli/commands/dev-portal/)
- [Semantic Layer](/cli/commands/semantic-layer/)
- [Server & Self-Call HTTP](/cli/commands/serve/)
- [Agent Tasks](/cli/commands/agent/)
- [Global Flags, Environment & Exit Codes](/cli/commands/reference/)

## Global usage

Every command accepts `--json` for structured output, `--verbose`, `--no-color`, and `--config-dir`. The session
permission firewall is controlled with `--deny-writes` and `--deny-destructive`. See
[Global Flags, Environment & Exit Codes](/cli/commands/reference/) for the complete list.
