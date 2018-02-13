---
title: Processors
permalink: /extend/component/tutorial/processors/
---

* TOC
{:toc}

[Processors](/extend/docker-runner/processors/) are optional part of a component configuration.
While they are **not at all necessary** in developing new components for KBC, we think that you
should know about them, because using them can save you a lot of time in some cases.
To get a list of currently available processors, see the
[official component list](https://components.keboola.com/components).

## Configuration
To be able to configure the processors in the KBC UI, go to the
[Developer Portal](https://components.keboola.com/) and add the UI
flag `genericDockerUI-processors` to your component. You'll then see
a new UI element in the component configuration in KBC:

{: .image-popup}
![Screenshot -- Processors Empty](/extend/component/tutorial/processors-1.png)

Taking the [example component](/extend/tutorial/processors/), you might want to use the
*Add Row Number Column* processor in your component to add a sequential number to every
row of the table imported into KBC. From the
[processor documentation](https://github.com/keboola/processor-add-row-number-column/blob/master/README.md#usage)
you can see, that the processor is configured as:

{% highlight json %}
{
    "definition": {
        "component": "keboola.processor-add-row-number-column"
    }
}
{% endhighlight %}

You want the processor to execute on the output of your component, which means that the
above should be inserted into the `after` (after your component runs) section:

{% highlight json %}
{
    "before": [],
    "after": [
        {
            "definition": {
                "component": "keboola.processor-add-row-number-column"
            }
        }
    ]
}
{% endhighlight %}

## Chaining Processors
If you run the above configuration, you'll receive an error:

    Table odd.csv does not have a manifest file.

This is expected, because the [Add Row Number Column processor documentation](https://github.com/keboola/processor-add-row-number-column/blob/master/README.md#prerequisites)
clearly states, that the processed CSV files must have
[manifests](todo) and not have headers. Since the example component is very simple and does
not generate manifests (or header-less CSV files), you have to add other processors to do that
for you:

{% highlight json %}
{
    "before": [],
    "after": [
        {
            "definition": {
                "component": "keboola.processor-create-manifest"
            },
            "parameters": {
                "columns_from": "header"
            }
        },
        {
            "definition": {
                "component": "keboola.processor-skip-lines"
            },
            "parameters": {
                "lines": 1
            }
        },
        {
            "definition": {
                "component": "keboola.processor-add-row-number-column"
            }
        }
    ]
}
{% endhighlight %}

The `after` configuration is an array of three processors. The first one creates
[manifest files](todo) for whatever data files were produced by your component. The manifest
files will contain header read from the data files. The second processor removes the header
from the data files. The third processor adds the row number column.

## Summary
Configuring processors is not part of the component development. However, processors
allow the end-user to customize the input to the component and output from it. That means
that they can be used to implement specific customer requests, while keeping the component
code general.

Choosing whether to implement a specific feature as processor or as part of your
component may be difficult, but if the following are true:

- the feature is simple (one operation, contains no internal logic)
- the feature is optional (not all end-users are interested in it)
- the feature is universal (it is always applied to all input/output or none)

Then a processor might be a good solution. Keep in mind however, that they must
be configured by the end-user. You can read more about
[processors](/extend/component/processors/) or continue with the
next part of the tutorial will show you
some [debugging tips](/extend/component/tutorial/debugging/).
