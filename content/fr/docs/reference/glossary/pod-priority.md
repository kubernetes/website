---
title: Pod Priority
id: pod-priority
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority
short_description: >
  La priorité d’un Pod indique son importance relative par rapport aux autres Pods.

aka:
tags:
- operation
---

La priorité d’un {{< glossary_tooltip term_id="pod" >}} indique son importance relative par rapport aux autres Pods.

<!--more-->

La [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority) permet de définir une priorité d’ordonnancement pour un Pod, afin qu’il puisse être priorisé plus ou moins que d’autres Pods — une fonctionnalité importante pour les charges de travail en production.