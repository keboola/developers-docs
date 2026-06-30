---
title: Encryption
permalink: /cli/commands/encrypt/
---

* TOC
{:toc}

## encrypt values

```
kbagent encrypt values --project ALIAS --component-id ID --input JSON|@file|- [--output-file PATH]
```

encrypt #-prefixed secrets via Keboola Encryption API (one-way, no decrypt). Scope: ComponentSecure (project + component). Use for MCP tool call workflows.


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
- Guide & examples: [encrypt workflow](/cli/guides/encrypt-workflow/)
