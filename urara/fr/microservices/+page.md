---
title: Cours sur les Microservices
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
  - observabilité
  - jaeger
---

[Ce projet](https://github.com/MohammadBnei/grpc-task-manager) est une démonstration d'architecture microservices, construite en utilisant gRPC, et implémente un système de gestion de tâches simple. L'architecture se compose de quatre microservices, qui sont user-api, auth-api, task-api et front.

Le microservice user-api fournit des fonctionnalités liées à la gestion des utilisateurs et implémente un stockage de données utilisateur en utilisant MariaDB. Le microservice auth-api fournit des fonctionnalités d'authentification et d'autorisation pour le système. Le microservice task-api offre le stockage et la gestion des tâches dans le système en utilisant MongoDB. Le microservice front agit en tant qu'application frontend pour afficher, ajouter et compléter des tâches.

Tous les microservices communiquent en utilisant le protocole gRPC, et le projet implémente également la traçabilité distribuée OpenTelemetry. De plus, le système est conteneurisé en utilisant Docker, et il peut être facilement configuré en utilisant Docker Compose.

Le projet propose également une configuration SSL en utilisant mkcert et inclut un exemple de fichier .env pour configurer le frontend. Dans l'ensemble, ce projet constitue un bon exemple pour apprendre les microservices, la traçabilité distribuée, la configuration SSL et la conteneurisation.

Pour tous les didacticiels, vous devrez avoir configuré le projet et terminé le [guide d'utilisation](https://github.com/MohammadBnei/grpc-task-manager/blob/main/Readme.md).

## 1 - Création d'une API NestJS gRPC
[NestJS gRPC](/fr/microservices/1-nestjs-grpc)


[Générer un Stub](/fr/microservices/generate-proto)

## 2 - Connexion à un microservice gRPC
[Se connecter à](/fr/microservices/2-connect-ms)

## 3 - Configuration de l'environnement et des vérifications de santé
[Conf & Health checks](/fr/microservices/3-nestjs-conf-health)


## Observabilité
[Ajouter l'observabilité](/fr/microservices/observability)

## Front-End
[Tutoriel implémentation SSR](/fr/microservices/ssr-sveltekit)