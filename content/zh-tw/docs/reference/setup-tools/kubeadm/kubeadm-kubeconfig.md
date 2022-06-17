---
title: kubeadm kubeconfig
content_type: concept
weight: 90
---

<!--
`kubeadm kubeconfig` provides utilities for managing kubeconfig files.

For examples on how to use `kubeadm kubeconfig user` see
[Generating kubeconfig files for additional users](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).
-->
`kubeadm kubeconfig` 提供用來管理 kubeconfig 檔案的工具。

如果希望檢視如何使用 `kubeadm kubeconfig user` 的示例，請參閱
[為其他使用者生成 kubeconfig 檔案](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users).

## kubeadm kubeconfig {#cmd-kubeconfig}

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="overview" include="generated/kubeadm_kubeconfig.md" />}}
{{< /tabs >}}

## kubeadm kubeconfig user {#cmd-kubeconfig-user}

<!--
This command can be used to output a kubeconfig file for an additional user.
-->
此命令可用來為其他使用者生成一個 kubeconfig 檔案。

{{< tabs name="tab-kubeconfig-user" >}}
{{< tab name="user" include="generated/kubeadm_kubeconfig_user.md" />}}
{{< /tabs >}}
