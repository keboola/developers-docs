---
title: PHP Implementation Notes
permalink: /extend/component/implementation/php/
redirect_from:
    - /extend/custom-science/php/
---

* TOC
{:toc}

## Docker
Use the [official images](https://hub.docker.com/_/php/) if possible. Usually, the `alpine` versions are sufficient and are the
smallest and fastest. If you need composer, use its [official image](https://hub.docker.com/_/composer/) or
[our templates](https://github.com/keboola/component-generator/blob/master/templates/).

## Working with CSV files
We recommend using our [CSV library](https://github.com/keboola/php-csv) which provides a convenience wrapper
around the build-in [CSV functions](http://php.net/manual/en/function.fgetcsv.php).
The build-in [CSV functions](http://php.net/manual/en/function.fgetcsv.php) in PHP work well on their own too.
If you are using bare PHP, the following code illustrates their use:

{% highlight php %}
<?php
$fhIn = fopen('/data/in/tables/source.csv', 'r');
$fhOut = fopen('/data/out/tables/destination.csv', 'w');
$header = fgetcsv($fhIn);
$numberIndex = array_search('number', $header);
fputcsv($fhOut, array_merge($header, ['double_number']));
while ($row = fgetcsv($fhIn)) {
	$row[] = $row[$numberIndex] * 2;
	fputcsv($fhOut, $row);
}
fclose($fhIn);
fclose($fhOut);
echo "All done";
{% endhighlight %}

Note that we open both the input and output files simultaneously; as soon as a row is processed,
it is immediately written to the destination file. This approach keeps only a single row of data in the memory and is
generally very efficient. It is recommended to implement the processing in this way because data files
coming from KBC can by quite large.

The same can be achieved using the [CSV library](https://github.com/keboola/php-csv). Install the
pacakge with `composer require keboola/csv`. The following
piece of code shows using it as well as reading the [configuration file](/extend/common-interface/config-file/).

{% highlight php %}
<?php

require "vendor/autoload.php";

// read the configuration file
$dataDir = getenv('KBC_DATADIR') . DIRECTORY_SEPARATOR;
$configFile = $dataDir . 'config.json';
$config = json_decode(file_get_contents($configFile), true);

$multiplier = $config['parameters']['multiplier'];

// create output file and write header
$outFile = new \Keboola\Csv\CsvFile(
    $dataDir . 'out' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'destination.csv'
);
$outFile->writeRow(['number', 'someText', 'double_number']);

// read input file and write rows of output file
$inFile = new Keboola\Csv\CsvFile($dataDir . 'in' . DIRECTORY_SEPARATOR . 'tables' . DIRECTORY_SEPARATOR . 'source.csv');
foreach ($inFile as $rowNum => $row) {
    if ($rowNum == 0) {
        // skip header
        continue;
    }
    $outFile->writeRow([
        $row[0],
        $row[1],
        $row[0] * $multiplier
    ]);
}
{% endhighlight %}

## Logging
For simple applications, printing with `echo` or `print` is enough. To print to STDERR, you have to use
e.g. `fwrite(STDERR, "Hello, world!" . PHP_EOL);`. The best option is to use the [Monolog package](https://github.com/Seldaek/monolog).
The following is a useful initialization:

{% highlight php %}
$formatter = new LineFormatter("%message%\n");
$errHandler = new StreamHandler('php://stderr', Logger::NOTICE, false);
$errHandler->setFormatter($formatter);
$handler = new StreamHandler('php://stdout', Logger::INFO);
$handler->setFormatter($formatter);
$logger = new Logger('main', [$errHandler, $handler]);
{% endhighlight %}

This means that and log with [level notice](https://github.com/Seldaek/monolog/blob/master/doc/01-usage.md#log-levels) and above
will go to STDERR, and info level will go to STDOUT. The formatter removes unnecessary fields like timestamp and context.

## Error Handling
The following [piece of code](https://github.com/keboola/component-generator/blob/master/templates/php-keboola/src/run.php) is a good entrypoint:

{% highlight php %}
$dataDir = getenv('KBC_DATADIR') === false ? '/data/' : getenv('KBC_DATADIR');
try {
    $app = new Application($dataDir);
    $app->run();
    exit(0);
} catch (UserException $e) {
    echo $e->getMessage();
    exit(1);
} catch(\Throwable $e) {
    echo $e->getMessage();
    echo "errFile:" . $e->getFile();
    echo "errLine:" . $e->getLine();
    echo "code:" . $e->getCode();
    echo "trace :";
    var_export($e->getTrace())
    exit(2);
}
{% endhighlight %}

In this case, we consider everything derived from `UserException` to be an error which should be shown to the end-user.
You have to create that exception class in your component. Every other error will lead to a generic message and only
the developer will see the details and the code will follow the [general error handling rules](#error-handling).
Here we use the [`Throwable`](http://php.net/manual/en/class.throwable.php) ancestor, which also catches PHP errors. You can, of
course, modify this logic to your liking.
