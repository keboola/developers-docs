---
title: Custom Science Python
permalink: /extend/custom-science/python/
---

* TOC
{:toc}

Your Python Custom Science Application can be created in multiple ways (as described below). There are no known
limitations to the architecture of your Python code. We recommend that you use
our [library](https://github.com/keboola/python-docker-application). It provides useful functions for working
with our [environment](/extend/common-interface/). Please note:

- The repository of your Python application must always contain the `main.py` script.
- If set, your application must always produce the tables and files listed in the output mapping (even if the files were empty).

If you are starting with Custom Science, consider going through the
[Quickstart](/extend/custom-science/quick-start/).
You can also have a look at our [example repository](https://github.com/keboola/python-custom-application-text-splitter).


## Packages
To install a custom package, use:

{% highlight python %}
pip.main(['install', '--disable-pip-version-check', '--no-cache-dir', '--cert=/tmp/cacert.pem', 'packageName'])
{% endhighlight %}


Here is our current
[list of pre-installed packages](https://github.com/keboola/docker-custom-python/blob/master/Dockerfile#L22).
You can use those with `import`. If you know of another useful standard package to pre-install, we would like
to hear about it.

## Reading and Writing Files
Tables from Storage are imported to the Python script from CSV files. The CSV files can be read by standard python
functions from the [csv packages](https://docs.python.org/3/library/csv.html). You can read the CSV files either
to vectors (numbered columns) or to dictionaries (named columns). The directory structure follows our general
[Docker interface](/extend/common-interface/) - so
input tables are stored as CSV files in `in/tables/`, output tables are stored in `out/tables/`.
It is recommended to explicitly specify the CSV formatting options.
Below is the code for basic reading and writing files, it is also available in our
[git repository](https://github.com/keboola/docs-custom-science-example-python-basic)

{% highlight python %}
import csv

# CSV format settings
csvlt = '\n'
csvdel = ','
csvquo = '"'

# open the input and output files
with open('in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, open('out/tables/destination.csv', mode='wt', encoding='utf-8') as out_file:
    # write output file header
    writer = csv.DictWriter(out_file, fieldnames=['number', 'someText', 'double_number'], lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    writer.writeheader()

    # read input file line-by-line
    lazy_lines = (line.replace('\0', '') for line in in_file)
    csv_reader = csv.DictReader(lazy_lines, lineterminator=csvlt, delimiter=csvdel, quotechar=csvquo)
    for row in csv_reader:
        # do something and write row
        writer.writerow({'number': row['number'], 'someText': row['someText'], 'double_number': int(row['number']) * 2})
{% endhighlight %}


The above example shows how to process the file line-by-line; this is the most memory-efficient way which
allows you to process data files of any size. The expression
`lazy_lines = (line.replace('\0', '') for line in in_file)` is a
[Generator](https://wiki.python.org/moin/Generators) which makes sure that
[Null characters](https://en.wikipedia.org/wiki/Null_character) are properly handled.
It is also important to use `encoding='utf-8'` when reading and writing files.

To test the above code, you can use a sample [source table](/extend/source.csv) in *Storage* and the
following *runtime* configuration:

- Repository: `https://github.com/keboola/docs-custom-science-example-python-basic`
- Version: `1.0.6`


## Using the KBC Package
The KBC [Python extension package](https://github.com/keboola/python-docker-application) provides functions to:

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
[sample application](https://github.com/keboola/python-custom-application-text-splitter/blob/master/main.py).
Also note that the library does no special magic, it is just a mean to simplify things a bit for you.

To read the user-supplied configuration parameter 'myParameter', use the following code:

{% highlight python %}
from keboola import docker

# initialize application
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

An example of the above approach is available
in [our repository](https://github.com/keboola/docs-custom-science-example-python-parameters).

{% highlight python %}
import csv
from keboola import docker

# initialize the application and read parameter 'multiplier'
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
You can test the code with the following runtime configuration:

- Repository: `https://github.com/keboola/docs-custom-science-example-python-parameters`
- Version: `1.0.1`

And with the following parameters:

{% highlight json %}
{
    "multiplier": 10
}
{% endhighlight %}


### Dynamic Input/Output Mapping
In the [Quick start tutorial](/extend/custom-science/quick-start/) and the above examples, we have shown
applications which have names of their input/output tables hard-coded.
The following example shows how to read an input and output mapping specified by the end-user,
which is accessible in the [configuration file](/extend/common-interface/config-file/). It demonstrates
how to read and write tables and table manifests. File manifests are handled the same way. For a full authoritative list
of items returned in table list and manifest contents, see [the specification](/extend/common-interface/config-file/)

Note that the `destination` label in the script refers to the destination from the mappers perspective.
The input mapper takes `source` tables from user's storage, and produces `destination` tables that become
the input of your extension. The output tables of your extension are consumed by the output mapper
whose `destination` are the resulting tables in Storage.

{% highlight python %}
import csv
from keboola import docker

# initialize application
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


The above code is located in a [sample repository](https://github.com/keboola/docs-custom-science-example-python-dynamic),
so you can use it with the *runtime settings*. Supply any number of input tables.

- Repository: `https://github.com/keboola/docs-custom-science-example-python-dynamic.git`
- Version: `1.0.5`

To test the code, set an arbitrary number of input/output mapping tables. Keep in mind to set the same number of
inputs and outputs. The names of the CSV files are arbitrary.

{: .image-popup}
![Dynamic mapping screenshot](/extend/custom-science/python/dynamic-mapping.png)

## Error Handling
An important part of the application is handling errors. By
[the specification](/extend/common-interface/environment/), we assume that command return
code: 0 = no error, 1 = user error (shown to the end-user in KBC), > 1 = application error
(the end-user will receive only a generic message). To implement this, you should wrap your
entire script in `try-except` statement.

{% highlight python %}
try:
    ... your code ...
except ValueError as err:
    print(err, file=sys.stderr)
    sys.exit(1)
except Exception as err:
    print(err, file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(2)
{% endhighlight %}

In this case, we consider everything derived from `ValueError` to be an error which should be shown to the end-user.
Every other error will lead to a generic message and only developers will see the details. You can, of
course, modify this logic to your liking.

## Using Classes
Since the organization of your code is completely up to you, nothing prevents you from wrapping the entire application in a class.
Actually, we do recommend this approach since it makes the code more contained and allows for greater testability.
To wrap the code in a class, create a [file `sample_application.py`](https://github.com/keboola/docs-custom-science-example-python-class/blob/master/sample_application.py):

{% highlight python %}
import csv
from keboola import docker


class SampleApplication:
    def run(self):
        ... your code ...
{% endhighlight %}

Then create a [runner `main.py`](https://github.com/keboola/docs-custom-science-example-python-class/blob/master/main.py) for your application:

{% highlight python %}
import sample_application
import sys
import traceback

try:
    app = sample_application.SampleApplication()
    app.run()
except ValueError as err:
    print(err, file=sys.stderr)
    sys.exit(1)
except Exception as err:
    print(err, file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    sys.exit(2)
{% endhighlight %}

Where `sample_application` is the name of the file in which the application class is defined and `SampleApplication`
is the name of the actual class. This also takes care of [handling errors](#error-handling) and keeps the `main.py` runner clean.
You can look at the [sample application](https://github.com/keboola/docs-custom-science-example-python-class) or
at a more complicated [TextSpliter application](https://github.com/keboola/python-custom-application-text-splitter/blob/master/main.py).

## Continuous Integration and Testing
Once you have your script contained, use standard Python testing methods such as [py.test](http://pytest.org/latest/).
It is important to run tests automatically. Set them up to run every time you push a commit into your repository.

### Integration with Travis
[Travis](https://travis-ci.org/) offers an easy way to setup a continuous integration with Github repositories. To setup the integration,
create a `.travis.yml` file in the root of your repository and
then [link the repository to Travis](https://docs.travis-ci.com/user/getting-started/#To-get-started-with-Travis-CI%3A).
Travis offers [Python support](https://docs.travis-ci.com/user/languages/python), only add the KBC Package, if using it, and set the data directory using
the `KBC_DATADIR` environment variable, which will be automatically picked up by the KBC package:

{% highlight yml %}
language: python

python:
  - 3.5

install:
  - pip install git+git://github.com/keboola/python-docker-application.git

env:
  - KBC_DATADIR=$TRAVIS_BUILD_DIR/test/data/

script:
  - cd $KBC_DATADIR
  - py.test ./../../
{% endhighlight %}

### Integration Using Docker Compose
The above option is easy to set up, but it has two disadvantages:

- it is specific to Travis CI (Continuous Integration) service, and
- it does not run your application in the *exact same* environment as the production code.

To fix both, take an advantage of the fact that we will run your application code in a [Docker container](/extend/docker/tutorial/).
By using [Docker Compose](https://docs.docker.com/compose/) you can set the testing environment in the exact same manner as the production environment.
Have a look at the [sample repository](https://github.com/keboola/docs-custom-science-example-python-ci-testing) described below.

#### Configuration
To run your tests in our Docker Container, create a
[`docker-compose.yml` file](https://github.com/keboola/docs-custom-science-example-python-ci-testing/blob/master/docker-compose.yml) in the root of your repository:

{% highlight yml %}
version: "2"

services:
  tests:
    image: quay.io/keboola/docker-custom-python:1.1.2
    tty: true
    stdin_open: true
    command: /bin/sh /src/tests.sh
    volumes:
      - ./:/src/
{% endhighlight %}

The `image` option defines what Docker Image is used for running the tests -- `quay.io/keboola/docker-custom-python:1.1.2` refers to
[our image](https://quay.io/repository/keboola/docker-custom-r?tab=tags) we use to run Custom Science extensions on
our production servers. The `1.1.2` part refers to an image tag, which changes from time to time. You should generally use its highest version.
The `volumes` option defines that the current directory will be mapped to the `/src/` directory inside the image.
The `command` option defines the command for running the `/bin/sh /src/tests.sh` tests. It will be run **inside** the Docker image,
so you do not need to have shell available on your machine. This leads us to the
[`tests.sh` file](https://github.com/keboola/docs-custom-science-example-python-ci-testing/blob/master/tests.sh),
which should be also created in the root of your repository:

{% highlight bash %}
#!/bin/sh

flake8 --max-line-length=180 /src/
py.test --cov=text_splitter --cov-report term-missing /src/
{% endhighlight %}

The above simple [Shell script](http://www.freeos.com/guides/lsst/) will first try to check your package using the
[flake8 checker](https://pypi.python.org/pypi/flake8) and then run the tests with
[pytest](http://pytest.org/latest/). Don't forget that the `/src/` directory maps to the root directory of your
repository (we have defined this in `docker-compose.yml`).

#### Running
To run the tests in the Docker container, [install Docker](/extend/docker/tutorial/setup/) on your machine,
and execute the following command line (in the root of your repository):

    docker-compose run --rm -e KBC_DATADIR=/src/tests/data/ tests

Docker-compose will process the `docker-compose.yml` and execute the `tests` service as defined on
its [4th line](https://github.com/keboola/docs-custom-science-example-python-ci-testing/blob/master/docker-compose.yml#L4). This service will take our
Docker `docker-custom-python` image and map the current directory into a `/src/` directory inside the image. Then it will execute the `/src/tests.sh` shell script
inside that image. Where `/src/tests.sh` refers to the `tests.sh` script in the root of your repository. This will check your Python class.
The `-e KBC_DATADIR=/src/tests/data/` option sets the `KBC_DATADIR` environment variable to the data directory so that it refers to the `tests/data/` directory
in the root of your repository.

#### Running on Travis
To run the tests in a Docker container automatically, automate them, again, to run on every push to your git repository. Now, you are not limited to
CI services with Python support, but you can use any CI service with Docker support. You can also use Travis, as we will show in the following
[`.travis.yml` configuration](https://github.com/keboola/docs-custom-science-example-python-ci-testing/blob/master/.travis.yml):

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

Most of the configuration is related to setting up Docker, the only important part is two last lines. `docker-compose build tests` will build the
Docker image, which will be skipped in case you are not using your own [Dockerfile](/extend/docker/tutorial/howto/).
The `docker-compose run --rm -e KBC_DATADIR=/src/tests/data/ tests` command is the most important as it actually runs docker-compose, and subsequently
all the tests (it is the same command you can use [locally](/extend/custom-science/python/#running)).

All the above configuration is available in the [sample repository](https://github.com/keboola/docs-custom-science-example-python-ci-testing).
