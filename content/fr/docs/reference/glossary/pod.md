---
title: Pod
id: pod
date: 2018-04-12
full_link: fr/docs/concepts/workloads/pods/pod-overview/
short_description: >
  Le plus petit et le plus simple des objets Kubernetes. Un Pod est un ensemble de conteneurs fonctionnant sur votre cluster.

aka:
tags:
- core-object
- fundamental
---
 Le plus petit et le plus simple des objets Kubernetes. Un Pod est un ensemble de {{< glossary_tooltip text="conteneurs" term_id="container" >}} fonctionnant sur votre cluster.

<!--more-->

Un Pod est généralement configuré pour faire fonctionner un seul conteneur primaire. Il peut également exécuter des conteneurs side-car optionnels qui ajoutent des fonctions supplémentaires comme le logging. Les Pods sont généralement gérés par un {{< glossary_tooltip="Deployment" term_id="deployment" >}}.
