---
title: kubeadm token
content_type: concept
weight: 70
---
<!--
reviewers:
- luxas
- jbeda
title: kubeadm token
content_type: concept
weight: 70
-->

<!-- overview -->

<!--
Bootstrap tokens are used for establishing bidirectional trust between a node joining
the cluster and a control-plane node, as described in [authenticating with bootstrap tokens](/docs/reference/access-authn-authz/bootstrap-tokens/).
-->
如[使用引導令牌進行身份驗證](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)所述，
引導令牌用於在即將加入叢集的節點和控制平面節點間建立雙向認證。

<!--
`kubeadm init` creates an initial token with a 24-hour TTL. The following commands allow you to manage
such a token and also to create and manage new ones.
-->
`kubeadm init` 創建了一個有效期爲 24 小時的令牌，下面的命令允許你管理令牌，也可以創建和管理新的令牌。

<!-- body -->
## kubeadm token create {#cmd-token-create}

{{< include "generated/kubeadm_token/kubeadm_token_create.md" >}}

## kubeadm token delete {#cmd-token-delete}

{{< include "generated/kubeadm_token/kubeadm_token_delete.md" >}}

## kubeadm token generate {#cmd-token-generate}

{{< include "generated/kubeadm_token/kubeadm_token_generate.md" >}}

## kubeadm token list {#cmd-token-list}

{{< include "generated/kubeadm_token/kubeadm_token_list.md" >}}

## {{% heading "whatsnext" %}}

<!--
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
-->
* [kubeadm join](/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-join/)
  引導 Kubernetes 工作節點並將其加入叢集
