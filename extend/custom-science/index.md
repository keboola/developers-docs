---
title: Custom Science
permalink: /extend/custom-science/
---
## Custom Science Extension

A Custom Science extension can be used for creating Extractors, Applications and Writers. 
As a special component wrapping an application logic in a public or private git repository, it is the simplest, quickest, and at the same time somewhat limited, extension of KBC. 

The end-user has to provide a link to your git repository, our system will wrap the code and run it.

A Custom Science extension can be created either for a particular end-user, or it may be offered to all KBC customers, in which case it has to be [registered](/extend/registration/) in KBC App Store.

Advantages:

* Zero developer configuration, only a git repository is needed
* No interaction with Keboola developers needed, no acceptance process 
* No knowledge of Docker required

Disadvantages:

* Predefined environments only (currently R and Python)
* Poor end-user experience when configuring
* Extensions cannot be branded
* The UI cannot be modified by the developer

For comparison with other customization options, see the [overview](/extend/) of KBC extensions.
Note: Custom science are internally implemented as [Docker extensions](/extend/docker/), in which you are only required
to provide the application logic, without having to maintain the docker images.

### How to Create a Custom Science Extension

As a developer, you need to implement the application logic in Python or R and store it in a git repository. 
The extension must adhere to our [Common Interface](/extend/common-interface/). 
We provide libraries to help you with that. 
Few additional language specific requirements may apply (e.g. an R extension must have a `main.R` file) - see the [detailed guide](/extend/custom-science/development/). 

A Custom Science Application processes input tables stored in [CSV files](/extend/common-interface/) and generates result tables in CSV files. A Custom Science Extractor works the same way, however, it does not read input from KBC tables, but instead from its source. Similarly, a Custom Science Writer does not generate any KBC tables. We make sure the CSV files are created in and taken from the right places. 

The execution of your extension happens in its own [isolated environment](/architecture/docker-bundle/).

To use your *Custom Science extension*, the end user should be instructed to specify its configuration. 
The instructions should be on a public link, you can take inspiration from 
[instructions](https://github.com/keboola/python-custom-application-text-splitter/blob/master/README.md)
to our [sample application](https://github.com/keboola/python-custom-application-text-splitter). 


To create a simple Custom Science Application on your own, go to [Quick start guide](/extend/custom-science/quick-start/).

To learn more, go to [Development guide](/extend/custom-science/development/) .





## Custom Science Applications vs. Transformations
The code of most R and Python transformations can be used in Custom Science Applications and vice versa with none or very few modifications.
The KBC interfaces for Custom Science Application and Transformations are highly similar. 

### Usage Differences:

- The code in Transformations is visible to everyone in the KBC project. 
The Custom Science Application code (similarly to the [Docker extension]) can be hidden by using a private repository.

- The Transformation code is tied to a specific project. To share the code across different projects, 
use Custom Science Application (or the Docker extension).

-  Transformations are versioned as changes in the configuration in the KBC project. 
Custom Science Applications (as is the Docker extension) are versioned externally (using tags in a git repository).

### Technical Differences:

- There is a difference in working with input files originating in file uploads. 
Both components select files based on tags, but there is a difference in the way the most recent file with a given tag is accessed.
At each Transformation run, the most recent file is automatically copied to the `in/user` directory.
In Custom Science Application, this feature is not available. 
You have to select the most recent file based on the upload time stored in each file's manifest.
 
- Custom Science Applications can be parametrized. Transformations have no parameters.

- In Python and R transformations, external packages are installed automatically. In Custom Science Applications, you need to install them explicitly. 

