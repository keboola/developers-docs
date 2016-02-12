Getting started with Custom Science
Custom science is an application which allows the end-user to use an arbitrary git repository as a data manipulation tool in his project. Custom science application allows the easiest (and somewhat limited) extension of KBC. Creating a custom science application requires no interaction from Keboola. See the [overview] for comparison with other customization options.
In custom science, all your application has to do is process tables stored input CSV files and produce result tables in CSV files. We make sure that the CSV files are created in and taken from the right places and we also make sure that your application is executed in it's own isolated environment.

Before you start:
- You must have a git repository (github or bitbucket is recommended, although any other host should work as well). It is easier to start with public repository.
- It is recommended that you have a KBC project, where you can test your code.
- Choose your language (currently available are PHP, Python and R).

Creating a simple application
Step 1
Create main application file in the root of your repository. Depending on the language used, this is either main.php, main.py or main.R. Here is a minimal example:

```
# read input
data <- read.csv("/data/in/tables/source.csv");

# do something 
data['double_number'] <- data['number'] * 2

# write output
write.csv(data, file = "/data/out/tables/result.csv", row.names = FALSE)
```

Step 2
Commit and create a tag in the repository. Yes, it is really necessary to have each version tagged and we recommend that you use [semantic versioning].

Step 3
Test the application in KBC. Go to Appliations - Add new Custom Science application (choose the one with the correct language). Add configuration in which you set input and output mapping and repository.

Input mapping:
To test the above script, you can use the [sample table]. Name of the table in the Storage is not important, but make sure to set the outputmapping name to 'source.csv'

The same goes for output mapping - make sure to set the source (it is the source of output mapping - i.e the result of your script) to 'result.csv'.

Parameters:
Leave this empty for now

Runtime parameters:
Here goes the configuration of the repository. This must be entered as a [JSON formatted] string.
{
	"repository":
	"version":
}

By running the above configuration, you should obtain a table 'out.c-customscience.test1' with the following data.

''


Adding parameters
Step 1
You can pass the application an arbitrary set of parameters:

# read input
data <- read.csv("/data/in/tables/source.csv");

# do something 
data['double_number'] <- data['number'] * app$getParameters()$multiplier

# write output
write.csv(data, file = "/data/out/tables/result.csv", row.names = FALSE)

In the above example we take advantage of our KBC docker library. It is set of helper functions so that you don't need to worry about the [configuration format]. It does not do any complex magic, so you may read the raw format if you wish.

Step 2
Commit the code and don't forget to create a new tag in the repository.

Step 3
Enter the configuration in the configuration field.
{
	"multiplier": 4
}
Note that the configuration format is arbitrary and there is no validation. You should implement parameter validation in your script, otherwise the end-user may receive confusing error messages.


Dynamic input and output mapping
In the above example we used static input/output mapping which means that the names of CSV files are hardcoded in the application script. There are two potential problems with this:
- the end-user has to manually set those names
- the end-user has to create input/output mapping for each source and result file. 
Depending on your use case this may or may not be a problem, so the following step is fully optional. Also note that if your application is getting fairly complex, you might want to checkout [docker addons].


Custom science registration
Custom science is designed to fullfill direct agreement between enduser and developer. However, if you want to offer your code to all KBC customers, you can have your application registered in our KBC App store. See the [registration process].

Comparison with transformations
Most transformations can be turned into science application and vice versa with none or very few modifications. The KBC interface and the code used in custom science application is highly similar to the one used in transformations. 

Usage differences:
- Code in transformations is visible to everyone in the KBC project. In Custom Science, the code can be stored in private repository. In case you need to hide your code, you have to use Custom Science
- Code in transformation is tied to project. If you want to share the code across diferent projects, you must use Custom Science
- Custom science applications are versioned externally (using tags in git repository), transformations are versioned as changes in configuration in the KBC project

Technical diffrences:
- File input mapping is slightly different. In transformations, there is the option to select tags, which will be used to select files from file uploads and moved to in/user directory where only the latest file with the given tag is stored. This is a simplified version of working with input files which is not available in Custom science. To select files with some tags from file uploads use `tag: fooBar` selector in input files setting. To manualy select the latest file use the file manifests.
- The docker images in which the applications run are not exactly the same. Although they are based on same parent image, if you want to make an exact replica of the environment, make sure to use the correct image.
- Custom science applications can be parametrized, Transformations have no parameters.
- In Python and R transformations, the external packages are installed automatically, in Custom applications you need to install them issuing the respective command. 
- Php Transformations are not available (yet)

