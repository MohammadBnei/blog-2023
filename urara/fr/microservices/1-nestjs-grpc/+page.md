---
title: Tutoriel avec exercice - Serveur NestJS gRPC
created: 2023-05-21
tags:
  - nestjs
  - nodejs
  - gRPC
  - microservices
---

Dans ce tutoriel, nous allons construire un service gRPC en NestJS, implémentant des opérations CRUD pour une entité Héro.

## Prérequis

- Node.js avec npm installé.
- Compréhension de base de NestJS, gRPC, et protobuf.

## Mise en route

Nous commençons par mettre en place un nouveau projet NestJS:

```bash
$ npx @nestjs/cli new nestjs-grpc-tutorial
$ cd nestjs-grpc-tutorial
```

Ensuite, nous ajoutons les dépendances gRPC et protobuf:

```bash
$ npm i @nestjs/microservices @grpc/grpc-js @grpc/proto-loader nestjs-grpc-reflection
```

## Protobuf d'Héros

Créez un fichier `hero/v1alpha/hero.proto` dans le dossier `/proto` à la racine du projet.

Dans ce fichier, nous allons mettre en place notre interface pour gRPC :
```protobuf
syntax = "proto3";

package hero.v1alpha;

message Hero {
  string name = 1;
  int32 id = 2;
  int32 power = 3;
  int32 hp = 4;
}

service HeroCRUDService {
  rpc Get (GetRequest) returns (GetResponse);
  rpc Add (AddRequest) returns (AddResponse);
  rpc Update (UpdateRequest) returns (UpdateResponse);
  rpc Delete (DeleteRequest) returns (DeleteResponse);
}

message GetRequest {
  string name = 1;
  int32 id = 2;
}

message GetResponse {
  repeated Hero heroes = 1;
}

message AddRequest {
  string name = 1;
  int32 power = 2;
}

message AddResponse {
  Hero hero = 1;
}
```

----

### Exercice

Ajouter le reste des messages (`UpdateRequest`,` UpdateResponse`, `DeleteRequest`, `DeleteResponse`)

----

Ensuite, suivez les étapes [ici](/fr/microservices/generate-proto) pour générer les stubs et exporter le fichier proto dans votre API.

Vous devriez voir un dossier `stubs` et `proto` à l'intérieur de votre dossier `src`.


## Configuration de Prisma

Nous installerons également l'ORM Prisma pour la gestion de la base de données:

```bash
$ npm i prisma
$ npx prisma init
```

Cette commande devrait créer un dossier `prisma` et un fichier `.env`. Dans le fichier `.env`, changez `DATABASE_URL` avec la valeur `mysql://root:password@localhost:3306/hero`.

Pour démarrer la base de données, exécutez la commande suivante :
```sh
$ docker compose up -d mariadb
```

Nous utiliserons Prisma pour définir notre entité Héro. Créez un fichier `prisma/schema.prisma` avec le contenu suivant :

```prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["tracing"]
}

datasource db {
  provider = "mysql"
  url      = env("MYSQL_URL")
}

model Hero {
  id        Int    @id @default(autoincrement())
}
```

----
### Exercice

Dans le fichier `prisma/schema.prisma`, ajoutez au modèle `héro` les champs qui sont dans le message `Hero.proto`.

----

Enfin, exécutez `npx prisma migrate dev` pour importer le schéma dans la base de données SQL et générer les clients Prisma.


## Implémentation du service

Nous commençons par créer un `PrismaService` qui étend la classe `PrismaClient` générée de `@prisma/client`. Nous l'utiliserons pour accéder à la base de données et effectuer les opérations CRUD sur l'entité Héro.

```typescript
// Nom de fichier : prisma.service.ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

Nous créerons un `AppService` qui injecte le `PrismaService`. Ce service aura des méthodes pour chaque opération CRUD définie dans le fichier `.proto`.

```typescript
// Nom de fichier : app.service.ts
import { Injectable } from '@nestjs/common';
import { Hero } from './stubs/hero/v1alpha/hero';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  create(data: Prisma.HeroCreateInput): Promise<Hero> {
    return this.prisma.hero.create({ data });
  }

  findAll(): Promise<Hero[]> {
    return this.prisma.hero.findMany();
  }

  delete(id: number): Promise<Hero> {
    return this.prisma.hero.delete({
      where: { id },
    });
  }
}
```

----
### Exercice

Implémentez les fonctions suivantes dans le service :
- `findById(id: number): Promise<Hero>`
- `findByName(name: string): Promise<Hero>`
- `async update(id: number, data: Prisma.HeroUpdateInput): Promise<Hero>`
----


Nous créerons un `AppController` qui implémente l'interface `HeroCRUDServiceController` définie dans le fichier `.proto`. Ce contrôleur utilisera le `AppService` pour effectuer des opérations CRUD sur les Héros.

```typescript
// Nom de fichier : app.controller.ts
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  AddRequest,
  AddResponse,
  DeleteRequest,
  DeleteResponse,
  GetRequest,
  GetResponse,
  HERO_CR_UD_SERVICE_NAME,
  Hero,
  HeroCRUDServiceController,
  UpdateRequest,
  UpdateResponse,
  HeroCRUDServiceControllerMethods,
} from './stubs/hero/v1alpha/hero';
import { GrpcMethod } from '@nestjs/microservices';
import { Metadata } from '@grpc/grpc-js';

@Controller()
@HeroCRUDServiceControllerMethods()
export class AppController implements HeroCRUDServiceController {
  constructor(private readonly appService: AppService) {}
  async get(request: GetRequest, metadata?: Metadata): Promise<GetResponse> {
    let hero: Hero;
    let heroes: Hero[] = [];

    if (request.id) {
      hero = await this.appService.findById(request.id);
      return { heroes: [hero] };
    } else if (request.name) {
      hero = await this.appService.findByName(request.name);
      return { heroes: [hero] };
    } else {
      heroes = await this.appService.findAll();
      return { heroes };
    }
  }
  async update(
    request: UpdateRequest,
    metadata?: Metadata,
  ): Promise<UpdateResponse> {}

  async delete(
    request: DeleteRequest,
    metadata?: Metadata,
  ): Promise<DeleteResponse> {}

  async add(request: AddRequest): Promise<AddResponse> {}
}
```

----
### Exercice

Implémenter les fonctions vides :
- update
- delete
- add
----


## Configuration gRPC

Nous allons configurer NestJS pour démarrer un nouveau serveur gRPC et écouter les connexions entrantes. Nous utiliserons l'interface `GrpcOptions` de `@nestjs/microservices` pour définir la configuration du serveur.

```typescript
// Nom de fichier : grpc.config.ts
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { HERO_V1ALPHA_PACKAGE_NAME } from './stubs/hero/v1alpha/hero';
import { join } from 'path';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';

export const grpcConfig = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:6000',
    package: HERO_V1ALPHA_PACKAGE_NAME,
    protoPath: join(__dirname, 'proto/hero/v1alpha/hero.proto'),
  },
}) as GrpcOptions;
```

Ces options sont obligatoires dans NestJS, alors que le package grpc-reflection est un exemple pour postman.

## Démarrage du serveur gRPC

Nous allons maintenant démarrer le serveur gRPC dans le fichier `main.ts` en utilisant la méthode `NestFactory.createMicroservice` et en lui passant le `grpcConfig` que nous venons de définir.

```typescript
// Nom de fichier : main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcConfig } from './grpc.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    grpcConfig,
  );

  await app.listen();
}
bootstrap();
```

## Ajout de la réflexion gRPC

Nous pouvons ajouter la réflexion gRPC à notre serveur pour tester facilement notre API avec des outils tels que `evans` et `bloomrpc`. Nous le ferons en important et en enregistrant le module `GrpcReflectionModule` de `nestjs-grpc-reflection`.

```typescript
// Nom de fichier : app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { grpcConfig } from './grpc.config';
import { PrismaService } from './prisma.service';

@Module({
  imports: [GrpcReflectionModule.register(grpcConfig)],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
```

## Tester l'API

Nous pouvons maintenant tester notre API à l'aide de Postman.

## Conclusion

Dans ce tutoriel, nous avons vu comment construire un service gRPC dans NestJS en utilisant le package `@nestjs/microservices`, et comment utiliser Prisma pour gérer notre base de données Hero.