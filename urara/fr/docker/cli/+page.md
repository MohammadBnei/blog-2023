---
title: Exercice Docker CLI
created: 2023-07-22
tags:
  - docker
  - course
  - exercie
---


# Docker CLI Understanding Exercise

1. **Hello World:**
   - Run the hello-world image on Docker Terminal. It will pull the hello-world image from the Docker Hub.

    `docker run hello-world`

2. **Running a Container:**
   - Pull and run the nginx server. Once the image pulls, it executes and the nginx server starts.

    `docker run -d -p 8080:80 nginx`

3. **Listing Containers:**
   - List all the running Docker containers.

    `docker ps`

4. **Stopping a Container:**
  - Find the container ID you want to stop from the `docker ps` command then, stop a running Docker container using that ID.

    `docker stop container_id`

5. **Removing Container:**
   - Remove a Docker Container. Make sure the container is stopped before trying to remove it.

    `docker rm container_id`

6. **Pulling an Image:**
   - Pull the latest Ubuntu image from Docker Hub.

    `docker pull ubuntu:latest`

7. **Listing Images:**
   - List all Docker images present on your system.

    `docker images`

8. **Docker Run and Exec:**
    - Run an Ubuntu container and execute the bash command to access the Ubuntu bash Terminal.

    `docker run -it ubuntu bash`

9. **Build Docker Image:**
   - Create a Dockerfile with an application. Build a Docker image from that Dockerfile. 

    ```bash
    touch Dockerfile
    # Write your application into Dockerfile
    docker build -t myapp .
    ```

10. **Push Docker Image:**
    - Login to DockerHub, tag the image and push your Docker image to Docker Hub. Change `username`, `image_name` and `image_id` with your DockerHub username, desired image name and ID of the created image.

    ```bash
    docker login 
    docker tag image_id username/image_name
    docker push username/image_name 
    ```

By doing these exercises, you will solidify your understanding of the basic commands available in Docker CLI.