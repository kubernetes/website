---
title: Framework de Agendamento
content_type: concept
weight: 60
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

O _framework de agendamento_ (scheduling framework) é uma arquitetura plugável para o agendador do Kubernetes.
Ele consiste em um conjunto de APIs de "plugin" que são compiladas diretamente no agendador.
Essas APIs permitem que a maioria dos recursos de agendamento seja implementada como plugins,
mantendo o "núcleo" do agendamento leve e de fácil manutenção. Consulte a
[proposta de design do framework de agendamento][kep] para obter mais informações técnicas sobre
o design do framework.

[kep]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/624-scheduling-framework/README.md

<!-- body -->

## Fluxo de trabalho do framework

O Framework de Agendamento define alguns pontos de extensão. Os plugins do agendador
se registram para serem invocados em um ou mais pontos de extensão. Alguns desses plugins
podem alterar as decisões de agendamento e outros são apenas informativos.

Cada tentativa de agendar um Pod é dividida em duas fases: o
**ciclo de agendamento** e o **ciclo de vinculação (binding)**.

### Ciclo de agendamento e ciclo de vinculação

O ciclo de agendamento seleciona um nó para o Pod, e o ciclo de vinculação aplica
essa decisão ao cluster. Em conjunto, um ciclo de agendamento e um ciclo de vinculação são
chamados de "contexto de agendamento" (scheduling context).

Os ciclos de agendamento são executados serialmente, enquanto os ciclos de vinculação podem ser executados simultaneamente.

Um ciclo de agendamento ou de vinculação pode ser abortado se o Pod for considerado
não agendável ou se houver um erro interno. O Pod será devolvido à
fila e tentado novamente.

## Interfaces

A imagem a seguir mostra o contexto de agendamento de um Pod e as interfaces
que o framework de agendamento expõe.

Um único plugin pode implementar múltiplas interfaces para realizar tarefas mais complexas ou
com estado (stateful).

Algumas interfaces correspondem aos pontos de extensão do agendador, que podem ser configurados por meio da
[Configuração do Agendador](/docs/reference/scheduling/config/#extension-points).

{{< figure src="/images/docs/scheduling-framework-extensions.png" title="Scheduling framework extension points" class="diagram-large">}}

### PreEnqueue {#pre-enqueue}

Esses plugins são chamados antes de adicionar os Pods à fila ativa interna, onde os Pods são marcados como
prontos para agendamento.

Somente quando todos os plugins PreEnqueue retornam `Success`, o Pod pode entrar na fila ativa.
Caso contrário, ele é colocado na lista interna de Pods não agendáveis e não recebe uma condição `Unschedulable`.

Para mais detalhes sobre como as filas internas do agendador funcionam, leia
[Fila de agendamento no kube-scheduler](https://github.com/kubernetes/community/blob/f03b6d5692bd979f07dd472e7b6836b2dad0fd9b/contributors/devel/sig-scheduling/scheduler_queues.md).

### EnqueueExtension

EnqueueExtension é a interface onde o plugin pode controlar
se a tentativa de agendamento de Pods rejeitados por esse plugin deve ser repetida, com base em alterações no cluster.
Plugins que implementam PreEnqueue, PreFilter, Filter, Reserve ou Permit devem implementar esta interface.

### QueueingHint

{{< feature-state feature_gate_name="SchedulerQueueingHints" >}}

QueueingHint é uma função de callback para decidir se um Pod pode ser recolocado na fila ativa ou na fila de backoff.
Ela é executada toda vez que um determinado tipo de evento ou alteração acontece no cluster.
Quando o QueueingHint identifica que o evento pode tornar o Pod agendável,
o Pod é colocado na fila ativa ou na fila de backoff
para que o agendador tente novamente o agendamento do Pod.

### QueueSort {#queue-sort}

Esses plugins são usados para classificar os Pods na fila de agendamento. Um plugin de classificação de fila
essencialmente fornece uma função `Less(Pod1, Pod2)`. Apenas um plugin de
classificação de fila pode estar habilitado por vez.

### PreFilter {#pre-filter}

Esses plugins são usados para pré-processar informações sobre o Pod ou para verificar certas
condições que o cluster ou o Pod devem atender. Se um plugin PreFilter retornar
um erro, o ciclo de agendamento é abortado.

### Filter

Esses plugins são usados para filtrar os nós que não podem executar o Pod. Para cada
nó, o agendador chamará os plugins de filtro em sua ordem configurada. Se qualquer
plugin de filtro marcar o nó como inviável, os plugins restantes não serão
chamados para aquele nó. Os nós podem ser avaliados simultaneamente.

### PostFilter {#post-filter}

Esses plugins são chamados após a fase de Filter, mas apenas quando nenhum nó viável
foi encontrado para o pod. Os plugins são chamados em sua ordem configurada. Se
qualquer plugin postFilter marcar o nó como `Schedulable`, os plugins restantes
não serão chamados. Uma implementação típica de PostFilter é a preempção, que
tenta tornar o pod agendável interrompendo (preemptando) outros Pods.

### PreScore {#pre-score}

Esses plugins são usados para executar o trabalho de "pré-pontuação" (pre-scoring), que gera um estado
compartilhável para uso pelos plugins de Score. Se um plugin PreScore retornar um erro, o
ciclo de agendamento é abortado.

### Score {#scoring}

Esses plugins são usados para classificar os nós que passaram pela fase de filtragem. O
agendador chamará cada plugin de pontuação para cada nó. Haverá um intervalo bem
definido de inteiros representando as pontuações mínima e máxima. Após a
fase [NormalizeScore](#normalize-scoring), o agendador combinará as
pontuações dos nós de todos os plugins de acordo com os pesos de plugin configurados.

#### Pontuação de capacidade {#scoring-capacity}

{{< feature-state feature_gate_name="StorageCapacityScoring" >}}

O feature gate `VolumeCapacityPriority` era usado na v1.32 para suportar armazenamento
provisionado estaticamente. A partir da v1.33, o novo feature gate `StorageCapacityScoring`
substitui o antigo gate `VolumeCapacityPriority`, com suporte adicional a armazenamento provisionado dinamicamente.
Quando o `StorageCapacityScoring` está habilitado, o plugin VolumeBinding no kube-scheduler é estendido
para pontuar os Nós com base na capacidade de armazenamento de cada um deles.
Esse recurso é aplicável a volumes CSI que suportam [Capacidade de Armazenamento](/docs/concepts/storage/storage-capacity/),
incluindo armazenamento local suportado por um driver CSI.

### NormalizeScore {#normalize-scoring}

Esses plugins são usados para modificar as pontuações antes de o agendador calcular uma
classificação final dos Nós. Um plugin que se registra para este ponto de extensão será
chamado com os resultados de [Score](#scoring) do mesmo plugin. Isso é chamado
uma vez por plugin por ciclo de agendamento.

Por exemplo, suponha que um plugin `BlinkingLightScorer` classifique os Nós com base em quantas
luzes piscantes eles têm.

```go
func ScoreNode(_ *v1.pod, n *v1.Node) (int, error) {
    return getBlinkingLightCount(n)
}
```

No entanto, a contagem máxima de luzes piscantes pode ser pequena em comparação com
`NodeScoreMax`. Para corrigir isso, o `BlinkingLightScorer` também deve se registrar neste
ponto de extensão.

```go
func NormalizeScores(scores map[string]int) {
    highest := 0
    for _, score := range scores {
        highest = max(highest, score)
    }
    for node, score := range scores {
        scores[node] = score*NodeScoreMax/highest
    }
}
```

Se qualquer plugin NormalizeScore retornar um erro, o ciclo de agendamento é
abortado.

{{< note >}}
Plugins que desejam executar o trabalho de "pré-reserva" (pre-reserve) devem usar o
ponto de extensão NormalizeScore.
{{< /note >}}

### Reserve {#reserve}

Um plugin que implementa a interface Reserve possui dois métodos, nomeadamente `Reserve`
e `Unreserve`, que sustentam duas fases de agendamento informativas chamadas Reserve
e Unreserve, respectivamente. Plugins que mantêm estado em tempo de execução (também conhecidos como
"plugins com estado", stateful plugins) devem usar essas fases para serem notificados pelo agendador quando os recursos
de um nó estão sendo reservados e liberados para um determinado Pod.

A fase de Reserve acontece antes de o agendador realmente vincular um Pod ao seu
nó designado. Ela existe para evitar condições de corrida enquanto o agendador aguarda
a vinculação ser bem-sucedida. O método `Reserve` de cada plugin Reserve pode ter sucesso
ou falhar; se uma chamada do método `Reserve` falhar, os plugins subsequentes não são executados
e a fase de Reserve é considerada como tendo falhado. Se o método `Reserve` de
todos os plugins for bem-sucedido, a fase de Reserve é considerada bem-sucedida e o
restante do ciclo de agendamento e o ciclo de vinculação são executados.

A fase de Unreserve é acionada se a fase de Reserve ou uma fase posterior falhar.
Quando isso acontece, o método `Unreserve` de **todos** os plugins Reserve será
executado na ordem inversa das chamadas do método `Reserve`. Esta fase existe para
limpar o estado associado ao Pod reservado.

{{< caution >}}
A implementação do método `Unreserve` nos plugins Reserve deve ser
idempotente e não pode falhar.
{{< /caution >}}

### Permit

Os plugins _Permit_ são invocados no final do ciclo de agendamento para cada Pod, para
impedir ou atrasar a vinculação ao nó candidato. Um plugin de permit pode fazer uma
das três coisas:

1.  **approve** \
    Uma vez que todos os plugins Permit aprovam um Pod, ele é enviado para a vinculação.

1.  **deny** \
    Se qualquer plugin Permit negar um Pod, ele é devolvido à fila de agendamento.
    Isso acionará a fase de Unreserve nos [plugins Reserve](#reserve).

1.  **wait** (com um timeout) \
    Se um plugin Permit retornar "wait", o Pod é mantido em uma lista interna de Pods
    "em espera", e o ciclo de vinculação deste Pod começa, mas fica bloqueado diretamente até
    ser aprovado. Se ocorrer um timeout, **wait** se torna **deny**
    e o Pod é devolvido à fila de agendamento, acionando a
    fase de Unreserve nos [plugins Reserve](#reserve).

{{< note >}}
Embora qualquer plugin possa acessar a lista de Pods "em espera" e aprová-los
(consulte [`FrameworkHandle`](https://git.k8s.io/enhancements/keps/sig-scheduling/624-scheduling-framework#frameworkhandle)),
esperamos que apenas os plugins de permit aprovem a vinculação de Pods reservados que estejam em estado de "espera".
Uma vez que um Pod é aprovado, ele é enviado para a fase [PreBind](#pre-bind).
{{< /note >}}

### PreBind {#pre-bind}

Esses plugins são usados para executar qualquer trabalho necessário antes de um Pod ser vinculado. Por
exemplo, um plugin de pré-vinculação pode provisionar um volume de rede e montá-lo no
nó de destino antes de permitir que o Pod seja executado lá.

Se qualquer plugin PreBind retornar um erro, o Pod é [rejeitado](#reserve) e
devolvido à fila de agendamento.

### Bind

Esses plugins são usados para vincular um Pod a um Nó. Os plugins Bind não serão chamados
até que todos os plugins PreBind tenham sido concluídos. Cada plugin de bind é chamado na
ordem configurada. Um plugin de bind pode escolher lidar ou não com o Pod fornecido. Se um plugin de bind escolher lidar com um Pod, **os plugins de bind restantes são
ignorados**.

### PostBind {#post-bind}

Esta é uma interface informativa. Os plugins de pós-vinculação (post-bind) são chamados depois que um
Pod é vinculado com sucesso. Este é o fim de um ciclo de vinculação e pode ser usado
para limpar os recursos associados.

## API de Plugin

Há duas etapas na API de plugin. Primeiro, os plugins devem se registrar e ser
configurados; então, eles usam as interfaces dos pontos de extensão. As interfaces dos pontos de extensão
têm o seguinte formato.

```go
type Plugin interface {
    Name() string
}

type QueueSortPlugin interface {
    Plugin
    Less(*v1.pod, *v1.pod) bool
}

type PreFilterPlugin interface {
    Plugin
    PreFilter(context.Context, *framework.CycleState, *v1.pod) error
}

// ...
```

## Configuração de plugins

Você pode habilitar ou desabilitar plugins na configuração do agendador. Se você estiver usando
o Kubernetes v1.18 ou posterior, a maioria dos
[plugins](/docs/reference/scheduling/config/#scheduling-plugins) de agendamento está em uso e
habilitada por padrão.

Além dos plugins padrão, você também pode implementar seus próprios plugins de
agendamento e configurá-los junto com os plugins padrão. Você pode visitar
[scheduler-plugins](https://github.com/kubernetes-sigs/scheduler-plugins) para mais detalhes.

Se você estiver usando o Kubernetes v1.18 ou posterior, pode configurar um conjunto de plugins como
um perfil (profile) de agendador e, em seguida, definir múltiplos perfis para atender a vários tipos de carga de trabalho.
Saiba mais em [múltiplos perfis](/docs/reference/scheduling/config/#multiple-profiles).
