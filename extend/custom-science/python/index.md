---
title: Custom Science Python
permalink: /extend/custom-science/python/
---

Your Python Custom Science Application can be created in multiple ways (as described below). There are no known 
limitations to the architecture of your Python code. We recommend that you use 
our [library](https://github.com/keboola/python-docker-application). It provides useful functions for working 
with our [environment](/extend/common-interface/). Please note: 

- The repository of your Python application must always contain the `main.py` script. 
- The output mapping in your application is always required. Your application will always produce the tables and
 files listed in the output mapping (even if the files were empty).

If you are starting with Custom Science, consider going through the 
[Quickstart](/extend/custom-science/quick-start/). 
You can also have a look at an [example repository](https://github.com/keboola/python-custom-application-text-splitter).


## Packages
To install a custom package, use: 

{: .highlight .language-python}
    pip.main(['install', '--disable-pip-version-check', '--no-cache-dir', '--cert=/tmp/cacert.pem', 'packageName'])
 

Here is our current 
[list of pre-installed packages](https://github.com/keboola/docker-custom-python/blob/master/Dockerfile#L22). 
You can use those with `import`. If you know of another useful standard package to pre-install, we would like
to hear about it.
 
## Reading and Writing files
Tables from Storage are imported to the Python script from CSV files. The CSV files can be read by standard python
functions from the [csv packages](https://docs.python.org/3/library/csv.html). You can read the CSV files either 
to vectors (numbered columns) or to dictionaries (named columns). The directory structure follows our general 
[docker interface](/extend/common-interface/) - so 
input tables are stored as CSV files in `in/tables/`, output tables are stored in `out/tables/`.
It is recommended to explicitly specify the CSV formatting options.
Below is the code for basic reading and writing files, it is also available in our 
[git repository](https://github.com/keboola/docs-custom-science-example-python-basic)   

{: .highlight .language-python}
    import csv

    # CSV format settings
    csvlt = '\n'
    csvdel = ','
    csvquo = '"'

    # open the input and output files
    with open('in/tables/source.csv', mode='rt', encoding='utf-8') as inFile, open('out/tables/destination.csv', mode='wt', encoding='utf-8') as outFile:
        # write output file header
        writer = csv.DictWriter(outFile, fieldnames = ['number', 'someText', 'double_number'], lineterminator=csvlt, delimiter = csvdel, quotechar = csvquo)
        writer.writeheader()

        # read input file line-by-line
        lazyLines = (line.replace('\0', '') for line in inFile)
        csvReader = csv.DictReader(lazyLines, lineterminator=csvlt, delimiter = csvdel, quotechar = csvquo)
        for row in csvReader:
            # do something and write row
            writer.writerow({'number': row['number'], 'someText': row['someText'], 'double_number': int(row['number']) * 2})


The above example shows how to process the file line-by-line; this is the most memory-efficient way which 
allows you to process data files of any size. The expression 
`lazyLines = (line.replace('\0', '') for line in inFile)` is a 
[Generator](https://wiki.python.org/moin/Generators) which makes sure that
[Null characters](https://en.wikipedia.org/wiki/Null_character) are properly handled.
It is also important to use `encoding='utf-8'` when reading and writing files.  

To test the above code, you can use a sample [source table](/extend/source.csv) in *Storage* and the
following *runtime* configuration:

{: .highlight .language-json}
	{
		"repository": "https://github.com/keboola/docs-custom-science-example-python-basic",
		"version": "1.0.5"
	}


## Using the KBC Package
The KBC [Python extension package](https://github.com/keboola/python-docker-application) provides functions to:

- Read and parse the configuration file and parameters - `configData` property and `getParameters()` method.
- List input files and tables - `getInputFiles()`, `getInputTables()` methods.
- Work with manifests containing table and file metadata - `getTableManifest()`, `getFileManifest()`, `writeTableManifest()`, `writeFileManifest()` methods.
- List expected outputs - `getExpectedOutputFiles()` and `getExpectedOutputTables()` methods.

Additionally, it also defines a KBC [CSV dialect](https://docs.python.org/3/library/csv.html#csv-fmt-params)
to shorten up the CSV manipulation code.
The library is a standard Python package that is available by default in the production environment. 
It is [available on Github](https://github.com/keboola/python-docker-application), so it can be installed 
locally with `pip install git+git://github.com/keboola/python-docker-application.git`.
A generated [documentation](https://github.com/keboola/python-docker-application/blob/master/doc/keboola.docker.html) 
is available for the package, actual working example can be found in our 
[sample application](https://github.com/keboola/python-custom-application-text-splitter/blob/master/main.py). 
Also note that the library does no special magic, it is just a mean to simplify things a bit for you. 

To use the library to read the user-supplied configuration parameter 'myParameter':

{: .highlight .language-python}
    from keboola import docker
    
    # initialize application
    cfg = docker.Config('/data/')
    params = cfg.getParameters()

    # access the supplied value of 'myParameter'
    app$getParameters()$myParameter

The library contains a single class `Config`; a parameter of the constructor is the path to the data directory. 
The above would read the `myParameter` parameter from the user-supplied configuration:

{: .highlight .language-json}
    {
        "myParameter": "myValue"
    }

An example of the above approach is available 
in [our repository](https://github.com/keboola/docs-custom-science-example-python-parameters).  

{: .highlight .language-python}
    import csv
    from keboola import docker

    # initialize the application and read parameter 'multiplier'
    cfg = docker.Config('/data/')
    multiplier = cfg.getParameters()['multiplier']

    # open the input and output files
    with open('in/tables/source.csv', mode='rt', encoding='utf-8') as inFile, open('out/tables/destination.csv', mode='wt', encoding='utf-8') as outFile:
        # write output file header
        writer = csv.DictWriter(outFile, fieldnames = ['number', 'someText', 'double_number'], dialect='kbc')
        writer.writeheader()

        # read input file line-by-line
        lazyLines = (line.replace('\0', '') for line in inFile)
        csvReader = csv.DictReader(lazyLines, dialect='kbc')
        for row in csvReader:
            # do something and write row
            writer.writerow({'number': row['number'], 'someText': row['someText'], 'double_number': int(row['number']) * multiplier})

Note that we also simplified reading and writing of the CSV files using `dialect='kbc'` option. The dialect is 
registered automatically when the `Config` class is initialized.
You can test the code with the following runtime configuration:

{: .highlight .language-json}
	{
		"repository": "https://github.com/keboola/docs-custom-science-example-python-parameters",
		"version": "1.0.0"
	}
    
And with the following parameters:

{: .highlight .language-json}
    {
        "multiplier": 10
    }


### Dynamic Input/Output Mapping 
In the [Quick start tutorial](/extend/custom-science/quick-start/) and the above examples, we have shown 
applications which have names of their input/output tables hard-coded. 
This example shows how to read an input and output mapping specified by the end-user,
which is accessible in the [configuration file](/extend/common-interface/config-file/). It demonstrates
how to read and write tables and table manifests. File manifests are handled the same way. For a full authoritative list
of items returned in table list and manifest contents, see [the specification](/extend/common-interface/config-file/)

Note that the `destination` label in the script refers to the destination from the the mappers perspective. 
The input mapper takes `source` tables from user's storage, and produces `destination` tables that become 
the input of your extension. The output tables of your extension are consumed by the output mapper 
whose `destination` are the resulting tables in Storage.

{: .highlight .language-python}
    import csv
    from keboola import docker

    # initialize cfglication
    cfg = docker.Config('/data/')

    # get list of input tables
    tables = cfg.getInputTables()
    i = 0
    for table in tables:
        # get csv file name 
        inName = table['destination'] 
        
        # read input table metadata
        manifest = cfg.getTableManifest(inName)

        # get csv file name with full path from output mcfging
        outName = cfg.getExpectedOutputTables()[i]['full_path']

        # get file name from output mcfging
        outDestination = cfg.getExpectedOutputTables()[i]['destination']

        # get csv full path and read table data
        i = 0
        with open(table['full_path'], mode='rt', encoding='utf-8') as inFile, open(outName, mode='wt', encoding='utf-8') as outFile:
            # read input file line-by-line
            lazyLines = (line.replace('\0', '') for line in inFile)
            csvReader = csv.DictReader(lazyLines, dialect='kbc')
            headers = csvReader.fieldnames
            headers.extend(['primaryKey'])
            
            # write output file header
            writer = csv.DictWriter(outFile, fieldnames = headers, dialect='kbc')
            writer.writeheader()

            for row in csvReader:
                # if there is no primary key
                if (len(manifest['primary_key']) == 0):
                    i = i + 1
                    row['primaryKey'] = i
                else:
                    row['primaryKey'] = NULL
    
                writer.writerow(row)
    
        if (len(manifest['primary_key']) == 0):
            pk = ['primaryKey']
        else:
            pk = manifest['primary_key']

        # write table metadata - set new primary key
        cfg.writeTableManifest(outName, destination = outDestination, primaryKey = pk)

    
The above code is located in a [sample repository](https://github.com/keboola/docs-custom-science-example-python-dynamic.git), 
so you can use it with the *runtime settings*. Supply any number of input tables.

{: .highlight .language-json}
    {
        "repository": "https://github.com/keboola/docs-custom-science-example-python-dynamic.git",
        "version": "1.0.2"
    }
    
To test the code, set an arbitrary number of input/output mapping tables. Keep in mind to set the same number of 
inputs and outputs. The names of the CSV files are arbitrary.

{: .image-popup}
![Dynamic mapping screenshot](/extend/custom-science/python/dynamic-mapping.png)
  
## Error Handling
An important part of the application is handling errors. By 
[the specification](/extend/common-interface/environment/), we assume that command return 
code: 0 = no error, 1 = user error (shown to the end-user in KBC), > 1 = application error 
(the end-user will receive only a generic message). To achieve this in your python application 
you can follow the pattern from the 
[sample application](https://github.com/keboola/python-custom-application-text-splitter/blob/master/main.py), where 
the actual application is a reusable class and the `main.py` runner is handling the errors:

{: .highlight .language-python}
    try:
        app = textSplitter.App()
        app.run()
    except ValueError as err:
        print(err, file=sys.stderr)
        sys.exit(1)
    except Exception as err:
        print(err, file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        sys.exit(2)
        
In this case, we consider everything derived from `ValueError` to be an error which should be shown to the end-user. 
Every other error will lead to a generic message and only developers will see the details. You can, of 
course, modify this logic to your liking.
