---
title: SSH Database Connection
permalink: /integrate/database/
---

* TOC
{:toc}

If you wish to use [any of our database extractors](https://help.keboola.com/components/extractors/database/), we highly recommend
that you set up an SSH [Tunnel](https://en.wikipedia.org/wiki/Tunneling_protocol) between your and our private networks.
This way your database server will not be open to the whole internet.

A Secure Shell (SSH) tunnel consists of an encrypted tunnel created through an SSH protocol connection.
The SSH connection is encrypted and uses a public - private key pair for user authorization.

{: .image-popup}
![Schema - SSH tunnel](/integrate/database/ssh-tunnel.jpg)

## Usage
Before using an SSH tunnel with one of our database extractors, setup an *SSH proxy server*
to act as a gateway to your private network where your database server resides.
The extractor will then connect to this *SSH proxy server* and through it to the database server.

Complete the following steps to setup an SSH tunnel to your database server:

### 1. Setup SSH Proxy Server
Here is a very basic example [Dockerfile](https://docs.docker.com/engine/reference/builder/).
All it does is run an sshd daemon and exposes port 22. You can, of course, set this up in your system in
a similar way without using Docker.

{% highlight dockerfile %}
FROM ubuntu:14.04

RUN apt-get update

RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd

RUN echo 'root:root' |chpasswd

RUN sed -ri 's/^PermitRootLogin\s+.*/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -ri 's/UsePAM yes/#UsePAM yes/g' /etc/ssh/sshd_config

EXPOSE 22

CMD    ["/usr/sbin/sshd", "-D"]
{% endhighlight %}

This server should be in the same private network where your database server resides. It should be accessible publicly from the internet via SSH.
The default port for SSH is 22, but you can choose a different port.

See the following pages for more information about setting up SSH on your server:

- [OpenSSH configuration](https://help.ubuntu.com/community/SSH/OpenSSH/Configuring)
- [Dockerized SSH service](https://docs.docker.com/engine/examples/running_ssh_service/)


### 2. Generate SSH Key Pair
Setup or edit your database extractor in [Keboola](https://connection.keboola.com).
Go to **Database Credentials** and check **Enable SSH Tunnel**.
Generate an SSH key pair and copy the public key to your *SSH proxy server*.
Paste it to the *public.key* file and then append it to the authorized_keys file.

{% highlight bash %}
mkdir ~/.ssh
cat public.key >> ~/.ssh/authorized_keys
{% endhighlight %}

### 3. Setup DB Extractor

- **Host Name** - Address of the DB server in your private network
- **Port** - Port number of the DB server
- **Username** - DB username
- **Password** - DB password
- **Database** - DB name

- **Enable SSH Tunnel** - Check to enable
- **SSH host** - Public address of your *SSH proxy server*
- **SSH user** - User on your *SSH proxy server* with the generated public key
- **SSH port** - SSH port; default is 22

Run **Test Credentials** and see if everything is working.

Various DB extractors could have different fields, but the principle remains the same.

## Local Tunnel
It is also possible to use your database server as an *SSH proxy server* and setup your database to only accept connections from localhost.
In this case, set the *Host Name* to `127.0.0.1`.

**Important**: Do **not** use the word `localhost`! Our extractors have a problem with that.
