---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/docs/
short_description: >
  Un runtime (environnement d'exécution) de conteneur, léger et spécifiquement conçu pour Kubernetes.

aka:
tags:
- tool
---
Un outil permettant d'utiliser les runtimes de conteneurs OCI avec Kubernetes CRI.

<!--more-->

CRI-O est une implémentation du {{< glossary_tooltip term_id="cri" >}}
permettant l'utilisation des runtimes de {{< glossary_tooltip text="conteneurs" term_id="container" >}}
compatibles avec l'Open Container Initiative (OCI)
[runtime spec](http://www.github.com/opencontainers/runtime-spec).

Le déploiement de CRI-O permet à Kubernetes d'utiliser n'importe quel runtime conforme à l'OCI, en tant que runtime de conteneur, afin d'exécuter les {{< glossary_tooltip text="Pods" term_id="pod" >}}, et de récupérer les images de conteneurs OCI provenant de registres distants.
