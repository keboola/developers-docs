---
title: Quick start
permalink: /extend/custom-science/quick-start/
---

## Before you start:	
- You must have a git repository ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) is recommended, 
although any other host should work as well). It is easier to start with public repository.
- You should have a KBC project, where you can test your code.
- Choose your language (currently available are: [Python](/extend/custom-science/python/) or [R](/extend/custom-science/r)).

## Creating a simple application

### Step 1
Create main application file in the root of your repository. Depending on the language used, 
this is either `main.py` or [`main.R`](https://github.com/keboola/docs-custom-science-example-1/blob/master/main.R). 
Here is a minimal example:

	# read input
	data <- read.csv("/data/in/tables/source.csv");

	# do something 
	data['double_number'] <- data['number'] * 2

	# write output
	write.csv(data, file = "/data/out/tables/result.csv", row.names = FALSE)

### Step 2
Commit and create a git tag (Github release) in the repository. Yes, it is really necessary to have each version tagged and we recommend 
that you use [Semantic versioning](http://semver.org/).

![Github tag screenshot](/extend/custom-science/repository-tag.png)

### Step 3
Test the application in KBC. Go to *Appliations* - *New Application* - *Custom Science* (choose the one with the correct 
language). *Add configuration* in which you set input and output mapping and repository. Create a 
[source table](/extend/custom-science/source.csv), e.g.:

{:.table}
| number | someText |
| -------- | --- |
| 10 | ab |
| 20 | cd |
| 25 | ed |
| 26 | fg |
| 30 | ij |

#### Input and output mapping:
To test the above script, you can use the above sample table. Name of the table in the *Storage* is not important, 
but make sure to set the outputmapping name to **source.csv** - that is what we expect in 
the [sample script](https://github.com/keboola/docs-custom-science-example-1/blob/master/main.R#L2).

![Input mapping configuration](/extend/custom-science/input-mapping.png)

The same goes for output mapping - make sure to set the source (it is the source of output mapping - i.e 
the result of your script) to **result.csv** (defined 
in [sample script](https://github.com/keboola/docs-custom-science-example-1/blob/master/main.R#L8).

Leave *File input mapping* empty.

#### Configuration 
Leave *parameters* empty for now. In *Runtime parameters* enter the the configuration of the repository. 
This must be entered as a [JSON formatted](http://www.w3schools.com/json/json_syntax.asp) string.

	{
		"repository": "https://github.com/keboola/docs-custom-science-example-1",
		"version": "0.0.1"
	}

![Application configuration example](/extend/custom-science/configuration.png)

By running the above configuration, you should obtain a table **out.c-main.custom-science-example** with the following data:

{:.table}
number | someText | double_number
--- | --- | ---
10 | ab | 20
20 | cd | 40
25 | ed | 50
26 | fg | 52
30 | ij | 60


## Adding parameters

###Step 1
You can pass the application an arbitrary set of parameters, in the following example we choose to use parameter `multiplier`
	
	# intialize application
	library('keboola.r.docker.application')
	app <- DockerApplication$new('/data/')
	app$readConfig()

	# read input
	data <- read.csv("/data/in/tables/source.csv");

	# do something 
	data['double_number'] <- data['number'] * app$getParameters()$multiplier

	# write output
	write.csv(data, file = "/data/out/tables/result.csv", row.names = FALSE)

In the above example we take advantage of our [KBC Docker R library](/extend/custom-science/r/). 
It is set of helper functions so that you don't need 
to worry about the [configuration format](/extend/common-interface/config-file/). It does not do any complex magic, 
so you may read the raw format if you wish. We have a library available both for 
[R language](/extend/custom-science/r/) and
[Python language](/extend/custom-science/python/).

### Step 2
Commit the code and don't forget to create a new tag in the repository.

### Step 3
Enter the configuration in the parameters field.

	{
		"multiplier": 4
	}

Enter the repository in the runtime field.
	{
		"repository": "https://github.com/keboola/docs-custom-science-example-2",
		"version": "0.0.1"
	}


Note that the configuration format is arbitrary and there is no validation. You should implement parameter 
validation in your script, otherwise the end-user may receive confusing error messages.

![Application configuration with parameters example](/extend/custom-science/configuration-2.png)


## Dynamic input and output mapping
In the above example we used static input/output mapping which means that the names of CSV files are hardcoded in
 the application script. There are two potential problems with this:

- the end-user has to manually set those names
- the end-user has to create input/output mapping for each source and result file. 

Depending on your use case this may or may not be a problem. In case you want to use dynamic input mapping, 
consult the [development guide](/extend/custom-science/development/). Also note that if your application is getting fairly complex, 
you might want to checkout [Docker extensions](/extend/docker).
