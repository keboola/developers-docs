---
title: Commands
permalink: /cli/commands/
---

* TOC
{:toc}


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
| [kbc help](/cli/commands/help/) | Show help for any command. |
| [kbc status](/cli/commands/status/) | Show information about a working directory. |
| | |
| **[kbc sync](/cli/commands/sync/)** | **Synchronization between a [local directory](/cli/structure/) and a [project](/cli/#subsystems).** |
| [kbc sync init](/cli/commands/sync/init/) | Initialize a new local directory and run `kbc sync pull`. |
| [kbc sync pull](/cli/commands/sync/pull/) | Sync a project to the local directory. |
| [kbc sync push](/cli/commands/sync/push/) | Sync a local directory to the project. |
| [kbc sync diff](/cli/commands/sync/diff/) | Show differences between a local directory and a project. |
| | |
| **[kbc ci](/cli/commands/ci/)** | **Manage the CI/CD pipeline.** |
| [kbc ci workflows](/cli/commands/ci/workflows/) | Generate workflows for [GitHub Actions integration](/cli/github-integration/). |
| | |
| **[kbc local](/cli/commands/local/)** | **Operations in the [local directory](/cli/structure/) don't affect the project.** |
| [kbc local create](/cli/commands/local/create/) | Create an object in the local directory. |
| [kbc local create config](/cli/commands/local/create/config/) | Create an empty [configuration](https://help.keboola.com/components/). |
| [kbc local create row](/cli/commands/local/create/row/) | Create an empty [configuration row](https://help.keboola.com/components/#configuration-rows). |
| [kbc local persist](/cli/commands/local/persist/) | Detect new directories with a [configuration](https://help.keboola.com/components/) or a [configuration row](https://help.keboola.com/components/#configuration-rows). |
| [kbc local encrypt](/cli/commands/local/encrypt/) | Encrypt all [unencrypted secrets](/overview/encryption/#encrypting-data-with-api). |
| [kbc local validate](/cli/commands/local/validate/) | Validate the local directory. |
| [kbc local fix-paths](/cli/commands/local/fix-paths/) | Ensure that all local paths match [configured naming](/cli/structure/#naming). |
| | |
| **[kbc remote](/cli/commands/remote/)** | **Operations directly in the [project](/cli/#subsystems).** |
| [kbc remote create](/cli/commands/remote/create/) | Create an object in the project. |
| [kbc remote create branch](/cli/commands/remote/create/branch/) | Create a new [branch](https://help.keboola.com/components/branches/) from the `main` branch. |


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

**Note:** All `.*local` environment files should be part of the `.gitignore` file, if used.

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

- [Installation](/cli/installation/)
- [Getting Started](/cli/getting-started/)
- [Directory Structure](/cli/structure/)
- [GitHub Integration](/cli/github-integration/)

