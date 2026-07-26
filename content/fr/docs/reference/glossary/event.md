---
title: Événement
id: event
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   Objets Kubernetes décrivant des changements d’état ou des événements notables dans le cluster.
aka: 
tags:
- core-object
- fundamental
---

Un objet Kubernetes qui décrit des changements d’état ou des occurrences notables dans le cluster.

<!--more-->

Les événements ont une durée de rétention limitée, et leurs déclencheurs ainsi que leurs messages peuvent évoluer avec le temps.

Les consommateurs d’événements ne doivent pas supposer qu’un événement avec une raison donnée correspond toujours à un déclencheur identique, ni que ces événements continueront d’exister dans le temps.

Les événements doivent être considérés comme des informations indicatives, fournies au mieux (best-effort), et comme des données complémentaires.

Dans Kubernetes, le mécanisme d’audit génère un type différent d’enregistrement d’événement (groupe d’API `audit.k8s.io`).