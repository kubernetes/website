---
title: kube-scheduler
id: kube-scheduler
date: 2018-04-12
full_link: /docs/reference/generated/kube-scheduler/
short_description: >
  Component on the master that watches newly created pods that have no node assigned, and selects a node for them to run on.

aka: 
tags:
- architecture
---
 Component on the master that watches newly created pods that have no node assigned, and selects a node for them to run on.

<!--more--> 

Factors taken into account for scheduling decisions include individual and collective resource requirements,  hardware/software/policy constraints, affinity and anti-affinity specifications, data locality, inter-workload interference and deadlines.

