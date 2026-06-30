---
title: Generate Sources Command
permalink: /cli/legacy/commands/dbt/generate/sources/
redirect_from:
  - /cli/commands/dbt/generate/sources/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

**Generates sources in the dbt project directory.**

```
kbc dbt generate sources [flags]
```

The command must be run in a directory with a dbt project (i.e., containing `dbt_project.yml`) or its subdirectory.

The command creates a file for each Storage bucket in the `models/_sources` directory containing a dbt source for every table in the bucket.

See the [introduction to dbt support](/cli/legacy/dbt/) for more information.

## Options

`-H, --storage-api-host <string>`
: Storage API host, e.g., "connection.keboola.com"

`-T, --target-name <string>`
: Target name of the profile

[Global Options](/cli/legacy/commands/#global-options)

## Examples

```
➜ kbc dbt generate sources

Please enter the Keboola Storage API host, e.g., "connection.keboola.com".
? API host: connection.north-europe.azure.keboola.com


Please enter the Keboola Storage API token. The value will be hidden.
? API token: **************************************************


Please enter the target name.
Allowed characters: a-z, A-Z, 0-9, "_".
? Target Name: target1

Sources stored in the "models/_sources" directory.
```

A generated source file `models/_sources/in.c-test.yml`:

{% raw  %}
```yaml
version: 2
sources:
    - name: in.c-test
      freshness:
        warn_after:
            count: 1
            period: day
      database: '{{ env_var("DBT_KBC_TARGET1_DATABASE") }}'
      schema: in.c-test
      loaded_at_field: '"_timestamp"'
      tables:
        - name: products
          quoting:
            database: true
            schema: true
            identifier: true
          columns: []
```
{% endraw %}

## Next Steps

- [dbt generate](/cli/legacy/commands/dbt/generate/)
- [Introduction to dbt support](/cli/legacy/dbt/)
