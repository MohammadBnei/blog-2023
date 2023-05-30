---
title: Observabilité
créé: 2023-05-25
tags:
  - nestjs
  - microservices
  - observabilité
  - jaeger
---

Pour comprendre ce qui se passe dans notre microcosme de microservices, nous avons besoin d'implémenter l'observabilité. Il y a 3 types d'éléments que nous voulons observer :
 - **Tracing**. Cela est utile pour voir l'architecture globale en suivant les requêtes d'un API à l'autre. Nous pouvons alors créer des schémas et des diagrammes en temps réel.
 - **Metrics**. Comment nos APIs se comportent-elles ? Où sont les goulets d'étranglement ? Il est utile d'avoir des métriques pour la performance, bien sûr, et pour comprendre où nous devrions concentrer nos efforts.
 - **Logging**

Il y a un consensus maintenant dans le monde des microservices pour utiliser [**OpenTelemetry**](https://opentelemetry.io/docs/). Le but est de lier tous les éléments précédemment définis, et d'extraire le maximum d'informations à partir d'eux.  

## Open Telemetry

OpenTelemetry est un framework open source populaire pour le tracing distribué, les métriques et le logging. Il fournit une façon standardisée de collecter des données d'observabilité à partir de différents systèmes et services et de les exporter vers différents backends tels que Jaeger, Prometheus, et AWS X-Ray. 

OpenTelemetry offre également une prise en charge de différents langages de programmation (notamment Node.js, Java, Go, Python, et plus encore) et permet la personnalisation et la flexibilité en termes de ce qui est collecté, comment il est traité et où il est exporté.

En outre, OpenTelemetry est conçu pour être indépendant du vendeur et interopérable, permettant une intégration facile avec d'autres outils et frameworks d'observabilité. Il gagne en popularité dans la communauté des microservices en tant que solution d'observabilité puissante et flexible.

### Traces & Span

Les span et les traces sont des concepts clés du tracing distribué, qui est un pilier clé de l'observabilité dans les microservices.

Dans un système distribué, une seule demande d'utilisateur implique généralement plusieurs appels de service à travers différents nœuds et services. Chacune de ces interactions est appelée un span, qui représente une seule unité de travail dans le service. 

Les traces sont une collection de spans qui représentent le chemin complet d'une demande d'utilisateur à travers le système. En d'autres termes, une trace est une séquence de spans qui montrent comment la demande est passée à travers les différents services impliqués.

De manière conceptuelle, on peut considérer une trace comme une séquence d'étapes qui représentent l'exécution d'une demande d'utilisateur du début à la fin. Chaque étape (ou span) capture des informations sur le travail qui a été effectué, telles que le service qui a été appelé, le temps qu'il a fallu, toutes les erreurs survenues, etc.

Pour capturer ces informations, chaque span inclut généralement un ID qui le relie au reste de la trace, des horodatages de début et de fin, des métadonnées sur l'appel de service (comme l'URL et la méthode HTTP), et un ensemble d'attributs (comme le résultat de l'appel et les messages d'erreur).

Les traces et les spans sont des composants importants de l'observabilité car ils fournissent un moyen de suivre une demande d'utilisateur à travers plusieurs services, de comprendre comment elle se comporte, et de diagnostiquer les erreurs ou les problèmes de performance. En analysant les traces et les spans, nous pouvons identifier les goulets d'étranglement, optimiser les performances, et améliorer la fiabilité globale de notre système.

## NestJS

Il existe un ensemble de packages pour ajouter automatiquement opentelemtry à toutes les applications NestJS. 

Ils commencent tous par '@opentelemetry', et s'injectent dans les processus rest/gRPC/GraphQL. C'est pourquoi ils doivent être appelés avant tout le reste.

Vous pouvez consulter le fichier de tracing [task-api tracing](https://github.com/MohammadBnei/grpc-task-manager/blob/main/auth-api/src/config/tracing.ts) pour avoir un exemple. Ici, nous n'implémentons que l'exportation de tracés et l'injection de traces de logging.

Ainsi, lorsque nos APIs communiquent entre elles, les appels sont enregistrés et envoyés à un collecteur. Ce collecteur est responsable de la compréhension des informations, de la liaison des demandes ensemble (de l'expéditeur d'origine à la réponse finale, en traçant les sauts entre les APIs) et de nous montrer le résultat sous différentes formes (diagrammes, schémas, calendrier...).

Dans notre cas, nous utilisons [Jaeger](https://www.jaegertracing.io) pour cela.

## Ajout de l'Observabilité OpenTelemetry à une API NestJS gRPC

L'observabilité est essentielle pour tout système logiciel, et ajouter l'observabilité OpenTelemetry à une API NestJS gRPC peut considérablement aider dans cette tâche. OpenTelemetry fournit un framework open source indépendant du vendeur pour collecter, traiter et exporter des données de télémétrie à partir de systèmes distribués. Dans ce tutoriel, nous allons apprendre comment ajouter l'observabilité OpenTelemetry à une API NestJS gRPC en utilisant le SDK OpenTelemetry Node.js.

### Prérequis
- Node.js 12 ou version ultérieure installé sur votre machine
- Connaissance de base de NestJS et gRPC

### Étape 1 : Installer les dépendances
Tout d'abord, nous devons installer les packages suivants :
```shell
$ npm i @opentelemetry/sdk-trace-base @opentelemetry/sdk-trace-node @opentelemetry/sdk-metrics @opentelemetry/exporter-trace-otlp-proto @opentelemetry/instrumentation-grpc @opentelemetry/instrumentation-winston @opentelemetry/semantic-conventions
```
Ces packages sont nécessaires pour ajouter l'observabilité OpenTelemetry à l'API NestJS gRPC.

### Étape 2 : Ajouter le tracing OpenTelemetry à l'application NestJS
Dans le fichier `tracing.ts`, nous définissons le `NodeTracerProvider` avec une resource qui identifie le nom et la version de notre service. De plus, nous ajoutons le `SimpleSpanProcessor` et l'`OTLPTraceExporter` pour envoyer nos données de traçage au backend Jaeger qui s'exécute sur `http://localhost:4318/v1/traces`. Nous ajoutons également l'instrumentation pour Winston et gRPC via la méthode `registerInstrumentations()` fournie par le SDK OpenTelemetry. 

```typescript
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
```
Cette section importe les modules nécessaires de la bibliothèque OpenTelemetry. Ils comprennent les classes `SimpleSpanProcessor` et` NodeTracerProvider`, qui sont utilisées pour configurer le tracing ;et les classes `GrpcInstrumentation` et `WinstonInstrumentation`, qui sont utilisées pour instrumenter automatiquement gRPC et Winston. 

Ensuite, nous créons une instance `OTLPTraceExporter` pour envoyer nos données de traçage vers le backend Jaeger s'exécutant sur `http://localhost: 4318/v1 /traces`. Nous créons ensuite une instance `SimpleSpanProcessor` avec l'exportateur, que nous ajoutons au fournisseur de traceur à l'aide de la méthode `addSpanProcessor`. Enfin, nous enregistrons le fournisseur à l'aide de la méthode `register`.

L'exportateur de trace OTLP est un format d'export conventionnel. Nous utilisons le point de terminaison REST, mais un point de terminaison gRPC existe également. L'exportateur est l'endroit où les spans seront envoyées, et nous utilisons Jaeger comme collecteur.

Vous pouvez ajouter d'autres ressources pour fournir plus d'informations sur chaque span. 

```ts
// Register instrumentations for gRPC and Winston
registerInstrumentations({
  instrumentations: [
    new GrpcInstrumentation(),
    new WinstonInstrumentation(),
  ],
});
```

Cette section enregistre des instrumentations pour gRPC et Winston. Nous utilisons `registerInstrumentations` pour enregistrer les instrumentations afin de tracer automatiquement ces libraries dans notre application.

C'est tout ! Ce code met en place le traçage OpenTelemetry dans notre application NestJS en utilisant Node.js, qui enverra les données tracées de notre application vers le backend Jaeger.

### Étape 3: Mettre à jour le fichier `main.ts`
Au tout début du fichier `main.ts`, importez le fichier `tracing.ts`. 

### Étape 4: Démarrer le collecteur Jaeger
Dans `compose.yml`, il y a un service de traçage. Nous utilisons Jaeger pour collecter et visualiser les traces. 
Démarrez ce service :
```shell
$ docker compose up -d tracing
```

### Étape 5: Démarrer l'API
Lancez votre API, puis effectuez quelques requêtes depuis Postman. Ensuite, rendez-vous sur http://localhost:16686 pour accéder à l'interface utilisateur du collecteur. Vous devriez voir le nom de votre API dans le menu déroulant "service".


### Étape 6: Ajout d'instrumentation
Consultez [ici](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node) la liste complète des instrumentation Node.js. Choisissez celui correspondant à votre base de données et ajoutez-le au fichier `tracing.ts`.

### Conclusion
L'ajout de l'observabilité OpenTelemetry à une API NestJS gRPC est une tâche essentielle. Dans ce tutoriel, nous avons appris comment configurer le traçage OpenTelemetry avec NestJS et gRPC en utilisant le SDK Node.js OpenTelemetry et le backend Jaeger. Avec cette configuration, nous pouvons obtenir une meilleure compréhension de notre API NestJS gRPC et améliorer les performances et la fiabilité globales.