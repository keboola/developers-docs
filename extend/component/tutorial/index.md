---
title: Component Quick Start
permalink: /extend/component/tutorial/
redirect_from:
    - /extend/docker/quick-start/
    - /extend/custom-science/quick-start/
---

* TOC
{:toc}

In this tutorial, you will create a simple "Hello, World!" component which runs in
Keboola Connection (KBC).

## Before you start
You need to have a computer with working [Docker](https://www.docker.com/what-docker) to develop the KBC component code.
To be able to create new components, you also need to have an account in the [Keboola Developer Portal](https://components.keboola.com/),
which manages the list of components available in KBC.

The Developer portal uses different credentials than KBC. [Creating an account](https://components.keboola.com/auth/create-account) is free; it requires a working email address
(to which a confirmation email will be sent) and a mobile phone for a mandatory two-factor authorization.

When you log in to the developer portal, you have to join a **vendor** --- an organization of
developers. Every KBC component has to have a vendor assigned. If you join an existing vendor, a
vendor administrator has to approve your request. If you do not work for a company, create a
vendor with your name (even a single developer has to be assigned to a vendor).

{: .image-popup}
![Screenshot -- Join a vendor](/extend/component/tutorial/join-vendor.png)

In order to create a **new vendor**, a Keboola Administrator has to approve your request, and you will
receive a [development project](/#development-project) in KBC. Also, you need to provide us
with a channel for receiving internal errors from your components. Basically anything supported
by [Papertrail notifications](https://help.papertrailapp.com/kb/how-it-works/alerts#supported-services)
is available, though e-mail or a Slack channel is most commonly used.

When you are confirmed as a member of a vendor, you may proceed to creating your own component.
The example component is written in Python language, but no knowledge of Python is required.
Before you continue with this tutorial, make sure you:

- Can login into the [Developer Portal](https://components.keboola.com/).
- Can login to the KBC either in the [US region](https://connection.keboola.com) or [EU region](https://connection.eu-central-1.keboola.com/).
- Have a [Github](https://github.com/) account.

Note: The tutorial assumes using [Github](https://github.com/) + [Travis](https://travis-ci.org/) services, they are not required for extending KBC.
We use them, because we like them most. The [deployment documentation](/extend/component/deployment/) shows how to configure
for example [Bitbucket](/extend/component/deployment/#bitbucket-integration) and [GitLab](/extend/component/deployment/#gitlab-integration)
integrations.

## Creating a Component
To add a component, use the **Create Component** button on the main page, and fill in the component name and type:

{: .image-popup}
![Screenshot -- Create component](/extend/component/tutorial/create-component-2.png)

**Important:** Do **not** use the words 'extractor', 'writer' or 'application' in the component name.

To choose the appropriate type:
- `extractor` -- brings data into KBC
- `writer` -- sends data out of KBC
- `application` -- does some transformation of the data, or does something completely different.

The above does not mean technically that for example an extractor can't send data out of KBC,
or that an application cannot bring new data into KBC. It is a matter of user perception,
so use your judgement to select the correct type.

When you fill the form, you will obtain a **Component ID** (in the
form `vendor-id.component-name`, for instance, `keboola-test.ex-docs-tutorial`). *Take note of the Component ID.*

## Creating a deployment account
To be able to deploy the component to KBC, you will need **Service credentials**. For security
reasons we strongly advice against using your own credentials in any deployment service. To create
new deployment credentials, click the **Create a service account** button on the *Service accounts* page.

{: .image-popup}
![Screenshot -- Create account](/extend/component/tutorial/service-account-1.png)

Fill in name (e.g. `ex_docs_tutorial_travis`) and  description (e.g. `Travis deployment credentials`) and confirm:

{: .image-popup}
![Screenshot -- Account details](/extend/component/tutorial/service-account-2.png)

Take note of the **Username** and **Password**.

{: .image-popup}
![Screenshot -- Account credentials](/extend/component/tutorial/service-account-3.png)

## Initializing the Component
Once you have the **Component Id** and service account **Username** and **Password**,
you can user our [Component generator tool](https://github.com/keboola/component-generator) to create a component skeleton for you in your favorite programming language.

Create an empty [Github](https://github.com/) repository. The name of the repository is
arbitrary, but using the component is probably a good idea to avoid confusion.

{: .image-popup}
![Screenshot -- Github Repository](/extend/component/tutorial/github-repository.png)

Checkout the repository on your local computer and execute the following from command line:

	docker run -i -t --volume=/path/to/repository/:/code/ quay.io/keboola/component-generator

Replace `/path/to/repository/` with an absolute local path to your empty repository. Follow
the on-screen instructions:

{: .image-popup}
![Screenshot -- Component Generator](/extend/component/tutorial/component-generator.png)

When done, you will have an initialized repository with a "Hello, World!" component.
In the above example, I choose the `simple-python` template which contains:

- template.md -- description of the template files,
- main.py -- a "Hello, World!" Python script,
- Dockerfile -- a [Dockerfile](/extend/component/docker-tutorial/) defining the environment in which the script runs,
- deploy.sh -- a Bash script to deploy the component to KBC,
- .travis.yml -- a configuration file for [Travis CI](https://docs.travis-ci.com/) to automate the deployment.

You will also obtain a path to your Travis CI configuration
(in the above example [https://travis-ci.org/keboola/ex-docs-tutorial](https://travis-ci.org/keboola/ex-docs-tutorial)).

## Building the Component
When done exploring, push to the repository.
This will automatically trigger a build on the Travis service, you can view the build
progress by visiting the provided link. In fact, two builds will be triggered, one
for the `master` branch, and one for the `0.0.1` tag.

{: .image-popup}
![Screenshot -- Travis Build](/extend/component/tutorial/travis-build-1.png)

We are more interested in the latter, because that is going to trigger the deployment to KBC.

{: .image-popup}
![Screenshot -- Travis Build Detail](/extend/component/tutorial/travis-build-2.png)

If the deployment passed without errors, the component will become available in KBC. You
can verify that in the component details in the Developer Portal:

{: .image-popup}
![Screenshot -- Component Deployed](/extend/component/tutorial/component-deployed.png)

This means that the component deployment is fully automated. If you change the component
source code, all you need to do is push the changes to the git repository and tag them
with [normal version tag](https://semver.org/#spec-item-2).

## Running the Component
Once the component is deployed, it becomes available in KBC. Note that it
takes **up to 5 minutes** to propagate the changes to all KBC instances. Once propagated,
you can configure the component by visiting the following URL:

    https://connection.keboola.com/admin/projects/{PROJECT_ID}/extractors/{COMPONENT_ID}

You can then run the configuration without any settings.

{: .image-popup}
![Screenshot -- Component Configuration](/extend/component/tutorial/component-configuration.png)

And you should see the "Hello, World" message in the events:

{: .image-popup}
![Screenshot -- Component Events](/extend/component/tutorial/hello-world.png)

When you create a component, it will have assigned a memory limit of **64MB** and
run timeout of **1 hour**. If you need to change those limits, please
[contact our support](mailto:support@keboola.com).

## Component Repository
The component component is a crucial part of the component setting, because it
actually defines what [Docker image](/extend/component/docker-tutorial/) will be used when running the component.
We offer free hosting of your docker images in the **[Amazon Container Registry (AWS ECR)](https://aws.amazon.com/ecr/)** under our own account.
All repositories in AWS ECR are private. When you create your component using the method shown above, we
have just provisioned you with the docker image hosting and you don't need to worry about it any more.

We also support the DockerHub and Quay.io registries, both public and private. However, we recommend that you use AWS ECR
unless you require DockerHub or Quay for some reason (e.g., you want the image to be public).
The main benefit of our AWS ECR is its reliability, as Quay.io and DockerHub are more prone to outages and are beyond our control.

## Summary
You have just created your own KBC component. Although it does not do much, it show the easiest path
to bring your own application logic to KBC. You can now continue with other parts of the tutorial:

 - using [input mapping](/extend/component/tutorial/input-mapping/)
 - using [output mapping](/extend/component/tutorial/output-mapping/)
 - using [configuration parameters](/extend/component/tutorial/configuration/)
 - [configuring a processor](/extend/component/tutorial/processors/)
 - [debugging a component](/extend/component/tutorial/debugging/)
 - [implementation notes](/extend/component/implementation/) for specific languages

Although you usually don't need everything (e.g. you don't need input mapping when building an extractor), we suggest you go through all of the above
 to gain a general overview of the available options. You can also read all the details in the respective parts of the documentation:

- exchanging data in [data folders](/extend/common-interface/folders/)
- [manifest files](/extend/common-interface/manifest-files/)
- [OAuth support](/extend/common-interface/oauth/)
- or general information about the [common interface](/extend/common-interface/)
- [deployment settings](/extend/component/deployment/) (including [Bitbucket integration](/extend/component/deployment/#bitbucket-integration))
- [UI settings](/extend/component/ui-options/)
