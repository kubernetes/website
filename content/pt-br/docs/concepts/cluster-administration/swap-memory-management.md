---
title: Gerenciamento de memória swap
content_type: concept
weight: 10
---

<!-- overview -->

O Kubernetes pode ser configurado para usar memória swap em um {{< glossary_tooltip text="nó" term_id="node" >}},
permitindo que o kernel libere memória física trocando (swapping out) páginas para o armazenamento de apoio.
Isso é útil para múltiplos casos de uso.
Por exemplo, nós que executam cargas de trabalho que podem se beneficiar do uso de swap,
como aquelas que têm grandes volumes de memória, mas acessam apenas uma parte dessa memória em um dado momento.
Ele também ajuda a evitar que Pods sejam terminados durante picos de pressão de memória,
protege os nós contra picos de memória no nível do sistema que possam comprometer sua estabilidade,
permite um gerenciamento de memória mais flexível no nó, e muito mais.

Para saber como configurar swap no seu cluster, leia
[Configurando memória swap nos nós do Kubernetes](/docs/tutorials/cluster-management/provision-swap-memory/).

<!-- body -->

## Suporte do sistema operacional

* Nós Linux suportam swap; você precisa configurar cada nó para habilitá-lo.
  Por padrão, o kubelet **não** inicia em um nó Linux que tenha swap habilitado.
* Nós Windows exigem espaço de swap.
  Por padrão, o kubelet **não** inicia em um nó Windows que tenha swap desabilitado.

## Como funciona?

Há várias maneiras possíveis de se imaginar o uso de swap em um nó.
Se o kubelet já estiver em execução em um nó, será necessário reiniciá-lo após o swap ser provisionado para que ele o identifique.

Quando o kubelet inicia em um nó no qual o swap está provisionado e disponível
(com a configuração `failSwapOn: false`), o kubelet irá:
- Conseguir iniciar nesse nó com swap habilitado.
- Direcionar a implementação da Container Runtime Interface (CRI), frequentemente chamada de runtime de contêiner,
a alocar zero memória swap para as cargas de trabalho do Kubernetes por padrão.

A configuração de swap em um nó é exposta ao administrador do cluster por meio do
[`memorySwap` na KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1).
Como administrador de cluster, você pode especificar o comportamento do nó na
presença de memória swap definindo `memorySwap.swapBehavior`.

### Comportamentos de swap

Você precisa escolher um [comportamento de swap](/docs/reference/node/swap-behavior/) para
usar. Nós diferentes no seu cluster podem usar comportamentos de swap diferentes.

Os comportamentos de swap que você pode escolher para nós Linux são:

`NoSwap` (padrão)
: As cargas de trabalho em execução como Pods neste nó não usam e não podem usar swap.

`LimitedSwap`
: As cargas de trabalho do Kubernetes podem utilizar memória swap.

{{< note >}}
Se você escolher o comportamento NoSwap e configurar o kubelet para tolerar
espaço de swap (`failSwapOn: false`), então suas cargas de trabalho não usam nenhum swap.

No entanto, processos fora dos contêineres gerenciados pelo Kubernetes, como serviços do systemd
(e até o próprio kubelet!), **podem** utilizar swap.
{{< /note >}}

Você pode ler [configurando memória swap nos nós do Kubernetes](/docs/tutorials/cluster-management/provision-swap-memory/) para aprender sobre como habilitar o swap para o seu cluster.

### Integração com o runtime de contêiner

O kubelet usa a API do runtime de contêiner e direciona o runtime de contêiner a
aplicar uma configuração específica (por exemplo, no caso do cgroup v2, `memory.swap.max`) de uma forma que
habilite a configuração de swap desejada para um contêiner. Para runtimes que usam control groups, ou cgroups,
o runtime de contêiner é então responsável por gravar essas configurações no cgroup no nível do contêiner.

## Observabilidade do uso de swap

### Estatísticas de métricas no nível de nó e contêiner

O Kubelet agora coleta estatísticas de métricas no nível de nó e de contêiner,
que podem ser acessadas nos endpoints HTTP do kubelet `/metrics/resource` (usado principalmente por ferramentas de
monitoramento como o Prometheus) e `/stats/summary` (usado principalmente por Autoscalers).
Isso permite que clientes que podem solicitar diretamente ao kubelet
monitorem o uso de swap e a memória swap restante ao usar `LimitedSwap`.
Além disso, uma métrica `machine_swap_bytes` foi adicionada ao cadvisor para mostrar
a capacidade total de swap físico da máquina.
Consulte [esta página](/docs/reference/instrumentation/node-metrics/) para obter mais informações.

Por exemplo, estas métricas `/metrics/resource` são suportadas:
- `node_swap_usage_bytes`: Uso atual de swap do nó, em bytes.
- `container_swap_usage_bytes`: Quantidade atual de uso de swap do contêiner, em bytes.
- `container_swap_limit_bytes`: Quantidade atual do limite de swap do contêiner, em bytes.

### Usando `kubectl top --show-swap`

Consultar as métricas é valioso, mas um pouco complicado, pois essas métricas
são projetadas para serem usadas por software, e não por humanos.
Para consumir esses dados de uma forma mais amigável ao usuário,
o comando `kubectl top` foi estendido para suportar métricas de swap, usando a flag `--show-swap`.

Para receber informações sobre o uso de swap nos nós, pode-se usar `kubectl top nodes --show-swap`:
```shell
kubectl top nodes --show-swap
```

Isso resultará em uma saída semelhante a:
```
NAME    CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)   SWAP(bytes)    SWAP(%)       
node1   1m           10%      2Mi             10%         1Mi            0%   
node2   5m           10%      6Mi             10%         2Mi            0%   
node3   3m           10%      4Mi             10%         <unknown>      <unknown>   
```

Para receber informações sobre o uso de swap pelos pods, pode-se usar `kubectl top pods --show-swap`:
```shell
kubectl top pod -n kube-system --show-swap
```

Isso resultará em uma saída semelhante a:
```
NAME                                      CPU(cores)   MEMORY(bytes)   SWAP(bytes)
coredns-58d5bc5cdb-5nbk4                  2m           19Mi            0Mi
coredns-58d5bc5cdb-jsh26                  3m           37Mi            0Mi
etcd-node01                               51m          143Mi           5Mi
kube-apiserver-node01                     98m          824Mi           16Mi
kube-controller-manager-node01            20m          135Mi           9Mi
kube-proxy-ffgs2                          1m           24Mi            0Mi
kube-proxy-fhvwx                          1m           39Mi            0Mi
kube-scheduler-node01                     13m          69Mi            0Mi
metrics-server-8598789fdb-d2kcj           5m           26Mi            0Mi   
```

### Nós relatam a capacidade de swap como parte do status do nó

Um novo campo no status do nó foi adicionado, `node.status.nodeInfo.swap.capacity`, para relatar a capacidade de swap de um nó.

Como exemplo, o comando a seguir pode ser usado para recuperar a capacidade de swap dos nós em um cluster:
```shell
kubectl get nodes -o go-template='{{range .items}}{{.metadata.name}}: {{if .status.nodeInfo.swap.capacity}}{{.status.nodeInfo.swap.capacity}}{{else}}<unknown>{{end}}{{"\n"}}{{end}}'
```

Isso resultará em uma saída semelhante a:
```
node1: 21474836480
node2: 42949664768
node3: <unknown>
```

{{< note >}}

O valor `<unknown>` indica que o campo `.status.nodeInfo.swap.capacity` não está definido para aquele Node.
Isso provavelmente significa que o nó não tem swap provisionado, ou, menos provavelmente,
que o kubelet não é capaz de determinar a capacidade de swap do nó.

{{< /note >}}

### Descoberta de swap usando Node Feature Discovery (NFD) {#node-feature-discovery}

O [Node Feature Discovery](https://github.com/kubernetes-sigs/node-feature-discovery)
é um addon do Kubernetes para detectar recursos de hardware e configuração.
Ele pode ser utilizado para descobrir quais nós estão provisionados com swap.

Como exemplo, para descobrir quais nós estão provisionados com swap,
use o seguinte comando:
```shell
kubectl get nodes -o jsonpath='{range .items[?(@.metadata.labels.feature\.node\.kubernetes\.io/memory-swap)]}{.metadata.name}{"\t"}{.metadata.labels.feature\.node\.kubernetes\.io/memory-swap}{"\n"}{end}'
```

Isso resultará em uma saída semelhante a:
```
k8s-worker1: true
k8s-worker2: true
k8s-worker3: false
```

Neste exemplo, o swap está provisionado nos nós `k8s-worker1` e `k8s-worker2`, mas não no `k8s-worker3`.

## Riscos e ressalvas

{{< caution >}}

É altamente recomendável criptografar o espaço de swap.
Veja [volumes com suporte em memória](#memory-backed-volumes) para obter mais informações.

{{< /caution >}}

Ter swap disponível em um sistema reduz a previsibilidade.
Embora o swap possa melhorar o desempenho ao disponibilizar mais RAM, trazer os dados
de volta para a memória é uma operação pesada, às vezes mais lenta em muitas ordens de magnitude,
o que pode causar regressões de desempenho inesperadas.
Além disso, o swap muda o comportamento de um sistema sob pressão de memória.
Habilitar o swap aumenta o risco de vizinhos ruidosos (noisy neighbors),
onde Pods que usam sua RAM com frequência podem fazer com que outros Pods façam swap.
Além disso, como o swap permite maior uso de memória para cargas de trabalho no Kubernetes que não podem ser contabilizados de forma previsível,
e devido a configurações de empacotamento inesperadas,
o agendador atualmente não leva em conta o uso de memória swap.
Isso aumenta o risco de vizinhos ruidosos.

O desempenho de um nó com memória swap habilitada depende do armazenamento físico subjacente.
Quando a memória swap está em uso, o desempenho será significativamente pior em um ambiente com
restrição de operações de I/O por segundo (IOPS), como uma VM de nuvem com
limitação (throttling) de I/O, em comparação com mídias de armazenamento mais rápidas como unidades de estado sólido
ou NVMe.
Como o swap pode causar pressão de I/O, é recomendável dar prioridade de latência de I/O
mais alta aos daemons críticos do sistema. Consulte a seção relevante na
seção de [boas práticas](#good-practice-for-using-swap-in-a-kubernetes-cluster) abaixo.

### Volumes com suporte em memória {#memory-backed-volumes}

Em nós Linux, volumes com suporte em memória (memory-backed volumes), como montagens de volume
[`secret`](/pt-br/docs/concepts/configuration/secret/)
ou [`emptyDir`](/pt-br/docs/concepts/storage/volumes/#emptydir) com `medium: Memory`,
são implementados com um sistema de arquivos `tmpfs`.
O conteúdo desses volumes deve permanecer na memória em todos os momentos, portanto não deve
ser movido para o disco via swap.
Para garantir que o conteúdo desses volumes permaneça na memória, a opção `noswap` do tmpfs
está sendo usada.

O kernel Linux oficialmente suporta a opção `noswap` a partir da versão 6.3 (mais informações
podem ser encontradas em [Requisitos de versão do kernel Linux](/docs/reference/node/kernel-version-requirements/#requirements-other)).
No entanto, as diferentes distribuições frequentemente escolhem fazer backport dessa opção de montagem para versões mais antigas
do Linux também.

Para verificar se o nó suporta a opção `noswap`, o kubelet fará o seguinte:
* Se a versão do kernel for superior a 6.3, então a opção `noswap` será considerada suportada.
* Caso contrário, o kubelet tentará montar um tmpfs fictício com a opção `noswap` na inicialização.
  Se o kubelet falhar com um erro indicando uma opção desconhecida, a opção `noswap` será considerada
  não suportada e, portanto, não será usada.
  Uma entrada de log do kubelet será emitida para avisar o usuário de que os volumes com suporte em memória podem ir para o disco via swap.
  Se o kubelet for bem-sucedido, o tmpfs fictício será excluído e a opção `noswap` será usada.
  * Se a opção `noswap` não for suportada, o kubelet emitirá uma entrada de log de aviso
    e continuará sua execução.

Consulte a [seção acima](#setting-up-encrypted-swap) com um exemplo de configuração de swap não criptografado.
No entanto, lidar com swap criptografado não está no escopo do kubelet;
em vez disso, é uma preocupação geral de configuração do sistema operacional e deve ser tratada nesse nível.
É responsabilidade do administrador provisionar swap criptografado para mitigar esse risco.

### Evictions

Configurar limites de eviction (despejo) de memória para nós com swap habilitado pode ser complicado.

Com o swap desabilitado, é razoável configurar os limites de eviction do kubelet
para ficarem um pouco abaixo da capacidade de memória do nó.
A lógica é que queremos que o Kubernetes comece a despejar Pods antes que o nó fique sem memória
e invoque o Out Of Memory (OOM) killer, já que o OOM killer não tem consciência do Kubernetes,
portanto não considera coisas como QoS, prioridade de pod ou outros fatores específicos do Kubernetes.

Com o swap habilitado, a situação é mais complexa.
No Linux, o parâmetro `vm.min_free_kbytes` define o limite de memória para o kernel
começar a recuperar memória de forma agressiva, o que inclui trocar páginas para o swap.
Se os limites de eviction do kubelet forem definidos de modo que a eviction ocorra
antes de o kernel começar a recuperar memória, isso pode fazer com que as cargas de trabalho nunca
consigam mover dados para o swap durante a pressão de memória do nó.
No entanto, definir os limites de eviction muito altos pode resultar no esgotamento da memória do nó
e na invocação do OOM killer, o que também não é ideal.

Para lidar com isso, é recomendável definir os limites de eviction do kubelet
para ficarem ligeiramente abaixo do valor de `vm.min_free_kbytes`.
Dessa forma, o nó pode começar a fazer swap antes de o kubelet começar a despejar Pods,
permitindo que as cargas de trabalho movam dados não utilizados para o swap e impedindo que as evictions aconteçam.
Por outro lado, como fica apenas ligeiramente abaixo, o kubelet provavelmente começará a despejar Pods
antes de o nó ficar sem memória, evitando assim o OOM killer.

O valor de `vm.min_free_kbytes` pode ser determinado executando o seguinte comando no nó:
```shell
cat /proc/sys/vm/min_free_kbytes
```

### Espaço de swap não utilizado

Sob o comportamento `LimitedSwap`, a quantidade de swap disponível para um Pod é determinada automaticamente,
com base na proporção da memória solicitada em relação à memória total do nó
(Para mais detalhes, consulte a [seção abaixo](#how-is-the-swap-limit-being-determined-with-limitedswap)).

Esse design significa que normalmente haverá uma parte do swap que permanecerá
restrita para as cargas de trabalho do Kubernetes.
Por exemplo, como o Kubernetes {{< skew currentVersion >}} não permite o uso de swap para
Pods na classe de QoS Guaranteed {{< glossary_tooltip text="QoS class" term_id="qos-class" >}},
a quantidade de swap proporcional à solicitação de memória dos pods Guaranteed permaneceria
não utilizada pelas cargas de trabalho do Kubernetes.

Esse comportamento traz algum risco em uma situação em que muitos pods não são elegíveis para swap.
Por outro lado, ele efetivamente mantém uma quantidade de memória swap reservada pelo sistema que pode ser usada por processos
fora do escopo do Kubernetes, como daemons do sistema e até o próprio kubelet.

## Boas práticas para usar swap em um cluster do Kubernetes {#good-practice-for-using-swap-in-a-kubernetes-cluster}

### Desabilitar o swap para daemons críticos do sistema

Durante a fase de testes e com base no feedback dos usuários, observou-se que o desempenho
de daemons e serviços críticos do sistema pode se degradar.
Isso implica que os daemons do sistema, incluindo o kubelet, poderiam operar mais lentamente do que o normal.
Se esse problema for encontrado, é aconselhável configurar o cgroup do slice do sistema
para impedir o swap (ou seja, definir `memory.swap.max=0`).

### Proteger os daemons críticos do sistema contra latência de I/O

O swap pode aumentar a carga de I/O em um nó.
Quando a pressão de memória faz com que o kernel troque páginas rapidamente para dentro e para fora da memória,
os daemons e serviços críticos do sistema que dependem de operações de I/O podem
sofrer degradação de desempenho.

Para mitigar isso, recomenda-se que os usuários do systemd priorizem o slice do sistema em termos de latência de I/O.
Para usuários não systemd,
é aconselhável configurar um cgroup dedicado para os daemons e processos do sistema e priorizar a latência de I/O da mesma maneira.
Isso pode ser conseguido definindo `io.latency` para o slice do sistema,
concedendo-lhe assim maior prioridade de I/O.
Consulte a [documentação do cgroup](https://www.kernel.org/doc/Documentation/admin-guide/cgroup-v2.rst) para obter mais informações.

### Swap e nós do control plane

O projeto Kubernetes recomenda executar os nós do control plane sem nenhum espaço de swap configurado.
O control plane hospeda principalmente Pods de QoS Guaranteed, portanto o swap geralmente pode ser desabilitado.
A principal preocupação é que o swap de serviços críticos no control plane pode impactar negativamente o desempenho.

### Uso de um disco dedicado para swap

O projeto Kubernetes recomenda usar swap criptografado sempre que você executar nós com swap habilitado.
Se o swap residir em uma partição ou no sistema de arquivos raiz, as cargas de trabalho podem interferir
nos processos do sistema que precisam gravar no disco.
Quando compartilham o mesmo disco, os processos podem sobrecarregar o swap,
interrompendo o I/O do kubelet, do runtime de contêiner e do systemd, o que impactaria outras cargas de trabalho.
Como o espaço de swap está localizado em um disco, é crucial garantir que o disco seja rápido o suficiente para os casos de uso pretendidos.
Alternativamente, pode-se configurar prioridades de I/O entre diferentes áreas mapeadas de um único dispositivo de apoio.

### Agendamento ciente de swap (swap-aware scheduling)

O Kubernetes {{< skew currentVersion >}} não suporta a alocação de Pods em nós de uma forma que leve em conta
o uso de memória swap. O agendador normalmente usa _requests_ de recursos de infraestrutura
para guiar a colocação de Pods, e os Pods não solicitam espaço de swap; eles apenas solicitam `memory`.
Isso significa que o agendador não considera a memória swap ao tomar decisões de agendamento.
Embora seja algo em que estamos trabalhando ativamente, ainda não está implementado.

Para que os administradores garantam que os Pods não sejam agendados em nós
com memória swap, a menos que tenham a intenção específica de usá-la,
os administradores podem aplicar taints aos nós com swap disponível para se protegerem desse problema.
Os taints garantirão que as cargas de trabalho que toleram swap não se espalhem para nós sem swap sob carga.

### Seleção de armazenamento para desempenho ideal

O dispositivo de armazenamento designado para o espaço de swap é fundamental para manter a capacidade de resposta do sistema
durante alto uso de memória.
Discos rígidos rotacionais (HDDs) não são adequados para essa tarefa, pois sua natureza mecânica introduz latência significativa,
levando a degradações severas de desempenho e à agitação do sistema (thrashing).
Para necessidades modernas de desempenho, um dispositivo como uma unidade de estado sólido (SSD) é provavelmente a escolha apropriada para o swap,
pois seu acesso eletrônico de baixa latência minimiza a lentidão.


## Detalhes do comportamento de swap

### Como o limite de swap é determinado com LimitedSwap? {#how-is-the-swap-limit-being-determined-with-limitedswap}

A configuração da memória swap, incluindo suas limitações, apresenta um desafio
significativo. Não só é propensa a erros de configuração, mas, como uma propriedade no nível do sistema, qualquer
erro de configuração poderia potencialmente comprometer o nó inteiro, e não apenas uma
carga de trabalho específica. Para mitigar esse risco e garantir a saúde do nó, implementamos
o Swap com configuração automática das limitações.

Com `LimitedSwap`, os Pods que não se enquadram na classificação de QoS Burstable (ou seja,
Pods de QoS `BestEffort`/`Guaranteed`) estão proibidos de utilizar memória swap.
Os Pods de QoS `BestEffort` exibem padrões imprevisíveis de consumo de memória e carecem de
informações sobre seu uso de memória, tornando difícil determinar uma alocação segura
de memória swap.
Por outro lado, os Pods de QoS `Guaranteed` são tipicamente empregados para aplicações que dependem da
alocação precisa de recursos especificada pela carga de trabalho, com a memória disponível imediatamente.
Para manter as garantias de segurança e saúde do nó mencionadas acima,
esses Pods não têm permissão para usar memória swap quando `LimitedSwap` está em vigor.
Além disso, pods de alta prioridade não têm permissão para usar swap, a fim de garantir que a memória
que consomem sempre resida na RAM, estando pronta para uso.

Antes de detalhar o cálculo do limite de swap, é necessário definir os seguintes termos:
* `nodeTotalMemory`: A quantidade total de memória física disponível no nó.
* `totalPodsSwapAvailable`: A quantidade total de memória swap no nó disponível para uso pelos Pods (parte da memória swap pode ser reservada para uso do sistema).
* `containerMemoryRequest`: A solicitação de memória do contêiner.

A limitação de swap é configurada como:  
( `containerMemoryRequest` / `nodeTotalMemory` ) × `totalPodsSwapAvailable`

Em outras palavras, a quantidade de swap que um contêiner é capaz de usar é proporcional à sua
solicitação de memória, à memória física total do nó e à quantidade total de memória swap
no nó disponível para uso pelos Pods.

É importante notar que, para contêineres dentro de Pods de QoS Burstable, é possível
desativar o uso de swap especificando solicitações de memória iguais aos limites de memória.
Contêineres configurados dessa maneira não terão acesso à memória swap.


## {{% heading "whatsnext" %}}

- Para aprender sobre o gerenciamento de swap em nós Linux, leia
  [configurando memória swap nos nós do Kubernetes](/docs/tutorials/cluster-management/provision-swap-memory/).
- Você pode conferir uma [postagem de blog sobre Kubernetes e swap](/blog/2025/03/25/swap-linux-improvements/)
- Para informações de contexto, consulte o KEP original, [KEP-2400](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2400-node-swap),
e seu [design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/2400-node-swap/README.md).
