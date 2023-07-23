---
title: Exercice Docker layers
created: 2023-07-22
tags:
  - docker
  - course
  - exercie
flags:
  - unlisted
---

# Docker Flags - Exercices

These exercises use five fundamental Dockerfile instructions: `ARG`, `ADD`, `COPY`, `EXPOSE`, `ONBUILD`, and `VOLUME`. Cumulatively, they will be used to build a Dockerfile step-by-step. The final Dockerfile will deploy a simple Python application.

<details class="mb-4">
<summary class="cursor-pointer -mb-4 font-bold">Sample python server</summary>

```python
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            with open('/data/sampledata.txt', 'r') as file:
                content = file.read()
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(bytes(content, "utf8"))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(bytes(str(e), "utf8"))

if __name__ == '__main__':
    port = int(os.getenv("PORT", 8080))
    HTTPServer(('', port), Handler).serve_forever()
```

</details>

Please complete the following exercises:

## Exercise 1 - ARG and ADD Commands

In Exercise 1, you'll use the `ARG` command to specify the Python version during the build process. Then, with the `ADD` command, you'll download a specific file from a URL into your Docker image.

1. Create a new file and name it Dockerfile.
2. Add the line `ARG version` to start your Dockerfile. This line sets up a build-time variable which will allow you to specify the version of Python for your Docker image.
3. On a new line, add `FROM python:$version`. This line pulls the Python docker image of the version you specified, creating the possibility to customize the base image version at build time.
4. Then, add the line `ADD https://bnei.dev/assets/docker/flag/data.txt /data/sampledata.txt`. This command will download a text file from a URL and add it to the /data directory in your Docker image.

Now, you can use the `--build-arg` flag when building the Docker image to specify the Python version. For example, use the command `docker build --build-arg version=3.9 -t my-python-app .` to build your Docker image using Python 3.9 as the base image. This Docker image also contains `sampledata.txt` file in the `/data` directory, obtained from a URL. 

## Exercise 2 - COPY Command

In exercise 2, you will use the `COPY` command to copy an application and its configurations from your local system into the Docker image.

1. Create a new directory named `app` in the same location as your Dockerfile.
2. Put a simple python application `main.py` into the `app` directory.
3. Back in the Dockerfile, add the command `WORKDIR /src` to set the working directory for any subsequent commands.
4. Add the command `COPY ./app /src`. This command will copy the local `app` directory from your host to the `/src` directory in your Docker image.

In these steps, you have added your local application code to the Docker image which will be executed whenever a Docker container is spun out from the image. 

## Exercise 3 - EXPOSE Command

For the third step, you'll use the `EXPOSE` command to inform Docker that the container should listen on a specified network port at runtime.

1. Append the instruction `EXPOSE 8080` to your Dockerfile. It tells Docker that your container will be listening on port 8080.

## Exercise 4 - VOLUME Command

The `VOLUME` command is used to allow your Docker container access to a directory in the host machine. In this exercise, you will create a directory for the app's data to persist across different containers.

1. Add `VOLUME /app-data` to your Dockerfile. This command designates /app-data as a directory on the host machine.

## Exercise 5 - ONBUILD Command

Finally, using the `ONBUILD` command, we'll set an instruction to trigger when another Docker image uses the current image as a base.

1. Add the instruction `ONBUILD RUN echo 'New Container created from this Base image'` to the Dockerfile. Now, whenever a Docker image uses your image as a base, it will print this message as output during its build process.

## Exercice 6 - CMD

Add a command with the CMD flag to start the app.

## Conclusion

Through these exercises, you have built up a Dockerfile step by-step for a simple Python application, practicing essential commands like `ARG`, `ADD`, `COPY`, `EXPOSE`, `VOLUME`, and `ONBUILD`. The resulting Dockerfile can successfully build a Docker image for a Python application by using flexible, passable arguments and including crucial elements that a deployed Python application might need.

<details class="mb-4">
<summary class="cursor-pointer -mb-4 font-bold">Solution</summary>

**Exercise 1 - ARG and ADD Commands Solution**

The solution to these commands in a Dockerfile would be as follows:

```Dockerfile
ARG version
FROM python:$version
ADD https://bnei.dev/assets/docker/flag/data.txt /data/sampledata.txt
```
With these lines:
- You can specify Python version using the `--build-arg version=3.9` flag while building the Docker image.
- 'sampledata.txt' is added to '/data' directory from a URL.

**Exercise 2 - COPY Command Solution**

For the COPY command, the solution is:

```Dockerfile
WORKDIR /src
COPY ./app /src
```
These lines set '/src' as the working directory and copies all files from your local 'app' directory into '/src'.

**Exercise 3 - EXPOSE Command Solution**

For the EXPOSE command, the solution is:

```Dockerfile
EXPOSE 8080
```
This line tells Docker that the container should listen on network port 8080 at runtime.

**Exercise 4 - VOLUME Command Solution**

For the VOLUME command, the solution is:

```Dockerfile
VOLUME /app-data
```
This line updates Dockerfile to create '/app-data' as a directory on the host machine.

**Exercise 5 - ONBUILD Command Solution**

For the ONBUILD command, the solution is:

```Dockerfile
ONBUILD RUN echo 'New Container created from this Base image'
```
This line updates Dockerfile to print a message whenever a new Docker image is built from your image as a base.

**Exercise 6 - CMD**

For the CMD command, the solution is:

```Dockerfile
CMD [ "python", "app.py" ]
```

**Final Dockerfile**

Pulling all these instructions together, our final Dockerfile looks like this:

```Dockerfile
ARG version
FROM python:$version
ADD https://bnei.dev/assets/docker/flag/data.txt /data/sampledata.txt
WORKDIR /src
COPY ./app /src
EXPOSE 8080
VOLUME /app-data
ONBUILD RUN echo 'New Container created from this Base image'
CMD [ "python", "app.py" ]
```

In conclusion, with these solutions you have a modular Dockerfile which will build a Docker container for a Python application. You can specify the Python version, work directory, exposed port, and even an action based on triggers from subsequent Dockerfiles.
</details>