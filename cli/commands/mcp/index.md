---
title: MCP Tools
permalink: /cli/commands/mcp/
---

* TOC
{:toc}

## tool list

```
kbagent tool list [--project NAME] [--branch ID]
```

list available MCP tools (multi_project annotation)

## tool call

```
kbagent tool call TOOL_NAME [--project NAME] [--input JSON|@file|-] [--branch ID]
```

call MCP tool (read = all projects, write = single). `--input` accepts inline JSON, `@file.json`, or `-` (stdin)


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [mcp workflow](/cli/guides/mcp-workflow/)
