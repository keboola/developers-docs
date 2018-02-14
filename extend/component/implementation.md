---
title: Implementation
permalink: /extend/component/implementation/
redirect_from:
    - /extend/docker/images/
---

* TOC
{:toc}

In this article some good practices in developing the component code are described. If you aim to publish
your component, we strongly suggest that you follow these.

## General Ideas
Here are some best practices which should be followed across all components.

### Docker
You may use any docker image, you see fit. We recommend to base your images on the [official library](https://hub.docker.com/explore/)
as that is the most stable.

We publicly provide the images for transformations and sandboxes.
The images for *Sandboxes* and *Transformations* both share the same common ancestor image *Custom* with a couple
of pre-installed packages (that saves a lot of time when building the image yourself).
This means that the images for R and Python share the same common code base and always use the
exact same version of R and Python respectively.

Ancestor images:

- docker-custom-r:
[Quay](https://quay.io/repository/keboola/docker-custom-r),
[Dockerfile](https://github.com/keboola/docker-custom-r) --
Custom R Image
- docker-custom-python:
[Quay](https://quay.io/repository/keboola/docker-custom-python),
[Dockerfile](https://github.com/keboola/docker-custom-python) --
Custom Python Image

Transformations:

- python-transformation:
[Quay](https://quay.io/repository/keboola/python-transformation),
[Dockerfile](https://github.com/keboola/python-transformation) --
Image for Python transformations
- r-transformation:
[Quay](https://quay.io/repository/keboola/r-transformation),
[Dockerfile](https://github.com/keboola/r-transformation) --
Image for R transformations

Sandboxes:

- docker-jupyter:
[Quay](https://quay.io/repository/keboola/docker-jupyter),
[Dockerfile](https://github.com/keboola/docker-jupyter) --
Image for Python Jupyter Sandbox
- docker-rstudio:
[Quay](https://quay.io/repository/keboola/docker-rstudio),
[Dockerfile](https://github.com/keboola/docker-rstudio) --
Image for RStudio Sandbox

All of the repositories use [Semantic versioning](http://semver.org/) tags. These are always fixed to a specific image build.
Additionally the `latest` tag is available and it always points to the latest tagged build. That means that the `latest` tag
can be used safely (though it refers to different versions over time).

### Memory
KBC [Components](/extend/component/) can be used to process substantial amounts of data (i.e., dozens of Gigabytes) which are not
going to fit into memory. Every component should therefore be written so that it processes data in chunks of
a limited size (typically rows of a table). Many of the KBC components run with less then 100MB memory limit.
While the KBC platform is capable of running jobs with ~8GB of memory without problems, we are not particularly
happy to allow it and we certainly don't want to allow components where the amount of used memory
depends on the size of the processed data.

### Error Handling
Depending on the component [exit code](/extend/common-interface/environment/#return-values), the component job is marked as
successful or failed.

- `exit code = 0`  The job is considered successful.
- `exit code = 1`  The job fails with a *User error*.
- `exit code > 1`  The job fails with an *Application error*.

During execution of the component, all the output sent to STDOUT is captured and sent live to Job Events.
The output to [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29) is captured too and
in case of the job is successful or fails with User error it is displayed as the last event of the job. In case the
job ends with application error, the entire contents of STDERR is hidden from the end-user and sent only to
vendor internal logs. The end-user will see only a canned response ('An application error occurred') with
the option to contact support.

This means that you do not have to worry about the internals of your component leaking to the end-user provided that
the component exit code is correct. On the other hand, the user error is supposed to be solvable by the end user, therefore:

- Avoid messages which make no sense at all. For example, 'Banana Error: Exceeding trifling witling' or only numeric errors.
- Avoid leaking sensitive information (such as credentials, tokens).
- Avoid errors which the user cannot solve. For example, 'An outdated OpenSSL library, update to OpenSSL 1.0.2'.
- Provide guidance on what the user should do. For example, 'The input table is missing; make sure the output mapping destination is set to `items.csv`'.

Also keep in mind that the output of the components (Job events) serve to pass only informational and error messages; **no data** can be passed through.
The event message size is limited (about 64KB). If the limit is exceeded, the message will be trimmed. If the component produces
obscene amount (dozens of MBs) of output in very short time, it may be terminated with internal error.
Also make sure your component does not use any [output buffering](#langauge-specific-notes), otherwise all events will be cached after the application finishes.


## Language Specific notes
This section describes specific implementation details for commonly used languages in our components.

### R

#### Docker
We recommend using the [Rocker Version-stable](https://github.com/rocker-org/rocker-versioned) [images](https://hub.docker.com/r/rocker/r-ver/).
The [R base image](https://hub.docker.com/r/rocker/r-base/) does not keep older R versions, so the upgrades are not under your control.
If you want to use the same environment as in transformations, use [our image](#docker).

#### Working with CSV files
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

#### Using the KBC Package
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

#### Dynamic Input/Output Mapping
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

The above code is located in a [sample repository](https://github.com/keboola/docs-custom-science-example-r-dynamic), so you can use it
with the *runtime settings*. Supply any number of input tables.

- Repository: `https://github.com/keboola/docs-custom-science-example-dynamic.git`
- Version: `0.0.1`

To test the code, set an arbitrary number of input/output mapping tables. Keep in mind to set the same number
of inputs and outputs. The names of the CSV files are arbitrary.

{: .image-popup}
![Dynamic mapping screenshot](/extend/component/dynamic-mapping.png)

#### Logging
In R components, the outputs printed in rapid succession are sometimes joined into a single event;
this is a known behavior of R and it has no workaround. See a [dedicated article](/extend/common-interface/logging/#examples) if you want to
implement a GELF logger.

### Python

#### Docker
Use the [official images](https://hub.docker.com/_/python/) if possible. Usually, the `alpine` versions are sufficient and are the
smallest and fastest.

#### Working with CSV files
We recommend that you follow the guidelines for the [Python transformation](https://help.keboola.com/manipulation/transformations/python/#development-tutorial).

The build-in CSV functions for python work well except when the data in the CSV file contain a null character. This is
[usually fixed](https://stackoverflow.com/questions/4166070/python-csv-error-line-contains-null-byte) by
adding `lazy_lines = (line.replace('\0', '') for line in in_file)`. The expression
is a [Generator](https://wiki.python.org/moin/Generators) which makes sure that
[Null characters](https://en.wikipedia.org/wiki/Null_character) are properly handled.
It is also important to use `encoding='utf-8'` when reading and writing files.

{% highlight python %}
import csv

csvlt = '\n'
csvdel = ','
csvquo = '"'
with open('in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/destination.csv', mode='wt', encoding='utf-8') as out_file:
    writer = csv.DictWriter(out_file, fieldnames=['col1', 'col2'], lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    writer.writeheader()

    lazy_lines = (line.replace('\0', '') for line in in_file)
    reader = csv.DictReader(lazy_lines, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    for row in reader:
        # do something and write row

        writer.writerow({'col1': row['first'] + 'ping', 'col2': int(row['second']) * 42})
{% endhighlight %}

Note that we open both the input and output files simultaneously; as soon as a row is processed,
it is immediately written to the output file. This approach keeps only a single row of data in the memory and is
generally very efficient. It is recommended to implement the processing in this way because data files
coming from KBC can by quite large (i.e., dozens of Gigabytes).

#### Using the KBC Package
The KBC [Python component package](https://github.com/keboola/python-docker-application) provides functions to:

- Read and parse the configuration file and parameters - `config_data` property and `get_parameters()` method.
- List input files and tables - `get_input_files()`, `get_input_tables()` methods.
- Work with manifests containing table and file metadata - `get_table_manifest()`, `get_file_manifest()`, `write_table_manifest()`, `write_file_manifest()` methods.
- List expected outputs - `get_expected_output_files()` and `get_expected_output_tables()` methods.

Additionally, it also defines the KBC [CSV dialect](https://docs.python.org/3/library/csv.html#csv-fmt-params)
to shorten up the CSV manipulation code.
The library is a standard Python package that is available by default in the production environment.
It is [available on Github](https://github.com/keboola/python-docker-application), so it can be installed
locally with `pip install git+git://github.com/keboola/python-docker-application.git`.
A generated [documentation](https://github.com/keboola/python-docker-application/blob/master/doc/keboola.docker.html)
is available for the package, actual working example can be found in our
[sample component](https://github.com/keboola/python-custom-application-text-splitter/blob/master/main.py).
Also note that the library does no special magic, it is just a mean to simplify things a bit for you.

To read the user-supplied configuration parameter 'myParameter', use the following code:

{% highlight python %}
from keboola import docker

# initialize library
cfg = docker.Config('/data/')
params = cfg.get_parameters()

# access the supplied value of 'myParameter'
multiplier = cfg.get_parameters()['myParameter']
{% endhighlight %}

The library contains a single class `Config`; a parameter of the constructor is the path to the data directory.
The above would read the `myParameter` parameter from the user-supplied configuration:

{% highlight json %}
{
    "myParameter": "myValue"
}
{% endhighlight %}

The following piece of code shows how to read parameters:

{% highlight python %}
import csv
from keboola import docker

# initialize the library and read parameter 'multiplier'
cfg = docker.Config('/data/')
multiplier = cfg.get_parameters()['multiplier']

# open the input and output files
with open('in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/destination.csv', mode='wt', encoding='utf-8') as out_file:
    # write output file header
    writer = csv.DictWriter(out_file, fieldnames=['number', 'someText', 'double_number'], dialect='kbc')
    writer.writeheader()

    # read input file line-by-line
    lazy_lines = (line.replace('\0', '') for line in in_file)
    csv_reader = csv.DictReader(lazy_lines, dialect='kbc')
    for row in csv_reader:
        # do something and write row
        writer.writerow({'number': row['number'], 'someText': row['someText'], 'double_number': int(row['number']) * multiplier})
{% endhighlight %}

Note that we have also simplified reading and writing of the CSV files using `dialect='kbc'` option. The dialect is
registered automatically when the `Config` class is initialized.

#### Dynamic Input/Output Mapping
In the [tutorial](/extend/component/tutorial/) and the above examples, we have shown
applications which have names of their input/output tables hard-coded.
The following example shows how to read an input and output mapping specified by the end-user,
which is accessible in the [configuration file](/extend/common-interface/config-file/). It demonstrates
how to read and write tables and table manifests. File manifests are handled the same way. For a full authoritative list
of items returned in table list and manifest contents, see [the specification](/extend/common-interface/config-file/)

Note that the `destination` label in the script refers to the destination from the
[mappers](/extend/component/tutorial/input-mapping/) perspective.
The input mapper takes `source` tables from user's storage, and produces `destination` tables that become
the input of your component. The output tables of your component are consumed by the output mapper
whose `destination` are the resulting tables in Storage.

{% highlight python %}
import csv
from keboola import docker

# initialize the library
cfg = docker.Config('/data/')

# get list of input tables
tables = cfg.get_input_tables()
j = 0
for table in tables:
    # get csv file name
    inName = table['destination']

    # read input table metadata
    manifest = cfg.get_table_manifest(inName)

    # get csv file name with full path from output mapping
    outName = cfg.get_expected_output_tables()[j]['full_path']

    # get file name from output mapping
    outDestination = cfg.get_expected_output_tables()[j]['destination']

    # get csv full path and read table data
    i = 0
    with open(table['full_path'], mode='rt', encoding='utf-8') as in_file, open(outName, mode='wt', encoding='utf-8') as out_file:
        # read input file line-by-line
        lazy_lines = (line.replace('\0', '') for line in in_file)
        csvReader = csv.DictReader(lazy_lines, dialect='kbc')
        headers = csvReader.fieldnames
        headers.extend(['primaryKey'])

        # write output file header
        writer = csv.DictWriter(out_file, fieldnames=headers, dialect='kbc')
        writer.writeheader()

        for row in csvReader:
            # if there is no primary key
            if (len(manifest['primary_key']) == 0):
                i = i + 1
                row['primaryKey'] = i
            else:
                row['primaryKey'] = None

            writer.writerow(row)

    if (len(manifest['primary_key']) == 0):
        pk = ['primaryKey']
    else:
        pk = manifest['primary_key']

    # write table metadata - set new primary key
    cfg.write_table_manifest(outName, destination=outDestination, primary_key=pk)
    j = j + 1
{% endhighlight %}

#### Logging
In Python components, the output is buffered, but the output buffering may be [switched off](http://stackoverflow.com/questions/107705/disable-output-buffering). The easiest solution is to run your script with the `-u` option -- you would use `CMD python -u ./main.py` in your `Dockerfile`.
See a [dedicated article](/extend/common-interface/logging/#examples) if you want to
implement a GELF logger.

#### Error Handling
The following [piece of code](https://github.com/keboola/component-generator/blob/master/templates/python-tests/src/main.py) is a good entrypoint:

{% highlight python %}
import my_component
import os
import sys
import traceback

try:
    datadir = os.environ.get('KBC_DATADIR') or '/data/'
    my_component.run(datadir)
except ValueError as err:
    print(err, file=sys.stderr)
    sys.exit(1)
except Exception as err:
    print(err, file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(2)
{% endhighlight %}

In this case, we consider everything derived from `ValueError` to be an error which should be shown to the end-user.
Every other error will lead to a generic message and only developers will see the details.
If you maintain that any user error is a `ValueError` then whatever happens in the `my_component.run` will follow
the [general error handling rules](#error-handling).
You can, of course, modify this logic to your liking.

### PHP

#### Docker
Use the [official images](https://hub.docker.com/_/php/) if possible. Usually, the `alpine` versions are sufficient and are the
smallest and fastest. If you need composer, use its [official image](https://hub.docker.com/_/composer/) or
[our template](https://github.com/keboola/component-generator/blob/master/templates/php-keboola/Dockerfile).

#### Working with CSV files
We recommend using our [CSV library](https://github.com/keboola/php-csv) which provides a convenience wrapper
around the build-in [CSV functions](http://php.net/manual/en/function.fgetcsv.php).
The build-in [CSV functions](http://php.net/manual/en/function.fgetcsv.php) in PHP work well on their own too.
If you are using bare PHP, the following code illustrates their use:

{% highlight php %}
<?php
$fhIn = fopen('/data/in/tables/source.csv', 'r');
$fhOut = fopen('/data/out/tables/destination.csv', 'w');
$header = fgetcsv($fhIn);
$numberIndex = array_search('number', $header);
fputcsv($fhOut, array_merge($header, ['double_number']));
while ($row = fgetcsv($fhIn)) {
	$row[] = $row[$numberIndex] * 2;
	fputcsv($fhOut, $row);
}
fclose($fhIn);
fclose($fhOut);
echo "All done";
{% endhighlight %}

Note that we open both the input and output files simultaneously; as soon as a row is processed,
it is immediately written to the destination file. This approach keeps only a single row of data in the memory and is
generally very efficient. It is recommended to implement the processing in this way because data files
coming from KBC can by quite large.

The same can be achieved using the [CSV library](https://github.com/keboola/php-csv). Install the
pacakge with `composer require keboola/csv`. The following
piece of code shows using it as well as reading the [configuration file](/extend/common-interface/config-file/).

{% highlight php %}
<?php

require "vendor/autoload.php";

// read the configuration file
$dataDir = getenv('KBC_DATADIR') . DIRECTORY_SEPARATOR;
$configFile = $dataDir . 'config.json';
$config = json_decode(file_get_contents($configFile), true);

$multiplier = $config['parameters']['multiplier'];

// create output file and write header
$outFile = new \Keboola\Csv\CsvFile(
    $dataDir . 'out' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'destination.csv'
);
$outFile->writeRow(['number', 'someText', 'double_number']);

// read input file and write rows of output file
$inFile = new Keboola\Csv\CsvFile($dataDir . 'in' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'source.csv');
foreach ($inFile as $rowNum => $row) {
    if ($rowNum == 0) {
        // skip header
        continue;
    }
    $outFile->writeRow([
        $row[0],
        $row[1],
        $row[0] * $multiplier
    ]);
}
{% endhighlight %}

#### Logging
For simple applications, printing with `echo` or `print` is enough. To print to STDERR, you have to use
e.g. `fwrite(STDERR, "Hello, world!" . PHP_EOL);`. The best option is to use the [Monolog package](https://github.com/Seldaek/monolog).
The following is a useful initialization:

{% highlight php %}
$formatter = new LineFormatter("%message%\n");
$errHandler = new StreamHandler('php://stderr', Logger::NOTICE, false);
$errHandler->setFormatter($formatter);
$handler = new StreamHandler('php://stdout', Logger::INFO);
$handler->setFormatter($formatter);
$logger = new Logger('main', [$errHandler, $handler]);
{% endhighlight %}

This means that and log with [level notice](https://github.com/Seldaek/monolog/blob/master/doc/01-usage.md#log-levels) and above
will go to STDERR, and info level will go to STDOUT. The formatter removes unnecessary fields like timestamp and context.

#### Error Handling
The following [piece of code](https://github.com/keboola/component-generator/blob/master/templates/php-keboola/src/run.php) is a good entrypoint:

{% highlight php %}
$dataDir = getenv('KBC_DATADIR') === false ? '/data/' : getenv('KBC_DATADIR');
try {
    $app = new Application($dataDir);
    $app->run();
    exit(0);
} catch (UserException $e) {
    echo $e->getMessage();
    exit(1);
} catch(\Throwable $e) {
    echo $e->getMessage();
    echo "errFile:" . $e->getFile();
    echo "errLine:" . $e->getLine();
    echo "code:" . $e->getCode();
    echo "trace :";
    var_export($e->getTrace())
    exit(2);
}
{% endhighlight %}

In this case, we consider everything derived from `UserException` to be an error which should be shown to the end-user.
You have to create that exception class in your component. Every other error will lead to a generic message and only
the developer will see the details and the code will follow the [general error handling rules](#error-handling).
Here we use the [`Throwable`](http://php.net/manual/en/class.throwable.php) ancestor, which also catches PHP errors. You can, of
course, modify this logic to your liking.
