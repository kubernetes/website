---
approvers:
- chrismarino
title: Romana for NetworkPolicy
---

{% capture overview %}

This page shows how to use Romana for NetworkPolicy.

{% endcapture %}

{% capture prerequisites %}

Complete steps 1, 2, and 3 of  the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/).

{% endcapture %}

{% capture steps %}

## Installing Romana with kubeadm

Follow the [containerized installation guide](https://github.com/romana/romana/tree/master/containerize) for kubeadmin.

## Applying network policies

To apply network policies use one of the following:

* [Romana network policies](https://github.com/romana/romana/wiki/Romana-policies).
    * [Example of Romana network policy](https://github.com/romana/core/tree/master/policy).
* The NetworkPolicy API.

{% endcapture %}

{% capture whatsnext %}

Once your have installed Romana, you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.

{% endcapture %}

{% include templates/task.md %}




