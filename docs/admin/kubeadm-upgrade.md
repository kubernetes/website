---
approvers:
- mikedanese
- luxas
- errordeveloper
- jbeda
title: Kubeadm upgrade
notitle: true 
---
{% capture overview %}
# Kubeadm Upgrade


{% endcapture %}

{% capture body %}

## Kubeadm upgrade plan {#cmd-upgrade-plan}
{% include_relative _kubeadm/kubeadm_upgrade_plan.md %}

## Kubeadm upgrade apply  {#cmd-upgrade-apply}
{% include_relative _kubeadm/kubeadm_upgrade_apply.md %}

{% endcapture %}

{% capture whatsnext %}
* [kubeadm config](kubeadm-config.md) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
{% endcapture %}

{% include templates/concept.md %}