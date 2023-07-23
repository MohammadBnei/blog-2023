---
title: Docker
created: 2023-07-22
tags:
  - docker
  - course
---

# Docker: Introduction

## What is Docker?
Docker is an open-source platform that enables developers to automate the deployment, scaling, and management of applications. It achieves this by using containerization—a lightweight form of virtualization. Unlike traditional virtualization, which emulates entire operating systems, Docker allows applications to share the same OS kernel, making it much more efficient.

## Purpose of Docker
The main purpose of Docker is to simplify the process of managing application processes in a container. With Docker, it’s easy to package an application with all its dependencies into a standardized unit for software development. It improves the collaboration between developers and system administrators, while reducing the deployment time.

## How Docker Works: Conceptual Layers

1. __Layer 1: Docker Engine__\
The Docker engine is the host runtime that builds and runs the containers. It's the underlying technology that powers Docker. Docker engine consists of three main components: 

    - __Docker Daemon (dockerd)__: Listens for Docker API requests and manages Docker objects such as images, containers, networks, and volumes.

    - __Docker CLI__: The command-line interface client that enables users to interact with Docker.

    - __Docker REST API__: An API used by applications to interact with Docker daemon.

2. __Layer 2: Docker Images__\
A Docker image is a lightweight, stand-alone, and executable software package that includes everything needed to run a piece of software, including the code, a runtime, libraries, environment variables, and config files. Images are constructed from layered Dockerfiles, which are templates with instructions on building the Docker image.

3. __Layer 3: Docker Containers__\
A Docker container is a runtime instance of an image—what the image becomes in memory when executed. Since the image contains the application code, runtime, libraries, and environment variables, the container has everything it needs to run the application. 

4. __Layer 4: Docker Registry/Docker Hub__\
Docker images are stored in a Docker registry. Docker Hub, the default public registry, allows you to store and distribute Docker images. It includes both public and private image repositories. 

Here's a visual of how they're related:

```
Docker Engine         
│       
│
├── Docker Images       <------ Dockerfile
│
│
└── Docker Containers   <------ Docker Images
```

Before Docker, the standard was to use virtual machines which would include not just the application and dependencies, but also an entire guest OS—for each application. This leads to increased resource usage, slow start times, and overall inefficiency. The Docker approach of packaging just the application code and dependencies into containers that share the host OS is far more efficient and effective.

## Courses

### Layers

Layers are a series of changes in a filesystem used to optimize Docker tasks. When changes are made to a Docker image, they're recorded in a read-write layer called the "container layer". Docker has a cache mechanism to reuse unchanged layers. Docker layers sharing the same base image can be shared, saving space and transfer time. Ordering Dockerfile instructions by the frequency of their changes can further optimize Docker tasks.

[Layers](./layers)

### Flags

Overview of various Docker flags used in a Dockerfile, including their functions and examples of their usage. The flags explained are `FROM`, `RUN`, `WORKDIR`, `COPY`, `ADD`, `EXPOSE`, `VOLUME`, `ARG`, and `ONBUILD`. These commands enable the execution of different operations like setting a base image, copying files, setting work directory, exposing ports, creating a volume, defining build-time variables, and setting triggers for other builds, respectively.

[Flags](./flags)

### Entrypoint

In-depth explanation of two fundamental Docker instructions: `ENTRYPOINT` and `CMD`. It explains how each instruction works and the role it plays in configuring a container for execution. The guide provides information about different syntax types (Shell and Exec form), how they're used, and their impact on signal handling within containers. The content also distinguishes between the two instructions, explaining how they work together and how they can be overwritten during the `docker run` command.

[Entrypoint](./entrypoint)

## Conclusion

This course explains fundamental docker topics, and dives into the caveats and the details on how to optimize your docker workflow.