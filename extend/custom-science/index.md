---
title: Custom Science Extensions
permalink: /extend/custom-science/
---
A Custom Science extension can be used to create Extractors, Applications and Writers. 
As a special component wrapping an application logic in a public or private git repository, it is the simplest, quickest, and at the same time somewhat limited, extension of KBC. 

The end-user has to provide a link to your git repository, our system will wrap the code and run it.

A Custom Science extension can be created either for a particular end-user, or it may be offered to all KBC customers, in which case it has to be [registered](/extend/registration/) in KBC App Store.

Advantages:

* Zero developer configuration; only a git repository is needed.
* No interaction with Keboola developers is needed. No acceptance process.
* No knowledge of Docker is required.

Disadvantages:

* Predefined environments only (currently R and Python)
* Poor end-user experience when configuring
* Extensions cannot be branded
* The UI cannot be modified by the developer

For comparison with other customization options, see the [overview](/extend/) of KBC extensions.
Note: Under the hood, Custom Science are implemented as [Docker extensions](/extend/docker/). You are only required
to provide the application logic without having to maintain the Docker images.

### How to Create a Custom Science Extension

As a developer, you need to implement the application logic in Python or R and store it in a git repository. 
The extension must adhere to our [Common Interface](/extend/common-interface/). 
We provide libraries to help you with that. 
Few additional language specific requirements may apply (e.g. an R extension must have a `main.R` file) - see the [detailed guide](/extend/custom-science/development/). 

Applications process input tables stored in [CSV files](/extend/common-interface/folders/) and generate result tables in CSV files. 
Extractors work the same way. However, instead of reading their input from KBC tables, they get it from an external source (usually an API). 
Similarly, Writers do not generate any KBC tables.
We make sure the CSV files are created in and taken from the right places. 

The execution of your extension happens in its own [isolated environment](/overview/docker-bundle/).

To use your *Custom Science extension*, the end user should be instructed to specify its configuration. 
Make sure your instructions are publicly available. Draw inspiration from the
[instructions](https://github.com/keboola/python-custom-application-text-splitter/blob/master/README.md)
for our sample applications:

- [Python Text Splitter](https://github.com/keboola/python-custom-application-text-splitter).
- [R Tree Level Computation](https://github.com/keboola/r-custom-application-tree).
- [R Transpose Table](https://github.com/keboola/r-custom-application-transpose).

To create a simple Custom Science Application on your own, go to [Quick Start Guide](/extend/custom-science/quick-start/).

To learn more, go to [Development Guide](/extend/custom-science/development/) .


## Custom Science Applications vs. Transformations
The code of most R and Python Transformations can be used in Custom Science Applications and vice versa with none or very few modifications.
The KBC interfaces for Custom Science Application and Transformations are highly similar. 

### Usage Differences:

- The code in Transformations is visible to everyone in the KBC project. 
The Custom Science Application code (similarly to the [Docker extension](/extend/docker/)) can be hidden by using a private repository.

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

- In Python and R Transformations, external packages are installed automatically. In Custom Science Applications, you need to install them explicitly. 

