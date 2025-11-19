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
`kubeadm upgrade` 是一個對使用者友好的命令，它將複雜的升級邏輯包裝在一條命令後面，支持升級的規劃和實際執行。

<!-- body -->

<!--
## kubeadm upgrade guidance
-->
## kubeadm upgrade 指南    {#kubeadm-upgrade-guidance}

<!--
The steps for performing an upgrade using kubeadm are outlined in [this document](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/).
For older versions of kubeadm, please refer to older documentation sets of the Kubernetes website.
-->
[本文檔](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)概述使用
kubeadm 執行升級的步驟。與 kubeadm 舊版本相關的文檔，請參閱 Kubernetes 網站的舊版文檔。

<!--
You can use `kubeadm upgrade diff` to see the changes that would be applied to static pod manifests.
-->
你可以使用 `kubeadm upgrade diff` 來查看將應用於靜態 Pod 清單的更改。

<!--
In Kubernetes v1.15.0 and later, `kubeadm upgrade apply` and `kubeadm upgrade node` will also
automatically renew the kubeadm managed certificates on this node, including those stored in kubeconfig files.
To opt-out, it is possible to pass the flag `--certificate-renewal=false`. For more details about certificate
renewal see the [certificate management documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
-->
在 Kubernetes v1.15.0 和更高版本中，`kubeadm upgrade apply` 和 `kubeadm upgrade node`
也將自動續訂節點上的 kubeadm 託管證書，包括存儲在 kubeconfig 文件中的證書。
如果不想續訂，可以傳遞參數 `--certificate-renewal=false`。
有關證書續訂的更多詳細信息請參見[證書管理文檔](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)。

{{< note >}}
<!-- 
The commands `kubeadm upgrade apply` and `kubeadm upgrade plan` have a legacy `--config`
flag which makes it possible to reconfigure the cluster, while performing planning or upgrade of that particular
control-plane node. Please be aware that the upgrade workflow was not designed for this scenario and there are
reports of unexpected results.
-->
`kubeadm upgrade apply` 和 `kubeadm upgrade plan` 命令都具有遺留的 `--config` 標誌，
可以在執行特定控制平面節點的規劃或升級時重新設定叢集。
請注意，升級工作流不是爲這種情況而設計的，並且有意外結果的報告。
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
* 如果你使用 kubeadm v1.7.x 或更低版本初始化了叢集，則可以參考
  [kubeadm config](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)，
  爲 `kubeadm upgrade` 設定你的叢集。
