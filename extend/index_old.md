---
title: Extend
permalink: /extend/
---

## Extend

  - Generic extractor
  - Custom applications
  - Docker components
  - [Interface](/extend/interface/)

## Applications
[Data Manipulations]() in KBC is usualy done with [Transformations](). If the data transformations are going to be reused in multiple projects, or if they are considerably complex they should be converted to [Applications](). Applications share many common properties with transformations. The main difference is that Applications do not allow direct modification of the transformation code (SQL, R), rather they do contain some predefined transformation code (logic) which can be modified to some extent by creating *Application Configuration*.

^^^ tenhle odstavec by mel jit asi spis do help.keboola.com?


## Custom applications
The KBC environment is composed of many *components* which interoperate together (e.g. Storage, Transformations). Beside those (built-in) components, you can extend KBC by using (or creating) *Custom applications*. There are multiple options how a custom application can be created, but it always runs inside our [Docker Component](docker-bundle). Custom applications should not be confused with [Appliations](see above) in KBC UI. While it is true, that most Applications in KBC UI are implmented as Custom applications, it's purely UI distinction. A Custom application can be marked as Writer or Extractor or Application and is therefore a generic way to extend KBC envrionment.

While there are various options how a Custom application can be implemented, they all share some common features. As mentioned above, the application itself runs inside our [Docker Component](). The Docker Component takes care of: authentication, starting and stopping the application, reading and writing data to KBC Storage, and application isolation. The component also defines a simple interface which a Custom application must adhere to.

### Common Custom applications properties
Our Docker component takes care of some things, which means that the Custom application itself is simpler and generally more secure.
- authentication - The docker component makes sure that the application is run by authorized users/tokens, It is not possible to run an application anonymously. The application will does not have access to the KBC token itself, and only limited information about the project or end-user.
- starting and stopping the application - The docker component will boot a docker container which contains the application. This ensures that the applications runs in precisely defined environment which is guaranteed to be same for each application run (no application state is presrved)
- reading and writing data to KBC storage - The docker component ensures that the application will only receive the input mapping defined by end-user, and that it will write to the project only those outputs defined in output mappping by the end-user. This makes sure that a custom application cannot access arbitrary data in project.
- application isolation - each application is run in it's own docker container which is isolated from other containers, the application cannot be affected by other running applications. The application may also be limited to have no network access.

### Implementation options
There are various ways how a Custom application can be implemented:
- custom science application
- custom application
- docker application
All of these are similar in implementation, but they offer different tightness of KBC integeration and different experience for end-user.


#### Custom science application
Custom Science application is the quickest way to integrate arbitrary code into KBC. 
(Dis)Advantages:
+ zero developer configuration, only a git repository is needed
+ no interaction with Keboola developers, no acceptance process 
+ you do not need to work with docker at all 
- only predefined envrionments (currently R and Python)
- poor end-user experience when configuring
- application cannot be branded, developer cannot modify application UI

A Custom Science application is in fact a special custom application created by us, which acts as a simple wrapper around a git repository. This means that the end-user has to provide to the git repository, and our system will wrap it and run it as if it were a custom application.

How to create a Custom Science application
As a developer you need to create the application logic (in the supported language) and the application must follow our [Docker Interface](). Generally we provide libraries which should help you in doing that. Apart from the interface rules, few additional language speficic requirements may apply (such as that there must be a `main.R` file) - see the language section for that. The code in the repository must be tagged, [Semantic Versioning]() is recommended.

Then you need to instruct the end user you need to create a new configuration of the "Custom Science application" (with the specific language variant). In the configuration, the user will enter link to your git repository (and optionally credentials), and then he can provide specific application configuration.

Summary:
The developer has to:
- create git repository (and follow the rules)
- give the end-user repository address and tag, optional credentials and optional configuration
- instruct the end-user

The user has to:
- create configuration of Custom science {} application
- enter repository URL and code version and optionally credentials in runtime configuration field
- optional enter JSON configuration in the configuration field

#### Custom application
Custom application is a good compromise between implementation flexibility and implementation effort. 
(Dis)Advantages:
+ you need to fill application checklist, Keboola must accept the application
+ application UI can be customized (input/output mapping) and branded, documentation and extended description can be provided
+ the application can be registered as Application, Extractor or Writer
+ the application will be automatically offered to all KBC users
- the application must be registered by Keboola
- you should have a basic understanding of Docker
- more predefined envrionments (you can use any existing Keboola Docker image (see those prefixed base-xxx), you don't need to create your own docker image)

How to create a Custom Science application
As a developer you need to choose an existing base docker image (preferably one of ours) and create the application logic (in the envrionment of the docker image) and the application must follow our [Docker Interface](). If you are using environments supported by [Custom Science applications](), you can use the [libraries]() provided for them. You then need to provide application run command (e.g. `php myapp.php`) and optionaly initialization commands (e.g. `composer install`). Then prepare the [checklist]() and contact us so that we register your application.

Summary:
The developer has to:
- create git repository (and follow the rules)
- give Keboola the [checklist]() and wait for the application to be registered

The user has to:
- create configuration of the application as if it were any other KBC component


#### Docker application
Docker application provides maximum implementation flexibility but it requires the most implementation effort from you. 
(Dis)Advantages:
+ you need to fill application checklist, Keboola must accept the application
+ application UI can be customized (input/output mapping) and branded, documentation and extended description can be provided
+ the application can be registered as Application, Extractor or Writer
+ the application will be automatically offered to all KBC users
+ application envrionment is completely up to you, it can also be fully private
+ standard (customizable) UI for Custom applications can be used, or your own UI can be used
- the application must be registered by Keboola
- you need to maintain your own Docker image (on dockerhub or Quay)

How to create a Custom Science application
As a developer you need to create your own docker image and create the application logic (in the envrionment of the docker image) and the application must follow our [Docker Interface](). Then prepare the [checklist]() and contact us so that we register your application.

Summary:
The developer has to:
- create git repository (and follow the rules)
- create quay or dockerhub repository
- give Keboola the [checklist]() and wait for the application to be registered

The user has to:
- create configuration of the application as if it were any other KBC component
