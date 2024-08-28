---
title: kubeadm upgrade phase
weight: 90
content_type: concept
---

<!--
In v1.15.0, kubeadm introduced preliminary support for `kubeadm upgrade node` phases.
Phases for other `kubeadm upgrade` sub-commands such as `apply`, could be added in the
following releases.
-->
在 Kubernetes v1.15.0 版本中，kubeadm 引入了对 `kubeadm upgrade node` 阶段的初步支持。
其他 `kubeadm upgrade` 子命令如 `apply` 等阶段将在未来发行版中添加。

<!--
## kubeadm upgrade node phase {#cmd-node-phase}
-->
## kubeadm upgrade node 阶段    {#cmd-node-phase}

<!--
Using this phase you can choose to execute the separate steps of the upgrade of
secondary control-plane or worker nodes. Please note that `kubeadm upgrade apply` still has to
be called on a primary control-plane node.
-->
使用此阶段，你可以选择执行辅助控制平面或工作节点升级的单独步骤。
请注意，`kubeadm upgrade apply` 命令仍然必须在主控制平面节点上调用。

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a kubeadm node
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
-->
* [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/) 引导一个 Kubernetes 控制平面节点
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/) 将节点加入到集群
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 还原 `kubeadm init` 或
  `kubeadm join` 命令对主机所做的任何更改
* [kubeadm upgrade](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) 升级 kubeadm 节点
* [kubeadm alpha](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) 尝试实验性功能
