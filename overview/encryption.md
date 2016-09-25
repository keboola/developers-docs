---
title: Encryption
permalink: /overview/encryption/
---

* TOC
{:toc}

Many of [KBC components](/overview/) provide Encryption API; it encrypts sensitive values
which are supposed to be securely stored and decrypted inside the component itself. 

This means that the encryption keys are stored inside the components and are not accessible to API users. 
Also, there is no decryption API and there is no way the end-user can decrypt the encrypted values. 

Furthermore, the encrypted values are not transferable between components (this may be a bit confusing 
when it comes to components encapsulating other components, such as [Docker Runner](/overview/docker-bundle/). 

The encryption keys are different in production and development, so values encrypted on the development server 
will not be readable on production (and vice versa).

Decryption is only executed when serializing configuration to the configuration file for the Docker container.
The decrypted data will be stored on the Docker host drive and will be deleted after the container finishes.
Your application will always read the decrypted data.

## UI Interaction
When saving arbitrary configuration data (this applies especially to [Custom Science](/extend/custom-science/) and
[Docker extensions](/extend/docker/), values marked by `#` character are automatically encrypted.

This means that when saving a value:

{: .image-popup}
![Configuration editor Screenshot](/overview/encryption-1.png)

Once you save the value, you will receive:

{: .image-popup}
![Configuration editor Screenshot](/overview/encryption-2.png)

Once the configuration has been saved, the value is encrypted and there is no way to decrypt it (only the
application will receive the decrypted value). When encrypting a configuration like the one in the above example,
note that what values are encrypted is defined by the application. It means you cannot freely encrypt any value unless
the application explicitly supports it. For example, if the application states that it requires configuration:

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "password"
}
{% endhighlight %}

It means the password will always be encrypted and the username will not be encrypted. You generally cannot
pass `#username` because the application does not expect such a key to exist (although its value will be decrypted
normally). Also the application itself must expect the items `username` nad `#password` -- i.e. there
**will be `password` element in the configuration.
Internally, the [Encrypt and Store configuration API call](http://docs.kebooladocker.apiary.io/#reference/encrypt/encrypt-and-store-configuration/save-configuration)
is used.

### Automated Configuration Adjustment

*Note: Automated adjustment applies only to UI -- for components which have encryption enabled.*

There are few automatic configuration adjustments UI does for you:

1. Prefer encrypted values to plain values -- if you provide both `password` and `#password`, only the latter will be saved.
2. Use plain values instead of empty encrypted values -- if you provide both `password` and `#password`, but `#password` is null/empty, its value will be taken from the plain value.
3. Remove all encrypted keys with null/empty values.

Applying the above conditions, the following configuration

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "",
    "password": "secret",
    "#token": ""
}
{% endhighlight %}

will become

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "secret"
}
{% endhighlight %}

## Encrypting Data with API

The encryption API can encrypt either strings or arbitrary JSON data. For strings, the whole string is
encrypted. For JSON data,
only keys which start with `#` character and are scalar are encrypted. For example, encrypting

{% highlight json %}
{
    "foo": "bar",
    "#encryptMe": "secret",
    "#encryptMeToo": {
        "another": "secret"
    }
}
{% endhighlight %}

yields

{% highlight json %}
{
    "foo": "bar",
    "#encryptMe": "KBC::Encrypted==ENCODEDSTRING==",
    "#encryptMeToo": {
        "another": "secret"
    }
}
{% endhighlight %}


If you want to encrypt a single string, a password for instance, the body of the request is simply the text string you want to encrypt (no JSON or quotation is used). To give an example, encrypting

    mySecretPassword

yields

    KBC::Encrypted==ENCODEDSTRING==


If you happen to receive the following error

    This API call is only supported for components that use the 'encrypt' flag.

ask a Keboola Developer to enable encryption for your [Docker extension](/extend/docker/), or your
[Custom Science](/extend/custom-science/).

You can use sample Postman requests from collection
[![Run in Postman](https://run.pstmn.io/button.png)](https://app.getpostman.com/run-collection/7dc2e4b41225738f5411)

{: .image-popup}
![Postman screenshot](/overview/encryption-postman.png)


## Encryption Options
Our [Docker component](/overview/docker-bundle/) provides [Encryption API](http://docs.kebooladocker.apiary.io/#reference/encrypt).
There are three options available:

- [Base Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/base-encryption/encrypt-data); use only with multiple components and a very good reason for transferable ciphers.
- [Image Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-encryption/encrypt-data) (`/docker/*{componentId}*/encrypt`); use when the encrypted value has to be readable within multiple projects.
- [Image Configuration Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-configuration-encryption/encrypt-data) (`/docker/*{componentId}*/**configs**/encrypt`); use when the encrypted value does not have to be transferable between projects.

### Base Encryption
[Base Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/base-encryption/encrypt-data) encrypts data,
so that they are globally usable for all dockerized components. Data encrypted using this method can be decrypted in all projects
and in all components run by [Docker Runner](/overview/docker-bundle/) (including Custom Science Applications).

**Important:** Under all circumstances the data is decrypted only inside the component application code;
decrypted data is never available to the end-user. The encrypted value is identified by the `KBC::Encrypted` string.

### Image Encryption
[Image Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-encryption/encrypt-data)
encrypts data making it usable within a single KBC component. Data encrypted using this method can be
decrypted in all projects but always only in the component for which it was encrypted.
The API call requires an `image` parameter which is the name of the component ID obtained during its [registration](/extend/registration/).
The encrypted value is identified by the `KBC::ComponentEncrypted` string.

### Image Configuration Encryption
[Image Configuration Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-configuration-encryption/encrypt-data)
encrypts data so that they are **usable only in a single KBC component and project**.
Data encrypted using this method can be decrypted in all configurations;
however, this can be done only in the project and component for which the data was encrypted.

The API call requires a valid Storage API token for the respective project and `image` parameter
which is the component ID obtained upon its [registration](/extend/registration/).
The selected project is derived from the Storage API token. The data can be decrypted only in the project associated with that token.
The encrypted value is identified by the `KBC::ComponentProjectEncrypted` string.

