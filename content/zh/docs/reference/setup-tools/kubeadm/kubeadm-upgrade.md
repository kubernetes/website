---
title: kubeadm upgrade
content_type: concept
weight: 40
---
<!-- ---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm upgrade
content_type: concept
weight: 40
--- -->

<!-- overview -->
<!--
`kubeadm upgrade` is a user-friendly command that wraps complex upgrading logic
behind one command, with support for both planning an upgrade and actually performing it. -->
`kubeadm upgrade` 是一个对用户友好的命令，它将复杂的升级逻辑包装在一个命令后面，支持升级的规划和实际执行。


<!-- body -->

<!--
## kubeadm upgrade guidance
-->
## kubeadm 升级指南

<!--
The steps for performing a upgrade using kubeadm are outlined in [this document](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
For older versions of kubeadm, please refer to older documentation sets of the Kubernetes website.
-->
[本文档](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)概述了使用 kubeadm 执行升级的步骤。
有关 kubeadm 旧版本，请参阅 Kubernetes 网站的旧版文档。

<!--
You can use `kubeadm upgrade diff` to see the changes that would be applied to static pod manifests.
-->
您可以使用 `kubeadm upgrade diff` 来查看将应用于静态 pod 清单的更改。

<!--
To use kube-dns with upgrades in Kubernetes v1.13.0 and later please follow [this guide](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon).
-->
要在 Kubernetes v1.13.0 及更高版本中使用 kube-dns 进行升级，请遵循[本指南](/docs/reference/setup-tools/kubeadm/kubeadm-init-phase/#cmd-phase-addon)。

<!--
In Kubernetes v1.15.0 and later, `kubeadm upgrade apply` and `kubeadm upgrade node` will also
automatically renew the kubeadm managed certificates on this node, including those stored in kubeconfig files.
To opt-out, it is possible to pass the flag `--certificate-renewal=false`. For more details about certificate
renewal see the [certificate management documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
-->
在 Kubernetes v1.15.0 和更高版本中，`kubeadm upgrade apply` 和 `kubeadm upgrade node` 也将自动续订该节点上的 kubeadm 托管证书，包括存储在 kubeconfig 文件中的证书。
要选择退出，可以传递参数 `--certificate-renewal=false`。有关证书续订的更多详细信息请参见[证书管理文档](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)。


## kubeadm upgrade plan {#cmd-upgrade-plan}
{{< include "generated/kubeadm_upgrade_plan.md" >}}

## kubeadm upgrade apply  {#cmd-upgrade-apply}
{{< include "generated/kubeadm_upgrade_apply.md" >}}

## kubeadm upgrade diff {#cmd-upgrade-diff}
{{< include "generated/kubeadm_upgrade_diff.md" >}}

## kubeadm upgrade node {#cmd-upgrade-node}
{{< include "generated/kubeadm_upgrade_node.md" >}}



## {{% heading "whatsnext" %}}

<!--
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade` -->
* 如果您使用 kubeadm v1.7.x 或更低版本初始化集群，则可以参考[kubeadm 配置](/docs/reference/setup-tools/kubeadm/kubeadm-config/)配置集群用于 `kubeadm upgrade`。

