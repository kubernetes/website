---
title: kubeadm alpha
content_type: concept
weight: 90
---
<!--
title: kubeadm alpha
content_type: concept
weight: 90
-->

{{< caution >}}
<!--
`kubeadm alpha` provides a preview of a set of features made available for gathering feedback
 from the community. Please try it out and give us feedback!
 -->
`kubeadm alpha` 提供一组可用于收集反馈的功能的预览
 请试用并给我们反馈！
{{< /caution >}}

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
子命令 `pivot` 可用于将 Pod 托管的静态控制平面转换为自托管的控制平面。
有关 `pivot` 更多信息，请参见
[文档](/zh/docs/setup/production-environment/tools/kubeadm/self-hosting/)。

<!--
[Documentation](/docs/setup/production-environment/tools/kubeadm/self-hosting/)
-->

{{< tabs name="selfhosting" >}}
{{< tab name="selfhosting" include="generated/kubeadm_alpha_selfhosting.md" />}}
{{< tab name="pivot" include="generated/kubeadm_alpha_selfhosting_pivot.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

<!--
* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init/) to bootstrap a Kubernetes control-plane node
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to connect a node to the cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset/) to revert any changes made to this host by `kubeadm init` or `kubeadm join`
-->
* 用来启动引导 Kubernetes 控制平面节点的
  [kubeadm init](/zh/docs/reference/setup-tools/kubeadm/kubeadm-init/)
  命令
* 用来将节点连接到集群的
  [kubeadm join](/zh/docs/reference/setup-tools/kubeadm/kubeadm-join/) 
  命令
* 用来还原 `kubeadm init` 或 `kubeadm join` 操作对主机所做的任何更改的
  [kubeadm reset](/zh/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
  命令

