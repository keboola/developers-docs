---
title: Component Registration
permalink: /extend/registration/
---

## Introduction
As described in [architercture overview](/architecture/) KBC is composed of many different components. If you want your 
[Docker extension](/extend/docker/) or [Custom science](/extend/custom-science/) to be generally available in KBC, it must be registred in our **component list**. The Component list itself is provided by [Storage Component API](http://docs.keboola.apiary.io/#) in dedicated [Components section](http://docs.keboola.apiary.io/#reference/components). 
Only registered components can be run by KBC users and generally any KBC user can use any component unless:
- the KBC user (or token he uses) has [limited access to the component](/token-permissions/)
- the component itself limits where (in what projects, for which users) it will run

Note that it is not at all necessary to register your Custom Science as a component unless you want other KBC users to use it. Howver it is necessary to register docker extension even if it supposed to be used only in a single project.


## Registration
Registration process is simple, but it must be done by Keboola. To register your component, please fill the [checklist](/extend/registration/checklist) and contact us.

### UI options
Each component will recieve a **Generic UI**. The generic UI will always show text field for entering component configuration in JSON format. Additionally you can request other parts of generic UI by adding any of `tableInput`, `tableOutput`, `fileInput`, `fileOutput` flags in the checklist. Each of the options is shown below:

[TODO:screenshoty]
[TODO:doplnit moznosti IO mappingu v UI - where/tagy u FU apod]

### Hide application from App store
You might want to test your application before it is published to all users. This is possible - the application can be hidden from the list of all applications (UI flag excludeFromNewList). However this does not prevent anyone from using the application.
To use non-published application, you can create the configuration using the [component API](http://docs.keboola.apiary.io/#reference/components/create-config/create-config). Or by visiting directly the URL 
https://connection.keboola.com/admin/projects/{projectId}/applications/{componentId}
You will obtain *componentId* when your component is registered.

