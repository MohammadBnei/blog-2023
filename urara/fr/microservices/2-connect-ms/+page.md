---
title: Tutoriel avec exercice - Connexion gRPC avec NestJS
created: 2023-05-22
tags:
  - nestjs
  - nodejs
  - gRPC
  - microservices
---

gRPC est un protocole léger et performant permettant de construire des systèmes distribués, et NestJS est un framework Node.js progressif pour la construction d'applications web rapides, efficaces et maintenables. En intégrant gRPC avec NestJS, nous pouvons créer des microservices qui peuvent communiquer entre eux de manière efficace. Dans ce tutoriel, nous verrons comment implémenter un client gRPC dans NestJS.

## Prérequis

Avant de procéder au tutoriel, nous devons installer les éléments suivants :

- Node.js (version 12 ou supérieure)
- NestJS CLI (`npm i -g @nestjs/cli`)
- Avoir terminé [ce tutoriel](/fr/microservices/1-nestjs-grpc)

## Étape 1 - Créer un module NestJS pour UserService

Tout d'abord, nous devons créer un module NestJS pour UserService. Cela peut être fait en utilisant NestJS CLI en exécutant :

```bash
$ nest g module user
```

Cette commande va créer un nouveau module appelé "user" dans le répertoire `src`.

Ensuite, initialisons un service dans le module utilisateur :
```bash
$ nest g service user
```

Vous devriez voir que le fichier `user.module.ts` a été modifié avec le service et que le fichier `app.module.ts` importe le module utilisateur.

## Étape 2 - Créer un client gRPC

Pour créer un client gRPC dans NestJS, nous devons créer un service qui communiquera avec le serveur gRPC. Ce service doit implémenter l'interface `OnModuleInit` pour initialiser la connexion client.

Voici un exemple d'implémentation d'un service client gRPC :

```typescript
// Nom de fichier : user/user.service.ts
import { OnModuleInit } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { FindRequest, FindResponse, User } from '../stubs/user/v1alpha/message';
import {
  USER_SERVICE_NAME,
  UserServiceClient,
} from '../stubs/user/v1alpha/service';
import { firstValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  async findUser(req: FindRequest, md: Record<string, any>): Promise<User> {
    const meta = new Metadata();
    Object.entries(md).map(([k, v]) => meta.add(k, v));
    const res: FindResponse = await firstValueFrom(
      this.userService.find(req, meta) as any,
    );

    return res.user?.[0];
  }
}
```

Vous pouvez voir l'objet `meta` ? Il sera utilisé pour passer des données d'en-tête à l'API utilisateur. **Nous devons passer un token JWT à la méthode find de l'utilisateur car elle est protégée par une authentification.**

## Étape 3 - Exporter UserService dans le module

Nous devons exporter le `UserService` créé dans le module utilisateur afin de pouvoir l'injecter dans d'autres parties de l'application. Pour cela, ajoutez le code suivant dans le fichier `user.module.ts` :

```typescript
// Nom de fichier : user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CLIENT_GRPC_OPTIONS } from '@nestjs/microservices';

@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```


## Étape 4 - Injecter les options du client gRPC

Vous pouvez voir dans le service utilisateur que nous utilisons le `@Inject(USER_SERVICE_NAME)`. Ce décorateur indique à NestJS d'injecter la dépendance dans notre variable `client`. Mais ce n'est pas de la magie, nous devons dire à Nest où trouver cette dépendance !

Cette partie concerne la configuration de la connexion à l'API utilisateur. Allez dans votre fichier `grpc.config.ts` et ajoutez ceci :
```typescript
// Imports
import {
  ClientProviderOptions,
  GrpcOptions,
  Transport,
} from '@nestjs/microservices';
import {
  USER_SERVICE_NAME,
  USER_V1ALPHA_PACKAGE_NAME,
} from './stubs/user/v1alpha/service';
import { ChannelCredentials } from '@grpc/grpc-js';

export const userGrpcOptions: ClientProviderOptions = {
  name: USER_SERVICE_NAME,
  transport: Transport.GRPC,
  options: {
    url: '<USER_API_URL>',
    package: USER_V1ALPHA_PACKAGE_NAME,
    loader: {
      includeDirs: [join(__dirname, './proto')],
    },
    protoPath: [join(__dirname, './proto/user/v1alpha/service.proto')],
    credentials: ChannelCredentials.createInsecure(),
  },
};
```

L'option "name" est celle qui sera utilisée par Nest pour résoudre la dépendance. Enfin, cette option gRPC doit être transmise à un `ClientModule`, qui est une abstraction de Nest pour la connexion à des services externes. Revenez au fichier `user.module.ts` et ajoutez ceci :
```typescript
// Nom de fichier : user.module.ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CLIENT_GRPC_OPTIONS } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([userGrpcOptions])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

À partir de cet enregistrement du module client, NestJS liera tout ensemble, des options gRPC aux méthodes du service utilisateur.

## Exercice

Maintenant que notre API utilisateur est prête à être appelée, notre héros peut être affecté à un utilisateur :
1. Modifiez le message héros dans le fichier proto pour ajouter un `user_id`
2. Régénérez les stubs et mettez à jour le proto
3. Ajoutez l'`user_id` dans le schéma Prisma
4. Lancez une migration
5. Lorsqu'un héros est créé, vérifiez si l'utilisateur existe. Sinon, générez une erreur.
   1. Pour cela, vous aurez besoin de faire tourner l'ensemble de la stack et de faire apparaître le port. Modifiez le fichier `compose/compose.published.yml` en décommentant le mappage de port de chaque API. Passez tous les flags d'insécurité à true.
   2. Pour générer un JWT, vous pouvez utiliser Postman et la route de connexion. Chaque token est valide pendant 5 minutes, mais vous obtiendrez un JWT pour en régénérer un nouveau. 
   3. Ajoutez le JWT dans les métadonnées 'Authorization', avec l'interpolation suivante : `Bearer <JWT>`
6. N'oubliez pas de mettre l'URL utilisateur correcte dans `grpc.config.ts`.

## Conclusion

Ce tutoriel montre comment implémenter un client gRPC dans NestJS pour communiquer avec un serveur gRPC. gRPC fournit un mécanisme rapide, efficace et sûr pour la communication entre différents services, et NestJS fournit un cadre flexible et évolutif pour le développement d'applications Node.js. La combinaison de ces deux technologies peut nous aider à construire des architectures robustes basées sur des microservices.