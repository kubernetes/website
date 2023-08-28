---
title: Aggregation Layer
id: aggregation-layer
date: 2018-10-08
full_link: /docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/
short_description: >
  La couche d'agrégation vous permet d'installer des API de type Kubernetes supplémentaires dans votre cluster.

aka:
tags:
- architecture
- extension
- operation
---
 La couche d'agrégation vous permet d'installer des API supplémentaires de type Kubernetes dans votre cluster.

<!--more-->

Après avoir configuré {{< glossary_tooltip text="Kubernetes API Server" term_id="kube-apiserver" >}} pour [support additional APIs](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/), vous pourrez ajouter des objects `APIService` afin de "réclamer" un chemin URL dans l'API Kubernetes.
