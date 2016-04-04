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

<table>
  <thead>
    <tr>
      <th rowspan="2">KBC EXTENSIONS</th>
      <th colspan="3" style="text-align: center;">Implementation</th>
      <th colspan="5" style="text-align: center;">User Features</th>
      <th style="text-align: center;">Other</th>
    </tr>
    <tr>
      <th>Implementation Complexity</th>
      <th>Application Environment</th>
      <th>Knowledge of Docker Required</th>
      <th>Setup User Experience</th>
      <th>Brandable</th>
      <th>Offered to All Users</th>
      <th>Customizable User Interface</th>
      <th>OAuth2 Support</th>
      <th>Keboola Approval/Registration Required</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Generic Extractor</th>
      <td>very easy</td>
      <td>configuration only</td>
      <td>no</td>
      <td>poor</td>
      <td>no<br>(coming soon)</td>
      <td>no<br>(coming soon)</td>
      <td>no</td>
      <td>yes</td>
      <td>no</td>
    </tr>
    <tr>
      <th>Custom Science</th>
      <td>easy</td>
      <td>R or Python</td>
      <td>no</td>
      <td>poor</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
      <td>no</td>
    </tr>
    <tr>
      <th>Docker</th>
      <td>medium</td>
      <td>any</td>
      <td>yes</td>
      <td>fully customizable</td>
      <td>yes</td>
      <td>yes</td>
      <td>yes</td>
      <td>yes</td>
      <td>yes</td>
    </tr>
  </tbody>
</table>

*Note: With the exception of Generic Extractor, all KBC Extensions can be used for creating Extractors, 
Applications and Writers.*
