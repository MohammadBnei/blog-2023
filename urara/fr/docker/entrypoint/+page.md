---
titre : Entrypoint Docker
créé : 2023-07-22
tags :
  - docker
  - cours
---

# Dockerfile ENTRYPOINT et CMD expliqués

Avant de plonger dans les différences entre les instructions `ENTRYPOINT` et `CMD` dans un Dockerfile, il est important de comprendre ce que chacune de ces instructions fait réellement.

Les directives ENTRYPOINT et CMD dans un fichier Docker servent à définir la commande et les paramètres par défaut qui doivent être exécutés lorsqu'un conteneur est lancé à partir de l'image Docker résultante. Ces instructions nous permettent de définir le comportement par défaut d'un conteneur.

- **ENTRYPOINT** : Cette instruction de Dockerfile vous permet de configurer un conteneur qui peut être exécuté en tant qu'exécutable. En substance, ENTRYPOINT est la commande qui est exécutée lorsqu'un conteneur Docker démarre. 

- **CMD** : L'instruction CMD fournit des valeurs par défaut pour un conteneur en cours d'exécution. Elle peut inclure un exécutable ou l'omettre, auquel cas l'instruction ENTRYPOINT doit être spécifiée. CMD vous permet de définir une commande et des paramètres par défaut qui peuvent être remplacés à partir de la ligne de commande lors de l'exécution du conteneur Docker.

Considérez-les comme le point de départ de l'exécution de votre conteneur.

Dans les sections suivantes, nous allons explorer ENTRYPOINT et CMD plus en détail, en discutant des différences subtiles, de la façon dont ils interagissent les uns avec les autres, et de leur fonctionnement en conjonction avec la commande docker run.

## Comprendre ENTRYPOINT

L'instruction `ENTRYPOINT` dans un fichier Docker définit la commande et les paramètres qui seront exécutés en premier lors de l'exécution d'un conteneur. Cette commande ne sera pas ignorée, même si des arguments sont passés pendant la commande `docker run`. 

Le `ENTRYPOINT` peut être vu comme la commande principale ou le but de votre image docker. Par exemple, si vous avez créé une image docker pour une application Python, le `ENTRYPOINT` serait `python app.py` puisque cette commande représente essentiellement le but de l'image.

## Comprendre CMD

D'autre part, `CMD` dans un fichier Docker fournit des valeurs par défaut pour l'exécution d'un conteneur Docker. Ces valeurs par défaut peuvent inclure un exécutable ou peuvent omettre l'exécutable, auquel cas vous devez également spécifier une instruction `ENTRYPOINT`.

`CMD` est utilisé pour tous les arguments qui sont censés être facilement remplacés. Il est important de se rappeler que si `CMD` est utilisé pour fournir des arguments par défaut pour l'instruction `ENTRYPOINT`, `CMD` et `ENTRYPOINT` doivent être indiqués dans le format de tableau JSON.

## Différences entre ENTRYPOINT et CMD

Maintenant que nous comprenons les rôles individuels de `ENTRYPOINT` et `CMD`, plongeons dans leurs différences.

Dans un fichier Docker, les instructions `ENTRYPOINT` et `CMD` sont utilisées pour spécifier les commandes qui doivent être exécutées quand un conteneur Docker est lancé. Cependant, la façon dont elles sont écrites a certaines implications.

La syntaxe des deux commandes peut être soit une forme shell, soit une forme exec. La forme shell n'inclut pas de crochets, tandis que la forme exec utilise des crochets.

<details class="ml-4">
<summary class="font-bold cursor-pointer -ml-4">Plus d'informations sur les formes shell et exec</summary>
Dans les instructions ENTRYPOINT et CMD de Docker, deux formes peuvent être utilisées - la forme Shell ou la forme Exec.

- **Forme Shell** :

  La forme shell est spécifiée sans l'utilisation de crochets. Elle utilise l'interpréteur de commandes pour exécuter la commande, ce qui se traduit par `/bin/sh -c votre_commande`. Cette forme initie un nouveau processus shell, qui est légèrement plus gourmand en ressources que la forme exec.

  Dans Docker, la forme ENTRYPOINT du shell pourrait être comme `ENTRYPOINT command param1 param2` et la forme CMD du shell serait `CMD command param1 param2`.

  Par exemple, la forme de l'interprète de commandes CMD serait `CMD command param1 param2` :
  ```
  ENTRYPOINT echo "Bonjour, le monde !"
  CMD echo "Bienvenue dans le monde Docker !"
  ```

- **Exec Form** :

  Le formulaire exec est spécifié en utilisant la syntaxe des tableaux JSON (c'est-à-dire qu'il utilise des crochets). Cette forme n'initie pas un nouveau processus shell et est exécutée directement. Elle est donc légèrement plus efficace en termes d'utilisation des ressources. 

  Dans Docker, les formes d'exécution ENTRYPOINT et CMD sont les suivantes : `ENTRYPOINT ["executable", "param1", "param2"]` et `CMD ["executable", "param1", "param2"]`. 

  Par exemple :
  ```
  ENTRYPOINT ["echo", "Hello, World !"]
  CMD ["echo", "Welcome to the Docker World !"]
  ```

Dans la plupart des cas, lorsque vous utilisez CMD, il est souvent plus avantageux d'utiliser la forme Exec car elle permet de gérer les signaux. L'application que vous exécutez recevra directement les signaux Unix. En règle générale, lorsque vous utilisez ENTRYPOINT, la forme Exec doit également être utilisée, sinon la gestion des signaux ne fonctionne pas correctement, car seul le processus de l'interpréteur de commandes est interrompu. 

<details class="ml-4">
<summary class="font-bold cursor-pointer -ml-4">Plus d'informations sur les signaux</summary>
Parlons un peu des signaux Unix. Les signaux Unix sont des interruptions logicielles qui permettent de gérer des événements asynchrones. Il s'agit d'une forme de communication entre les processus, permettant à un processus d'être notifié d'événements tels que les demandes de terminaison (SIGTERM), les interruptions clavier (SIGINT) et bien d'autres.

Lorsque vous démarrez un conteneur Docker, il démarre un processus unique spécifié par le CMD ou l'ENTRYPOINT. Ce processus unique à l'intérieur du conteneur Docker se voit attribuer un PID (Process ID) de 1 et tous les signaux Unix que Docker reçoit seront transmis à ce processus PID 1. Ceci est particulièrement important lors de l'arrêt d'un conteneur car Docker enverra un signal SIGTERM, et après une période de grâce, un SIGKILL pour arrêter le processus.

- **CMD et signaux** : Si vous utilisez la forme shell de CMD, comme `CMD command param1 param2`, alors Docker démarre un shell (`/bin/sh -c`) en tant que PID 1 et exécute la commande à l'intérieur de ce shell. Le shell ne transmet pas de signaux à la commande. Ainsi, si Docker envoie un signal SIGTERM, il atteint l'interpréteur de commandes mais pas votre commande.

- **ENTRYPOINT et signaux** : La même logique s'applique à la commande ENTRYPOINT. Lorsque vous utilisez la forme shell `ENTRYPOINT command param1 param2`, le signal SIGTERM terminera seulement le shell mais ne terminera pas le processus à l'intérieur du shell.

Cela explique pourquoi la gestion des signaux ne fonctionne pas correctement lorsque la forme shell de CMD ou ENTRYPOINT est utilisée dans un fichier Docker.

Cependant, lorsque la forme Exec de CMD ou ENTRYPOINT est utilisée, c'est-à-dire `CMD ["executable", "param1", "param2"]` ou `ENTRYPOINT ["executable", "param1", "param2"]`, Docker peut directement exécuter la commande sans impliquer un shell, et donc, le processus démarré avec le PID 1 est la commande elle-même et non le shell. Dans ce cas, les signaux Unix tels que SIGTERM sont transmis directement à l'application, ce qui lui permet de s'arrêter de manière élégante.

Par conséquent, à moins qu'il n'y ait un besoin spécifique d'utiliser la forme Shell, il est recommandé d'utiliser la forme Exec de CMD et ENTRYPOINT dans Docker, car elle garantit une gestion correcte des signaux et un arrêt gracieux des conteneurs.
</details>

Veuillez noter que les paramètres CMD dans la forme exec seront généralement utilisés comme paramètres supplémentaires dans la commande ENTRYPOINT si ENTRYPOINT est spécifié.
</details>

Lorsque la commande et les arguments sont spécifiés sans crochets `[]`, ils sont traités via `/bin/sh -c`.

1. Commande `ENTRYPOINT`

       `CMD arg1 arg2`

   A moins que la commande ne soit un exécutable binaire, elle sera exécutée via l'interpréteur de commandes.

2. `ENTRYPOINT ['command']`

       `CMD ['arg1', 'arg2']`

   Il exigera le chemin complet vers le binaire à moins qu'il n'existe dans le `PATH` et ne permet pas les fonctionnalités de l'interpréteur de commandes comme la substitution de variables et les jokers.

De plus, il est important de noter que `CMD` fournira des arguments à `ENTRYPOINT` et ceux-ci seront écrasés si le conteneur docker est exécuté avec d'autres arguments de ligne de commande.

Par exemple, `docker run -it
`docker run -it <image> /bin/bash`

Dans cette commande, `/bin/bash` remplacera `['arg1', 'arg2']` dans `CMD`.

[Exercices (EN)](/docker/entrypoint/exercice)
