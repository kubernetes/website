---
title: Feature gate
id: feature-gate
full_link: /docs/reference/command-line-tools-reference/feature-gates/
short_description: >
  Un mécanisme permettant d’activer ou de désactiver des fonctionnalités dans Kubernetes.

aka: 
tags:
- fundamental
- operation
---

Les feature gates sont un ensemble de clés (chaînes de caractères) utilisées pour contrôler quelles fonctionnalités de Kubernetes sont activées dans un cluster.

<!--more-->

Vous pouvez activer ou désactiver ces fonctionnalités en utilisant le paramètre `--feature-gates` dans la ligne de commande de chaque composant Kubernetes.

Chaque composant Kubernetes permet d’activer ou de désactiver un ensemble de feature gates qui lui sont propres.

La documentation Kubernetes fournit la liste des feature gates disponibles ainsi que les fonctionnalités qu’elles contrôlent.