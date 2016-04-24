---
title: Transformations
permalink: /integrate/transformations/
---

* TOC
{:toc}

## API

The Transformations API is described on [Apiary.io](http://docs.keboolatransformationapi.apiary.io/). 

### Deprecating

#### Configurations

API calls to work with [configuration buckets](http://docs.keboolatransformationapi.apiary.io/#reference/configuration-buckets) and [transformations](http://docs.keboolatransformationapi.apiary.io/#reference/transformations) will be soon deprecated, please use [Storage API Components Configurations](http://docs.keboola.apiary.io/#reference/component-configurations).

## Configuration

Transformations configurations are stored in [Storage API Components Configurations](http://docs.keboola.apiary.io/#reference/component-configurations). A Storage API Configuration refers to a Transformation Bucket, Storage API Configuration Row is a single transformation.
 
When you're creating the configuration programmatically, you can use [these JSON schemas](https://github.com/keboola/transformation-bundle/tree/master/Resources/schemas) to validate the configuration before storing it.
 

## Source code

Transformations source code is available on [GitHub](https://github.com/keboola/transformation-bundle).

