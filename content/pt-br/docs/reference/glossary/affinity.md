---
title: Afinidade
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     Regras utilizadas pelo escalonador para determinar onde alocar os Pods
aka:
tags:
- fundamental
---

No Kubernetes, _afinidade_ é um conjunto de regras que fornecem dicas ao escalonador sobre onde alocar os Pods.

<!--more-->
Existem dois tipos de afinidade:
* [afinidade de nó](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [afinidade entre pods](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

As regras são definidas usando os {{< glossary_tooltip term_id="label" text="rótulos">}} do Kubernetes,
e {{< glossary_tooltip term_id="selector" text="seletores">}} especificados nos {{< glossary_tooltip term_id="Pod" text="Pods" >}}, 
e eles podem ser obrigatórios ou preferenciais, dependendo de quão rigorosamente você deseja que o escalonador os aplique.
