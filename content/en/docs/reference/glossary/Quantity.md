---
title: Quantity
id: quantity
date: 2023-01-24
short_description: >
 Quantity refers to a special notation which are portable across machines. 

aka: 
tags:
- fundamental
---

Quantity describes how much of a resource, like CPU or memory, is allotted to a Pod where a container is running.
For example, a pod may be allocated 1 CPU core and 2 gigabytes of memory, which would be specified as "1 CPU" and "2Gi" for its respective resources. These quantities are used by the [Kubernetes scheduler](https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/) to determine which nodes have the available resources to run a pod, and to ensure that pods do not consume more resources than they are allocated.
