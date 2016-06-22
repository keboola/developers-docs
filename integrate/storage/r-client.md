---
title: R Client Library
permalink: /integrate/storage/r-client/
---

* TOC
{:toc}

R client library is a [Storage API client](http://docs.keboola.apiary.io/) which you can use from 
withing an R code. The current implementation supports all basic data manipulations - 
importing data and exporting data, and creating and deleting buckets and tables.
The client source code is available in our [Github repository](https://github.com/keboola/sapi-r-client).

## Installation
This library is available on [Github](https://github.com/keboola/sapi-r-client), so we 
recommend that you use `devtools` package to install it.

{% highlight r %}
# first need to install the devtools package if it isn't already installed
install.packages("devtools")

# install dependencies (another github package for aws request signature generation)
devtools::install_github("cloudyr/aws.signature")

# install the SAPI R client package
devtools::install_github("keboola/sapi-r-client")

# load the library (dependencies will be loaded automatically)
library(keboola.sapi.r.client)
{% endhighlight %}

## Usage
To list available commands, you can run:
{% highlight r %}
?keboola.sapi.r.client::SapiClient
{% endhighlight %}

Note that if you are running the code in R Studio, it might require a restart so that its help index is updated 
and the above command works. 

The client is implemented as na [RC class](http://adv-r.had.co.nz/R5.html/). To work with it, you
need to create an instance of the client.
The only required argument to create a client is a valid Storage API token.

{% highlight r %}
client <- SapiClient$new(
    token = 'your-token'
)
{% endhighlight %}

### Example - Create a table and import data
To create a new table in Storage, use the `saveTable` function. You need to provide a name of an 
existing bucket, a name of the new table and a CSV file with the contents of the table.

To create a table `new-table` in bucket `in.c-main` you would use:

{% highlight r %}
myDataFrame <- data.frame(id = c(1,2,3,4), secondCol = c('a', 'b', 'c', 'd')) 
client <- SapiClient$new(
    token = 'your-token'
)

table <- client$saveTable(
    df = myDataFrame, 
    bucket = "in.c-main", 
    tableName = "new-table", 
    options = list(primaryKey = 'id')
)
{% endhighlight %}

The above command will import the contents of the `myDataFrame` variable into the newly created table, it will
also mark the column `id` as a primary key.

### Example - Exporting data
If you want to export a table from Storage and import them into R, use the `importTable` function. You need to provide
an ID (*bucketName.tableName*) of an existing table.

To export data from the table `old-table` in bucket `in.c-main`, you would use:

{% highlight PowerShell %}
client <- SapiClient$new(
  token = 'your-token'
)

data <- client$importTable('in.c-main.old-table')
{% endhighlight %}

The above command will export the table from storage and save it in `data` variable. The output is 
a [data.table](https://cran.r-project.org/web/packages/data.table/index.html) object which is 
compatible with a `data.frame`.

### Other Examples

{% highlight r %}
# create client
client <- SapiClient$new(
    token = 'your-token'
)

# verify the token
tokenDetails <- client$verifyToken()

# create a bucket
bucket <- client$createBucket("new_bucket", "in", "A brand new Bucket!")

# list buckets
buckets <- client$listBuckets()

# list all tables
tables <- client$listTables()

# list all tables in a bucket
tables <- client$listTables(bucket = bucket$id)

# delete table
client$deleteTable(table$id)

# delete bucket
client$deleteBucket(bucket$id)

{% endhighlight %}
