---
title: Génération de pages de référence pour les composants et les outils Kubernetes
content_template: templates/task
---

{{% capture overview %}}

Cette page montre comment utiliser l'outil `update-importer-docs` pour générer une documentation de référence pour les outils et les composants des dépôts [Kubernetes](https://github.com/kubernetes/kubernetes) et [Federation](https://github.com/kubernetes/federation).

{{% /capture %}}

{{% capture prerequisites %}}

* Vous avez besoin d'une machine qui exécute Linux ou macOS.

* Ces logiciels doivent être installés:

    * [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

    * [Golang](https://golang.org/doc/install) version 1.9 ou ultérieure

    * [make](https://www.gnu.org/software/make/)

    * [gcc compiler/linker](https://gcc.gnu.org/)

* Votre variable d'environnement `$GOPATH` doit être définie.

* Vous devez savoir comment créer une pull request sur un dépôt GitHub.
Cela implique généralement la création d’un fork d'un dépôt.
Pour plus d'informations, consultez [Créer une Pull Request de documentation](/docs/home/contribute/create-pull-request/).

{{% /capture %}}

{{% capture steps %}}

## Obtenir deux dépôts

Si vous n'avez pas déjà le dépôt `kubernetes/website`, obtenez le maintenant:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/website
```

Déterminez le répertoire de base de votre clone du dépôt [kubernetes/website](https://github.com/kubernetes/website).
Par exemple, si vous avez suivi l’étape précédente pour obtenir le dépôt, votre répertoire de base est `$GOPATH/src/github.com/kubernetes/website`.
Les étapes restantes se réfèrent à votre répertoire de base en tant que `<web-base>`.

Si vous envisagez d’apporter des modifications aux documents de référence et si vous ne disposez pas déjà du dépôt `kubernetes/kubernetes`, obtenez-le maintenant:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Déterminez le répertoire de base de votre clone du dépôt [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Par exemple, si vous avez suivi l’étape précédente pour obtenir le dépôt, votre répertoire de base est `$GOPATH/src/github.com/kubernetes/kubernetes`.
Les étapes restantes se réfèrent à votre répertoire de base en tant que `<k8s-base>`.

{{< note >}}
Si vous devez uniquement générer, sans modifier, les documents de référence, vous n'avez pas besoin d'obtenir manuellement le dépôt `kubernetes/kubernetes`.
Lorsque vous exécutez la commande `update-imported-docs`, il clone automatiquement le dépôt `kubernetes/kubernetes`.
{{< /note >}}

## Modification du code source de Kubernetes

La documentation de référence pour les composants et les outils Kubernetes est générée automatiquement à partir du code source de Kubernetes.
Si vous souhaitez modifier la documentation de référence, commencez par modifier un ou plusieurs commentaires dans le code source de Kubernetes.
Faites le changement dans votre dépôt local `kubernetes/kubernetes`, puis soumettez une pull request sur la branche master [github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

[PR 56942](https://github.com/kubernetes/kubernetes/pull/56942) est un exemple de pull request qui modifie les commentaires dans le code source de Kubernetes.

Surveillez votre pull request, et répondez aux commentaires des relecteurs.
Continuez à surveiller votre pull request jusqu'à ce qu'elle soit mergée dans la branche master du dépot `kubernetes/kubernetes`.

## Selectionnez vos commits dans une branche release

Vos commits sont sur la branche master, qui est utilisée pour le développement sur la prochaine sortie de Kubernetes.
Si vous souhaitez que vos commits apparaissent dans la documentation d'une version Kubernetes déjà publiée, vous devez proposer que vos commits soit sélectionnée dans la branche de publication.

Par exemple, supposons que la branche master est utilisée pour développer Kubernetes 1.10, et vous voulez transférer vos commits sur la branche release-1.9.
Pour savoir comment faire cela, consultez [Propose a Cherry Pick](https://github.com/kubernetes/community/blob/master/contributors/devel/cherry-picks.md).

Surveillez votre pull request cherry-pick jusqu'à ce qu'elle soit mergée dans la branche release.

{{< note >}}
Proposer un cherry pick exige que vous ayez la permission de définir un label et un milestone dans votre pull request.
Si vous ne disposez pas de ces autorisations, vous devrez travailler avec une personne pouvant définir les paramètres de labels et de milestone pour vous.
{{< /note >}}

## Vue générale de update-imported-docs

L'outil `update-importer-docs` se trouve dans le répertoire `kubernetes/website/update-importer-docs/`.
L'outil effectue les étapes suivantes:

1. Effectuez un clone des différents dépots spéciés dans le fichier de configuration.
   Afin de générer des documents de référence, les dépôts clonés par défaut sont: `kubernetes-incubator/reference-docs` et `kubernetes/federation`.
1. Effectuez les commandes dans les dépôts clonés pour préparer le générateur de documentation et génerer les fichiers Markdown.
1. Copiez les fichiers markdown générés dans un copie locale du dépôt  `kubernetes/website`. Les fichiers doivent être mis dans les dossiers spécifiés dans le fichier de configuration.

Quand les fichiers Markdown sont dans votre clone local du dépot `kubernetes/website`, vous pouvez les soumettre dans une [pull request](/docs/home/contribute/create-pull-request/) vers `kubernetes/website`.

## Personnaliser le fichier de configuration

Ouvrez `<web-base>/update-importer-docs/reference.yml` pour le modifier.
Ne modifiez pas le contenu de l'entrée `generate-command` sauf si vous comprenez ce qu'elle fait et devez modifier la branche de release spécifiée.

```shell
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-incubator/reference-docs.git
  # Ceci et la commande generate ci-dessous nécessitent une modification lorsque les branches de référence-docs sont correctement définies
  branch: master
  generate-command: |
    cd $GOPATH
    git clone https://github.com/kubernetes/kubernetes.git src/k8s.io/kubernetes
    cd src/k8s.io/kubernetes
    git checkout release-1.11
    make generated_files
    cp -L -R vendor $GOPATH/src
    rm -r vendor
    cd $GOPATH
    go get -v github.com/kubernetes-incubator/reference-docs/gen-compdocs
    cd src/github.com/kubernetes-incubator/reference-docs/
    make comp
```

Dans reference.yml, les attributs `files` est une liste d'objets ayant des attributs `src` et `dst`.
L'attribut `src` spécifie l'emplacement d'un fichier Markdown généré, et l'attribut `dst` spécifie où copier ce fichier dans le dépôt local `kubernetes/website`.
Par exemple:

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-incubator/reference-docs.git
  files:
  - src: gen-compdocs/build/kube-apiserver.md
    dst: content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
  ...
```

Notez que lorsqu'il y a beaucoup de fichiers à copier du même répertoire source dans le même répertoire de destination, vous pouvez utiliser des caractères génériques dans la valeur donnée à `src` et vous pouvez simplement fournir le nom du répertoire comme valeur pour `dst`.
Par exemple:

```shell
  files:
  - src: gen-compdocs/build/kubeadm*.md
    dst: content/en/docs/reference/setup-tools/kubeadm/generated/
```

## Exécution de l'outil update-importer-docs

Après avoir revu et/ou personnalisé le fichier `reference.yaml`, vous pouvez exécuter l'outil `update-imports-docs`:

```shell
cd <web-base>/update-imported-docs
./update-imported-docs reference.yml
```

## Ajouter et valider des modifications dans kubernetes/website

Répertoriez les fichiers générés et copiés dans le dépôt `kubernetes/website`:

```
cd <web-base>
git status
```

La sortie affiche les fichiers nouveaux et modifiés.
Par exemple, la sortie pourrait ressembler à ceci:

```shell
...

    modified:   content/en/docs/reference/command-line-tools-reference/cloud-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/federation-apiserver.md
    modified:   content/en/docs/reference/command-line-tools-reference/federation-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-controller-manager.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-proxy.md
    modified:   content/en/docs/reference/command-line-tools-reference/kube-scheduler.md
...
```

Exécutez `git add` et `git commit` pour faire un commit de ces fichiers.

## Créer une pull request

Créez une pull request vers le dépôt `kubernetes/website`.
Consultez votre pull request et répondez aux corrections suggérées par les rélecteurs jusqu'à ce que la pull request soit acceptée et mergée.

Quelques minutes après le merge votre pull request, vos références mises à jour seront visibles dans la [documentation publiée](/docs/home/).

{{% /capture %}}

{{% capture whatsnext %}}

* [Génération de documentation de référence pour les commandes kubectl](/docs/home/contribute/generated-reference/kubectl/)
* [Génération de documentation de référence pour l'API Kubernetes](/fr/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Génération de documentation de référence pour l'API de fédération Kubernetes](/docs/home/contribute/generated-reference/federation-api/)

{{% /capture %}}
