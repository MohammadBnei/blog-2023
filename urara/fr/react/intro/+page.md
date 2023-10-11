---
title: Intro à React
created: 2023-10-10
updated: 2023-10-10
tags:
  - react
  - nextjs
---
# React Exercices

- React : C'est une bibliothèque JavaScript développée par Facebook pour simplifier la création d'interfaces utilisateur interactives pour le web. Grâce à ses composants réutilisables, React permet aux développeurs une grande efficacité et une meilleure organisation du code.

- Objectif de React : L'objectif principal de React est de fournir une manière optimale de créer des applications à une seule page (SPA) rapide, scalable et simple. Il utilise une représentation virtuelle du DOM (Document Object Model) en mémoire, ce qui permet à l'application d'effectuer des mises à jour efficaces et de rendre seulement les composants qui sont réellement nécessaires.

- NextJS : Développé par Vercel, NextJS est un cadre (framework) pour React. Il permet aux applications React d'avoir un rendu côté serveur et de générer des sites web statiques. Cela signifie que la page est complètement construite sur le serveur avant d'être envoyée au client, ce qui accélère le temps de chargement initial de la page. De plus, cela améliore le référencement SEO, car les robots des moteurs de recherche peuvent lire le contenu directement sans avoir besoin d'exécuter JavaScript.

- Addition de NextJS : En plus du rendu côté serveur et de la génération de sites statiques, NextJS offre également d'autres fonctionnalités utiles pour les applications React, comme un système de routage automatique basé sur le système de fichiers, la prise en charge de l'importation dynamique de modules, et des fonctionnalités prêtes à utiliser pour la performance telles que la division du code (code splitting) et le préchargement du module (module preloading).

## Partie 1 : Le composant

- Composant React : Un composant en React est une unité indépendante de code qui retourne un élément (ou un ensemble d'éléments) du DOM à afficher sur le navigateur via une fonction de rendu (render). Chaque composant a sa propre logique, qui est écrite en JavaScript plutôt qu'en templates, permettant de manipuler facilement les données et de maintenir l'état. Les composants React peuvent être définis sous deux formes : les composantes fonctionnelles et les composantes de classe. Les composants fonctionnels sont généralement plus simples et servent principalement à afficher du contenu, alors que les composants de classe incluent des fonctionnalités plus étendues, telles que les méthodes de cycle de vie.

- État et props : Chaque composant peut avoir un "état" et des "props". L'état est un objet qui stocke les valeurs des variables qui peuvent changer dans le temps. Les props (abréviation de properties) sont des variables qui sont passées d'un composant parent à un composant enfant. Un changement d'état ou de props déclenche un re-rendu du composant.

- NextJS et React : En NextJS, les composants React fonctionnent de la même manière qu'en React classique. Cependant, NextJS ajoute plus de fonctionnalités autour des composants, notamment en terme de routage et de rendu côté serveur. Par exemple, chaque fichier dans le dossier `app` de Next.js est une page. Les pages sont des composants React qui ont une route associée.

Voici un guide étape par étape pour vous amener à écrire ces fichiers.

## Bloc 0: Mise en place de page.tsx

1. Créez un fichier `app/learn/page.tsx`.

2. Dans `page.tsx`, importez le composant `Parent` de `parent.tsx`.

3. Créez un composant fonctionnel, `Learn`, qui renvoie une div contenant le composant `Parent`.

4. Exportez le composant `Learn` par défaut à partir de `page.tsx`.

Voici à quoi devrait ressembler votre fichier `page.tsx` :

```jsx
import Parent from './parent.tsx';

const Learn = () => {
  return (
    <div>
      <Parent />
    </div>
  );
};

export default Learn;
```

Dans cette première étape, nous avons simplement créé une page qui contient le composant `Parent`. À partir d'ici, nous continuerons à construire le composant `Parent` et le composant `Child` pour ajouter plus de fonctionnalités.

## Bloc 1: Création des fichiers et composants de base

1. Commencez par créer trois fichiers : `component/learn/child.tsx`, `component/learn/parent.tsx`.

2. Dans le fichier `child.tsx`, créez un composant fonctionnel appelé `Child` qui affiche simplement un titre (`h1`) "Enfant".

3. Dans le fichier `parent.tsx`, créez un composant fonctionnel appelé `Parent` qui affiche également un titre (`h2`) "Parent" et qui rend également le composant `Child`.

   Le composant `Parent` devrait ressembler à ceci :

   ```jsx
   import Child from './child';

    const Parent = () => {
    return (
        <div>
            <h2>Parent</h2>
            <Child />
        </div>
        );
    };
    export default Parent;
   ```

## Exercices pour renforcer la compréhension sur les props de base

1. Passez une prop `nom` du composant `Parent` au composant `Child` et affichez ce `nom` dans le composant `Child`.
2. Modifiez la valeur de la prop `nom` dans le composant `Parent` et observez comment cela affecte le rendu du composant `Child`.
3. Essayez de passer plusieurs props au composant `Child` et affichez-les.

## Bloc 2: Comprendre les children dans les props

1. Éditez le composant `Child` pour qu'il prenne une prop enfant. Cette prop est normalement utilisée pour insérer du JSX entre les balises d'ouverture et de fermeture du composant 'Child'.
2. Dans le composant `Parent`, passez du texte ou du JSX en tant que children au composant `Child`.

(AIDE) Passer des 'children' à un composant consiste essentiellement à insérer du code JSX ou des composants entre les balises de ce composant. Les 'children' sont ensuite accessibles dans le composant via la prop 'children'.

Voici un exemple de base pour illustrer cela :

Commençons par définir un composant 'Boite' qui met simplement en forme son contenu – ses child(ren):

```jsx
const Boite = (props) => {
    return <div style={{ border: '1px solid black', padding: '10px' }}>{props.children}</div>
};
```

Si vous voulez utiliser ce composant pour afficher un message, vous pourriez le faire ainsi :

```jsx
const Message = () => {
    return (
        <Boite>
            <h2>Bonjour le monde !</h2>
        </Boite>
    );
};
```

Dans ce cas, le contenu entre les balises `<Boite>` et `</Boite>` est passé au composant 'Boite' en tant que 'children'. Le composant 'Boite' utilise ensuite la prop 'children' pour afficher ce contenu à l'intérieur de la div. Vous pouvez passer n'importe quoi en tant que 'children' à un composant : une chaîne de caractères, un autre composant, une liste de composants, etc.

C’est une technique courante pour créer des composants d'enveloppe ou de mise en page de haut niveau qui appliquent une mise en forme ou un style cohérent à leur contenu.

## Bloc 3: Intégration de la logique de l'heure

1. Définissez une variable d'état `time` dans le composant `Parent` pour stocker le moment où le bouton du composant `Child` est cliqué.
2. Passez une fonction `setTime` qui met à jour `time` au composant `Child`.
3. Dans le composant `Child`, créez un bouton qui, lorsqu'il est cliqué, appelle `setTime` avec la date et l'heure actuelles.

Le composant `Child` devrait maintenant ressembler à cela :

```jsx
const Child = ({ setTime }) => {
  return (
    <div>
      <button onClick={() => setTime(new Date())}>Set Time</button>
    </div>
  );
};
```

## Bloc 4: Utilisation de useEffect pour mettre en place un intervalle

1. Au sein du composant `Parent`, utilisez `useEffect` pour mettre en place un intervalle qui démarre lorsque le bouton du composant `Child` est cliqué.

2. À chaque intervalle, mettez en jour `relativeTime`, un nouvel état que vous pouvez définir, qui sera utilisé pour afficher le nombre de secondes écoulées depuis le dernier clic.

3. Nettoyez l’intervalle lorsque le composant est démonté.

Votre composant `Parent` ressemblera à ceci :

```jsx
const Parent = () => {
  const [time, setTime] = useState(null);
  const [relativeTime, setRelativeTime] = useState(null);

  useEffect(() => {
    if (!time) {
      return;
    }
    setRelativeTime(0);
    const interval = setInterval(() => {
      setRelativeTime(previousTime => previousTime + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return (
    <div>
      <Child setTime={setTime} />
      {relativeTime !== null && <p>{relativeTime} seconds have passed since the button was last clicked</p>}
    </div>
  );
};
```

## Exercices

1. Essayez de supprimer la fonction de nettoyage `return () => clearInterval(interval);` dans `useEffect`. Que se passe-t-il lorsque vous cliquez plusieurs fois sur le bouton 'Set Time' ?
2. Dans le composant `Parent`, ajoutez un bouton qui change l'état de quelque chose d'autre que `time`. Comment cela affecte-t-il l'intervalle ? Que fait le deuxième paramètre `[]` dans `useEffect` ?
3. Pouvez-vous créer un deuxième intervalle qui se déclenche à des moments différents ? Que se passe-t-il lorsque les deux intervalles sont en cours d'exécution ?

## Exercices : Gestion de l'ajout et de la suppression des enfants

1. Ajoutez une variable d'état à `Parent` pour suivre le nombre d'enfants, initializez-le à 1.

2. Ajoutez deux boutons dans `Parent` qui incremente et décrémente respectivement le nombre d'enfants.

3. Lors du rendu des composants `Child`, utilisez un tableau prenant comme longueur le nombre d'enfants, et mappez-le pour retourner autant de `Child` que nécessaire. Assurez-vous que chaque `Child` a une clé unique.

4. Après avoir mis en place cette logique, que se passe-t-il lorsqu'on clique à plusieurs reprises sur les boutons "Ajouter un enfant" et "Supprimer un enfant" ? Les intervalles pour chaque enfant sont-ils correctement démarrés et nettoyés ?

5. Que se passe-t-il si vous décrémentez le nombre d'enfants à 0 ? Comment pouvez-vous empêcher les utilisateurs de supprimer tous les enfants ? Comment pouvez-vous vous assurer que le nombre d'enfants ne va jamais dans le négatif ?

## Exercices : Comprendre l'utilisation de la forme de mise à jour de l'état avec une fonction

1. Dans le composant `Parent`, essayez de remplacer `setRelativeTime(previousTime => previousTime + 1)` par `setRelativeTime(relativeTime + 1)`. Que se passe-t-il ? Comment cela affecte-t-il le compte à rebours ?

2. Pourquoi pensez-vous que `setRelativeTime(previousTime => previousTime + 1)` fonctionne, alors que `setRelativeTime(relativeTime + 1)` ne fonctionne pas comme prévu ?

3. Essayez d'ajouter un autre bouton dans le composant `Parent` qui double le `relativeTime` quand il est cliqué. Pouvez-vous le faire en utilisant la forme `setRelativeTime(previousTime => previousTime * 2)` ? Que se passe-t-il si vous utilisez `setRelativeTime(relativeTime * 2)` à la place ?

Ces exercices sont conçus pour illustrer que lorsque vous voulez mettre à jour l'état basé sur l'état précédent, vous devriez toujours utiliser la forme fonctionnelle de `setState`. Cela garantit que vous travaillez avec la dernière et la plus précise valeur de l'état, car les mises à jour de l'état peuvent être asynchrones.
