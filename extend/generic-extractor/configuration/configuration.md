---
title: Generic Extractor Configuration
permalink: /extend/generic-extractor/configuration/
---

* TOC
{:toc}

*To configure your first Generic Extractor, follow our [tutorial](/extend/generic-extractor/tutorial/).*

To get an overall idea of what to expect when configuring Generic Extractor, take a look at the following **overview** of various configuration sections.

Then go through a [sample configuration](#configuration-map) featuring all configuration options and their
nesting. The **configuration map** is also available as a [separate article](/extend/generic-extractor/map/).


### User Interface

{% include branches-beta-warning.html %}

Recently, we created a convenient user interface that allows you to build a configuration for the Generic Extractor without the need to write JSON code. 
You can set up and test the connection in a few clicks just like you are used to in some other popular API development tools. 

Features such as cURL import, request tests, output mapping generator or dynamic function templates and evaluation make the configuration process as easy as ever.


{: .image-popup}
![Generic Extractor - UI Animation](/components/extractors/other/generic/animation.gif)

You can switch between the JSON representation and User interface in the upper right corner of the configuration editor.

{: .image-popup}
![UI Switch](/extend/generic-extractor/configuration/ui_switch.png)

#### Backward compatibility

The new User Interface is mostly backward compatible with the old JSON configuration. However, some features are not supported in the new UI yet. 
In such case you will be notified in the UI what sections are not supported.

**NOTE** The new UI does not affect the functionality of old configurations. All configurations will continue to work. 
Only in some cases, you might need to perform some manual adjustments in order to make the UI compatible.


### JSON Configuration Sections
*Click on the section names if you want to learn more.*

- **parameters**
    - [**api**](/extend/generic-extractor/configuration/api/) --- sets the basic properties of the API.
        - [**baseUrl**](/extend/generic-extractor/configuration/api/#base-url) --- defines the URL to which the
        API requests should be sent.
        - [**caCertificate**](/extend/generic-extractor/configuration/api/#ca-certificate) --- defines custom certificate authority bundle in `crt`/`pem` format.
        - [**#clientCertificate**](/extend/generic-extractor/configuration/api/#client-certificate) --- defines client certificate and private key in `crt`/`pem` format.
        - [**pagination**](/extend/generic-extractor/configuration/api/pagination/) --- breaks a result with a
        large number of items into separate pages.
        - [**authentication**](/extend/generic-extractor/configuration/api/authentication/) --- needs to be
        configured for any API which is not public.
        - [**retryConfig**](/extend/generic-extractor/configuration/api/#retry-configuration) --- automatically,
        and repeatedly, retries failed HTTP requests.
        - [**http**](/extend/generic-extractor/configuration/api/#default-http-options) --- sets the timeouts, default
        headers and parameters sent with each API call.
    - **aws**
      - [**signature**](/extend/generic-extractor/configuration/aws-signature) --- defines AWS credentials for signature request
    - [**config**](/extend/generic-extractor/configuration/config/) --- describes the actual extraction.
        - [**debug**](/extend/generic-extractor/running/#debug-mode) --- shows all HTTP requests sent by
        Generic Extractor.
        - [**outputBucket**](/extend/generic-extractor/configuration/config/#output-bucket) --- defines the name
        of a Storage Bucket in which the extracted tables will be stored.
        - [**http**](/extend/generic-extractor/configuration/config/#http) --- sets the HTTP headers sent with
        every request.
        - [**jobs**](/extend/generic-extractor/configuration/config/jobs/) --- describes the API endpoints
        (resources) to be extracted.
        - [**mappings**](/extend/generic-extractor/configuration/config/#mappings) --- describes how the JSON
        response is converted into CSV files that will be imported into Storage.
        - [**incrementalOutput**](/extend/generic-extractor/incremental/) ---  loads the extracted data into
        Storage incrementally.
        - [**userData**](/extend/generic-extractor/configuration/config/#user-data) --- adds arbitrary data to
        extracted records.
        - [**sshProxy**](/extend/generic-extractor/configuration/ssh-proxy/) --- securely access HTTP(s) endpoints inside your private Network.
        - [**iterations**](/extend/generic-extractor/configuration/iterations/) --- executes a configuration multiple times, each time
  with different values.
- [**authorization**](/extend/generic-extractor/configuration/api/authentication/#oauth) --- allows injecting OAuth authentication.

There are also simple pre-defined [**functions**](/extend/generic-extractor/functions/) available, adding extra
flexibility when needed.

Generic Extractor can be run from within the [**Keboola user interface**](/extend/generic-extractor/running/) (only
configuration [JSON](/extend/generic-extractor/tutorial/json/) needed), or [**locally**](/extend/generic-extractor/running/#running-locally)
([Docker](/extend/component/docker-tutorial/) needed).

### Configuration Map
The following sample configuration shows various configuration options and their nesting.
You can use the map to navigate between them. The parameter map is also available
[separately](/extend/generic-extractor/map/) and we recommend pinning it to your toolbar for quick reference.

{% highlight json %}
{% include config-map.json %}
{% endhighlight %}

<script>
{% include config-events.js %}
</script>
<style>
pre a {
    border-bottom: 1px dashed navy;
}
</style>
