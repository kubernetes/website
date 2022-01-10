---
title: kubeadm init phase
weight: 90
content_type: concept
---
<!--
title: kubeadm init phase
weight: 90
content_type: concept
-->

<!--
`kubeadm init phase` enables you to invoke atomic steps of the bootstrap process.
Hence, you can let kubeadm do some of the work and you can fill in the gaps
if you wish to apply customization.
-->
`kubeadm init phase` 能确保调用引导过程的原子步骤。
因此，如果希望自定义应用，则可以让 kubeadm 做一些工作，然后填补空白。

<!--
`kubeadm init phase` is consistent with the [kubeadm init workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow),
and behind the scene both use the same code.
-->
`kubeadm init phase` 与 [kubeadm init 工作流](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow)
一致，后台都使用相同的代码。

<!--
## kubeadm init phase preflight {#cmd-phase-preflight}
-->
## kubeadm init phase preflight {#cmd-phase-preflight}

<!--
Using this command you can execute preflight checks on a control-plane node.
-->
使用此命令可以在控制平面节点上执行启动前检查。

{{< tabs name="tab-preflight" >}}
{{< tab name="preflight" include="generated/kubeadm_init_phase_preflight.md" />}}
{{< /tabs >}}

<!--
## kubeadm init phase kubelet-start {#cmd-phase-kubelet-start}
-->
## kubeadm init phase kubelet-start {#cmd-phase-kubelet-start}

<!--
This phase will write the kubelet configuration file and environment file and then start the kubelet.
-->
此阶段将检查 kubelet 配置文件和环境文件，然后启动 kubelet。

{{< tabs name="tab-kubelet-start" >}}
{{< tab name="kubelet-start" include="generated/kubeadm_init_phase_kubelet-start.md" />}}
{{< /tabs >}}

<!--
## kubeadm init phase certs {#cmd-phase-certs}
-->
## kubeadm init phase certs {#cmd-phase-certs}

<!--
Can be used to create all required certificates by kubeadm.
-->
该阶段可用于创建 kubeadm 所需的所有证书。

{{< tabs name="tab-certs" >}}
{{< tab name="certs" include="generated/kubeadm_init_phase_certs.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_certs_all.md" />}}
{{< tab name="ca" include="generated/kubeadm_init_phase_certs_ca.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_init_phase_certs_apiserver.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_init_phase_certs_apiserver-kubelet-client.md" />}}
{{< tab name="front-proxy-ca" include="generated/kubeadm_init_phase_certs_front-proxy-ca.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_init_phase_certs_front-proxy-client.md" />}}
{{< tab name="etcd-ca" include="generated/kubeadm_init_phase_certs_etcd-ca.md" />}}
{{< tab name="etcd-server" include="generated/kubeadm_init_phase_certs_etcd-server.md" />}}
{{< tab name="etcd-peer" include="generated/kubeadm_init_phase_certs_etcd-peer.md" />}}
{{< tab name="healthcheck-client" include="generated/kubeadm_init_phase_certs_etcd-healthcheck-client.md" />}}
{{< tab name="apiserver-etcd-client" include="generated/kubeadm_init_phase_certs_apiserver-etcd-client.md" />}}
{{< tab name="sa" include="generated/kubeadm_init_phase_certs_sa.md" />}}
{{< /tabs >}}

<!--
## kubeadm init phase kubeconfig {#cmd-phase-kubeconfig}
-->
## kubeadm init phase kubeconfig {#cmd-phase-kubeconfig}

<!--
You can create all required kubeconfig files by calling the `all` subcommand or call them individually.
-->
可以通过调用 `all` 子命令来创建所有必需的 kubeconfig 文件，或者分别调用它们。


{{< tabs name="tab-kubeconfig" >}}
{{< tab name="kubeconfig" include="generated/kubeadm_init_phase_kubeconfig.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_kubeconfig_all.md" />}}
{{< tab name="admin" include="generated/kubeadm_init_phase_kubeconfig_admin.md" />}}
{{< tab name="kubelet" include="generated/kubeadm_init_phase_kubeconfig_kubelet.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_init_phase_kubeconfig_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_init_phase_kubeconfig_scheduler.md" />}}
{{< /tabs >}}

<!--
## kubeadm init phase control-plane {#cmd-phase-control-plane}
-->
## kubeadm init phase control-plane {#cmd-phase-control-plane}

<!--
Using this phase you can create all required static Pod files for the control plane components.
-->
使用此阶段，可以为控制平面组件创建所有必需的静态 Pod 文件。

{{< tabs name="tab-control-plane" >}}
{{< tab name="control-plane" include="generated/kubeadm_init_phase_control-plane.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_control-plane_all.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_init_phase_control-plane_apiserver.md" />}}
{{< tab name="controller-manager" include="generated/kubeadm_init_phase_control-plane_controller-manager.md" />}}
{{< tab name="scheduler" include="generated/kubeadm_init_phase_control-plane_scheduler.md" />}}
{{< /tabs >}}


<!--
## kubeadm init phase etcd {#cmd-phase-etcd}
-->
## kubeadm init phase etcd {#cmd-phase-etcd}

<!--
Use the following phase to create a local etcd instance based on a static Pod file.
-->
根据静态 Pod 文件，使用以下阶段创建本地 etcd 实例。

{{< tabs name="tab-etcd" >}}
{{< tab name="etcd" include="generated/kubeadm_init_phase_etcd.md" />}}
{{< tab name="local" include="generated/kubeadm_init_phase_etcd_local.md" />}}
{{< /tabs >}}


<!--
## kubeadm init phase upload-config {#cmd-phase-upload-config}
-->
## kubeadm init phase upload-config {#cmd-phase-upload-config}

<!--
You can use this command to upload the kubeadm configuration to your cluster.
Alternatively, you can use [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/).
-->
可以使用此命令将 kubeadm 配置文件上传到集群。或者使用
[kubeadm config](/zh/docs/reference/setup-tools/kubeadm/kubeadm-config/)。

{{< tabs name="upload-config" >}}
{{< tab name="upload-config" include="generated/kubeadm_init_phase_upload-config.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_upload-config_all.md" />}}
{{< tab name="kubeadm" include="generated/kubeadm_init_phase_upload-config_kubeadm.md" />}}
{{< tab name="kubelet" include="generated/kubeadm_init_phase_upload-config_kubelet.md" />}}
{{< /tabs >}}


<!--
## kubeadm init phase upload-certs {#cmd-phase-upload-certs}
-->
## kubeadm init phase upload-certs {#cmd-phase-upload-certs}

<!--
Use the following phase to upload control-plane certificates to the cluster.
By default the certs and encryption key expire after two hours.
-->
使用以下阶段将控制平面证书上传到集群。默认情况下，证书和加密密钥会在两个小时后过期。

{{< tabs name="tab-upload-certs" >}}
{{< tab name="upload-certs" include="generated/kubeadm_init_phase_upload-certs.md" />}}
{{< /tabs >}}


<!--
## kubeadm init phase mark-control-plane {#cmd-phase-mark-control-plane}
-->
## kubeadm init phase mark-control-plane {#cmd-phase-mark-control-plane}

<!--
Use the following phase to label and taint the node with the `node-role.kubernetes.io/master=""` key-value pair.
-->
使用以下阶段来给具有 `node-role.kubernetes.io/master=""` 键值对的节点
打标签（label）和记录污点（taint）。

{{< tabs name="tab-mark-control-plane" >}}
{{< tab name="mark-control-plane" include="generated/kubeadm_init_phase_mark-control-plane.md" />}}
{{< /tabs >}}


<!--
## kubeadm init phase bootstrap-token {#cmd-phase-bootstrap-token}
-->
## kubeadm init phase bootstrap-token {#cmd-phase-bootstrap-token}

<!--
Use the following phase to configure bootstrap tokens.
-->
使用以下阶段来配置引导令牌。

{{< tabs name="tab-bootstrap-token" >}}
{{< tab name="bootstrap-token" include="generated/kubeadm_init_phase_bootstrap-token.md" />}}
{{< /tabs >}}

## kubeadm init phase kubelet-finialize {#cmd-phase-kubelet-finalize-all}

<!-- 
Use the following phase to update settings relevant to the kubelet after TLS
bootstrap. You can use the `all` subcommand to run all `kubelet-finalize`
phases.
-->
使用以下阶段在 TLS 引导后更新与 kubelet 相关的设置。
你可以使用 `all` 子命令来运行所有 `kubelet-finalize` 阶段。

{{< tabs name="tab-kubelet-finalize" >}}
{{< tab name="kublet-finalize" include="generated/kubeadm_init_phase_kubelet-finalize.md" />}}
{{< tab name="kublet-finalize-all" include="generated/kubeadm_init_phase_kubelet-finalize_all.md" />}}
{{< tab name="kublet-finalize-cert-rotation" include="generated/kubeadm_init_phase_kubelet-finalize_experimental-cert-rotation.md" />}}
{{< /tabs >}}

<!--
## kubeadm init phase addon {#cmd-phase-addon}
-->
## kubeadm init phase addon {#cmd-phase-addon}

<!--
You can install all the available addons with the `all` subcommand, or
install them selectively.
-->
可以使用 `all` 子命令安装所有可用的插件，或者有选择性地安装它们。

{{< tabs name="tab-addon" >}}
{{< tab name="addon" include="generated/kubeadm_init_phase_addon.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_addon_all.md" />}}
{{< tab name="coredns" include="generated/kubeadm_init_phase_addon_coredns.md" />}}
{{< tab name="kube-proxy" include="generated/kubeadm_init_phase_addon_kube-proxy.md" />}}
{{< /tabs >}}

<!--
For more details on each field in the `v1beta2` configuration you can navigate to our
[API reference pages.] (https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)
-->
有关 `v1beta2` 配置中每个字段的更多详细信息，可以访问
[API](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)。

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/) to try experimental functionality
-->
* [kubeadm init](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init/)
  引导 Kubernetes 控制平面节点
* [kubeadm join](/zh/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  将节点加入到集群
* [kubeadm reset](/zh/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  恢复通过 `kubeadm init` 或 `kubeadm join` 操作对主机所做的任何更改
* [kubeadm alpha](/zh/docs/reference/setup-tools/kubeadm/kubeadm-alpha/)
  尝试实验性功能
