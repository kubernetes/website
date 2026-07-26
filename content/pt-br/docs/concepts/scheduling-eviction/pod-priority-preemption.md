---
title: Prioridade de Pod e Preempção
content_type: concept
weight: 90
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

[Pods](/docs/concepts/workloads/pods/) podem ter _prioridade_. A prioridade indica a
importância de um Pod em relação a outros Pods. Se um Pod não puder ser alocado, o
escalonador tenta realizar a preempção (remoção) de Pods de menor prioridade para tornar possível a
alocação do Pod pendente.



<!-- body -->


{{< warning >}}
Em um cluster onde nem todos os usuários são confiáveis, um usuário mal-intencionado
poderia criar Pods com as maiores prioridades possíveis, fazendo com que outros Pods
sejam removidos ou não consigam ser alocados.
Um administrador pode usar ResourceQuota para impedir que usuários criem Pods com
prioridades altas.

Veja [limitar o consumo de PriorityClass por padrão](/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
para mais detalhes.
{{< /warning >}}

## Como usar prioridade e preempção

Para usar prioridade e preempção:

1.  Adicione uma ou mais [PriorityClasses](#priorityclass).

1.  Crie Pods com [`priorityClassName`](#pod-priority) definido como uma das
    PriorityClasses adicionadas. Obviamente, você não precisa criar os Pods diretamente;
    normalmente você adicionaria `priorityClassName` ao template do Pod de um
    objeto de coleção como um Deployment.

Continue lendo para mais informações sobre essas etapas.

{{< note >}}
O Kubernetes já inclui duas PriorityClasses:
`system-cluster-critical` e `system-node-critical`.
Essas são classes comuns e são usadas para [garantir que componentes críticos sejam sempre alocados primeiro](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
{{< /note >}}

## PriorityClass

Uma PriorityClass é um objeto sem namespace que define um mapeamento entre o
nome de uma classe de prioridade e o valor inteiro da prioridade. O nome é especificado
no campo `name` dos metadados do objeto PriorityClass. O valor é
especificado no campo obrigatório `value`. Quanto maior o valor, maior a
prioridade.
O nome de um objeto PriorityClass deve ser um
[nome de subdomínio DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
válido, e não pode ser prefixado com `system-`.

Um objeto PriorityClass pode ter qualquer valor inteiro de 32 bits menor ou igual
a 1 bilhão. Isso significa que o intervalo de valores para um objeto PriorityClass é
de -2147483648 a 1000000000, inclusive. Números maiores são reservados para
PriorityClasses embutidas que representam Pods críticos do sistema. Um administrador
do cluster deve criar um objeto PriorityClass para cada mapeamento desejado.

PriorityClass também possui dois campos opcionais: `globalDefault` e `description`.
O campo `globalDefault` indica que o valor desta PriorityClass deve
ser usado para Pods sem `priorityClassName`. Apenas uma PriorityClass com
`globalDefault` definido como true pode existir no sistema. Se não houver
PriorityClass com `globalDefault` definido, a prioridade dos Pods sem
`priorityClassName` será zero.

O campo `description` é uma string arbitrária. Ele serve para informar os usuários do
cluster sobre quando devem usar esta PriorityClass.

### Observações sobre PodPriority e clusters existentes

-   Se você atualizar um cluster existente sem essa funcionalidade, a prioridade
    dos seus Pods existentes será efetivamente zero.

-   A adição de uma PriorityClass com `globalDefault` definido como `true` não
    altera as prioridades dos Pods existentes. O valor dessa PriorityClass é
    usado apenas para Pods criados após a adição da PriorityClass.

-   Se você excluir uma PriorityClass, os Pods existentes que usam o nome da
    PriorityClass excluída permanecem inalterados, mas você não poderá criar mais Pods que
    usem o nome da PriorityClass excluída.

### Exemplo de PriorityClass

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for XYZ service pods only."
```

## PriorityClass sem preempção {#non-preempting-priority-class}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Pods com `preemptionPolicy: Never` serão colocados na fila de alocação
à frente de Pods de menor prioridade,
mas não podem remover outros Pods por preempção.
Um Pod sem preempção aguardando alocação permanecerá na fila de alocação
até que recursos suficientes estejam livres
e ele possa ser alocado.
Pods sem preempção,
assim como outros Pods,
estão sujeitos ao back-off do escalonador.
Isso significa que, se o escalonador tentar alocar esses Pods e eles não puderem ser alocados,
eles serão tentados novamente com menor frequência,
permitindo que outros Pods com menor prioridade sejam alocados antes deles.

Pods sem preempção ainda podem ser removidos por preempção por outros
Pods de alta prioridade.

O valor padrão do campo `preemptionPolicy` é `PreemptLowerPriority`,
que permitirá que Pods dessa PriorityClass removam por preempção Pods de menor prioridade
(como é o comportamento padrão existente).
Se `preemptionPolicy` for definido como `Never`,
os Pods dessa PriorityClass serão Pods sem preempção.

Um exemplo de caso de uso é para cargas de trabalho de ciência de dados.
Um usuário pode enviar uma tarefa que deseja que seja priorizada acima de outras cargas de trabalho,
mas não deseja descartar o trabalho existente removendo por preempção Pods em execução.
A tarefa de alta prioridade com `preemptionPolicy: Never` será alocada
à frente de outros Pods na fila,
assim que recursos suficientes do cluster ficarem "naturalmente" livres.

### Exemplo de PriorityClass sem preempção

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority-nonpreempting
value: 1000000
preemptionPolicy: Never
globalDefault: false
description: "This priority class will not cause other pods to be preempted."
```

## Prioridade de Pod

Depois de ter uma ou mais PriorityClasses, você pode criar Pods que especifiquem um
desses nomes de PriorityClass em suas especificações. O controlador de admissão
de prioridade usa o campo `priorityClassName` e preenche o valor inteiro da
prioridade. Se a classe de prioridade não for encontrada, o Pod é rejeitado.

O YAML a seguir é um exemplo de configuração de Pod que usa a
PriorityClass criada no exemplo anterior. O controlador de admissão
de prioridade verifica a especificação e resolve a prioridade do Pod para
1000000.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    env: test
spec:
  containers:
  - name: nginx
    image: nginx
    imagePullPolicy: IfNotPresent
  priorityClassName: high-priority
```

### Efeito da prioridade de Pod na ordem de alocação

Quando a prioridade de Pod está habilitada, o escalonador ordena os Pods pendentes por
sua prioridade, e um Pod pendente é colocado à frente de outros Pods pendentes
com menor prioridade na fila de alocação. Como resultado, o Pod de maior
prioridade pode ser alocado antes dos Pods com menor prioridade, se
seus requisitos de alocação forem atendidos. Se tal Pod não puder ser alocado, o
escalonador continuará e tentará alocar outros Pods de menor prioridade.

## Preempção

Quando os Pods são criados, eles entram em uma fila e aguardam para serem alocados. O
escalonador seleciona um Pod da fila e tenta alocá-lo em um nó. Se nenhum
nó for encontrado que satisfaça todos os requisitos especificados do Pod,
a lógica de preempção é acionada para o Pod pendente. Vamos chamar o Pod pendente de P.
A lógica de preempção tenta encontrar um nó onde a remoção de um ou mais Pods com
prioridade menor que P permitiria que P fosse alocado nesse nó. Se tal
nó for encontrado, um ou mais Pods de menor prioridade são removidos do nó. Após
a remoção dos Pods, P pode ser alocado no nó.

### Informações expostas ao usuário

Quando o Pod P remove por preempção um ou mais Pods no nó N, o campo `nominatedNodeName` do
status do Pod P é definido com o nome do nó N. Este campo ajuda o escalonador a rastrear
recursos reservados para o Pod P e também fornece aos usuários informações sobre remoções
por preempção em seus clusters.

Observe que o Pod P não é necessariamente alocado no "nó nomeado".
O escalonador sempre tenta o "nó nomeado" antes de iterar sobre quaisquer outros nós.
Após os Pods alvo serem removidos por preempção, eles recebem seu período de encerramento controlado. Se
outro nó ficar disponível enquanto o escalonador aguarda o encerramento dos Pods
alvo, o escalonador pode usar o outro nó para alocar o Pod P. Como resultado,
`nominatedNodeName` e `nodeName` da especificação do Pod nem sempre são iguais. Além disso, se
o escalonador remover por preempção Pods no nó N, mas então um Pod de prioridade maior que o Pod P
chegar, o escalonador pode atribuir o nó N ao novo Pod de maior prioridade. Nesse
caso, o escalonador limpa o `nominatedNodeName` do Pod P. Ao fazer isso, o escalonador
torna o Pod P elegível para remover por preempção Pods em outro nó.

### Limitações da preempção

#### Encerramento controlado dos alvos de preempção

Quando os Pods são removidos por preempção, os alvos recebem seu
[período de encerramento controlado](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination).
Elas têm esse tempo para finalizar seu trabalho e encerrar. Se não o fizerem, são
finalizadas. Esse período de encerramento controlado cria um intervalo de tempo entre o ponto
em que o escalonador remove os Pods por preempção e o momento em que o Pod pendente (P) pode ser
alocado no nó (N). Enquanto isso, o escalonador continua alocando outros
Pods pendentes. À medida que os alvos encerram ou são finalizadas, o escalonador tenta alocar
Pods na fila de pendentes. Portanto, geralmente há um intervalo de tempo entre o
ponto em que o escalonador remove os alvos por preempção e o momento em que o Pod P é alocado. Para
minimizar esse intervalo, pode-se definir o período de encerramento controlado dos Pods de menor
prioridade como zero ou um número pequeno.

#### PodDisruptionBudget é suportado, mas não garantido

Um [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) (PDB)
permite que proprietários de aplicações limitem o número de Pods de uma aplicação replicada
que ficam indisponíveis simultaneamente por interrupções voluntárias. O Kubernetes suporta
PDB ao remover Pods por preempção, mas o respeito ao PDB é feito com base no melhor esforço. O escalonador tenta
encontrar alvos cujo PDB não seja violado pela preempção, mas se nenhum alvo assim
for encontrada, a preempção ainda ocorrerá, e os Pods de menor prioridade serão removidos
apesar de seus PDBs serem violados.

#### Afinidade entre Pods em Pods de menor prioridade

Um nó é considerado para preempção somente quando a resposta a esta pergunta for
sim: "Se todos os Pods com prioridade menor que o Pod pendente forem removidos do
nó, o Pod pendente pode ser alocado no nó?"

{{< note >}}
A preempção não remove necessariamente todos os Pods de menor
prioridade. Se o Pod pendente puder ser alocado removendo apenas parte dos
Pods de menor prioridade, então somente uma parte dos Pods de menor prioridade será removida.
Mesmo assim, a resposta à pergunta anterior deve ser sim. Se a resposta for não,
o nó não é considerado para preempção.
{{< /note >}}

Se um Pod pendente tiver {{< glossary_tooltip text="afinidade" term_id="affinity" >}} entre Pods
com um ou mais dos Pods de menor prioridade no nó, a regra de afinidade entre Pods
não poderá ser satisfeita na ausência desses Pods de menor prioridade. Nesse caso,
o escalonador não remove nenhum Pod do nó por preempção. Em vez disso, ele procura outro
nó. O escalonador pode ou não encontrar um nó adequado. Não há
garantia de que o Pod pendente possa ser alocado.

A solução recomendada para este problema é criar afinidade entre Pods apenas
com Pods de prioridade igual ou superior.

#### Preempção entre nós

Suponha que o nó N esteja sendo considerado para preempção para que um Pod pendente P possa
ser alocado no nó N. P pode se tornar viável no nó N somente se um Pod em outro nó for
removido por preempção. Aqui está um exemplo:

*   O Pod P está sendo considerado para o nó N.
*   O Pod Q está em execução em outro nó na mesma zona que o nó N.
*   O Pod P tem anti-afinidade em nível de zona com o Pod Q (`topologyKey:
    topology.kubernetes.io/zone`).
*   Não há outros casos de anti-afinidade entre o Pod P e outros Pods na
    zona.
*   Para alocar o Pod P no nó N, o Pod Q poderia ser removido por preempção, mas o escalonador
    não realiza preempção entre nós. Portanto, o Pod P será considerado
    não alocável no nó N.

Se o Pod Q fosse removido de seu nó, a violação de anti-afinidade de Pod seria
eliminada, e o Pod P poderia possivelmente ser alocado no nó N.

A adição de preempção entre nós poderá ser considerada em versões futuras, se houver
demanda suficiente e se for encontrado um algoritmo com desempenho razoável.

## Solução de problemas

A prioridade e preempção de Pods podem ter efeitos colaterais indesejados. Aqui estão alguns
exemplos de problemas potenciais e formas de lidar com eles.

### Pods são removidos por preempção desnecessariamente

A preempção remove Pods existentes de um cluster sob pressão de recursos para abrir
espaço para Pods pendentes de maior prioridade. Se você atribuir prioridades altas a
certos Pods por engano, esses Pods com prioridade alta não intencional podem causar
preempção em seu cluster. A prioridade do Pod é especificada definindo o
campo `priorityClassName` na especificação do Pod. O valor inteiro da
prioridade é então resolvido e preenchido no campo `priority` do `podSpec`.

Para resolver o problema, você pode alterar o `priorityClassName` desses Pods
para usar classes de prioridade mais baixas, ou deixar o campo vazio. Um
`priorityClassName` vazio é resolvido como zero por padrão.

Quando um Pod é removido por preempção, eventos serão registrados para o Pod removido.
A preempção deve ocorrer somente quando um cluster não possui recursos suficientes para
um Pod. Nesses casos, a preempção acontece somente quando a prioridade do Pod
pendente (que iniciou a preempção) é maior que a dos Pods alvo. A preempção não deve ocorrer quando
não há Pod pendente, ou quando os Pods pendentes têm prioridade igual ou menor
que os alvos. Se a preempção ocorrer nesses cenários, por favor registre uma issue.

### Pods são removidos por preempção, mas o Pod que iniciou a preempção não é alocado

Quando os Pods são removidos por preempção, eles recebem o período de encerramento controlado solicitado,
que é de 30 segundos por padrão. Se os Pods alvo não encerrarem dentro
desse período, eles são finalizados à força. Uma vez que todas os alvos sejam removidas, o
Pod que iniciou a preempção pode ser alocado.

Enquanto o Pod que iniciou a preempção aguarda a remoção dos alvos, um Pod de maior prioridade
pode ser criado e caber no mesmo nó. Nesse caso, o escalonador alocará
o Pod de maior prioridade em vez do que iniciou a preempção.

Este é o comportamento esperado: o Pod com maior prioridade deve tomar o lugar
de um Pod com menor prioridade.

### Pods de maior prioridade são removidos por preempção antes dos Pods de menor prioridade

O escalonador tenta encontrar nós que possam executar um Pod pendente. Se nenhum nó for
encontrado, o escalonador tenta remover Pods de menor prioridade de um nó
arbitrário para abrir espaço para o Pod pendente.
Se um nó com Pods de baixa prioridade não for viável para executar o Pod pendente, o escalonador
pode escolher outro nó com Pods de maior prioridade (em comparação com os Pods no
outro nó) para preempção. Os alvos ainda devem ter prioridade menor que o
Pod que iniciou a preempção.

Quando há múltiplos nós disponíveis para preempção, o escalonador tenta
escolher o nó com o conjunto de Pods de menor prioridade. No entanto, se tais Pods
tiverem PodDisruptionBudget que seria violado caso sejam removidos por preempção, então o
escalonador pode escolher outro nó com Pods de maior prioridade.

Quando múltiplos nós existem para preempção e nenhum dos cenários acima se aplica,
o escalonador escolhe o nó com a menor prioridade.

## Interações entre prioridade de Pod e qualidade de serviço {#interactions-of-pod-priority-and-qos}

A prioridade de Pod e a {{< glossary_tooltip text="classe de QoS" term_id="qos-class" >}}
são duas funcionalidades ortogonais com poucas interações e sem restrições padrão na
definição da prioridade de um Pod com base em suas classes de QoS. A lógica de
preempção do escalonador não considera QoS ao escolher alvos de preempção.
A preempção considera a prioridade do Pod e tenta escolher um conjunto de alvos com
a menor prioridade. Pods de maior prioridade são considerados para preempção somente se
a remoção dos Pods de menor prioridade não for suficiente para permitir que o escalonador
aloque o Pod que iniciou a preempção, ou se os Pods de menor prioridade estiverem protegidos por
`PodDisruptionBudget`.

O kubelet usa a prioridade para determinar a ordem dos Pods para [remoção por pressão de nó](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
Você pode usar a classe de QoS para estimar a ordem em que os Pods têm maior probabilidade
de serem removidos. O kubelet classifica os Pods para remoção com base nos seguintes fatores:

  1. Se o uso do recurso escasso excede as requisições
  1. Prioridade do Pod
  1. Quantidade de uso de recurso em relação às requisições

Veja [Seleção de Pods para remoção pelo kubelet](/docs/concepts/scheduling-eviction/node-pressure-eviction/#pod-selection-for-kubelet-eviction)
para mais detalhes.

A remoção por pressão de nó do kubelet não remove Pods quando seu
uso não excede suas requisições. Se um Pod com menor prioridade não está
excedendo suas requisições, ele não será removido. Outro Pod com maior prioridade
que exceda suas requisições pode ser removido.

## {{% heading "whatsnext" %}}

* Leia sobre o uso de ResourceQuotas em conjunto com PriorityClasses: [limitar o consumo de PriorityClass por padrão](/docs/concepts/policy/resource-quotas/#limit-priority-class-consumption-by-default)
* Aprenda sobre [Interrupção de Pod](/docs/concepts/workloads/pods/disruptions/)
* Aprenda sobre [Remoção iniciada por API](/docs/concepts/scheduling-eviction/api-eviction/)
* Aprenda sobre [Remoção por pressão de nó](/docs/concepts/scheduling-eviction/node-pressure-eviction/)
