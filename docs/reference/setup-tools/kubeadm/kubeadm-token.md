---
approvers:
- mikedanese
- luxas
- jbeda
title: kubeadm token
---
{% capture overview %}

Bootstrap tokens are used for establishing bidirectional trust between a node joining 
the cluster and a master node, as described in [authenticating with bootstrap tokens](/docs/admin/bootstrap-tokens/).

`kubeadm init` creates an initial token with a 24-hour TTL. The following commands allow you to manage 
such a token and also to create and manage new ones.

{% endcapture %}

{% capture body %}
## kubeadm token create {#cmd-token-create}
{% include_relative generated/kubeadm_token_create.md %}

## kubeadm token delete {#cmd-token-delete}
{% include_relative generated/kubeadm_token_delete.md %}

## kubeadm token generate {#cmd-token-generate}
{% include_relative generated/kubeadm_token_generate.md %}

## kubeadm token list {#cmd-token-list}
{% include_relative generated/kubeadm_token_list.md %}
{% endcapture %}

{% capture whatsnext %}
* [kubeadm join](kubeadm-join.md) to bootstrap a Kubernetes worker node and join it to the cluster
{% endcapture %}

{% include templates/concept.md %}
