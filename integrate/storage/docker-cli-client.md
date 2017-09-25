---
title: Storage Docker CLI Client
permalink: /integrate/storage/docker-cli-client/
redirect_from: /integrate/storage/php-cli-client/
---

* TOC
{:toc}

The Storage API Docker command line interface (CLI) client is a portable command line client which provides
a simple implementation of [Storage API](http://docs.keboola.apiary.io/).
It runs on any platform which has Docker installed.

Currently, the client implements

- functions for exporting and importing tables;
- functions for creating and deleting buckets; and additionally,
- the [project backup feature](https://help.keboola.com/management/project-export/).

The client source is available in our [Github repository](https://github.com/keboola/storage-api-cli).
The client docker image is available in [Quay repository](https://quay.io/repository/keboola/storage-api-cli?tab=tags).

## Running in Docker
To print available commands:

{% highlight bash %}
docker run quay.io/keboola/storage-api-cli:latest
{% endhighlight %}

The `latest` image tag always corresponds to the latest tagged version.

## Running Phar

PHAR is now deprecated, but there are still some older versions available, see the [repository documentation](https://github.com/keboola/storage-api-cli#running-phar-deprecated).

### Example --- Create a Table
To create a new table in Storage, use the `create-table` command. Provide the name of an
existing bucket, the name of the new table and a CSV file with the table's contents.

To create the`new-table` table in the `in.c-main` bucket, use

{% highlight bash %}
docker run --volume=$("pwd"):/data quay.io/keboola/storage-api-cli:latest create-table in.c-main new-table /data/new-table.csv --token=storage_token
{% endhighlight %}

or on Windows:

{% highlight bash %}
docker run --volume=C:\Users\name\some-dir:/data quay.io/keboola/storage-api-cli:latest create-table in.c-main new-table /data/new-table.csv --token=storage_token
{% endhighlight %}

The above command will import the contents of `new-table.csv` in the current directory into the newly
created table. You should see an output similar to this one:

    Authorized as: ondrej.popelka@keboola.com (Odinuv Sandbox)
    Bucket found ok
    Table create start
    Table create end
    Table id: in.c-main.new-table
    
*Please note that the Docker container can only access folders within the container, so you need to mount local folder. 
In the example above, the local folder `$("pwd")` (replaced by the absolute path on runtime) is mounted as `/data` into the container. 
The table is then accessible in this this folder. The same approach applies for all other commands working with local files.*

### Example --- Importing Data
If you want only to import new data into the table, use the `write-table` command and provide
the ID (*bucketName.tableName*) of an existing table.

To import data into the `new-table` table in the `in.c-main` bucket, use

{% highlight bash %}
docker run --volume=$("pwd"):/data quay.io/keboola/storage-api-cli:latest write-table in.c-main.new-table /data/new-data.csv --token=storage_token --incremental
{% endhighlight %}

The above command will import the contents of the `new-data.csv` file into the existing table. If the
`--incremental` parameter is supplied, the table contents will be appended. If the parameter is not
supplied, the table contents will be overwritten. You should see an output similar to this one:

    Authorized as: ondrej.popelka@keboola.com (Tutorial)
    Table found ok
    Import start
    Import done in 17 secs.

    Results:
    transaction:
    warnings:
    importedColumns:
        - id
        - secondCol
    totalRowsCount: 8
    totalDataSizeBytes: 4096


### Example --- Exporting Data
If you want to export a table from Storage, use the `export-table` command. Provide
the ID (*bucketName.tableName*) of an existing table.

To export data from the `old-table` table in `in.c-main` bucket, use

{% highlight bash %}
docker run --volume=$("pwd"):/data quay.io/keboola/storage-api-cli:latest export-table in.c-main.old-table /data/old-data.csv --token=storage_token
{% endhighlight %}

The above command will export the table from Storage and save it as `old-data.csv` in
the current directory. You should see an output similar to this one:

    Authorized as: ondrej.popelka@keboola.com (Tutorial)
    Table found ok
    Export done in 17 secs.
