---
title: kubeadm upgrade phase
weight: 90
content_type: concept
---

Na versão v1.15.0, o kubeadm introduziu suporte preliminar para as fases `kubeadm upgrade node`. Fases para outros subcomandos `kubeadm upgrade`, tal como `apply`, podem ser adicionadas nas seguintes versões.

## kubeadm upgrade node phase {#cmd-node-phase}

Usando essa fase, você pode optar por executar as etapas separadas da atualização de nós, sejam eles nós secundários da camada de gerenciamento ou nós de execução de cargas de trabalho. Observe que `kubeadm upgrade apply` ainda precisa ser chamado em um nó principal da camada de gerenciamento.

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade_node_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< /tabs >}}

## {{% heading "whatsnext" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) para inicializar um nó da camada de gerenciamento do Kubernetes 
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó `worker` do Kubernetes e associá-lo ao cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) para reverter quaisquer alterações feitas, neste host, pelo `kubeadm init` ou `kubeadm join`
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) para atualizar um cluster Kubernetes para uma versão mais recente
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) para visualizar um conjunto de recursos disponibilizados para coletar feedback da comunidade
