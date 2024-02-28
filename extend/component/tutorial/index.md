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
Keboola.

## Before You Start
You need to have a computer with working [Docker](https://www.docker.com/why-docker) to develop the Keboola component code.
To be able to create new components, you also need to have an account in the [Keboola Developer Portal](https://components.keboola.com/),
which manages the list of components available in Keboola.

The Developer Portal uses different credentials than Keboola. [Creating an account](https://components.keboola.com/auth/create-account) is free; it requires a working email address
(to which a confirmation email will be sent) and a mobile phone for a mandatory two-factor authorization.

When you log in to the Developer Portal, you have to join a **vendor** --- an organization of
developers. Every Keboola component has to have a vendor assigned. If you join an existing vendor, a
vendor administrator has to approve your request. If you do not work for a company, create a
vendor with your name (even a single developer has to be assigned to a vendor). When you join or create a vendor
you should also receive access to a development Keboola project.

{: .image-popup}
![Screenshot -- Join a vendor](/extend/component/tutorial/join-vendor.png)

In order to create a **new vendor**, a Keboola administrator has to approve your request, and you will
receive a [development project](/#development-project) in Keboola. In addition to that, you need to provide us
with a channel for receiving internal errors from your components. Anything supported
by [Papertrail notifications](https://help.papertrailapp.com/kb/how-it-works/alerts#supported-services)
is available, though e-mail or a Slack channel is most commonly used.

When you are confirmed as a member of a vendor, you may proceed to creating your own component.
The example component is written in the Python language, but no knowledge of Python is required.
Before you continue with this tutorial, make sure you

- can log in to the [Developer Portal](https://components.keboola.com/).
- can log in to one of the Keboola [stacks](https://help.keboola.com/overview/#stacks)
- have a [Github](https://github.com/) account.

*Note: Even though the tutorial assumes using [GitHub](https://github.com/) + [Travis](https://travis-ci.org/) services, they are not required for extending Keboola.
We use them because we like them the most. The [deployment documentation](/extend/component/deployment/) shows how to configure,
for example, [Bitbucket](/extend/component/deployment/#bitbucket-integration) and [GitLab](/extend/component/deployment/#gitlab-integration)
integrations.*

## Creating Component
To add a component, use the **Add a component** button on the main page, and fill in the component name and type:

{: .image-popup}
![Screenshot -- Create component](/extend/component/tutorial/create-component-2.png)

**Important:** Do **not** use the words 'extractor', 'writer', or 'application' in the component name.

Choose the appropriate [component type](/extend/component/#component-types):

- `extractor` -- brings data into Keboola
- `writer` -- sends data out of Keboola
- `transformation` -- does some transformation of the data, [read more](https://help.keboola.com/transformations/#new-transformations)
- `code pattern` -- generates code for transformation's component, [read more](/extend/component/code-patterns)
- `application` -- another arbitrary component

The above does not mean technically that, for example, an extractor cannot send data out of Keboola
or an application cannot bring new data into Keboola. It is a matter of user perception,
so use your judgement to select the correct type.

When you fill the form in, you will obtain a **component ID** (in the
form `vendor-id.component-name`, for instance, `keboola-test.ex-docs-tutorial`). Make a **note** of the ID.

## Creating Deployment Account
To be able to deploy the component to Keboola, you will need **service credentials**. For security
reasons, we strongly advice against using your own credentials in any deployment service. To create
new deployment credentials, click the **Create a service account** button on the **Service accounts** page.

{: .image-popup}
![Screenshot -- Create account](/extend/component/tutorial/service-account-1.png)

Fill in a name (e.g., `ex_docs_tutorial_travis`) and description (e.g., `Travis deployment credentials`) and confirm:

{: .image-popup}
![Screenshot -- Account details](/extend/component/tutorial/service-account-2.png)

Take a note of the **username** and **password**.

{: .image-popup}
![Screenshot -- Account credentials](/extend/component/tutorial/service-account-3.png)

## Initializing Component
Once you have the **component ID** and the service account **username** and **password**,
you can use our [component generator tool](https://github.com/keboola/component-generator) to create a component skeleton for you in your favorite programming language.

Create an empty [Github](https://github.com/) repository. The name of the repository is
arbitrary, but using the component is probably a good idea to avoid confusion.

{: .image-popup}
![Screenshot -- Github Repository](/extend/component/tutorial/github-repository.png)

Checkout the repository on your local computer and execute the following from the command line:

	docker run -i -t --volume=/path/to/repository/:/code/ quay.io/keboola/component-generator

Replace `/path/to/repository/` with an absolute local path to your empty repository. Follow
the on-screen instructions:

{: .image-popup}
![Screenshot -- Component Generator](/extend/component/tutorial/component-generator.png)

When done, you will have an initialized repository with a "Hello, World!" component.
In the above example, we chose the `simple-python` template, which contains the following:

- template.md -- description of the template files
- main.py -- a "Hello, World!" Python script
- Dockerfile -- a [Dockerfile](/extend/component/docker-tutorial/) defining the environment in which the script runs
- deploy.sh -- a Bash script to deploy the component to Keboola

For Travis CI template contain:
- .travis.yml -- a configuration file for [Travis CI](https://docs.travis-ci.com/) to automate the deployment

For GitHub Actions CI template contain:
- .github/workflows/push.yml -- a configuration file for [GitHub Actions CI](https://github.com/features/actions) to automate the deploy

## Building Component
When done exploring, push to the repository.
This will automatically trigger a build on the Travis or GitHub Actions services; you can view the build
progress by visiting the provided link. In fact, two builds will be triggered: one
for the `master` branch, and one for the `0.1.0` tag.

Travis:

{: .image-popup}
![Screenshot -- Travis Build](/extend/component/tutorial/travis-build-1.png)

GitHub Actions:

{: .image-popup}
![Screenshot -- GitHub Actions Build](/extend/component/tutorial/gh-build-1.png)

We are more interested in the latter because that is going to trigger the deployment to Keboola.

Travis:

{: .image-popup}
![Screenshot -- Travis Build Detail](/extend/component/tutorial/travis-build-2.png)

GitHub Actions:

{: .image-popup}
![Screenshot -- GitHub Actions Build Detail](/extend/component/tutorial/gh-build-2.png)

If the deployment passes without errors, the component will become available in Keboola. You
can verify that in the component details (action Edit) in the Developer Portal:

{: .image-popup}
![Screenshot -- Component Deployed](/extend/component/tutorial/component-deployed.png)

This means that the component deployment is fully automated. If you change the component
source code, all you need to do is push the changes to the git repository and tag them
with the [normal version tag](https://semver.org/#spec-item-2).

## Running Component
Once the component is deployed, it becomes available in Keboola. Note that it
takes **up to 5 minutes** for the changes to propagate to all Keboola instances. After that,
you can configure the component by visiting the following URL:

    https://connection.keboola.com/admin/projects/{DEFINED PROJECT_ID}/extractors/{YOUR COMPONENT_ID}

On this URL, you can create a configuration and run it without any settings.

{: .image-popup}
![Screenshot -- Component Configuration](/extend/component/tutorial/component-configuration.png)

And you should see the "Hello, World" message in the events:

{: .image-popup}
![Screenshot -- Component Events](/extend/component/tutorial/hello-world.png)

When you create a component, it will have assigned a memory limit of **256MB** and
run timeout of **1 hour**. If you need to change those limits, please
[contact our support](mailto:support@keboola.com).

## Component Repository
The component repository is a crucial part of the component setting because it
actually defines what [Docker image](/extend/component/docker-tutorial/) will be used when running the component.
We offer free hosting of your Docker images in the **[Amazon Container Registry (AWS ECR)](https://aws.amazon.com/ecr/)** under our own account.
All repositories in AWS ECR are private. When you create your component using the method shown above, we
have just provisioned you with the Docker image hosting and you do not need to worry about it any more.

We also support the DockerHub and Quay.io registries, both public and private. However, as they are more prone to
outages and beyond our control, we recommend using our reliable AWS ECR. Use DockerHub or Quay.io only if you,
for instance, want the image to be public.

## Summary
You have just created your own Keboola component. Although it does not do much, it shows the easiest path
to bringing your own application logic to Keboola. You can now continue with other parts of the tutorial:

 - using [input](/extend/component/tutorial/input-mapping/) and
   [output mapping](/extend/component/tutorial/output-mapping/)
 - using [configuration parameters](/extend/component/tutorial/configuration/)
 - [configuring a processor](/extend/component/tutorial/processors/)
 - [debugging a component](/extend/component/tutorial/debugging/)
 - [implementation notes](/extend/component/implementation/) for specific languages

Although you rarely need all of the above parts (e.g., you do not need input mapping when building an extractor),
we suggest you go through all of them to gain a general overview of the available options. You can also read
all the details in the respective parts of the documentation:

- general information about the [common interface](/extend/common-interface/)
- exchanging data in [data folders](/extend/common-interface/folders/)
- [manifest files](/extend/common-interface/manifest-files/)
- [OAuth support](/extend/common-interface/oauth/)
- [deployment settings](/extend/component/deployment/) (including [Bitbucket integration](/extend/component/deployment/#bitbucket-integration))
- [UI settings](/extend/component/ui-options/)

