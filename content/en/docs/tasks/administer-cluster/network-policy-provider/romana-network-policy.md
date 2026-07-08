---
reviewers:
- chrismarino
title: Romana for NetworkPolicy
content_type: task
weight: 50
---

<!-- overview -->

This page shows how to use Romana for NetworkPolicy.

## {{% heading "prerequisites" %}}

Complete steps 1, 2, and 3 of the [kubeadm getting started guide](/docs/reference/setup-tools/kubeadm/).

<!-- steps -->

## Installing Romana with kubeadm

Follow the [containerized installation guide](https://github.com/romana/romana/tree/master/containerize) for kubeadm.

## Applying network policies

To apply network policies use one of the following:

* [Romana network policies](https://github.com/romana/romana/wiki/Romana-policies).
    * [Example of Romana network policy](https://github.com/romana/core/blob/master/doc/policy.md).
* The NetworkPolicy API.

## {{% heading "whatsnext" %}}

Once you have installed Romana, you can follow the
[Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/)
to try out Kubernetes NetworkPolicy.


