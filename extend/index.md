---
title: Extending KBC
permalink: /extend/
---

## Extend

## Extending KBC is possible thru three basic options:
- generic extractor
- custom science application
- docker extensions
Each of those offers different levels of integration with KBC, different implementation flexibility and different comfort for the end-user. Generic extractor is a specific components designated only for implementing extractos of services with API. Custom science application and docker extensions both allow extending KBC with arbitrary code, they both share [common interface], but offer different levels of integration and implementation flexibility. They both run inside [docker component].  Docker Component takes care of: authentication, starting and stopping the application, reading and writing data to KBC Storage, and application isolation. The component also defines the [common interface interface] which a Custom application must adhere to.

## Generic extractor
Generic extractor can be used to implement an extractor for many services with well defined API. 

## Custom science application
Custom Science application is the quickest way to integrate arbitrary code into KBC. 
(Dis)Advantages:
+ zero developer configuration, only a git repository is needed
+ no interaction with Keboola developers needed, no acceptance process needed
+ you do not need to work with docker at all 
- only predefined envrionments (currently R and Python)
- poor end-user experience when configuring
- application cannot be branded, developer cannot modify application UI

A Custom Science application is in fact a special component created by us, which acts as a simple wrapper around a git repository. This means that the end-user has to provide to the git repository, and our system will wrap it and run it as if it were a [docker extension].

How to create a Custom Science application
As a developer you need to create the application logic (in the supported language) and the application must follow our [Docker Interface](). Generally we provide libraries which should help you in doing that. Apart from the interface rules, few additional language speficic requirements may apply (such as that there must be a `main.R` file) - see the [detailed guide](/extend/custom-science/). 

Then you need to instruct the end user you need to create a new configuration of the "Custom Science application" (with the specific language variant). In the configuration, the user will enter link to your git repository (and optionally credentials), and then he can provide specific application configuration.

Summary:
The developer has to:
- create git repository (and follow the rules)
- give the end-user repository address and tag, optional credentials and optional configuration
- instruct the end-user

The user has to:
- create configuration of Custom science {} application
- enter repository URL and code version and optionally credentials in runtime configuration field
- optionaly enter JSON configuration in the configuration field


#### Docker extension

How to create a Custom Science application
As a developer you need to choose an existing base docker image (preferably one of ours) and create the application logic (in the envrionment of the docker image) and the application must follow our [Docker Interface](). If you are using environments supported by [Custom Science applications](), you can use the [libraries]() provided for them. You then need to provide application run command (e.g. `php myapp.php`) and optionaly initialization commands (e.g. `composer install`). Then prepare the [checklist]() and contact us so that we register your application.

Summary:
The developer has to:
- create git repository (and follow the rules)
- give Keboola the [checklist]() and wait for the application to be registered

The user has to:
- create configuration of the application as if it were any other KBC component


## Docker extension
Docker extension provides maximum implementation flexibility but it requires the most implementation effort from you. 
(Dis)Advantages:
+ you need to fill application checklist, Keboola must accept the application
+ application UI can be customized (input/output mapping) and branded, documentation and extended description can be provided
+ the application can be registered as Application, Extractor or Writer
+ the application will be automatically offered to all KBC users
+ application envrionment is completely up to you, it can also be fully private
+ standard (customizable) UI for Custom applications can be used, or your own UI can be used
+ can be used as extractor/writer/application
- the application must be registered by Keboola
- you need to maintain your own Docker image (on dockerhub or Quay)

How to create a docker extension
As a developer you need to create your own docker image and create the application logic (in the envrionment of the docker image) and the application must follow our [Docker Interface](). Then prepare the [checklist]() and contact us so that we register your application. See the [detailed guide](/extend/docker/docker-extensions)

Summary:
The developer has to:
- create git repository (and follow the rules)
- create quay or dockerhub repository
- give Keboola the [checklist]() and wait for the application to be registered

The user has to:
- create configuration of the application as if it were any other KBC component
