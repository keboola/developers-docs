---
title: Extending KBC
permalink: /extend/
---

The KBC environment consists of many built-in [*components*](/architecture) which interoperate together (e.g. Storage, Transformations and Readers). You can also create KBC extensions. Currently, there are two types of extensions available:

* Generic extractor - a specific component designated for implementing extractors for services with REST API
* Custom extension - a component extending KBC with arbitrary code

Custom extensions can be used as Extractors, Writers and Applications. They run inside a [Docker component](/architecture/docker-bundle) which takes care of: 

* authentication
* starting and stopping the application 
* reading and writing data to KBC Storage
* application isolation

They must adhere to a [common interface](/extend/common-interface). 

There are two types of Custom extensions differing in the level of integration and implementation flexibility:

* Custom Science application - easier to implement, less features available
* Docker extension


The following table provides an overview of the main characteristics of KBC extensions:

<table>
  <thead>
    <tr>
      <th rowspan="2">KBC EXTENSIONS</th>
      <th colspan="3" style="text-align: center;">Implementation</th>
      <th colspan="4" style="text-align: center;">User Features</th>
      <th style="text-align: center;">Other</th>
    </tr>
    <tr>
      <th>Implementation Complexity</th>
      <th>Application Environment</th>
      <th>Knowledge of Docker Required</th>
      <th>Setup User Experience</th>
      <th>Brandable</th>
      <th>Offered to All Users</th>
      <th>Customizable User Interface</th>
      <th>Keboola Approval/Registration Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Generic Extractor</th>
      <td>very easy</td>
      <td>configuration only</td>
      <td>no</td>
      <td>poor</td>
      <td>no<br>(coming soon)</td>
      <td>no<br>(coming soon)</td>
      <td>no</td>
      <td>no</td>
    </tr>
    <tr>
      <th>Custom Science</th>
      <td>easy</td>
      <td>R or Python</td>
      <td>no</td>
      <td>poor</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
    </tr>
    <tr>
      <th>Docker</th>
      <td>medium</td>
      <td>any</td>
      <td>yes</td>
      <td>fully customizable</td>
      <td>yes</td>
      <td>yes</td>
      <td>yes</td>
      <td>yes</td>
    </tr>
  </tbody>
</table>

*Note: With the exception of Generic Extractor, all KBC Extensions can be used for creating Extractors, Applications and Writers.*

## Custom Science Application

A  [Custom Science application](/extend/custom-science) is a special component wrapping application logic in a git repository. The end-user has to provide a link to your git repository, our system will wrap it and run it as if it were a [Docker extension].

Using the Custom Science application is the quickest way to integrate an arbitrary code into KBC. 

Advantages:

* Zero developer configuration, only a git repository is needed
* No interaction with Keboola developers needed, no acceptance process 
* No use of Docker

Disadvantages:

* Predefined environments only (currently R and Python)
* Poor end-user experience when configuring
* Applications cannot be branded
* The application UI cannot be modified by the developer



### How to Create a Custom Science Application
As a developer, you need to implement the application logic in Python or R. The application must adhere to our [Docker Interface](/extend/common-interface/). We provide libraries to help you with that. Few additional language specific requirements may apply (e.g., an R application must have a `main.R` file) - see the [detailed guide](/extend/custom-science/). 

To use your *Custom Science application*, the end user should be instructed to specify its configuration (with the specific language variant): enter the address and tag of the application git repository (with credentials if necessary), and any additional application-specific configuration.

#### Summary
* The developer has to place the application into a git repository

* The end-user has to configure the Custom science application by entering:

  * the repository address and code version (repository credentials if necessary) in the runtime configuration field
  * any application-specific configuration as JSON in the configuration field

## Docker Extension

The [Docker extension](/extend/docker/) allows for maximum implementation flexibility. At the same time, significant implementation effort is required.   

Advantages:

* UI can be customized (input/output mapping) 
* Standard (customizable), or your own UI  can be used
* Can be branded; Documentation and extended description can be provided
* Application environment is completely up to you, it can also be fully private
* Automatically offered to all KBC users

Disadvantages:

* An application checklist must be completed; Keboola must accept the application
* Registration by Keboola is mandatory
* You need to maintain your own Docker image (on dockerhub or Quay)

### How to Create a Docker Extension
As a developer, you need to create your own Docker image and create the application logic in its environment. The application must follow our [Docker Interface](/extend/common-interface/). 
The Docker image should be based on an existing base Docker image, preferably one of ours. If you are using environments supported by [Custom Science applications](/extend/custom-science/), you can use the [libraries]() provided for them. Then prepare the [checklist](/extend/registration/checklist/) and contact us so that we register your application. See the [detailed guide](/extend/docker/docker-extensions).

#### Summary
* The developer has to place the application into a git repository, create a quay or dockerhub repository, and complete Keboola's [checklist](/extend/registration/checklist/) in order for the application to be registered.

* The user has to configure the application as if it were any other KBC component.

