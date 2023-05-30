---
title: Tutoriel avec exercice - NestJS conf & santé
created: 2023-05-23
tags:
  - nestjs
  - nodejs
  - microservices
---

# Tutoriel guidé NestJS Conf & santé

## Prérequis

- Avoir terminé [ce tutoriel](/fr/microservices/2-connect-ms)
- Node.js (v18)
- NestJS CLI (`npm i -g @nestjs/cli`)

## Sommaire
1. [12-factor app](https://12factor.net/)
2. Configuration
4. Vérification de la santé

## Configuration
Le stockage de la configuration dans l'environnement d'une API est extrêmement utile dans une architecture de microservices pour plusieurs raisons :

1. Évolutivité : lors du déploiement d'un grand nombre de microservices, la gestion d'un système de gestion de configuration centralisé peut devenir difficile à échelle. En stockant la configuration dans l'environnement de chaque API, il est facile de les évoluer indépendamment sans affecter les autres services.

2. Cohérence : lorsque la configuration est stockée dans l'environnement, elle garantit que la configuration est cohérente dans toutes les instances du service. Les développeurs peuvent facilement mettre à jour la configuration en changeant simplement les variables d'environnement de l'API.

3. Sécurité : le stockage de la configuration dans l'environnement réduit les risques de sécurité car il élimine la nécessité de stocker des données de configuration sensibles dans le code ou les fichiers de configuration. Les variables d'environnement peuvent être gérées de manière sécurisée et chiffrée par le fournisseur d'hébergement.

4. DevOps : il permet aux DevOps de gérer et de déployer facilement des microservices de manière indépendante sans avoir besoin de coordonner avec les développeurs pour mettre à jour les fichiers de configuration.

En général, le stockage de la configuration dans l'environnement d'une API simplifie la gestion des microservices, réduit les risques d'erreurs de configuration et permet une meilleure évolutivité et sécurité.

Il est essentiel de détecter les erreurs de configuration tôt dans le processus de démarrage pour éviter les erreurs inattendues, les temps d'arrêt et les défaillances en cascade. Arrêter une API immédiatement après une erreur de configuration peut aider à assurer la cohérence de l'ensemble du système et à éviter les incohérences causées par une mauvaise configuration. Par conséquent, l'arrêt précoce d'une API de microservices en cas d'échec de la configuration est un concept crucial à considérer lors de la construction d'une architecture fiable et résiliente.

Voyons comment gérer la configuration dans une API NestJS. [Documentation NestJS](https://docs.nestjs.com/techniques/configuration#configuration)

### Configuration

Tout d'abord, installez le package "config":

```bash
$ npm i --save @nestjs/config
```

Ensuite, allez dans votre `app.module.ts` et ajoutez ce qui suit à la section import :

```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
	    ConfigModule.forRoot(),
	    // Autres modules
	],
	// ...
})
```

Maintenant, votre API est capable de lire les variables depuis l'environnement mais aussi depuis un fichier `.env`. Notez que l'environnement a la priorité si la même variable est définie dans les deux. 
Il est également important que le module de configuration soit chargé avant tout le reste.

Certaines variables d'environnement sont nécessaires pour que l'API fonctionne, tandis que d'autres sont facultatives. Nous pouvons définir les règles avec le package `joi`, alors installons-le :

```bash
$ npm install --save joi
```

Nous pouvons maintenant définir nos règles. Dans `config/env.ts`, ajouter la validation du schéma **Joi** :

```typescript
import * as Joi from 'joi';

export const envSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  PORT: Joi.number().default(4000),
});
```

L'import de Joi est comme ceci `import * as Joi from 'joi';` car `esModuleInterop` est par défaut défini sur false. S'il est défini sur true, modifiez cette ligne avec `import Joi from 'joi';`

Nous voulons avoir une chaîne de caractères pour l'URL de la base de données définie avant de démarrer notre application, et nous voulons que le port par défaut soit 4000. Disons à notre **configModule** d'utiliser ce schéma, donc retournez à `app.module.ts` et ajoutez ceci :

```typescript
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env'

@Module({
	imports: [
	    ConfigModule.forRoot({
	      ignoreEnvFile: process.env.NODE_ENV === 'production',
	      validationSchema: envSchema,
	    }),
	    // Autres modules
	],
	// ...
})
```

Nous ignorons le fichier `.env` en production et validons nos variables d'environnement avant tout le reste. Testons cela. Supprimez la variable DATABASE_URL de votre fichier `.env` si vous en avez un, et démarrez votre API. Vous devriez voir ceci :

```bash
$ npm start
// blabla erreur
Error: Config validation error: "DATABASE_URL" is required
```

### Usage

Pour utiliser notre configuration avec les valeurs par défaut et celles requises, nous devons injecter `ConfigService`. Il y a plusieurs façons de l'injecter en fonction de où vous vous trouvez (`main.ts`, `provider`, `function`...). Commençons par notre `port`. 

Allez dans votre `grpc.option.ts`. Nous devrons injecter le service de configuration et l'utiliser pour obtenir le port :

```typescript
import { ConfigService } from '@nestjs/config';

export const grpcConfig = (cs: ConfigService): GrpcOptions => 
	addReflectionToGrpcConfig({
	  transport: Transport.GRPC,
	  options: {
	    url: `0.0.0.0:${cs.get<number>(PORT)}`,
	    package: HERO_V1ALPHA_PACKAGE_NAME,
	    protoPath: join(__dirname, 'proto/hero/v1alpha/hero.proto'),
	  },
	});
```

Puisque nous avons mis à jour une variable en fonction, nous devons mettre à jour en conséquence notre fichier `main.ts` pour récupérer le service de configuration et l'utiliser pour composer nos options gRPC :

```typescript
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const cs = app.get(ConfigService);

	app.connectMicroservice(grpcConfig(cs));
	await app.startAllMicroservices();

	await app.listen(8888);
}
```

Ne vous inquiétez pas du port 8888 ; nous l'utiliserons plus tard pour l'URL de vérification de l'état (health check). 

Enfin, nous devons modifier le module de réflexion de `app.module.ts` pour utiliser le ConfigService :

```typescript
import { ConfigService } from '@nestjs/config';
import { envSchema } from './config/env'

@Module({
	imports: [
	    ConfigModule.forRoot({
	      ignoreEnvFile: process.env.NODE_ENV === 'production',
	      validationSchema: envSchema,
	    }),
		GrpcReflectionModule.registerAsync({
	      imports: [ConfigModule],
	      useFactory: (cs: ConfigService) => grpcConfig(cs),
	      inject: [ConfigService],
	    }),
	    // Autres modules
	],
	// ...
})
```

Ceci est la méthode d'enregistrement asynchrone, nous pouvons passer des options pour personnaliser l'initialisation de modules. Cette méthode d'enregistrement asynchrone est courante dans les modules NestJS.

---
### Exercice

Ajoutez une variable d'environnement `USER_PORT` de type chaîne de caractères et requise, puis utilisez-la dans (dans les options d') `grpc.option.ts` pour la variable `userGrpcOptions`. Modifiez en conséquence le service utilisateur (`user.service.ts`).

---

## Vérification de l'état (Health check)

Les points de terminaison de vérification de l'état sont importants pour l'architecture des microservices car ils permettent aux outils de surveillance et d'alerte de vérifier continuellement l'état de l'instance de service. Cela permet également d'identifier les défauts ou les sous-performances sans avoir à surveiller tous les points de terminaison possibles. Les points de terminaison de vérification de l'état fournissent des informations précieuses sur l'état du service, telles que la quantité de mémoire utilisée, le temps de disponibilité, les connexions actives, l'utilisation du processeur, etc., ce qui permet à son tour de détecter tout problème avec le service. Cela permet également de détecter et d'isoler rapidement les problèmes qui pourraient causer des problèmes dans un environnement multi-services. Cela permet de faciliter une remédiation rapide et assure que le service est hautement disponible, fiable et performant.

Voyons comment implémenter une route de vérification d'état dans notre API NestJS. [Documentation NestJS](https://docs.nestjs.com/recipes/terminus)

### Configuration

Commencez par installer le paquet nécessaire :

```bash
$ npm install --save @nestjs/terminus 
```

Ensuite, créez un module santé (health) :

```bash
$ nest g module health
$ nest g controller health
```

Dans le fichier `health/health.module.ts`, importez `terminus` :

```typescript
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

@Module({
	imports: [TerminusModule]
})
export class HealthModule {}
```

Et dans le contrôleur, ajoutez la structure terminus de base :

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
	) {}
	
	@Get()
	@HealthCheck()
	check() {
		return this.health.check([/** Nous placerons ici la liste des vérifications de l'état **/]);
	}
}
```

---
### Exercice

Consultez la documentation de NestJS et implémentez les vérifications sanitaires mémoire et disque.

---

### Indicateur personnalisé d'état de santé (Custom Health Indicator)

Pour Prisma, nous allons créer un indicateur personnalisé d'état de santé. Dans un nouveau fichier appelé `health/prisma.health.ts`, ajoutez ce qui suit :

```typescript
import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
	constructor(private readonly prismaService: PrismaService) {
		super();
	}
	
	async isHealthy(key: string): Promise<HealthIndicatorResult> {
		try {
			await this.prismaService.$queryRaw`SELECT 1`;
			return this.getStatus(key, true);
		} catch (e) {
			throw new HealthCheckError('Prisma check failed', e);
		}
	}
}
```

Comme vous pouvez le voir, cette vérification de l'état effectue une requête `SELECT 1` de base sur notre base de données Prisma pour s'assurer qu'elle est prête à être interrogée.

Ajoutons cette vérification à notre contrôleur santé :

```typescript
import { PrismaHealthIndicator } from './health.prisma';

// ...
	constructor(
		private health: HealthCheckService,
		private pHI: PrismaHealthIndicator,
	) {}
  
	@Get()
	@HealthCheck()
	check() {
		return this.health.check([() => this.pHI.isHealthy('prisma_health')]);
	}
// ...
```

N'oubliez pas de mettre à jour le fichier `health/health.module.ts` avec le fournisseur nécessaire :

```typescript
import { PrismaHealthIndicator } from './prisma.health';
import { PrismaService } from 'src/prisma.service';

@Module({
	imports: [TerminusModule],
	controllers: [HealthController],
	providers: [PrismaService, PrismaHealthIndicator],
})
export class HealthModule {}
```

Et voilà ! Pour le tester, démarrez l'application et interrogez la route santé avec curl :

```bash
$ npm start
$ curl http://localhost:8888/health
```

## Conclusion

Dans ce tutoriel guidé, nous avons abordé certains aspects importants de la construction d'une architecture de microservices avec NestJS. Nous avons commencé par discuter de la méthodologie de l'application en 12 facteurs et des avantages de stocker la configuration dans l'environnement. Nous avons vu comment gérer la configuration dans une API NestJS, notamment en mettant en place une validation de schéma Joi et en utilisant ConfigService pour accéder aux variables de configuration dans l'ensemble de l'application.

Ensuite, nous avons exploré l'importance des points de terminaison de vérification de l'état dans une architecture de microservices et implémenté une route d'état de base en utilisant la bibliothèque Terminus. Nous avons également créé un indicateur personnalisé d'état de santé pour Prisma et l'avons ajouté à notre point de terminaison de vérification de l'état.

Dans l'ensemble, nous avons couvert certains concepts et techniques essentiels pour la construction de microservices évolutifs, fiables et sécurisés avec NestJS. En suivant ces pratiques, vous pouvez vous assurer que votre architecture de microservices est bien conçue, efficace et facile à maintenir à long terme.