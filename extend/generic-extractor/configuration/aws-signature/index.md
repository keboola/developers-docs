---
title: AWS Signature
permalink: /extend/generic-extractor/configuration/aws-signature/
---

* TOC
{:toc}

Generic extractor allows signaturing requests by [**AWS**](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html).
Signature is the process to add authentication information to your requests. When you use AWS tools, extractor sign your API request.

A sample AWS signature configuration looks like this:

{% highlight json %}
{
  ...,
  "aws": {
    "signature": {
      "credentials": {
        "accessKeyId": "testAccessKey",
        "#secretKey": "testSecretKey",
        "serviceName": "testService",
        "regionName": "testRegion"
      }
    }
  }
}
{% endhighlight %}

See [example [EX143]](https://github.com/keboola/generic-extractor/tree/master/doc/examples/143-aws-signature-request).

## AWS Signature Credentials
- **accessKeyId** --- AWS access key ID
- **#secretKey** --- AWS secret access key
- **serviceName** --- Signing to a particular service name
- **regionName** --- Signing to a particular region name
