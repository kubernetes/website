---
approvers:
- mikedanese
- luxas
- jbeda
title: Kubeadm token
notitle: true
---
{% capture overview %}
# Kubeadm token
Bootstrap Tokens are used for establishing bidirectional trust between a node joining 
the cluster and a the master node, as described in [Authenticating with Bootstrap Tokens](bootstrap-tokens.md).

`kubeadm-init` creates an initial token with 24h TTL; following commands allow to manage 
such token and also to create and manage new ones.

But, what is a Bootstrap Token more exactly?
 
 - It is a string the form `[a-z0-9]{6}.[a-z0-9]{16}"`; the former part is the 
   public token ID, and the latter is the Token Secret, which must be kept private at all circumstances.
 - It is a Secret in the `kube-system` namespace of type `bootstrap.kubernetes.io/token`; the 
   name of the Secret must be in the form `bootstrap-token-(token-id)`.
 - It is a temporary, "technical" kubernetes user that allows a short-lived authentication 
   to the API Server, used by kubelet on the joining node to initialize the TLS Bootstrap flow.

{% endcapture %}

{% capture body %}
## Kubeadm token create {#cmd-token-create}
{% include_relative _kubeadm/kubeadm_token_create.md %}

## Kubeadm token delete {#cmd-token-delete}
{% include_relative _kubeadm/kubeadm_token_delete.md %}

## Kubeadm token generate {#cmd-token-generate}
{% include_relative _kubeadm/kubeadm_token_generate.md %}

## Kubeadm token list {#cmd-token-list}
{% include_relative _kubeadm/kubeadm_token_list.md %}
{% endcapture %}

{% capture whatsnext %}
* [kubeadm join](kubeadm-join.md) to bootstraps a Kubernetes worker node and join it to the cluster
{% endcapture %}

{% include templates/concept.md %}