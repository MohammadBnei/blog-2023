---
title: Docker flags
created: 2023-07-22
tags:
  - docker
  - course
---
# Docker Flags

In addition to the aforementioned advanced Docker commands, here are the more fundamental commands that you are likely to use frequently:

## FROM

The `FROM` command is used to set the base image for subsequent instructions. In every valid Dockerfile, `FROM` will be the first command declared.

Here's an example:
```Dockerfile
FROM python:3.8
```
In this example, the `FROM` command is used to pull the Python version 3.8 official image from DockerHub.

## RUN

The `RUN` command is one of the most frequently used commands in a Dockerfile, which is used to execute any commands in a new layer on top of the current image and commit the results.

Here's an example:
```Dockerfile
RUN pip install -r requirements.txt
```
In this case, `RUN` is stating that Docker should execute the command `pip install -r requirements.txt`. This would install all libraries listed in the requirements.txt file.

## WORKDIR

The `WORKDIR` command is used to set the working directory for any `RUN, CMD, ENTRYPOINT, COPY, ADD` command that follows in the Dockerfile. If the WORKDIR doesn’t exist, it will be created even if it’s not used in any subsequent Dockerfile instruction.

For instance:
```Dockerfile
WORKDIR /app
```

In this case, `/app` would be the directory where any subsequent commands would be run.

## COPY

The `COPY` command is used to copy the files from the host system into the Docker image.

Here's an example:
```Dockerfile
COPY . /app
```
In this example, `COPY` is saying to Docker to copy the contents of the current directory (`.`, which refers to the directory where Dockerfile is located) in the host system to `/app` directory in Docker image.

These basic Dockerfile commands lay the foundation for creating effective Docker images, while more advanced flags extend the functionality of Docker, making it a powerful tool for containerization.

## ADD

The `ADD` command in Docker is used to copy new files, directories, or remote file URLs from your host and adding them to the filesystem of your docker image. Docker's `ADD` command is useful when you want to include files from your local system into your Docker image. 

Let's say you are building a Python Docker image and you have your Python scripts on your local system, you might use the `ADD` command to copy those scripts into your Docker image. 

Here's an example:

```Dockerfile
ADD /src /app
```

In this example, the `ADD` command copies the content from the local directory `/src` into the `/app` directory in the docker image. Files from `/src` will now be located in `/app` in the Image.

<details class="ml-4">
<summary class="font-bold -ml-4 cursor-pointer">ADD vs. COPY</summary>
The `ADD` and `COPY` commands in Docker have similar functionalities: both allow you to copy files from a source (the local filesystem) to a destination (the Docker image). However, there are notable differences between them in terms of some additional features.

**ADD** 

The `ADD` command takes in a src and destination. It copies the files/directories from a src on the host into the Docker image at the specified destination. 

```Dockerfile
ADD /src /app
```
This command copies the local source code folder (`/src`) into the `/app` directory in the image.

But `ADD` has additional features:

1. `ADD` allows src to be an URL. If it is, `ADD` downloads the data from the URL to the destination:

```Dockerfile
ADD http://example.com/big.tar.xz /usr/src/things/
```
In the example command gives Docker the directive to download a file from `example.com` and add it to `/usr/src/things/` in your Docker image.

2. `ADD` automatically unpacks a local tarball file if the src is in tar format:

```Dockerfile
ADD /src/big.tar.xz /app
```

This command tells Docker to automatically extract the files from `big.tar.xz` in your Docker image at the `/app` directory.

**COPY**

The `COPY` command is more straightforward. It takes in a src and destination just like `ADD`, copies the file/directory from src and adds them to the filesystem of the image at the path destination. 

```Dockerfile
COPY . /app
```

In the example, `COPY` is saying to Docker to copy the contents of the current directory (`.`, which refers to the directory where Dockerfile is located) in the host system to `/app` directory in Docker image. 

However, `COPY` does not support URL as a source and will not unpack compressed files.

**Recommendation:**

The best practice is to use `COPY` for simple copying of local files, and `ADD` for the other cases (like downloading from URL and extracting tar files). The reason behind this is it maintains transparency on what's being added into the Docker image. A Dockerfile directive like `COPY myfile /mydir/` is very clear, it's copying a local file into the specified directory in the Docker image. But if `ADD` is being used, the person reading the Dockerfile will need to check whether it's just copying, downloading from URL, or extracting a tar file, which introduces something of a 'hidden layer' and makes the Dockerfile a bit more difficult to understand.
</details>

## EXPOSE

The `EXPOSE` Docker flag is used to inform Docker that the container listens on the specified network ports at runtime. Essentially, this is kind of a documentation between the person who builds the image and the person who runs the container, about the ports that should be published at runtime. 

The `EXPOSE` command, however, does not actually (on its own) publish the port to the host machine's network - for that, you need either the `-p` flag with `docker run` or the `ports` directive in `docker-compose yml`.

Here's how you use it:

```Dockerfile
EXPOSE 8080
```

In this case, `EXPOSE` is stating that the Docker container will be listening for network requests on port `8080`.


## VOLUME

The `VOLUME` command is used to enable access from your Docker container to a directory on the host machine. One of the reasons you might want to use this is to store data that your application creates, so it is still available after stopping and starting your container.

When a file or directory gets created within a Docker container and it is not part of a volume, that data will be lost as soon as the container is stopped. Using `VOLUME`, you can make sure this doesn't happen.

Here's how you add it to your Dockerfile:

```Dockerfile
VOLUME /data
```
  
The command above is creating a new Volume in the Docker container at the /data directory.


## ARG

The `ARG` command defines a variable that users can pass at build-time. This flags allows you to include non-hardcoded values in your Dockerfile that you don't want to be included in the final image.

Here's how you could use it:

```Dockerfile
ARG user
```

In this example, during the build process you can pass in different values for `user` using `--build-arg user=value`. This can be used to set environment variables that are available to the `RUN` commands in your Dockerfile.


## ONBUILD

The `ONBUILD` instruction in Docker adds a trigger to an image that will be activated when that image is used as a base for another build. This instruction is useful if you are creating an image to be used as a basis for building other images.

This trigger will be activated at the end of the current Dockerfile processing and before the processing of a child Dockerfile instruction.

For example:

```Dockerfile
ONBUILD RUN make /app
```

With the above example, `make /app` will be triggered when an image that uses this one as a base will be built.

These Docker flags are powerful utilities in defining and controlling the docker build process and running containers. They offer a great deal of flexibility and control in your Docker workflows.

[Exercices](exercice)