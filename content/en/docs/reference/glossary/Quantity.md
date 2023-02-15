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
For example, a pod may be allocated 1 CPU core and 2 gigabytes of memory, which would be specified as "1 CPU" and "2Gi" for its respective resources. These quantities are used by the [Kubernetes scheduler](https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/) to determine which nodes have the available resources to run a pod, and to ensure that pods do not consume more resources than they are allocated.
