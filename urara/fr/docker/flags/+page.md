---
titre : Flags Docker
créé : 2023-07-22
tags :
  - docker
  - cours
---

# Flags Docker

En plus des commandes avancées de Docker mentionnées ci-dessus, voici les commandes fondamentales que vous êtes susceptible d'utiliser fréquemment :

## FROM

La commande `FROM` est utilisée pour définir l'image de base pour les instructions suivantes. Dans chaque fichier Docker valide, `FROM` sera la première commande déclarée.

Voici un exemple :
```Dockerfile
FROM python:3.8
```
Dans cet exemple, la commande `FROM` est utilisée pour récupérer l'image officielle de Python version 3.8 depuis DockerHub.

## RUN

La commande `RUN` est l'une des commandes les plus fréquemment utilisées dans un Dockerfile, qui est utilisée pour exécuter n'importe quelle commande dans une nouvelle couche au dessus de l'image actuelle et pour livrer les résultats.

Voici un exemple :
```Dockerfile
RUN pip install -r requirements.txt
```
Dans ce cas, `RUN` indique que Docker doit exécuter la commande `pip install -r requirements.txt`. Cela installera toutes les bibliothèques listées dans le fichier requirements.txt.

## WORKDIR

La commande `WORKDIR` est utilisée pour définir le répertoire de travail pour toute commande `RUN, CMD, ENTRYPOINT, COPY, ADD` qui suit dans le fichier Docker. Si le WORKDIR n'existe pas, il sera créé même s'il n'est pas utilisé dans les instructions suivantes du Dockerfile.

Par exemple :
```Dockerfile
WORKDIR /app
```

Dans ce cas, `/app` sera le répertoire où toutes les commandes suivantes seront exécutées.

## COPY

La commande `COPY` est utilisée pour copier les fichiers du système hôte dans l'image Docker.
Voici un exemple :
```Dockerfile
COPY . /app
```
Dans cet exemple, `COPY` demande à Docker de copier le contenu du répertoire courant (`.`, qui fait référence au répertoire où se trouve le Dockerfile) dans le système hôte vers le répertoire `/app` dans l'image Docker.

Ces commandes de base Dockerfile jettent les bases de la création d'images Docker efficaces, tandis que des **flags** plus avancés étendent les fonctionnalités de Docker, ce qui en fait un outil puissant pour la conteneurisation.

## ADD

La commande `ADD` de Docker est utilisée pour copier de nouveaux fichiers, répertoires ou URL de fichiers distants depuis votre hôte et les ajouter au système de fichiers de votre image Docker. La commande `ADD` de Docker est utile lorsque vous voulez inclure des fichiers de votre système local dans votre image Docker. 

Disons que vous construisez une image Docker Python et que vous avez vos scripts Python sur votre système local, vous pouvez utiliser la commande `ADD` pour copier ces scripts dans votre image Docker. 

Voici un exemple :

```Dockerfile
ADD /src /app
```

Dans cet exemple, la commande `ADD` copie le contenu du répertoire local `/src` dans le répertoire `/app` de l'image Docker. Les fichiers de `/src` seront maintenant situés dans `/app` dans l'image.



<details class="ml-4">
<summary class="font-bold -ml-4 cursor-pointer">ADD vs. COPY</summary>
Les commandes `ADD` et `COPY` de Docker ont des fonctionnalités similaires : elles permettent toutes deux de copier des fichiers d'une source (le système de fichiers local) vers une destination (l'image Docker). Cependant, il y a des différences notables entre elles en termes de fonctionnalités supplémentaires.

**ADD** 

La commande `ADD` prend en compte un src et une destination. Elle copie les fichiers/répertoires d'un src sur l'hôte dans l'image Docker à la destination spécifiée. 

```Dockerfile
ADD /src /app
```
Cette commande copie le dossier du code source local (`/src`) dans le répertoire `/app` de l'image.

Mais `ADD` a des fonctionnalités supplémentaires :

1. `ADD` permet à src d'être une URL. Si c'est le cas, `ADD` télécharge les données de l'URL vers la destination :

```Fichier docker
ADD http://example.com/big.tar.xz /usr/src/things/
```
Dans l'exemple, la commande donne à Docker la directive de télécharger un fichier depuis `example.com` et de l'ajouter à `/usr/src/things/` dans votre image Docker.

2. `ADD` décompresse automatiquement un fichier tarball local si le src est au format tar :

```Dockerfile
ADD /src/big.tar.xz /app
```

Cette commande indique à Docker d'extraire automatiquement les fichiers de `big.tar.xz` dans votre image Docker dans le répertoire `/app`.

**COPY**

La commande `COPY` est plus simple. Elle prend un src et une destination tout comme `ADD`, copie le fichier/répertoire de src et l'ajoute au système de fichiers de l'image dans le chemin de destination. 



```Dockerfile
COPY . /app
```

Dans l'exemple, `COPY` demande à Docker de copier le contenu du répertoire courant (`.`, qui fait référence au répertoire où se trouve Dockerfile) dans le système hôte vers le répertoire `/app` dans l'image Docker. 

Cependant, `COPY` ne supporte pas l'URL comme source et ne décompresse pas les fichiers compressés.

**Recommandation:**

La meilleure pratique est d'utiliser `COPY` pour la simple copie de fichiers locaux, et `ADD` pour les autres cas (comme le téléchargement depuis une URL et l'extraction de fichiers tar). La raison derrière cela est de maintenir la transparence sur ce qui est ajouté à l'image Docker. Une directive Dockerfile comme `COPY myfile /mydir/` est très claire, elle copie un fichier local dans le répertoire spécifié dans l'image Docker. Mais si `ADD` est utilisé, la personne qui lit le fichier Docker devra vérifier s'il s'agit simplement d'une copie, d'un téléchargement depuis une URL, ou de l'extraction d'un fichier tar, ce qui introduit une sorte de "couche cachée" et rend le fichier Docker un peu plus difficile à comprendre.
</details>

## EXPOSE

Le drapeau Docker `EXPOSE` est utilisé pour informer Docker que le conteneur écoute sur les ports réseau spécifiés au moment de l'exécution. Essentiellement, il s'agit d'une sorte de documentation entre la personne qui construit l'image et la personne qui exécute le conteneur, sur les ports qui devraient être publiés au moment de l'exécution. 


La commande `EXPOSE`, cependant, ne publie pas (à elle seule) le port sur le réseau de la machine hôte - pour cela, vous avez besoin soit du drapeau `-p` avec `docker run`, soit de la directive `ports` dans `docker-compose yml`.

Voici comment l'utiliser :

```Dockerfile
EXPOSE 8080
```

Dans ce cas, `EXPOSE` indique que le conteneur Docker écoutera les requêtes réseau sur le port `8080`.


## VOLUME

La commande `VOLUME` est utilisée pour permettre l'accès de votre conteneur Docker à un répertoire sur la machine hôte. Une des raisons pour lesquelles vous pourriez vouloir utiliser cette commande est de stocker les données que votre application crée, afin qu'elles soient toujours disponibles après l'arrêt et le démarrage de votre conteneur.

Lorsqu'un fichier ou un répertoire est créé dans un conteneur Docker et qu'il ne fait pas partie d'un volume, ces données seront perdues dès que le conteneur sera arrêté. En utilisant `VOLUME`, vous pouvez vous assurer que cela n'arrive pas.

Voici comment l'ajouter à votre fichier Docker :

```Dockerfile
VOLUME /data
```
  
La commande ci-dessus crée un nouveau volume dans le conteneur Docker dans le répertoire /data.


## ARG

La commande `ARG` définit une variable que les utilisateurs peuvent passer au moment de la construction. Ce drapeau vous permet d'inclure des valeurs non codées en dur dans votre fichier Docker que vous ne voulez pas voir incluses dans l'image finale.

Voici comment vous pouvez l'utiliser :

```Dockerfile
ARG user
```


Dans cet exemple, pendant le processus de construction, vous pouvez passer différentes valeurs pour `user` en utilisant `--build-arg user=value`. Cela peut être utilisé pour définir des variables d'environnement qui sont disponibles pour les commandes `RUN` dans votre fichier Docker.


## ONBUILD

L'instruction `ONBUILD` dans Docker ajoute un trigger à une image qui sera activé lorsque cette image sera utilisée comme base pour un autre build. Cette instruction est utile si vous créez une image qui sera utilisée comme base pour la construction d'autres images.

Ce déclencheur sera activé à la fin du traitement du Dockerfile actuel et avant le traitement d'une instruction Dockerfile enfant.

Par exemple :

```Dockerfile
ONBUILD RUN make /app
```

Avec l'exemple ci-dessus, `make /app` sera déclenché lorsqu'une image qui utilise celle-ci comme base sera construite.

Ces drapeaux Docker sont des utilitaires puissants pour définir et contrôler le processus de construction de Docker et l'exécution des conteneurs. Ils offrent beaucoup de flexibilité et de contrôle dans vos flux de travail Docker.

[Exercices (EN)](/fr/docker/flags/exercice)