---
title: Storage PHP Client Library
permalink: /integrate/storage/php-client/
---

* TOC
{:toc}

Storage API PHP client library is a portable command line client providing
the most complete [Storage API](http://docs.keboola.apiary.io/) implementation.
It runs on any platform which has PHP installed.
Currently this client implements almost all Storage API functions including, of course, exporting and importing tables.

The client source is available in our [Github repository](https://github.com/keboola/storage-api-php-client).

## Installation

The Library is available as a [Composer package](https://getcomposer.org/).
Unless you already have it, [install Composer](https://getcomposer.org/download/) on your system.
On *nix system, do so by running

{% highlight bash %}
curl -s http://getcomposer.org/installer | php
mv ./composer.phar ~/bin/composer # or /usr/local/bin/composer
{% endhighlight %}

On Windows, use the [installer](https://getcomposer.org/Composer-Setup.exe).

### Library installation
To install the library, run

{% highlight bash %}
composer require keboola/storage-api-client
{% endhighlight %}

in the root of your project. You should get an output similar to this one:

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
installable by Composer can be browsed at [Packagist package repository](https://packagist.org/).

## Usage
The Storage API client is implemented as a single class. To create an instance of the class, provide Storage API token to the
constructor.

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
To import CSV data into an existing table and overwrite its contents, use the following PHP script:

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

### Example - Import data Incrementaly
To import CSV data into an existing table and append the new data to the existing table contents, use the following PHP script:

{% highlight php %}
<?php
require 'vendor/autoload.php';

use Keboola\Csv\CsvFile;
use Keboola\StorageApi\Client;

$client = new Client([
    'token' => 'your-token',
]);
$csvFile = new CsvFile('./new-table.csv');
$client->writeTableAsync('in.c-main.new-table', $csvFile, ['incremental' => true]);
{% endhighlight %}

All available upload options are listed in the [API documentation](http://docs.keboola.apiary.io/#reference/tables/load-data).

### Example - Export data
To export data from a Storage table to a CSV file, use the
`TableExporter` class. It is part of the client library. You can use the following script:

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
