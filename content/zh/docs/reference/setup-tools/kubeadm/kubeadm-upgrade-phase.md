---
title: kubeadm upgrade phase
weight: 90
---
<!--
In v1.15.0, kubeadm introduced preliminary support for `kubeadm upgrade node` phases.
Phases for other `kubeadm upgrade` sub-commands such as `apply`, could be added in the
following releases.
-->

在 v1.15.0 中，kubeadm 引入了对 `kubeadm升级节点` 的初步支持。
其他 `kubeadm upgrade` 子命令（如 `apply`）可以添加到以下版本中。

<!--
## kubeadm upgrade node phase {#cmd-node-phase}
-->

## kubeadm 升级单点阶段 {#cmd-node-phase}

<!--
Using this phase you can choose to execute the separate steps of the upgrade of
secondary control-plane or worker nodes. Please note that `kubeadm upgrade apply` still has to
be called on a primary control-plane node.
-->

使用此阶段，可以选择执行辅助控制平面或工作节点升级的单独步骤。请注意，`kubeadm upgrade apply`仍然必须在主控制平面节点上调用。

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< /tabs >}}

<!--
## What's next
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a kubeadm node
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
-->

## 接下来
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) 引导一个 Kubernetes 控制平面节点
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 将节点加入到群集
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 还原 `kubeadm init` 或 `kubeadm join` 对此主机所做的任何更改
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) 升级 kubeadm 节点
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) 尝试实验功能
