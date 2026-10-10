---
title: Persistent Volume
id: persistent-volume
full_link: /docs/concepts/storage/persistent-volumes/
short_description: >
  Objet API représentant une unité de stockage dans le cluster.

aka: 
tags:
- core-object
- storage
---

Objet API représentant une unité de stockage dans le cluster. Il s’agit d’une représentation d’une {{< glossary_tooltip text="ressource" term_id="infrastructure-resource" >}} de stockage générale et extensible, pouvant persister au-delà du cycle de vie de tout {{< glossary_tooltip text="Pod" term_id="pod" >}} individuel.

<!--more-->

Les PersistentVolumes (PV) fournissent une API qui abstrait les détails de la manière dont le stockage est fourni de la manière dont il est consommé. Les PV sont utilisés directement dans les cas où le stockage peut être créé à l’avance (provisionnement statique). Pour les cas nécessitant un stockage à la demande (provisionnement dynamique), des PersistentVolumeClaims (PVC) sont utilisés à la place.