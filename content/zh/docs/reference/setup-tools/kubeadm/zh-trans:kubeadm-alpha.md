---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm alpha
weight: 90
---
<!--
---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm alpha
weight: 90
---
-->
{{< caution >}}
<!--
`kubeadm alpha` provides a preview of a set of features made available for gathering feedback
 from the community. Please try it out and give us feedback!
-->
 `kubeadm alpha`提供了一组来自社区的可用于收集反馈的功能都预览。请试试看，并给我们反馈！
{{< /caution >}}

<!--
## kubeadm alpha certs renew {#cmd-certs-renew}
-->
## kubeadm alpha 证书更新{#cmd-certs-renew}

<!--
You can renew all Kubernetes certificates using the `all` subcommand or renew them selectively.
-->
您可以使用`all`子命令更新所有 Kubernetes 证书，或者有选择的更新它们。

{{< tabs name="tab-certs-renew" >}}
{{< tab name="renew" include="generated/kubeadm_alpha_certs_renew.md" />}}
{{< tab name="all" include="generated/kubeadm_alpha_certs_renew_all.md" />}}
{{< tab name="apiserver-etcd-client" include="generated/kubeadm_alpha_certs_renew_apiserver-etcd-client.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_alpha_certs_renew_apiserver-kubelet-client.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_alpha_certs_renew_apiserver.md" />}}
{{< tab name="etcd-healthcheck-client" include="generated/kubeadm_alpha_certs_renew_etcd-healthcheck-client.md" />}}
{{< tab name="etcd-peer" include="generated/kubeadm_alpha_certs_renew_etcd-peer.md" />}}
{{< tab name="etcd-server" include="generated/kubeadm_alpha_certs_renew_etcd-server.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_alpha_certs_renew_front-proxy-client.md" />}}
{{< /tabs >}}


<!--
## kubeadm alpha kubeconfig user {#cmd-phase-kubeconfig}
-->
## kubeadm alpha kubeconfig 用户{#cmd-phase-kubeconfig}

<!--
The `user` subcommand can be used for the creation of kubeconfig files for additional users.
-->
`user`子命令可用于为其他用户创建 kubeconfig 文件。

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="kubeconfig" include="generated/kubeadm_alpha_kubeconfig.md" />}}
{{< tab name="user" include="generated/kubeadm_alpha_kubeconfig_user.md" />}}
{{< /tabs >}}

## kubeadm alpha kubelet config {#cmd-phase-kubelet}

<!--
Use the following commands to either download the kubelet configuration from the cluster or
to enable the DynamicKubeletConfiguration feature.
-->
使用以下命令从集群下载 kubelet 配置或启用 DynamicKubeletConfiguration 功能。

{{< tabs name="tab-kubelet" >}}
{{< tab name="kubelet" include="generated/kubeadm_alpha_kubelet.md" />}}
{{< tab name="download" include="generated/kubeadm_alpha_kubelet_config_download.md" />}}
{{< tab name="enable-dynamic" include="generated/kubeadm_alpha_kubelet_config_download.md" />}}
{{< /tabs >}}


<!--
## kubeadm alpha selfhosting pivot {#cmd-selfhosting}
-->
## kubeadm alpha 自托管 pivot {#cmd-selfhosting}

<!--
The subcommand `pivot` can be used to conver a static Pod-hosted control plane into a self-hosted one.
-->
`pivot`子命令可用于将静态的 Pod 托管控制平面转换为自托管控制平面。

{{< tabs name="selfhosting" >}}
{{< tab name="selfhosting" include="generated/kubeadm_alpha_selfhosting.md" />}}
{{< tab name="pivot" include="generated/kubeadm_alpha_selfhosting_pivot.md" />}}
{{< /tabs >}}


<!--
## What's next
-->
## 接下来
<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) 来用 bootstrap 启动一个 Kubernetes 控制平面节点
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 将节点连接到集群
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 使用 `kubeadm init` 或 `kubeadm join`恢复对主机所做的任何更改
