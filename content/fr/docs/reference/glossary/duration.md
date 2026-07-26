---
title: Durée
id: duration
full_link:
short_description: >
  Une valeur de type chaîne représentant une durée.
tags:
- fundamental
---

Une valeur de type chaîne représentant une durée.

<!--more-->

Le format d’une durée dans Kubernetes est basé sur le type `time.Duration` du langage Go.

Dans les API Kubernetes utilisant des durées, la valeur est exprimée comme une combinaison d’entiers non négatifs associés à un suffixe d’unité de temps.  
Une durée peut contenir plusieurs unités, et correspond à la somme de ces différentes valeurs.

Les unités de temps valides sont : `ns`, `µs` (ou `us`), `ms`, `s`, `m` et `h`.

Par exemple : `5s` représente une durée de cinq secondes, et `1m30s` représente une durée d’une minute et trente secondes.