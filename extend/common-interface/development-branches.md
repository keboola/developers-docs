---
title: Development branches
permalink: /extend/common-interface/development-branches/
---

* TOC
{:toc}

Development branches are a feature that handles change management in Keboola projects. To learn more about how development branches work, refer to our [user documentation](https://help.keboola.com/components/branches/). 

{% include branches-beta-warning.html %}

## Running a Component in a Branch

A component that uses the [Common Interface](/extend/common-interface/) can be run in a branch without any changes to the code. Notable exceptions are components that modify external resources (for example, database writers) and components that use [forwarded Storage token](/extend/common-interface/environment/#environment-variables) to interact with Storage API. 

### How to Tell a Component is Executed in Branch Context?

When the [runner](/extend/docker-runner/) executes a job in a branch, it sets the [`KBC_BRANCHID` environment variable](/extend/common-interface/environment/#environment-variables) to the current branch ID. This ID is unique for each branch in the whole stack. 

The fact that the component is executed in a branch is not very important for the component itself. It behaves the same way, and all the heavy lifting is done by the Keboola job runner. 

The only exception is if the component interacts with Storage API directly using a forwarded Storage token. In that case, it needs to take the branch ID into consideration. Any such component is a subject of a separate component review by Keboola to ensure the implementation is correct.  

### Input and Output Mapping in a Development Branch

#### Write

When a component in a development branch writes data to Storage, the bucket name stored in the [input mapping](/extend/component/tutorial/input-mapping/) is dynamically changed by prefixing the branches internal ID. That means that your production bucket will not be overwritten.

#### Read

When a component in a development branch reads data from Storage, it first checks if there is a development version of the production bucket. If there is one, it uses that. If a development bucket does not exist, it reads the data from the production bucket. That way, you don't need to re-run all your data extraction jobs in a development branch.

### Configuration State in a Development Branch

The state is stored separately for the development branch. Notice though that [state](/integrate/storage/api/configurations/#state) is not merged when a development branch is merged. 

### Components Interacting with External Resources

Special care needs to be taken so that components interacting with external resources do not affect production data when run in a development branch. 

The Snowflake writer is an example of such a component. In production, a Snowflake writer configuration is created. It writes to a schema `PROD_SCHEMA` in the Snowflake database. Executing a job of this configuration in a development branch without any safeguards would write the branch data to the `PROD_SCHEMA`. Therefore, some component jobs are limited in the development branch. 

The limitation is based on the component's features. Currently, there are the following features:

* **dev-branch-configuration-unsafe**: Components with this feature can be run in a development branch but only after `{configuration:{runtime: {safe: true}}}` is explicitly set in the configuration. This can either be done via API or using the *Safe for run in branch* toggle in the configuration detail in the UI. This is transparent to you as a developer. The job runner checks if the component's job can or can not be executed. This feature is automatically set for applications and writers. It's not set for extractors. 
* **dev-branch-job-blocked**: The component is not allowed to run in a development branch under any circumstances.
* **dev-mapping-allowed**: The component is allowed to use a development bucket in the default branch input mapping. Normally, this is not allowed. 

To see what features a component has, you can use the [Developer Portal API](https://kebooladeveloperportal.docs.apiary.io/#reference/0/public-api/get-app-detail) or the [Component List in Storage API](https://keboola.docs.apiary.io/#reference/miscellaneous/api-index/component-list). 

To request a change of your component's features, please contact our support team using the support button in your project. 
