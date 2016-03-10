---
title: Running Images
permalink: /extend/docker/running/
---

How to run Keboola docker images

- command line
- environemnt
- datadirectory

When you need to debug the container, you can enter into it
-- entrpoint

When you need to debug a running application, you can enter into it
docker exec

The option `-i` and `-t` make the container run in *i*nteractive *t*erminal. The option 
`--entrypoint` overrides the `ENTRYPOINT` specified in the `Dockerfile`. This ensures that 
bash shell is run instead of your application. 

Your application will now have the contents of /data and simulate the KBC environment. Apart from the data directory you 
might want to work with environment variables. To do so, use the -e switch in docker run

`docker run --volume=/c/Users/JohnDoe/data:/data/ -e=KBC_PROJECT_ID:572 quay.io/keboola/doc-sample`

(make sure to put NO spaces around = and : characters)

For more details on see [Howto](/extend/docker/running/) You can now develop the application logic. 
When the image/container is run, it should produce result tables and files in the respective folders.

