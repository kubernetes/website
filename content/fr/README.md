# Documentation de Kubernetes

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Bienvenue !
Ce référentiel contient toutes les informations nécessaires à la construction du site web et de la documentation de Kubernetes.
Nous sommes très heureux que vous vouliez contribuer !

## Utilisation du dépôt

Vous pouvez démarrer le site localement avec [Hugo (Version Etendue)](https://gohugo.io/), ou dans un environnement d'exécution de container. Nous recommandons fortement l'utilisation du container, cela se rapproche beaucoup plus proche de l'environnement déployé en temps réel.

## Prérequis

Pour utiliser ce dépôt, vous devez avoir au préalable d'installé:
- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- Un environnement d'exécution de container runtime, comme [Docker](https://www.docker.com/).

> [!NOTE]
Soyez certain d'avoir installé Hugo version étutendu spécifié par la variable d'environnement `HUGO_VERSION` dans le fichier [`netlify.toml`](netlify.toml#L11).

Avant de démarrer, installez les dépendances. Clonez le dépôt et placez-vous dans le répertoire:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

Le site Kubernetes utilise le [theme Docsy Hugo](https://github.com/google/docsy#readme),
qui peut-être installé via npm. Vous pouvez également télécharger un container avec une
image de développement pré-configurée qui inclue Hugo et Docsy. Par ailleurs, un sous-module
Git est utilisé pour générer la documentation de référence.

### Windows

```powershell
# récupérer les dépendances des sous-modules
git submodule update --init --recursive --depth 1
```

### Linux / other Unix

```bash
# récupérer les dépendances des sous-modules
make module-init
```

## Démarrer le site avec un container

Pour construire le site dans un container, lancez la commande suivante:

```bash
# Vous pouvez définir $CONTAINER_ENGINE, correspondant au nom de n'importe quelle type de container tel que Docker
make container-serve
```

Si vous voyez des erreurs, cela provient probablement du container Hugo qui ne dispose pas d'assez de ressources disponibles. Pour résoudre cela, augmentez la limite de CPU et de mémoire utilisé par Docker sur votre machine ([macOS](https://docs.docker.com/desktop/settings/mac/) and [Windows](https://docs.docker.com/desktop/settings/windows/)).

Ouvrez votre navigateur à l'adresse: http://localhost:1313 pour voir le site.
Lorsque vous apportez des modifications aux fichiers sources, Hugo met à jour le site et force le navigateur à rafraîchir la page.

## Démarrer le site avec Hugo

- Pour macOS et Linux

  ```bash
  npm ci
  make serve
  ```

- Pour Windows (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --buildFuture --environment development
  ```

Le serveur Hugo local démarrera sur le port 1313.
Ouvrez votre navigateur à l'adresse: http://localhost:1313 pour voir le site.
Lorsque vous apportez des modifications aux fichiers sources, Hugo met à jour le site et force le navigateur à rafraîchir la page.

## Construire l'API de référence des pages

L'API de référence des pages est situé dans le répertoire [content/en/docs/reference/kubernetes-api](../en/docs/reference/kubernetes-api) et construit à partir des spécifications du Swagger, également connu sous le nom de spécifications d'OpenAPI, en utilisant <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs>.

Pour mettre à jour la référence des pages pour une nouvelle release Kubernetes suivez les étapes suivantes:

1. Récupérez le sous-module `api-ref-generator`:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Mettez à jour la spécification Swagger:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. Dans [api-ref-assets/config/](../../api-ref-assets/config/), modifiez les fichiers [toc.yaml](../../api-ref-assets/config/toc.yaml) et [fields.yaml](../../api-ref-assets/config/fields.yaml) afin de refléter les changements sur la nouvelle release.

4. Puis, construisez les pages:

   ```bash
   make api-reference
   ```

   Vous pouvez tester les résulats localement en construisant et servant le site depuis un container:

   ```bash
   make container-serve
   ```

   Depuis un navigateur, allez à l'adresse <http://localhost:1313/docs/reference/kubernetes-api/> pour visualiser l'API de référence.

5. Lorsque tous les changements du nouveau contrat sont reflétés dans la configuration des fichiers [toc.yaml](../../api-ref-assets/config/toc.yaml) et [fields.yaml](../../api-ref-assets/config/fields.yaml), créez une Pull Request avec la nouvelle API de référence des pages de générés.

## Problèmes fréquents

### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version

Hugo est livré avec 2 formats de binaires pour des raisons techniques. Le site actuel démarre actuellement en se basant sur **Hugo Extended** version uniquement. Dans la [page de release](https://github.com/gohugoio/hugo/releases) recherchez les archives contenant `extended` in leur nom. Afin de vérifier, entrez `hugo version` et vérifiez que `extended` apparaît.

### Problème fréquent sur macOS: too many open files

Si vous lancez la commande `make serve` sur macOS et que vous obtenez l'erreur suivante:

```bash
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Verifiez la limite actuelle de fichiers maximum ouverts:

`launchctl limit maxfiles`

Puis lancez les commandes suivantes (adapted from <https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c>):

```shell
#!/bin/sh

# Ce sont les liens Gist d’origine, pointant désormais vers mes propres Gists.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

Cela fonctionne aussi bien sur macOS Catalina que sur macOS Mojave.

## Communauté, discussion, contribution et assistance

Apprenez comment vous engager avec la communauté Kubernetes sur la [page communauté](http://kubernetes.io/community/).

Vous pouvez joindre les responsables de ce projet à l'adresse :

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
- [Mailing List](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Contribuer à la documentation

Vous pouvez cliquer sur le bouton **Fork** en haut à droite de l'écran pour créer une copie de ce dépôt dans votre compte GitHub.
Cette copie s'appelle un *fork*.
Faites tous les changements que vous voulez dans votre fork, et quand vous êtes prêt à nous envoyer ces changements, allez dans votre fork et créez une nouvelle pull request pour nous le faire savoir.

Une fois votre pull request créée, un examinateur de Kubernetes se chargera de vous fournir une revue claire et exploitable.
En tant que propriétaire de la pull request, **il est de votre responsabilité de modifier votre pull request pour tenir compte des commentaires qui vous ont été fournis par l'examinateur de Kubernetes.**

Notez également que vous pourriez vous retrouver avec plus d'un examinateur de Kubernetes pour vous fournir des commentaires ou vous pourriez finir par recevoir des commentaires d'un autre examinateur que celui qui vous a été initialement affecté pour vous fournir ces commentaires.

De plus, dans certains cas, l'un de vos examinateurs peut demander un examen technique à un [examinateur technique de Kubernetes](https://github.com/kubernetes/website/wiki/Tech-reviewers) au besoin.
Les examinateurs feront de leur mieux pour fournir une revue rapidement, mais le temps de réponse peut varier selon les circonstances.

Pour plus d'informations sur la contribution à la documentation Kubernetes, voir :

- [Commencez à contribuer](https://kubernetes.io/fr/docs/contribute/)
- [Utilisation des modèles de page](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Documentation Style Guide](https://kubernetes.io/fr/docs/contribute/style/style-guide/)
- [Introduction de la documentation Kubernetes](https://www.youtube.com/watch?v=pprMgmNzDcw)
- [Traduction de la documentation Kubernetes](https://kubernetes.io/fr/docs/contribute/localization/)

## Code de conduite

La participation à la communauté Kubernetes est régie par le [Code de Conduite CNCF](https://github.com/cncf/foundation/blob/main/code-of-conduct.md).

## Merci

Kubernetes prospère grâce à la participation de la communauté, et nous apprécions vraiment vos contributions à notre site et à notre documentation !
