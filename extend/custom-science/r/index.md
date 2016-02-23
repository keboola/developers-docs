---
title: Custom Science R
permalink: /extend/custom-science/r/
---

Multiple approaches to creating R Custom Science application are available, each of which is described below. There are really no known limitations to the architecture 
of your R code. Although we do recommend that you use our [library](https://github.com/keboola/r-docker-application), which provides some useful functions to work
with our [environment](/extend/common-interface/). Please note that regardless of whatever approach you take, the repository of a R application must contain 
script `main.R`. Also note that all result .csv file **must be** written with 
the `row.names = FALSE` option (otherwise KBC cannot read the file because it contains unnamed column). Also note that the output mapping in the application 
is always required, so the application must always produce the tables and files listed in output mapping (even if the files were empty).

## Packages
You can install any package by using `install.packages()`, you can also use `devtools::install_github()` (and friends) to install packages from source. 
When installing packages, use `install.packages('packageName')` (no need to specify the repository). There are some pre-installed packages - you 
can have a look at the [current list](https://github.com/keboola/docker-base-r-packages/blob/master/init.R#L14). For pre-installed packages, 
all you need to do is `library()`. In case you think that there is some standard packages which is very useful and should be always per-installed, let us know.

## Using the KBC package
The [R application package](https://github.com/keboola/r-docker-application) provides functions to:

- read and parse the configuration file and parameters - `configData` property and `getParameters()` method.
- list input files and tables - `getInputFiles()`, `getInputTables()` methods.
- work with manifests containing table and file metadata - `getTableManifest()`, `getFileManifest()`, `writeTableManifest()`, `writeFileManifest()` methods.
- list expected outputs - `getExpectedOutputFiles()` and `getExpectedOutputTables()` methods.

The library is a standard R package, [available on Github](https://github.com/keboola/r-docker-application)
 (install locally with `devtools::install_github('keboola/r-docker-application', ref = 'master')`). In production environment, this package is available by default. 

To use the library and read user-supplied configuration parameter 'myParameter':

    library(keboola.r.docker.application)
    app <- keboola.r.docker.application::DockerApplication$new('/data/')
    app$readConfig()
    app$getParameters()$myParameter
    
The library contains a single [RC class](http://adv-r.had.co.nz/OO-essentials.html#rc) `DockerApplication`, parameter of the constructor is path to data directory. 
Call `readConfig()` to actually read and parse the configuration file. The above would read parameter from user-supplied configuration:

{
    "myParmeter": "myValue"
}

## KBC package integration options

### Simple example
In most simple case you can use code from [R transformation](/???/) to create a simple R script. Name of the script must be `main.R`.
 You can see a sample R script in [our repository](https://github.com/keboola/docs-custom-science-example-r-parameters). 
 This approach is the simplest and quickest to do, but it offers limited options for testing and is generally good only for 
 one-liners (i.e. you have an existing library which does all the work, all you need to do is execute it).
In the example below, we supply value `/data/` to the constructor as the data directory, as that will be always true in 
our [production environment](/extend/common-interface/environment/).   
 
    library('keboola.r.docker.application')

    # intialize application
    app <- DockerApplication$new('/data/')
    app$readConfig()

    # read input
    data <- read.csv("/data/in/tables/source.csv");

    # do something 
    data['double_number'] <- data['number'] * app$getParameters()$multiplier

    # write output
    write.csv(data, file = "/data/out/tables/result.csv", row.names = FALSE)


### Package example
This example shows how an R package can be made to interact with our environment, the code is available in [git repository](https://github.com/keboola/docs-custom-science-example-package.git).
We strongly recommend this approach over the previous [simple example](#simple-example), because it allows much more professional approach. 
Wrapping the application logic into an R package makes testing and portability much easier, specifically:

- You can [write tests](http://r-pkgs.had.co.nz/tests.html) - [Example](https://github.com/keboola/docs-custom-science-example-package/blob/master/tests/testthat/test_main.R)
- You can run tests and application in multiple environments (see below)
- Dependencies are [checked](http://r-pkgs.had.co.nz/namespace.html) and automatically installed 
- Package code is [checked for errors](http://r-pkgs.had.co.nz/check.html)

#### Code
Application entrypoint is [`main.R`](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/main.R) in package root folder. 

    devtools::install_local('/home/')
    library(keboola.r.custom.application)
    doSomething(Sys.getenv("KBC_DATA_DIR"))

This installs the package from `/home/` directory. Includes the package - defined 
in [DESCRIPTION](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/DESCRIPTION#L1) file and 
calls the `doSomething()` function. The package name is arbitrary, but it must correspond to the one defined in `DESCRIPTION` file. 
The availability of the `doSomething()` function is determined by the contents of 
[NAMESPACE](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/NAMESPACE) file. The `NAMESPACE` file is generated
automatically by [Roxygen](https://cran.r-project.org/web/packages/roxygen2/vignettes/roxygen2.html) when you **Check** the 
package in [RStudio](https://cran.r-project.org/web/packages/roxygen2/vignettes/roxygen2.html). 

With this approach you can organize your code and name your functions in any way way to your liking. In the sample repository, the
actual code is contained in the `doSomething()` function in 
the [`R/myPackage.R`](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/R/myPackage.R) file. In the code 
itself, there is no difference to [previous exampl](#simple-example).

#### Tests 
Tests are organized in the [/tests/](https://github.com/keboola/docs-custom-science-example-r-package/tree/master/tests) directory which contains
- subdirectory `data/` which contains pregenerated sample data from [sandbox](/common-interface/sandbox/).
- optional `config.R` file which can be used to set environment for running the tests, it can be created 
by copying [config_template.R](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/tests/config_template.R)
- subdirectory `test_that/` which contains the actual [testthat tests](http://r-pkgs.had.co.nz/tests.html)

You can run the tests localy from RStudio:
 
 ![RStudio tests](/extend/custom-science/r/rstudio-tests.png)
 
 Or you can set them to run automatically on [Travis](https://travis-ci.org/) everytime you push into your git repository. For that you can use the provided 
[travis.yml](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/.travis.yml) file.

For a more thorough tutorial on developing R packages, see the [R packages book](http://r-pkgs.had.co.nz/).


### Package Class Example

Using the Library 

This example shows how you can take advantage of the R docker library, the code is available in git repository. Using the package simplifies working with dynamic input and output mapping and working with table and file metadata. This approach is  useful if you already have your own code and want to use the library features. The sample script is available as non-public application dca-example-r-library. The following component specification is used for the application:
{
  "definition": {
    "type": "builder",
    "uri": "keboola/docker-custom-r",
    "build_options": {
      "repository": {
        "uri": "https://github.com/keboola/r-custom-application-example-library",
        "type": "git"
      },
      "commands": [
        "git clone {{repository}} /home/"
      ],
      "entry_point": "Rscript --verbose --vanilla /home/main.R",
      "version": "0.0.2"
    }
  },
  "process_timeout": 21600,
  "memory": "8192m",
  "configuration_format": "json"
}

Extending the library

This example shows how you can use the R docker library within your own library, the code is available in git repository. Wrapping your application into a package provides nice tools to code testing, portability and deployment. In this example a custom package is created which inherits from the R package class so that it automatically has all the required functions. The sample script is available as non-public application dca-example-r-package. The following component specification is used for the application:
{
  "definition": {
    "type": "builder",
    "uri": "keboola/docker-custom-r",
    "build_options": {
      "repository": {
        "uri": "https://github.com/keboola/r-custom-application-example-package",
        "type": "git"
      },
      "commands": [
        "git clone {{repository}} /home/",
        "R CMD INSTALL --no-multiarch /home/"
      ],
      "entry_point": "Rscript --verbose --vanilla -e 'library(keboola.r.custom.application.example.package)' -e 'app <- CustomApplicationExample$new(\"/data/\")' -e 'app$run()'",
      "version": "0.0.2"
    }
  },
  "process_timeout": 21600,
  "memory": "8192m",
  "configuration_format": "json"
}

 in it's root . See an [example repository](https://github.com/keboola/r-custom-application-transpose).

