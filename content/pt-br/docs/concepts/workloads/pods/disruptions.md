---
title: Interrupções
content_type: concept
weight: 70
---

<!-- overview -->
Este guia é destinado a proprietários de aplicações que desejam construir
aplicações altamente disponíveis e, portanto, precisam entender
quais tipos de interrupções podem acontecer com os Pods.

Também é destinado a administradores de cluster que desejam executar ações
automatizadas no cluster, como atualização e escalonamento automático de clusters.

<!-- body -->

## Interrupções voluntárias e involuntárias

Os Pods não desaparecem até que alguém (uma pessoa ou um controlador) os destrua, ou
ocorra um erro inevitável de hardware ou software do sistema.

Chamamos esses casos inevitáveis de *interrupções involuntárias* para
uma aplicação. Exemplos incluem:

- uma falha de hardware da máquina física que sustenta o nó.
- administrador do cluster exclui a VM (instância) por engano.
- falha do provedor de nuvem ou do hipervisor faz a VM desaparecer.
- um kernel panic.
- o nó desaparece do cluster devido a uma partição de rede do cluster.
- remoção de um Pod devido ao nó estar [sem recursos](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

Exceto pela condição de falta de recursos, todas essas condições
devem ser familiares para a maioria dos usuários; elas não são específicas
do Kubernetes.

Chamamos os outros casos de *interrupções voluntárias*. Estas incluem tanto
ações iniciadas pelo proprietário da aplicação quanto aquelas iniciadas por um
Administrador de Cluster. Ações típicas do proprietário da aplicação incluem:

- excluir o deployment ou outro controlador que gerencia o Pod.
- atualizar o template do Pod de um deployment causando uma reinicialização.
- excluir diretamente um Pod (por exemplo, por acidente).

As ações do administrador de cluster incluem:

- [Drenar um nó](/docs/tasks/administer-cluster/safely-drain-node/) para reparo ou atualização.
- Drenar um nó de um cluster para reduzir o cluster (saiba mais sobre
[Escalonamento Automático de Nós](/docs/concepts/cluster-administration/node-autoscaling/)).
- Remover um Pod de um nó para permitir que algo mais caiba naquele nó.

Essas ações podem ser executadas diretamente pelo administrador do cluster, ou por automação
executada pelo administrador do cluster, ou pelo seu provedor de hospedagem do cluster.

Consulte seu administrador de cluster ou consulte a documentação do seu provedor de nuvem ou distribuição
para determinar se alguma fonte de interrupções voluntárias está habilitada para o seu cluster.
Se nenhuma estiver habilitada, você pode pular a criação de Orçamentos de Interrupção de Pods.

{{< caution >}}
Nem todas as interrupções voluntárias são restringidas por Orçamentos de Interrupção de Pods. Por exemplo,
excluir deployments ou Pods ignora os Orçamentos de Interrupção de Pods.
{{< /caution >}}

## Lidando com interrupções

Aqui estão algumas maneiras de mitigar interrupções involuntárias:

- Certifique-se de que seu Pod [solicita os recursos](/docs/tasks/configure-pod-container/assign-memory-resource) de que necessita.
- Replique sua aplicação se precisar de maior disponibilidade. (Saiba mais sobre executar aplicações replicadas
  [sem estado](/docs/tasks/run-application/run-stateless-application-deployment/)
  e [com estado](/docs/tasks/run-application/run-replicated-stateful-application/)).
- Para uma disponibilidade ainda maior ao executar aplicações replicadas,
  distribua as aplicações entre racks (usando
  [antiafinidade](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity))
  ou entre zonas (se estiver usando um
  [cluster multizona](/docs/setup/multiple-zones)).

A frequência de interrupções voluntárias varia. Em um cluster Kubernetes básico, não há
interrupções voluntárias automatizadas (apenas aquelas acionadas pelo usuário). No entanto, seu administrador de cluster ou provedor de hospedagem
pode executar alguns serviços adicionais que causam interrupções voluntárias. Por exemplo,
atualizar o software do nó pode causar interrupções voluntárias. Além disso, algumas implementações
de escalonamento automático de cluster (nó) podem causar interrupções voluntárias para desfragmentar e compactar nós.
Seu administrador de cluster ou provedor de hospedagem deve ter documentado qual nível de interrupções
voluntárias, se houver, esperar. Certas opções de configuração, como
[usar PriorityClasses](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
na especificação do seu Pod também podem causar interrupções voluntárias (e involuntárias).

## Orçamentos de Interrupção de Pods

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

O Kubernetes oferece funcionalidades para ajudá-lo a executar aplicações altamente disponíveis mesmo quando você
introduz interrupções voluntárias frequentes.

Como proprietário de uma aplicação, você pode criar um PodDisruptionBudget (PDB) para cada aplicação.
Um PDB limita o número de Pods de uma aplicação replicada que estão inativos simultaneamente devido a
interrupções voluntárias. Por exemplo, uma aplicação baseada em quórum gostaria
de garantir que o número de réplicas em execução nunca seja reduzido abaixo do
número necessário para um quórum. Um front-end web pode querer
garantir que o número de réplicas atendendo a carga nunca caia abaixo de uma certa
porcentagem do total.

Administradores de cluster e provedores de hospedagem devem usar ferramentas que
respeitem PodDisruptionBudgets através do uso da [API de Remoção](/docs/tasks/administer-cluster/safely-drain-node/#eviction-api)
em vez de excluir diretamente Pods ou Deployments.

Por exemplo, o subcomando `kubectl drain` permite marcar um nó como sendo retirado de
serviço. Quando você executa `kubectl drain`, a ferramenta tenta remover todos os Pods do
nó que você está retirando de serviço. A solicitação de remoção que o `kubectl` envia em
seu nome pode ser temporariamente rejeitada, então a ferramenta repete periodicamente todas as solicitações
com falha até que todos os Pods no nó de destino sejam encerrados, ou até que um tempo limite
configurável seja atingido.

Um PDB especifica o número de réplicas que uma aplicação pode tolerar ter, em relação a quantas
ela pretende ter. Por exemplo, um Deployment que tem `.spec.replicas: 5` deve
ter 5 Pods a qualquer momento. Se seu PDB permite que existam 4 por vez,
então a API de Remoção permitirá a interrupção voluntária de um (mas não dois) Pods por vez.

O grupo de Pods que compõem a aplicação é especificado usando um seletor de rótulos, o mesmo
usado pelo controlador da aplicação (deployment, stateful-set, etc.).

O número "pretendido" de Pods é calculado a partir do `.spec.replicas` do recurso de carga de trabalho
que está gerenciando esses Pods. A camada de gerenciamento descobre o recurso de carga de trabalho proprietário
examinando o `.metadata.ownerReferences` do Pod.

[Interrupções involuntárias](#interrupções-voluntárias-e-involuntárias) não podem ser evitadas por PDBs; no entanto, elas
contam contra o orçamento.

Pods que são excluídos ou indisponíveis devido a uma atualização gradual de uma aplicação contam
contra o orçamento de interrupção, mas recursos de carga de trabalho (como Deployment e StatefulSet)
não são limitados por PDBs ao realizar atualizações graduais. Em vez disso, o tratamento de falhas
durante atualizações de aplicações é configurado na especificação do recurso de carga de trabalho específico.

É recomendado definir `AlwaysAllow` como [Política de Remoção de Pods Não Íntegros](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
em seus PodDisruptionBudgets para suportar a remoção de aplicações com comportamento inadequado durante a drenagem de um nó.
O comportamento padrão é aguardar que os Pods da aplicação se tornem [íntegros](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)
antes que a drenagem possa prosseguir.

Quando um Pod é removido usando a API de remoção, ele é controladamente
[encerrado](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination), respeitando a
configuração `terminationGracePeriodSeconds` em sua [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core).

## Exemplo de PodDisruptionBudget {#pdb-example}

Considere um cluster com 3 nós, `node-1` a `node-3`.
O cluster está executando várias aplicações. Uma delas tem 3 réplicas inicialmente chamadas
`pod-a`, `pod-b` e `pod-c`. Outro Pod não relacionado, sem um PDB, chamado `pod-x`, também é mostrado.
Inicialmente, os Pods estão distribuídos da seguinte forma:

|       node-1         |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *available*   | pod-b *available*   | pod-c *available*  |
| pod-x  *available*   |                     |                    |

Todos os 3 Pods fazem parte de um Deployment, e coletivamente têm um PDB que exige
que pelo menos 2 dos 3 Pods estejam disponíveis o tempo todo.

Por exemplo, suponha que o administrador do cluster queira reiniciar em uma nova versão do kernel para corrigir um bug no kernel.
O administrador do cluster primeiro tenta drenar `node-1` usando o comando `kubectl drain`.
Essa ferramenta tenta remover `pod-a` e `pod-x`. Isso é bem-sucedido imediatamente.
Ambos os Pods entram no estado `terminating` ao mesmo tempo.
Isso coloca o cluster neste estado:

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* |                     |                    |

O Deployment percebe que um dos Pods está sendo encerrado, então cria uma substituição
chamada `pod-d`. Como `node-1` está isolado, ele é alocado em outro nó. Algo também
criou `pod-y` como substituição para `pod-x`.

(Nota: para um StatefulSet, `pod-a`, que seria chamado de algo como `pod-0`, precisaria
ser totalmente encerrado antes que sua substituição, que também é chamada de `pod-0` mas tem um
UID diferente, pudesse ser criada. Caso contrário, o exemplo também se aplica a um StatefulSet.)

Agora o cluster está neste estado:

|   node-1 *draining*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
| pod-a  *terminating* | pod-b *available*   | pod-c *available*  |
| pod-x  *terminating* | pod-d *starting*    | pod-y              |

Em algum momento, os Pods são encerrados, e o cluster fica assim:

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *starting*    | pod-y              |

Neste ponto, se um administrador de cluster impaciente tentar drenar `node-2` ou
`node-3`, o comando drain será bloqueado, porque há apenas 2 Pods disponíveis
para o Deployment, e seu PDB exige pelo menos 2. Depois de algum tempo, `pod-d` se torna disponível.

O estado do cluster agora fica assim:

|    node-1 *drained*  |       node-2        |       node-3       |
|:--------------------:|:-------------------:|:------------------:|
|                      | pod-b *available*   | pod-c *available*  |
|                      | pod-d *available*   | pod-y              |

Agora, o administrador do cluster tenta drenar `node-2`.
O comando drain tentará remover os dois Pods em alguma ordem, digamos
`pod-b` primeiro e depois `pod-d`. Ele terá sucesso ao remover `pod-b`.
Mas, quando tentar remover `pod-d`, será recusado porque isso deixaria apenas
um Pod disponível para o Deployment.

O Deployment cria uma substituição para `pod-b` chamada `pod-e`.
Como não há recursos suficientes no cluster para alocar
`pod-e`, a drenagem será bloqueada novamente. O cluster pode acabar neste
estado:

|    node-1 *drained*  |       node-2        |       node-3       | *no node*          |
|:--------------------:|:-------------------:|:------------------:|:------------------:|
|                      | pod-b *terminating* | pod-c *available*  | pod-e *pending*    |
|                      | pod-d *available*   | pod-y              |                    |

Neste ponto, o administrador do cluster precisa
adicionar um nó de volta ao cluster para prosseguir com a atualização.

Você pode ver como o Kubernetes varia a taxa na qual as interrupções
podem acontecer, de acordo com:

- quantas réplicas uma aplicação precisa
- quanto tempo leva para encerrar controladamente uma instância
- quanto tempo leva para uma nova instância iniciar
- o tipo de controlador
- a capacidade de recursos do cluster

## Condições de interrupção de Pods {#pod-disruption-conditions}

{{< feature-state feature_gate_name="PodDisruptionConditions" >}}

Uma condição dedicada `DisruptionTarget` do Pod [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)
é adicionada para indicar
que o Pod está prestes a ser excluído devido a uma {{<glossary_tooltip term_id="disruption" text="interrupção">}}.
O campo `reason` da condição adicionalmente
indica um dos seguintes motivos para o encerramento do Pod:

`PreemptionByScheduler`
: O Pod deve sofrer {{<glossary_tooltip term_id="preemption" text="preempção">}} por um escalonador para acomodar um novo Pod com uma prioridade mais alta. Para mais informações, consulte [Preempção por prioridade de Pod](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

`DeletionByTaintManager`
: O Pod deve ser excluído pelo Taint Manager (que faz parte do controlador de ciclo de vida do nó dentro do `kube-controller-manager`) devido a um taint `NoExecute` que o Pod não tolera; veja remoções baseadas em {{<glossary_tooltip term_id="taint" text="taint">}}.

`EvictionByEvictionAPI`
: O Pod foi marcado para {{<glossary_tooltip term_id="api-eviction" text="remoção usando a API do Kubernetes">}}.

`DeletionByPodGC`
: O Pod, que está vinculado a um nó que não existe mais, deve ser excluído pela [coleta de lixo de Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection).

`TerminationByKubelet`
: O Pod foi encerrado pelo kubelet, devido a {{<glossary_tooltip term_id="node-pressure-eviction" text="remoção por pressão no nó">}},
  o [desligamento controlado do nó](/docs/concepts/architecture/nodes/#graceful-node-shutdown),
  ou substituição para [Pods críticos do sistema](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).

Em todos os outros cenários de interrupção, como remoção devido a exceder
[limites de contêiner do Pod](/docs/concepts/configuration/manage-resources-containers/),
os Pods não recebem a condição `DisruptionTarget` porque as interrupções provavelmente foram
causadas pelo Pod e ocorreriam novamente em uma nova tentativa.

{{< note >}}
Uma interrupção de Pod pode ser interrompida. A camada de gerenciamento pode tentar novamente
continuar a interrupção do mesmo Pod, mas isso não é garantido. Como resultado,
a condição `DisruptionTarget` pode ser adicionada a um Pod, mas esse Pod pode então não ser
efetivamente excluído. Em tal situação, após algum tempo, a
condição de interrupção do Pod será limpa.
{{< /note >}}

Juntamente com a limpeza dos Pods, o coletor de lixo de Pods (PodGC) também os marcará como falhados se estiverem em uma fase
não terminal (veja também [coleta de lixo de Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)).

Ao usar uma tarefa (ou CronJob), você pode querer usar essas condições de interrupção de Pod como parte da
[política de falha de Pod](/docs/concepts/workloads/controllers/job#pod-failure-policy) da sua tarefa.

## Separando os Papéis de Proprietário do Cluster e Proprietário da Aplicação

Frequentemente, é útil pensar no Administrator do cluster
e no Proprietário da aplicação como papéis separados com conhecimento limitado
um do outro. Esta separação de responsabilidades
pode fazer sentido nestes cenários:

- quando há muitas equipes de aplicação compartilhando um cluster Kubernetes, e
  há uma especialização natural de papéis.
- quando ferramentas ou serviços de terceiros são usados para automatizar o gerenciamento do cluster.

Os Orçamentos de Interrupção de Pods apoiam esta separação de papéis fornecendo uma
interface entre os papéis.

Se você não tem essa separação de responsabilidades em sua organização,
você pode não precisar usar Orçamentos de Interrupção de Pods.

## Como Realizar Ações Disruptivas no seu Cluster

Se você é um Administrador de cluster e precisa realizar uma ação disruptiva em todos
os nós do seu cluster, como uma atualização de nó ou software do sistema, aqui estão algumas opções:

- Aceitar tempo de inatividade durante a atualização.
- Fazer failover para outro cluster de réplica completo.
   - Sem tempo de inatividade, mas pode ser custoso tanto pelos nós duplicados
     quanto pelo esforço humano para orquestrar a troca.
- Escrever aplicações tolerantes a interrupções e usar PDBs.
   - Sem tempo de inatividade.
   - Duplicação mínima de recursos.
   - Permite mais automação da administração do cluster.
   - Escrever aplicações tolerantes a interrupções é complicado, mas o trabalho para tolerar
     interrupções voluntárias se sobrepõe em grande parte ao trabalho de suportar escalonamento automático e tolerar
     interrupções involuntárias.

## {{% heading "whatsnext" %}}

* Siga os passos para proteger sua aplicação [configurando um Orçamento de Interrupção de Pods](/docs/tasks/run-application/configure-pdb/).

* Saiba mais sobre [drenar nós](/docs/tasks/administer-cluster/safely-drain-node/)

* Saiba mais sobre [atualizar um Deployment](/docs/concepts/workloads/controllers/deployment/#updating-a-deployment)
  incluindo passos para manter sua disponibilidade durante a implementação.

