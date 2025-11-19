---
title: kubeadm reset phase
weight: 90
content_type: concept
---
<!--
title: kubeadm reset phase
weight: 90
content_type: concept
-->

<!--
`kubeadm reset phase` enables you to invoke atomic steps of the node reset process.
Hence, you can let kubeadm do some of the work and you can fill in the gaps
if you wish to apply customization.
-->
`kubeadm reset phase` 使你能夠調用 `reset` 過程的基本原子步驟。
因此，如果希望執行自定義操作，你可以讓 kubeadm 做一些工作，然後由使用者來補足剩餘操作。

<!--
`kubeadm reset phase` is consistent with the [kubeadm reset workflow](/docs/reference/setup-tools/kubeadm/kubeadm-reset/#reset-workflow),
and behind the scene both use the same code.
-->
`kubeadm reset phase` 與
[kubeadm reset 工作流程](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/#reset-workflow)一致，
後臺都使用相同的代碼。

## kubeadm reset phase {#cmd-reset-phase}

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_reset/kubeadm_reset_phase.md" />}}
{{< /tabs >}}

## kubeadm reset phase preflight {#cmd-reset-phase-preflight}

<!--
Using this phase you can execute preflight checks on a node that is being reset.
-->
使用此階段，你可以在要重置的節點上執行啓動前檢查階段。

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_reset/kubeadm_reset_phase_preflight.md" />}}
{{< /tabs >}}

<!--
## kubeadm reset phase remove-etcd-member
-->
## kubeadm reset phase remove-etcd-member {#cmd-reset-phase-remove-etcd-member}

<!--
Using this phase you can remove this control-plane node's etcd member from the etcd cluster.
-->
使用此階段，你可以從 etcd 叢集中移除此控制平面節點的 etcd 成員。

{{< tabs name="tab-remove-etcd-member" >}}
{{< tab name="remove-etcd-member" include="generated/kubeadm_reset/kubeadm_reset_phase_remove-etcd-member.md" />}}
{{< /tabs >}}

<!--
## kubeadm reset phase cleanup-node
-->
## kubeadm reset phase cleanup-node {#cmd-reset-phase-cleanup-node}

<!--
Using this phase you can perform cleanup on this node.
-->
使用此階段，你可以在此節點上執行清理工作。

{{< tabs name="tab-cleanup-node" >}}
{{< tab name="cleanup-node" include="generated/kubeadm_reset/kubeadm_reset_phase_cleanup-node.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
-->
* [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/)
  引導 Kubernetes 控制平面節點
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  將節點添加到叢集
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  恢復通過 `kubeadm init` 或 `kubeadm join` 操作對主機所做的任何更改
* [kubeadm alpha](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-alpha/)
  嘗試實驗性功能
