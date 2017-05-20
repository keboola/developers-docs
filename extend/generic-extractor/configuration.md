---
title: Generic Extractor Configuration
permalink: /extend/generic-extractor/configuration/
---

*To configure your first Generic Extractor, go to our [Generic Extractor tutorial](/exten/generic-extractor/tutorial/).*

Each Generic Extractor configuration consists of two main parts: 

1. `api`section --- setting the **basic properties** of the API, such as endpoints and authentication. 
The section is described in detail in the chapter [API Configuration](/extend/generic-extractor/configuration/api/).

2. `config` section --- describing the **actual extraction**, including properties of HTTP requests, and 
mapping between source JSON and target CSV. This section is described in the chapter 
[Extraction Configuration](/extend/generic-extractor/configuration/config/).
  
The two parts and their nesting are shown in this schema:  

{: .image-popup}
![Schema - Generic Extractor configuration](/extend/generic-extractor/generic-intro.png)
