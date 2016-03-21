---
title: Encryption
permalink: /overview/encryption/
---

Many of [KBC components](/overview/) provide Encryption API. The principle of the API is that it encrypts sensitive values 
which are supposed to be securely stored and decrypted inside the components itself. This means that the encryption 
keys are stored inside the components and are not accessible to API users. This also means that there is no decryptions
API and there is no way the end-user can decrypt the encrypted values. Furthermore the encrypted values are not 
transferable between components (this may be a bit confusing in case of components which encapsulate other 
components, such as [docker component](/overview/docker-bundle/). Also note that encryption keys are 
different in production and development, so values encrypted on development server will not be readable 
on production (and vice versa). 

Decryption is only executed when serializing configuration to the configuration file for the Docker container. 
The decrypted data will be stored on the Docker host drive and will be deleted after the container finishes. 
Your application will always read the decrypted data.   

## UI interaction
When saving arbitrary configuration data (this applies especially to [Custom science](/extend/custom-science/) and
[Docker extensions](/extend/docker/) marked values marked by `#` character are automatically encrypted. 

This means that when saving a value:

{: .image-popup}
![Configuration editor Screenshot](/overview/encryption-1.png)

Once you save the value, you will receive:

{: .image-popup}
![Configuration editor Screenshot](/overview/encryption-2.png)

Once the configuration has been saved, the value is encrypted and there is no way to decrypt it (only the 
application will receive the decrypted value). When encrypting a configuration as in the above example, 
note that what values are encrypted is defined by the application. I.e. you cannot freely encrypt any value unless
the application explicitly supports it. For example, if the application states that it requires configuration:

{% highlight json %}
{
    "username": "JohnDoe",
    "#password": "password"
}
{% endhighlight %}

It means that the password will always be encrypted and the username will not be encrypted. You generally cannot
pass `#username`, because the application does not expect such key to exist (although it's value will be decrypted
normally). Internally, the [Encrypt and Store configuration API call](http://docs.kebooladocker.apiary.io/#reference/encrypt/encrypt-and-store-configuration/save-configuration)
is used

## Encrypting data with API
The encryption API can encrypt either strings or arbitrary JSON data. In case of strings, the whole string is 
encrypted. In case of JSON data,
only keys which start with `#` character and they are scalar, are encrypted. Therefore, encrypting a JSON structure e.g.:

{% highlight json %}
{
    "foo": "bar",
    "#encryptMe": "secret",
    "#encryptMeToo": {
        "another": "secret"
    }
}
{% endhighlight %}

yields:

{% highlight json %}
{
    "foo": "bar",
    "#encryptMe": "KBC::Encrypted==ENCODEDSTRING==",
    "#encryptMeToo": {
        "another": "secret"
    }
}
{% endhighlight %}


If you want to encrypt e.g. only password The body of the request is simply the text string you want to encrypt (no JSON or quotation is used). e.g. encrypting:

    mySecretPassword 

yields:

    KBC::Encrypted==ENCODEDSTRING==


If you happen to receive the error:

    This API call is only supported for components that use the 'encrypt' flag.
    
ask a Keboola Developer to enable encryption for your [docker extension](/extend/docker/), for 
[Custom Science](/).

You can use sample Postman requests from collection 
[![Run in Postman](https://run.pstmn.io/button.png)](https://www.getpostman.com/run-collection/7dc2e4b41225738f5411)

{: .image-popup}
![Postman screenshot](/overview/encryption-postman.png)


## Encryption Options
Our [docker component](/overview/docker-bundle/) provides [Encryption API](http://docs.kebooladocker.apiary.io/#reference/encrypt). 
There are three options here:

- [Base encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/base-encryption/encrypt-data)
- [Image encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-encryption/encrypt-data)
- [Image configuration encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-configuration-encryption/encrypt-data)

### Base Encryption
[Base encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/base-encryption/encrypt-data)
 encrypts data so that they are globally usable for all dockerized components. Data encrypted using this method can be decrypted in all projects 
and in all [Docker components](/overview/docker-bundle) (uncluding custom-science applications). Note that the under all
circumstances the data are decrypted only inside component application code, decrypted data are never available to the end-user. The API
call requires an arbitrary valid Storage API token. The encrypted value is identified by string `KBC::Encrypted`

### Image Encryption
[Image encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-encryption/encrypt-data)
 encrypts data so that they are usable within a single KBC component. Data encrypted using this method can be
decrypted in all projects but always only in the component for which they were encrypted. The API
call requires an arbitrary valid Storage API token and an `image` parameter which is the name of the component ID obtained during its
[registration](/extend/registration/). The encrypted value is identified by string `KBC::ComponentEncrypted`
  
### Image Configuration Encryption
[Image Configuration Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-configuration-encryption/encrypt-data)
 encrypts data so that they are usable only in a single KBC component and project. Data encrypted
using this method can be decrypted in all configurations but only in the project for which they were encrypted and only in the
component for which they were encrypted. Selected project is derived from This option requires that you have a StorageAPI token to the project. 
The API
call requires valid Storage API token for the respective project an `image` parameter which is the name of the component ID obtained during its
[registration](/extend/registration/). The data can be decrypted only in the project associated with the supplied Storage token.  
The encrypted value is identified by string `KBC::ComponentProjectEncrypted`

## Which encryption method should i choose?
You should not use the Base encryption unless you develop multiple components and have a very good reason for transferable ciphers. 
If a encrypted value has to be readable withinin multiple projects, it must be encrypted using 
[Image encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-encryption/encrypt-data) (`/docker/*{componentId}*/encrypt`). 
If an encrypted value does not have to be transferable betwen projects, its should be encrypted using 
[Image Configuration Encryption](http://docs.kebooladocker.apiary.io/#reference/encrypt/image-configuration-encryption/encrypt-data) 
(`/docker/*{componentId}*/**configs**/encrypt`). 
