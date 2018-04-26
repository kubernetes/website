---
cn-approvers:
- tianshapjq
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm token
---
<!--
---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm token
---
-->
{% capture overview %}

<!--
Bootstrap tokens are used for establishing bidirectional trust between a node joining 
the cluster and a the master node, as described in [authenticating with bootstrap tokens](/docs/admin/bootstrap-tokens/).
-->
如 [使用 bootstrap tokens 进行验证] 中所述，Bootstrap tokens 用于建立待加入集群的 node 和 master 之间的双向信任机制。

<!--
`kubeadm init` creates an initial token with a 24-hour TTL. The following commands allow you to manage 
such a token and also to create and manage new ones.
-->
`kubeadm init` 创建一个24小时 TTL 的初始 token。以下命令允许您管理这样一个 token，您也可以创建和管理新的 token。

{% endcapture %}

{% capture body %}
<!--
## kubeadm token create {#cmd-token-create}
-->
## 创建 kubeadm token {#cmd-token-create}
{% include_relative generated/kubeadm_token_create.md %}

<!--
## kubeadm token delete {#cmd-token-delete}
-->
## 删除 kubeadm token {#cmd-token-delete}
{% include_relative generated/kubeadm_token_delete.md %}

<!--
## kubeadm token generate {#cmd-token-generate}
-->
## 生成 kubeadm token {#cmd-token-generate}
{% include_relative generated/kubeadm_token_generate.md %}

<!--
## kubeadm token list {#cmd-token-list}
-->
## 展示 kubeadm token
{% include_relative generated/kubeadm_token_list.md %}
{% endcapture %}

{% capture whatsnext %}
<!--
* [kubeadm join](kubeadm-join.md) to bootstrap a Kubernetes worker node and join it to the cluster
-->
* [kubeadm join](kubeadm-join.md) 启动一个 Kubernetes 工作 node 并且将其加入到集群中
{% endcapture %}

{% include templates/concept.md %}
