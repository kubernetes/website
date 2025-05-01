---
title: kubeadm upgrade
content_type: concept
weight: 40
---
<!--
reviewers:
- luxas
- jbeda
title: kubeadm upgrade
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
`kubeadm upgrade` is a user-friendly command that wraps complex upgrading logic
behind one command, with support for both planning an upgrade and actually performing it.
-->
`kubeadm upgrade` 是一个对用户友好的命令，它将复杂的升级逻辑包装在一条命令后面，支持升级的规划和实际执行。

<!-- body -->

<!--
## kubeadm upgrade guidance
-->
## kubeadm upgrade 指南    {#kubeadm-upgrade-guidance}

<!--
The steps for performing an upgrade using kubeadm are outlined in [this document](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
For older versions of kubeadm, please refer to older documentation sets of the Kubernetes website.
-->
[本文档](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)概述使用
kubeadm 执行升级的步骤。与 kubeadm 旧版本相关的文档，请参阅 Kubernetes 网站的旧版文档。

<!--
You can use `kubeadm upgrade diff` to see the changes that would be applied to static pod manifests.
-->
你可以使用 `kubeadm upgrade diff` 来查看将应用于静态 Pod 清单的更改。

<!--
In Kubernetes v1.15.0 and later, `kubeadm upgrade apply` and `kubeadm upgrade node` will also
automatically renew the kubeadm managed certificates on this node, including those stored in kubeconfig files.
To opt-out, it is possible to pass the flag `--certificate-renewal=false`. For more details about certificate
renewal see the [certificate management documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
-->
在 Kubernetes v1.15.0 和更高版本中，`kubeadm upgrade apply` 和 `kubeadm upgrade node`
也将自动续订节点上的 kubeadm 托管证书，包括存储在 kubeconfig 文件中的证书。
如果不想续订，可以传递参数 `--certificate-renewal=false`。
有关证书续订的更多详细信息请参见[证书管理文档](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)。

{{< note >}}
<!-- 
The commands `kubeadm upgrade apply` and `kubeadm upgrade plan` have a legacy `--config`
flag which makes it possible to reconfigure the cluster, while performing planning or upgrade of that particular
control-plane node. Please be aware that the upgrade workflow was not designed for this scenario and there are
reports of unexpected results.
-->
`kubeadm upgrade apply` 和 `kubeadm upgrade plan` 命令都具有遗留的 `--config` 标志，
可以在执行特定控制平面节点的规划或升级时重新配置集群。
请注意，升级工作流不是为这种情况而设计的，并且有意外结果的报告。
{{</ note >}}

## kubeadm upgrade plan {#cmd-upgrade-plan}

{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_plan.md" >}}

## kubeadm upgrade apply  {#cmd-upgrade-apply}

{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_apply.md" >}}

## kubeadm upgrade diff {#cmd-upgrade-diff}

{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_diff.md" >}}

## kubeadm upgrade node {#cmd-upgrade-node}

{{< include "generated/kubeadm_upgrade/kubeadm_upgrade_node.md" >}}

## {{% heading "whatsnext" %}}

<!--
* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/) if you initialized your cluster using kubeadm v1.7.x or lower, to configure your cluster for `kubeadm upgrade`
-->
* 如果你使用 kubeadm v1.7.x 或更低版本初始化了集群，则可以参考
  [kubeadm config](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)，
  为 `kubeadm upgrade` 配置你的集群。
