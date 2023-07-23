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
## Exercise 1: Creating a Basic Node.js Dockerfile

Create a `Dockerfile` using the `node:14` image as the base. Then add a `WORKDIR /app` instruction which sets the working directory for any instructions that follow in the `Dockerfile`.

```Dockerfile
FROM node:14
WORKDIR /app
```
Once you've created this `Dockerfile`, build an image from it with the command `docker build -t my-node-app .` and you'll have an image with two layers.

## Exercise 2: Adding More Layers

Create a node project with 
```sh
npm init 
```
In the `src/index.js` file, create a *hello world* express api.

Modify your `Dockerfile` to copy your local project files into the Docker image and install the project's npm dependencies. Your Dockerfile should now look like this:

```Dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
```
These changes add two new layers: one for `COPY package*.json ./` and one for `RUN npm install`.

Build the image with `docker build -t my-node-app .` and observe the new layers that are created during the build process.

## Exercise 3: Docker Cache

Modify a file in your project (not `package.json` or `package-lock.json`) and rebuild the image with `docker build -t my-node-app .`. Observe the output about the Docker cache.

Now, modify `package.json` (or `package-lock.json`) and rebuild the image again. Observe the Docker cache output now. What differences do you notice?

## Exercise 4: Sharing Layers

Let's say you have another Node.js project. Create a new `Dockerfile` following the same steps as in Exercise 2, but name the image with something different, like `my-other-node-app`.

Build the image with `docker build -t my-other-node-app .` and see the shared layers from the `node:14` base image.

## Exercise 5: Ordering for Efficiency

In your `Dockerfile`, swap the order of the `COPY` instructions and rebuild your image. Did this cause any issues? Now put them back in the original order and swap the `WORKDIR` and `FROM` instructions. Again, rebuild your image. Did this change cause any issues?

Through these exercises, you should gain a better understanding of Docker layering, caching, and efficient Dockerfile organization.

<details class="ml-4">
<summary class="font-bold cursor-pointer -ml-4">Solutions</summary>

**Exercice 1 Solution: Creating a Basic Node.js Dockerfile**

You should have created a `Dockerfile` with the following content:

```Dockerfile
FROM node:14
WORKDIR /app
```

You can build the image using the command `docker build -t my-node-app .`. This will create a Docker image with two layers, one for the base image `node:14` and another for the working directory `/app`.

**Exercice 2 Solution: Adding More Layers**

You should have modified the `Dockerfile` to look like this:

```Dockerfile
FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
```

By running `docker build -t my-node-app .`, the build process creates four layers: the base image, the working directory, the layer copying the `package*.json` files, and the layer running `npm install`.

**Exercice 3 Solution: Docker Cache**

When you edited a file that is not `package.json` or `package-lock.json`, the docker cache has been utilized until the step just before the change was detected.

When you modified `package.json` (or `package-lock.json`), Docker did not use the cache starting from the point where `package.json` was copied since this file is considered to be a changed file.

**Exercice 4 Solution: Sharing Layers**

If you have created another Dockerfile for a different project, but using the same `node:14` base image and ran the command `docker build -t my-other-node-app .`, you would see shared layers. Docker shares layers from the `node:14` base image between the images `my-node-app` and `my-other-node-app`.

**Exercice 5 Solution: Ordering for Efficiency**

If you switched the order of `COPY` instructions, the Dockerfile should still be able to build properly, but it would not utilize the benefit of Docker cache efficiently. Placing the `COPY . .` before `COPY package*.json ./` will cause Docker to invalidate the cache from that layer onward every time there's a change in any file in the current directory, which is not efficient.

If you swapped the `WORKDIR` and `FROM` instructions, the Dockerfile would fail to build. The `WORKDIR` instruction has to be after the `FROM` instruction because it depends on the image specified in the `FROM` instruction to determine its absolute path.
</details>