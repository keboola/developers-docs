---
title: Implementation Notes
permalink: /extend/component/implementation/
redirect_from:
    - /extend/docker/images/
---

* TOC
{:toc}

In this article some good practices in developing the component code are described. If you aim to publish
your component, we strongly suggest that you follow these. Here are some best practices which should be
followed across all components. We also recommend that you check our [component templates](https://github.com/keboola/component-generator).

Developing a component is a challenging task. Here are a couple of advices and best practices, which should help you to
do the work more efficiently:

- Do not repeat the functions of existing components. For example if you want to download data from Google Drive and transpose the
table, you don't have to create a component for that -- you can load the table using the existing extractor and transpose it using
an existing Transpose application.
- Every component should do only one thing. For example, if you want to extract data from some API and compute some metrics on them,
make two components -- one for extracting the data and a second one for computing the metrics.
- Do as little data processing as possible. As in the above example -- having the processing tied to extraction makes it hard to
identify errors in data (was it extracted wrong, or was it processed badly). It also allows the end user to split the
task into smaller ones and have better control over their execution.
- Avoid optional data modification. For example, if you have a component which sometimes extracts data in ISO8892 encoding and sometimes
in UTF8 encoding, you don't need to implement this conversion in the component. You can let the end-user to configure [processors](/extend/component/processors/)
to load the incompatible data.
- Avoid iterations. For example, your component is downloading multiple files from some system and converts them to CSV files for Storage
import. You don't need to implement the loop around the files, you can use [configuration rows](/integrate/storage/api/configurations/#configuration-rows)
and implement processing of only a single table.

Before you create any complex components, be sure to read about
[Configurations](/integrate/storage/api/configurations/) and [Processors](/extend/component/processors/)
as they can substantially simplify your component code. We also recommend that you use our
[common interface](/extend/common-interface/) library, which is available for
[Python](/extend/component/implementation/python/#using-the-kbc-package),
[R](/extend/component/implementation/r/#using-the-kbc-package)
and [PHP](/extend/component/implementation/php/#using-the-kbc-package)

## Docker
You may use any Docker image, you see fit. We recommend to base your images on the [official library](https://hub.docker.com/explore/)
as that is the most stable.

We publicly provide the images for transformations and sandboxes.
The images for *Sandboxes* and *Transformations* both share the same common ancestor image with a couple
of pre-installed packages (that saves a lot of time when building the image yourself).
This means that the images for R and Python share the same common code base and always use the
exact same version of R and Python respectively.

Ancestor images:

- docker-custom-r:
[Quay](https://quay.io/repository/keboola/docker-custom-r),
[Dockerfile](https://github.com/keboola/docker-custom-r) --
Custom R Image
- docker-custom-python:
[Quay](https://quay.io/repository/keboola/docker-custom-python),
[Dockerfile](https://github.com/keboola/docker-custom-python) --
Custom Python Image

Transformations:

- python-transformation:
[Quay](https://quay.io/repository/keboola/python-transformation),
[Dockerfile](https://github.com/keboola/python-transformation) --
Image for Python transformations
- r-transformation:
[Quay](https://quay.io/repository/keboola/r-transformation),
[Dockerfile](https://github.com/keboola/r-transformation) --
Image for R transformations

Sandboxes:

- docker-jupyter:
[Quay](https://quay.io/repository/keboola/docker-jupyter),
[Dockerfile](https://github.com/keboola/docker-jupyter) --
Image for Python Jupyter Sandbox
- docker-rstudio:
[Quay](https://quay.io/repository/keboola/docker-rstudio),
[Dockerfile](https://github.com/keboola/docker-rstudio) --
Image for RStudio Sandbox

All of the repositories use [Semantic versioning](http://semver.org/) tags. These are always fixed to a specific image build.
Additionally the `latest` tag is available and it always points to the latest tagged build. That means that the `latest` tag
can be used safely (though it refers to different versions over time).

## Memory
KBC [Components](/extend/component/) can be used to process substantial amounts of data (i.e., dozens of Gigabytes) which are not
going to fit into memory. Every component should therefore be written so that it processes data in chunks of
a limited size (typically rows of a table). Many of the KBC components run with less then 100MB memory limit.
While the KBC platform is capable of running jobs with ~8GB of memory without problems, we are not particularly
happy to allow it and we certainly don't want to allow components where the amount of used memory
depends on the size of the processed data.

## Error Handling
Depending on the component [exit code](/extend/common-interface/environment/#return-values), the component job is marked as
successful or failed.

- `exit code = 0`  The job is considered successful.
- `exit code = 1`  The job fails with a *User error*.
- `exit code > 1`  The job fails with an *Application error*.

During execution of the component, all the output sent to STDOUT is captured and sent live to Job Events.
The output to [STDERR](https://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29) is captured too and
in case of the job is successful or fails with User error it is displayed as the last event of the job. In case the
job ends with application error, the entire contents of STDERR is hidden from the end-user and sent only to
vendor internal logs. The end-user will see only a canned response ('An application error occurred') with
the option to contact support.

This means that you do not have to worry about the internals of your component leaking to the end-user provided that
the component exit code is correct. On the other hand, the user error is supposed to be solvable by the end user, therefore:

- Avoid messages which make no sense at all. For example, 'Banana Error: Exceeding trifling witling' or only numeric errors.
- Avoid leaking sensitive information (such as credentials, tokens).
- Avoid errors which the user cannot solve. For example, 'An outdated OpenSSL library, update to OpenSSL 1.0.2'.
- Provide guidance on what the user should do. For example, 'The input table is missing; make sure the output mapping destination is set to `items.csv`'.

Also keep in mind that the output of the components (Job events) serve to pass only informational and error messages; **no data** can be passed through.
The event message size is limited (about 64KB). If the limit is exceeded, the message will be trimmed. If the component produces
obscene amount (dozens of MBs) of output in very short time, it may be terminated with internal error.
Also make sure your component does not use any [output buffering](#langauge-specific-notes), otherwise all events will be cached after the application finishes.

## Implementing Processors
[Processors](/extend/component/processors/)
allow the end-user to customize the input to the component and output from it. That means
that they many custom requirements can be solved by processors, keeping the component
code general.

Choosing whether to implement a specific feature as processor or as part of your
component may be difficult. Processor might be a good solution if the following are true:

- the feature is optional (not all end-users are interested in it)
- the feature is simple (one operation, contains no internal logic)
- the feature is universal (it is always applied to all input/output or none)

The first condition is especially important. Another way to read it is that a processor must never supply a function expected from the component.
In other words: **Each component should be able to consume/generate a valid input/output without any processors.** For example, if and extractor can
produce tables without any further processing, good, let it be tables, but if can not, it should output only files and processors should do the rest.
If processors are used together with [configuration rows](/integrate/storage/api/configurations/#configuration-rows),
the last condition is weakened, because a different set of processors may be applied to each configuration row.

### Configuration
Implementing a processor is in principle the same as implementing any other
[component](/extend/component/). However, processors are designed to be
[Single Responsibility](https://en.wikipedia.org/wiki/Single_responsibility_principle) components. This
means, for example, that processors should require no or very little configuration, should not communicate
over a network and should be fast. To maintain the implementation of processors as simple as possible,
simple scalar parameters can be injected into the environment variables. For instance, the parameters:

{% highlight json %}
{
    "parameters": {
        "delimiter": "|",
        "enclosure": "'"
    }
}
{% endhighlight %}

will be available in the processor as the environment variables `KBC_PARAMETER_DELIMITER` and
`KBC_PARAMETER_ENCLOSURE`. This simplifies the implementation in that it is not necessary to process the
[configuration file](/extend/common-interface/config-file/). This parameter
injection works only if the values of the parameters are scalar. If you need non-scalar values, you have to pass them through the config file (and disable `injectEnvironment` component setting).

### Design
Processors take data from the `in` [data folders](/extend/common-interface/folders/) and
store them in the `out` [data folders](/extend/common-interface/folders/) as any other components. Keep in mind however
that any files not copied to the `out` folders will be ignored (i.e. lost). That means if a processor is supposed to
"not touch" something, it actually has to copy that something to the `out` folder.

The processors should be aware of [manifest files](/extend/common-interface/manifest-files/). This means that
the processor:

- Must exclude manifests from processing (they are not data files).
- If the processor changes something stored in the manifest, it must process it (read the manifests in `in` folder, modify and store it in the `out` folder). Typical example is modification of table columns which must be reflected in the manifest.
- If the processor is doing change unrelated to manifest, it should copy the manifest from `in` to `out`.
- If the processor is not doing a 1:1 operation (e.g merges multiple tables into one), it should not do anything about the manifest, which means that it will be discarded.

Keep in mind that processors can be [chained](/extend/component/processors/#chaining-processors). That means that
you can for example rely on:

- the table CSV files being in [standard format](https://help.keboola.com/storage/tables/csv-files/#output-csv-format)
- table manifest always present
- the CSV file being orthogonal

If the above conditions are not met, then another processor should be added before yours. I.e. you should keep the
processor simple and delegate the assumptions to other processors (and [document them](#publishing-a-processor)). If possible the
processor should also assume that the CSV files are headless and stored in arbitrary sub-folders. When implemented with this assumption
the processor will support [sliced tables]([sliced tables](/extend/common-interface/folders/#sliced-tables).

### Publishing a Processor
The process of processor registration is the same as the
[publishing any other component](/extend/publish/). However, many of the fields do not apply, because processors have no UI.
The following fields are important:

- Vendor
- Component name and component type (`processor`)
- Short and Full Description
- Component Documentation (`documentationUrl`):
    - Must be public
    - Must state whether the processor is capable of working with [sliced tables](/extend/common-interface/folders/#sliced-tables)
    - Whether it requires/processes manifests
