---
title: Garbage Collection
id: garbage-collection
date: 2021-07-07
full_link: /docs/concepts/workloads/controllers/garbage-collection/
short_description: >
  Garbage collection is a collective term for the various mechanisms Kubernetes uses to clean up cluster
  resources.

aka: 
tags:
- fundamental
- operation
---
 A collective term for the various mechanisms Kubernetes uses to clean up
 cluster resources. 

<!--more-->

Kubernetes uses garbage collection to clean up resources like [unused containers and images](/docs/concepts/workloads/controllers/garbage-collection/#containers-images),
[failed pods](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection),
deleted nodes, [objects without owner references](/docs/concepts/overview/working-with-objects/owners-dependents/), expired resources, and [completed Jobs](/docs/concepts/workloads/controllers/ttlafterfinished/).