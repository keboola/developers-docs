---
title: Development branches
permalink: /extend/common-interface/development-branches/
---

* TOC
{:toc}

Development branches are a feature that handles change management in Keboola Connection projects. To learn more about how development branches work refer to the [user documentation](https://help.keboola.com/change-management/). 

{% include branches-beta-warning.html %}

## Running a component in a branch

A component that uses the [Common Interface](/extend/common-interface/) can be run in a branch without any changes to the code. Notable exceptions are components that modify external resources (for example database writers) and components that use injected Storage token to interact with Storage API. 

### How do you tell component is executed in branch context?

When [runner](/extend/docker-runner/) executes a job in a branch, it sets [`KBC_BRANCHID` environment variable](/extend/common-interface/environment/#environment-variables) to current branch id. This ID is unique for each branch in the whole stack. 

The fact that the component is executed in a branch is not very important for the component itself. It behaves the same way and all the heavy lifting is done by Keboola Connection job runner. 

The only exception is if the component interacts with storage API directly using forwarded storage token. In that case it needs to take the branch ID into consideration. Any such component is a subject of a separate component review by Keboola to ensure the implementation is correct.  

### Input and output mapping in development branch

#### Write

When a component in development branch writes data to storage, the bucket name stored in [input mapping](/transformations/mappings/#table-input-mapping) is dynamically changed by prefixing the branches internal ID. That means that your production bucket will not be overwritten.

#### Read

When a component in development branch reads data from storage, it first checks if there is a development version of the production bucket. If there is one, it uses it. If development bucket does not exist, it reads the data from production bucket. That way you don't need to re-run all your data extraction jobs in a development branch.

### Configuration state in development branch

The state is stored separately for the development branch. Notice though, that [state](/integrate/storage/api/configurations/#state) is not merged when a development branch is merged. 

### Components interacting with external resources

Special care needs to be taken so that components interacting with external resources do not affect production data when ran in development branch. 

Snowflake writer is an example of such component. In production, a Snowflake writer configuration is created. It writes to a schema `PROD_SCHEMA` in the Snowflake database. Executing a job of this configuration in a development branch without any safeguards would write the branch data to the `PROD_SCHEMA`. Therefore, some component jobs are limited in the development branch. 

The limitation is based on component's features. Currently, there are following features:

* **dev-branch-configuration-unsafe**: Components with this feature can be run in development branch, but only after `{configuration:{runtime: {safe: true}}}` is explicitly set in the configuration. This can either be done via API or using the *Safe for run in branch* toggle in the configuration detail in the UI.
* **dev-branch-job-blocked**: Component is not allowed to run in development branch under any circumstances.
* **dev-mapping-allowed**: Component is allowed to use development bucket in default branch input mapping. Normally this is disallowed. 

To see what features a component have you can use [Developer portal API](https://kebooladeveloperportal.docs.apiary.io/#reference/0/public-api/get-app-detail) or [Component list in Storage API](https://keboola.docs.apiary.io/#reference/miscellaneous/api-index/component-list). 

To request a change of your component's features, please contact support using the support button in your project. 
