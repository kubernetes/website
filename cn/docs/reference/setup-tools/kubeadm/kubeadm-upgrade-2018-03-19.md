---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm upgrade
---
{% capture overview %}
`kubeadm upgrade` is a user-friendly command that wraps complex upgrading logic behind one command, with support
for both planning an upgrade and actually performing it. `kubeadm upgrade` can also be used for downgrading
cluster if necessary.
{% endcapture %}

{% capture body %}
## kubeadm upgrade guidance

Every upgrade process might be a bit different, so we've documented each minor upgrade process individually.
Please check these documents out for more detailed how-to-upgrade guidance:

 * [1.6 to 1.7 upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-7/)
 * [1.7.x to 1.7.y upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.7 to 1.8 upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.8.x to 1.8.y upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
 * [1.8.x to 1.9.x upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/)
 * [1.9.x to 1.9.y upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/)
 * [1.9.x to 1.9.y HA cluster upgrades](/docs/tasks/administer-cluster/kubeadm-upgrade-ha/)

## kubeadm upgrade plan {#cmd-upgrade-plan}
{% include_relative generated/kubeadm_upgrade_plan.md %}

## kubeadm upgrade apply  {#cmd-upgrade-apply}
{% include_relative generated/kubeadm_upgrade_apply.md %}

{% endcapture %}

{% capture whatsnext %}
* [kubeadm config](kubeadm-config.md) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
{% endcapture %}

{% include templates/concept.md %}
