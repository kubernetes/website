---
title: Ressource (infrastructure)
id: infrastructure-resource
short_description: >
  Une quantité définie de ressources d’infrastructure disponibles à la consommation (CPU, mémoire, etc.).

aka:
tags:
- architecture
---

Des capacités fournies à un ou plusieurs nœuds (CPU, mémoire, GPU, etc.) et mises à disposition des Pods exécutés sur ces nœuds.

Kubernetes utilise également le terme _ressource_ pour désigner une ressource API.

<!--more-->

Les ordinateurs fournissent des ressources matérielles fondamentales : puissance de calcul, mémoire, stockage, réseau, etc.  
Ces ressources ont une capacité limitée, mesurée dans une unité adaptée (nombre de CPU, quantité de mémoire, etc.).

Kubernetes abstrait ces ressources afin de les allouer aux workloads et utilise des mécanismes du système d’exploitation (par exemple les cgroups sous Linux) pour gérer leur consommation.

Vous pouvez également utiliser l’allocation dynamique de ressources pour gérer automatiquement des besoins plus complexes.
