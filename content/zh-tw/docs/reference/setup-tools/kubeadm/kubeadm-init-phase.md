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
`kubeadm init phase` 能確保呼叫引導過程的原子步驟。
因此，如果希望自定義應用，則可以讓 kubeadm 做一些工作，然後填補空白。

<!--
`kubeadm init phase` is consistent with the [kubeadm init workflow](/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow),
and behind the scene both use the same code.
-->
`kubeadm init phase` 與 [kubeadm init 工作流](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-init/#init-workflow)
一致，後臺都使用相同的程式碼。

<!--
## kubeadm init phase preflight {#cmd-phase-preflight}
-->
## kubeadm init phase preflight {#cmd-phase-preflight}

<!--
Using this command you can execute preflight checks on a control-plane node.
-->
使用此命令可以在控制平面節點上執行啟動前檢查。

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
此階段將檢查 kubelet 配置檔案和環境檔案，然後啟動 kubelet。

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
該階段可用於建立 kubeadm 所需的所有證書。

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
可以透過呼叫 `all` 子命令來建立所有必需的 kubeconfig 檔案，或者分別呼叫它們。


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
使用此階段，可以為控制平面元件建立所有必需的靜態 Pod 檔案。

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
根據靜態 Pod 檔案，使用以下階段建立本地 etcd 例項。

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
可以使用此命令將 kubeadm 配置檔案上傳到叢集。或者使用
[kubeadm config](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-config/)。

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
使用以下階段將控制平面證書上傳到叢集。預設情況下，證書和加密金鑰會在兩個小時後過期。

{{< tabs name="tab-upload-certs" >}}
{{< tab name="upload-certs" include="generated/kubeadm_init_phase_upload-certs.md" />}}
{{< /tabs >}}


<!--
## kubeadm init phase mark-control-plane {#cmd-phase-mark-control-plane}
-->
## kubeadm init phase mark-control-plane {#cmd-phase-mark-control-plane}

<!--
Use the following phase to label and taint the node as a control plane node.
-->
使用以下階段來給作為控制平面的節點
打標籤（label）和記錄汙點（taint）。

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
使用以下階段來配置引導令牌。

{{< tabs name="tab-bootstrap-token" >}}
{{< tab name="bootstrap-token" include="generated/kubeadm_init_phase_bootstrap-token.md" />}}
{{< /tabs >}}

## kubeadm init phase kubelet-finalize {#cmd-phase-kubelet-finalize-all}

<!-- 
Use the following phase to update settings relevant to the kubelet after TLS
bootstrap. You can use the `all` subcommand to run all `kubelet-finalize`
phases.
-->
使用以下階段在 TLS 引導後更新與 kubelet 相關的設定。
你可以使用 `all` 子命令來執行所有 `kubelet-finalize` 階段。

{{< tabs name="tab-kubelet-finalize" >}}
{{< tab name="kubelet-finalize" include="generated/kubeadm_init_phase_kubelet-finalize.md" />}}
{{< tab name="kubelet-finalize-all" include="generated/kubeadm_init_phase_kubelet-finalize_all.md" />}}
{{< tab name="kubelet-finalize-cert-rotation" include="generated/kubeadm_init_phase_kubelet-finalize_experimental-cert-rotation.md" />}}
{{< /tabs >}}

<!--
## kubeadm init phase addon {#cmd-phase-addon}
-->
## kubeadm init phase addon {#cmd-phase-addon}

<!--
You can install all the available addons with the `all` subcommand, or
install them selectively.
-->
可以使用 `all` 子命令安裝所有可用的外掛，或者有選擇性地安裝它們。

{{< tabs name="tab-addon" >}}
{{< tab name="addon" include="generated/kubeadm_init_phase_addon.md" />}}
{{< tab name="all" include="generated/kubeadm_init_phase_addon_all.md" />}}
{{< tab name="coredns" include="generated/kubeadm_init_phase_addon_coredns.md" />}}
{{< tab name="kube-proxy" include="generated/kubeadm_init_phase_addon_kube-proxy.md" />}}
{{< /tabs >}}

<!--
For more details on each field in the `v1beta3` configuration you can navigate to our
[API reference pages.](/docs/reference/config-api/kubeadm-config.v1beta3/)
-->
有關 `v1beta3` 配置中每個欄位的更多詳細資訊，可以訪問
[API](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3/)。

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
  將節點加入到叢集
* [kubeadm reset](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  恢復透過 `kubeadm init` 或 `kubeadm join` 操作對主機所做的任何更改
* [kubeadm alpha](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-alpha/)
  嘗試實驗性功能
