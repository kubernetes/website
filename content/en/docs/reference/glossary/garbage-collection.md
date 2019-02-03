---
title: Garbage Collection
id: garbage-collection
date: 2019-03-02
full_link: https://kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/
short_description: >
  Garbage Collection is a process of reclaiming resources by deleting unused or unowned objects.
aka:
tags:
- fundamental
---
 Garbage Collection is a process of reclaiming resources by deleting unused or unowned objects.

<!--more-->

[Garbage Collection](https://kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/) is a process of reclaiming resources by deleting unused or unowned objects. In Kubernetes, there are two different aspects of Garbage Collection - Master level handled by [Kube-Controller-Manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/) and Node level managed by [Kubelet](https://kubernetes.io/docs/concepts/cluster-administration/kubelet-garbage-collection/).
