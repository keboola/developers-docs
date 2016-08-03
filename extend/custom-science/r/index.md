---
title: Custom Science R
permalink: /extend/custom-science/r/
---

* TOC
{:toc}

Your R Custom Science Application can be created in multiple ways (as described below). There are no known limitations to the architecture of your R code. We recommend that you use our [library](https://github.com/keboola/r-docker-application). It provides useful functions for working with our [environment](/extend/common-interface/). Please note:

- The repository of your R application must always contain the `main.R` script.
- All result .csv files **must be** written with the `row.names = FALSE` option (otherwise KBC cannot read the file because it contains unnamed column).
- The output mapping in your application is always required. Your application will always produce the tables and files listed in the output mapping (even if the files were empty).

## Packages
To install a package, use `install.packages('packageName')`. It is not necessary to specify the repository. If you wish to install a package from source, use `devtools::install_github()` (and friends).

Here is our current
[list of pre-installed packages](https://github.com/keboola/docker-base-r-packages/blob/master/init.R#L14).
You can load them with `library()` command. If you know of another useful standard package to pre-install,
we would like to hear about it.

## Using the KBC Package
The KBC [R extension package](https://github.com/keboola/r-docker-application) provides functions to:

- Read and parse the configuration file and parameters - `configData` property and `getParameters()` method.
- List input files and tables - `getInputFiles()`, `getInputTables()` methods.
- Work with manifests containing table and file metadata - `getTableManifest()`, `getFileManifest()`, `writeTableManifest()`, `writeFileManifest()` methods.
- List expected outputs - `getExpectedOutputFiles()` and `getExpectedOutputTables()` methods.

The library is a standard R package that is available by default in the production environment.
It is [available on Github](https://github.com/keboola/r-docker-application), so it can be installed locally with `devtools::install_github('keboola/r-docker-application', ref = 'master')`.

To use the library to read the user-supplied configuration parameter 'myParameter':

{% highlight r %}
library(keboola.r.docker.application)
# initialize application
app <- keboola.r.docker.application::DockerApplication$new('/data/')
app$readConfig()

# access the supplied value of 'myParameter'
app$getParameters()$myParameter
{% endhighlight %}

The library contains a single [RC class](http://adv-r.had.co.nz/OO-essentials.html#rc) `DockerApplication`; a parameter of the constructor is the path to the data directory.
Call `readConfig()` to actually read and parse the configuration file. The above would read the `myParameter` parameter from the user-supplied configuration:

{% highlight json %}
{
    "myParameter": "myValue"
}
{% endhighlight %}

You can obtain inline help and the list of library functions by running the `?DockerApplication` command.

### Dynamic Input/Output Mapping
In the [Quick start tutorial](/extend/custom-science/quick-start/), we have shown applications which have names of their input/output tables hard-coded.
This example shows how to read the input and output mapping specified by the end-user,
which is accessible in the [configuration file](/extend/common-interface/config-file/). It demonstrates
how to read and write tables and table manifests. File manifests are handled the same way. For a full authoritative list
of items returned in table list and manifest contents, see [the specification](/extend/common-interface/config-file/)

Note that the `destination` label in the script refers to the destination from the mappers perspective. The input mapper takes `source` tables from user's storage, and produces `destination` tables that become the input of the extension. The output tables of the extension are consumed by the output mapper whose `destination` are the resulting tables in Storage.

{% highlight r %}
# initialize application
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
{% endhighlight %}

The above code is located in a [sample repository](https://github.com/keboola/docs-custom-science-example-r-dynamic), so you can use it
with the *runtime settings*. Supply any number of input tables.

- Repository: https://github.com/keboola/docs-custom-science-example-dynamic.git
- Version: 0.0.1

To test the code, set an arbitrary number of input/output mapping tables. Keep in mind to set the same number of inputs and outputs. The names of the CSV files are arbitrary.

{: .image-popup}
![Dynamic mapping screenshot](/extend/custom-science/r/dynamic-mapping.png)


## KBC Package Integration Options

### Simple Example
In the simplest case, you can use the code from an [R transformation](https://help.keboola.com/manipulation/transformations/r/) to create a simple R script. It must be named `main.R`.
 To see a sample R script, go to [our repository](https://github.com/keboola/docs-custom-science-example-r-parameters).
 Despite the fact that this approach is the simplest and quickest to do, it offers limited options for testing and is generally good only for
 one-liners (i.e. you have an existing library which does all the work, all you need to do is execute it).
In the example below, we supply value `/data/` to the constructor as the data directory, as that will be always true in
our [production environment](/extend/common-interface/environment/).

 {% highlight r %}
library('keboola.r.docker.application')

# initialize application
app <- DockerApplication$new('/data/')
app$readConfig()

# read input
data <- read.csv("/data/in/tables/source.csv");

# do something
data['double_number'] <- data['number'] * app$getParameters()$multiplier

# write output
write.csv(data, file = "/data/out/tables/result.csv", row.names = FALSE)
{% endhighlight %}

### Package Example
This example shows how an R package can be made in order to interact with our environment, the code is available in a [git repository](https://github.com/keboola/docs-custom-science-example-r-package).
We strongly recommend this approach over the previous [simple example](#simple-example).

Wrapping the application logic into an R package makes testing and portability much easier, specifically:

- [Writing tests](http://r-pkgs.had.co.nz/tests.html) - [Example](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/tests/testthat/test_main.R)
- Running tests and applications in multiple environments (see below)
- Dependencies are [checked](http://r-pkgs.had.co.nz/namespace.html) and automatically installed
- Package code is [checked for errors](http://r-pkgs.had.co.nz/check.html)

#### Code
The application EntryPoint is [`main.R`](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/main.R) in the package root folder.

{% highlight r %}
devtools::load_all('/home/')
library(keboola.r.custom.application)
doSomething(Sys.getenv("KBC_DATADIR"))
{% endhighlight %}

This installs the package from the `/home/` directory. It includes the package defined
in the [DESCRIPTION](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/DESCRIPTION#L1) file and
calls the `doSomething()` function. The package name is arbitrary, but it must match the one defined in the `DESCRIPTION` file.
The availability of the `doSomething()` function is determined by the contents of the
[NAMESPACE](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/NAMESPACE) file. The `NAMESPACE` file is generated
automatically by [Roxygen](https://cran.r-project.org/web/packages/roxygen2/vignettes/roxygen2.html) when you **Check** the
package in [RStudio](https://cran.r-project.org/web/packages/roxygen2/vignettes/roxygen2.html).

With this approach, you can organize your code and name your functions as you please. In the sample repository, the
actual code is contained in the `doSomething()` function in
the [`R/myPackage.R`](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/R/myPackage.R) file. The code
itself is identical to the [previous example](#simple-example).

Test the sample code with this *runtime* setting:

- Repository: https://github.com/keboola/docs-custom-science-example-r-package.git
- Version: 0.0.5

#### Tests
Tests are organized in the [/tests/](https://github.com/keboola/docs-custom-science-example-r-package/tree/master/tests) directory which contains:

- Subdirectory `data/` which contains pregenerated sample data from [sandbox](/extend/common-interface/sandbox/).
- Optional `config.R` file which can be used to set environment for running the tests; it can be created
by copying [config_template.R](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/tests/config_template.R)
- Subdirectory `test_that/` which contains the actual [testthat tests](http://r-pkgs.had.co.nz/tests.html)

You can run the tests locally from RStudio,

{: .image-popup}
![RStudio tests](/extend/custom-science/r/rstudio-tests.png)

or you can set them to run automatically using the [Travis](https://travis-ci.org/) continuous integration server every time
you push into your git repository.
For that use the provided [travis.yml](https://github.com/keboola/docs-custom-science-example-r-package/blob/master/.travis.yml) file.
[See below](#continuous-integration-and-testing) for more information about continuous integration.

For a more thorough tutorial on developing R packages, see the [R packages book](http://r-pkgs.had.co.nz/).

### Subclass Example
This example defines a subclass of the `DockerApplication` RC class from the [KBC R package](https://github.com/keboola/r-docker-application).
[RC classes](http://adv-r.had.co.nz/OO-essentials.html#rc) are a type of classes in R. This approach is fully comparable with the
previous [package example](#package-example). There are no major differences or (dis)advantages. The repository, again, has
to have the file `main.R` in its root. The difference is that we create the RS class `CustomApplicationExample` and call
its `run()` method.

{% highlight r %}
devtools::load_all('/home/')
library(keboola.r.custom.application.subclass)
app <- CustomApplicationExample$new(Sys.getenv("KBC_DATADIR"))
app$run()
{% endhighlight %}

The name of the class `CustomApplicationExample` is completely arbitrary and is defined in
[`R/myApp.R'](https://github.com/keboola/docs-custom-science-example-r-subclass/blob/master/R/myApp.R#L6). The application
code itself is formally different as all the methods are in the class. So, instead of

{% highlight r %}
app <- DockerApplication$new(datadir)
app$readConfig()
data['double_number'] <- data['number'] * app$getParameters()$multiplier
{% endhighlight %}

use

{% highlight r %}
readConfig()
data['double_number'] <- data['number'] * getParameters()$multiplier
{% endhighlight %}

within the body of `CustomApplicationExample`'s `run` method.

Test the sample code with this *runtime* setting:

- Repository: https://github.com/keboola/docs-custom-science-example-r-subclass.git
- Version: 0.0.4

## Continuous Integration and Testing
When using the [Package](#package-example) or [Subclass](#subclass-example) approach, you can use standard R testing methods.
We like the [`testthat` package](http://r-pkgs.had.co.nz/tests.html). Since it is important to run tests automatically,
set them up to run every time you push a commit into your repository.

### Integration with Travis
[Travis](https://travis-ci.org/) offers an easy way of setting up a continuous integration with Github repositories. To setup the integration,
create a `.travis.yml` file in the root of your repository, and
then [link the repository to Travis](https://docs.travis-ci.com/user/getting-started/#To-get-started-with-Travis-CI%3A).
Travis offers [R support](https://docs.travis-ci.com/user/languages/r). Only add the KBC Package, if using it, and set the data directory using
the `KBC_DATADIR` environment variable, which will be automatically picked up by the KBC package:

{% highlight yml %}
language: r

sudo: required

# Be strict when checking our package
warnings_are_errors: true

# Install KBC Package
r_github_packages:
 - keboola/r-application
 - keboola/r-docker-application

# Set the data directory
before_install:
 - export KBC_DATADIR=$TRAVIS_BUILD_DIR/tests/data/
{% endhighlight %}

### Integration Using Docker Compose
The above option is easy to set up, but it has two disadvantages:

- it is specific to Travis CI (Continuous Integration) service, and
- it does not run your application in the *exact same* environment as the production code.

To fix both, take an advantage of the fact that we will run your application code in a [Docker container](/extend/docker/tutorial/).
By using [Docker Compose](https://docs.docker.com/compose/), you can set the testing environment in the exact same way as the production environment.
Take a look at the [sample repository](https://github.com/keboola/docs-custom-science-example-r-ci-testing) described below.

#### Configuration
To run your tests in our Docker Container, you need to create a
[`docker-compose.yml` file](https://github.com/keboola/docs-custom-science-example-r-ci-testing/blob/master/docker-compose.yml) in the root of your repository:

{% highlight yml %}
version: "2"

services:
  tests:
    image: quay.io/keboola/docker-custom-r:1.0.4
    tty: true
    stdin_open: true
    volumes:
      - ./:/src/
    command: /bin/sh /src/tests.sh
{% endhighlight %}

The `image` option defines what Docker Image is used for running the tests -- `quay.io/keboola/docker-custom-r:1.0.4` refers to
[our image](https://quay.io/repository/keboola/docker-custom-r?tab=tags) we use to run Custom Science extensions on our production servers.
The `1.0.4` part refers to an image tag, which changes from time to time. You should generally use the highest version.
The `volumes` option defines that the current directory will be mapped to `/src/` directory inside the image.
The `command` option defines the command for running the tests `/bin/sh /src/tests.sh`.
It will be run **inside** the Docker image, so you don't need to have shell available on your machine.
This leads us to the [`tests.sh` file](https://github.com/keboola/docs-custom-science-example-r-ci-testing/blob/master/tests.sh), which
should be also created in the root of your repository:

{% highlight bash %}
#!/bin/sh

R CMD build /src/
R CMD check --as-cran /src/
{% endhighlight %}

The above simple [Shell script](http://www.freeos.com/guides/lsst/) will first try to build your package using
[`R CMD build`](https://stat.ethz.ch/R-manual/R-devel/library/utils/html/PkgUtils.html) and then check
it, meaning running the tests, with [`R CMD check`](http://r-pkgs.had.co.nz/check.html). This assumes you are using the
[package approach](#package-example). If using other approaches, modify these commands to run your tests.
Don't forget that the `/src/` directory maps to the root directory of your repository (we have defined this in
`docker-compose.yml`).

#### Running
To run the tests in the Docker container, have [Docker installed](/extend/docker/tutorial/setup/) on your machine, and execute the
following command line (in the root of your repository):

    docker-compose run --rm -e KBC_DATADIR=/src/tests/data/ tests

Docker-compose will process the `docker-compose.yml` and execute the `tests` service as defined on
its [4th line](https://github.com/keboola/docs-custom-science-example-r-ci-testing/blob/master/docker-compose.yml#L4).
This service will take our Docker `docker-custom-r` image and map the current directory into a `/src/` directory inside the image.
Then it will execute the shell script `/src/tests.sh` inside that image. Where `/src/tests.sh` refers to the `tests.sh` script in the root of your repository.
This will build and check the R package. The option `-e KBC_DATADIR=/src/tests/data/` sets environment variable `KBC_DATADIR` to the data directory,
so that it refers to the `tests/data/` directory in the root of your repository.

#### Running on Travis
To run the tests in a Docker container automatically, automate them, again, to run on every push to your git repository.
Now, you are not limited to the CI services with R support, but you can use any CI service with Docker support.
You can also use Travis, as we will show you in the following
[`.travis.yml` configuration](https://github.com/keboola/docs-custom-science-example-r-ci-testing/blob/master/.travis.yml):

{% highlight yml %}
sudo: required

services:
  - docker

env:
  DOCKER_COMPOSE_VERSION: 1.6.2

before_install:
  - sudo apt-get update
  - sudo apt-get -o Dpkg::Options::="--force-confnew" -y install docker-engine

install:
  - sudo rm /usr/local/bin/docker-compose
  - curl -L https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-`uname -s`-`uname -m` > docker-compose
  - chmod +x docker-compose
  - sudo mv docker-compose /usr/local/bin

before_script:
  - docker -v
  - docker-compose -v
  - docker-compose build tests

script
  - docker-compose run --rm -e KBC_DATADIR=/src/tests/data/ tests
{% endhighlight %}

Most of the configuration is related to setting up Docker, the only important part is two last lines. `docker-compose build tests` will build
the Docker image, which will be skipped in case you are not using your own [Dockerfile](/extend/docker/tutorial/howto/).
The `docker-compose run --rm -e KBC_DATADIR=/src/tests/data/ tests` command is the most important as it actually runs docker-compose and,
subsequently, all the tests. It is the same command you can use [locally](/extend/custom-science/r/#running).

Also, create an [`.Rbuildignore` file](https://github.com/keboola/docs-custom-science-example-r-ci-testing/blob/master/.Rbuildignore) to avoid receiving
warnings for unrecognized files in the root of your package repository:

    ^.*\.Rproj$
    ^\.Rproj\.user$
    ^main\.R$
    ^\.travis\.yml$
    ^docker-compose\.yml$
    ^tests\.sh$
    ^\.git$
    ^\.gitignore$

All the above configuration is available in the [sample repository](https://github.com/keboola/docs-custom-science-example-r-ci-testing).
