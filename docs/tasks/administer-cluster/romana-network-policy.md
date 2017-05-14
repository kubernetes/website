---
assignees:
- chrismarino
title: Using Romana for NetworkPolicy
redirect_from:
- "/docs/getting-started-guides/network-policy/romana/"
- "/docs/getting-started-guides/network-policy/romana.html"
- "/docs/tasks/configure-pod-container/romana-network-policy/"
- "/docs/tasks/configure-pod-container/romana-network-policy.html"
---

{% capture overview %}

This page shows how to use Romana for NetworkPolicy.

{% endcapture %}

{% capture prerequisites %}

1. Complete steps 1, 2, and 3 of  the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/). 

{% endcapture %}

{% capture steps %}

## Installing Romana with kubeadm

1. Follow the [containerized installation guide](https://github.com/romana/romana/tree/master/containerize) for kubeadmin. 

## Applying network policies

To apply Kubernetes network policies use one of the following:

* The [NetworkPolicy API](/docs/concepts/services-networking/networkpolicies).
* [Romana network policies](https://github.com/romana/romana/wiki/Romana-policies).
    * [Example of Romana network policy](https://github.com/romana/core/tree/master/policy)

{% endcapture %}

{% include templates/task.md %}




