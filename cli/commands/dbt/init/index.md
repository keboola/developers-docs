---
title: dbt Init Command
permalink: /cli/commands/dbt/init/
---

* TOC
{:toc}

**Initialize a new Snowflake workspace, generate profile, sources and environment variables to use it in your dbt project.**

```
kbc dbt init [flags]
```

The command must be run in a directory with a dbt project (i.e. containing `dbt_project.yml`).

See [introduction to dbt support](/cli/dbt/) for more information.

## Options

`-H, --storage-api-host <string>`
: Storage API host, e.g. "connection.keboola.com"

`-T, --target-name <string>`
: Target name of the profile

`-W, --workspace-name <string>` 
: Name of the workspace to create

[Global Options](/cli/commands/#global-options)

## Examples

```
➜ kbc dbt init

Please enter Keboola Storage API host, eg. "connection.keboola.com".
? API host: connection.north-europe.azure.keboola.com


Please enter Keboola Storage API token. The value will be hidden.
? API token: **************************************************


Please enter target name.
Allowed characters: a-z, A-Z, 0-9, "_".
? Target Name: TARGET1


? Enter a name for a workspace to create: dbt_workspace

Creating new workspace, please wait.
Created new workspace "dbt_workspace".
Profile stored in "profiles.yml".
Sources stored in "models/_sources" directory.
Commands to set environment for the dbt target:
  export DBT_KBC_TARGET1_TYPE=snowflake
  export DBT_KBC_TARGET1_SCHEMA=WORKSPACE_12345
  export DBT_KBC_TARGET1_WAREHOUSE=KEBOOLA_PROD_SMALL
  export DBT_KBC_TARGET1_DATABASE=KEBOOLA_1234
  export DBT_KBC_TARGET1_ACCOUNT=keboola.west-europe.azure
  export DBT_KBC_TARGET1_USER=KEBOOLA_WORKSPACE_12345
  export DBT_KBC_TARGET1_PASSWORD=abcd1234
```

## Next Steps

- [dbt generate](/cli/commands/dbt/generate/)
- [Introduction to dbt support](/cli/dbt/)
