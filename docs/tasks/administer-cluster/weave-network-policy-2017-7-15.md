---
assignees:
- bboreham
title: Weave Net for NetworkPolicy
redirect_from:
- "/docs/getting-started-guides/network-policy/weave/"
- "/docs/getting-started-guides/network-policy/weave.html"
- "/docs/tasks/configure-pod-container/weave-network-policy/"
- "/docs/tasks/configure-pod-container/weave-network-policy.html"
---

{% capture overview %}

This page shows how to use Weave Net for NetworkPolicy.

{% endcapture %}

{% capture prerequisites %}

Complete steps 1, 2, and 3 of the [kubeadm getting started guide](/docs/getting-started-guides/kubeadm/). 

{% endcapture %}

{% capture steps %}

## Installing Weave Net addon 

Follow the [Integrating Kubernetes via the Addon](https://www.weave.works/docs/net/latest/kube-addon/) guide.

The Weave Net Addon for Kubernetes comes with a [Network Policy Controller](https://www.weave.works/docs/net/latest/kube-addon/#npc) that automatically monitors Kubernetes for any NetworkPolicy annotations on all namespaces and configures `iptables` rules to allow or block traffic as directed by the policies.

{% endcapture %}

{% capture whatsnext %}

Once you have installed the Weave Net Addon you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.

{% endcapture %}

{% include templates/task.md %}
