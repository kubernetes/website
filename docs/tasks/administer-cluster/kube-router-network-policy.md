---
reviewers:
- murali-reddy
title: Use Kube-router for NetworkPolicy
---

{% capture overview %}
This page shows how to use [Kube-router](https://github.com/cloudnativelabs/kube-router) for NetworkPolicy.
{% endcapture %}

{% capture prerequisites %}
You need to have a Kubernetes cluster running. If you do not already have a cluster, you can create one by using any of the cluster installers like Kops, Bootkube, Kubeadm etc.
{% endcapture %}

{% capture steps %}
## Installing Kube-router addon
The Kube-router Addon comes with a Network Policy Controller that watches Kubernetes API server for any NetworkPolicy and pods updated and configures iptables rules and ipsets to allow or block traffic as directed by the policies. Please follow the [trying Kube-router with cluster installers](https://github.com/cloudnativelabs/kube-router/tree/master/Documentation#try-kube-router-with-cluster-installers) guide to install Kube-router addon.
{% endcapture %}

{% capture whatsnext %}
Once you have installed the Kube-router addon, you can follow the [Declare Network Policy](/docs/tasks/administer-cluster/declare-network-policy/) to try out Kubernetes NetworkPolicy.
{% endcapture %}

{% include templates/task.md %}
