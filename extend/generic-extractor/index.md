---
title: Generic Extractor
permalink: /extend/generic-extractor/
---

* TOC
{:toc}

Generic Extractor is a [Keboola component](/overview/) which acts like a customizable
[HTTP REST](/extend/generic-extractor/tutorial/rest/) client. It can be configured to extract data
from virtually any sane web API.

Due to the versatility of different APIs running in the wild, Generic Extractor offers a vast amount
of [**configuration options**](/extend/generic-extractor/configuration/). 

You may opt to use the [**visual builder**](/extend/generic-extractor/configuration/#user-interface), that provides a very convenient way 
of configuring and testing the configuration. With it, you can build
an entirely new extractor for Keboola in **less than an hour**.


{: .image-popup}
![Generic Extractor - UI Animation](/components/extractors/other/generic/animation.gif)


To get started quickly, follow our [Generic Extractor tutorial](/extend/generic-extractor/tutorial).

## Generic Extractor Requirements
Generic Extractor allows you to extract data from an API into Keboola only by configuring it.
No programming skills or additional tools are required. You just need to do two easy things before you start:

- Familiarity with [JSON format](/extend/generic-extractor/tutorial/json/).
- Have the documentation of your chosen API at hand. The API should be [RESTful](/extend/generic-extractor/tutorial/rest/)
and, more or less, follow the HTTP specification.

## Configuration & Development
Again, if you are new to Generic Extractor, we strongly suggest you go through the
[Generic Extractor tutorial](/extend/generic-extractor/tutorial/). It shows the basic principles, as well as
the most important features.

With the new convenient user interface, you can set up and test the connection in a few clicks 
just like you are used to in some other popular API development tools. 

Features such as cURL import, request tests, output mapping generator or dynamic function templates and evaluation make the configuration process as easy as ever.


If you intend to develop a more complicated configuration, check out how to
[run Generic Extractor locally](/extend/generic-extractor/running/).
There are a [number of examples](https://github.com/keboola/generic-extractor/tree/master/doc) accompanying the
documentation which [can be run locally](/extend/generic-extractor/running/#running-examples) too.

## Publishing Generic Extractor Configuration
Each configuration of Generic Extractor can be [published](/extend/generic-extractor/publish/) as
a new standalone component. For the registration, configurations have to be
[converted to a template](/extend/generic-extractor/publish/#submission).

Publishing your Generic Extractor configuration is **not required**. However, when published,
it can be easily used in multiple projects. A great advantage of using templates is that they
do not limit the configuration at all. You can always switch to JSON
[free-form configuration](/extend/generic-extractor/publish/#submission) when necessary.

Also note that templates can be used only with published components based on Generic Extractor configurations.

## Generic Extractor Source
As with any other Keboola components, the Generic Extractor source is available on
[GitHub](https://github.com/keboola/generic-extractor/). Apart from the
main repository, it uses some vital libraries (which partially define its capabilities):

- [Juicer](https://github.com/keboola/juicer) --- component responsible for processing HTTP JSON responses
- [CSV Map](https://github.com/keboola/php-csvmap) --- library which converts JSON data into CSV tables
- [Filter](https://github.com/keboola/php-filter) --- library which allows to match values together
- [JSON Parser](https://github.com/keboola/php-jsonparser) --- JSON parser which produces CSV tables while maintaining relations
