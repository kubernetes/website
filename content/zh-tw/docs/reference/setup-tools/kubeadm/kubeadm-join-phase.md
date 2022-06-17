---
title: kubeadm join phase
weight: 90
---

<!--
title: kubeadm join phase
weight: 90
-->

<!--
`kubeadm join phase` enables you to invoke atomic steps of the join process.
Hence, you can let kubeadm do some of the work and you can fill in the gaps
if you wish to apply customization.
-->
`kubeadm join phase` 使你能夠呼叫 `join` 過程的基本原子步驟。
因此，如果希望執行自定義操作，可以讓 kubeadm 做一些工作，然後由使用者來補足剩餘操作。

<!--
`kubeadm join phase` is consistent with the [kubeadm join workflow](/docs/reference/setup-tools/kubeadm/kubeadm-join/#join-workflow),
and behind the scene both use the same code.
-->
`kubeadm join phase` 與
[kubeadm join 工作流程](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/#join-workflow)
一致，後臺都使用相同的程式碼。

## kubeadm join phase {#cmd-join-phase}

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_join_phase.md" />}}
{{< /tabs >}}

## kubeadm join phase preflight {#cmd-join-phase-preflight}

<!--
Using this phase you can execute preflight checks on a joining node.
-->
使用此命令可以在即將加入叢集的節點上執行啟動前檢查。

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_join_phase_preflight.md" />}}
{{< /tabs >}}

## kubeadm join phase control-plane-prepare {#cmd-join-phase-control-plane-prepare}

<!--
Using this phase you can prepare a node for serving a control-plane.
-->
使用此階段，你可以準備一個作為控制平面的節點。

{{< tabs name="tab-control-plane-prepare" >}}
{{< tab name="control-plane-prepare" include="generated/kubeadm_join_phase_control-plane-prepare.md" />}}
{{< tab name="all" include="generated/kubeadm_join_phase_control-plane-prepare_all.md" />}}
{{< tab name="download-certs" include="generated/kubeadm_join_phase_control-plane-prepare_download-certs.md" />}}
{{< tab name="certs" include="generated/kubeadm_join_phase_control-plane-prepare_certs.md" />}}
{{< tab name="kubeconfig" include="generated/kubeadm_join_phase_control-plane-prepare_kubeconfig.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_join_phase_control-plane-prepare_control-plane.md" />}}
{{< /tabs >}}

## kubeadm join phase kubelet-start {#cmd-join-phase-kubelet-start}

<!--
Using this phase you can write the kubelet settings, certificates and (re)start the kubelet.
-->
使用此階段，你可以配置 kubelet 設定、證書和（重新）啟動 kubelet。

{{< tabs name="tab-kubelet-start" >}}
{{< tab name="kubelet-start" include="generated/kubeadm_join_phase_kubelet-start.md" />}}
{{< /tabs >}}

## kubeadm join phase control-plane-join {#cmd-join-phase-control-plane-join}

<!--
Using this phase you can join a node as a control-plane instance.
-->
使用此階段，你可以將節點作為控制平面例項加入。

{{< tabs name="tab-control-plane-join" >}}
{{< tab name="control-plane-join" include="generated/kubeadm_join_phase_control-plane-join.md" />}}
{{< tab name="all" include="generated/kubeadm_join_phase_control-plane-join_all.md" />}}
{{< tab name="etcd" include="generated/kubeadm_join_phase_control-plane-join_etcd.md" />}}
{{< tab name="update-status" include="generated/kubeadm_join_phase_control-plane-join_update-status.md" />}}
{{< tab name="mark-control-plane" include="generated/kubeadm_join_phase_control-plane-join_mark-control-plane.md" />}}
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
  將節點新增到叢集
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  恢復透過 `kubeadm init` 或 `kubeadm join` 操作對主機所做的任何更改
* [kubeadm alpha](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-alpha/)
  嘗試實驗性功能
