---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm upgrade
---
{% capture overview %}
{% endcapture %}

{% capture body %}
## kubeadm upgrade plan {#cmd-upgrade-plan}
{% include_relative generated/kubeadm_upgrade_plan.md %}

## kubeadm upgrade apply  {#cmd-upgrade-apply}
{% include_relative generated/kubeadm_upgrade_apply.md %}

{% endcapture %}

{% capture whatsnext %}
* [kubeadm config](kubeadm-config.md) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
{% endcapture %}

{% include templates/concept.md %}