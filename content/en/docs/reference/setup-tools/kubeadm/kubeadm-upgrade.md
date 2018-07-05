---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm upgrade
content_template: templates/concept
weight: 40
---
{{% capture overview %}}
`kubeadm upgrade` is a user-friendly command that wraps complex upgrading logic behind one command, with support
for both planning an upgrade and actually performing it. `kubeadm upgrade` can also be used for downgrading
cluster if necessary.
{{% /capture %}}

{{% capture body %}}
## kubeadm upgrade guidance

Every upgrade process might be a bit different, so we've documented each minor upgrade process individually.
For more version-specific upgrade guidance, see the following resources:

 * [1.7.x to 1.7.y upgrades](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-8/)
 * [1.7 to 1.8 upgrades](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-8/)
 * [1.8.x to 1.8.y upgrades](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-8/)
 * [1.8.x to 1.9.x upgrades](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-9/)
 * [1.9.x to 1.9.y upgrades](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-9/)
 * [1.9.x to 1.9.y HA cluster upgrades](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-ha/)

In Kubernetes v1.11.0 and later, you can use `kubeadm upgrade diff` to see the changes that would be
applied to static pod manifests.

## kubeadm upgrade plan {#cmd-upgrade-plan}
{{< include "generated/kubeadm_upgrade_plan.md" >}}

## kubeadm upgrade apply  {#cmd-upgrade-apply}
{{< include "generated/kubeadm_upgrade_apply.md" >}}

## kubeadm upgrade diff {#cmd-upgrade-diff}
{{< include "generated/kubeadm_upgrade_diff.md" >}}

## kubeadm upgrade node config {#cmd-upgrade-node-config}
{{< include "generated/kubeadm_upgrade_node_config.md" >}}

{{% /capture %}}

{{% capture whatsnext %}}
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
{{% /capture %}}
