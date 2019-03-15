---
title: kubeadm upgrade
content_template: templates/concept
weight: 40
---
<!--
---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm upgrade
content_template: templates/concept
weight: 40
---
-->
{{% capture overview %}}
<!--
`kubeadm upgrade` is a user-friendly command that wraps complex upgrading logic behind one command, with support
for both planning an upgrade and actually performing it. `kubeadm upgrade` can also be used for downgrading
cluster if necessary.
-->
`kubeadm upgrade` 是一个对用户友好的命令，它将复杂的升级逻辑包装在一个命令后面，支持规划升级和实际执行。
如有必要，`kubeadm upgrade` 也可用于降级集群。
{{% /capture %}}

{{% capture body %}}
<!--
## kubeadm upgrade guidance
-->
## kubeadm 升级向导

<!--
Every upgrade process might be a bit different, so we've documented each minor upgrade process individually.
For more version-specific upgrade guidance, see the following resources:
-->
每个升级过程可能会有所不同，因此我们分别记录了每个小的升级过程。
有关特定版本的更多升级指南，请参阅以下资源：

<!--
 * [1.10 to 1.11 upgrades](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-11/)
 * [1.11 to 1.12 upgrades](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-12/)
 -->
 * [1.10 到 1.11 升级](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-11/)
 * [1.11 到 1.12 升级](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-12/)

<!--
_For older versions, please refer to older documentation sets on the Kubernetes website._
-->
_对于更老的版本，请参阅 Kubernetes 网站上的旧版文档。_

<!--
In Kubernetes v1.11.0 and later, you can use `kubeadm upgrade diff` to see the changes that would be
applied to static pod manifests.
-->
在 Kubernetes v1.11.0 及更高版本中，您可以使用 `kubeadm upgrade diff` 来查看将应用于静态 Pod 清单的更改。

## kubeadm upgrade plan {#cmd-upgrade-plan}
{{< include "generated/kubeadm_upgrade_plan.md" >}}

## kubeadm upgrade apply {#cmd-upgrade-apply}
{{< include "generated/kubeadm_upgrade_apply.md" >}}

## kubeadm upgrade diff {#cmd-upgrade-diff}
{{< include "generated/kubeadm_upgrade_diff.md" >}}

## kubeadm upgrade node config {#cmd-upgrade-node-config}
{{< include "generated/kubeadm_upgrade_node_config.md" >}}

## kubeadm upgrade node experimental-control-plane {#cmd-experimental-control-plane}
{{< include "generated/kubeadm_upgrade_node_experimental-control-plane.md" >}}

{{% /capture %}}

{{% capture whatsnext %}}
<!--
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
-->
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/) 如果使用 kubeadm v1.7.x 或更低版本初始化的集群，请配置您的集群来使用 `kubeadm upgrade`。
{{% /capture %}}