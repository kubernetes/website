---
approvers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Kubeadm reset 
notitle: true
---
{% capture overview %}
## Kubeadm reset {#cmd-reset}
{% endcapture %}

{% capture body %}
{% include_relative _kubeadm/kubeadm_reset.md %}
{% endcapture %}

{% capture whatsnext %}
* [kubeadm init](kubeadm-init.md) to bootstraps a Kubernetes master node
* [kubeadm join](kubeadm-join.md) to bootstraps a Kubernetes worker node and join it to the cluster
{% endcapture %}

{% include templates/concept.md %}