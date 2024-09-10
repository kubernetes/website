---
title: Affinität
id: affinity
date: 2019-01-11
full_link: /docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     Regeln, die vom Scheduler verwendet werden, um festzulegen wo Pods platziert werden.
aka:
tags:
- fundamental
---

In Kubernetes, ist _Affinität_ ein Satz Regeln, die dem Scheduler Hinweise geben, wo er Pods platzieren soll.

<!--more-->
Es gibt zwei Arten Affinität:
* [Knoten Affinität](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [Pod-zo-Pod Affinität](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

Die Regeln werden mithilfe der in {{< glossary_tooltip term_id="pod" text="Pods" >}} angegebenen {{< glossary_tooltip term_id="label" text="Label">}} und {{< glossary_tooltip term_id="selector" text="Selektoren">}} definiert, und sie können entweder erforderlich oder bevorzugt sein, je nachdem wie streng sie möchten, dass der Scheduler sie durchsetzen soll.
