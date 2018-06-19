---
title: Python Implementation Notes
permalink: /extend/component/implementation/python/
redirect_from:
    - /extend/custom-science/python/
---

* TOC
{:toc}

## Docker
Use the [official images](https://hub.docker.com/_/python/) if possible. Usually, the `alpine` versions are sufficient and are the
smallest and fastest. We recommend using [our templates](https://github.com/keboola/component-generator/tree/master/templates).

## Working with CSV Files
We advise you to follow the guidelines for the [Python transformation](https://help.keboola.com/manipulation/transformations/python/#development-tutorial).

The build-in CSV functions for Python work well except when the data in the CSV file contain a null character. This is
[usually fixed](https://stackoverflow.com/questions/4166070/python-csv-error-line-contains-null-byte) by
adding `lazy_lines = (line.replace('\0', '') for line in in_file)`. The expression
is a [generator](https://wiki.python.org/moin/Generators) which makes sure that
[null characters](https://en.wikipedia.org/wiki/Null_character) are properly handled.
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
coming from KBC can be quite large (i.e., dozens of gigabytes).

## Using KBC Package
The KBC [Python component package](https://github.com/keboola/python-docker-application) provides functions to

- read and parse the configuration file and parameters: `config_data` property and `get_parameters()` method.
- list input files and tables: `get_input_files()`, `get_input_tables()` methods.
- work with manifests containing table and file metadata: `get_table_manifest()`, `get_file_manifest()`, `write_table_manifest()`, `write_file_manifest()` methods.
- list expected outputs: `get_expected_output_files()` and `get_expected_output_tables()` methods.

Additionally, it also defines KBC's [CSV dialect](https://docs.python.org/3/library/csv.html#csv-fmt-params)
to shorten up the CSV manipulation code.
The library is a standard Python package that is available by default in the production environment.
It is [ready for use on GitHub](https://github.com/keboola/python-docker-application), so it can be installed
locally with `pip3 install https://github.com/keboola/python-docker-application/zipball/master`.
A generated [documentation](https://github.com/keboola/python-docker-application/blob/master/doc/keboola.docker.html)
is available for the package, and an actual working example can be found in our
[sample component](https://github.com/keboola/python-custom-application-text-splitter/blob/master/main.py).
Also note that the library does no special magic, it is just a mean to simplify things a bit for you.

To read the user-supplied configuration parameter 'myParameter', use the following code:

{% highlight python %}
from keboola import docker

# initialize library
cfg = docker.Config()
params = cfg.get_parameters()

# access the supplied value of 'myParameter'
multiplier = cfg.get_parameters()['myParameter']
{% endhighlight %}

The library contains a single class `Config`; the optional parameter of the constructor is the path to the data directory.
If not provided, [`KBC_DATADIR` environment variable](/extend/common-interface/environment/#environment-variables) will be used.
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
cfg = docker.Config()
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

Note that we have also simplified reading and writing of the CSV files using the `dialect='kbc'` option. The dialect is
registered automatically when the `Config` class is initialized.

### Dynamic Input/Output Mapping
In the [tutorial](/extend/component/tutorial/) and the above examples, we show
applications which have names of their input/output tables hard-coded.
The following example shows how to read an input and output mapping specified by the end user,
which is accessible in the [configuration file](/extend/common-interface/config-file/). It demonstrates
how to read and write tables and table manifests. File manifests are handled the same way. For a full authoritative list
of items returned in table list and manifest contents, see [the specification](/extend/common-interface/config-file/).

Note that the `destination` label in the script refers to the destination from the
[mapper](/extend/component/tutorial/input-mapping/) perspective.
The input mapper takes `source` tables from the user's storage and produces `destination` tables that become
the input of your component. The output tables of your component are consumed by the output mapper
whose `destination` are the resulting tables in Storage.

{% highlight python %}
import csv
from keboola import docker

# initialize the library
cfg = docker.Config()

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

## Logging
In Python components, the output is buffered, but the buffering may be [switched off](http://stackoverflow.com/questions/107705/disable-output-buffering). The easiest solution is to run your script with the `-u` option: you would use `CMD python -u ./main.py` in your `Dockerfile`.
See a [dedicated article](/extend/common-interface/logging/#examples) if you want to
implement a GELF logger.

## Error Handling
The following [piece of code](https://github.com/keboola/component-generator/blob/master/templates/python-tests/src/main.py) is a good entry point:

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

In this case, we consider everything derived from `ValueError` to be an error which should be shown to the end user.
Every other error will lead to a generic message, and only developers will see the details.
If you maintain that any user error is a `ValueError`, then whatever happens in the `my_component.run` will follow
the [general error handling rules](#error-handling).
You can, of course, modify this logic to your liking.
