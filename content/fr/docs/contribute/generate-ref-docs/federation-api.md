---
title: Génération de la documentation de référence pour l'API de fédération Kubernetes
description: Federation Référence API Kubernetes Documentation
content_template: templates/task
---

{{% capture overview %}}

Cette page montre comment générer automatiquement des pages de référence pour l'API de fédération Kubernetes.

{{% /capture %}}

{{% capture prerequisites %}}

* Vous devez avoir [Git](https://git-scm.com/book/fr/v2/D%C3%A9marrage-rapide-Installation-de-Git) installé.

* Vous devez avoir [Golang](https://golang.org/doc/install) version 1.9.1 ou ultérieur installé, et votre variable d'environnement `$GOPATH` doit être définie.

* Vous devez avoir [Docker](https://docs.docker.com/engine/installation/) installé.

* Vous devez savoir comment créer une pull request sur un dépôt GitHub.
  Généralement, cela implique la création d'un fork du dépôt.
  Pour plus d'informations, voir [Création d'une pull request de documentation](/docs/home/contribute/create-pull-request/).

{{% /capture %}}

{{% capture steps %}}

## Exécution du script update-federation-api-docs.sh

Si vous ne possédez pas déjà le code source de la fédération Kubernetes, procurez-vous-le maintenant:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/federation
```

Déterminez le répertoire de base de votre dépôt local [kubernetes/federation](https://github.com/kubernetes/federation).
Par exemple, si vous avez suivi l'étape précédente pour obtenir le code source de la fédération, votre répertoire de base est `$GOPATH/src/github.com/kubernetes/federation`.
Les étapes restantes se réfèrent à votre répertoire de base en tant que `<fed-base>`.

Exécutez le script de génération de documentation:

```shell
cd <fed-base>
hack/update-federation-api-reference-docs.sh
```

Le script exécute le [k8s.gcr.io/gen-swagger-docs](https://console.cloud.google.com/gcr/images/google-containers/GLOBAL/gen-swagger-docs?gcrImageListquery=%255B%255D&gcrImageListpage=%257B%2522t%2522%253A%2522%2522%252C%2522i%2522%253A0%257D&gcrImageListsize=50&gcrImageListsort=%255B%257B%2522p%2522%253A%2522uploaded%2522%252C%2522s%2522%253Afalse%257D%255D) image pour générer cet ensemble de documents de référence:

* /docs/api-reference/extensions/v1beta1/operations.html
* /docs/api-reference/extensions/v1beta1/definitions.html
* /docs/api-reference/v1/operations.html
* /docs/api-reference/v1/definitions.html

Les fichiers générés ne sont pas publiés automatiquement.
Ils doivent être copiés manuellement sur dépôt [kubernetes/website](https://github.com/kubernetes/website/tree/master/content/en/docs/reference/generated).

Ces fichiers sont publiés à [kubernetes.io/docs/reference](/docs/reference/):

* [Federation API v1 Operations](/docs/reference/federation/v1/operations/)
* [Federation API v1 Definitions](/docs/reference/federation/v1/definitions/)
* [Federation API extensions/v1beta1 Operations](/docs/reference/federation/extensions/v1beta1/operations/)
* [Federation API extensions/v1beta1 Definitions](/docs/reference/federation/extensions/v1beta1/definitions/)

{{% /capture %}}

{{% capture whatsnext %}}

* [Génération de documentation de référence pour l'API Kubernetes](/docs/home/contribute/generated-reference/kubernetes-api/)
* [Génération de documentation de référence pour les commandes kubectl](/docs/home/contribute/generated-reference/kubectl/)
* [Génération de pages de référence pour les composants et les outils Kubernetes](/docs/home/contribute/generated-reference/kubernetes-components/)

{{% /capture %}}
