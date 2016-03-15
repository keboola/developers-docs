---
title: Extending KBC
permalink: /extend/
---

The KBC environment consists of many built-in [*components*](/architecture) which interoperate together (e.g. Storage, Transformations and Readers). You can also create KBC extensions. Currently, there are two types of extensions available:

* [Generic extractor](todo) - a specific component designated for implementing extractors for services with REST API
* Custom extension - a component extending KBC with arbitrary code

Custom extensions can be used as Extractors, Writers and Applications. They run inside a [Docker component](/architecture/docker-bundle) which takes care of: 

* authentication
* starting and stopping the extension
* reading and writing data to KBC Storage
* application isolation

They must adhere to a [common interface](/extend/common-interface). 

There are two types of Custom extensions differing in the level of integration and implementation flexibility:

* [Custom Science extension](/extend/custom-science/) - easier to implement, less features available
* [Docker extension](/extend/docker/) - maximum implementation flexibility

The following table provides an overview of the main characteristics of KBC extensions:

<table>
  <thead>
    <tr>
      <th rowspan="2">KBC EXTENSIONS</th>
      <th colspan="3" style="text-align: center;">Implementation</th>
      <th colspan="4" style="text-align: center;">User Features</th>
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
      <th>OAuth2 support</th>
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
