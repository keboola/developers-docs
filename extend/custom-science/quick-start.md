---
title: Quick Start
permalink: /extend/custom-science/quick-start/
---

* TOC
{:toc}

This tutorial guides you through the process of creating a simple Custom Science Application. The application logic is trivial: it takes a table with numbers as an input, and creates another table with an extra column containing those numbers multiplied by two. A test in KBC is included. The application is then extended to accept a parameter from the end-user.

The tutorial has been written for [R](/extend/custom-science/r/); changes
necessary for [Python](/extend/custom-science/python/) are minimal.

### Before you start

You should have a [KBC project](/overview/devel-project/), where you can test your code.

### Step 1 -- Preliminaries
Create a public git repository ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, although any other host should work as well).

### Step 2 -- Application Code
In the root of your repository, create the main application file [`main.R`](https://github.com/keboola/docs-custom-science-example-r-basic/blob/master/main.R). (In Python Custom Science App, the analogous file would be called `main.py`):

    # read input
    data <- read.csv("/data/in/tables/source.csv");

    # do something
    data['double_number'] <- data['number'] * 2

    # write output
    write.csv(data, file = "/data/out/tables/result.csv", row.names = FALSE)

### Step 3 -- Commit and Tag
Commit to the repository and tag it with a [git tag](https://git-scm.com/book/en/v2/Git-Basics-Tagging) (Github release), such as `0.0.1`.
Tagging each version is essential; we recommend using [Semantic versioning](http://semver.org/).

{: .image-popup}
![Github tag screenshot](/extend/custom-science/repository-tag.png)

### Step 4 -- Test the Application in KBC

#### Step 4.1 -- Prepare Storage
Create a [source table](/extend/source.csv) in *Storage*, e.g.:

{:.table}
| number | someText |
| -------- | --- |
| 10 | ab |
| 20 | cd |
| 25 | ed |
| 26 | fg |
| 30 | ij |

Name of the table in *Storage* is not important. Let's name it **in.c-main.custom-science-example**.

For instructions on how to create a table, go to [KBC Tutorial](https://help.keboola.com/overview/tutorial/load/).

The bucket to write the output of the application to has to exist.
We will use the **out.c-main** bucket.
The output table will be created automatically.

#### Step 4.2 -- Create the Application
Go to *Applications* -- *New Application* -- *Custom Science R*, and press *Add configuration* in which you will set the input and output mapping and repository as explained below.

#### Step 4.3 -- Input Mapping
To test the application, use the **in.c-main.custom-science-example** sample table as input. Make sure to set
the input mapping name to **source.csv** -- that is what we expect in
the [sample script](https://github.com/keboola/docs-custom-science-example-r-basic/blob/master/main.R#L2).

{: .image-popup}
![Input mapping configuration](/extend/custom-science/input-mapping.png)

#### Step 4.4 -- Output Mapping
The same goes for output mapping: make sure to map from **result.csv** (the result of your [sample script](https://github.com/keboola/docs-custom-science-example-r-basic/blob/master/main.R#L8)) to whatever output table you want to, let's say **out.c-main.custom-science-example**.

Leave *File input mapping* empty.


#### Step 4.5 -- Configuration
Leave *parameters* empty for now. In *Runtime parameters* enter the the configuration of the repository.
This must be entered as a [JSON formatted](http://www.w3schools.com/json/json_syntax.asp) string.

    {
        "repository": "https://github.com/keboola/docs-custom-science-example-r-basic",
        "version": "0.0.2"
    }

{: .image-popup}
![Application configuration example](/extend/custom-science/configuration.png)

#### Step 4.6 -- Run the Application
By running the above configuration, you should obtain a table **out.c-main.custom-science-example** with the following data:

{:.table}
number | someText | double_number
--- | --- | ---
10 | ab | 20
20 | cd | 40
25 | ed | 50
26 | fg | 52
30 | ij | 60


## Adding Parameters

You can pass the application an arbitrary set of parameters.
As an example, we will extend the application from the previous tutorial by allowing the user to specify the multiplier.

### Step 1 -- Code

    # initialize application
    library('keboola.r.docker.application')
    app <- DockerApplication$new('/data/')
    app$readConfig()

    # read input
    data <- read.csv("/data/in/tables/source.csv");

    # do something
    data['double_number'] <- data['number'] * app$getParameters()$multiplier

    # write output
    write.csv(data, file = "/data/out/tables/result.csv", row.names = FALSE)

In the above example, we take advantage of our [KBC Docker R library](/extend/custom-science/r/) to work easily with the [configuration format](/extend/common-interface/config-file/). There is also a variant for [Python](/extend/custom-science/python/) available.

### Step 2 -- Commit and Tag

Commit the code and don't forget to create a new tag in the repository.

### Step 3 -- Test the Application in KBC

Enter the configuration in the parameters field:

    {
        "multiplier": 10
    }

Enter the repository in the runtime field:

    {
        "repository": "https://github.com/keboola/docs-custom-science-example-r-parameters",
        "version": "0.0.2"
    }


Note that the configuration format is arbitrary and there is no validation.
Implement parameter validation in your script, otherwise the end-user may receive confusing error messages.

The following screenshot summarizes all the necessary end-user configuration:

{: .image-popup}
![Application configuration with parameters example](/extend/custom-science/configuration-2.png)


## Dynamic Input and Output Mapping
In the above example, we used static input/output mapping which means that the names of CSV files are
hard-coded in the application script. There are two potential problems with this:

- the end-user has to manually set those names
- the end-user has to create the input/output mapping for each source and result file

Depending on your use case this may or may not be a problem. In case you want to use
dynamic input mapping, consult the [development guide](/extend/custom-science/development/).
If your application is more complex, go to [Docker extensions](/extend/docker).
