---
title: kubeadm join phase
weight: 90
---
---
title: kubeadm join phase
weight: 90
---

<!--
In v1.14.0, kubeadm introduces the `kubeadm join phase` command with the aim of making kubeadm more modular. This modularity enables you to invoke atomic sub-steps of the join process.
Hence, you can let kubeadm do some parts and fill in yourself where you need customizations.
-->
在 v1.14.0 中 kubeadm 引入了 `kubeadm join phase` 命令，目的是使 kubeadm 更加模块化。这种模块化使你能够调用连接流程的原子步骤。
因此，你可以让 kubeadm 完成某些部分，并在需要自定义的地方自行完成。

<!--
`kubeadm join phase` is consistent with the [kubeadm join workflow](/docs/reference/setup-tools/kubeadm/kubeadm-join/#join-workflow),
and behind the scene both use the same code.
-->
`kubeadm join phase` 与 [kubeadm join 工作](/docs/reference/setup-tools/kubeadm/kubeadm-join/#join-workflow)是一致的，而在底层，两者使用相同的代码。

## kubeadm join phase {#cmd-join-phase}

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_join_phase.md" />}}
{{< /tabs >}}

## kubeadm join phase preflight {#cmd-join-phase-preflight}

<!--
Using this phase you can execute preflight checks on a joining node.
-->
使用此阶段命令，您可以对连接节点执行飞行前检查。

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_join_phase_preflight.md" />}}
{{< /tabs >}}

## kubeadm join phase control-plane-prepare {#cmd-join-phase-control-plane-prepare}

<!--
Using this phase you can prepare a node for serving a control-plane.
-->
使用此阶段命令，您可以为控制平面服务准备一个节点。

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
使用此阶段命令，你可以写 kubelet 设置、证书和（重新）启动 kubelet。

{{< tabs name="tab-kubelet-start" >}}
{{< tab name="kubelet-start" include="generated/kubeadm_join_phase_kubelet-start.md" />}}
{{< /tabs >}}

## kubeadm join phase control-plane-join {#cmd-join-phase-control-plane-join}

<!--
Using this phase you can join a node as a control-plane instance.
-->
使用此阶段命令，你可以加入一个节点作为控制平面实例。

{{< tabs name="tab-control-plane-join" >}}
{{< tab name="control-plane-join" include="generated/kubeadm_join_phase_control-plane-join.md" />}}
{{< tab name="all" include="generated/kubeadm_join_phase_control-plane-join_all.md" />}}
{{< tab name="etcd" include="generated/kubeadm_join_phase_control-plane-join_etcd.md" />}}
{{< tab name="update-status" include="generated/kubeadm_join_phase_control-plane-join_update-status.md" />}}
{{< tab name="mark-control-plane" include="generated/kubeadm_join_phase_control-plane-join_mark-control-plane.md" />}}
{{< /tabs >}}

<!--
## What's next
-->

## 下一步

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
-->

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
-->
