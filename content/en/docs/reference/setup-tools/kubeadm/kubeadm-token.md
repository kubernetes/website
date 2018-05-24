---
reviewers:
- mikedanese
- luxas
- jbeda
title: kubeadm token
content_template: templates/concept
weight: 70
---
{{% capture overview %}}

Bootstrap tokens are used for establishing bidirectional trust between a node joining
the cluster and a master node, as described in [authenticating with bootstrap tokens](/docs/admin/bootstrap-tokens/).

`kubeadm init` creates an initial token with a 24-hour TTL. The following commands allow you to manage
such a token and also to create and manage new ones.

{{% /capture %}}

{{% capture body %}}
## kubeadm token create {#cmd-token-create}
{{< include "generated/kubeadm_token_create.md" >}}

## kubeadm token delete {#cmd-token-delete}
{{< include "generated/kubeadm_token_delete.md" >}}

## kubeadm token generate {#cmd-token-generate}
{{< include "generated/kubeadm_token_generate.md" >}}

## kubeadm token list {#cmd-token-list}
{{< include "generated/kubeadm_token_list.md" >}}
{{% /capture %}}

{{% capture whatsnext %}}
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join/) to bootstrap a Kubernetes worker node and join it to the cluster
{{% /capture %}}
