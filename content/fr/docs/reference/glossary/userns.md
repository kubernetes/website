---
title: Espace de noms utilisateur
id: userns
full_link: https://man7.org/linux/man-pages/man7/user_namespaces.7.html
short_description: >
  Une fonctionnalité du noyau Linux permettant d’émuler les privilèges superutilisateur pour des utilisateurs non privilégiés.

aka:
tags:
- security
---

Une fonctionnalité du noyau permettant d’émuler les privilèges root. Elle est utilisée notamment pour les conteneurs "rootless".

<!--more-->

Les espaces de noms utilisateur (user namespaces) sont une fonctionnalité du noyau Linux qui permet à un utilisateur non root d’émuler des privilèges de superutilisateur.

Cela permet, par exemple, d’exécuter des conteneurs sans disposer de privilèges root en dehors du conteneur.

Les espaces de noms utilisateur contribuent à limiter l’impact d’éventuelles attaques d’évasion de conteneur.

Dans ce contexte, le terme namespace fait référence à une fonctionnalité du noyau Linux, et non à un namespace Kubernetes.
