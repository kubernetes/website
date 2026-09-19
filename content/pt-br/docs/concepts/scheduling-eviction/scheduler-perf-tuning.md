---
title: Ajuste de desempenho do agendador
content_type: concept
weight: 70
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

O [kube-scheduler](/pt-br/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler)
é o agendador padrão do Kubernetes. Ele é responsável pelo posicionamento de Pods
em Nós em um cluster.

Os nós de um cluster que atendem aos requisitos de agendamento de um Pod são
chamados de nós _viáveis_ (feasible) para o Pod. O agendador encontra nós viáveis
para um Pod e, em seguida, executa um conjunto de funções para pontuar os nós viáveis,
escolhendo um nó com a pontuação mais alta entre os viáveis para executar
o Pod. O agendador então notifica o servidor de API sobre essa decisão
em um processo chamado _Vinculação_ (Binding).

Esta página explica as otimizações de ajuste de desempenho que são relevantes para
clusters Kubernetes de grande porte.

<!-- body -->

Em clusters grandes, você pode ajustar o comportamento do agendador equilibrando
os resultados do agendamento entre latência (novos Pods são posicionados rapidamente) e
precisão (o agendador raramente toma decisões de posicionamento ruins).

Você configura esse ajuste por meio da configuração `percentageOfNodesToScore`
do kube-scheduler. Esta configuração da KubeSchedulerConfiguration determina
um limite para agendar nós no seu cluster.

### Definindo o limite

A opção `percentageOfNodesToScore` aceita valores numéricos inteiros entre 0
e 100. O valor 0 é um número especial que indica que o kube-scheduler
deve usar seu padrão compilado (compiled-in default).
Se você definir `percentageOfNodesToScore` acima de 100, o kube-scheduler age como se você
tivesse definido o valor 100.

Para alterar o valor, edite o
[arquivo de configuração do kube-scheduler](/docs/reference/config-api/kube-scheduler-config.v1/)
e reinicie o agendador.
Em muitos casos, o arquivo de configuração pode ser encontrado em `/etc/kubernetes/config/kube-scheduler.yaml`.

Depois de fazer essa alteração, você pode executar

```bash
kubectl get pods -n kube-system | grep kube-scheduler
```

para verificar se o componente kube-scheduler está saudável.

## Limite de pontuação de nós {#percentage-of-nodes-to-score}

Para melhorar o desempenho do agendamento, o kube-scheduler pode parar de procurar por
nós viáveis depois de encontrar o suficiente. Em clusters grandes, isso economiza
tempo em comparação com uma abordagem ingênua que consideraria cada nó.

Você especifica um limite de quantos nós são suficientes, como um número inteiro em porcentagem
de todos os nós do seu cluster. O kube-scheduler converte isso em um
número inteiro de nós. Durante o agendamento, se o kube-scheduler tiver identificado
nós viáveis suficientes para exceder a porcentagem configurada, o kube-scheduler
para de procurar por mais nós viáveis e passa para a
[fase de pontuação](/pt-br/docs/concepts/scheduling-eviction/kube-scheduler/#kube-scheduler-implementation).

[Como o agendador itera sobre os nós](#how-the-scheduler-iterates-over-nodes)
descreve o processo em detalhes.

### Limite padrão

Se você não especificar um limite, o Kubernetes calcula um valor usando uma
fórmula linear que resulta em 50% para um cluster de 100 nós e em 10%
para um cluster de 5000 nós. O limite inferior para o valor automático é 5%.

Isso significa que o kube-scheduler sempre pontua pelo menos 5% do seu cluster, não
importa quão grande seja o cluster, a menos que você tenha definido explicitamente
`percentageOfNodesToScore` para um valor menor que 5.

Se você quiser que o agendador pontue todos os nós do seu cluster, defina
`percentageOfNodesToScore` como 100.

## Exemplo

Abaixo está um exemplo de configuração que define `percentageOfNodesToScore` como 50%.

```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha1
kind: KubeSchedulerConfiguration
algorithmSource:
  provider: DefaultProvider

...

percentageOfNodesToScore: 50
```

## Ajustando o percentageOfNodesToScore

O `percentageOfNodesToScore` deve ser um valor entre 1 e 100, com o valor padrão
sendo calculado com base no tamanho do cluster. Há também um valor mínimo
fixado no código (hardcoded) de 100 nós.

{{< note >}}Em clusters com menos de 100 nós viáveis, o agendador ainda
verifica todos os nós, porque não há nós viáveis suficientes para interromper
antecipadamente a busca do agendador.

Em um cluster pequeno, se você definir um valor baixo para `percentageOfNodesToScore`, sua
alteração não terá efeito ou terá pouco efeito, por um motivo semelhante.

Se o seu cluster tiver várias centenas de Nós ou menos, deixe esta opção de configuração
em seu valor padrão. Fazer alterações dificilmente melhorará
significativamente o desempenho do agendador.
{{< /note >}}

Um detalhe importante a considerar ao definir esse valor é que, quando um número menor
de nós em um cluster é verificado quanto à viabilidade, alguns nós não são
enviados para pontuação para um determinado Pod. Como resultado, um Nó que possivelmente
poderia obter uma pontuação mais alta para executar o determinado Pod pode nem ser passado para a
fase de pontuação. Isso resultaria em um posicionamento menos que ideal do Pod.

Você deve evitar definir `percentageOfNodesToScore` muito baixo para que o kube-scheduler
não tome decisões frequentes e ruins de posicionamento de Pods. Evite definir a
porcentagem para qualquer valor abaixo de 10%, a menos que a taxa de transferência do agendador seja crítica
para a sua aplicação e a pontuação dos nós não seja importante. Em outras palavras, você
prefere executar o Pod em qualquer Nó, contanto que ele seja viável.

## Como o agendador itera sobre os nós

Esta seção é destinada àqueles que desejam entender os detalhes internos
deste recurso.

Para dar a todos os Nós de um cluster a mesma chance de serem considerados
para executar Pods, o agendador itera sobre os nós em um esquema round robin. Você pode imaginar que os Nós estão
em um array. O agendador começa do início do array e verifica a viabilidade dos nós até encontrar Nós
suficientes, conforme especificado por `percentageOfNodesToScore`. Para o próximo Pod, o
agendador continua a partir do ponto do array de Nós em que parou ao
verificar a viabilidade dos Nós para o Pod anterior.

Se os Nós estiverem em múltiplas zonas, o agendador itera sobre os Nós em várias
zonas para garantir que nós de diferentes zonas sejam considerados nas
verificações de viabilidade. Como exemplo, considere seis nós em duas zonas:

```
Zone 1: Node 1, Node 2, Node 3, Node 4
Zone 2: Node 5, Node 6
```

O agendador avalia a viabilidade dos nós nesta ordem:

```
Node 1, Node 5, Node 2, Node 6, Node 3, Node 4
```

Depois de percorrer todos os Nós, ele volta ao Nó 1.

## Habilitando o Opportunistic Batching

{{< feature-state feature_gate_name="OpportunisticBatching" >}}

Ao agendar cargas de trabalho grandes, os Pods frequentemente têm restrições de agendamento equivalentes e exigem que o agendador
execute as mesmas operações repetidamente. O recurso [Opportunistic Batching](/docs/reference/command-line-tools-reference/feature-gates/#OpportunisticBatching)
permite que o agendador reutilize os resultados de filtragem e pontuação entre os ciclos de agendamento,
o que acelera muito o processo de agendamento.

Com a repontuação (rescoring), o agendador pode continuar o loteamento (batching) nessa situação. Quando o próximo Pod ainda pode caber no
Nó escolhido anteriormente, o agendador atualiza a pontuação desse Nó e o coloca de volta na lista de candidatos em cache.
Se a repontuação não for bem-sucedida, o agendador volta ao comportamento existente e limpa o cache.

Basicamente, esse recurso funciona assim:
1. O agendador agenda o pod-1 e armazena o resultado do agendamento em cache.
1. O agendador agenda o pod-2, 3, ... com os resultados em cache.
1. O cache expira após 0,5 segundo. O agendador agenda o próximo pod, o que constrói um novo cache.

Pods com restrições de agendamento equivalentes precisam chegar ao ciclo de agendamento em sequência. Quando o agendador agenda um pod com restrições diferentes, o cache não é usado, mas substituído por um novo.

Aplicamos esse agendamento em lote a pods específicos que:
1. Não têm afinidade/antiafinidade entre pods
1. Não têm restrições de distribuição de topologia (topology spread constraints)
1. Não têm DRA (ou seja, não têm nenhum Resource Claim)
1. Não solicitam recursos estendidos que sejam suportados pelo DRA

Além disso, para habilitar esse recurso, a configuração do agendador precisa:
1. Desabilitar a [distribuição de topologia padrão](/docs/concepts/scheduling-eviction/topology-spread-constraints/#internal-default-constraints) (definir como vazia)
1. Definir `IgnorePreferredTermsOfExistingPods` de [InterPodAffinityArgs](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-InterPodAffinityArgs)
como `true` para tornar o loteamento mais eficiente

Note que sempre que:
1. Pods existentes usam restrições de afinidade de pod que correspondem aos labels de algum dos pods agendados, o recurso pode não trazer nenhum benefício
1. Plugins personalizados são usados, eles precisam implementar o ponto de extensão Signature

As restrições e condições devem evoluir em versões futuras.

## {{% heading "whatsnext" %}}

* Consulte a [referência de configuração do kube-scheduler (v1)](/docs/reference/config-api/kube-scheduler-config.v1/)
