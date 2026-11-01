---
title: Conteneur Sidecar
id: sidecar-container
full_link: /docs/concepts/workloads/pods/sidecar-containers/
short_description: >
  Un conteneur auxiliaire qui reste actif pendant tout le cycle de vie d’un Pod.

tags:
- fondamental
---

Un ou plusieurs conteneurs qui sont généralement démarrés avant les conteneurs principaux de l’application.

<!--more--> 

Les conteneurs sidecar fonctionnent comme des conteneurs d’application classiques, mais avec un objectif différent : le sidecar fournit un service local au Pod pour le conteneur principal.  
Contrairement aux init containers, les sidecars continuent de s’exécuter après le démarrage du Pod.

Pour plus de détails, lire [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).