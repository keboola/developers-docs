---
title: Environment Specification
permalink: /extend/common-interface/environment/
---

* TOC
{:toc}

Components use several [channels](/extend/common-interface/) to exchange information with Keboola Connection,
primarily [structured folders](/extend/common-interface/) and [configuration files](/extend/common-interface/config-file/).
Each component has full access to the outside network (network type `bridge`), unless changed to `none` in 
[Developer portal](https://components.keboola.com).
Additional parts of the environment in which your component is executed are specified below.

## Environment Variables
The following environment variables are injected in the container:

 - `KBC_DATADIR`: This is always `/data/` in KBC; use this environment variable during component
 development to create development and testing environments.
 - `KBC_RUNID`: RunId from Storage; it couples all events within an API call (use this for logging)
 - `KBC_PROJECTID`: Id of the project in KBC within a [KBC stack](/overview/api/#regions-and-endpoints).
 - `KBC_STACKID`: Id of the [KBC stack](/overview/api/#regions-and-endpoints).
 - `KBC_CONFIGID`: Id of the configuration or hash of configuration data if the configuration
 is not named (`configData` was used in
 [API call](https://kebooladocker.docs.apiary.io/#reference/run/create-a-job/run-job)).
 - `KBC_COMPONENTID`: Id of the component
 - `KBC_CONFIGROWID`: Id of the configuration row if available.
 - `KBC_BRANCHID`: Id of the [development branch](https://keboola.docs.apiary.io/#reference/development-branches/branches).
 - `KBC_STAGING_FILE_PROVIDER`: Either `aws` or `azure` depending on which kind of [Stack](/overview/api/#regions-and-endpoints) the container is running. The value refers to the file storage used during [file import end export operations](https://developers.keboola.com/integrate/storage/api/import-export/).
 - `KBC_PROJECT_FEATURE_GATES`: Comma separated list of feature gates activated for the current project. Feature gates are considered internal and they may disappear without notice. We recommend that you check with our support before relying on any feature gates.
 
 The following variables are available only if "Forwards token" and "Forwards token details" are
 enabled in [component configuration](https://components.keboola.com/) (and approved by us):

 - `KBC_PROJECTNAME`: Name of the project in KBC.
 - `KBC_TOKENID`: Id of the token running the container.
 - `KBC_TOKENDESC`: Description (user name or token name) of the token running the container.
 - `KBC_TOKEN`: The actual token running the container.
 - `KBC_URL`: The Storage API URL.
 - `KBC_REALUSER`: Id of the user provided by a [SAML](https://en.wikipedia.org/wiki/Security_Assertion_Markup_Language) authentication.

The following variables are available when [GELF Logger](/extend/common-interface/logging/#gelf-logger) is enabled in the
[component configuration](https://components.keboola.com/):

- `KBC_LOGGER_ADDR`: IP address of GELF server
- `KBC_LOGGER_PORT`: Port of the GELF server

## Return Values
The script defined in Dockerfile [`ENTRYPOINT` or `CMD`](/extend/component/docker-tutorial/howto/) should provide an exit status. The
following rules apply:

- `exit code = 0`  The execution is considered successful.
- `exit code = 1`  The execution fails with a *User Error*;
the contents of both STDOUT and [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29)
will be sent to Storage API Events.
- `exit code > 1`  The execution fails with an *Application Error*
and the contents of both STDOUT and STDERR will be sent to internal logs.

It is possible to modify the above behavior so that regardless of the exit code, all errors are User Errors.
This is done by setting `no_application_errors` in [component configuration](https://components.keboola.com/).
See the [implementation notes](/extend/component/implementation/) for tips on distinguishing 
between a *User Error* and *Application Error*.
