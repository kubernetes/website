---
title: kubeadm token
content_type: concept
weight: 70
---
<!-- overview -->

Os Bootstrap tokens são usados para estabelecer uma relação de confiança bidirecional entre um nó que se junta ao cluster e um nó do plano de controle, conforme descrito na [autenticação com tokens de inicialização](/docs/reference/access-authn-authz/bootstrap-tokens/).

O `kubeadm init` cria um token inicial com um TTL de 24 horas. Os comandos a seguir permitem que você gerencie esse token e também crie e gerencie os novos.

<!-- body -->
## kubeadm token create {#cmd-token-create}
{{< include "generated/kubeadm_token_create.md" >}}

## kubeadm token delete {#cmd-token-delete}
{{< include "generated/kubeadm_token_delete.md" >}}

## kubeadm token generate {#cmd-token-generate}
{{< include "generated/kubeadm_token_generate.md" >}}

## kubeadm token list {#cmd-token-list}
{{< include "generated/kubeadm_token_list.md" >}}

## {{% heading "whatsnext" %}}

* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó de carga de trabalho do Kubernetes e associá-lo ao cluster
