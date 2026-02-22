---
title: kubeadm upgrade phases
weight: 40
content_type: concept
---

<!--
## kubeadm upgrade apply phase {#cmd-apply-phase}

Using the phases of `kubeadm upgrade apply`, you can choose to execute the separate steps of the initial upgrade
of a control plane node.
-->
## kubeadm upgrade apply 阶段   {#cmd-apply-phase}

使用 `kubeadm upgrade apply` 的各个阶段，
你可以选择执行控制平面节点初始升级的单独步骤。

{{< tabs name="tab-apply-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_control-plane.md" />}}
{{< tab name="upload-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_upload-config.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_kubelet-config.md" />}}
{{< tab name="bootstrap-token" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_bootstrap-token.md" />}}
{{< tab name="addon" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_addon.md" />}}
{{< tab name="post-upgrade" include="generated/kubeadm_upgrade/kubeadm_upgrade_apply_phase_post-upgrade.md" />}}
{{< /tabs >}}

<!--
## kubeadm upgrade node phase {#cmd-node-phase}
-->
## kubeadm upgrade node 阶段    {#cmd-node-phase}

<!--
Using the phases of `kubeadm upgrade node` you can choose to execute the separate steps of the upgrade of
secondary control-plane or worker nodes.
-->
使用 `kubeadm upgrade node` 的各个阶段，你可以选择执行次要控制平面节点或工作节点升级的单独步骤。

{{< tabs name="tab-apply-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< tab name="addon" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_addon.md" />}}
{{< tab name="post-upgrade" include="generated/kubeadm_upgrade/kubeadm_upgrade_node_phase_post-upgrade.md" />}}
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
