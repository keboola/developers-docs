---
title: Development Guide
permalink: /extend/custom-science/development/
---

When developing code for your Custom Science application, there is no interaction with Keboola required (no code configuration/approval, etc.). 
However, make sure you meet the following guidelines:

- Store your application in a private or public git repository.
- Your application code must follow our [common interface](/common-interface). If necessary, use [Python](/extend/custom-science/python/) or [R](/extend/custom-science/r) libraries. 
- Provide the end-users with instructions on setting up the application. This particularly concerns:
 
  - *Runtime* settings in the Custom Science application configuration.
  - Any requirements for application configuration
  - The names of input/output files in case you are not supporting dynamic input/output mapping.

## Git Repository Configuration
Have a git repository ready ([Github](https://github.com/) or [Bitbucket](https://bitbucket.org/) are recommended, although any other host should work as well). 
Both repositories, private and public, are supported. KBC Custom Science configuration needs to refer to a particular tag of your repository; 
we recommend [Semantic versioning](http://semver.org/). The repository information is entered into the *Runtime* configuration field when creating the application configuration. 
It is not available to the application itself. 

### Public Repository
The basic *Runtime* settings for a public repository are entered in JSON format: 

	{
		"repository": "https://github.com/keboola/docs-custom-science-example-basic",
		"version": "0.0.1"
	}
    

### Private Repository
The *Runtime* settings for a private repository must include git credentials: an unencrypted username in the
`username` field, and an encrypted password in `#password`. 

	{
        "repository": "https://github.com/keboola/docs-custom-science-example-basic",
        "version": "0.0.1",
        "username": "JohnDoe",
        "#password": "MySecretPassword"
	}

As stated above, passwords to the repository must be always [encrypted](/architecture/encryption/). There are two main encryption options available:

- Encryption on configuration save
- Encrypt password beforehand

#### Encryption on Save
When you enter a plaintext password into the Runtime setting, it will be encrypted once the configuration has been saved. After that,
the password will be shown only encrypted (e.g. `KBC::ComponentProjectEncrypted==UEh3raTcaLg=`). Once the password is encrypted, it cannot be 
decrypted. As simple as this approach may sound, there is a drawback to it: the end-user must know the password to the git repository (though only when creating the configuration).
  
#### Encryption Beforehand
If you do not wish the end-user to have an access to the git repository password, the password must be encrypted in advance; use our 
[Encryption API](/architecture/encryption/). There are three more options here:

- [Base encryption](/architecture/encryption/#base-encryption) - Encrypted values will be readable in all dockerized applications.
- [Image encryption](/architecture/encryption/#image-encryption) - Encrypted values will be readable in all instances of the specific Custom Science application.
 In the API call, the `componentId` parameter is `dca-custom-science-r` for R applications, `dca-custom-science-python` for Python 3.x, and `dca-custom-science-python2` 
for Python 2.x. This is probably the best choice to start with in a Custom Science application.  
- [Image configuration encryption](/architecture/encryption/#image-configuration-encryption) - Encrypted values will be readable in all instances of the 
specific Custom Science application in *a single project*.
 In the API call, the `componentId` parameter is `dca-custom-science-r` for R applications, `dca-custom-science-python` for Python 3.x, and `dca-custom-science-python2` 
for Python 2.x. This is the most secure way, but you need to encrypt a password for each project in which your Custom science application will be used.

## Git Repository Contents
As for the contents of your git repository, we only have a single requirement. Either `main.R` (for R Custom Science) or `main.py` (for Python Custom Science) (which will be the actual code executed by us) must be present in the root of the repository. If this requirement cannot be met, it can be circumvented by [registering](/registration/) the application. 
Otherwise the repository contents are arbitrary.
However, you might want to take a look at the specific notes on implementation details for [Python](/extend/custom-science/python/) or [R](/extend/custom-science/r).

