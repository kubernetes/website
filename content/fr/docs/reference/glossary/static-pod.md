---
title: Pod statique
id: static-pod
full_link: /docs/tasks/configure-pod-container/static-pod/
short_description: >
  Un pod géré directement par le démon kubelet sur un nœud spécifique.

aka:
tags:
- fundamental
---
Un {{< glossary_tooltip text="pod" term_id="pod" >}} géré directement par le démon {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} sur un nœud spécifique.

<!--more-->

Le pod est créé et maintenu localement par le kubelet, sans que le serveur API de Kubernetes ne l’observe.

Les pods statiques ne prennent pas en charge les {{< glossary_tooltip text="conteneurs éphémères" term_id="ephemeral-container" >}}.