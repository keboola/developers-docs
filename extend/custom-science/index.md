---
title: Custom Science
permalink: /extend/custom-science/
---

Custom science is an application which allows the end-user to use an arbitrary git repository as a data manipulation 
tool in his project. Custom science application allows the easiest (and somewhat limited) extension of KBC. Creating 
a custom science application requires no interaction from Keboola. See the [overview](/extend/) for comparison with 
other customization options.
In custom science, all your application has to do is process tables stored input CSV files and produce result tables 
in [CSV files](/extend/common-interface/). We make sure that the CSV files are created in and taken from the right 
places and [we also make sure](/architecture/docker-bundle/) that your application is executed in it's own isolated environment.

Custom science is designed to fullfill direct agreement between enduser and developer. However, if you want 
to offer your code to all KBC customers, you can have your application registered in our KBC App store. 
See the [registration process](/extend/registration/).

- [Quick start guide](/extend/custom-science/quick-start/)
- [Development guide](/extend/custom-science/development/) 

## Comparison to Transformations
Most R and Python transformations can be turned into science application and vice versa with none or very 
few modifications. The KBC interface and the code used in custom science application is highly 
similar to the one used in transformations. 

### Usage differences:
- Code in transformations is visible to everyone in the KBC project. In Custom Science, the code can be 
stored in private repository. In case you need to hide your code, you have to use Custom Science.
- Code in transformation is tied to project. If you want to share the code across diferent 
projects, you must use Custom Science.
- Custom science applications are versioned externally (using tags in git repository), transformations are
 versioned as changes in configuration in the KBC project.

### Technical diffrences:
- File input mapping is slightly different. In transformations, there is the option to select tags, which
will be used to select files from file uploads and moved to in/user directory where only the latest file 
with the given tag is stored. This is a simplified version of working with input files which is not available
 in Custom science. To select files with some tags from file uploads, set the tag in 
 input files setting UI. To select the latest file with a given tag, you have to use the file manifests.
- The docker images in which the applications run are not exactly the same. Although they are based 
on same parent image, if you want to make an exact replica of the environment, make sure to use the correct image.
- Custom science applications can be parametrized, Transformations have no parameters.
- In Python and R transformations, the external packages are installed automatically, 
in Custom applications you need to install them issuing the respective command. 
