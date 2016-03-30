---
title: Development Guide
permalink: /extend/custom-science/development/
---

* TOC
{:toc}

When developing the code for your Custom Science extension, there is no interaction with Keboola required (no code configuration/approval, etc.). 
However, make sure you meet the following guidelines:

- Store your extension in a private or public git repository.
- Your application code must follow our [common interface](/extend/common-interface/). 
If necessary, use [Python](/extend/custom-science/python/) or [R](/extend/custom-science/r/) libraries. 
- Provide the end-users with instructions on setting up the extension. This particularly concerns:
 
  - Repository information in the *Runtime* settings
  - Requirements on extension *parameters*, if relevant 
  - The names of input/output files in case you are not supporting dynamic input/output mapping

See our [example instructions](https://github.com/keboola/python-custom-application-text-splitter/blob/master/README.md).

## Application Environment
The git repository will be cloned into `/home/` directory. The current directory will be `/data/`. 
The `/data/` directory is reserved for input and output mapping files. For full description see 
the [common interface](/extend/common-interface/).

A single application corresponds to a single source code repository, so multiple end-users will use the 
same code. Should each customer use a slightly different code, use the KBC_PROJECTID environment 
variable; the exact project in which the application is running can be identified. 
The end-user has no way of modifying this value, so the control is fully on your side.

{% highlight r %}
if (Sys.getenv("KBC_PROJECTID") != '123')  {
    stop("Invalid project Id")
}
{% endhighlight %}

## Git Repository Configuration

Information about the repository with the extension code is entered into the *Runtime* configuration field when 
creating the extension configuration. It is not available to the extension itself. Both repositories, private 
and public, are supported. KBC Custom Science configuration needs to refer to a particular tag of your repository; 
we recommend [Semantic versioning](http://semver.org/). 

### Public Repository
The basic *Runtime* settings for a public repository are entered in JSON format: 

{% highlight json %}
{
    "repository": "https://github.com/keboola/docs-custom-science-example-basic",
    "version": "0.0.1"
}
{% endhighlight %}

### Private Repository
The *Runtime* settings for a private repository must include git credentials: an unencrypted username in the
`username` field, and an [encrypted](/architecture/encryption/) password in `#password`. 

{% highlight json %}
{
    "repository": "https://github.com/keboola/docs-custom-science-example-basic",
    "version": "0.0.1",
    "username": "JohnDoe",
    "#password": "MySecretPassword"
}
{% endhighlight %}

There are two main encryption options available:

- Encryption on configuration save
- Encryption of password beforehand

#### Encryption on Save
When you enter a plaintext password into the Runtime setting, it will be encrypted once the configuration has been saved. 
After that, the password will be shown only encrypted (e.g. `KBC::ComponentProjectEncrypted==UEh3raTcaLg=`). 
Once the password is encrypted, it cannot be decrypted. 
As simple as this approach may sound, there is a drawback to it: 
the end-user must know the password to the git repository (though only when creating the configuration).
  
#### Encryption Beforehand
If you do not wish the end-user to have an access to the git repository password, the password must be encrypted in advance; use our 
[Encryption API](/architecture/encryption/). There are three more options here:

- [Base Encryption](/architecture/encryption/#base-encryption); Encrypted values will be readable in all dockerized applications.
- [Image Encryption](/architecture/encryption/#image-encryption); Encrypted values will be readable in all instances of the specific Custom Science extension.
 In the API call, the `componentId` parameter is `dca-custom-science-r` for R applications, `dca-custom-science-python` for Python 3.x, and `dca-custom-science-python2` for Python 2.x. This is probably the best choice to start with in a Custom Science extension.  
- [Image Configuration Encryption](/architecture/encryption/#image-configuration-encryption); Encrypted values will be readable in all instances of the specific Custom Science extension in *a single project*.
 In the API call, the `componentId` parameter is `dca-custom-science-r` for R applications, `dca-custom-science-python` for Python 3.x, and `dca-custom-science-python2` for Python 2.x. This is the most secure way, 
 but you need to encrypt a password for each project in which your Custom Science extension will be used. This also prevents anyone from using your application in their project unless you give them the correct encrypted string (i.e. the application configuration cannot be copied between projects).

## Git Repository Contents
As for the contents of your git repository, we only have a single requirement. Either `main.R` (for R Custom Science) or `main.py` (for Python Custom Science) must be present in the root of the repository. 
This is the actual code executed by KBC when running the extension. 
Otherwise the repository contents are arbitrary.
However, you might want to take a look at the specific notes on implementation details for [Python](/extend/custom-science/python/) or [R](/extend/custom-science/r).

