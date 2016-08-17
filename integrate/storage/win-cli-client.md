---
title: Storage CLI Client for Microsoft Windows
permalink: /integrate/storage/win-cli-client/
---

* TOC
{:toc}

The Storage API Command line interface (CLI) client for Microsoft Windows is a simple implementation
of [Storage API](http://docs.keboola.apiary.io/) currently supporting only a
very **limited** set of the API features: loading data into Storage.
In case you need more data manipulation features, check out the [PHP CLI client](/integrate/storage/php-cli-client/).

The client source code is available in our [Github repository](https://github.com/keboola/storage-api-dotnet-client).

## Installation
This application requires .NET Framework 4.0 (or higher) which is natively included since Windows 7
and Windows Server 2008 R2. A [download is available](https://www.microsoft.com/en-us/download/details.aspx?id=17718)
for older versions of Windows.

## Manual Installation
If you do not want to install Chocolatey, simply download all the application files in a
[ZIP package](https://keboola-sapi-dotnet-client.s3.amazonaws.com/builds/sapi-client.zip).

## Installation Via Chocolatey
[Chocolatey](https://chocolatey.org/) is a package manager for Windows. You can install
[Storage API client package](https://chocolatey.org/packages/SapiClient/) using Chocolatey.

If you do not have Chocolatey installed, do so using the following (administrator) command line:

{% highlight Batchfile %}
@powershell -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%systemdrive%\chocolatey\bin
{% endhighlight %}

Chocolatey will be installed, by default, into `C:\ProgramData\chocolatey`. In case you have just installed
Chocolatey, make sure to open a new instance of the command line window.

To install the SAPI client, just run the following command in the windows command line:

{% highlight Batchfile %}
cinst SapiClient
{% endhighlight %}

This command will install all SAPI client application binaries into **C:\ProgramData\chocolatey\bin\**.

## Uninstalling the Client
You can uninstall the SAPI client from Chocolatey typing the following command:

{% highlight Batchfile %}
cuninst SapiClient
{% endhighlight %}

All the Storage API Client application binaries and folders will be deleted (Chocolatey itself remains installed).

## Running the Client
Now run the `sapi-client` command globally from any folder in the windows command line. You can see
the client's available commands by running

{% highlight Batchfile %}
sapi-client
{% endhighlight %}

### Example - Create a Table
To create a new table in Storage, use the `create-table` command. Provide the name of an
existing bucket, the name of the new table and a CSV file with the table's contents.

To create the `new-table` table  in the `in.c-main` bucket, use

{% highlight Batchfile %}
sapi-client create-table in.c-main new-table D:\new-table.csv --token=storage_token --primary-key=id
{% endhighlight %}

The above command will import the contents of `new-table.csv` into the newly created table. It will
also mark the `id` column as the primary key.

### Example - Importing Data
If you want only to import new data into the table, use the `write-table` command. Provide
the ID (*bucketName.tableName*) of an existing table.

To import data into the `new-table` table in the `in.c-main` bucket, use

{% highlight Batchfile %}
sapi-client write-table in.c-main.new-table D:\new-data.csv --token=storage_token --incremental
{% endhighlight %}

The above command will import the contents of the `new-data.csv` file into the existing table. If the
`--incremental` parameter is supplied, the table contents will be appended. If the parameter is not
supplied, the table contents will be overwritten.
