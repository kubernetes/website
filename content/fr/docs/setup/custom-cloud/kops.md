---
title: Installer Kubernetes sur AWS avec kops
description: Installation Kubernetes avec kops sur AWS
content_template: templates/concept
---

{{% capture overview %}}

Cette documentation pour un démarrage rapide montre comment facilement installer un cluster Kubernetes sur AWS.
L'outil utilisé est [`kops`](https://github.com/kubernetes/kops).

kops est un système de provisionnement dont les principes sont:

* Une installation totalement automatisée
* Utilisation du DNS pour identifier les clusters
* Auto-guérison: tous les composants tournent dans des groupe de mise à l'échelle automatique (auto-scaling)
* Support de plusieurs systèmes d'exploitation (Debian, Ubuntu 16.04 supportés, Centos & RHEL, Amazon Linux et CoreOS) - se référer à [images.md](https://github.com/kubernetes/kops/blob/master/docs/images.md)
* Haute disponibilité - se référer à [high_availability.md](https://github.com/kubernetes/kops/blob/master/docs/high_availability.md)
* Peut provisionner directement, ou générer des manifests terraform - se référer à [terraform.md](https://github.com/kubernetes/kops/blob/master/docs/terraform.md)


Si ces principes ne vous conviennent pas, vous préférerez probablement construire votre propre cluster selon votre convenance grâce à [kubeadm](/docs/admin/kubeadm/).

{{% /capture %}}

{{% capture body %}}

## Créer un cluster

### (1/5) Installer kops

#### Pré-requis

Il est nécessaire d'avoir [kubectl](/docs/tasks/tools/install-kubectl/) d'installé pour que kops puisse fonctionner.

#### Installation

Télécharger kops à partir de la [page de releases](https://github.com/kubernetes/kops/releases) (Il est aussi facile à construire à partir des sources):

Sur macOS:

```shell
curl -OL https://github.com/kubernetes/kops/releases/download/1.10.0/kops-darwin-amd64
chmod +x kops-darwin-amd64
mv kops-darwin-amd64 /usr/local/bin/kops
# Vous pouvez aussi l'installer avec Homebrew
brew update && brew install kops
```

Sur Linux:

```shell
wget https://github.com/kubernetes/kops/releases/download/1.10.0/kops-linux-amd64
chmod +x kops-linux-amd64
mv kops-linux-amd64 /usr/local/bin/kops
```

### (2/5) Créer un domaine route53 pour votre cluster

kops utilise le DNS pour la découverte, que ce soit à l'intérieur du cluster ou pour pouvoir communiquer avec l'API de kubernetes à partir des clients.

Pour kops le nom du cluster doit impérativement être un nom de domaine valide.
De cette façon vous ne confondrez pas vos cluster et vous pourrez les partager avec vos collègues sans ambiguïté. Par ailleurs vous pourrez vous y connecter sans avoir à vous rappeler une adresse IP.

Vous pouvez, et vous devriez certainement, utiliser des sous-domaines afin de séparer vos clusters.
Dans notre exemple nous utiliserons `useast1.dev.example.com`. Le point d'accès au serveur API sera donc `api.useast1.dev.example.com`.

Une zone hébergée Route53 peut servir les sous-domaines. Votre zone hébergée pourrait être `useast1.dev.example.com`,
mais aussi `dev.example.com` ou même `example.com`. kops fonctionne avec n'importe lequel d'entre eux, le choix dépend de vos contraintes d'organisation (ex: Vous êtes autorisés à créer des enregistrements dns dans `dev.example.com` mais pas dans `example.com`)

Supposons que vous utilisiez `dev.example.com` comme zone hébergée. Vous créeriez cette zone hébergée en utilisant la [méthode normal](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/CreatingNewSubdomain.html), ou avec une ligne de commande telle que `aws route53 create-hosted-zone --name dev.example.com --caller-reference 1`.

Vous devrez ensuite configurer vos enregistrements NS dans le domaine parent afin que vous puissiez résoudre dans ce domaine.
Vous créeriez donc des enregistrements NS dans le domaine `example.com` pour` dev`.
S'il s'agit d'un nom de domaine racine, vous devrez configurer les enregistrements NS chez votre hébergeur de nom de domaine (là où vous avez acheté votre nom de domaine `example.com`).

Cette étape est délicate, soyez vigilants (c’est la première cause de problèmes !). Vous pouvez vérifier que
votre cluster est configuré correctement avec l'outil dig, en exécutant:

`dig NS dev.example.com`

Vous devriez voir les 4 enregistrements NS attribués à votre zone hébergée sur Route53.

### (3/5) Créez un conteneur (bucket) S3 pour stocker l'état de vos clusters.

kops vous permet de gérer vos clusters même lorsque ceux-ci sont déjà installés. Pour ce faire, il est nécessaire de conserver une trace des clusters que vous avez créé, avec leur configuration, les clés qu’ils utilisent, etc. Ces informations sont stockées dans un bucket S3. Les autorisations S3 sont utilisées pour contrôler l'accès au bucket.

Plusieurs clusters peuvent utiliser le même bucket S3 et vous pouvez aussi le partager avec vos collègues qui
administrer les mêmes clusters - c'est beaucoup plus facile que de faire circuler des fichiers kubecfg.
Cependant quiconque ayant accès au bucket S3 aura un accès complet (permissions élevées) à tous vos clusters. Vous souhaiterez donc limiter l'accès à l'équipe opérationnelle.

Plus généralement, vous auriez un bucket S3 pour chaque équipe ops (et le nom correspondrait souvent
au nom de la zone hébergée ci-dessus!)

Dans notre exemple, nous avons choisi `dev.example.com` comme zone hébergée. Nous allons donc choisir `clusters.dev.example.com` comm le nom du bucket S3.

* Exportez `AWS_PROFILE` (si vous devez sélectionner un profil pour que l'outil en ligne de commande d'AWS fonctionne).

* Créez le compartiment S3 en utilisant `aws s3 mb s3://clusters.dev.example.com`

* Vous pouvez `export KOPS_STATE_STORE=s3://clusters.dev.example.com` afin que kops utilise cet emplacement par défaut.
  Nous vous suggérons de le mettre dans votre profil bash ou similaire.


### (4/5) Construisez votre configuration de cluster

Exécutez "kops create cluster" pour créer votre configuration de cluster:

`kops create cluster --zones=us-east-1c useast1.dev.example.com`

kops créera la configuration pour votre cluster. Notez que cela génère uniquement la configuration, la création des ressources cloud se fait à l'étape suivante avec `kops update cluster`. Cela vous permettra d'analyser la configuration ou de la modifier avant de l'appliquer.

Voici quelques commandes qui vous permettent de visualiser ou éditer:

* Listez vos clusters avec: `kops get cluster`
* Éditez ce cluster avec: `kops edit cluster useast1.dev.example.com`
* Modifiez votre groupe d'instances de nœuds: `kops edit ig --name=useast1.dev.example.com nodes`
* Éditez votre groupe d'instances maître (master): `kops edit ig --name=useast1.dev.example.com master-us-east-1c`

Si vous utilisez kops pour la première fois, prenez quelques minutes pour les essayer! Un groupe d'instances est un
ensemble d'instances, qui seront enregistrées en tant que noeuds kubernetes. Sur AWS, cela est implémenté via des groupes de mise à l'échelle automatique (auto-scaling).
Vous pouvez avoir plusieurs groupes d'instances, par exemple si vous voulez des nœuds combinant des instances ponctuelles (spot instances) et à la demande, ou éventuellement des instances GPU et non-GPU.


### (5/5) Créer le cluster dans AWS

Exécutez "kops update cluster" pour créer votre cluster dans AWS :

`kops update cluster useast1.dev.example.com --yes`

Cela prend quelques secondes à s'exécuter, et ensuite votre cluster prendra probablement quelques minutes pour être réellement opérationnel.
`kops update cluster` sera l'outil que vous utiliserez à chaque fois que vous modifierez la configuration de votre cluster.
Il applique les modifications que vous avez apportées à la configuration sur votre cluster (reconfiguration d'AWS ou de kubernetes au besoin).

Par exemple, après un `kops edit ig nodes`, puis un `kops update cluster --yes` pour appliquer votre configuration, parfois, vous devrez également exécuter un `kops rolling-update cluster` pour déployer la configuration immédiatement.

Sans l'argument `--yes`,` kops update cluster` vous montrera un aperçu de ce qu’il va faire. C'est pratique
pour les clusters de production !

### Explorer d'autres composants additionnels (add-ons)

Reportez-vous à la [liste des add-ons] (/docs/concepts/cluster-administration/addons/) pour explorer d'autres add-ons, y compris des outils de journalisation, de surveillance, de stratégie réseau, de visualisation ou de contrôle de votre cluster Kubernetes.

## Nettoyer

* Pour supprimer votre cluster: `kops delete cluster useast1.dev.example.com --yes`

## Retour d'information

* Channel Slack: [#kops-users] (https://kubernetes.slack.com/messages/kops-users/)
* [Problèmes GitHub] (https://github.com/kubernetes/kops/issues)

{{% /capture %}}

{{% capture whatsnext %}}

* En apprendre davantages sur les [concepts](/docs/concepts/) Kubernetes et [`kubectl`](/docs/user-guide/kubectl-overview/).
* En savoir plus sur les [utilisations avancées](https://github.com/kubernetes/kops) de `kops`.
* Pour les bonnes pratiques et les options de configuration avancées de `kops` se référer à la [documentation](https://github.com/kubernetes/kops)

{{% /capture %}}
