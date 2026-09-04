---
title: Agendamento de PodGroup
content_type: concept
weight: 80
---

{{< feature-state feature_gate_name="GenericWorkload" >}}

O agendador padrão do Kubernetes avalia os Pods sequencialmente. Quando várias cargas de trabalho, como trabalhos de
treinamento de machine learning, são enviadas simultaneamente, essa avaliação sequencial pode levar a deadlocks de recursos.
Por exemplo, duas cargas de trabalho concorrentes podem agendar cada uma um subconjunto de seus Pods,
consumindo a capacidade do cluster, mas não deixando nenhuma das cargas de trabalho com recursos suficientes para iniciar completamente.

O ciclo de agendamento de PodGroup avalia um grupo de Pods como uma única unidade.
O agendador tenta encontrar posicionamentos para todos os Pods do grupo simultaneamente.
Se ele não conseguir recursos suficientes para satisfazer os requisitos de todo o grupo, nenhum dos Pods será vinculado.

Além disso, tratar o grupo como uma entidade unificada estabelece uma arquitetura fundamental
que simplifica a implementação de outros recursos de agendamento baseados em grupos.

Esse recurso depende da [Workload API](/docs/concepts/workloads/workload-api/).
Certifique-se de que o
{{< glossary_tooltip text="grupo de API" term_id="api-group" >}} `scheduling.k8s.io/v1beta1`
esteja habilitado no cluster.

<!-- body -->

## Ciclo de agendamento de PodGroup

Para suportar o agendamento de um grupo de Pods em conjunto, o kube-scheduler usa o **ciclo de agendamento de PodGroup**.
Em vez de processar os Pods individualmente e mantê-los em uma barreira `WaitOnPermit`,
o agendador avalia coletivamente todo o grupo de Pods pendentes pertencentes a um PodGroup específico.
Em vez de executar ciclos de agendamento separados para cada Pod,
ele avalia a viabilidade de todo o grupo e passa diretamente para a fase de vinculação (binding) depois disso.

Ao observar um Pod pertencente a um PodGroup, o agendador associa o Pod a esse PodGroup em vez de adicioná-lo diretamente à fila de agendamento.
Um PodGroup não entra na fila de agendamento até que o agendador observe tanto o objeto PodGroup quanto pelo menos um Pod pertencente a ele.
Quando o agendador extrai (pop) um PodGroup, ele recupera todos os Pods não agendados observados nesse grupo.
Em seguida, ele os classifica de forma determinística com base na prioridade e no momento em que foram observados pela primeira vez pelo agendador,
e inicia o ciclo de agendamento de PodGroup da seguinte forma:

1. **Snapshot do estado do cluster:** Quando o agendador começa a avaliar um PodGroup,
   ele tira um único snapshot do estado do cluster que dura todo o período do ciclo.
   Isso garante que a avaliação permaneça consistente para todo o grupo e evita condições de corrida com outros eventos.

2. **Encontrar posicionamentos viáveis:** O agendador executa o [algoritmo de agendamento de PodGroup](#podgroup-scheduling-algorithm)
   para encontrar posicionamentos de nós válidos para os Pods do grupo.

3. **Decisão atômica:** Dependendo do resultado do algoritmo, a decisão de agendamento
   é aplicada atomicamente para todo o PodGroup.

   * **Sucesso:** Se o agendador encontrar recursos suficientes e posicionamentos válidos para os Pods
     (por exemplo, satisfazendo a restrição `minCount` do [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)),
     esses Pods passam diretamente para o ciclo de vinculação com seus nós selecionados.
     Quaisquer Pods restantes não agendáveis do grupo são recolocados diretamente na fila de agendamento ativa, sem backoff, mantendo seu timestamp anterior para que sejam reavaliados imediatamente para tentar a preempção.

     Além disso, se novos Pods forem adicionados a um PodGroup depois que outros já tiverem sido agendados,
     o ciclo avalia os novos Pods levando em conta os existentes.

   * **Falha:** Se o agendador não conseguir recursos suficientes para tornar o PodGroup viável
     (por exemplo, não atendendo à restrição `minCount`), todo o PodGroup é considerado não agendável.

     O agendador tenta tornar um PodGroup agendável executando o ponto de extensão `PodGroupPostFilter`.
     O ponto de extensão `PodGroupPostFilter` do plugin `DefaultPreemption` executa a
     [preempção ciente de cargas de trabalho](/docs/concepts/scheduling-eviction/workload-aware-preemption/).
     Se qualquer plugin que implemente o ponto de extensão `PodGroupPostFilter` retornar `Success`, não são
     executados mais plugins para o ponto de extensão `PodGroupPostFilter`.

     Mesmo quando o plugin `PodGroupPostFilter` retorna um `Success`, nenhum Pod é vinculado; em vez disso,
     todos são devolvidos à fila de agendamento, na expectativa de que as ações tomadas pelo `PodGroupPostFilter`
     tornem o PodGroup agendável no próximo ciclo de agendamento. A lógica padrão de backoff de agendamento se aplica,
     permitindo que o PodGroup seja tentado novamente mais tarde.

Ao usar essa abordagem de ciclo único, o agendador evita gargalos ineficientes
onde grupos parcialmente agendados reservam capacidade do cluster enquanto aguardam indefinidamente que o restante de seu grupo caiba.

## Algoritmo de agendamento de PodGroup {#podgroup-scheduling-algorithm}

O algoritmo padrão de agendamento de PodGroup depende fortemente do algoritmo de agendamento básico baseado em Pods.
Ele itera sobre os Pods e executa o seguinte para cada um:

1. Encontra um nó viável usando as fases padrão de filtragem e pontuação por Pod.

   * Se o Pod couber, ele é temporariamente assumido (assumed) e reservado no nó selecionado até o fim do algoritmo de agendamento.
   * Se o Pod não couber, o agendador não executa o ponto de extensão `PostFilter`.
     Em vez disso, ele conta com o ponto de extensão `PodGroupPostFilter` executado para todo o PodGroup.

2. Verifica se os Pods agendáveis atendem aos critérios de agendamento do grupo
   (por exemplo, o `minCount` do [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/)) invocando o ponto de extensão `PlacementFeasible` após avaliar cada Pod do grupo contra os resultados cumulativos de agendamento.
   Se ele retornar um status `Success` para qualquer Pod, o PodGroup é considerado viável.
   Se o algoritmo processar todos os Pods sem obter um status `Success`, ou se nenhum Pod for agendado durante esse ciclo, o PodGroup é considerado não agendável.

## Algoritmo de agendamento de posicionamento
{{< feature-state feature_gate_name="TopologyAwareWorkloadScheduling" >}}

O algoritmo de agendamento de posicionamento é um algoritmo alternativo de agendamento de PodGroup, que usa
[plugins de agendamento](/docs/reference/scheduling/config/#scheduling-plugins) para encontrar o posicionamento ideal
para o PodGroup considerado. Os usuários podem adaptar o algoritmo às suas necessidades específicas
usando e configurando plugins.

O algoritmo prossegue em três fases principais para um determinado PodGroup:

### Fase 1: Geração de posicionamentos candidatos

Gera *posicionamentos* candidatos (subconjuntos de nós que são teoricamente viáveis para a atribuição do PodGroup),
por exemplo, com base nas restrições de agendamento do PodGroup (que podem ser definidas
no objeto PodGroup).

Esta fase é executada como ponto de extensão: `PlacementGeneratePlugin`.

### Fase 2: Filtragem no nível do Pod e verificação de viabilidade

Valida cada posicionamento proposto, executando o algoritmo padrão de agendamento de PodGroup, para ver se
o número necessário de Pods do PodGroup cabe. Se couberem, o posicionamento é marcado como viável.

### Fase 3:  Pontuação e seleção de posicionamentos

Pontua todos os posicionamentos viáveis para selecionar o domínio ideal para o PodGroup.

Esta fase é executada como ponto de extensão: `PlacementScorePlugin`.

### Limitações

O algoritmo de agendamento de PodGroup depende de uma classificação específica de Pods e pode falhar em encontrar um posicionamento válido
que poderia ter sido descoberto processando os Pods do grupo em uma ordem diferente. Em particular:

* Para grupos de Pods **homogêneos** básicos (ou seja, aqueles em que todos os Pods têm requisitos de agendamento idênticos
  e não possuem dependências entre Pods, como afinidade, antiafinidade ou restrições de distribuição de topologia),
  espera-se que o algoritmo encontre um posicionamento, se um existir.

* Para grupos de Pods **heterogêneos**, encontrar um posicionamento válido não é garantido.

* Para grupos de Pods com **dependências entre Pods**, encontrar um posicionamento válido não é garantido.

Além do exposto, para casos que envolvem **dependências dentro do grupo** (intra-group)
(por exemplo, quando a agendabilidade de um Pod depende de outro membro do grupo por meio de afinidade entre Pods),
este algoritmo pode falhar em encontrar um posicionamento, independentemente do estado do cluster, devido à sua ordem de processamento determinística.

Para um comportamento consistente ao longo de todo o ciclo, o algoritmo exige que todos os Pods pertencentes a um único PodGroup
compartilhem o mesmo `.spec.schedulerName`. Esse requisito é validado antes do início do ciclo,
e o PodGroup é rejeitado se a restrição não for atendida.

## Agendamento hierárquico com CompositePodGroups

{{< feature-state feature_gate_name="CompositePodGroup" >}}

Quando o feature gate [`CompositePodGroup`](/docs/reference/command-line-tools-reference/feature-gates/#CompositePodGroup)
e o {{< glossary_tooltip text="grupo de API" term_id="api-group" >}} `scheduling.k8s.io/v1alpha3`
estão habilitados, o agendador estende o ciclo de agendamento de PodGroup para suportar hierarquias de grupos
multinível.

Em uma carga de trabalho hierárquica, os Pods pertencem a objetos `PodGroup` folha, que por sua vez especificam recursos
`CompositePodGroup` pais, até o `CompositePodGroup` raiz. O agendador avalia toda a
hierarquia de grupos como uma única unidade de agendamento unificada.

### Execução do ciclo de agendamento hierárquico

Depois de observar um `CompositePodGroup` raiz, o agendador o coloca na fila de agendamento, contanto
que haja pelo menos um Pod pendente que pertença à hierarquia de grupos dessa raiz.

Uma vez que o `CompositePodGroup` raiz satisfaça o
[quórum hierárquico](/docs/concepts/scheduling-eviction/gang-scheduling/#Hierarchical-quorum), ele
entra na fila de agendamento ativa, da qual pode ser extraído pelo ciclo de agendamento. O fluxo do
ciclo de agendamento para `CompositePodGroups` é o seguinte:

1. **Snapshot unificado do cluster e validação**: O agendador tira um snapshot dos recursos do cluster
   para espelhar o estado mais recente observado do cluster. Ele verifica se a forma da hierarquia de grupos
   extraída da fila corresponde à hierarquia do snapshot e valida a consistência
   da configuração da hierarquia (como `.spec.schedulerName` e prioridade idênticas entre os Pods
   membros).

   Se a forma da hierarquia mudar simultaneamente ou falhar na validação, o ciclo é interrompido e o
   `CompositePodGroup` raiz é recolocado na fila.

2. **Geração de posicionamentos candidatos de cima para baixo (top-down)**: Em cada nível da hierarquia, antes de avaliar
   os grupos filhos, o agendador invoca os plugins `PlacementGeneratePlugin` para gerar posicionamentos
   candidatos (subconjuntos de nós) para o grupo sendo avaliado.

   Os posicionamentos candidatos para um `CompositePodGroup` filho ou um `PodGroup` folha são gerados exclusivamente
   a partir do subconjunto de nós pertencente ao posicionamento atualmente avaliado do grupo pai. Para o
   `CompositePodGroup` raiz, os posicionamentos candidatos são gerados em todos os nós disponíveis do cluster.

3. **Simulação recursiva da subárvore e verificação de viabilidade**: O agendador avalia cada posicionamento
   candidato de um `CompositePodGroup` assumindo temporariamente esse posicionamento no snapshot
   do cluster e agendando recursivamente seus grupos filhos:
   * **Travessia recursiva**: O agendador percorre os grupos filhos em uma ordem pré-classificada, invocando
     a si mesmo recursivamente do `CompositePodGroup` até os objetos `PodGroup` folha. Para cada grupo
     `PodGroup` folha, o agendador executa o algoritmo de agendamento de posicionamento com escopo no
     posicionamento candidato do pai para fazer atribuições provisórias de Pods na memória.
   * **Verificações de viabilidade**: Depois de avaliar cada grupo filho, o agendador invoca
     os plugins `PlacementFeasible` para determinar se a política de agendamento do grupo pai ainda pode
     ser atendida:
     * Se as restrições da política ainda forem alcançáveis (ou já estiverem satisfeitas), o agendador continua
       avaliando os grupos irmãos subsequentes.
     * Se as restrições da política não puderem mais ser satisfeitas, o agendador aborta imediatamente a avaliação
       daquele `CompositePodGroup` e reverte todas as atribuições provisórias de Pods feitas na memória para esse grupo.
   * **Reversão da simulação (rollback)**: Depois de simular um posicionamento candidato (independentemente de sucesso ou falha),
     o agendador reverte as reservas provisórias de nós feitas durante essa simulação antes de
     avaliar o próximo posicionamento candidato.

4. **Pontuação de posicionamentos e comprometimento da subárvore**: Depois que todos os posicionamentos candidatos de um
   `CompositePodGroup` foram avaliados:
   * **Pontuação**: Se um ou mais posicionamentos candidatos forem viáveis, o agendador invoca
     os plugins `PlacementScorePlugin` para pontuar todos os posicionamentos candidatos viáveis. Os plugins de pontuação
     avaliam as atribuições de Pods propostas combinadas em todos os objetos `PodGroup` folha descendentes na
     subárvore e selecionam o posicionamento com a pontuação geral mais alta.
   * **Comprometimento (commitment)**: Depois de selecionar o posicionamento vencedor, o agendador compromete (assume) as
     atribuições provisórias de Pods correspondentes a esse posicionamento ideal na memória. Isso garante que
     as avaliações subsequentes de grupos irmãos ou avaliações no nível do pai observem decisões de agendamento consistentes e ideais
     para essa subárvore.

     Se nenhum posicionamento viável for encontrado entre todos os candidatos gerados, todo o `CompositePodGroup`
     é considerado não agendável.

5. **Vinculação atômica**: Se a avaliação recursiva no nível da raiz for bem-sucedida e pelo menos um Pod tiver sido
     agendado com sucesso, o agendador confirma as atribuições de Pods passando para o ciclo
     de vinculação.

   Caso contrário, todo o `CompositePodGroup` é considerado não agendável.

### Limitações

Da mesma forma que o algoritmo de agendamento de PodGroup depende de uma classificação específica de Pods, o algoritmo de
agendamento hierárquico depende de uma classificação específica dos grupos filhos dentro de cada hierarquia de
`CompositePodGroup`. Como resultado, ele pode falhar em encontrar um posicionamento válido que poderia ter sido descoberto
processando os grupos filhos em uma ordem diferente.

Além disso, como o agendador avalia as hierarquias de grupos usando uma abordagem gulosa (greedy):

* Não é garantido encontrar um posicionamento válido em todos os casos, mesmo que exista um no cluster.
* Mesmo quando o agendador encontra com sucesso um posicionamento válido para uma hierarquia de `CompositePodGroup`,
  não é garantido que esse posicionamento seja o ideal em todo o cluster.

## Condições do PodGroup

Depois que um ciclo de agendamento de PodGroup é concluído, o agendador atualiza as condições no campo
`status.conditions` do PodGroup:

* `PodGroupInitiallyScheduled`: relata se o PodGroup foi agendado com sucesso pela primeira vez.

### `PodGroupInitiallyScheduled`

Quando o ciclo de agendamento é bem-sucedido, a condição é definida como `True` com o motivo
`Scheduled`. Para PodGroups com política `gang`, isso significa que pelo menos `minCount` Pods foram
posicionados.

Quando o agendamento falha, a condição é definida como `False` com um dos seguintes
motivos:

* `Unschedulable` — o grupo não pôde ser posicionado devido a restrições de recursos,
  regras de afinidade ou antiafinidade, ou capacidade insuficiente para a gangue.
* `SchedulerError` — o agendamento falhou devido a um erro interno do agendador
  (por exemplo, ao analisar restrições de agendamento como `nodeAffinity`).

Uma vez que essa condição é definida como `True`, ela nunca muda.

Você pode verificar as condições com:

```shell
kubectl get podgroup <name> -o jsonpath='{.status.conditions}'
```

## Condições do CompositePodGroup

{{< feature-state feature_gate_name="CompositePodGroup" >}}

A API CompositePodGroup também expõe o campo `status.conditions`.

Na v1.37, no entanto, o agendador ainda não preenche esse campo.

## {{% heading "whatsnext" %}}

* Saiba mais sobre a [Workload API](/docs/concepts/workloads/workload-api/).
* Leia sobre a [API CompositePodGroup](/docs/concepts/workloads/compositepodgroup-api/) e seu [ciclo de vida](/docs/concepts/workloads/compositepodgroup-api/lifecycle/).
* Saiba mais sobre o [agendamento de cargas de trabalho ciente de topologia](/docs/concepts/workloads/workload-api/topology-aware-scheduling/).
* Veja como [referenciar uma Workload](/docs/concepts/workloads/pods/workload-reference/) em um Pod.
* Leia sobre o [gang scheduling](/docs/concepts/scheduling-eviction/gang-scheduling/).
