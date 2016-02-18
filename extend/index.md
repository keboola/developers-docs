---
title: Extending KBC
permalink: /extend/
---

The KBC environment consists of many [*components*](/architecture) which interoperate together (e.g. Storage, Transformations). Beside the built-in components, you can extend KBC by creating extensions. Currently, there are two types of extensions:

* generic extractor - a specific component designated for implementing extractors for services with REST API;
* custom extension - a component extending KBC with arbitrary code. 

Custom extensions run inside a [docker component](/architecture/docker-bundle), which takes care of: authentication, 
starting and stopping the application, reading and writing data to KBC Storage, and application isolation. 
Custom extensions must adhere to a [common interface](/extend/common-interface). There are two types of Custom extensions differing
in the level of integration and implementation flexibility:

* Custom Science application
* Docker extensions

## Custom Science Application

[Custom Science application](/extend/custom-science) is the quickest way to integrate arbitrary code into KBC. 

Advantages:

* zero developer configuration, only a git repository is needed
* no interaction with Keboola developers needed, no acceptance process needed
* you do not need to work with docker at all 

Disadvantages:

* only predefined envrionments (currently R and Python)
* poor end-user experience when configuring
* application cannot be branded, developer cannot modify application UI

A Custom Science application is in fact a special component wrapping application logic in a git repository. The end-user has to provide a link to your git repository, our system will wrap it and run it as if it were a [docker extension].

### How to create a Custom Science application
As a developer, you need to implement the application logic in Python or R.
The application must adhere to our [Docker Interface](/extend/common-interface/). We provide libraries to help you with that.
Few additional language specific requirements may apply (e.g., an R application must have a `main.R` file) - see the [detailed guide](/extend/custom-science/). 

Then you need to instruct the end user to create a new configuration of the *Custom Science application*
 (with the specific language variant). In the configuration, the user will enter link to your git repository 
 (and optionally credentials), and then he can provide specific application configuration.

### Summary:
The developer has to:

* create git repository (and follow the rules)
* give the end-user repository address and tag, optional credentials and optional configuration
* instruct the end-user

The user has to:

* create configuration of Custom science application
* enter repository URL and code version and optionally credentials in runtime configuration field
* optionaly enter JSON configuration in the configuration field

## Docker extension

[Docker extensions](/extend/docker/) provide maximum implementation flexibility but it requires the most implementation effort from you.   

Advantages:

* you need to fill application checklist, Keboola must accept the application
* application UI can be customized (input/output mapping) and branded, documentation and extended description can be provided
* the application can be registered as Application, Extractor or Writer
* the application will be automatically offered to all KBC users
* application environment is completely up to you, it can also be fully private
* standard (customizable) UI for Custom applications can be used, or your own UI can be used
* can be used as extractor/writer/application

Disadvantages:

* the application must be registered by Keboola
* you need to maintain your own Docker image (on dockerhub or Quay)

### How to create a docker extension
As a developer you need to create your own docker image and create the application logic (in the environment of the docker image) 
and the application must follow our [Docker Interface](/extend/common-interface/). 
For the docker image you should base it on an existing base docker image (preferably one of ours) and create the application
logic (in the envrionment of the docker image). If you are using environments
supported by [Custom Science applications](/extend/custom-science/), you can use the [libraries]() 
provided for them. Then prepare the [checklist](/extend/registration/checklist/) and contact us so 
that we register your application. See the [detailed guide](/extend/docker/docker-extensions).

### Summary:
The developer has to:

* create git repository (and follow the rules)
* create quay or dockerhub repository
* give Keboola the [checklist](/extend/registration/checklist/) and wait for the application to be registered

The user has to:

* create configuration of the application as if it were any other KBC component
