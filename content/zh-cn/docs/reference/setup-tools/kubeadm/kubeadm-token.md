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
如[使用引导令牌进行身份验证](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)所述，
引导令牌用于在即将加入集群的节点和控制平面节点间建立双向认证。

<!--
`kubeadm init` creates an initial token with a 24-hour TTL. The following commands allow you to manage
such a token and also to create and manage new ones.
-->
`kubeadm init` 创建了一个有效期为 24 小时的令牌，下面的命令允许你管理令牌，也可以创建和管理新的令牌。

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
  引导 Kubernetes 工作节点并将其加入集群
