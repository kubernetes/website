---
title: Preempção ciente de cargas de trabalho
content_type: concept
weight: 80
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload">}}


{{< note >}}
Na v1.36, a lógica de preempção ciente de cargas de trabalho era controlada pelo
feature gate `WorkloadAwarePreemption`. Este feature gate foi mesclado ao
feature gate `GenericWorkload` na v1.37.
{{< /note >}}


A preempção ciente de cargas de trabalho (workload-aware preemption) introduz um mecanismo de preempção projetado especificamente para PodGroups.
Quando um PodGroup não pode ser agendado, o agendador utiliza uma lógica de preempção que tenta
tornar possível o agendamento deste PodGroup. Essa abordagem é usada exclusivamente durante o agendamento de PodGroups
e substitui o mecanismo de preempção padrão para pods de um determinado PodGroup.

Quando esse recurso está habilitado, o agendador trata o PodGroup como uma única unidade preemptora,
em vez de avaliar pods individuais de um PodGroup isoladamente. Para abrir espaço para os pods pendentes no grupo,
ele busca vítimas em todo o cluster
e sabe como tratar e interromper (preemptar) outros PodGroups como vítimas de acordo com seus modos de disrupção.

Esse recurso é acoplado ao [Gang Scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)
e depende da [Workload API](/docs/concepts/workloads/workload-api/).
Certifique-se de que o [`scheduling.k8s.io/v1beta1`]{{< glossary_tooltip text="grupo de API" term_id="api-group" >}} esteja habilitado no cluster.

<!-- body -->

## Como funciona

O processo de preempção ciente de cargas de trabalho segue os mesmos princípios
da [preempção padrão](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)
com algumas diferenças:

1. Domínio de todo o cluster: Em vez de avaliar a preempção nó por nó,
   o agendador avalia o cluster inteiro como um único domínio.
   Ele seleciona um conjunto de vítimas em vários nós que pode ser removido
   para abrir espaço suficiente para que o PodGroup preemptor seja agendado.

2. Hierarquia de importância das vítimas: O agendador decide quais unidades de preempção
   (pods individuais ou PodGroups) são mais críticas e devem ser poupadas da preempção
   usando uma hierarquia estrita:
   * Prioridade: Unidades de prioridade mais alta são sempre mais importantes.
   * Tipo de carga de trabalho: PodGroups são considerados mais importantes do que Pods individuais da mesma prioridade.
   * Tamanho do grupo (PodGroups): Se ambas as unidades forem PodGroups,
     a que tiver mais membros (maior tamanho) é considerada mais importante.
   * Horário de início: Unidades que começaram antes são mais importantes.

3. Prioridade e disrupção do grupo de pods: O agendador considera o
   [modo de prioridade e disrupção](/docs/concepts/workloads/workload-api/disruption-and-priority/) específico de um PodGroup
   para avaliar se e como seus pods podem ser interrompidos durante eventos de preempção.

4. Considerações de desempenho e otimalidade: Por razões de desempenho,
   a preempção ciente de cargas de trabalho primeiro simula a remoção de todas as vítimas potenciais e
   executa o agendamento uma vez. Em seguida, tenta poupar o máximo possível de vítimas
   para o posicionamento selecionado. Essa troca (trade-off) significa que pode existir um posicionamento alternativo
   causando menos preempções, mas ele não é selecionado pelo agendador por razões de desempenho.

{{< note >}}
Ao agendar um único Pod, a preempção padrão de pods se aplica.
Na v1.36, quando o agendador executa uma preempção padrão para um único Pod
e tenta interromper um Pod pertencente a um PodGroup, ele **não**
respeita os campos `priority` ou `disruptionMode` desse PodGroup.
Essa limitação não se aplica mais na v1.37.
{{< /note >}}

### Algoritmo de poupança (reprieval)

Ao executar a preempção ciente de cargas de trabalho, o agendador executa a simulação na qual remove as vítimas potenciais de preempção
e executa o algoritmo de agendamento do grupo de pods. Em seguida, ele tenta poupar o máximo possível de vítimas para o posicionamento retornado.
Para isso, o agendador reutiliza os CycleStates do agendamento do grupo de pods. Para cada uma das vítimas potenciais,
classificadas por sua importância, o agendador:
1. Devolve os pods vítimas aos seus nós e aos CycleStates dos pods preemptores.
2. Para cada pod do PodGroup (na mesma ordem do algoritmo de agendamento):
   * Executa os plugins Filter para o pod em seu nó proposto
   * Adiciona o pod ao seu nó proposto
   * Executa os plugins Reserve para o pod em seu nó proposto

Se para cada pod a filtragem passar, os pods vítimas permanecem em seus nós.

Se a filtragem falhar para pelo menos um pod, os pods vítimas são removidos dos CycleStates e do nó.

Em ambos os casos, os pods preemptores do agendador são removidos de seus nós e seu Unreserve é chamado,
para que a próxima tentativa de poupança possa validar o agendamento do PodGroup. O agendador então prossegue
para outra vítima potencial até que todas as vítimas sejam processadas.

### Preempção para CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Quando o feature gate [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
e o {{< glossary_tooltip text="grupo de API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3`
estão habilitados, a preempção ciente de cargas de trabalho fornece suporte a `CompositePodGroups` também.

O mecanismo de preempção subjacente é o mesmo dos `PodGroups` — se o agendador precisar liberar
capacidade para posicionar o `CompositePodGroup` raiz, ele avalia a preempção para toda a hierarquia
do grupo, em vez de pods individuais.

`CompositePodGroups` também podem ser selecionados como vítimas de preempção. O processo de seleção de vítimas é
ajustado para levar `CompositePodGroups` em consideração da seguinte maneira:

1. Hierarquia de importância das vítimas:
   - `CompositePodGroups` são considerados mais importantes do que `PodGroups` isolados da mesma
     prioridade.
   - Para dois `CompositePodGroups` da mesma prioridade, o que tiver mais membros (maior tamanho) é
     considerado mais importante.

2. Modo de disrupção: Semelhante aos `PodGroups`, os `CompositePodGroups` especificam um
   [modo de disrupção](/docs/concepts/workloads/workload-api/disruption-and-priority/) que determina
   como seus grupos filhos devem ser tratados durante a preempção.

Além da preempção ciente de cargas de trabalho, `CompositePodGroups` podem ser selecionados como vítimas pela
preempção padrão de Pods durante o ciclo de agendamento de Pods, junto com `PodGroups` e Pods. A preempção
padrão de Pods compartilha a lógica de hierarquia de importância das vítimas com a preempção ciente de
cargas de trabalho e respeita o campo `disruptionMode` dos `CompositePodGroups`.

## {{% heading "whatsnext" %}}

* Saiba mais sobre [Prioridade e Disrupção de PodGroup](/docs/concepts/workloads/workload-api/disruption-and-priority/).
* Saiba mais sobre a [Workload API](/docs/concepts/workloads/workload-api/).
* Leia mais sobre [Gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
