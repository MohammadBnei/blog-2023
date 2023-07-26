---
title: Docker Networking
created: 2023-07-26
tags:
  - docker
  - course
  - network
---

# Docker Networking Exercises

These exercises are designed to help you understand Docker networking options and how they relate to containers. 

## Prerequisites
Please ensure you have Docker installed on your system before proceeding:

```bash
docker --version
```
You should see Docker's version if it's correctly installed. 

## Exercises

### Exercise 1: Create a Bridge Network

Run the following command to create a bridge network:

```bash
docker network create my_bridge_network
```

### Exercise 2: Run an HTTP Server in a Container

Now, let's create and run a container with an HTTP server (in this case, we'll be using an nginx container) within the network we just created. 

```bash
docker run -d --network=my_bridge_network --name=my_nginx nginx
```

Check if the container is running:

```bash
docker ps
```

### Exercise 3: Test Connection to HTTP Server from another Container

Now, let's create another container in the same network, and try to connect to the nginx server from this new container.

First, create a busybox container:

```bash
docker run -it --network=my_bridge_network --name=my_ubuntu ubuntu bash
```
Within the `my_ubuntu` container's terminal, install netcat:

```bash
apt update && apt install netcat-openbsd
```
Connect to the nginx container using netcat:

```bash
nc my_nginx 80
```
Then type:

```http_request
GET / HTTP/1.1
Host: my_nginx
```
Press "Enter" twice. You should see the HTML of the nginx default web page.

Exit the `my_ubuntu` container.

### Exercise 4: Remove Containers and Network 

Finally, let's clean up by removing the containers and network we made.

First, stop and remove the containers:

```bash
docker rm -f my_nginx my_ubuntu
```
Then remove the network:

```bash
docker network rm my_bridge_network
``` 

This concludes the exercises. By following them, you should now have a better understanding of how Docker networking and containers interact.