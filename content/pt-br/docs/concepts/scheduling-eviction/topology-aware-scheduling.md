---
title: Agendamento de cargas de trabalho ciente de topologia
content_type: concept
weight: 10
---

<!-- overview -->
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

O *Agendamento ciente de topologia* (TAS - Topology-Aware Scheduling) é um [algoritmo de agendamento de posicionamento](/docs/concepts/scheduling-eviction/podgroup-scheduling/#placement-scheduling-algorithm)
que permite encontrar o posicionamento ideal para o PodGroup considerado, garantindo que todos os pods
sejam colocados (colocated) dentro do mesmo domínio de topologia. Os usuários podem adaptar o TAS às suas
necessidades específicas alterando a configuração dos plugins do TAS.

## Framework de agendamento: configuração dos plugins do TAS

O agendador inclui plugins in-tree novos e estendidos que implementam os pontos de extensão do TAS:

*   `TopologyPlacement`: Implementa a interface `PlacementGeneratePlugin`. Ele gera posicionamentos
    candidatos agrupando nós com base nos valores distintos da `key` de topologia solicitada (definida
    no PodGroup).

*   `NodeResourcesFit`: Estendido para implementar a interface `PlacementScorePlugin`. Seguindo
    uma lógica semelhante ao bin-packing padrão de pods, ele pontua os posicionamentos com base na proporção de alocação
    em todos os nós dentro do posicionamento. Ele usa a estratégia `MostAllocated` para maximizar a utilização
    de recursos dentro de um posicionamento, e herda os pesos de recursos das configurações do
    plugin padrão pod-a-pod (pod-by-pod).

*   `PodGroupPodsCount`: Implementa a interface `PlacementScorePlugin`. Ele pontua os posicionamentos
    candidatos com base no número total de pods do PodGroup que você consegue agendar com sucesso.

### Personalizando os pesos dos plugins e os pesos de recursos do bin-packing

Por padrão, os plugins `NodeResourcesFit` e `PodGroupPodsCount` são configurados com pesos
iguais (ambos com padrão 1) para manter um bom equilíbrio entre a lógica de bin-packing e agendar
o máximo possível de pods.

Você pode ajustar esses pesos, ou os pesos de recursos na estratégia de bin-packing, na sua
KubeSchedulerConfiguration. Aqui está um trecho de exemplo mostrando como alterar os pesos de ambos os
plugins e como sobrescrever os pesos de recursos do `NodeResourcesFit`. Essa última alteração se aplicará
tanto aos algoritmos de pontuação pod-a-pod quanto aos de posicionamento:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
    plugins:
      placementScore:
        enabled:
          # 1) Alterar os pesos padrão dos plugins de pontuação de posicionamento
          - name: NodeResourcesFit
            weight: 2
          - name: PodGroupPodsCount
            weight: 5
    pluginConfig:
      - name: NodeResourcesFit
        args:
          # 2) Alterando os pesos de recursos de pontuação para os algoritmos de
          # pontuação pod-a-pod e de posicionamento
          scoringStrategy:
            # O tipo será considerado apenas no agendamento pod-a-pod. A pontuação de
            # posicionamento sempre usa a estratégia MostAllocated
            type: LeastAllocated
            # Os pesos de recursos serão usados tanto nos algoritmos de pontuação
            # pod-a-pod quanto nos de posicionamento
            resources:
              - name: cpu
                weight: 2
              - name: memory
                weight: 3
```

## Posicionamentos de topologia multinível

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Quando o feature gate [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
e o {{< glossary_tooltip text="grupo de API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3`
estão habilitados, os plugins do Agendamento ciente de topologia estendem seu suporte a hierarquias
`CompositePodGroup` multinível. Esses plugins são chamados para `CompositePodGroups` durante o
[agendamento hierárquico](/docs/concepts/scheduling-eviction/podgroup-scheduling).

### Geração de posicionamentos candidatos

Para cargas de trabalho definidas com uma hierarquia de `CompositePodGroup`, o plugin `TopologyPlacement` gera
posicionamentos candidatos de cima para baixo (top-down) através da hierarquia de grupos por subdivisão sucessiva:

* Para um `CompositePodGroup` raiz, o `TopologyPlacement` gera posicionamentos candidatos em todos os
  nós disponíveis do cluster agrupando os nós com base nos valores distintos da `key` de topologia
  solicitada.
* Para um `CompositePodGroup` filho ou um `PodGroup` folha, o `TopologyPlacement` gera posicionamentos
  candidatos confinados ao posicionamento assumido pelo grupo pai. Ele subdivide o conjunto de nós
  do posicionamento do grupo pai, agrupando esses nós com base na `key` de topologia solicitada pelo grupo filho.

{{< note >}}
Se uma restrição de topologia não for especificada, o plugin `TopologyPlacement` gera um único
posicionamento candidato equivalente ao posicionamento pai.

Da mesma forma, se o grupo raiz não especificar nenhuma restrição de topologia, o plugin gera um único
posicionamento candidato correspondente a todos os nós disponíveis do cluster. Isso também vale para
cargas de trabalho de nível único que usam a API `PodGroup` sem nenhuma restrição de topologia especificada.
{{< /note >}}

### Pontuação de posicionamento

Ao pontuar um posicionamento candidato para um `CompositePodGroup`, os plugins de pontuação aplicam uma lógica
semelhante à do caso de `PodGroup` de nível único:

* `PodGroupPodsCount`: Pontua os posicionamentos candidatos com base no número total de Pods (tanto
  já agendados quanto recém-assumidos) em todos os `PodGroups` folha descendentes desse
  `CompositePodGroup`. Posicionamentos candidatos capazes de acomodar um número total maior de Pods
  na sub-hierarquia recebem pontuações mais altas.
* `NodeResourcesFit`: Agrega as solicitações de recursos de todos os Pods propostos em todos os
  `PodGroups` descendentes desse `CompositePodGroup` e avalia a utilização de recursos em todos os nós dentro
  do domínio do posicionamento candidato.

## {{% heading "whatsnext" %}}

* Saiba mais sobre a [API de agendamento ciente de topologia](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Leia sobre o [agendamento de grupos de pods](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
* Leia sobre as [políticas de grupos de pods](/docs/concepts/workloads/workload-api/policies/).
