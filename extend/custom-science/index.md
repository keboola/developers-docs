---
title: Custom Science
permalink: /extend/custom-science/
---

Custom Science is an application which allows the end-user to use an arbitrary git repository as a data manipulation tool in their project. The Custom Science application is the simplest (and somewhat limited) extension of KBC. Creating a Custom Science application requires no interaction with Keboola. See the [overview](/extend/) for comparison with other customization options.

In Custom Science, all your application has to do is process tables storing input CSV files and produce result tables in [CSV files](/extend/common-interface/). We make sure that the CSV files are created in and taken from the right places. We also make sure that your application is executed in its own [isolated environment](/architecture/docker-bundle/).

Custom Science is designed to fulfill the direct agreement between the end-user and the developer. However, if you want to offer your code to all KBC customers, you can have your application registered in KBC App Store. 
See the [registration process](/extend/registration/).

- [Quick start guide](/extend/custom-science/quick-start/)
- [Development guide](/extend/custom-science/development/) 

## Comparison to Transformations
Most R and Python transformations can be turned into Custom Science and vice versa with none or very 
few modifications. The KBC interface and the code used in a Custom Science application are highly 
similar to those used in Transformations. 

### Usage Differences:
- The code in Transformations is visible to everyone in the KBC project. The Custom Science code can be stored in a private repository. To hide your code, use Custom Science (or the Docker extension).

- The Transformation code is tied to a specific project. To share the code across different projects, use Custom Science (or the Docker extension).

-  Transformations are versioned as changes in configuration in the KBC project. Custom Science applications (as is the Docker extension) are versioned externally (using tags in a git repository).

### Technical Differences:
- There is a slight difference in the file input mapping. In Transformations, tags can be selected. They will be used to select files from file uploads and moved to the `in/user` directory where only the latest file with the given tag is stored. This is a simplified version of working with input files which is not available in Custom Science. To select files with some tags from file uploads, set the tag in the input files setting UI. To select the latest file with a given tag, you have to use the file manifests.
 
- The docker images in which the applications run are not exactly the same. Although they are based 
on the same parent image, if you want to make an exact replica of the environment, make sure to use the correct image.

- Custom Science applications can be parametrized. Transformations have no parameters.

- In Python and R transformations, external packages are installed automatically. In Custom applications, you need to install them issuing the respective command. 

