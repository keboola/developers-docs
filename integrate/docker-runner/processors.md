---
title: Docker Runner
permalink: /integrate/docker-runner/processors/
---

* TOC
{:toc}

Processors are additional components which may be used before or after running an 
arbitrary component (extractor, writer, ...). When [Docker Runner](/integrate/docker-runner/) runs 
a docker image a processor may be used to pre-process the inputs (files or tables) supplied to that 
image or it may be used to post-process the image outputs. For example a 
[`iconv`](https://en.wikipedia.org/wiki/Iconv) processor may be used as a post-processor to an extractor
which extracts CSV data in different than UTF-8 encoding expected by the [Storage](todo).

## Configuration
Processors are technically supported in any configuration, however the option may not always be available in 
the UI. To manually configure processors, you have to use the [Component Configuration API](todo). By running
the [Get Configuration](todo) request for a specific component and configuration, you obtain the 
actual configuration, for example:

{% highlight json %}
priklad FTP
{% endhighlight %}

From this, the actual configuration is the contents of the `configuration` node. Therefore:

{% highlight json %}
{% endhighlight %}

Processors are configured in the `processors` node in either array `before` or `after` array. For example:

{% highlight json %}
{% endhighlight %}

The above configuration defines that **after** this particular configuration of a FTP extractor is finished
but before it's results are loaded into Storage a `keboola.processor-headers` (the headers processor fills
missing columns in a CSV file) processor will run. After the processor is finished, it's outputs are loaded
into Storage as if they were outputs of the extractor itself.

To save the configuration, you need to use the [Update Configuration API call](todo). 

http://www.cleancss.com/json-minify/