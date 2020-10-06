---
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
 `kubeadm alpha` 提供了一组可用于收集社区反馈的功能的预览。请尝试一下这些功能并给我们反馈！
{{< /caution >}}

## kubeadm alpha certs renew {#cmd-certs-renew}

<!--
You can renew all Kubernetes certificates using the `all` subcommand or renew them selectively.
For more details about certificate expiration and renewal see the [certificate management documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
-->
使用 `all` 子命令来更新所有 Kubernetes 证书或有选择性地更新它们。有关证书到期和续订的更多详细信息，请参见[证书管理文档](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。

{{< tabs name="tab-certs-renew" >}}
{{< tab name="renew" include="generated/kubeadm_alpha_certs_renew.md" />}}
{{< tab name="all" include="generated/kubeadm_alpha_certs_renew_all.md" />}}
{{< tab name="admin.conf" include="generated/kubeadm_alpha_certs_renew_admin.conf.md" />}}
{{< tab name="apiserver-etcd-client" include="generated/kubeadm_alpha_certs_renew_apiserver-etcd-client.md" />}}
{{< tab name="apiserver-kubelet-client" include="generated/kubeadm_alpha_certs_renew_apiserver-kubelet-client.md" />}}
{{< tab name="apiserver" include="generated/kubeadm_alpha_certs_renew_apiserver.md" />}}
{{< tab name="controller-manager.conf" include="generated/kubeadm_alpha_certs_renew_controller-manager.conf.md" />}}
{{< tab name="etcd-healthcheck-client" include="generated/kubeadm_alpha_certs_renew_etcd-healthcheck-client.md" />}}
{{< tab name="etcd-peer" include="generated/kubeadm_alpha_certs_renew_etcd-peer.md" />}}
{{< tab name="etcd-server" include="generated/kubeadm_alpha_certs_renew_etcd-server.md" />}}
{{< tab name="front-proxy-client" include="generated/kubeadm_alpha_certs_renew_front-proxy-client.md" />}}
{{< tab name="scheduler.conf" include="generated/kubeadm_alpha_certs_renew_scheduler.conf.md" />}}
{{< /tabs >}}

## kubeadm alpha certs certificate-key {#cmd-certs-certificate-key}

<!--
This command can be used to generate a new control-plane certificate key.
The key can be passed as `--certificate-key` to `kubeadm init` and `kubeadm join`
to enable the automatic copy of certificates when joining additional control-plane nodes.
-->
该命令可用于生成新的控制平面证书密钥。密钥可以作为 `--certificate-key` 参数传递给 `kubeadm init` 和 `kubeadm join` 操作，以在加入其他控制平面节点时启用证书的自动复制。

{{< tabs name="tab-certs-certificate-key" >}}
{{< tab name="certificate-key" include="generated/kubeadm_alpha_certs_certificate-key.md" />}}
{{< /tabs >}}

## kubeadm alpha certs check-expiration {#cmd-certs-check-expiration}

<!--
This command checks expiration for the certificates in the local PKI managed by kubeadm.
For more details about certificate expiration and renewal see the [certificate management documentation](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/).
-->
此命令检查 kubeadm 管理的本地 PKI 中证书的到期时间。有关证书到期和续订的更多详细信息，请参见[证书管理文档](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)。

{{< tabs name="tab-certs-check-expiration" >}}
{{< tab name="check-expiration" include="generated/kubeadm_alpha_certs_check-expiration.md" />}}
{{< /tabs >}}

## kubeadm alpha kubeconfig user {#cmd-phase-kubeconfig}

<!--
The `user` subcommand can be used for the creation of kubeconfig files for additional users.
-->
使用子命令 `user` 为其他用户创建 kubeconfig 文件。

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="kubeconfig" include="generated/kubeadm_alpha_kubeconfig.md" />}}
{{< tab name="user" include="generated/kubeadm_alpha_kubeconfig_user.md" />}}
{{< /tabs >}}

## kubeadm alpha kubelet config {#cmd-phase-kubelet}

<!--
Use the following command to enable the DynamicKubeletConfiguration feature.
-->
使用以下命令启用 DynamicKubeletConfiguration 功能。

{{< tabs name="tab-kubelet" >}}
{{< tab name="kubelet" include="generated/kubeadm_alpha_kubelet.md" />}}
{{< tab name="enable-dynamic" include="generated/kubeadm_alpha_kubelet_config_enable-dynamic.md" />}}
{{< /tabs >}}


## kubeadm alpha selfhosting pivot {#cmd-selfhosting}

<!--
The subcommand `pivot` can be used to convert a static Pod-hosted control plane into a self-hosted one.
-->
子命令 `pivot` 可用于将 Pod 托管的静态控制平面转换为自托管的控制平面。有关 `pivot` 更多信息，请参见[文档](/docs/setup/production-environment/tools/kubeadm/self-hosting/)。

<!--
[Documentation](/docs/setup/production-environment/tools/kubeadm/self-hosting/)
-->


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
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) 引导 Kubernetes 控制平面节点
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) 将节点连接到集群
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) 会还原 `kubeadm init` 或 `kubeadm join` 操作对主机所做的任何更改。
