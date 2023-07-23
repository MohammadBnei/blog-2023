---
title: Docker layers
created: 2023-07-22
tags:
  - docker
  - course
---

# Docker Layers Explained 

Docker layers are essentially a series of filesystem changes or differences. They serve to optimize Docker images, minimize the duplication of data, and increase the speed of Docker tasks. 

## Simple Definition

At the simplest level, a Docker layer is a difference in an image's filesystem from the layer directly beneath it. For example, if an image has three layers: A, B, and C, layer C contains the changes made from layer B, and layer B contains changes made from layer A. 

## Images and Containers

Images are read-only. When you run an image and create a container, Docker adds a read-write layer on top (often called the "container layer"). Any changes to the container that affect the filesystem, like creating or modifying files, is written to this thin writable container layer.

```docker run -it ubuntu bash```

In above command, `ubuntu` is the image, and the `bash` command that we're running creates a new layer on top of it. Any changes made during the execution of this command are saved in this new layer.

## Dockerfile

Each instruction in a Dockerfile creates a layer. The `FROM` instruction specifies the base image, `COPY` and `ADD` instructions copy files from your Docker client's local host into the current file system path, `RUN` executes command(s) in a new layer and creates a new image, and so on. 

Example Dockerfile:

```Dockerfile
FROM ubuntu:18.04
COPY . /app
RUN make /app
CMD python /app/app.py
```
This Dockerfile would create an image with four layers.

## Docker Layer Caching

Docker has a built-in caching mechanism, where if no changes were made to a layer, Docker will simply reuse the existing layer rather than create a new one (often referred to as Docker cache or layer cache). This reduces build times and minimizes data sent when pushing images.

However, Docker cache can also lead to outdated information being used if dependencies change but the Dockerfile does not. If a layer's cache is broken, all subsequent layers have to be recreated.

Proving Example: If we change a line in our example Dockerfile, the subsequent layers will be rebuilt, demonstrating Docker layer caching.

Disproving Example: Let's say our application is dependent on an external package, whose latest version is continually changing. However, if our Dockerfile remains unchanged, the Docker layer cache might not pull the latest version of this package.

## Sharing and Optimizing Layers

Since layers are just differences between filesystems, if two images are built from the same base image, they share the base layers. This sharing of layers among images saves both disk space and network transfer time when images are downloaded and run.

Best practice is to order your Dockerfile instructions with the least frequently changing layers at the top. This can considerably improve image build times and reduce the image size. 

Proving Example: If you have two different Dockerfiles, both using `FROM python:3.8` as their base image, they'll share these base layers.

Disproving Example: If you have two Dockerfiles but one uses `FROM python:3.8` and the other uses `FROM python:3.9`, these layers cannot be shared as they use different base images.

[Exercices](exercice)
