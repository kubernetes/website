---
title: Preemption
id: preemption
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  Le mécanisme de préemption dans Kubernetes permet à un Pod en attente de trouver un nœud adapté en évincant des Pods de priorité inférieure présents sur ce nœud.

aka:
tags:
- operation
---

Le mécanisme de préemption dans Kubernetes permet à un {{< glossary_tooltip term_id="pod" >}} en attente de trouver un {{< glossary_tooltip term_id="node" >}} adapté en évincant des Pods de priorité inférieure présents sur ce nœud.

<!--more-->

Si un Pod ne peut pas être planifié, le scheduler tente de [préempter](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption) des Pods de priorité inférieure afin de permettre la planification du Pod en attente.