---
title: Commands
permalink: /cli/legacy/commands/
---

* TOC
{:toc}

{% include legacy-cli-warning.html %}

Run `help` to list all available commands.
```
kbc help
```

You can also get details of any command.
```
kbc help <command>
kbc help local create row
```

## Available Commands

|---
| Command | Description
|-|-|-
| [kbc help](/cli/legacy/commands/help/) | Show help for any command. |
| [kbc status](/cli/legacy/commands/status/) | Show information about a working directory. |
| | |
| **[kbc sync](/cli/legacy/commands/sync/)** | **Synchronization between a [local directory](/cli/legacy/structure/) and a [project](/cli/legacy/#subsystems).** |
| [kbc sync init](/cli/legacy/commands/sync/init/) | Initialize a new local directory and run `kbc sync pull`. |
| [kbc sync pull](/cli/legacy/commands/sync/pull/) | Sync a project to the local directory. |
| [kbc sync push](/cli/legacy/commands/sync/push/) | Sync a local directory to the project. |
| [kbc sync diff](/cli/legacy/commands/sync/diff/) | Show differences between a local directory and a project. |
| | |
| **[kbc ci](/cli/legacy/commands/ci/)** | **Manage the CI/CD pipeline.** |
| [kbc ci workflows](/cli/legacy/commands/ci/workflows/) | Generate workflows for [GitHub Actions integration](/cli/legacy/github-integration/). |
| | |
| **[kbc local](/cli/legacy/commands/local/)** | **Operations in the [local directory](/cli/legacy/structure/) don't affect the project.** |
| [kbc local create](/cli/legacy/commands/local/create/) | Create an object in the local directory. |
| [kbc local create config](/cli/legacy/commands/local/create/config/) | Create an empty [configuration](https://help.keboola.com/components/). |
| [kbc local create row](/cli/legacy/commands/local/create/row/) | Create an empty [configuration row](https://help.keboola.com/components/#configuration-rows). |
| [kbc local persist](/cli/legacy/commands/local/persist/) | Detect new directories with a [configuration](https://help.keboola.com/components/) or a [configuration row](https://help.keboola.com/components/#configuration-rows). |
| [kbc local encrypt](/cli/legacy/commands/local/encrypt/) | Encrypt all [unencrypted secrets](/overview/encryption/#encrypting-data-with-api). |
| [kbc local validate](/cli/legacy/commands/local/validate/) | Validate the local directory. |
| [kbc local validate config](/cli/legacy/commands/local/validate/config/) | Validate a configuration JSON file. |
| [kbc local validate row](/cli/legacy/commands/local/validate/row/) | Validate a configuration row JSON file. |
| [kbc local validate schema](/cli/legacy/commands/local/validate/schema/) | Validate a configuration/row JSON file by a JSON schema file. |
| [kbc local fix-paths](/cli/legacy/commands/local/fix-paths/) | Ensure that all local paths match [configured naming](/cli/legacy/structure/#naming). |
| | |
| **[kbc remote](/cli/legacy/commands/remote/)** | **Operations directly in the [project](/cli/legacy/#subsystems).** |
| [kbc remote create](/cli/legacy/commands/remote/create/) | Create an object in the project. |
| [kbc remote create branch](/cli/legacy/commands/remote/create/branch/) | Create a new [branch](https://help.keboola.com/components/branches/) from the `main` branch. |
| [kbc remote create bucket](/cli/legacy/commands/remote/create/bucket/) | Create a new [bucket](https://help.keboola.com/storage/buckets/). |
| [kbc remote file](/cli/legacy/commands/remote/file/) | Manage [files](https://help.keboola.com/storage/files/) in Storage. |
| [kbc remote file download](/cli/legacy/commands/remote/file/download/) | Download a [file](https://help.keboola.com/storage/files/) from Storage. |
| [kbc remote file upload](/cli/legacy/commands/remote/file/upload/) | Upload a [file](https://help.keboola.com/storage/files/) to Storage. |
| [kbc remote job](/cli/legacy/commands/remote/job/) | Manage [jobs](https://help.keboola.com/management/jobs/) in the project. |
| [kbc remote job run](/cli/legacy/commands/remote/job/run/) | Run one or more [jobs](https://help.keboola.com/management/jobs/). |
| [kbc remote table](/cli/legacy/commands/remote/table/) | Manage [tables](https://help.keboola.com/storage/tables/) in the project. |
| [kbc remote table create](/cli/legacy/commands/remote/table/create/) | Create a new [table](https://help.keboola.com/storage/tables/). |
| [kbc remote table upload](/cli/legacy/commands/remote/table/upload/) | Upload a CSV file to a [table](https://help.keboola.com/storage/tables/). |
| [kbc remote table download](/cli/legacy/commands/remote/table/download/) | Download data from a [table](https://help.keboola.com/storage/tables/). |
| [kbc remote table preview](/cli/legacy/commands/remote/table/preview/) | Preview up to 1000 rows from a [table](https://help.keboola.com/storage/tables/). |
| [kbc remote table detail](/cli/legacy/commands/remote/table/detail/) | Print [table](https://help.keboola.com/storage/tables/) details. |
| [kbc remote table import](/cli/legacy/commands/remote/table/import/) | Import data to a [table](https://help.keboola.com/storage/tables/) from a [file](https://help.keboola.com/storage/files/). |
| [kbc remote table unload](/cli/legacy/commands/remote/table/unload/) | Unload a [table](https://help.keboola.com/storage/tables/) into a [file](https://help.keboola.com/storage/files/). |
| [kbc remote workspace](/cli/legacy/commands/remote/create/) | Manage workspaces in the project. |
| [kbc remote workspace create](/cli/legacy/commands/remote/workspace/create/) | Create a workspace in the project. |
| [kbc remote workspace delete](/cli/legacy/commands/remote/workspace/delete/) | Delete a workspace in the project. |
| [kbc remote workspace detail](/cli/legacy/commands/remote/workspace/detail/) | Print workspace details and credentials. |
| [kbc remote workspace list](/cli/legacy/commands/remote/workspace/list/) | List workspaces in the project. |
| | |
| **[kbc dbt](/cli/legacy/commands/dbt/)** | **Work with dbt inside your repository.** |
| [kbc dbt init](/cli/legacy/commands/dbt/init/) | Initialize profiles, sources, and environment variables for use with dbt. |
| [kbc dbt generate](/cli/legacy/commands/dbt/generate/) | Generate profiles, sources, and environment variables for use with dbt. |
| [kbc dbt generate profile](/cli/legacy/commands/dbt/generate/profile/) | Generate profiles for use with dbt. |
| [kbc dbt generate sources](/cli/legacy/commands/dbt/generate/sources/) | Generate sources for use with dbt. |
| [kbc dbt generate env](/cli/legacy/commands/dbt/generate/env/) | Generate environment variables for use with dbt. |
| | |
| **[kbc llm](/cli/legacy/commands/llm/) (BETA)** | **Export project data to AI-optimized format.** |
| [kbc llm init](/cli/legacy/commands/llm/init/) | Initialize a new local directory for LLM export. |
| [kbc llm export](/cli/legacy/commands/llm/export/) | Export project data to AI-optimized twin format. |

## Aliases

The most used commands have their shorter aliases.

For example, you can use `kbc c` instead of `kbc local create`.

|---
| Full Command | Aliases
|-|-|-
| `kbc sync init`      |  `kbc init`, `kbc i`
| `kbc sync diff`      |  `kbc diff`, `kbc d`
| `kbc sync pull`      |  `kbc pull`, `kbc pl` 
| `kbc sync push`      |  `kbc push`, `kbc ph`
| `kbc local validate` |  `kbc validate`, `kbc v`
| `kbc local persist`  |  `kbc persist`, `kbc pt`
| `kbc local create`   |  `kbc create`, `kbc c`
| `kbc local encrypt`  |  `kbc encrypt`, `kbc e`

## Options 

Options are a way to modify the behavior of a command, they can be:
- **[Global](#global-options)**, for all commands, see below.
- **Local**, only for a specific command, see the command help.

#### Command-line flags

- Entered as part of the CLI command.
- One-letter flags start with `-`, for example `-v`.
- Longer flags start with `--`, for example `--verbose`.
- **Flags take precedence over environment variables.**


#### Environment variables

- Each flag can be defined via an environment variable.
- Variable name is based on the flag name, and starts with `KBC_`.
- All letters are changed to uppercase and dashes to underscores.
- For example, flag `--log-file` can be defined by the `KBC_LOG_FILE` environment variable.
- Sources and priority of the environment variables:
    1. From the OS environment.
    2. From environment files in the working directory.
    3. From environment files in the project directory.

All found environment files are automatically loaded.  
Variables are merged together according to the following priority.

|---
| Environment File | Environment | Priority
|-|-|-
| `.env.development.local`  | Development | The highest |  
| `.env.test.local`         | Test |  |
| `.env.production.local`   | Production |  |
| `.env.local`              | Wherever the file is |  |
| `.env.development`        | Development|  |
| `.env.test`               | Test|  |
| `.env.production`         | Production|  |
| `.env`                    | All | The lowest  |

*Note: All `.*local` environment files should be part of the `.gitignore` file, if used.*

### Global Options

`-h, --help`
: Show help for the command

`-l, --log-file <string>`
: Path to a log file to store the details in

`-t, --storage-api-token <string>`
: Storage API token to the project

`-v, --verbose`
: Increase output verbosity

`--verbose-api`
: Log each API request and its response

`-V, --version`
: Show the version

`-d, --working-dir <string>`
: Use another working directory

## Next Steps

- [Installation](/cli/legacy/installation/)
- [Getting Started](/cli/legacy/getting-started/)
- [Directory Structure](/cli/legacy/structure/)
- [GitHub Integration](/cli/legacy/github-integration/)
