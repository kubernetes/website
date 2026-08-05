---
title: kubeadm upgrade
content_type: conceito
weight: 40
---
<!-- overview -->
`kubeadm upgrade` é um comando amigável que envolve uma lógica de atualização  complexa por trás de um comando, com suporte para planejar e executar de fato uma atualização.

<!-- body -->

## Guia do kubeadm upgrade

As etapas para realizar uma atualização usando kubeadm estão descritas [neste documento](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/). 
Para versões mais antigas do kubeadm, consulte os conjuntos de documentação mais antigos do site Kubernetes.

Você pode usar `kubeadm upgrade diff` para ver as alterações que seriam aplicadas aos manifestos de Pod estático.

No Kubernetes v1.15.0 e posteriores, o `kubeadm upgrade apply` e `kubeadm upgrade node` também renovarão automaticamente os certificados gerenciados pelo kubeadm neste nó, incluindo aqueles armazenados nos arquivos do kubeconfig. 
É possível optar por não renovar usando a flag `--certificate-renewal=false`. 
Para mais detalhes sobre a renovação dos certificados, consulte a [documentação de gerenciamento de certificados](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).

{{< note >}}
Os comandos `kubeadm upgrade apply` e `kubeadm upgrade plan` tem uma flag legada `--config` que possibilita reconfigurar o cluster enquanto realiza o planejamento ou a atualização do nó específico da camada de gerenciamento. 
Esteja ciente de que o fluxo de trabalho da atualização não foi projetado para este cenário e existem relatos de resultados inesperados.
{{</ note >}}

## kubeadm upgrade plan {#cmd-upgrade-plan}
{{< include "generated/kubeadm_upgrade_plan.md" >}}

## kubeadm upgrade apply  {#cmd-upgrade-apply}
{{< include "generated/kubeadm_upgrade_apply.md" >}}

## kubeadm upgrade diff {#cmd-upgrade-diff}
{{< include "generated/kubeadm_upgrade_diff.md" >}}

## kubeadm upgrade node {#cmd-upgrade-node}
{{< include "generated/kubeadm_upgrade_node.md" >}}

## {{% heading "whatsnext" %}}

* [kubeadm config](/docs/reference/setup-tools/kubeadm/kubeadm-config/) se você inicializou seu cluster usando kubeadm v1.7.x ou inferior, para configurar seu cluster para `kubeadm upgrade`
