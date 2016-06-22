---
title: Storage CLI client for Microsoft Windows
permalink: /integrate/storage/win-cli-client/
---

* TOC
{:toc}

Storage API Command line interface (CLI) client for Microsoft Windows is a simple implementation
of [Storage API](http://docs.keboola.apiary.io/). The current implementation supports only 
very limited set of the API features - loading of data into Storage. 
In case you need more data manipulation features, you might want to check out 
[PHP CLI client](/intergrate/storage/php-cli-client/).
The client source code is available in our [Github repository](https://github.com/keboola/storage-api-dotnet-client).

## Installation
This application requires .NET Framework 4.0 (or higher) which is natively included since Windows 7 
and Windows Server 2008 R2. A [download is available](https://www.microsoft.com/en-us/download/details.aspx?id=17718)
for older versions of Windows. 

## Manual Installation
If you don't want to install Chocolatey, you can simply download all the application files in a 
[ZIP package](https://keboola-sapi-dotnet-client.s3.amazonaws.com/builds/sapi-client.zip)

## Installation via Chocolatey
[Chocolatey](https://chocolatey.org/) is a package manager for Windows. You can install 
[Storage API client package](https://chocolatey.org/packages/SapiClient/) using Chocolatey.

If you don't have chocolatey installed, you can install it with the following (administrator) command line:

{% highlight Batchfile %}
@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%systemdrive%\chocolatey\bin
{% endhighlight %}

By default, Chocolatey will be installed into `C:\ProgramData\chocolatey` In case you've just installed 
Chocolatey make sure you have opened a new instanace of command line 
window. 

To install SAPI client just run the following command into the windows command line:

{% highlight Batchfile %}
cinst SapiClient
{% endhighlight %}

This command will install all SAPI client application binaries into **C:\ProgramData\chocolatey\bin\**.

## Uninstalling the Client
You can uninstall the from chocolatey typing the following command:

{% highlight Batchfile %}
cuninst SapiClient
{% endhighlight %}

All the Storage API Client application binaries and folders will be deleted (chocolatey itself remains installed).

## Running the client
Now you can run command sapi-client globally from any folder in the windows command line. You can see
the available commands by running

{% highlight Batchfile %}
sapi-client
{% endhighlight %}

### Example - Create a table
To create a new table in Storage, use the `create-table` command. You need to provide a name of an 
existing bucket, a name of the new table and a CSV file with the contents of the table.

To create a table `new-table` in bucket `in.c-main` you would use:

{% highlight Batchfile %}
sapi-client create-table in.c-main new-table D:\new-table.csv --token=storage_token --primary-key=id
{% endhighlight %}

The above command will import the contents of `new-table.csv` into the newly created table, it will
also mark the column `id` as a primary key.

### Example - Importing data
If you want only to import new data into the table, use the `write-table` command. You need to provide
an ID (*bucketName.tableName*) of an existing table.  

To import data into the table `new-table` in bucket `in.c-main`, you would use:

{% highlight Batchfile %}
sapi-client write-table in.c-main.new-table D:\new-data.csv --token=storage_token --incremental
{% endhighlight %}

The above command will import the contents of the `new-data.csv` file into the existing table. If the 
`--incremental` parameter is supplied, the table contents will be appended. If the parameter is not
supplied, the table contents will be overwritten.

### Example - Exporting data
If you want to export a table from storage, use the `export-table` command. You need to provide
an ID (*bucketName.tableName*) of an existing table.

To export data from the table `old-table` in bucket `in.c-main`, you would use:

{% highlight Batchfile %}
sapi-client export-table in.c-main.old-table D:\old-data.csv --token=storage_token
{% endhighlight %}

The above command will export the table from storage and save it as `old-data.csv` on the D drive.
