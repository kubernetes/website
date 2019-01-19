---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm alpha
weight: 90
---
{{< caution >}}

<!--
`kubeadm alpha` provides a preview of a set of features made available for gathering feedback
 from the community. Please try it out and give us feedback!
-->
`kubeadm alpha` 提供一组功能的预览，这些功能可用于从社区收集反馈。请尝试一下并给我们反馈!

{{< /caution >}}

<!--
In v1.8.0, kubeadm introduced the `kubeadm alpha phase` command with the aim of making kubeadm more modular. This modularity enables you to invoke atomic sub-steps of the bootstrap process; you can let kubeadm do some parts and fill in yourself where you need customizations.
-->
在 v1.8.0 中，kubeadm 引入了 `kubeadm alpha phase` 命令，目的是使 kubeadm 更加模块化。这种模块化使您可以调用引导过程的原子子步骤; 你可以让 kubeadm 做一些部分并填写你需要自定义的地方。

<!--
`kubeadm alpha phase` is consistent with [kubeadm init workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow),
and behind the scene both use the same code.
-->
`kubeadm alpha phase` 与 [kubeadm init 工作流程](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow)一致，并且在后台两者使用相同的代码。

## kubeadm alpha phase preflight {#cmd-phase-preflight}

<!--
You can execute preflight checks both for the master node, like in `kubeadm init`, or for the worker node
like in `kubeadm join`.
-->
您可以对主节点如 `kubeadm init` 或工作节点如 `kubeadm join` 执行预运行检查。

{{< tabs name="tab-preflight" >}}
{{< tab name="master" include="generated/kubeadm_alpha_phase_preflight_master.md" />}}
{{< tab name="node" include="generated/kubeadm_alpha_phase_preflight_node.md" />}}
{{< /tabs >}}


## kubeadm alpha phase certs {#cmd-phase-certs}

<!--
You can create all required certificates with the `all` subcommand or selectively create certificates.
-->
您可以使用 `all` 子命令创建所有所需的证书，也可以选择性地创建证书。

{{< tabs name="tab-certs" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_certs_all.md" />}}
{{< tab name="ca" include="generated/kubeadm_alpha_phase_certs_ca.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_alpha_phase_certs_apiserver.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_alpha_phase_certs_apiserver-kubelet-client.md" />}}
{{< tab name="sa" include="generated/kubeadm_alpha_phase_certs_sa.md" />}}
{{< tab name="front-proxy-ca" include="generated/kubeadm_alpha_phase_certs_front-proxy-ca.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_alpha_phase_certs_front-proxy-client.md" />}}
{{< /tabs >}}

## kubeadm alpha phase certs renew {#cmd-phase-certs-renew}

<!--
You can renew all Kubernetes certificates using the `all` subcommand or renew them selectively.
-->
您可以使用 `all` 子命令续期所有 Kubernetes 证书，也可以选择的地续期它们。

{{< tabs name="tab-certs-renew" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_certs_renew_all.md" />}}
{{< tab name="apiserver-etcd-client" include="generated/kubeadm_alpha_phase_certs_renew_apiserver-etcd-client.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_alpha_phase_certs_renew_apiserver-kubelet-client.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_alpha_phase_certs_renew_apiserver.md" />}}
{{< tab name="etcd-healthcheck-client" include="generated/kubeadm_alpha_phase_certs_renew_etcd-healthcheck-client.md" />}}
{{< tab name="etcd-peer" include="generated/kubeadm_alpha_phase_certs_renew_etcd-peer.md" />}}
{{< tab name="etcd-server" include="generated/kubeadm_alpha_phase_certs_renew_etcd-server.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_alpha_phase_certs_renew_front-proxy-client.md" />}}
{{< /tabs >}}

## kubeadm alpha phase kubeconfig {#cmd-phase-kubeconfig}

<!--
You can create all required kubeconfig files with the `all` subcommand, or selectively create the files.
Additionally, the `user` subcommand supports the creation of kubeconfig files for additional users.
-->
您可以使用 `all` 子命令创建所有所需的 kubeconfig 文件，或者有选择地创建文件。
此外 `user` 子命令支持为其他用户创建 kubeconfig 文件。

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_kubeconfig_all.md" />}}
{{< tab name="admin" include="generated/kubeadm_alpha_phase_kubeconfig_admin.md" />}}
{{< tab name="kubelet" include="generated/kubeadm_alpha_phase_kubeconfig_kubelet.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_alpha_phase_kubeconfig_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_alpha_phase_kubeconfig_scheduler.md" />}}
{{< tab name="user" include="generated/kubeadm_alpha_phase_kubeconfig_user.md" />}}
{{< /tabs >}}

## kubeadm alpha phase kubelet {#cmd-phase-kubelet}

<!--
Use the following commands to manage the kubelet phase.
-->
使用以下命令管理 kubelet 阶段。

{{< tabs name="tab-kubelet" >}}
{{< tab name="config annotate-cri" include="generated/kubeadm_alpha_phase_kubelet_config_annotate-cri.md" />}}
{{< tab name="config download" include="generated/kubeadm_alpha_phase_kubelet_config_download.md" />}}
{{< tab name="config enable-dynamic" include="generated/kubeadm_alpha_phase_kubelet_config_enable-dynamic.md" />}}
{{< tab name="config upload" include="generated/kubeadm_alpha_phase_kubelet_config_upload.md" />}}
{{< tab name="config write-to-disk" include="generated/kubeadm_alpha_phase_kubelet_config_write-to-disk.md" />}}
{{< tab name="write-env-file" include="generated/kubeadm_alpha_phase_kubelet_write-env-file.md" />}}
{{< /tabs >}}

## kubeadm alpha phase controlplane {#cmd-phase-controlplane}

<!--
You can create all required static Pod files for the control plane components with the `all` subcommand,
or selectively create the files.
-->
您可以使用 `all` 子命令为控制平面组件创建所有必需的静态 Pod 文件，或者有选择地创建文件。

{{< tabs name="tab-controlplane" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_controlplane_all.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_alpha_phase_controlplane_apiserver.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_alpha_phase_controlplane_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_alpha_phase_controlplane_scheduler.md" />}}
{{< /tabs >}}


## kubeadm alpha phase etcd {#cmd-phase-etcd}

<!--
Use the following command to create a self-hosted, local etcd instance based on a static Pod file.
-->
使用以下命令基于静态 Pod 文件创建自托管的本地 etcd 实例。

{{< tabs name="tab-etcd" >}}
{{< tab name="etcd local" include="generated/kubeadm_alpha_phase_etcd_local.md" />}}
{{< /tabs >}}


## kubeadm alpha phase mark-master {#cmd-phase-mark-master}

<!--
Use the following command to label and taint the node with the `node-role.kubernetes.io/master=""` key-value pair.
-->
使用以下命令 `node-role.kubernetes.io/master=""` 键值对标记和污染节点。

{{< tabs name="tab-mark-master" >}}
{{< tab name="mark-master" include="generated/kubeadm_alpha_phase_mark-master.md" />}}
{{< /tabs >}}


## kubeadm alpha phase bootstrap-token {#cmd-phase-bootstrap-token}

<!--
Use the following actions to fully configure bootstrap tokens.
You can fully configure bootstrap tokens with the `all` subcommand,
or selectively configure single elements.
-->
使用以下操作来完全配置引导令牌。您可以使用 `all` 子命令完全配置引导令牌，或者选择配置单个元素。

{{< tabs name="tab-bootstrap-token" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_bootstrap-token_all.md" />}}
{{< tab name="create" include="generated/kubeadm_alpha_phase_bootstrap-token_create.md" />}}
{{< tab name="cluster-info" include="generated/kubeadm_alpha_phase_bootstrap-token_cluster-info.md " />}}
{{< tab name="node allow-auto-approve" include="generated/kubeadm_alpha_phase_bootstrap-token_node_allow-auto-approve.md" />}}
{{< tab name="node allow-post-csrs" include="generated/kubeadm_alpha_phase_bootstrap-token_node_allow-post-csrs.md" />}}
{{< /tabs >}}


## kubeadm alpha phase upload-config {#cmd-phase-upload-config}

<!--
You can use this command to upload the kubeadm configuration to your cluster.
Alternatively, you can use [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/).
-->
可以使用此命令将 kubeadm 配置上传到集群。或者，您可以使用 [kubeadm config]/docs/reference/setup-tools/kubeadm/kubeadm-config/)。

{{< tabs name="upload-config" >}}
{{< tab name="mark-master" include="generated/kubeadm_alpha_phase_upload-config.md" />}}
{{< /tabs >}}


## kubeadm alpha phase addon {#cmd-phase-addon}

<!--
You can install all the available addons with the `all` subcommand, or
install them selectively.
-->
您可以使用“all”子命令安装所有可用的插件，也可以选择安装它们。

{{< note >}}

<!--
If `kubeadm` is invoked with `--feature-gates=CoreDNS=false`, kube-dns is installed.
-->
如果用 `--feature-gates=CoreDNS=false`，调用 `kubeadm` 则安装 kube-dns。

{{< /note >}}

{{< tabs name="tab-addon" >}}
{{< tab name="all" include="generated/kubeadm_alpha_phase_addon_all.md" />}}
{{< tab name="kube-proxy" include="generated/kubeadm_alpha_phase_addon_kube-proxy.md" />}}
{{< tab name="coredns" include="generated/kubeadm_alpha_phase_addon_coredns.md" />}}
{{< /tabs >}}


## kubeadm alpha phase self-hosting {#cmd-phase-self-hosting}
 

{{< caution >}}

<!--
Self-hosting is an alpha feature. See [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) documentation for self-hosting limitations.
-->
自托管是 alpha 的一个特性。查看 [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) documentation for self-hosting limitations。

{{< /caution >}}

{{< tabs name="tab-self-hosting" >}}
{{< tab name="self-hosting" include="generated/kubeadm_alpha_phase_selfhosting_convert-from-staticpods.md" />}}
{{< /tabs >}}

<!--

## What's next
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes master node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->

## What's next
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) 创建 Kubernetes 主节点
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 将一个节点加入到集群
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 还原 `kubeadm init` 或 `kubeadm join` 对该主机所做的任何更改

