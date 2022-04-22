---
title: kubeadm token
content_type: conceito
weight: 70
---
<!-- overview -->

Os Bootstrap tokens são usados para estabelecer uma relação de confiança bidirecional entre um nó que se junta ao cluster e um nó do plano de controle, conforme descrito na [autenticação com tokens de inicialização](/docs/reference/access-authn-authz/bootstrap-tokens/).

O `kubeadm init` cria um token inicial com um TTL de 24 horas. Os comandos a seguir permitem que você gerencie esse token e também crie e gerencie os novos.

<!-- body -->
## Criar um token kubeadm {#cmd-token-create}
{{< include "generated/kubeadm_token_create.md" >}}

## Excluir um token kubeadm {#cmd-token-delete}
{{< include "generated/kubeadm_token_delete.md" >}}

## Gerar um token kubeadm {#cmd-token-generate}
{{< include "generated/kubeadm_token_generate.md" >}}

## Listar um token kubeadm {#cmd-token-list}
{{< include "generated/kubeadm_token_list.md" >}}

## {{% heading "O que vem a seguir?" %}}

* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó `worker` do Kubernetes e associá-lo ao cluster