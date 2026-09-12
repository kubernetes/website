---
title: Boas práticas para Alocação Dinâmica de Recursos como Administrador de Cluster
content_type: concept
weight: 60
---

<!-- overview -->
Esta página descreve boas práticas ao configurar um cluster do Kubernetes
utilizando a Alocação Dinâmica de Recursos (DRA - Dynamic Resource Allocation). Estas instruções são para
administradores de cluster.

<!-- body -->
## Permissões separadas para as APIs relacionadas ao DRA

O DRA é orquestrado por meio de várias APIs diferentes. Use ferramentas de
autorização (como RBAC, ou outra solução) para controlar o acesso às APIs corretas dependendo
do perfil do seu usuário.

Em geral, DeviceClasses e ResourceSlices devem ser restritas a administradores e
aos drivers DRA. Operadores de cluster que irão implantar Pods com claims precisarão
de acesso às APIs ResourceClaim e ResourceClaimTemplate; ambas estas APIs
têm escopo de namespace.

## Implantação e manutenção do driver DRA

Os drivers DRA são aplicações de terceiros que são executadas em cada nó do seu cluster
para fazer a interface com o hardware desse nó e com os componentes DRA nativos
do Kubernetes. O procedimento de instalação depende do driver que você escolher, mas é
provável que seja implantado como um DaemonSet em todos os nós ou em uma seleção dos nós (usando seletores
de nó ou mecanismos semelhantes) do seu cluster.

### Use drivers com atualização sem interrupção (seamless upgrade), se disponível

Os drivers DRA implementam a [interface do pacote
`kubeletplugin`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin).
Seu driver pode suportar _atualizações sem interrupção (seamless upgrades)_ implementando uma propriedade desta
interface que permite que duas versões do mesmo driver DRA coexistam por um curto
período de tempo. Isso está disponível apenas para versões do kubelet 1.33 e superiores e pode não ser
suportado pelo seu driver em clusters heterogêneos com nós anexados executando
versões mais antigas do Kubernetes - verifique a documentação do seu driver para ter certeza.

Se atualizações sem interrupção estiverem disponíveis para a sua situação, considere usá-las para
minimizar os atrasos de agendamento quando o seu driver for atualizado.

Se você não puder usar atualizações sem interrupção, durante o tempo de inatividade do driver para atualizações você pode
observar que:
* Os Pods não podem iniciar, a menos que os claims dos quais dependem já tenham sido preparados para
  uso.
* A limpeza após o último pod que usou um claim fica atrasada até que o driver esteja
  disponível novamente. O pod não é marcado como terminado. Isso impede a reutilização
  dos recursos usados pelo pod por outros pods.
* Os pods em execução continuarão em execução.

### Confirme que seu driver DRA expõe uma liveness probe e utilize-a

Seu driver DRA provavelmente implementa um socket gRPC para healthchecks como parte das
boas práticas do driver DRA. A maneira mais fácil de utilizar este socket gRPC é
configurá-lo como uma liveness probe para o DaemonSet que implanta seu driver DRA.
A documentação ou as ferramentas de implantação do seu driver já podem incluir isso, mas
se você estiver construindo sua configuração separadamente ou não estiver executando seu driver DRA
como um pod do Kubernetes, certifique-se de que suas ferramentas de orquestração reiniciem o
driver DRA quando os healthchecks deste socket gRPC falharem. Fazer isso minimizará qualquer
tempo de inatividade acidental do driver DRA e lhe dará mais oportunidades de
autorrecuperação (self heal), reduzindo atrasos de agendamento ou tempo de solução de problemas.

### Ao drenar um nó, drene o driver DRA o mais tarde possível

O driver DRA é responsável por desmarcar (unprepare) quaisquer dispositivos que foram alocados para
Pods e, se o driver DRA for {{< glossary_tooltip text="drenado"
term_id="drain" >}} antes de os Pods com claims terem sido excluídos, ele não será
capaz de finalizar sua limpeza. Se você implementar lógica de drenagem personalizada para os nós,
considere verificar se não há ResourceClaim ou
ResourceClaimTemplates alocados/reservados antes de encerrar o próprio driver DRA.


## Monitore e ajuste os componentes para cargas mais altas, especialmente em ambientes de alta escala

O componente do control plane {{< glossary_tooltip text="kube-scheduler"
term_id="kube-scheduler" >}} e o controlador interno de ResourceClaim
orquestrado pelo componente {{< glossary_tooltip
text="kube-controller-manager" term_id="kube-controller-manager" >}} fazem o
trabalho pesado durante o agendamento de Pods com claims com base nos metadados armazenados nas
APIs DRA. Comparados aos Pods agendados sem DRA, o número de chamadas ao servidor de API, a
memória e a utilização de CPU necessárias por esses componentes aumentam para
os Pods que usam claims DRA. Além disso, componentes locais do nó, como o driver DRA
e o kubelet, utilizam as APIs DRA para alocar a solicitação de hardware no momento da criação do sandbox do
Pod. Especialmente em ambientes de alta escala, onde os clusters têm muitos
nós e/ou implantam muitas cargas de trabalho que utilizam intensamente claims de recursos definidos pelo DRA,
o administrador do cluster deve configurar os componentes relevantes para
antecipar a carga aumentada.

Os efeitos de componentes mal ajustados podem ter impactos diretos ou acumulativos (efeito bola de neve),
causando sintomas diferentes durante o ciclo de vida do Pod. Se as configurações de QPS e burst do
componente `kube-scheduler` forem muito baixas, o agendador pode
identificar rapidamente um nó adequado para um Pod, mas levar mais tempo para vincular o Pod
a esse nó. Com o DRA, durante o agendamento do Pod, os parâmetros QPS e Burst na
configuração do client-go dentro do `kube-controller-manager` são críticos.

Os valores específicos para ajustar seu cluster dependem de uma variedade de fatores, como
número de nós/pods, taxa de criação de pods, churn, mesmo em ambientes não DRA;
consulte o [README do SIG Scalability sobre limites de
escalabilidade do Kubernetes](https://github.com/kubernetes/community/blob/main/sig-scalability/configs-and-limits/thresholds.md)
para obter mais informações. Em testes de escala realizados contra um cluster com DRA habilitado
de 100 nós, envolvendo 720 pods de longa duração (90% de saturação) e 80 pods de churn
(10% de churn, 10 vezes), com um QPS de criação de jobs de 10, o QPS do `kube-controller-manager`
podia ser definido tão baixo quanto 75 e o Burst em 150 para atingir metas de métricas
equivalentes às implantações não DRA. Nesse limite inferior, observou-se que o
limitador de taxa do lado do cliente foi acionado o suficiente para proteger o servidor de API de
explosões repentinas, mas alto o suficiente para que os SLOs de inicialização de pods não fossem impactados.
Embora este seja um bom ponto de partida, você pode ter uma ideia melhor de como ajustar
os diferentes componentes que têm o maior efeito no desempenho do DRA para
sua implantação monitorando as métricas a seguir. Para obter mais informações sobre todas
as métricas estáveis do Kubernetes, consulte a [Referência de Métricas
do Kubernetes](/docs/reference/instrumentation/metrics/).

### Métricas do `kube-controller-manager`

As métricas a seguir observam de perto o controlador interno de ResourceClaim
gerenciado pelo componente `kube-controller-manager`.

* Taxa de adições na Workqueue: Monitore {{< highlight promql "hl_inline=true"  >}} sum(rate(workqueue_adds_total{name="resource_claim"}[5m])) {{< /highlight >}} para avaliar a rapidez com que os itens são adicionados ao controlador ResourceClaim.
* Profundidade da Workqueue: Acompanhe
  {{< highlight promql "hl_inline=true" >}}sum(workqueue_depth{endpoint="kube-controller-manager",
  name="resource_claim"}){{< /highlight >}} para identificar quaisquer acúmulos (backlogs) no controlador ResourceClaim.
* Duração do trabalho na Workqueue: Observe {{< highlight promql "hl_inline=true">}}histogram_quantile(0.99,
  sum(rate(workqueue_work_duration_seconds_bucket{name="resource_claim"}[5m]))
  by (le)){{< /highlight >}} para entender a velocidade com que o controlador ResourceClaim
  processa o trabalho.

Se você estiver enfrentando uma Taxa de Adições baixa, uma Profundidade alta e/ou
uma Duração de Trabalho alta na Workqueue, isso sugere que o controlador não está apresentando
desempenho ideal. Considere ajustar parâmetros como QPS, burst e configurações de
CPU/memória.

Se você estiver enfrentando uma Taxa de Adições alta, Profundidade alta, mas uma Duração de
Trabalho razoável, isso indica que o controlador está processando o trabalho, mas a concorrência pode ser
insuficiente. A concorrência é fixada no código (hardcoded) do controlador, portanto, como administrador do cluster, você pode
ajustar isso reduzindo o QPS de criação de pods, para que a taxa de adições à workqueue
do resource claim fique mais gerenciável.

### Métricas do `kube-scheduler`

As métricas do agendador a seguir são métricas de alto nível que agregam o desempenho
de todos os Pods agendados, não apenas daqueles que usam DRA. É importante notar
que as métricas de ponta a ponta são, em última análise, influenciadas pelo
desempenho do `kube-controller-manager` na criação de ResourceClaims a partir de
ResourceClainTemplates em implantações que usam intensamente ResourceClainTemplates.

* Duração de ponta a ponta do agendador: Monitore {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(increase(scheduler_pod_scheduling_sli_duration_seconds_bucket[5m])) by
  (le)){{< /highlight >}}.
* Latência do algoritmo do agendador: Acompanhe {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(increase(scheduler_scheduling_algorithm_duration_seconds_bucket[5m])) by
  (le)){{< /highlight >}}.

### Métricas do `kubelet`

Quando um Pod vinculado a um nó precisa ter um ResourceClaim satisfeito, o kubelet chama
os métodos `NodePrepareResources` e `NodeUnprepareResources` do driver DRA. Você pode
observar esse comportamento do ponto de vista do kubelet com as
métricas a seguir.

* Kubelet NodePrepareResources: Monitore {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_operations_duration_seconds_bucket{operation_name="PrepareResources"}[5m]))
  by (le)){{< /highlight >}}.
* Kubelet NodeUnprepareResources: Acompanhe {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_operations_duration_seconds_bucket{operation_name="UnprepareResources"}[5m]))
  by (le)){{< /highlight >}}.

### Operações do kubeletplugin do DRA

Os drivers DRA implementam a [interface do pacote
`kubeletplugin`](https://pkg.go.dev/k8s.io/dynamic-resource-allocation/kubeletplugin)
que expõe sua própria métrica para as operações gRPC subjacentes
`NodePrepareResources` e `NodeUnprepareResources`. Você pode observar este
comportamento do ponto de vista do kubeletplugin interno com as seguintes
métricas.

* Operação gRPC NodePrepareResources do kubeletplugin do DRA: Observe {{< highlight promql "hl_inline=true" >}}histogram_quantile(0.99,
  sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodePrepareResources"}[5m]))
  by (le)){{< /highlight >}}.
* Operação gRPC NodeUnprepareResources do kubeletplugin do DRA: Observe {{< highlight promql "hl_inline=true" >}} histogram_quantile(0.99,
  sum(rate(dra_grpc_operations_duration_seconds_bucket{method_name=~".*NodeUnprepareResources"}[5m]))
  by (le)){{< /highlight >}}.


## {{% heading "whatsnext" %}}

* [Saiba mais sobre
  o DRA](/docs/concepts/resource-management/dynamic-resource-allocation/)
* Leia a [Referência de Métricas
  do Kubernetes](/docs/reference/instrumentation/metrics/)
