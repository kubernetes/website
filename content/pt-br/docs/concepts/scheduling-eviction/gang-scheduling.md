---
title: Gang Scheduling
content_type: concept
weight: 70
---

<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}

O gang scheduling (agendamento em gangue) garante que um grupo de Pods seja agendado em uma base "tudo ou nada".
Se o cluster não puder acomodar o grupo inteiro (ou um número mínimo definido de Pods, especificado por `minCount`),
nenhum dos Pods será vinculado a um nó.

{{< note >}}
Embora o agendador nunca admita menos Pods do que o `minCount` configurado durante o posicionamento inicial, a contagem real em tempo de execução
dos Pods agendados pode cair abaixo desse limite se os Pods em execução forem posteriormente excluídos ou despejados (evicted), ou se o
requisito de `minCount` aumentar. Quando isso acontece, o agendador só posicionará Pods adicionais se o
total combinado de Pods já agendados e de novos Pods não agendados viáveis atingir ou exceder o `minCount`.
{{< /note >}}

Esse recurso depende da [API PodGroup](/docs/concepts/workloads/podgroup-api/).
Certifique-se de que o feature gate [`GenericWorkload`](/docs/reference/command-line-tools-reference/feature-gates/#GenericWorkload)
e o {{< glossary_tooltip text="grupo de API" term_id="api-group" >}} `scheduling.k8s.io/v1beta1`
estejam habilitados no cluster.

<!-- body -->

## Como funciona

Quando o plugin `GangScheduling` está habilitado, o agendador altera o ciclo de vida dos Pods pertencentes
a um [PodGroup](/docs/concepts/workloads/podgroup-api/) que possui uma [política de
agendamento](/docs/concepts/workloads/workload-api/policies/) `gang`.
O processo segue estas etapas para cada PodGroup:

1. O agendador mantém os Pods na fase `PreEnqueue` até que:
   * O objeto PodGroup referenciado exista.
   * O número de Pods criados para o PodGroup (tanto os já agendados quanto os não agendados) seja pelo menos igual a `minCount`.

   O PodGroup não entra na fila de agendamento ativa até que ambas as condições sejam atendidas.

2. Quando o quórum é atingido, o agendador tenta encontrar posicionamentos para todos os Pods não agendados do grupo.
   Ele utiliza o ciclo de [agendamento de PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/) para tomar uma única
   decisão de agendamento atômica. O plugin `GangScheduling` implementa um ponto de extensão `PlacementFeasible` que é invocado para cada
   Pod avaliado durante o ciclo. Isso é usado para determinar se a restrição de `minCount` é satisfeita
   comparando o número de Pods posicionados com sucesso (incluindo aqueles já agendados em ciclos anteriores) com o valor de `minCount`.

3. Se o agendador encontrar posicionamentos válidos para pelo menos o número `minCount` de Pods,
   ele permite que esses Pods posicionados com sucesso sejam vinculados aos nós que lhe foram atribuídos.
   Se ele não conseguir encontrar posicionamentos suficientes para satisfazer o requisito de `minCount`, nenhum dos Pods será agendado.
   Em vez disso, eles são movidos para a fila de não agendáveis para aguardar que os recursos do cluster sejam liberados,
   permitindo que outras cargas de trabalho sejam agendadas nesse meio-tempo.

## Gang scheduling hierárquico com CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Quando o feature gate [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
e o {{< glossary_tooltip text="grupo de API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3`
estão habilitados, o gang scheduling estende seu suporte aos `CompositePodGroups`.

Ao contrário dos `PodGroups`, que agrupam Pods, os `CompositePodGroups` agrupam grupos filhos — seja
`PodGroups` ou outros `CompositePodGroups`. Um `CompositePodGroup` especifica uma política de agendamento que
se aplica aos seus grupos filhos durante o agendamento:

* Política `gang` com um campo `minGroupCount`, que especifica o número mínimo de grupos filhos (seja
  objetos `CompositePodGroup` ou `PodGroup`) que devem ser agendados juntos como uma única unidade
  atômica.
* Política `basic`, que indica que os grupos filhos podem ser agendados de forma independente.

A política `gang` é útil para cargas de trabalho com múltiplos componentes que exigem agendamento tudo-ou-nada
através de múltiplos grupos filhos, garantindo que um número mínimo de grupos filhos seja agendado em conjunto. Uma
carga de trabalho de exemplo com essas necessidades é o treinamento de IA replicado.

A política `basic` pode ser usada para cargas de trabalho compostas por múltiplos grupos de Pods, cada um deles podendo ser
agendado como uma gangue independente, por exemplo, para cargas de trabalho de inferência de IA.

### Quórum hierárquico

O plugin `GangScheduling` impede que o `CompositePodGroup` raiz entre na fila de agendamento
ativa na fase `PreEnqueue` até que ele satisfaça o **quórum hierárquico**. Esse quórum é
avaliado de baixo para cima, desde os objetos `PodGroup` folha até o `CompositePodGroup` raiz:

- Um `PodGroup` folha **satisfaz o quórum** se, e somente se, o objeto `PodGroup` existir e puder
  potencialmente atender aos critérios de sua política de agendamento:
  - Para uma política `gang`: pelo menos `minCount` de seus Pods constituintes foram criados.
  - Para uma política `basic`: pelo menos um de seus Pods constituintes foi criado.
- Um `CompositePodGroup` **satisfaz o quórum** se, e somente se, o objeto `CompositePodGroup` existir
  e puder potencialmente atender aos critérios de sua política de agendamento:
  - Para uma política `gang`: pelo menos `minGroupCount` de seus grupos filhos diretos satisfazem o quórum.
  - Para uma política `basic`: pelo menos um de seus grupos filhos diretos satisfaz o quórum.
- O **quórum hierárquico** geral é satisfeito se, e somente se, o `CompositePodGroup`
  raiz satisfizer o quórum.

Em última análise, um `CompositePodGroup` raiz é admitido na fila de agendamento ativa se, e somente se,
ele satisfizer o quórum hierárquico e houver pelo menos um Pod pendente que pertença a um de
seus `PodGroups` descendentes.

### Viabilidade de posicionamento

O método `PlacementFeasible` do plugin `GangScheduling` suporta avaliação tanto para
`PodGroups` quanto para `CompositePodGroups`. Ele é invocado pelo ciclo de agendamento antes de iniciar a avaliação dos
filhos e após avaliar cada grupo filho de um `CompositePodGroup`.

Ao levar em conta o número de grupos filhos que foram agendados com sucesso e os grupos filhos
que ainda não foram avaliados no ciclo de agendamento, o `PlacementFeasible` determina
se a restrição de política do grupo ainda é alcançável, permitindo que o ciclo de agendamento aborte
antecipadamente a avaliação do `CompositePodGroup` se sua política de agendamento subjacente não puder
mais ser satisfeita.

## {{% heading "whatsnext" %}}

* Saiba mais sobre a [API PodGroup](/docs/concepts/workloads/podgroup-api/) e seu [ciclo de vida](/docs/concepts/workloads/podgroup-api/lifecycle/).
* Leia sobre a [API CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/).
* Leia sobre [políticas de agendamento de PodGroup](/docs/concepts/workloads/workload-api/policies/).
* Leia sobre [agendamento de PodGroup](/docs/concepts/scheduling-eviction/podgroup-scheduling/).
