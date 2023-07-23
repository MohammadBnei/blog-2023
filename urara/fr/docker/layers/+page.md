---
title: Docker Layers
created: 2023-07-22
tags:
  - docker
  - cours
---

# Les couches de Docker expliquées 

Les layers de Docker sont essentiellement une série de changements ou de différences dans le système de fichiers. Elles servent à optimiser les images Docker, à minimiser la duplication des données et à augmenter la vitesse des tâches Docker. 

## Définition simple

Au niveau le plus simple, une couche Docker est une différence dans le système de fichiers d'une image par rapport à la couche directement inférieure. Par exemple, si une image a trois couches : A, B et C, la couche C contient les modifications apportées par la couche B et la couche B contient les modifications apportées par la couche A. 

## Images et conteneurs

Les images sont en lecture seule. Lorsque vous exécutez une image et créez un conteneur, Docker ajoute une couche en lecture-écriture (souvent appelée **"container layer"**). Toute modification du conteneur qui affecte le système de fichiers, comme la création ou la modification de fichiers, est écrite dans cette fine couche de conteneur inscriptible.

```docker run -it ubuntu bash```

Dans la commande ci-dessus, `ubuntu` est l'image, et la commande `bash` que nous exécutons crée une nouvelle couche au-dessus d'elle. Tous les changements effectués pendant l'exécution de cette commande sont sauvegardés dans cette nouvelle couche.

## Dockerfile

Chaque instruction dans un Dockerfile crée une couche. L'instruction `FROM` spécifie l'image de base, les instructions `COPY` et `ADD` copient des fichiers depuis l'hôte local de votre client Docker dans le chemin du système de fichiers actuel, `RUN` exécute la ou les commandes dans une nouvelle couche et crée une nouvelle image, et ainsi de suite. 

Exemple de fichier Docker :

```Dockerfile
FROM ubuntu:18.04
COPY . /app
RUN make /app
CMD python /app/app.py
```
Ce fichier Docker créerait une image avec quatre couches.

## Mise en cache des couches Docker

Docker dispose d'un mécanisme de mise en cache intégré, où si aucune modification n'a été apportée à une couche, Docker réutilisera simplement la couche existante plutôt que d'en créer une nouvelle (souvent appelé cache Docker ou cache de couche). Cela permet de réduire les temps de construction et de minimiser les données envoyées lors de l'envoi d'images.

Cependant, le cache Docker peut également conduire à l'utilisation d'informations obsolètes si les dépendances changent mais pas le Dockerfile. Si le cache d'une couche est rompu, toutes les couches suivantes doivent être recréées.

Exemple de démonstration : Si nous changeons une ligne dans notre exemple de Dockerfile, les couches suivantes seront reconstruites, démontrant la mise en cache des couches de Docker.

Exemple de réfutation : Supposons que notre application dépende d'un paquetage externe, dont la dernière version change continuellement. Cependant, si notre Dockerfile reste inchangé, le cache de couche de Docker pourrait ne pas extraire la dernière version de ce paquet.

## Partage et optimisation des couches

Puisque les couches ne sont que des différences entre les systèmes de fichiers, si deux images sont construites à partir de la même image de base, elles partagent les couches de base. Ce partage des couches entre les images permet d'économiser de l'espace disque et du temps de transfert réseau lorsque les images sont téléchargées et exécutées.

La meilleure pratique consiste à ordonner les instructions de votre fichier Docker en plaçant les couches les moins fréquemment modifiées en tête. Cela peut considérablement améliorer le temps de construction de l'image et réduire sa taille. 

Exemple de démonstration : Si vous avez deux Dockerfiles différents, tous deux utilisant `FROM python:3.8` comme image de base, ils partageront ces couches de base.

Exemple de réfutation : Si vous avez deux Dockerfiles mais que l'un utilise `FROM python:3.8` et l'autre `FROM python:3.9`, ces couches ne peuvent pas être partagées car elles utilisent des images de base différentes.

[Exercices (EN)](/docker/layers/exercice)