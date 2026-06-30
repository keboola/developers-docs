---
title: Search
permalink: /cli/commands/search/
---

* TOC
{:toc}

## search

```
kbagent search QUERY [--project NAME] [--type table|bucket|config|flow|data-app|transformation] [--search-type textual|config-based] [--limit N]
```

search for items across one or more projects. **Textual** mode (default, fast) matches item names via the Storage API `global-search` endpoint. **Config-based** mode scans full configuration JSON bodies (slow, complete). `--type` is repeatable; `--limit` applies per project in textual mode (1-100, default 50). `--project` is repeatable for multi-project scope.


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
