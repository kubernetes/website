---
title: Quantity
id: quantity
date: 2023-01-24
short_description: >
 A Kubernetes-specific notation for numeric values.
aka: 
tags:
- fundamental
---

In Kubernetes, a _quantity_ lets you specify a number in a way that always uses exact (integer) values.
Quantities can represent values that are larger or smaller than 1.0, by using SI suffixes.

<!-- more -->
One use of a quantity is to describe how much of a resource, like CPU or memory, is allotted to
a Pod where a container is running.

Imagine that you want to run a pod with one container, and to that container to use at most half
of a virtual CPU core, and no more than 2 gibibytes of memory.
You specify the CPU resource limit as `500m` (1000 millicores represent one core, so 500 millicores
represent half a core). You specify the memory limit in bytes as `2Gi`. Kubernetes then defines the
Pod with those resource limits applied to the container.

The suffixes are taken from the
[international system of units](https://en.wikipedia.org/wiki/International_System_of_Units).
For more information, read the [API reference](/docs/reference/kubernetes-api/common-definitions/quantity/)
for quantities.
