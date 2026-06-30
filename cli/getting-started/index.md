---
title: Getting Started
permalink: /cli/getting-started/
---

* TOC
{:toc}

This guide assumes you have already [installed the CLI](/cli/installation/). Next you connect one or more projects,
verify the setup, and run your first commands. `kbagent` is stateless — there is no directory to create and no `init`
to run.

## Connect a project

The simplest case: you have a [Storage API token](https://help.keboola.com/management/project/tokens/) from the
Keboola UI.

```bash
kbagent project add --project <name> --url <stack-url> --token <token>
```

- `<name>` is a label of your choice for this project. Wrap it in quotes if it contains spaces, e.g.
  `--project "My Project"`.
- `<stack-url>` is your [stack](https://help.keboola.com/overview/#stacks) URL, for example
  `https://connection.keboola.com`.
- `<token>` is a Storage API token for the project. Omit `--token` to be prompted interactively, which keeps the
  token out of your shell history. `--url` and `--token` can also be supplied via environment variables.

### Connect many projects, or a whole organization

If you have project IDs and a Manage API or Personal Access Token, register several projects at once. `kbagent`
prompts for the Manage API token interactively by default:

```bash
kbagent org setup --project-ids 901,9621,10539 --url https://connection.keboola.com --yes
```

If you are an organization admin, register the whole organization:

```bash
kbagent org setup --org-id 123 --url https://connection.keboola.com --yes
```

For CI / non-interactive use, opt in to env-var resolution with `--allow-env-manage-token` and provide
`KBC_MANAGE_API_TOKEN`.

## Verify

```bash
kbagent doctor
```

This confirms token validity, CLI version, the bundled MCP server, and the Claude Code plugin.

## Run your first commands

Search across **all** your connected projects at once — tables, configs, flows, and data apps:

```bash
kbagent search "customer_id"
```

Run a job and wait for it to finish (with a log tail on failure):

```bash
kbagent job run --project <name> --component-id <component-id> --config-id <config-id> --wait
```

## Work on a dev branch

Create a branch and every subsequent command auto-targets it; Storage reads still default to production for safety:

```bash
kbagent branch create --project <name> --name "refactor-pipeline"
kbagent config list --project <name>     # now reads from the branch
kbagent branch reset --project <name>     # back to main
```

Override the target on any command with an explicit `--branch <id>`.

## Where to go next

- [Commands & Capabilities](/cli/commands/) — the full set of things the CLI can do.
- [AI Agents & Permissions](/cli/ai-agents/) — drive the CLI from Claude Code, Cursor, or Gemini, safely.
- [Tutorial](https://github.com/keboola/cli/blob/main/docs/TUTORIAL.md) — the in-repo end-to-end walkthrough, kept up to date with each release.
