---
titre: Front-end avec SvelteKit
créé: 2023-05-26
tags:
  - sveltekit
  - nodejs
  - microservices
---

## SSR

SSR signifie Server-Side Rendering. Il s'agit d'un processus par lequel un serveur génère une page HTML pour un site web ou une application, qui est ensuite envoyée au navigateur de l'utilisateur pour affichage. SSR permet aux robots d'exploration des moteurs de recherche d'indexer les pages d'un site web, améliorant ainsi sa visibilité dans les pages de résultats des moteurs de recherche. Il permet également des temps de chargement plus rapides et de meilleures performances sur des connexions Internet lentes ou peu fiables. SSR est couramment utilisé dans les piles et les frameworks de développement web modernes, tels que ReactJS et VueJS, pour fournir une meilleure expérience utilisateur.

L'implémentation SSR de [Svelte](https://svelte.dev/) s'appelle [SvelteKit](https://kit.svelte.dev/docs/introduction).

## SvelteKit

### Côté Serveur 

Dans SvelteKit, la partie serveur est responsable de la gestion des demandes HTTP et de la génération des réponses. Cela comprend le rendu côté serveur (SSR), les routes API et la distribution de fichiers statiques. 

Le rendu côté serveur est une caractéristique importante de SvelteKit, cela signifie que le serveur rendra le HTML initial pour une page avant de l'envoyer au client. Cela améliore les performances et l'optimisation pour les moteurs de recherche. 

Les routes API sont des itinéraires qui gèrent les demandes côté serveur et envoient les réponses sous forme de JSON ou d'autres formats. Avec SvelteKit, vous pouvez définir des routes API dans le dossier `route` et les utiliser pour interagir avec une source de données côté serveur ou effectuer d'autres actions côté serveur.

SvelteKit utilise un serveur Node.js, qui est responsable de la gestion des demandes et des réponses entrantes. Le serveur est également responsable de la gestion des routes dynamiques et de l'application de middleware pour modifier les demandes ou les réponses. SvelteKit fournit une API facile à utiliser pour la gestion des fonctionnalités côté serveur, ce qui permet de construire des applications web rapides et efficaces de manière simple et intuitive.

Ce serveur Node.js sera utilisé dans ce projet pour gérer la transcription de protocoles : gRPC ↔ REST.

### Serveur Hook

Les hooks serveur dans SvelteKit sont une façon d'exécuter du code en réponse à des événements côté serveur spécifiques, tels que lorsque l'utilisateur demande une page ou des données à une API. Le hook serveur est une fonction asynchrone qui reçoit quelques données de contexte, y compris les objets de demande et de réponse, et renvoie une valeur ou modifie le contexte.

Lorsqu'une demande est envoyée à une application SvelteKit, le middleware du serveur intercepte la demande et exécute tous les hooks serveurs applicables avant de rendre la page ou de renvoyer la réponse. Chaque hook serveur peut modifier la demande ou la réponse, effectuer un traitement de données ou exécuter des effets secondaires tels que l'accès à une base de données ou l'envoi d'une notification.

Dans l'environnement gRPC, on utilisera le hook serveur pour passer les clients gRPC aux gestionnaires de requêtes.

## Gestionnaire de tâches gRPC

Dans ce projet, nous utilisons SvelteKit pour le front-end. La partie Svelte est facile à comprendre, car elle ressemble à n'importe quel framework JS moderne (React ou Vue) mais est beaucoup plus conviviale pour les développeurs. Jetez un coup d'œil au [didacticiel](https://svelte.dev/tutorial/basics) pour vous familiariser avec Svelte.

Pour suivre ce didacticiel, vous devrez [initialiser une nouvelle application SvelteKit](https://kit.svelte.dev/docs/creating-a-project).
*Nous utiliserons TypeScript, ESLint et Prettier avec un projet squelette. Mais choisissez ce avec quoi vous êtes le plus à l'aise.*

### Système de fichiers

Le dossier `src/router` est l'endroit où vous placerez vos pages et le gestionnaire de routes API. Veuillez consulter [la documentation](https://kit.svelte.dev/docs/routing) pour comprendre les différents types de fichiers de routage.

### Initialisation du client gRPC

Tout d'abord, nous devons générer le stub de client pour notre application SvelteKit. Allez dans `proto/buf.gen.yml` (à la racine du projet) et ajoutez la ligne suivante à la liste des plugins :

```yml
  - plugin: buf.build/community/timostamm-protobuf-ts
    out: ../<VOTRE_DOSSIER_SVELTEKIT>/src/lib/stubs
```

Ensuite, exécutez `buf generate` pour générer les stubs. Nous n'avons pas besoin du fichier proto. Vous devriez voir un dossier `lib/stubs` avec un client TypeScript généré dans le dossier `src`.

Les bibliothèques suivantes doivent être installées :

```bash
$ npm install -D @grpc/grpc-js @protobuf-ts/runtime-rpc @protobuf-ts/runtime @protobuf-ts/grpc-transport
```

Commençons maintenant à mettre en œuvre la connexion aux serveurs gRPC.

Créez un fichier `lib/server/grpc.client.ts`. Nous devons créer un objet d'identification :

```typescript
import { GrpcTransport } from '@protobuf-ts/grpc-transport';
import { ChannelCredentials } from '@grpc/grpc-js';

export const credentials = ChannelCredentials.createInsecure();
```

En production, ces informations d'identification utiliseront SSL. Pour l'instant, nous utiliserons le mode non sécurisé.

Ensuite, nous allons initialiser la connexion :

```typescript
import { env } from '$env/dynamic/private';
import { UserServiceClient } from '$lib/stubs/user/v1alpha/service.client';

const userTransport = new GrpcTransport({
	host: env.USER_API_URL as string,
	channelCredentials: credentials,
});
```

Et enfin, le service instancié :

```typescript
import { UserServiceClient } from '$lib/stubs/user/v1alpha/service.client';

export const userClient = new UserServiceClient(userTransport);
```

Le chemin d'importation peut varier en fonction de la configuration de génération de stub. Nous exportons le client de service instancié.

Et voilà ! Nos clients sont maintenant disponibles dans notre côté serveur.

### De gRPC à REST

À partir de maintenant, les choses seront faciles. Nous avons simplement besoin d'appeler nos APIs avec le client instancié et de renvoyer la réponse au format JSON.

Dans le fichier `src/routes/user/+server.ts`, nous allons montrer comment convertir une réponse gRPC en réponse REST. Écrivez ceci :

```typescript
import { userClient } from '$lib/server/grpc.client';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const { response } = await userClient.register(data);

	console.log({ user: response.user });

	return new Response(
		JSON.stringify(response.user, (k, v) => (typeof v === 'bigint' ? v.toString() : v))
	);

};
```

Lancez l'API utilisateur à découvert:

```bash
# Dans le dossier user-api
$ insecure=true npm start
```

Ajoutez un fichier `.env` pour injecter l'URL de l'API utilisateur :

```bash
# N'oubliez pas de modifier par votre URL locale ;)
$ USER_API_URL=localhost:6000
```

Lancez le serveur SvelteKit:

```bash
$ npm run dev
```

Si tout s'est bien passé, vous devriez être en mesure de tester votre endpoint REST avec la cURL suivante (ou avec postman) :

```bash
$ curl -X POST \
  http://localhost:5173/user \
    -H 'Content-Type: application/json' \
    -d '{
      "email": "johndoe@example.com",
      "password": "password123",
      "firstName": "John",
      "lastName": "Doe"
    }'
```

### Véritable Front-End

Créons une page d'inscription utilisateur pour utiliser notre endpoint. Nous allons utiliser tailwind pour styliser notre composant, alors veuillez [l'installer](https://tailwindcss.com/docs/guides/sveltekit).

Dans le même dossier `routes/user`, créez un fichier `+page.svelte`.
Dans ce fichier, copiez le template suivant :

```svelte
<div class="flex flex-col justify-center min-h-full px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="mt-10 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
			Register
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6">
			<div>
				<label for="email" class="block text-sm font-medium leading-6 text-gray-900"
					>Email address</label
				>
				<div class="mt-2">
					<input
						id="email"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="firstName" class="block text-sm font-medium leading-6 text-gray-900"
					>First Name</label
				>
				<div class="mt-2">
					<input
						id="firstName"
						name="firstName"
						type="text"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label for="lastName" class="block text-sm font-medium leading-6 text-gray-900"
					>Last Name</label
				>
				<div class="mt-2">
					<input
						id="lastName"
						name="lastName"
						type="text"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm font-medium leading-6 text-gray-900"
						>Password</label
					>
				</div>
				<div class="mt-2">
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-indigo-600 px-3 p-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>Register</button
				>
			</div>
		</form>
	</div>
</div>
```

Vous pouvez aller sur la page http://localhost:5173/user pour voir le formulaire.

Nous pouvons maintenant continuer en ajoutant la logique pour envoyer les données du formulaire.

Au sommet du fichier, dans une balise script, implémentons notre fonction handleSubmit :
```svelte
<script lang="ts">
	async function handleSubmit(event: Event) {
		const data: any = {};
		new FormData(event.target as HTMLFormElement).forEach((value, key) => (data[key] = value));

		const response = await fetch('/user', {
			method: 'post',
			body: JSON.stringify(data)
		});

		if (response.ok) {
			const data = await response.json();
			console.log({ data });
		}
	}
</script>
```

Ensuite, utilisons l'écouteur d'événements pour déclencher cette fonction :
```svelte
...
<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" on:submit|preventDefault={handleSubmit}>
...
```

C'est tout ! Vous êtes maintenant en mesure d'utiliser votre microservice gRPC dans SvelteKit.

PS : La dernière partie, avec le fetch et le gestionnaire de requêtes *post*, est désormais la méthode préférée dans SvelteKit. Consultez [ici](https://kit.svelte.dev/docs/form-actions) pour savoir comment faire de manière optimale.