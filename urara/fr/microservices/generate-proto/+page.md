---
title: Comment générer les stubs
created: 2023-05-23
tags:
  - nestjs
  - gRPC
  - microservices
  - protobuf
  - buf
---

# Générer des stubs Protobuf

Dans ce projet, il y a un dossier dédié nommé "proto" qui contient toutes les définitions protobuf. Nous utilisons [buf](https://buf.build/) pour gérer les actifs IDL (Interface Definition Language).

## buf.gen.yaml

Ce fichier est l'endroit où la magie buf se produit. Vous pouvez définir l'utilisation d'un plugin, les options et le répertoire de sortie pour générer les stubs dans :
```yaml
version: v1
managed:
  enabled: true
plugins:
  # Ici, vous pouvez définir le plugin, qui générera des stubs dans le langage de votre choix
  - plugin: buf.build/community/stephenh-ts-proto
  # Spécifiez le répertoire de sortie, où les stubs .ts seront générés
    out: ../auth-api/src/stubs
  # Spécifiez des options pour les plugins
    opt:
      - addGrpcMetadata=true
      - nestJs=true
```

Le fichier buf.gen.yaml est utilisé par la commande suivante :
```bash
buf generate
```

## Exporter des fichiers proto

Pour les API nestjs gRPC, il est nécessaire d'inclure les fichiers proto dans le dossier "src". Pour ce faire, nous pouvons utiliser la commande buf export à partir du dossier "proto" :
```bash
buf export . --output ../auth-api/src/proto
```

Cela exportera tous les fichiers proto vers le répertoire spécifié (dans ce cas-ci, "auth-api/src/proto").

## Script

Pour plus de commodité, il y a un script qui met à jour les stubs et les fichiers protobuf. Il s'agit de "export.sh", et il est placé dans le dossier "proto".

Pour ajouter votre API à la liste, ajoutez simplement la ligne suivante à la fin du fichier :
```sh
buf export . --output ../$ YOUR_API_FOLDER/src/proto
```

Ensuite, vous pouvez l'exécuter comme ceci (**depuis le dossier "proto" !**):
```sh
./export.sh
```

## Étapes

1. Ajoutez votre plugin, dossier de sortie (out) et options dans **buf.gen.yaml**
2. Ajoutez l'export vers votre dossier API dans **export.sh**
3. Exécutez **./export.sh** chaque fois que vous apportez une modification à votre fichier proto.