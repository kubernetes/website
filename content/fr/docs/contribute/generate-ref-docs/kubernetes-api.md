---
title: Génération de documentation de référence pour l'API Kubernetes
description: Génération documentation référence API Kubernetes
content_template: templates/task
---

{{% capture overview %}}

Cette page montre comment mettre à jour les documents de référence générés automatiquement pour l'API Kubernetes.

{{% /capture %}}

{{% capture prerequisites %}}

Vous devez avoir ces outils installés:

* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Golang](https://golang.org/doc/install) version 1.9.1 ou ultérieur
* [Docker](https://docs.docker.com/engine/installation/)
* [etcd](https://github.com/coreos/etcd/)

Votre variable d'environnement $GOPATH doit être définie et l'emplacement de `etcd` doit être dans votre variable d'environnement $PATH.

Vous devez savoir comment créer une pull request dans un dépôt GitHub.
Généralement, cela implique la création d'un fork du dépôt.
Pour plus d'informations, voir [Créer une Pull Request de documentation](/docs/home/contribute/create-pull-request/) et [GitHub Standard Fork & Pull Request Workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

{{% /capture %}}

{{% capture steps %}}

## Généralités

La mise à jour de la documentation de référence de l'API Kubernetes est un processus en deux étapes:

1. Générez une spécification OpenAPI à partir du code source de Kubernetes.
   Les outils pour cette étape sont [kubernetes/kubernetes/hack](https://github.com/kubernetes/kubernetes/tree/master/hack).

1. Générez un fichier HTML à partir de la spécification OpenAPI.
   Les outils pour cette étape sont à [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).

## Obtenir trois dépôts

Si vous ne possédez pas déjà le dépôt `kubernetes/kubernetes`, téléchargez-le maintenant:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Déterminez le dépôt de base de votre clone de [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Par exemple, si vous avez suivi l’étape précédente pour obtenir le dépôt, votre dépôt de base est `$GOPATH/src/github.com/kubernetes/kubernetes`.
Les étapes restantes se réfèrent à votre répertoire de base en tant que `<k8s-base>`.

Si vous ne possédez pas déjà le dépôt `kubernetes/website`, obtenez-le maintenant:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

Déterminez le répertoire de base de votre dépôt [kubernetes/website](https://github.com/kubernetes/website).
Par exemple, si vous avez suivi l’étape précédente pour obtenir le dépôt, votre répertoire de base est `$GOPATH/src/github.com/kubernetes/website`.
Les étapes restantes se réfèrent à votre répertoire de base en tant que `<web-base>`.

Si vous n'avez pas déjà le dépôt `kubernetes-incubator/reference-docs`, obtenez-le maintenant:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes-incubator/reference-docs
```

Déterminez le répertoire de base de votre dépôt [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).
Par exemple, si vous avez suivi l’étape précédente pour obtenir le dépôt, votre répertoire de base est `$GOPATH/src/github.com/kubernetes-incubator/reference-docs`.
Les étapes restantes se réfèrent à votre répertoire de base en tant que `<rdocs-base>`.

## Modification du code source de Kubernetes

La documentation de référence de l'API Kubernetes est générée automatiquement à partir d'une spécification OpenAPI, générée à partir du code source de Kubernetes.
Si vous souhaitez modifier la documentation de référence, la première étape consiste à modifier un ou plusieurs commentaires dans le code source de Kubernetes.

### Modification des commentaires dans le code source

{{< note >}}
Les étapes suivantes sont un exemple et non une procédure générale.
Les détails seront différents dans votre situation.
{{< /note >}}

Voici un exemple d'édition d'un commentaire dans le code source de Kubernetes.

Dans votre dépôt local `kubernetes/kubernetes`, vérifiez la branche master et assurez-vous qu'elle est à jour:

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

Supposons que ce fichier source dans la branche principale ait la typo "atmost":

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

Dans votre environnement local, ouvrez `types.go` et remplacez "atmost" par "at most".

Vérifiez que vous avez modifié le fichier:

```shell
git status
```

La sortie montre que vous êtes sur la branche master et que le fichier source `types.go` a été modifié:

```shell
On branch master
...
    modified:   staging/src/k8s.io/api/apps/v1/types.go
```

### Valider votre fichier édité

Exécutez `git add` et ` git commit` pour valider les modifications que vous avez apportées jusqu'à présent.
Dans l'étape suivante, vous ferez un deuxième commit.
Il est important de séparer vos modifications en deux commits.

### Génération de la spécification OpenAPI et des fichiers associés

Allez sur `<k8s-base>` et exécutez ces scripts:

```shell
hack/update-generated-swagger-docs.sh
hack/update-swagger-spec.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

Exécutez `git status` pour voir ce qui a été généré.

```shell
On branch master
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/swagger-spec/apps_v1.json
    modified:   docs/api-reference/apps/v1/definitions.html
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types.go
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

Voir le contenu de `api/openapi-spec/swagger.json` pour vous assurer que la faute de frappe est corrigée.
Par exemple, vous pouvez exécuter `git diff -a api/openapi-spec/swagger.json`.
Ceci est important, car `swagger.json` sera l’entrée de la seconde étape du processus de génération de doc.

Exécutez `git add` et ` git commit` pour valider vos modifications.
Vous avez maintenant deux validations: une avec le fichier `types.go` édité et une avec les spécifications OpenAPI générées et les fichiers associés.
Gardez ces deux commits séparés.
C'est-à-dire, ne faites pas un squash de vos commits.

Soumettez vos modifications en tant que [pull request](https://help.github.com/articles/creating-a-pull-request/) à la branche principale du dépôt [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Surveillez votre pull request, et répondre aux commentaires des relecteurs au besoin.
Continuez à surveiller votre pull request jusqu'à ce qu'il ait été mergé.

[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) est un exemple de demande d'extraction qui corrige une faute de frappe dans le code source de Kubernetes.

{{< note >}}
Il peut être difficile de déterminer le fichier source correct à modifier.
Dans l'exemple précédent, le fichier source faisant autorité se trouve dans le répertoire `staging` du dépôt `kubernetes/kubernetes`.
Mais dans votre cas, le répertoire `staging` pourrait ne pas être l’endroit où trouver la source faisant autorité.
Pour vous guider, consultez les fichiers `README` dans le dépôt [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging) et dans le dépôt [kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
{{< /note >}}

### Cherry picking votre commit dans une branche release

Dans la section précédente, vous avez modifié un fichier dans la branche principale, puis exécuté des scripts pour générer une spécification OpenAPI et les fichiers associés.
Vous avez ensuite soumis vos modifications dans une demande d'extraction à la branche maître du dépôt `kubernetes/kubernetes`.
Supposons maintenant que vous souhaitiez faire un backport de votre modification dans une branche de publication.
Par exemple, supposons que la branche principale soit utilisée pour développer Kubernetes version 1.10 et que vous souhaitiez faire un backport de votre modification dans la branche de la version 1.9.

Rappelez-vous que votre pull request a deux commits: un pour l'édition `types.go` et un pour les fichiers générés par des scripts.
La prochaine étape consiste à proposer un cherry pick de votre premier commit dans la branche release-1.9.
L'idée est de cherry pick le commit qui a édité `types.go`, mais pas le commit qui a pour résultat l'exécution des scripts.
Pour les instructions, voir [Proposer un Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

{{< note >}}
Proposer un cherry pick nécessite que vous ayez la permission de définir un label et un milestone dans votre pull request.
Si vous ne disposez pas de ces autorisations, vous devrez travailler avec une personne pouvant définir les labels et milestones pour vous.
{{< /note >}}

Quand vous avez une pull request en place pour cherry picking votre seul commit dans la branche release-1.9, l’étape suivante consiste à exécuter ces scripts dans la branche release-1.9 de votre environnement local.

```shell
hack/update-generated-swagger-docs.sh
hack/update-swagger-spec.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

Maintenant, ajoutez un commit à votre cherry-pick pull request qui contient la spécification OpenAPI récemment générée et les fichiers associés.
Surveillez votre pull request jusqu'à ce qu'elle soit mergée dans la branche release-1.9.

À ce stade, la branche master et la branche release-1.9 ont votre fichier `types.go` mis à jour et un ensemble de fichiers générés qui reflètent les modifications apportées à `types.go`.
Notez que la spécification OpenAPI générée et les autres fichiers générés dans la branche release-1.9 ne sont pas nécessairement identiques aux fichiers générés dans la branche master.
Les fichiers générés dans la branche release-1.9 contiennent des éléments API uniquement à partir de Kubernetes 1.9.
Les fichiers générés dans la branche maître peuvent contenir des éléments de l'API qui ne sont pas dans la version 1.9, mais sont en cours de développement pour la version 1.10.

## Génération des documents de référence publiés

La section précédente a montré comment modifier un fichier source, puis générer plusieurs fichiers, y compris `api/openapi-spec/swagger.json` dans le dépôt `kubernetes/kubernetes`.

Cette section montre comment générer la [documentation de référence de l'API Kubernetes publiée](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/), qui est générée par les outils de [kubernetes-incubator/reference-docs](https://github.com/kubernetes-incubator/reference-docs).
Ces outils prennent le fichier `api/openapi-spec/swagger.json` comme entrée.

### Modification du Makefile dans kubernetes-incubator/reference-docs

Aller à `<rdocs-base>`, et ouvrez `Makefile` pour l'édition:

Définissez `K8SROOT` dans le répertoire de base de votre dépôt local `kubernetes/kubernetes`.
Définissez `WEBROOT` sur le répertoire de base de votre référentiel `kubernetes/website`.
Définissez `MINOR_VERSION` sur la version mineure de la documentation que vous souhaitez créer.
Par exemple, si vous souhaitez créer des documents pour Kubernetes 1.9, définissez `MINOR_VERSION` sur 9.
Enregistrez et fermez `Makefile`.

### Copier la spécification OpenAPI

Le code de génération de document nécessite une copie locale de la spécification OpenAPI pour l'API Kubernetes.
Allez sur `<k8s-base>` et vérifiez la branche qui a la spécification OpenAPI que vous voulez utiliser.
Par exemple, si vous souhaitez générer des documents pour Kubernetes 1.9, consultez la branche release-1.9.

Retournez à `<rdocs-base>`.
Entrez la commande suivante pour copier la spécification OpenAPI à partir du dépôt `kubernetes/kubernetes` vers un répertoire local:

```shell
make updateapispec
```

La sortie montre que le fichier a été copié:

```shell
cp ~/src/github.com/kubernetes/kubernetes/api/openapi-spec/swagger.json gen-apidocs/generators/openapi-spec/swagger.json
```

### Construire l'image brodocs

Le code de génération de doc nécessite l'image Docker [pwittrock/brodocs](https://github.com/pwittrock/brodocs).

Cette commande crée l’image Docker `pwittrock/brodocs`.
Il essaie également de transmettre l’image à DockerHub, mais c’est acceptable si cette étape échoue.
Tant que vous avez l'image localement, la génération de code peut réussir.

```shell
make brodocs
```

Vérifiez que vous avez l'image brodocs:

```shell
docker images
```

La sortie affiche `pwittrock / brodocs` comme l'une des images disponibles:

```shell
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
pwittrock/brodocs   latest              999d34a50d56        5 weeks ago         714MB
```

### Exécuter le code de génération de doc

Générez et exécutez le code de génération de doc.
Vous devrez peut-être exécuter la commande en tant que root:

```shell
cd <rdocs-base>
make api
```

### Localiser les fichiers générés

Ces deux fichiers sont le résultat d’une construction réussie.
Vérifiez qu'ils existent:

* `<rdocs-base>/gen-apidocs/generators/build/index.html`
* `<rdocs-base>/gen-apidocs/generators/build/navData.js`

## Copier les documents générés dans le dépôt kubernetes/website

Les sections précédentes ont montré comment modifier un fichier source Kubernetes, générer une spécification OpenAPI, puis générer une documentation de référence pour la publication.

Cette section explique comment copier les documents générés sur le dépôt [kubernetes/website](https://github.com/kubernetes/website).
Les fichiers dans le dépôt `kubernetes/website` sont publiés sur le site web [kubernetes.io](https://kubernetes.io).
En particulier, le fichier généré `index.html` est publié [ici](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

Entrez la commande suivante pour copier les fichiers générés dans votre dépôt local `kubernetes/website`:

```shell
make copyapi
```

Allez à la base de votre dépôt local `kubernetes/kubernetes`, et regardez quels fichiers ont été modifiés:

```shell
cd <web-base>
git status
```

La sortie montre les fichiers modifiés:

```shell
On branch master
...
   modified:   docs/reference/generated/kubernetes-api/v1.9/index.html
```

Dans cet exemple, un seul fichier a été modifié.
Rappelez-vous que vous avez généré les deux `index.html` et `navData.js`.
Mais apparemment le généré `navata.js` n'est pas différent du `navData.js` c'était déjà dans le dépôt `kubernetes/website`.

Dans `<web-base>` executez `git add` et `git commit` pour enregistrer le commit du changement.

Soumettez vos modifications en tant que [pull request](/docs/home/contribute/create-pull-request/) au dépôt [kubernetes/website](https://github.com/kubernetes/website).
Surveillez votre pull request, et répondez aux commentaires des relecteurs au besoin.
Continuez à surveiller votre pull request jusqu'à ce qu'elle ait été mergée.

Quelques minutes après que votre pull request soit fusionnée, vos modifications seront visibles dans la [documentation de référence publiée](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

{{% /capture %}}

{{% capture whatsnext %}}

* [Génération de documents de référence pour les composants et les outils Kubernetes](/docs/home/contribute/generated-reference/kubernetes-components/)
* [Génération de documentation de référence pour les commandes kubectl](/docs/home/contribute/generated-reference/kubectl/)
* [Génération de documentation de référence pour l'API de fédération Kubernetes](/docs/home/contribute/generated-reference/federation-api/)

{{% /capture %}}
