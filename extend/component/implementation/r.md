---
title: R Implementation Notes
permalink: /extend/component/implementation/r/
redirect_from:
    - /extend/custom-science/r/
---

* TOC
{:toc}

## Docker
We recommend using the [Rocker Version-stable](https://github.com/rocker-org/rocker-versioned) [images](https://hub.docker.com/r/rocker/r-ver/).
The [R base image](https://hub.docker.com/r/rocker/r-base/) does not keep older R versions, so the upgrades are not under your control.
If you want to use the same environment as in transformations, use [our image](#docker).

## Working with CSV files
We recommend that you follow the guidelines for the [R transformation](https://help.keboola.com/manipulation/transformations/r/#development-tutorial).
The standard R functions for CSV files work without problems

{% highlight R %}
data <- read.csv(file = "in/tables/source.csv");

df <- data.frame(
  col1 = paste0(data$first, 'ping'),
  col2 = data$second * 42
)
write.csv(df, file = "out/tables/result.csv", row.names = FALSE)
{% endhighlight %}

You can also use the `write_csv` function from the [readr packages](https://cran.r-project.org/web/packages/readr/readr.pdf), which is faster.

## Using the KBC Package
The KBC [R component package](https://github.com/keboola/r-docker-application) provides functions to:

- Read and parse the configuration file and parameters - `configData` property and `getParameters()` method.
- List input files and tables - `getInputFiles()`, `getInputTables()` methods.
- Work with manifests containing table and file metadata - `getTableManifest()`, `getFileManifest()`, `writeTableManifest()`, `writeFileManifest()` methods.
- List expected outputs - `getExpectedOutputFiles()` and `getExpectedOutputTables()` methods.

The library is a standard R package that is available by default in the production environment.
It is [available on Github](https://github.com/keboola/r-docker-application), so it can be installed locally with `devtools::install_github('keboola/r-docker-application', ref = 'master')`.

To use the library to read the user-supplied configuration parameter 'myParameter':

{% highlight r %}
library(keboola.r.docker.application)
# initialize library
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
In the [tutorial](/extend/component/tutorial/), we have shown components which have names of their input/output tables hard-coded.
This example shows how to read the input and output mapping specified by the end-user,
which is accessible in the [configuration file](/extend/common-interface/config-file/). It demonstrates
how to read and write tables and table manifests. File manifests are handled the same way. For a full authoritative list
of items returned in table list and manifest contents, see [the specification](/extend/common-interface/config-file/)

Note that the `destination` label in the script refers to the destination from the
[mappers perspective](/extend/component/tutorial/input-mapping/). The input mapper takes `source` tables
from user's storage, and produces `destination` tables that become the input of the component. The output tables
of the component are consumed by the output mapper whose `destination` are the resulting tables in Storage.

{% highlight r %}
# initialize library
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

To test the code, set an arbitrary number of input/output mapping tables. Keep in mind to set the same number
of inputs and outputs. The names of the CSV files are arbitrary.

{: .image-popup}
![Dynamic mapping screenshot](/extend/component/dynamic-mapping.png)

## Logging
In R components, the outputs printed in rapid succession are sometimes joined into a single event;
this is a known behavior of R and it has no workaround. See a [dedicated article](/extend/common-interface/logging/#examples) if you want to
implement a GELF logger.
