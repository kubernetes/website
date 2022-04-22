---
title: Fase de atualização do kubeadm
weight: 90
content_type: conceito
---

Na versão v1.15.0, o kubeadm introduziu um suporte preliminar para as fases `kubeadm upgrade node`. Fases para outros subcomandos `kubeadm upgrade`, tal como `apply`, podem ser adicionadas nas seguintes versões.

## Fase de atualização do nó do kubeadm {#cmd-node-phase}

Usando essa fase, você pode optar por executar as etapas separadas da atualização do plano de controle secundário ou nós. Observe que `kubeadm upgrade apply` ainda precisa ser chamado em um nó principal do plano de controle.

{{< tabs name="tab-phase" >}}
{{< tab name="phase" include="generated/kubeadm_upgrade_node_phase.md" />}}
{{< tab name="preflight" include="generated/kubeadm_upgrade_node_phase_preflight.md" />}}
{{< tab name="control-plane" include="generated/kubeadm_upgrade_node_phase_control-plane.md" />}}
{{< tab name="kubelet-config" include="generated/kubeadm_upgrade_node_phase_kubelet-config.md" />}}
{{< /tabs >}}

## {{% heading "O que vem a seguir?" %}}

* [kubeadm init](/docs/reference/setup-tools/kubeadm/kubeadm-init) para inicializar um nó do plano de controle do Kubernetes 
* [kubeadm join](/docs/reference/setup-tools/kubeadm/kubeadm-join) para inicializar um nó `worker` do Kubernetes e associá-lo ao cluster
* [kubeadm reset](/docs/reference/setup-tools/kubeadm/kubeadm-reset) para reverter quaisquer alterações feitas neste host pelo `kubeadm init` ou `kubeadm join`
* [kubeadm upgrade](/docs/reference/setup-tools/kubeadm/kubeadm-upgrade) para atualizar um cluster Kubernetes para uma versão mais recente
* [kubeadm alpha](/docs/reference/setup-tools/kubeadm/kubeadm-alpha) para visualizar um conjunto de recursos disponibilizados para coletar feedback da comunidade
