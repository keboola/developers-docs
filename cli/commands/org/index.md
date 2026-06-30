---
title: Organization
permalink: /cli/commands/org/
---

* TOC
{:toc}

## org setup

```
kbagent org setup --org-id ID --url URL [--dry-run] [--yes]
```

bulk-onboard all projects from an org (org admin; manage token via interactive prompt by default, or `--allow-env-manage-token` + `KBC_MANAGE_API_TOKEN` for CI on 0.29.0+)

## org setup

```
kbagent org setup --project-ids 1,2,3 --url URL [--dry-run] [--yes]
```

onboard specific projects by ID (any project member; manage token / Personal Access Token via interactive prompt by default, or `--allow-env-manage-token` + `KBC_MANAGE_API_TOKEN` for CI on 0.29.0+)


## See also

- Full reference (always current): [commands-reference.md](https://github.com/keboola/cli/blob/main/plugins/kbagent/skills/kbagent/references/commands-reference.md) in the keboola/cli repo, or run `kbagent context` / `kbagent <command> --help` locally.
