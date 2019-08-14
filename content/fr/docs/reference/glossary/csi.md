---
title: Interface de Stockage de Conteneurs (CSI)
id: csi
date: 2018-06-25
full_link: /docs/concepts/storage/volumes/#csi
short_description: >
    L'Interface de Stockage de Conteneurs (CSI, de l'anglais Container Storage Interface) définit une interface normalisée pour exposer les systèmes de stockage aux conteneurs.


aka:
tags:
- storage
---
 L'Interface de Stockage de Conteneurs, (CSI, de l'anglais Container Storage Interface) définit une interface normalisée pour exposer les systèmes de stockage aux conteneurs.

<!--more-->

L'Interface de Stockage de Conteneurs permet aux fournisseurs de créer des plugins de stockage personnalisés pour Kubernetes, sans les ajouter au référentiel Kubernetes (plugin hors arbre). Afin d'utiliser un pilote d'Interface de Stockage de Conteneurs d'un fournisseur de mémoire, vous devez d'abord [le déployer sur votre cluster](https://kubernetes-csi.github.io/docs/deploying.html). Vous pourrez alors créer une {{< glossary_tooltip text="Classe de Stockage" term_id="storage-class" >}} qui utilise le pilote de cette Interface de Stockage de Conteneurs.

* [L'Interface de Stockage de Conteneurs dans la documentation de Kubernetes](/docs/concepts/storage/volumes/#csi)
* [Liste des pilotes d'Interface de Stockage de Conteneurs](https://kubernetes-csi.github.io/docs/drivers.html)
