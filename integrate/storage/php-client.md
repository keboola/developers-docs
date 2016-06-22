---
title: Storage PHP client library
permalink: /integrate/storage/php-client/
---

* TOC
{:toc}

Storage API PHP client library is portable command line client which provides 
the most complete implementation of [Storage API](http://docs.keboola.apiary.io/). The client 
runs on any platform which has PHP installed. 
Currently the client implements almost all functions of Storage API including of cousre exporting and importing
 tables.  
The client source is available in our [Github repository](https://github.com/keboola/storage-api-cli).

## Installation

The Library is available as [composer package](https://getcomposer.org/). 
If you don't have composer installed on your system, you need to 
to [install composer](https://getcomposer.org/download/). On *nix system
you can do so by running: 

{% highlight bash %}
curl -s http://getcomposer.org/installer | php
mv ./composer.phar ~/bin/composer # or /usr/local/bin/composer
{% endhighlight %}

On Windows, use the [installer](https://getcomposer.org/Composer-Setup.exe)

### Library installation
To install the library, run

{% highlight bash %}
composer require keboola/storage-api-client
{% endhighlight %}

in the root of your project. You should get an output similar to:

    Using version ^4.11 for keboola/storage-api-client
    ./composer.json has been created
    Loading composer repositories with package information
    Updating dependencies (including require-dev)
    - Installing aws/aws-sdk-php (3.18.18)
        Downloading: 100%
    ...  
    - Installing keboola/storage-api-client (4.11.0)
        Downloading: 100%
    Writing lock file
    Generating autoload files

Then add the generated autoloader in your bootstrap script:

{% highlight php %}
require 'vendor/autoload.php';
{% endhighlight %}

You can read more in [Composer documentation](http://getcomposer.org/doc/01-basic-usage.md). Packages
installable by composer can be browsed at [Packagist package repository](https://packagist.org/).

## Usage
The Storage API client is implemented as a single class, you need to provide Storage API token to the 
consturctor to create an instance of the class:

{% highlight php %}
<?php

require 'vendor/autoload.php';

use Keboola\StorageApi\Client;

$client = new Client([
  'token' => 'your-token',
]);
{% endhighlight %}

### Example - Create a table 
To create a new table in Storage, it is recommended to use an additional 
[php-csv](https://github.com/keboola/php-csv) library to work 
with CSV files. The library will get installed
automatically with Storage API client, so you can use it out of the box.
To create a new table and import CSV data in it, you can use the following PHP script:

{% highlight php %}
<?php
require 'vendor/autoload.php';

use Keboola\Csv\CsvFile;
use Keboola\StorageApi\Client;

$client = new Client([
    'token' => 'your-token',
]);
$csvFile = new CsvFile('./new-table.csv');
$client->createTableAsync('in.c-main', 'new-table', $csvFile);
{% endhighlight %}

### Example - Import data 
To import data to an existing table and import CSV data in it, you can use the following PHP script:

{% highlight php %}
<?php
require 'vendor/autoload.php';

use Keboola\Csv\CsvFile;
use Keboola\StorageApi\Client;

$client = new Client([
    'token' => 'your-token',
]);
$csvFile = new CsvFile('./new-table.csv');
$client->writeTableAsync('in.c-main.new-table', $csvFile);
{% endhighlight %}

### Example - Export data 
To export data from a Storage table to a CSV file, use the 
`TableExporter` class which is part of the client library. You can use the following script:

{% highlight php %}
<?php
require 'vendor/autoload.php';

use Keboola\StorageApi\Client;
use Keboola\StorageApi\TableExporter;

$client = new Client([
    'token' => 'your-token'
]);

$exporter = new TableExporter($client);
$exporter->exportTable('in.c-main.my-table', './old-table.csv');
{% endhighlight %}
