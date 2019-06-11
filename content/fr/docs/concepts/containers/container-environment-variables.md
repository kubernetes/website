---
title: Les variables d’environnement du conteneur
description: Variables d'environnement pour conteneur Kubernetes
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Cette page décrit les ressources disponibles pour les conteneurs dans l'environnement de conteneur.

{{% /capture %}}


{{% capture body %}}

## L'environnement du conteneur

L’environnement Kubernetes conteneur fournit plusieurs ressources importantes aux conteneurs:

* Un système de fichier, qui est une combinaison d'une [image](/docs/concepts/containers/images/) et un ou plusieurs [volumes](/docs/concepts/storage/volumes/).
* Informations sur le conteneur lui-même.
* Informations sur les autres objets du cluster.

### Informations sur le conteneur

Le nom d'*hôte* d'un conteneur est le nom du pod dans lequel le conteneur est en cours d'exécution.
Il est disponible via la commande `hostname` ou
[`gethostname`](http://man7.org/linux/man-pages/man2/gethostname.2.html)
dans libc.

Le nom du pod et le namespace sont disponibles en tant que variables d'environnement via
[l'API downward](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/).

Les variables d'environnement définies par l'utilisateur à partir de la définition de pod sont également disponibles pour le conteneur,
de même que toutes les variables d'environnement spécifiées de manière statique dans l'image Docker.

### Informations sur le cluster

Une liste de tous les services en cours d'exécution lors de la création d'un conteneur est disponible pour ce conteneur en tant que variables d'environnement.
Ces variables d'environnement correspondent à la syntaxe des liens Docker.

Pour un service nommé *foo* qui correspond à un conteneur *bar*,
les variables suivantes sont définies:

```shell
FOO_SERVICE_HOST=<l'hôte sur lequel le service est exécuté>
FOO_SERVICE_PORT=<le port sur lequel le service fonctionne>
```

Les services ont des adresses IP dédiées et sont disponibles pour le conteneur avec le DNS,
si le [module DNS](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/) est activé. 

{{% /capture %}}

{{% capture whatsnext %}}

* En savoir plus sur [les hooks du cycle de vie d'un conteneur](/docs/concepts/containers/container-lifecycle-hooks/).
* Acquérir une expérience pratique
  [en attachant les handlers aux événements du cycle de vie du conteneur](/docs/tasks/configure-pod-container/attach-handler-lifecycle-event/).

{{% /capture %}}
