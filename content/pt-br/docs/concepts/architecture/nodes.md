---
title: Nós
content_type: conceito
weight: 10
---

<!-- overview -->

O Kubernetes executa sua carga de trabalho colocando contêineres em Pods para serem executados em _Nós_. Um nó pode ser uma máquina virtual ou física, dependendo do cluster. Cada nó é gerenciado pela {{< glossary_tooltip text="camada de gerenciamento" term_id="control-plane" >}} e contém os serviços necessários para executar {{< glossary_tooltip text="Pods" term_id="pod" >}}.

Normalmente, você tem vários nós em um cluster; em um ambiente de aprendizado ou limitado por recursos, você pode ter apenas um nó.

Os [componentes](/docs/concepts/overview/components/#node-components) em um nó incluem o {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, um {{< glossary_tooltip text="agente de execução de contêiner" term_id="container-runtime" >}}, e o {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}.

<!-- body -->

## Administração

Existem duas maneiras principais de adicionar Nós ao {{< glossary_tooltip text="Servidor da API" term_id="kube-apiserver" >}}:

1. O kubelet em um nó se registra automaticamente na camada de gerenciamento
2. Você (ou outro usuário humano) adiciona manualmente um objeto Nó

Depois de criar um {{< glossary_tooltip text="objeto" term_id="object" >}} Nó, ou o kubelet em um nó se registra automaticamente, a camada de gerenciamento verifica se o novo objeto Nó é válido. Por exemplo, se você tentar criar um nó a partir do seguinte manifesto JSON:

```json
{
  "kind": "Node",
  "apiVersion": "v1",
  "metadata": {
    "name": "10.240.79.157",
    "labels": {
      "name": "my-first-k8s-node"
    }
  }
}
```

O Kubernetes cria um objeto nó internamente (a representação). O Kubernetes verifica se um kubelet se registrou no servidor da API que corresponde ao campo `metadata.name` do Nó. Se o nó estiver íntegro (ou seja, todos os serviços necessários estiverem em execução), ele será elegível para executar um Pod. Caso contrário, esse nó é ignorado para qualquer atividade de cluster até que se torne íntegro.

{{< note >}}
O Kubernetes mantém o objeto nó inválido e continua verificando se ele se torna íntegro.

Você, ou um {{< glossary_tooltip term_id="controller" text="controlador">}}, deve excluir explicitamente o objeto Nó para interromper essa verificação de integridade.
{{< /note >}}

O nome de um objeto nó deve ser um nome de [subdomínio válido de DNS](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

### Singularidade de nome do nó

O [nome](/docs/concepts/overview/working-with-objects/names#names) identifica um nó. Dois nós não podem ter o mesmo nome ao mesmo tempo. O Kubernetes também assume que um recurso com o mesmo nome é o mesmo objeto. No caso de um nó, assume-se implicitamente que uma instância usando o mesmo nome terá o mesmo estado (por exemplo, configurações de rede, conteúdo do disco raiz) e atributos como label de nó. Isso pode levar a inconsistências se uma instância for modificada sem alterar seu nome. Se o nó precisar ser substituído ou atualizado significativamente, o objeto Nó existente precisa ser removido do servidor da API primeiro e adicionado novamente após a atualização.

### Auto-registro de Nós

Quando a opção `--register-node` do kubelet for verdadeira (padrão), o kubelet tentará se registrar no servidor da API. Este é o padrão preferido, usado pela maioria das distribuições.

Para auto-registro, o kubelet é iniciado com as seguintes opções:

- `--kubeconfig` - O caminho das credenciais para se autenticar no servidor da API.
- `--cloud-provider` - Como comunicar com um {{< glossary_tooltip text="provedor de nuvem" term_id="cloud-provider" >}}
 para ler metadados sobre si mesmo.
- `--register-node` - Registrar automaticamente no servidor da API.
- `--register-with-taints` - Registra o nó com a lista fornecida de {{< glossary_tooltip text="taints" term_id="taint" >}} (separadas por vírgula `<key>=<value>:<effect>`).

Não funciona se o `register-node` for falso.

- `--node-ip` - endereço IP do nó.
- `--node-labels` - {{< glossary_tooltip text="Labels" term_id="label" >}} a serem adicionados ao registrar o nó
 no cluster (consulte as restrições de label impostas pelo [plug-in de admissão NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)).
- `--node-status-update-frequency` - Especifica com que frequência o kubelet publica o status do nó no servidor da API.

Quando o [modo de autorização do nó](/docs/reference/access-authn-authz/node/) e o [plug-in de admissão NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction) estão ativados, os kubelets somente estarão autorizados a criar/modificar seu próprio recurso do nó.


{{< note >}}
Como mencionado na seção de [singularidade do nome do nó](#singularidade-de-nome-do-no), quando a configuração do nó precisa ser atualizada, é uma boa prática registrar novamente o nó no servidor da API. Por exemplo, se o kubelet estiver sendo reiniciado com o novo conjunto de `--node-labels`, mas o mesmo nome de nó for usado, a alteração não entrará em vigor, pois os labels estão sendo definidos no registro do Nó.

Pods já agendados no Nó podem ter um comportamento anormal ou causar problemas se a configuração do Nó for alterada na reinicialização do kubelet. Por exemplo, o Pod já em execução pode estar marcado diferente dos labels atribuídos ao Nó, enquanto outros Pods, que são incompatíveis com esse Pod, serão agendados com base nesse novo label. O novo registro do nó garante que todos os Pods sejam drenados e devidamente reiniciados.
{{< /note >}}

### Administração manual de nós

Você pode criar e modificar objetos Nó usando o {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}.

Quando você quiser manualmente criar objetos Nó, defina a opção do kubelet `--register-node=false`.

Você pode modificar os objetos Nó, independentemente da configuração de `--register-node`. Por exemplo, você pode definir labels em um nó existente ou marcá-lo como não disponível.

Você pode usar labels nos Nós em conjunto com seletores de nós nos Pods para controlar a disponibilidade. Por exemplo, você pode restringir um Pod a ser elegível apenas para ser executado em um subconjunto dos nós disponíveis.

Marcar um nó como não disponível impede que o escalonador coloque novos pods nesse nó, mas não afeta os Pods existentes no nó. Isso é útil como uma etapa preparatória antes da reinicialização de um nó ou outra manutenção.

Para marcar um nó como não disponível, execute:

```shell
kubectl cordon $NODENAME
```

Consulte [Drenar um nó com segurança](/docs/tasks/administer-cluster/safely-drain-node/) para obter mais detalhes.

{{< note >}}
Os Pods que fazem parte de um {{< glossary_tooltip term_id="daemonset" >}} toleram ser executados em um nó não disponível. Os DaemonSets geralmente fornecem serviços locais de nós que devem ser executados em um Nó, mesmo que ele esteja sendo drenado de aplicativos de carga de trabalho.
{{< /note >}}

## Status do Nó

O status de um nó contém as seguintes informações:

* [Endereços](#addresses)
* [Condições](#condition)
* [Capacidade](#capacity)
* [Informação](#info)

Você pode usar o `kubectl` para visualizar o status de um nó e outros detalhes:

```shell
kubectl describe node <insira-nome-do-nó-aqui>
```

Cada seção da saída está descrita abaixo.

### Endereços

O uso desses campos pode mudar dependendo do seu provedor de nuvem ou configuração dedicada.

* HostName: O nome do host relatado pelo `kernel` do nó. Pode ser substituído através do parâmetro kubelet `--hostname-override`.
* ExternalIP: Geralmente, o endereço IP do nó que é roteável externamente (disponível fora do `cluster`).
* InternalIP: Geralmente, o endereço IP do nó que é roteável somente dentro do `cluster`.

### Condições {#conditions}

O campo `conditions` descreve o status de todos os nós em execução. Exemplos de condições incluem:

{{< table caption = "Condições do nó e uma descrição de quando cada condição se aplica." >}}
| Condições do nó      | Descrição |
|----------------------|-------------|
| `Ready`              | `True` Se o nó estiver íntegro e pronto para aceitar pods, `False` se o nó não estiver íntegro e não estiver aceitando pods, e desconhecido `Unknown` se o controlador do nó tiver sem notícias do nó no último `node-monitor-grace-period` (o padrão é de 40 segundos) |
| `DiskPressure`       | `True` Se houver pressão sobre o tamanho do disco, ou seja, se a capacidade do disco for baixa; caso contrário `False` |
| `MemoryPressure`     | `True` Se houver pressão na memória do nó, ou seja, se a memória do nó estiver baixa; caso contrário `False` |
| `PIDPressure`        | `True` Se houver pressão sobre os processos, ou seja, se houver muitos processos no nó; caso contrário `False` |
| `NetworkUnavailable` | `True` Se a rede do nó não estiver configurada corretamente, caso contrário `False` |
{{< /table >}}

{{< note >}}
Se você usar as ferramentas de linha de comando para mostrar os detalhes de um nó isolado, a `Condition` inclui `SchedulingDisabled`. `SchedulingDisabled` não é uma condição na API do Kubernetes; em vez disso, os nós isolados são marcados como `Unschedulable` em suas especificações.
{{< /note >}}

Na API do Kubernetes, a condição de um nó é representada como parte do `.status` do recurso do nó. Por exemplo, a seguinte estrutura JSON descreve um nó íntegro:

```json
"conditions": [
  {
    "type": "Ready",
    "status": "True",
    "reason": "KubeletReady",
    "message": "kubelet is posting ready status",
    "lastHeartbeatTime": "2019-06-05T18:38:35Z",
    "lastTransitionTime": "2019-06-05T11:41:27Z"
  }
]
```

Se o status da condição `Ready` permanecer desconhecido (`Unknown`) ou falso (`False`) por mais tempo do que o limite da remoção do pod (`pod-eviction-timeout`) (um argumento passado para o {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager">}}), o [controlador de nó](#node-controller) acionará o {{< glossary_tooltip text="remoção iniciado pela API" term_id="api-eviction" >}} para todos os Pods atribuídos a esse nó. A duração padrão do tempo limite da remoção é de **cinco minutos**. Em alguns casos, quando o nó está inacessível, o servidor da API não consegue se comunicar com o kubelet no nó. A decisão de excluir os pods não pode ser comunicada ao kubelet até que a comunicação com o servidor da API seja restabelecida. Enquanto isso, os pods agendados para exclusão podem continuar a ser executados no nó particionado.

O controlador de nós não força a exclusão dos pods até que seja confirmado que eles pararam de ser executados no cluster. Você pode ver os pods que podem estar sendo executados em um nó inacessível como estando no estado de terminando (`Terminating`) ou desconhecido (`Unknown`). Nos casos em que o Kubernetes não retirar da infraestrutura subjacente se um nó tiver deixado permanentemente um cluster, o administrador do cluster pode precisar excluir o objeto do nó manualmente. Excluir o objeto do nó do Kubernetes faz com que todos os objetos Pod em execução no nó sejam excluídos do servidor da API e libera seus nomes.

Quando ocorrem problemas nos nós, a camada de gerenciamento do Kubernetes cria automaticamente [`taints`](/docs/concepts/scheduling-eviction/taint-and-toleration/) que correspondem às condições que afetam o nó. O escalonador leva em consideração as `taints` do Nó ao atribuir um Pod a um Nó. Os Pods também podem ter {{< glossary_tooltip text="tolerations" term_id="toleration" >}} que os permitem funcionar em um nó, mesmo que tenha uma `taint` específica.

Consulte [Nó Taint por Condição](/pt-br/docs/concepts/scheduling-eviction/taint-and-toleration/#taints-por-condições-de-nó)
para mais detalhes.

### Capacidade e Alocável {#capacity}

Descreve os recursos disponíveis no nó: CPU, memória e o número máximo de pods que podem ser agendados no nó.

Os campos no bloco de capacidade indicam a quantidade total de recursos que um nó possui. O bloco alocado indica a quantidade de recursos em um nó que está disponível para ser consumido por Pods normais.

Você pode ler mais sobre capacidade e recursos alocados enquanto aprende a [reservar recursos de computação](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable) em um nó.

### Info

Descreve informações gerais sobre o nó, como a versão do kernel, a versão do Kubernetes (versão do kubelet e kube-proxy), detalhes do tempo de execução do contêiner e qual sistema operacional o nó usa. O kubelet coleta essas informações do nó e as publica na API do Kubernetes.

## Heartbeats

Os `Heartbeats`, enviados pelos nós do Kubernetes, ajudam seu cluster a determinar a disponibilidade de cada nó e a agir quando as falhas forem detectadas.

Para nós, existem duas formas de `heartbeats`:

* atualizações para o `.status` de um Nó
* Objetos [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) dentro do {{< glossary_tooltip term_id="namespace" text="namespace">}} `kube-node-lease`. Cada nó tem um objeto de `Lease` associado.

Em comparação com as atualizações no `.status` de um nó, um Lease é um recurso mais leve. O uso de Leases para `heartbeats` reduz o impacto no desempenho dessas atualizações para grandes clusters.

O kubelet é responsável por criar e atualizar o `.status` dos Nós e por atualizar suas Leases relacionadas.

- O kubelet atualiza o .status do nó quando há mudança de status ou se não houve atualização para um intervalo configurado. O intervalo padrão para atualizações .status para Nós é de 5 minutos, o que é muito maior do que o tempo limite padrão de 40 segundos para nós inacessíveis.
- O kubelet cria e atualiza seu objeto `Lease` a cada 10 segundos (o intervalo de atualização padrão). As atualizações de Lease ocorrem independentemente das atualizações no `.status` do Nó. Se a atualização do `Lease` falhar, o kubelet voltará a tentativas, usando um recuo exponencial que começa em 200 milissegundos e limitado a 7 segundos.

## Controlador de Nós

O {{< glossary_tooltip text="controlador" term_id="controller" >}} de nós é um componente da camada de gerenciamento do Kubernetes que gerencia vários aspectos dos nós.

O controlador de nó tem várias funções na vida útil de um nó. O primeiro é atribuir um bloco CIDR ao nó quando ele é registrado (se a atribuição CIDR estiver ativada).

O segundo é manter a lista interna de nós do controlador de nós atualizada com a lista de máquinas disponíveis do provedor de nuvem. Ao ser executado em um ambiente de nuvem e sempre que um nó não é íntegro, o controlador de nó pergunta ao provedor de nuvem se a VM desse nó ainda está disponível. Caso contrário, o controlador de nós exclui o nó de sua lista de nós.

O terceiro é monitorar a saúde dos nós. O controlador do nó é responsável por:

- No caso de um nó se tornar inacessível, atualizar a condição NodeReady dentro do campo `.status` do nó. Nesse caso, o controlador do nó define a condição de pronto (`NodeReady`) como condição desconhecida (`ConditionUnknown`).
- Se um nó permanecer inacessível: será iniciado a [remoção pela API](/docs/concepts/scheduling-eviction/api-eviction/) para todos os Pods no nó inacessível. Por padrão, o controlador do nó espera 5 minutos entre marcar o nó como condição desconhecida (`ConditionUnknown`) e enviar a primeira solicitação de remoção.

O controlador de nó verifica o estado de cada nó a cada `--node-monitor-period` segundos.

### Limites de taxa de remoção

Na maioria dos casos, o controlador de nós limita a taxa de remoção a `--node-eviction-rate` (0,1 por padrão) por segundo, o que significa que ele não removerá pods de mais de 1 nó por 10 segundos.

O comportamento de remoção do nó muda quando um nó em uma determinada zona de disponibilidade se torna não íntegro. O controlador de nós verifica qual porcentagem de nós na zona não são íntegras (a condição `NodeReady` é desconhecida `ConditionUnknown` ou falsa `ConditionFalse`) ao mesmo tempo:

- Se a fração de nós não íntegros for ao menos `--unhealthy-zone-threshold` (padrão 0,55), então a taxa de remoção será reduzida.
- Se o cluster for pequeno (ou seja, tiver número de nós menor ou igual ao valor da opção `--large-cluster-size-threshold` - padrão 50), então as remoções serão interrompidas.
- Caso contrário, a taxa de remoção é reduzida para `--secondary-node-eviction-rate` de nós secundários (padrão 0,01) por segundo.

A razão pela qual essas políticas são implementadas por zona de disponibilidade é porque a camada de gerenciamento pode perder conexão com uma zona de disponibilidade, enquanto as outras permanecem conectadas. Se o seu cluster não abranger várias zonas de disponibilidade de provedores de nuvem, o mecanismo de remoção não levará em conta a indisponibilidade por zona.

Uma das principais razões para espalhar seus nós pelas zonas de disponibilidade é para que a carga de trabalho possa ser transferida para zonas íntegras quando uma zona inteira cair. Portanto, se todos os nós em uma zona não estiverem íntegros, o controlador do nó removerá na taxa normal de `--node-eviction-rate`. O caso especial é quando todas as zonas estiverem completamente insalubres (nenhum dos nós do cluster será íntegro). Nesse caso, o controlador do nó assume que há algum problema com a conectividade entre a camada de gerenciamento e os nós e não realizará nenhuma remoção. (Se houver uma interrupção e alguns nós reaparecerem, o controlador do nó expulsará os pods dos nós restantes que estiverem insalubres ou inacessíveis).

O controlador de nós também é responsável por remover pods em execução nos nós com `NoExecute` taints, a menos que esses pods tolerem essa taint. O controlador de nó também adiciona as {{< glossary_tooltip text="taints" term_id="taint" >}} correspondentes aos problemas de nó, como nó inacessível ou não pronto. Isso significa que o escalonador não colocará Pods em nós não íntegros.

## Rastreamento de capacidade de recursos {#node-capacity}

Os objetos do nó rastreiam informações sobre a capacidade de recursos do nó: por exemplo, a quantidade de memória disponível e o número de CPUs. Os nós que se [auto-registram](#self-registration-of-nodes) relatam sua capacidade durante o registro. Se você adicionar [manualmente](#manual-node-administration) um nó, precisará definir as informações de capacidade do nó ao adicioná-lo.

O {{< glossary_tooltip text="escalonador" term_id="kube-scheduler" >}} do Kubernetes garante que haja recursos suficientes para todos os Pods em um nó. O escalonador verifica se a soma das solicitações de contêineres no nó não é maior do que a capacidade do nó. Essa soma de solicitações inclui todos os contêineres gerenciados pelo kubelet, mas exclui quaisquer contêineres iniciados diretamente pelo agente de execução de contêiner e também exclui quaisquer processos executados fora do controle do kubelet.

{{< note >}}
Se você quiser reservar explicitamente recursos para processos que não sejam do Pod, consulte [reserva de recursos para daemons do sistema](/docs/tasks/administer-cluster/reserve-compute-resources/#system-reserved).
{{< /note >}}

## Topologia do Nó

{{< feature-state state="alpha" for_k8s_version="v1.16" >}}

Se você ativou os [recursos]](/docs/reference/command-line-tools-reference/feature-gates/) de `TopologyManager`, o kubelet pode usar dicas da topologia ao tomar decisões de atribuição de recursos. Consulte [Controle das Políticas de Gerenciamento de Topologia em um Nó](/docs/tasks/administer-cluster/topology-manager/) para obter mais informações.

## Desligamento gracioso do nó {#graceful-node-shutdown}

{{< feature-state state="beta" for_k8s_version="v1.21" >}}

O kubelet tenta detectar o desligamento do sistema do nó e encerra os pods em execução no nó.

O Kubelet garante que os pods sigam o processo normal de [término do pod](/docs/concepts/workloads/pods/)pod-lifecycle/#pod-termination) durante o desligamento do nó.

O recurso de desligamento gradual do nó depende do systemd, pois aproveita os [bloqueios do inibidor do systemd](https://www.freedesktop.org/wiki/Software/systemd/inhibit/) para atrasar o desligamento do nó com uma determinada duração.

O desligamento gradual do nó é controlado com [recursos](/docs/reference/command-line-tools-reference/feature-gates/) `GracefulNodeShutdown`, que é ativado por padrão na versão 1.21.

Observe que, por padrão, ambas as opções de configuração descritas abaixo, `shutdownGracePeriod` and `shutdownGracePeriodCriticalPods` estão definidas como zero, não ativando assim a funcionalidade de desligamento gradual do nó. Para ativar o recurso, as duas configurações do kubelet devem ser configuradas adequadamente e definidas como valores diferentes de zero.

Durante um desligamento gradual, o kubelet encerra os pods em duas fases:

1. Encerra os pods regulares em execução no nó.
2. Encerra os [pods críticos](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) em execução no nó.

O recurso de desligamento gradual do nó é configurado com duas opções [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/):

* `shutdownGracePeriod`:
  * Especifica a duração total pela qual o nó deve atrasar o desligamento. Este é o período de carência total para o término dos pods regulares e os [críticos](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).

* `shutdownGracePeriodCriticalPods`:
  * Especifica a duração utlizada para encerrar [pods críticos](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) durante um desligamento de nó. Este valor deve ser menor que `shutdownGracePeriod`.

Por exemplo, se `shutdownGracePeriod=30s` e `shutdownGracePeriodCriticalPods=10s`, o kubelet atrasará o desligamento do nó em 30 segundos. Durante o desligamento, os primeiros 20 (30-10) segundos seriam reservados para encerrar gradualmente os pods normais, e os últimos 10 segundos seriam reservados para encerrar [pods críticos](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).

{{< note >}}
Quando os pods forem removidos durante o desligamento gradual do nó, eles serão marcados como desligados. Executar o `kubectl get pods` para mostrar o status dos pods removidos como `Terminated`. E o `kubectl describe pod` indica que o pod foi removido por causa do desligamento do nó:

```
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```
{{< /note >}}

### Desligamento gradual do nó baseado em prioridade do Pod {#pod-priority-graceful-node-shutdown}

{{< feature-state state="beta" for_k8s_version="v1.24" >}}

Para fornecer mais flexibilidade durante o desligamento gradual do nó em torno da ordem de pods durante o desligamento, o desligamento gradual do nó respeita a PriorityClass dos Pods, desde que você tenha ativado esse recurso em seu cluster. O recurso permite que o cluster defina explicitamente a ordem dos pods durante o desligamento gradual do nó com base em [classes de prioridade](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).

O recurso [Desligamento Gradual do Nó](#graceful-node-shutdown), conforme descrito acima, desliga pods em duas fases, pods não críticos, seguidos por pods críticos. Se for necessária flexibilidade adicional para definir explicitamente a ordem dos pods durante o desligamento de uma maneira mais granular, o desligamento gradual baseado na prioridade do pod pode ser usado.

Quando o desligamento gradual do nó respeita as prioridades do pod, isso torna possível fazer o desligamento gradual do nó em várias fases, cada fase encerrando uma classe de prioridade específica de pods. O kubelet pode ser configurado com as fases exatas e o tempo de desligamento por fase.

Assumindo as seguintes classes de prioridade de pod personalizadas em um cluster,

|Nome das classes de prioridade|Valor das classes de prioridade|
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |

Na [configuração do kubelet](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration), as configurações para `shutdownGracePeriodByPodPriority` são semelhantes a:

|Valor das classes de prioridade|Tempo de desligamento|
|------------------------|---------------|
| 100000                 |10 segundos     |
| 10000                  |180 segundos    |
| 1000                   |120 segundos    |
| 0                      |60 segundos     |

A configuração correspondente do YAML do kubelet seria:

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

A tabela acima implica que qualquer pod com valor `priority` >= 100000 terá apenas 10 segundos para parar qualquer pod com valor >= 10000 e < 100000 e terá 180 segundos para parar, qualquer pod com valor >= 1000 e < 10000 terá 120 segundos para parar. Finalmente, todos os outros pods terão 60 segundos para parar.

Não é preciso especificar valores correspondentes para todas as classes. Por exemplo, você pode usar estas configurações:


|Valor das classes de prioridade|Tempo de desligamento|
|------------------------|---------------|
| 100000                 |300 segundos    |
| 1000                   |120 segundos    |
| 0                      |60 segundos     |


No caso acima, os pods com `custom-class-b` irão para o mesmo bucket que `custom-class-c` para desligamento.

Se não houver pods em um intervalo específico, o kubelet não irá espera por pods nesse intervalo de prioridades. Em vez disso, o kubelet pula imediatamente para o próximo intervalo de valores da classe de prioridade.

Se esse recurso estiver ativado e nenhuma configuração for fornecida, nenhuma ação de pedido será tomada.

O uso desse recurso requer ativar  os recursos `GracefulNodeShutdownBasedOnPodPriority` e definir o `ShutdownGracePeriodByPodPriority` da configuração do kubelet para a configuração desejada, contendo os valores da classe de prioridade do pod e seus respectivos períodos de desligamento.

## Gerenciamento da memória swap {#swap-memory}

{{< feature-state state="alpha" for_k8s_version="v1.22" >}}

Antes do Kubernetes 1.22, os nós não suportavam o uso de memória swap, e um kubelet, por padrão, não iniciaria se a troca fosse detectada em um nó. A partir de 1.22, o suporte a memória swap pode ser ativado por nó.

Para ativar a troca em um nó, o recursos `NodeSwap` deve estar ativado no kubelet, e a [configuração](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration) de comando de linha `--fail-swap-on` ou `failSwapOn` deve ser definida como falsa.

{{< warning >}}
Quando o recurso de memória swap está ativado, os dados do Kubernetes, como o conteúdo de objetos `Secret` que foram gravados no `tmpfs`, agora podem ser trocados para o disco.
{{< /warning >}}

Opcionalmente, um usuário também pode configurar `memorySwap.swapBehavior` para especificar como um nó usará memória swap. Por exemplo,

```yaml
memorySwap:
  swapBehavior: LimitedSwap
```

As opções de configuração disponíveis para `swapBehavior` são:

- `LimitedSwap`: As cargas de trabalho do Kubernetes são limitadas na quantidade de troca que podem usar. Cargas de trabalho no nó não gerenciadas pelo Kubernetes ainda podem ser trocadas.
- `UnlimitedSwap`: As cargas de trabalho do Kubernetes podem usar tanta memória de swap quanto solicitarem, até o limite do sistema.

Se a configuração do `memorySwap` não for especificada e o recurso estiver ativado, por padrão, o kubelet aplicará o mesmo comportamento que a configuração `LimitedSwap`.

O comportamento da configuração `LimitedSwap` depende se o nó estiver sendo executado com v1 ou v2 de grupos de controle (também conhecidos como "cgroups"):

- **cgroupsv1**: As cargas de trabalho do Kubernetes podem usar qualquer combinação de memória e swap, até o limite de memória do pod, se definido.
- **cgroupsv2**: As cargas de trabalho do Kubernetes não podem usar memória swap.

Para obter mais informações e para ajudar nos testes e fornecer feedback, consulte [KEP-2400](https://github.com/kubernetes/enhancements/issues/2400) e sua [proposta de design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).

## {{% heading "whatsnext" %}}

* Saiba mais sobre [componentes](/docs/concepts/overview/components/#node-components) que compõem um nó.
* Leia a [definição da API para um Nó](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#node-v1-core).
* Leia a seção [Nó](https://git.k8s.io/community/contributors/design-proposals/architecture/architecture.md#the-kubernetes-node) do documento de design de arquitetura.
* Leia sobre [taints e tolerâncias](/docs/concepts/scheduling-eviction/taint-and-toleration/).
