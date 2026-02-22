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
`kubeadm reset phase` 使你能够调用 `reset` 过程的基本原子步骤。
因此，如果希望执行自定义操作，你可以让 kubeadm 做一些工作，然后由用户来补足剩余操作。

<!--
`kubeadm reset phase` is consistent with the [kubeadm reset workflow](/docs/reference/setup-tools/kubeadm/kubeadm-reset/#reset-workflow),
and behind the scene both use the same code.
-->
`kubeadm reset phase` 与
[kubeadm reset 工作流程](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/#reset-workflow)一致，
后台都使用相同的代码。

## kubeadm reset phase {#cmd-reset-phase}

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_reset/kubeadm_reset_phase.md" />}}
{{< /tabs >}}

## kubeadm reset phase preflight {#cmd-reset-phase-preflight}

<!--
Using this phase you can execute preflight checks on a node that is being reset.
-->
使用此阶段，你可以在要重置的节点上执行启动前检查阶段。

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
使用此阶段，你可以从 etcd 集群中移除此控制平面节点的 etcd 成员。

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
使用此阶段，你可以在此节点上执行清理工作。

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
  引导 Kubernetes 控制平面节点
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  将节点添加到集群
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  恢复通过 `kubeadm init` 或 `kubeadm join` 操作对主机所做的任何更改
* [kubeadm alpha](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-alpha/)
  尝试实验性功能
