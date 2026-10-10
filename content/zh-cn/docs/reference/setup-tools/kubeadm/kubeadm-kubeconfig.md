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
`kubeadm kubeconfig` 提供用来管理 kubeconfig 文件的工具。

如果希望查看如何使用 `kubeadm kubeconfig user` 的示例，
请参阅[为其他用户生成 kubeconfig 文件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)。

## kubeadm kubeconfig {#cmd-kubeconfig}

{{< tabs name="tab-kubeconfig" >}}
{{< tab name="概述" include="generated/kubeadm_kubeconfig/_index.md" />}}
{{< /tabs >}}

## kubeadm kubeconfig user {#cmd-kubeconfig-user}

<!--
This command can be used to output a kubeconfig file for an additional user.
-->
此命令可用来为其他用户生成一个 kubeconfig 文件。

{{< tabs name="tab-kubeconfig-user" >}}
{{< tab name="user" include="generated/kubeadm_kubeconfig/kubeadm_kubeconfig_user.md" />}}
{{< /tabs >}}
