---
title: Extending Keboola Connection
permalink: /extend/
---

As an open system consisting of many built-in, interoperating components, 
such as Storage or Extractors, [Keboola Connection (KBC)](/overview/) can be extended. 
We encourage you to **build your own extensions**, whether for your own use or to be offered to other KBC users and customers. 

* TOC
{:toc}

## Benefits of Extending KBC

Building extensions for KBC offers many advantages: 

- Easy access to data from many different sources
- Simple path to delivering the data back to your customers
- Availability of your application or algorithm to all existing KBC subscribers and implementation partners
- Opportunity for you to focus only on areas of your product where you are adding value 
- Keboola in charge of the billing 

To become a Keboola Development Partner, [get in touch](https://www.keboola.com/contact/). We want to hear
what you would like to build!

## Types of Extensions
Currently, there are two types of extensions available:

1. **Generic Extractor** -- specific component for implementing extractors 
for services with REST API
2. **Custom Extension** -- component extending KBC with arbitrary code

### Generic Extractor
[Generic Extractor](/extend/generic-extractor/) is a KBC component acting like a customizable HTTP REST client. 
It can be configured to extract data from virtually any API and offers a vast amount of configuration options. 
With Generic Extractor you can build an entirely new extractor for KBC in less than an hour. 

### Custom Extensions
Custom Extensions can be used as:

- **Extractors** -- allowing customers to get data from new sources. They only process input tables from external sources (usually API).
- **Applications** -- further enriching the data or add value in new ways. They process input tables stored in CSV files and generate result tables in CSV files. 
- **Writers** -- pushing data into new systems and consumption methods. They do not generate any KBC tables. 
- **Processors** -- adjusting the inputs or outputs of other components. They have to be run together with any of the above extensions. 

All extensions run inside a [Docker component](/integrate/docker-bundle) which takes care of their
*authentication, starting, stopping, isolation, and reading data from and writing it to KBC Storage*.
They must adhere to a [common interface](/extend/common-interface/).

There are two types of Custom extensions differing in the level of integration and implementation flexibility:

1. [**Custom Science extension**](/extend/custom-science/) - easier to implement, less features available
2. [**Docker extension**](/extend/docker/) - maximum implementation flexibility

## Comparison of Extensions
The following table provides an overview of the **main characteristics** of KBC extensions:

<table>
  <tr>
    <th colspan="2"></th>
    <th>Generic Extractor</th>
    <th>Custom Science Extension</th>
    <th>Docker Extension</th>
  </tr>
  <tr>
    <th rowspan="6">Implementation</th>
    <th>Keboola Approval / Registration Required</th>
    <td>no</td>
    <td>no</td>
    <td>yes</td>
  </tr>
  <tr>
    <th>KBC Components</th>
    <td>extractor</td>
    <td>extractor, writer, application</td>
    <td>extractor, writer, application</td>
  </tr>
  <tr>
    <th>Implementation Complexity</th>
    <td>very easy</td>
    <td>easy</td>
    <td>medium</td>
  </tr>
  <tr>
    <th>Application Environment</th>
    <td>JSON configuration only</td>
    <td>R, Python, PHP</td>
    <td>any</td>
  </tr>
  <tr>
    <th>Knowledge of Docker Required</th>
    <td>no</td>
    <td>no</td>
    <td>yes</td>
  </tr>
  <tr>
    <th>Uses External Code Repository</th>
    <td>no</td>
    <td>yes</td>
    <td>yes</td>
  </tr>
  <tr>
    <th rowspan="5">User Features</th>
    <th>Setup User Experience</th>
    <td>poor, customizable <sup>*</sup></td>
    <td>poor, customizable <sup>*</sup></td>
    <td>fully customizable</td>
  </tr>
  <tr>
    <th>Brandable</th>
    <td>yes <sup>*</sup></td>
    <td>yes <sup>*</sup></td>
    <td>yes</td>
  </tr>
  <tr>
    <th>Offered to All Users</th>
    <td>yes <sup>*</sup></td>
    <td>yes <sup>*</sup></td>
    <td>yes</td>
  </tr>
  <tr>
    <th>Customizable User Interface</th>
    <td>yes <sup>*</sup></td>
    <td>yes <sup>*</sup></td>
    <td>yes</td>
  </tr>
  <tr>
    <th>OAuth2 Support</th>
    <td>yes <sup>*</sup></td>
    <td>no</td>
    <td>yes</td>
  </tr>
</table>

<sup>\*</sup> *Available only when [registered](/extend/registration/).*
