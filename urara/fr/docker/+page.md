---
title: Docker
created: 2023-07-22
tags:
  - docker
  - cours
---

# Docker: Introduction

## Docker?

Docker est une plateforme open source qui permet aux développeurs d'automatiser le déploiement, la scalabilité et la gestion des applications. Il y parvient grâce à la conteneurisation, une forme allégée de virtualisation. Contrairement à la virtualisation traditionnelle, qui émule des systèmes d'exploitation entiers, Docker permet aux applications de partager le même **kernel** avec le système d'exploitation, ce qui le rend beaucoup plus efficace.

## Objectif

L'objectif principal de Docker est de simplifier le processus de gestion des processus d'application dans un conteneur. Avec Docker, il est facile de regrouper une application avec toutes ses dépendances dans une **image** standardisée pour le développement logiciel. Il améliore la collaboration entre les développeurs et les devops, tout en réduisant le temps de déploiement.

## Comment fonctionne Docker: Couches conceptuelles

1. __Couche 1: Docker Engine__
La Docker Engine est l'hôte d'exécution qui construit et exécute les conteneurs. C'est la technologie sous-jacente qui alimente Docker. Docker engine se compose de trois principaux composants:

    - __Docker Daemon (dockerd)__: Écoute les demandes de l'API Docker et gère les objets Docker tels que les images, les conteneurs, les réseaux et les volumes.

    - __Docker CLI__: L'interface client en ligne de commande qui permet aux utilisateurs d'interagir avec Docker.

    - __Docker REST API__: Un API utilisé par les applications pour interagir avec le daemon Docker.

2. __Couche 2: Images__
Une image Docker est un logiciel léger, autonome et exécutable qui comprend tout le nécessaire pour s'exécuter, y compris le code, l'environnement, les bibliothèques, les variables d'environnement et les fichiers de configuration. Les images sont construites à partir de Dockerfiles en **layers**, qui sont des couches d'instructions pour la construction de l'image Docker.

1. __Couche 3: Containers__
Un conteneur Docker est une instance d'exécution d'une image - ce que l'image devient en mémoire lorsqu'elle est exécutée. Puisque l'image contient le code de l'application, l'environnement d'exécution, les bibliothèques et les variables d'environnement, le conteneur a tout ce dont il a besoin pour exécuter l'application.

1. __Couche 4: Registry/Docker Hub__
Les images Docker sont stockées dans un **registry** Docker. Docker Hub, le registre public par défaut, vous permet de stocker et de distribuer des images Docker. Il comprend des repositories d'images publiques et privées.

Voici une visualisation de leur relation:

```
Docker Engine         
│       
│
├── Docker Images       <------ Dockerfile
│
│
└── Docker Containers   <------ Docker Images
```

Avant Docker, la norme était d'utiliser des machines virtuelles qui incluraient non seulement l'application et ses dépendances, mais aussi tout le système d'exploitation invité - pour chaque application. Cela entraîne une augmentation de l'utilisation des ressources, un démarrage lent et une inefficacité globale. L'approche de Docker consistant à empaqueter uniquement le code de l'application et ses dépendances dans des conteneurs partageant le système d'exploitation de l'hôte est beaucoup plus efficace et efficient.

## Exercice d'introduction au cli (en anglais)

[CLI introduction](./cli)

## Cours

### Layers

Les couches sont une série de modifications dans un système de fichiers utilisées pour optimiser les tâches de Docker. Lorsque des modifications sont apportées à une image Docker, elles sont enregistrées dans une couche en lecture-écriture appelée **"container layer"**. Docker a un mécanisme de cache pour réutiliser les couches inchangées. Les couches Docker partageant la même image de base peuvent être partagées, économisant de l'espace et du temps de transfert. Trier des instructions Dockerfile en fonction de la fréquence de leurs modifications peut optimiser davantage les tâches de Docker.

[Layers](./layers)

### Flags

Aperçu des différents **flags** Docker utilisés dans un Dockerfile, incluant leurs fonctions et des exemples de leur utilisation. Les commandes expliquées sont `FROM`, `RUN`, `WORKDIR`, `COPY`, `ADD`, `EXPOSE`, `VOLUME`, `ARG`, et `ONBUILD`. Ces commandes permettent d'exécuter différentes opérations comme la définition d'une image de base, la copie de fichiers, la définition du répertoire de travail, l'exposition de ports, la création d'un volume, la définition de variables d'environnements et la configuration de déclencheurs pour d'autres **builds**, respectivement.

[Flags](./flags)

### Entrypoint

Explication approfondie de deux instructions Docker fondamentales: `ENTRYPOINT` et `CMD`. Nous expliquons comment fonctionne chaque instruction et son rôle dans la configuration d’un conteneur pour son exécution. Le guide fournit des informations sur différents types de syntaxes (**Shell** et forme **Exec**), comment elles sont utilisées, et leur impact sur la gestion des signaux dans les conteneurs. Le contenu distingue également entre les deux instructions, explique comment elles travaillent ensemble et comment elles peuvent être écrasées pendant la commande `docker run`.

[Entrypoint](./entrypoint)

## Conclusion

Ce cours explique des sujets fondamentaux de docker, et plonge dans les subtilités et les détails de comment optimiser votre flux de travail docker.