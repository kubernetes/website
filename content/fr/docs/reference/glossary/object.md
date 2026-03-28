---
title: Object
id: object
full_link: /docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
  Entité du système Kubernetes représentant une partie de l’état de votre cluster.
aka:
tags:
- architecture
- fundamental
---

Une entité du système Kubernetes. Un objet est une
{{< glossary_tooltip text="ressource API" term_id="api-resource" >}} que l’API Kubernetes
utilise pour représenter l’état de votre cluster.

<!--more-->

Un objet Kubernetes est généralement un « enregistrement d’intention » — une fois l’objet créé, le
{{< glossary_tooltip text="plan de contrôle" term_id="control-plane" >}} de Kubernetes travaille en permanence pour garantir
que l’élément qu’il représente existe effectivement.

En créant un objet, vous indiquez au système Kubernetes à quoi vous souhaitez que cette partie de
la charge de travail de votre cluster ressemble ; cela correspond à l’état souhaité de votre cluster.