---
title: Boas práticas para Alocação Dinâmica de Recursos (DRA) para administradores de cluster
content_type: concept
weight: 60
---

<!-- overview -->

Esta página descreve as boas práticas para configurar um cluster do Kubernetes
com Alocação Dinâmica de Recursos (DRA). Essas
instruções são para administradores de cluster.

<!-- body -->

## Permissões separadas para APIs relacionadas à DRA

A DRA é orquestrada por várias APIs diferentes. Use ferramentas de autorização
(como RBAC ou similares) para controlar o acesso às APIs corretas, de acordo com o perfil dos seus usuários.

Em geral, DeviceClasses e ResourceSlices devem ser restritos aos administradores e aos drivers DRA. Operadores
de cluster que implantarão Pods com claims precisarão de acesso às APIs ResourceClaim e
ResourceClaimTemplate; ambas têm escopo de namespace.

## Implantação e manutenção de drivers DRA

Os drivers DRA são aplicativos de terceiros executados em cada nó do seu cluster para interagir com o hardware desse nó
e com os componentes nativos de DRA do Kubernetes. O procedimento de instalação depende do driver que você escolher, mas o driver provavelmente é implantado como um DaemonSet em todos ou em parte dos nós do cluster (usando seletores de nós ou mecanismos similares).

### Use drivers que permitam atualização contínua, caso estejam disponíveis

Os drivers DRA implementam a interface do [pacote `kubeletplugin`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin).
Seu driver pode oferecer suporte a _atualizações contínuas_ implementando uma propriedade dessa interface que permite que duas versões de um mesmo driver DRA coexistam por um curto período. Esse recurso está disponível apenas a partir da versão 1.33 do kubelet e talvez não seja suportado pelo seu driver em clusters heterogêneos com nós conectados rodando versões antigas do Kubernetes; verifique a documentação do seu driver para ter certeza.

Se as atualizações contínuas estiverem disponíveis para essa situação, considere utilizá-las para minimizar atrasos de agendamento quando houver atualização no seu driver.

Caso não seja possível utilizar atualizações contínuas, durante o tempo de inatividade dos drivers para atualizações, você pode observar que:

- Pods não poderão inicializar a menos que os claims dos quais eles dependem já tenham sido preparados para
  uso.
- A limpeza após o último Pod que usou um claim é adiada até que o driver esteja
  disponível novamente. O Pod não é marcado como encerrado. Isso impede que os recursos usados por esse Pod sejam reutilizados por outros Pods.
- Os Pods em execução continuarão funcionando.

### Confirme se o seu driver DRA expõe uma liveness probe e utilize-a

É provável que seu driver DRA implemente um socket gRPC para verificações de integridade como parte das boas práticas para drivers DRA. A maneira mais fácil de utilizar esse socket gRPC é configurá-lo como uma liveness probe no DaemonSet que implanta seu driver DRA. A documentação do seu driver ou as ferramentas de implantação podem já incluir isso, mas se você estiver criando sua configuração separadamente ou não estiver executando seu driver DRA como um Pod do Kubernetes, certifique-se de que suas ferramentas de orquestração reiniciem o driver em caso de falhas nas verificações de integridade desse socket gRPC. Isso minimiza qualquer tempo de inatividade indesejado do driver e dá a ele mais oportunidades de autocorreção, reduzindo atrasos no agendamento ou o tempo de resolução de problemas.

### Ao drenar um nó, drene o driver DRA o mais tarde possível

O driver DRA é responsável por desfazer a preparação dos dispositivos que foram alocados a Pods e, se o driver DRA for {{< glossary_tooltip text="drenado"
term_id="drain" >}} antes que os Pods com claims tenham sido excluídos, ele não conseguirá concluir sua limpeza. Se você implementar uma lógica personalizada de drenagem para nós, considere verificar se não há ResourceClaims ou ResourceClaimTemplates alocados/reservados antes de encerrar o próprio driver DRA.

## Monitore e ajuste os componentes para uma carga maior, especialmente em ambientes de alta escala

O {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}, componente da camada de gerenciamento,
e o controlador interno de ResourceClaim,
gerenciado pelo {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}}, realizam o
trabalho pesado durante o agendamento de Pods com claims, com base em metadados armazenados nas
APIs da DRA. Em comparação com Pods agendados sem DRA, o número de chamadas ao servidor de API,
a memória e a utilização de CPU necessárias por esses componentes aumentam para
Pods que utilizam claims da DRA. Além disso, componentes locais ao nó, como o driver DRA
e o kubelet, utilizam as APIs da DRA para alocar o hardware solicitado no momento da criação da sandbox
do Pod. Especialmente em ambientes de grande escala, onde os clusters possuem muitos
nós e/ou implantam muitas cargas de trabalho que utilizam intensamente os claims de recursos
definidos pela DRA, o administrador do cluster deve configurar os componentes relevantes para
antecipar o aumento da carga.

A falta de ajustes nos componentes pode causar efeitos diretos ou em cascata, com sintomas variados ao longo do ciclo de vida do Pod. Se as configurações de QPS e burst do `kube-scheduler` forem muito baixas, o agendador pode identificar rapidamente um nó adequado para um Pod, mas demorar mais para vincular o Pod a esse nó. Com a DRA, durante o agendamento do Pod, os parâmetros QPS e burst na configuração do client-go dentro do `kube-controller-manager` são fundamentais.

Os valores específicos para ajustar seu cluster dependem de diversos fatores, como
o número de nós/Pods, a taxa de criação de Pods e a rotatividade, mesmo em ambientes que não utilizam a DRA;
consulte o [README do SIG Scalability sobre limites de escalabilidade do Kubernetes](https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md)
para obter mais informações. Em testes de escalabilidade realizados em um cluster com DRA habilitada
com 100 nós, envolvendo 720 Pods de longa duração (90% de saturação) e 80 Pods de rotatividade
(10% de rotatividade, 10 vezes), com uma taxa de criação de Jobs de 10, o QPS do `kube-controller-manager`
pôde ser reduzido a até 75 e o burst a 150 para atingir metas de métricas equivalentes
às de implantações sem DRA. Nesse limite inferior, observou-se que o
limitador de taxa do lado do cliente foi acionado o suficiente para proteger o servidor de API contra
picos bruscos de requisições, mas o limite ainda era alto o suficiente para que os SLOs de inicialização dos Pods não fossem afetados.
Esse é um bom ponto de partida, mas, para ajustar os componentes que mais afetam o desempenho da DRA na sua implantação, monitore as métricas a seguir. Para obter mais informações sobre todas
as métricas estáveis no Kubernetes, consulte a [Referência de Métricas do Kubernetes](/docs/reference/instrumentation/metrics/).

### Métricas do `kube-controller-manager`

As métricas a seguir analisam detalhadamente o controlador interno de ResourceClaim
gerenciado pelo `kube-controller-manager`.

- Taxa de adição à fila de trabalho: monitore
  {{< highlight promql "hl_inline=true"  >}} sum(rate(workqueue_adds_total{name="resource_claim"}[5m])) {{< /highlight >}} para avaliar a rapidez com que os itens são adicionados ao controlador de ResourceClaim.
- Profundidade da fila de trabalho: acompanhe
  {{< highlight promql "hl_inline=true" >}}sum(workqueue_depth{endpoint="kube-controller-manager",
  name="resource_claim"}){{< /highlight >}} para identificar acúmulo de itens no controlador de ResourceClaim.
- Duração do trabalho na fila: observe
  {{< highlight promql "hl_inline=true">}}histogram_quantile(0.99,
  sum(rate(workqueue_work_duration_seconds_bucket{name="resource_claim"}[5m]))
  by (le)){{< /highlight >}} para compreender a velocidade com que o controlador de ResourceClaim processa o trabalho.

Se você estiver enfrentando baixa taxa de adição à fila de trabalho, alta profundidade da fila de trabalho e/ou
alta duração do trabalho na fila, isso sugere que o controlador não está funcionando
de maneira ideal. Considere ajustar parâmetros como QPS, burst e configurações de CPU/memória.

Se você estiver enfrentando alta taxa de adição à fila de trabalho, alta profundidade da fila de trabalho, mas
uma duração razoável do trabalho na fila, isso indica que o controlador está processando
o trabalho, mas a concorrência pode ser insuficiente. A concorrência é fixa no código do
controlador; portanto, como administrador do cluster, você pode ajustar isso reduzindo o
QPS de criação de Pods, para que a taxa de adição à fila de trabalho de ResourceClaims seja mais
gerenciável.

### Métricas do `kube-scheduler`

As métricas a seguir, do agendador, são de alto nível e agregam o desempenho de todos os Pods agendados, e não apenas daqueles que utilizam a DRA. É importante observar que as métricas de ponta a ponta são, em última instância, influenciadas pelo desempenho do `kube-controller-manager` na criação de ResourceClaims a partir de ResourceClaimTemplates em implantações que fazem uso intensivo de ResourceClaimTemplates.

- Duração de ponta a ponta do agendador: monitore {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(increase(scheduler_pod_scheduling_sli_duration_seconds_bucket[5m])) by (le)){{< /highlight >}}.
- Latência do algoritmo do agendador: acompanhe {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(increase(scheduler_scheduling_algorithm_duration_seconds_bucket[5m])) by (le)){{< /highlight >}}.

### Métricas do `kubelet`

Quando um Pod vinculado a um nó precisa ter um ResourceClaim atendido, o kubelet chama os métodos `NodePrepareResources` e `NodeUnprepareResources` do driver DRA. É possível observar esse comportamento do ponto de vista do kubelet por meio das seguintes métricas.

- Kubelet NodePrepareResources: monitore {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_operations_duration_seconds_bucket{operation_name="PrepareResources"}[5m])) by (le)){{< /highlight >}}.
- Kubelet NodeUnprepareResources: acompanhe {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_operations_duration_seconds_bucket{operation_name="UnprepareResources"}[5m])) by (le)){{< /highlight >}}.

### Operações do `kubeletplugin` da DRA

Os drivers DRA implementam a [interface do pacote `kubeletplugin`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
que expõe suas próprias métricas para as operações gRPC subjacentes `NodePrepareResources` e `NodeUnprepareResources`. É possível observar esse comportamento do ponto de vista do `kubeletplugin` interno por meio das seguintes métricas.

- Operação gRPC NodePrepareResources do `kubeletplugin` da DRA: observe {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99, sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodePrepareResources"}[5m])) by (le)){{< /highlight >}}.
- Operação gRPC NodeUnprepareResources do `kubeletplugin` da DRA: observe {{< highlight promql "hl_inline=true" >}} histogram_quantile(0.99, sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodeUnprepareResources"}[5m])) by (le)){{< /highlight >}}.

## {{% heading "whatsnext" %}}

- [Aprenda mais sobre a DRA](/docs/concepts/resource-management/dynamic-resource-allocation/)
- Leia a [Referência de Métricas do Kubernetes](/docs/reference/instrumentation/metrics/)