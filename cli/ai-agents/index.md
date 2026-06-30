---
title: AI Agents & Permissions
permalink: /cli/ai-agents/
---

* TOC
{:toc}

`kbagent` is built AI-first. Every command can output structured JSON (`--json`), errors carry machine-readable
codes, and a permission firewall enforces safety at the code level — not via prompt instructions. That makes it safe
to hand to an AI agent such as Claude Code, Cursor, or Gemini.

## Point any agent at the CLI

Any agent can discover the full command set by running:

```bash
kbagent context
```

This prints the complete, machine-readable command reference for the agent to work from.

## Claude Code plugin

For Claude Code, install the plugin so the agent learns all commands and gets a specialist sub-agent for writes:

```
/plugin marketplace add keboola/cli
/plugin install kbagent@keboola-agent-cli
```

You can then let the `kbagent` skill trigger from natural prompts, or delegate explicitly with `/keboola <task>` — the
slash command spawns a `kbagent:keboola-expert` sub-agent with fresh context and hard safety rules (fresh fetch,
dry-run first, prefer CLI over REST/MCP). See the
[Tutorial](https://github.com/keboola/cli/blob/main/docs/TUTORIAL.md#6-using-the-agent-and-slash-commands) for details.

## Example prompts

> "Give me a full inventory of all Keboola projects — configs, jobs, components, data volumes."

> "Find the last failed job in project X, figure out why it crashed, spin up a workspace with the input data, and fix the SQL."

> "Compare the SQL transformation between production and the dev branch."

## The permission firewall

Control which commands and MCP tools an agent may use — like a firewall with allow/deny rules, enforced in code (a
blocked operation exits with a clear error, not a prompt the model can talk its way around).

Start an agent workspace in read-only mode:

```bash
kbagent init --from-global --read-only
```

The agent can browse configs, list jobs, and trace lineage, but cannot create branches, delete workspaces, modify
configs, or call write MCP tools. You can also apply the firewall per session with the global `--deny-writes` and
`--deny-destructive` flags.

Manage and inspect the policy:

```bash
kbagent permissions list             # all operations with risk categories
kbagent permissions show             # current policy
kbagent permissions check "branch.delete"   # test if an operation is allowed
kbagent permissions reset            # remove restrictions (requires a confirmation code)
```

`kbagent init --read-only` layers three independent protections: the kbagent policy in `config.json`, a filesystem
`chmod` that makes the config owner-read-only, and a `.claude/settings.json` that blocks Claude Code from touching the
config. Commit `.claude/settings.json` to git so the protection applies for everyone.

See the [Permissions guide](https://github.com/keboola/cli/blob/main/docs/guide.md#permissions) for the full pattern
syntax, policy modes, and production setup.
