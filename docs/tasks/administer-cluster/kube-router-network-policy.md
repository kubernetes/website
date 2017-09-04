---
approvers:
- murali-reddy
title: Using Kube-router for NetworkPolicy
---

{% capture overview %}
This page shows how to use [Kube-router](https://github.com/cloudnativelabs/kube-router) for NetworkPolicy.
{% endcapture %}

{% capture prerequisites %}
* Install Kube-router add-on for Kubernetes.
{% endcapture %}

{% capture steps %}
## Installing Kube-router addon
You can deploy Kube-router add-on through cluster intstallers like Kops, kubeadm, bootkube etc. Please follow the [trying Kube-router with cluster installers](https://github.com/cloudnativelabs/kube-router/tree/master/Documentation#try-kube-router-with-cluster-installers) guide.
{% endcapture %}

{% capture whatsnext %}
Once you have installed the Kube-router addon, you can follow the [NetworkPolicy getting started guide](/docs/getting-started-guides/network-policy/walkthrough) to try out Kubernetes NetworkPolicy.
{% endcapture %}

{% include templates/task.md %}

