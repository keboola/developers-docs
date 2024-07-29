---
title: Example Use Cases
permalink: /cli/example-use-cases/
---

* TOC
{:toc}

Because Keboola CLI provides a Keboola project representation in
a [directory structure](/cli/structure/#directory-structure) with [JSON files](/cli/structure/#configurations).
The [--allow-target-env](https://developers.keboola.com/cli/commands/sync/init/#:~:text=Options-,%2D%2Dallow%2Dtarget%2Denv,-Allow%20usage%20of)
init mode
enables achieving a GitOps management on top of your projects. Here we list some example use cases that are possible
using this mode.

## Git-Based Branch Management

By overriding the destination branch via the `KBC_BRANCH_ID` environment variable you can
map each Git branch to a particular GUI Dev branch and use Git to perform the merge or rebase even between different
branches.

{: .image-popup}
![branch_management.png](/cli/example-use-cases/branch_management.png)

### Tutorial

#### Initialization

1. First, let’s initialize a GitHub repository with a single main branch via `kbc init --allow-target-env` command.

- Fill in all parameters as usual
- Select only the main branch in this case

  {: .image-popup}
  ![init.png](/cli/example-use-cases/init.png)

2. Initialize the GitHub repository using `git init` command

Now, you can perform `kbc push` or `kbc pull` normally and you will get the main to the main branch.

#### Creating a new branch

Let’s create a new branch named `new-feature`.

```shell
git checkout -b new-feature
```

Now you can link the current branch to an actual Keboola Dev Branch:

1. Create a new dev branch named new-feature. The following command will create a remote branch off the production
   branch

```shell
kbc remote create branch --aaa
```

2. Override the destination branch be setting the `KBC_BRANCH_ID` environment variable.
    - The newly created branch ID is available in the resulting file

```shell
export KBC_BRANCH_ID=1234
```

3. Run `kbc push`, to synchronize the local changes.

Any changes that you perform in the remote branch will be now synchronized back using the `kbc pull` command as long as
the `KBC_BRANCH_ID` variable is set.

#### Merging the changes

Once you are ready, you can commit the changes and compare to the main branch and eventually merge the new branch to
your main.

**WARNING:** once you switch back to the main branch, do not forget to unset the `KBC_BRANCH_ID` (via
the `unset KBC_BRANCH_ID` command) variable so the `kbc push/pull` commands run against the main branch again.

## Deployment to multiple projects

Using the `kbc init --allow-target-env` mode you can override the destination project. This is for instance leveraged in
the Dev/Prod Manager example use case. You can leverage this for instance to distribute a single project (as a
“template”) into multiple ones to start from.

{: .image-popup}
![project_deploy.png](/cli/example-use-cases/project_deploy.png)

### Tutorial

1. First, let’s **create a GitHub repository** with a single main branch via `kbc init --allow-target-env` command.

- Fill in all parameters as usual
- Select only the main branch in this case

  {: .image-popup}
  ![init.png](/cli/example-use-cases/init.png)

2. **Obtain the main branch ID**

   To get the destination project main branch ID you can either leverage
   the [List Branches API call](https://keboola.docs.apiary.io/#reference/development-branches/branches/list-branches)
   and look for a branch named `main`.

   Alternatively, from any component configuration, invoke the Developer Tools (`F12` in Chrome)
   and look for any underlying api call, e.g. `versions` you will see the branch ID in the url (
   *xxx/branch/{BRANCH_ID}/xx*)

   {: .image-popup}
   ![devtools.png](/cli/example-use-cases/devtools.png)

   Now you can perform `kbc push` and the project definition will get transferred into the main branch of the selected
   project.

3. **Change the destination project ID and it’s main branch:**

```shell
export KBC_PROJECT_ID=1234
export KBC_BRANCH_ID=972851
```

## Multi-stage (and multi-project) environment management

Keboola [native branching environment](https://help.keboola.com/components/branches/) is typically sufficient for small
to medium projects. However, in an enterprise setup it may
be necessary to have completely separate environments where both data and data pipeline definitions (code) are isolated.
In such setups, administrators may need to define complex “branch protection” rules to closely control who can release
new features into the production environment, as well as how and when these releases occur. In the software engineering
world, this is often achieved with version control systems like Git.

Thanks
to[ Keboola's CLI functionality](https://developers.keboola.com/cli/commands/sync/init/#:~:text=Options-,%2D%2Dallow%2Dtarget%2Denv,-Allow%20usage%20of),
it is possible to define and synchronize separate environments, including the
ones with [multi-project architecture](https://help.keboola.com/catalog/multi-project/) setup, entirely via Git. This
gives users the freedom to establish deployment rules
according to their needs and allows for testing entire pipelines across multiple projects in completely isolated
environments.

{: .image-popup}
![devprod.png](/cli/example-use-cases/devprod.png)

### High-level Workflow

To implement the above suggested setup, we need the following tools:
- **Keboola CLI** - sync project representations with enabled overridden target environment
- **Keboola Variables Vault** - a feature that allows users to define variables and secrets on a project level and reference them in configurations.
- **GitHub & Git Actions** - Versioning system to hold the project representations and define deployment rules and validations.

{: .image-popup}
![dev_prod_flow.png](/cli/example-use-cases/dev_prod_flow.png)

We have prepared a sample [Streamlit application](https://github.com/keboola/cli-based-sync-generator) 
that can be deployed as a [DataApp](https://help.keboola.com/components/data-apps/#git-repository) in the Keboola environment to help with the initialisation process.

This application includes GitHub actions that allow you to manage this scenario. It is expected that users modify this flow to their needs


To learn about the full use case, please refer to [this blog post](), where we describe the workflow in depth.