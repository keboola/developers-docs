---
title: Extending KBC
permalink: /extend/
---

The KBC environment consists of many built-in [*components*](/overview/) which interoperate 
together (e.g. Storage, Transformations and Readers). You can also create KBC extensions. Currently, 
there are two types of extensions available:

* [Generic Extractor](/extend/generic-extractor/) - a specific component designated for implementing extractors for services with REST API
* Custom Extension - a component extending KBC with an arbitrary code

## Custom Extensions

Custom Extensions can be used as Applications, Extractors and Writers. 

Applications process input tables stored in CSV files and generate result tables in CSV files. Extractors work the same way. However, instead of reading their input from KBC tables, they get it from an external source (usually an API). Similarly, Writers do not generate any KBC tables.

All extensions run inside a [Docker component](/overview/docker-bundle) which takes care of: 

* Authentication
* Starting and stopping the extension
* Reading and writing data to KBC Storage
* Application isolation

They must adhere to a [common interface](/extend/common-interface/). 

There are two types of Custom extensions differing in the level of integration and implementation flexibility:

* [Custom Science extension](/extend/custom-science/) - easier to implement, less features available
* [Docker extension](/extend/docker/) - maximum implementation flexibility

## Comparison of Extensions

The following table provides an overview of the main characteristics of KBC extensions:

<table class="table">
  <tr>
    <th colspan="2"></th>
    <th>Docker</th>
    <th>Custom Science</th>
    <th>Generic Extractor</th>
  </tr>
  <tr>
    <th rowspan="3">Implementation</th>
    <th>Implementation Complexity</th>
    <td>medium</td>
    <td>easy</td>
    <td>very easy</td>
  </tr>
  <tr>
    <th>Application Environment</th>
    <td>any</td>
    <td>R or Python</td>
    <td>configuration only</td>
  </tr>
  <tr>
    <th>Knowledge of Docker Required</th>
    <td>yes</td>
    <td>no</td>
    <td>no</td>
  </tr>
  <tr>
    <th rowspan="5">User Features</th>
    <th>Setup User Experience</th>
    <td>fully customizable</td>
    <td>poor</td>
    <td>poor</td>
  </tr>
  <tr>
    <th>Brandable</th>
    <td>yes</td>
    <td>no</td>
    <td>no
      (coming soon)</td>
  </tr>
  <tr>
    <th>Offered to All Users</th>
    <td>yes</td>
    <td>no</td>
    <td>no
      (coming soon)</td>
  </tr>
  <tr>
    <th>Customizable User Interface</th>
    <td>yes</td>
    <td>no</td>
    <td>no</td>
  </tr>
  <tr>
    <th>OAuth2 Support</th>
    <td>yes</td>
    <td>no</td>
    <td>yes</td>
  </tr>
  <tr>
    <th>Other</th>
    <th>Keboola Approval/Registration Required</th>
    <td>yes</td>
    <td>no</td>
    <td>no</td>
  </tr>
</table>

*Note: With the exception of Generic Extractor, all KBC Extensions can be used for creating Extractors, 
Applications and Writers.*
