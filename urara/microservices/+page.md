---
title: Microservice Course
created: 2023-05-20
updated: 2023-05-30
tags:
  - sveltekit
  - nodejs
  - nestjs
  - docker
  - kubernetes
  - mariadb
  - mongodb
  - github action
  - microservices
  - observability
  - jaeger
---

[This project](https://github.com/MohammadBnei/grpc-task-manager) is a demonstration of microservices architecture, built using gRPC, and it implements a simple Task Manager system. The architecture consists of four microservices, which are user-api, auth-api, task-api, and front.

The user-api microservice provides functionalities related to user management and implements a user data store using MariaDB. The auth-api microservice provides authentication and authorization functionalities for the system. The task-api provides the storage and management of tasks in the system using MongoDB. The front microservice acts as a frontend application to display, add, and complete tasks.

All microservices communicate using gRPC communication protocol, and the project also implements distributed tracing using Jaeger. Moreover, the system is containerized using Docker, and it can be easily set up using Docker Compose.

The project also features SSL configuration using mkcert and includes an example .env file to set up the frontend. Overall, this project serves as a good example to learn about microservices, distributed tracing, SSL configuration, and dockerization.

For all of the tutorials, you will need to have setup the project and finished the [readme](https://github.com/MohammadBnei/grpc-task-manager/blob/main/Readme.md).

## 1 - Creation of a nestjs grpc api
[NestJS gRPC](/microservices/1-nestjs-grpc)


[Generate Stub](/microservices/generate-proto)

## 2 - Connecting to a gRPC microservice
[Connect to](/microservices/2-connect-ms)

## 3 - Setting up env conf & health checks
[Conf & Health checks](/microservices/3-nestjs-conf-health)


## 4 - Adding observability
[Observability](/microservices/observability)

## Front-End
[SSR implementation tutorial](/microservices/ssr-sveltekit)