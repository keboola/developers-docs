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

You can obtain inline help and list of library function with by running command `?DockerApplication`.

### Dynamic Input/Output mapping 
In the [previous examples](/extend/custom-science/quick-start/) we have shown applications which have hardcoded
names of input/output tables. This example shows how to read input and output mapping specified by the end-user, 
which is accessible in the [configuration file](/extend/common-interface/config-file/). The example below demonstrates
how to read and write tables and table manifests. File manifests are handled the same way. For a full authoritative list
of items returned in table list and manifest contents, see [the specification](/extend/common-interface/config-file/) 
    
    # intialize application
    app <- DockerApplication$new('/data/')
    app$readConfig()
    
    # get list of input tables
    tables <- app$getInputTables()
    for (i in 1:nrow(tables)) {
        # get csv file name 
        name <- tables[i, 'destination'] 
        
        # get csv full path and read table data
        data <- read.csv(tables[i, 'full_path'])
        
        # read table metadata
        manifest <- app$getTableManifest(name)
        if ((length(manifest$primary_key) == 0) && (nrow(data) > 0)) {
            # no primary key present, create one
            data[['primary_key']] <- seq(1, nrow(data))
        } else {
            data[['primary_key']] <- NULL
        }
        # do something clever
        names(data) <- paste0('batman_', names(data))
        
        # get csv file name with full path from output mapping
        outName <- app$getExpectedOutputTables()[i, 'full_path']
        # get file name from output mapping
        outDestination <- app$getExpectedOutputTables()[i, 'destination']

        # write output data
        write.csv(data, file = outName, row.names = FALSE)
        
        # write table metadata - set new primary key
        app$writeTableManifest(outName, destination = outDestination, primaryKey = c('batman_primary_key'))
    }
    
The above code is located in [sample repository](https://github.com/keboola/docs-custom-science-example-dynamic.git), so you can use it
with *runtime settings*. Supply any number of input tables.


	{
		"repository": "https://github.com/keboola/docs-custom-science-example-dynamic.git",
		"version": "0.0.1"
	}
    
To test the code, set arbitrary number of input/output mapping tables, just keep in mind to set same number of inputs and outputs, names of the CSV files are arbitrary.

 ![Dynamic mapping screenshot](/extend/custom-science/r/dynamic-mapping.png)
  
    
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

    devtools::load_all('/home/')
    library(keboola.r.custom.application)
    doSomething(Sys.getenv("KBC_DATADIR"))

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
itself, there is no difference to [previous example](#simple-example).

You can test the sample code with this *runtime* setting:

	{
		"repository": "https://github.com/keboola/docs-custom-science-example-r-package.git",
		"version": "0.0.5"
	}
     
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


### Subclass Example
This example take advantage of the [library](https://github.com/keboola/r-docker-application) RC class.
[RC classes](http://adv-r.had.co.nz/OO-essentials.html#rc) are type of classes in R. This approach is fully comparable with the
previous [package example](#package-example). There are no major differences or (dis)advantages. The repository again has
to have the file `main.R` in root. The difference is that we create the RS class `CustomApplicationExample` and call
its `run()` method.     
 
    devtools::load_all('/home/')
    library(keboola.r.custom.application.subclass)
    app <- CustomApplicationExample$new(Sys.getenv("KBC_DATADIR"))
    app$run()
    
The name of the class `CustomApplicationExample` is completely arbitrary and is defined in 
[`R/myApp.R'](https://github.com/keboola/docs-custom-science-example-r-subclass/blob/master/R/myApp.R#L6). The application
code itself is formally different as all the methods are in the class so instead of:

    app <- DockerApplication$new(datadir)
    app$readConfig()
    data['double_number'] <- data['number'] * app$getParameters()$multiplier

You use only:

    readConfig()
    data['double_number'] <- data['number'] * getParameters()$multiplier

You can test the sample code with this *runtime* setting:

	{
		"repository": "https://github.com/keboola/docs-custom-science-example-r-subclass.git",
		"version": "0.0.4"
	}
