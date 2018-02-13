---
title: Configuration
permalink: /extend/component/tutorial/configuration/
---

* TOC
{:toc}

In this part of the [tutorial](/extend/component/tutorial/), you will see how to pass
arbitrary configuration parameters to your component. By this time, you probably noticed
that your component has a configuration field:

{: .image-popup}
![Screenshot -- Configuration Empty](/extend/component/tutorial/configuration-1.png)

You can use this field to pass arbitrary configuration parameters to your component.
The parameters will be available in the [/data/config.json](/extend/common-interface/config-file/) file provided to the
component when it is [run](/extend/docker-runner/).

Let's assume you want to make the [sample component](/extend/component/output-mapping/)
add a given sound to each row a given number of times. For that you'll need two parameters `sound` and `repeat`.

## Modifying the Source Code
To implement the above, you can change the [sample component](/extend/component/output-mapping/) to:

{% highlight python %}

import csv
# Load the KBC library to process the config file
from keboola import docker
cfg = docker.Config('/data/')
params = cfg.get_parameters()

print("Hello world from python")

csvlt = '\n'
csvdel = ','
csvquo = '"'
with open('/data/in/tables/source.csv', mode='rt', encoding='utf-8') as in_file, \
        open('/data/out/tables/odd.csv', mode='wt', encoding='utf-8') as odd_file, \
        open('/data/out/tables/even.csv', mode='wt', encoding='utf-8') as even_file:
    lazy_lines = (line.replace('\0', '') for line in in_file)
    reader = csv.DictReader(lazy_lines, lineterminator=csvlt, delimiter=csvdel,
                            quotechar=csvquo)

    odd_writer = csv.DictWriter(odd_file, fieldnames=reader.fieldnames,
                                lineterminator=csvlt, delimiter=csvdel,
                                quotechar=csvquo)
    odd_writer.writeheader()

    even_writer = csv.DictWriter(even_file, fieldnames=reader.fieldnames,
                                 lineterminator=csvlt, delimiter=csvdel,
                                 quotechar=csvquo)
    even_writer.writeheader()
    i = 0
    for row in reader:
        if i % 2 == 0:
            even_writer.writerow(row)
        else:
            newRow = {}
            for key in reader.fieldnames:
                newRow[key] = row[key] + ''.join([params['sound']] * params['repeat'])
            odd_writer.writerow(newRow)
        i = i + 1

{% endhighlight %}

At the beginning, the [KBC Docker library](https://github.com/keboola/python-docker-application) is imported and
initialized by reading the `data` directory (`docker.Config('/data/')`). Its method `get_parameters` will provide the
configuration parameters as a dictionary. The library is currently available for the [R language](https://github.com/keboola/r-docker-application) and
[Python](https://github.com/keboola/python-docker-application). It does no magic or rocket science, so you can
read the [config file](/extend/common-interface/config-file/) directly if you wish.

Commit and push the code in your repository and tag it with [normal version tag](https://semver.org/#spec-item-2).
This will trigger a [build on Travis CI](https://docs.travis-ci.com/) and automatically
deploy the new version into KBC. Keep in mind that after the deploy it may take up to 5 minutes for the update to propagate to all KBC instances.

## Verifying
To verify that the parameters work, simply edit the component configuration in KBC and paste in for example:

{% highlight json %}
{
    "sound": "Moo",
    "repeat": 2
}
{% endhighlight %}

{: .image-popup}
![Screenshot -- Configuration Filled](/extend/component/tutorial/configuration-2.png)

Run the component and examine the job results. In the `odd` result table, you should see that `Moo` was added twice to every value.

{: .image-popup}
![Screenshot -- Table Results](/extend/component/tutorial/configuration-3.png)

## Creating the UI
Entering configuration parameters using JSON data is quite low-level. Therefore you should
provide an UI for the end-user. The easiest option is to take advantage of the
[JSON editor](https://github.com/jdorn/json-editor) based on JSON schema. For the above
configuration, the following schema can be used:

{% highlight json %}
{
    "title": "Person",
    "type": "object",
    "properties": {
        "sound": {
            "type": "string",
            "title": "Sound:",
            "default": "Boo",
            "description": "The sound to make."
        },
        "repeat": {
            "type": "integer",
            "title": "Repeat sound:",
            "description": "Number of times to repeat the sound.",
            "default": 2,
            "minimum": 0,
            "maximum": 10
        }
    },
    "required": ["sound", "repeat"]
}
{% endhighlight %}

In the schema the two properties `sound` and `repeat` are declared along with the specification
of their form input fields.
You can test the above schema [online](http://jeremydorn.com/json-editor/) and verify that the
form generated from it produces the desired JSON structure. Once satisfied with the result,
simply paste the schema into the **Configuration schema** in your component properties in
[Developer portal](https://components.keboola.com/).

Once the change propagates to your KBC instance, you should see the form in the UI:

{: .image-popup}
![Screenshot -- Configuration Form](/extend/component/tutorial/configuration-4.png)

The end-user can now configure your component without writing the JSON with parameters.

## Summary
Your component can now successfully read configuration parameters provided by the end-user. You can read more about all the features of the
[configuration file](/extend/common-interface/config-file/).
Keep in mind that the code presented above is simplified as it does not use any validation of
end-user parameters. The next part of the tutorial will show you
how to [configure processors](/extend/component/tutorial/processors/).
