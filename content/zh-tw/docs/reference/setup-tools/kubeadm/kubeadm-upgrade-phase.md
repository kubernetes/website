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

在 Kubernetes v1.15.0 版本中，kubeadm 引入了對 `kubeadm upgrade node` 階段的初步支援。其他 `kubeadm upgrade` 子命令如 `apply` 等階段將在未來發行版中新增。

<!--
## kubeadm upgrade node phase {#cmd-node-phase}
-->

## kubeadm upgrade node phase {#cmd-node-phase}

<!--
Using this phase you can choose to execute the separate steps of the upgrade of
secondary control-plane or worker nodes. Please note that `kubeadm upgrade apply` still has to
be called on a primary control-plane node.
-->

使用此階段，可以選擇執行輔助控制平面或工作節點升級的單獨步驟。請注意，`kubeadm upgrade apply` 命令仍然必須在主控制平面節點上呼叫。

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade_node_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) to upgrade a kubeadm node
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
-->
* [kubeadm init](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/) 引導一個 Kubernetes 控制平面節點
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/) 將節點加入到叢集
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 還原 `kubeadm init` 或 `kubeadm join` 命令對主機所做的任何更改
* [kubeadm upgrade](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-upgrade/) 升級 kubeadm 節點
* [kubeadm alpha](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) 嘗試實驗性功能
