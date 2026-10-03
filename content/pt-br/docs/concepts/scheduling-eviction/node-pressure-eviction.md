---
title: Eviction por pressão de nó
content_type: concept
weight: 100
---

{{<glossary_definition term_id="node-pressure-eviction" length="short">}}</br>


O {{<glossary_tooltip term_id="kubelet" text="kubelet">}} monitora recursos
como memória, espaço em disco e inodes do sistema de arquivos nos nós do seu cluster.
Quando um ou mais desses recursos atingem níveis específicos de consumo, o
kubelet pode falhar proativamente um ou mais pods no nó para recuperar recursos
e evitar a privação (starvation).

Durante uma eviction por pressão de nó, o kubelet define a [fase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) dos
pods selecionados como `Failed` e encerra o Pod.

A eviction por pressão de nó não é o mesmo que a
[eviction iniciada pela API](/docs/concepts/scheduling-eviction/api-eviction/).

O kubelet não respeita o {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}}
configurado por você nem o
`terminationGracePeriodSeconds` do pod. Se você usar [limites de eviction flexíveis (soft)](#soft-eviction-thresholds),
o kubelet respeita o seu `eviction-max-pod-grace-period` configurado. Se você usar
[limites de eviction rígidos (hard)](#hard-eviction-thresholds), o kubelet usa um período de carência de `0s` (encerramento imediato) para a terminação.

## Comportamento de autorrecuperação

O kubelet tenta [recuperar recursos no nível do nó](#reclaim-node-resources)
antes de terminar os pods do usuário final. Por exemplo, ele remove imagens de contêiner
não utilizadas quando os recursos de disco estão em escassez.

Se os pods forem gerenciados por um objeto de gerenciamento de {{< glossary_tooltip text="carga de trabalho" term_id="workload" >}}
(como um {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}
ou {{< glossary_tooltip text="Deployment" term_id="deployment" >}}) que
substitui pods com falha, o control plane (`kube-controller-manager`) cria novos
pods no lugar dos pods despejados (evicted).

### Autorrecuperação para pods estáticos

Se você estiver executando um [pod estático](/docs/concepts/workloads/pods/#static-pods)
em um nó que está sob pressão de recursos, o kubelet pode despejar esse
Pod estático. O kubelet então tenta criar um substituto, porque os Pods estáticos sempre
representam uma intenção de executar um Pod naquele nó.

O kubelet leva em consideração a _prioridade_ do pod estático ao criar
um substituto. Se o manifesto do pod estático especificar uma prioridade baixa e houver
Pods de prioridade mais alta definidos no control plane do cluster, e o
nó estiver sob pressão de recursos, o kubelet pode não conseguir abrir espaço para
esse pod estático. O kubelet continua tentando executar todos os pods estáticos mesmo
quando há pressão de recursos em um nó.

## Sinais e limites de eviction

O kubelet usa vários parâmetros para tomar decisões de eviction, como os seguintes:

- Sinais de eviction
- Limites de eviction
- Intervalos de monitoramento

### Sinais de eviction {#eviction-signals}

Os sinais de eviction são o estado atual de um determinado recurso em um
momento específico. O kubelet usa os sinais de eviction para tomar decisões de eviction,
comparando os sinais com os limites de eviction, que são a quantidade mínima
do recurso que deve estar disponível no nó.

O kubelet usa os seguintes sinais de eviction:

| Sinal de Eviction        | Descrição                                                                             | Somente Linux |
|--------------------------|---------------------------------------------------------------------------------------|------------|
| `memory.available`       | `memory.available` := `node.status.capacity[memory]` - `node.stats.memory.workingSet` |            |
| `nodefs.available`       | `nodefs.available` := `node.stats.fs.available`                                       |            |
| `nodefs.inodesFree`      | `nodefs.inodesFree` := `node.stats.fs.inodesFree`                                     |      •     |
| `imagefs.available`      | `imagefs.available` := `node.stats.runtime.imagefs.available`                         |            |
| `imagefs.inodesFree`     | `imagefs.inodesFree` := `node.stats.runtime.imagefs.inodesFree`                       |      •     |
| `containerfs.available`  | `containerfs.available` := `node.stats.runtime.containerfs.available`                 |            |
| `containerfs.inodesFree` | `containerfs.inodesFree` := `node.stats.runtime.containerfs.inodesFree`               |      •     |
| `pid.available`          | `pid.available` := `node.stats.rlimit.maxpid` - `node.stats.rlimit.curproc`           |      •     |

Nesta tabela, a coluna **Descrição** mostra como o kubelet obtém o valor do
sinal. Cada sinal suporta um valor em porcentagem ou um valor literal. O kubelet
calcula o valor em porcentagem em relação à capacidade total associada ao
sinal.

#### Sinais de memória

Em nós Linux, o valor de `memory.available` é derivado do cgroupfs em vez de ferramentas
como `free -m`. Isso é importante porque o `free -m` não funciona em um
contêiner, e se os usuários usarem o recurso de [node allocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable),
as decisões de falta de recursos
são tomadas localmente na parte da hierarquia de cgroups do Pod do usuário final, bem como no
nó raiz. Este [script](/examples/admin/resource/memory-available.sh) ou
[script cgroupv2](/examples/admin/resource/memory-available-cgroupv2.sh)
reproduz o mesmo conjunto de etapas que o kubelet executa para calcular
`memory.available`. O kubelet exclui o inactive_file (o número de bytes de
memória suportada por arquivos na lista LRU inativa) de seu cálculo, pois assume que
essa memória pode ser recuperada sob pressão.

{{<note>}}
{{< feature-state feature_gate_name="HugepageAwareEviction" >}}
Em nós com [hugepages](/docs/tasks/manage-hugepages/scheduling-hugepages/)
configurados, o kubelet subtrai a capacidade total de hugepage do nó
de `memory.available` usado pelo gerenciador de eviction.
Sem esse ajuste, a RAM reservada para hugepages infla
`AvailableBytes`, porque o controlador do cgroup de memória não rastreia as alocações de hugetlb
em seu working set. Isso pode atrasar a eviction e levar a OOM kills.
Para restaurar o comportamento anterior, desabilite o
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `HugepageAwareEviction`.
{{</note>}}

Em nós Windows, o valor de `memory.available` é derivado dos níveis globais de
memória commit do nó (consultados por meio da chamada de sistema
[`GetPerformanceInfo()`](https://learn.microsoft.com/windows/win32/api/psapi/nf-psapi-getperformanceinfo)),
subtraindo o [`CommitTotal`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information)
global do nó do [`CommitLimit`](https://learn.microsoft.com/windows/win32/api/psapi/ns-psapi-performance_information) do nó. Observe que o `CommitLimit` pode mudar se o tamanho do
arquivo de paginação do nó mudar!

#### Sinais do sistema de arquivos

O kubelet reconhece três identificadores específicos do sistema de arquivos que podem ser usados com
sinais de eviction (`<identifier>.inodesFree` ou `<identifier>.available`):

1. `nodefs`: O sistema de arquivos principal do nó, usado para volumes de disco locais,
    volumes emptyDir sem suporte em memória, armazenamento de logs, armazenamento efêmero
    e mais. Por exemplo, `nodefs` contém `/var/lib/kubelet`.

1. `imagefs`: Um sistema de arquivos opcional que os runtimes de contêiner podem usar para armazenar
   imagens de contêiner (que são as camadas somente leitura). Se não houver um
   `containerfs` separado, o sistema de arquivos de imagens também armazena as camadas graváveis dos contêineres.

1. `containerfs`: Um sistema de arquivos opcional que os runtimes de contêiner podem usar para
   armazenar as camadas graváveis dos contêineres. Quando o `containerfs` é usado, o sistema de arquivos `imagefs`
   pode ser dividido para armazenar apenas imagens (camadas somente leitura) e nada
   mais.

Esses identificadores descrevem os sistemas de arquivos conforme o kubelet os observa. Eles nem
sempre significam três pontos de montagem diferentes: em layouts comuns, dois ou
todos os três identificadores podem se referir ao mesmo sistema de arquivos subjacente.

{{<note>}}
{{< feature-state feature_gate_name="KubeletSeparateDiskGC" >}}
O recurso de _sistema de arquivos de imagens dividido (split image filesystem)_ adiciona novos sinais, limites e
métricas de eviction para o `containerfs`. Para usar o `containerfs`, o release
v{{< skew currentVersion >}} do Kubernetes exige que o
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `KubeletSeparateDiskGC`
esteja habilitado. Para o Kubernetes v{{< skew currentVersion >}}, apenas o CRI-O (v1.29 ou
superior) oferece suporte ao sistema de arquivos `containerfs`.
{{</note>}}

O kubelet suporta três layouts comuns para sistemas de arquivos de contêineres:

- Tudo está no `nodefs` único, também chamado de "rootfs" ou
  simplesmente "root". Neste layout, `nodefs`, `imagefs` e `containerfs`
  referem-se ao mesmo sistema de arquivos subjacente.

- O armazenamento do runtime de contêiner está em um disco dedicado, separado do
  sistema de arquivos raiz. Neste layout, `imagefs` e `containerfs` referem-se ao mesmo
  sistema de arquivos subjacente, que armazena tanto as camadas de imagens quanto as camadas graváveis
  dos contêineres. Isso é frequentemente chamado de sistema de arquivos de
  "disco dividido" (split disk) (ou "disco separado").

- As camadas graváveis dos contêineres estão no `nodefs`, e as imagens de contêiner
  (camadas somente leitura) são armazenadas em um `imagefs` separado. Neste layout,
  `containerfs` e `nodefs` referem-se ao mesmo sistema de arquivos subjacente. Isso é
  frequentemente chamado de sistema de arquivos de "imagem dividida" (split image).

O kubelet tentará descobrir automaticamente esses sistemas de arquivos com sua
configuração atual diretamente do runtime de contêiner subjacente e ignorará
outros sistemas de arquivos locais do nó.

O kubelet não suporta outros sistemas de arquivos de contêineres ou configurações de armazenamento,
e atualmente não suporta múltiplos sistemas de arquivos para imagens e contêineres.

### Recursos de garbage collection do kubelet descontinuados

Alguns recursos de garbage collection do kubelet estão descontinuados em favor da eviction:

| Flag existente | Justificativa |
| ------------- | --------- |
| `--maximum-dead-containers` | descontinuada assim que os logs antigos passaram a ser armazenados fora do contexto do contêiner |
| `--maximum-dead-containers-per-container` | descontinuada assim que os logs antigos passaram a ser armazenados fora do contexto do contêiner |
| `--minimum-container-ttl-duration` | descontinuada assim que os logs antigos passaram a ser armazenados fora do contexto do contêiner |

### Limites de eviction

Você pode especificar limites de eviction personalizados para o kubelet usar ao tomar
decisões de eviction. Você pode configurar limites de eviction [flexíveis (soft)](#soft-eviction-thresholds) e
[rígidos (hard)](#hard-eviction-thresholds).

Os limites de eviction têm a forma `[eviction-signal][operador][quantidade]`, onde:

- `eviction-signal` é o [sinal de eviction](#eviction-signals) a ser usado.
- `operador` é o [operador relacional](https://en.wikipedia.org/wiki/Relational_operator#Standard_relational_operators)
  desejado, como `<` (menor que).
- `quantidade` é a quantidade do limite de eviction, como `1Gi`. O valor de `quantidade`
  deve corresponder à representação de quantidade usada pelo Kubernetes. Você pode usar
  valores literais ou porcentagens (`%`).

Por exemplo, se um nó tem 10GiB de memória total e você quer acionar a eviction se
a memória disponível cair abaixo de 1GiB, você pode definir o limite de eviction como
`memory.available<10%` ou `memory.available<1Gi` (você não pode usar ambos).

#### Limites de eviction flexíveis (soft) {#soft-eviction-thresholds}

Um limite de eviction flexível combina um limite de eviction com um
período de carência obrigatório especificado pelo administrador. O kubelet não despeja pods até que o
período de carência seja excedido. O kubelet retorna um erro na inicialização se você não
especificar um período de carência.

Você pode especificar tanto um período de carência para o limite de eviction flexível quanto um
período máximo de carência permitido para a terminação de pods para o kubelet usar durante as evictions. Se você
especificar um período máximo de carência permitido e o limite de eviction flexível for atingido,
o kubelet usa o menor dos dois períodos de carência. Se você não especificar um
período máximo de carência permitido, o kubelet encerra imediatamente os pods despejados sem
terminação graciosa.

Você pode usar as seguintes flags para configurar limites de eviction flexíveis:

- `eviction-soft`: Um conjunto de limites de eviction, como `memory.available<1.5Gi`,
  que pode acionar a eviction de pods se persistir pelo período de carência especificado.
- `eviction-soft-grace-period`: Um conjunto de períodos de carência de eviction, como `memory.available=1m30s`,
  que definem por quanto tempo um limite de eviction flexível deve persistir antes de acionar a eviction de um Pod.
- `eviction-max-pod-grace-period`: O período máximo de carência permitido (em segundos)
  a ser usado ao terminar pods em resposta ao atingimento de um limite de eviction flexível.

#### Limites de eviction rígidos (hard) {#hard-eviction-thresholds}

Um limite de eviction rígido não tem período de carência. Quando um limite de eviction rígido é
atingido, o kubelet encerra os pods imediatamente, sem terminação graciosa, para recuperar
o recurso em escassez.

Você pode usar a flag `eviction-hard` para configurar um conjunto de limites de eviction
rígidos, como `memory.available<1Gi`.

O kubelet tem os seguintes limites de eviction rígidos padrão:

- `memory.available<100Mi` (nós Linux)
- `memory.available<500Mi` (nós Windows)
- `nodefs.available<10%`
- `imagefs.available<15%`
- `nodefs.inodesFree<5%` (nós Linux)
- `imagefs.inodesFree<5%` (nós Linux)

Esses valores padrão dos limites de eviction rígidos só serão definidos se nenhum
dos parâmetros for alterado. Se você alterar o valor de qualquer parâmetro,
os valores dos outros parâmetros não serão herdados como valores
padrão e serão definidos como zero. Para fornecer valores personalizados, você
deve fornecer todos os limites respectivamente. Você também pode definir
MergeDefaultEvictionSettings como true no arquivo de configuração do kubelet.
Se definido como true e qualquer parâmetro for alterado, os outros parâmetros
herdarão seus valores padrão em vez de 0.

Os limites de eviction padrão `containerfs.available` e `containerfs.inodesFree` (nós Linux) serão definidos da seguinte forma:

- Se `containerfs` e `nodefs` referirem-se ao mesmo sistema de arquivos subjacente, então
  os limites de `containerfs` serão definidos como os de `nodefs`.

- Se `containerfs` e `imagefs` referirem-se ao mesmo sistema de arquivos subjacente, então
  os limites de `containerfs` serão definidos como os de `imagefs`.

Não há suporte para definir substituições personalizadas para os limites relacionados a
`containerfs`, e um aviso será emitido se uma tentativa disso for feita; qualquer
valor personalizado fornecido será ignorado.

## Intervalo de monitoramento de eviction

O kubelet avalia os limites de eviction com base no seu `housekeeping-interval`
configurado, que tem como padrão `10s`.

## Condições do nó {#node-conditions}

O kubelet relata [condições do nó](/docs/concepts/architecture/nodes/#condition) para
refletir que o nó está sob pressão porque um limite de eviction rígido ou flexível
foi atingido, independentemente dos períodos de carência configurados.

O kubelet mapeia os sinais de eviction para as condições do nó da seguinte forma:

| Condição do Nó    | Sinal de Eviction                                                                     | Descrição                                                                                   |
|-------------------|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| `MemoryPressure`  | `memory.available`                                                                    | A memória disponível no nó atingiu um limite de eviction                                    |
| `DiskPressure`    | `nodefs.available`, `nodefs.inodesFree`, `imagefs.available`, `imagefs.inodesFree`, `containerfs.available` ou `containerfs.inodesFree` | O espaço em disco e os inodes disponíveis no sistema de arquivos raiz do nó, no sistema de arquivos de imagens ou no sistema de arquivos de contêineres atingiram um limite de eviction |
| `PIDPressure`     | `pid.available`                                                                       | Os identificadores de processos disponíveis no nó (Linux) caíram abaixo de um limite de eviction |

O control plane também [mapeia](/pt-br/docs/concepts/scheduling-eviction/taint-and-toleration/)
essas condições do nó para taints.

O kubelet atualiza as condições do nó com base no
`--node-status-update-frequency` configurado, que tem como padrão `10s`.

### Oscilação da condição do nó

Em alguns casos, os nós oscilam acima e abaixo dos limites de eviction flexíveis sem
permanecer pelos períodos de carência definidos. Isso faz com que a condição do nó relatada
alterne constantemente entre `true` e `false`, levando a decisões de eviction ruins.

Para se proteger contra a oscilação, você pode usar a flag `eviction-pressure-transition-period`,
que controla por quanto tempo o kubelet deve esperar antes de transicionar uma condição
do nó para um estado diferente. O período de transição tem um valor padrão de `5m`.

### Recuperando recursos no nível do nó {#reclaim-node-resources}

O kubelet tenta recuperar os recursos no nível do nó antes de despejar os pods do usuário final.

Quando uma condição de nó `DiskPressure` é relatada, o kubelet recupera os recursos
no nível do nó com base nos sistemas de arquivos do nó.

#### Sem `imagefs` ou `containerfs`

Se o nó tiver apenas um sistema de arquivos `nodefs` que atinge os limites de eviction,
o kubelet libera espaço em disco na seguinte ordem:

1. Faz o garbage collect de pods e contêineres mortos.
1. Exclui imagens não utilizadas.

#### Com `imagefs`

Se o nó tiver um sistema de arquivos `imagefs` dedicado para uso dos runtimes de
contêiner, o kubelet faz o seguinte:

- Se o sistema de arquivos `nodefs` atingir os limites de eviction, o kubelet faz o
  garbage collect de pods e contêineres mortos.

- Se o sistema de arquivos `imagefs` atingir os limites de eviction, o kubelet
  exclui todas as imagens não utilizadas.

#### Com `imagefs` e `containerfs`

Se o nó tiver um `containerfs` dedicado junto com o sistema de arquivos `imagefs`
configurado para uso dos runtimes de contêiner, então o kubelet tentará
recuperar recursos da seguinte forma:

- Se o sistema de arquivos `containerfs` atingir os limites de eviction, o kubelet
  faz o garbage collect de pods e contêineres mortos.

- Se o sistema de arquivos `imagefs` atingir os limites de eviction, o kubelet
  exclui todas as imagens não utilizadas.

### Seleção de pods para eviction pelo kubelet

Se as tentativas do kubelet de recuperar recursos no nível do nó não trouxerem o sinal
de eviction abaixo do limite, o kubelet começa a despejar os pods do usuário final.

O kubelet usa os seguintes parâmetros para determinar a ordem de eviction dos pods:

1. Se o uso de recursos do pod excede as solicitações (requests)
1. [Prioridade do Pod](/pt-br/docs/concepts/scheduling-eviction/pod-priority-preemption/)
1. O uso de recursos do pod em relação às solicitações

Como resultado, o kubelet classifica e despeja os pods na seguinte ordem:

1. Pods `BestEffort` ou `Burstable` em que o uso excede as solicitações. Esses pods
   são despejados com base em sua Prioridade e, em seguida, por quanto seu nível de uso
   excede a solicitação.

1. Pods `Guaranteed` e pods `Burstable` em que o uso é menor que as solicitações
   são despejados por último, com base em sua Prioridade.

{{<note>}}
O kubelet não usa a [classe de QoS](/docs/concepts/workloads/pods/pod-qos/) do pod para determinar a ordem de eviction.
Você pode usar a classe de QoS para estimar a ordem de eviction de pods mais provável ao
recuperar recursos como memória. A classificação de QoS não se aplica às solicitações de EphemeralStorage,
então o cenário acima não se aplicará se o nó estiver, por exemplo, sob `DiskPressure`.
{{</note>}}

Os pods `Guaranteed` são garantidos apenas quando solicitações e limites são especificados para
todos os contêineres e são iguais. Esses pods nunca serão despejados por causa
do consumo de recursos de outro pod. Se um daemon do sistema (como o `kubelet`
e o `journald`) estiver consumindo mais recursos do que os reservados por meio das
alocações `system-reserved` ou `kube-reserved`, e o nó tiver apenas
pods `Guaranteed` ou `Burstable` usando menos recursos do que as solicitações restantes,
então o kubelet deve escolher despejar um desses pods para preservar a estabilidade do nó
e limitar o impacto da escassez de recursos em outros pods. Neste caso, ele
escolherá despejar primeiro os pods de menor Prioridade.

Se você estiver executando um [pod estático](/docs/concepts/workloads/pods/#static-pods)
e quiser evitar que ele seja despejado sob pressão de recursos, defina o campo
`priority` desse Pod diretamente. Pods estáticos não suportam o campo
`priorityClassName`.

Quando o kubelet despeja pods em resposta à escassez de inodes ou de IDs de processo, ele usa
a prioridade relativa dos Pods para determinar a ordem de eviction, porque inodes e PIDs não têm
solicitações.

O kubelet classifica os pods de forma diferente dependendo se o nó tem um
sistema de arquivos `imagefs` ou `containerfs` dedicado:

#### Sem `imagefs` ou `containerfs` (`nodefs` e `imagefs` usam o mesmo sistema de arquivos) {#without-imagefs}

- Se `nodefs` acionar evictions, o kubelet classifica os pods com base em seu
  uso total de disco (`volumes locais + logs e uma camada gravável de todos os contêineres`).

#### Com `imagefs` (`nodefs` e `imagefs` são sistemas de arquivos separados) {#with-imagefs}

- Se `nodefs` acionar evictions, o kubelet classifica os pods com base no uso de
  `nodefs` (`volumes locais + logs de todos os contêineres`).

- Se `imagefs` acionar evictions, o kubelet classifica os pods com base no
  uso da camada gravável de todos os contêineres.

#### Com `imagefs` e `containerfs` (`imagefs` e `containerfs` foram separados) {#with-containersfs}

- Se `containerfs` acionar evictions, o kubelet classifica os pods com base no
  uso de `containerfs` (`volumes locais + logs e uma camada gravável de todos os contêineres`).

- Se `imagefs` acionar evictions, o kubelet classifica os pods com base no
  ranking de `armazenamento de imagens`, que representa o uso de disco de uma determinada imagem.

### Recuperação mínima de eviction

{{<note>}}
A partir do Kubernetes v{{< skew currentVersion >}}, você não pode definir um valor personalizado
para a métrica `containerfs.available`. A configuração para esta métrica específica
será definida automaticamente para refletir os valores definidos para `nodefs`
ou `imagefs`, dependendo da configuração.
{{</note>}}

Em alguns casos, a eviction de pods recupera apenas uma pequena quantidade do recurso em escassez.
Isso pode levar o kubelet a atingir repetidamente os limites de eviction configurados
e acionar múltiplas evictions.

Você pode usar a flag `--eviction-minimum-reclaim` ou um [arquivo de configuração do kubelet](/docs/tasks/administer-cluster/kubelet-config-file/)
para configurar uma quantidade mínima de recuperação para cada recurso. Quando o kubelet percebe
que um recurso está em escassez, ele continua a recuperar esse recurso até recuperar
a quantidade que você especificar.

Por exemplo, a configuração a seguir define quantidades mínimas de recuperação:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
evictionHard:
  memory.available: "500Mi"
  nodefs.available: "1Gi"
  imagefs.available: "100Gi"
evictionMinimumReclaim:
  memory.available: "0Mi"
  nodefs.available: "500Mi"
  imagefs.available: "2Gi"
```

Neste exemplo, se o sinal `nodefs.available` atingir o limite de eviction,
o kubelet recupera o recurso até que o sinal alcance o limite de 1GiB,
e então continua a recuperar a quantidade mínima de 500MiB, até que o valor
disponível do armazenamento nodefs alcance 1,5GiB.

Da mesma forma, o kubelet tenta recuperar o recurso `imagefs` até que o valor
`imagefs.available` alcance `102Gi`, representando 102 GiB de armazenamento de imagens de
contêineres disponível. Se a quantidade de armazenamento que o kubelet pudesse recuperar for menor que 2GiB, o kubelet não recupera nada.

O `eviction-minimum-reclaim` padrão é `0` para todos os recursos.

## Comportamento do nó sem memória (out of memory)

Se o nó passar por um evento de _out of memory_ (OOM) antes de o kubelet
conseguir recuperar a memória, o nó depende do [oom_killer](https://lwn.net/Articles/391222/)
para responder.

O kubelet define um valor `oom_score_adj` para cada contêiner com base no QoS do pod.

| Qualidade de Serviço | `oom_score_adj`                                                                   |
|--------------------|-----------------------------------------------------------------------------------|
| `Guaranteed`       | -997                                                                              |
| `BestEffort`       | 1000                                                                              |
| `Burstable`        | _min(max(2, 1000 - (1000 × memoryRequestBytes) / machineMemoryCapacityBytes), 999)_ |

{{<note>}}
O kubelet também define um valor `oom_score_adj` de `-997` para quaisquer contêineres em Pods que tenham
{{<glossary_tooltip text="Prioridade" term_id="pod-priority">}} `system-node-critical`.
{{</note>}}

Se o kubelet não conseguir recuperar a memória antes de o nó sofrer OOM, o
`oom_killer` calcula um `oom_score` com base na porcentagem de memória que o
contêiner está usando no nó e, em seguida, adiciona o `oom_score_adj` para obter um `oom_score`
efetivo para cada contêiner. Em seguida, ele encerra o contêiner com a pontuação mais alta.

Isso significa que os contêineres em pods de QoS baixo que consomem uma grande quantidade de memória
em relação às suas solicitações de agendamento são encerrados primeiro.

Ao contrário da eviction de pods, se um contêiner for encerrado por OOM, o kubelet pode reiniciá-lo
com base em seu `restartPolicy`.

## Boas práticas {#node-pressure-eviction-good-practices}

As seções a seguir descrevem boas práticas para a configuração de eviction.

### Recursos agendáveis e políticas de eviction

Quando você configura o kubelet com uma política de eviction, você deve garantir que
o agendador não agendará pods se eles acionarem a eviction porque
induzem imediatamente pressão de memória.

Considere o seguinte cenário:

- Capacidade de memória do nó: 10GiB
- O operador deseja reservar 10% da capacidade de memória para daemons do sistema (kernel, `kubelet`, etc.)
- O operador deseja despejar Pods com 95% de utilização de memória para reduzir a incidência de OOM do sistema.

Para que isso funcione, o kubelet é iniciado da seguinte forma:

```none
--eviction-hard=memory.available<500Mi
--system-reserved=memory=1.5Gi
```

Nesta configuração, a flag `--system-reserved` reserva 1.5GiB de memória
para o sistema, que é `10% da memória total + a quantidade do limite de eviction`.

O nó pode atingir o limite de eviction se um pod estiver usando mais do que sua solicitação,
ou se o sistema estiver usando mais de 1GiB de memória, o que faz o sinal `memory.available`
cair abaixo de 500MiB e aciona o limite.

### DaemonSets e eviction por pressão de nó {#daemonset}

A prioridade do pod é um fator importante nas decisões de eviction. Se você não quiser
que o kubelet despeje os pods que pertencem a um DaemonSet, dê a esses pods uma prioridade
suficientemente alta especificando um `priorityClassName` adequado na spec do pod.
Você também pode usar uma prioridade mais baixa, ou a padrão, para permitir que os pods desse
DaemonSet sejam executados apenas quando houver recursos suficientes.

## Problemas conhecidos

As seções a seguir descrevem problemas conhecidos relacionados ao tratamento de falta de recursos.

### O kubelet pode não perceber a pressão de memória imediatamente

Por padrão, o kubelet consulta o cAdvisor para coletar estatísticas de uso de memória em um
intervalo regular. Se o uso de memória aumentar rapidamente dentro dessa janela, o
kubelet pode não perceber `MemoryPressure` rápido o suficiente, e o OOM killer
ainda será invocado.

Você pode usar a flag `--kernel-memcg-notification` para habilitar a API de notificação
`memcg` no kubelet para ser notificado imediatamente quando um limite for cruzado.

Se você não está tentando alcançar uma utilização extrema, mas uma medida sensata de
overcommit, uma solução alternativa viável para esse problema é usar as flags
`--kube-reserved` e `--system-reserved` para alocar memória para o sistema.

### A memória active_file não é considerada como memória disponível

No Linux, o kernel rastreia o número de bytes de memória suportada por arquivos na lista
LRU (least recently used) ativa como a estatística `active_file`. O kubelet trata as áreas de memória `active_file`
como não recuperáveis. Para cargas de trabalho que fazem uso intensivo de armazenamento
local suportado por blocos, incluindo armazenamento local efêmero, os caches no nível do kernel de dados
de arquivos e blocos significam que muitas páginas de cache acessadas recentemente provavelmente serão
contadas como `active_file`. Se um número suficiente desses buffers de bloco do kernel estiver na
lista LRU ativa, o kubelet pode observar isso como um uso alto de recursos e
aplicar um taint ao nó como sofrendo pressão de memória — acionando a eviction de pods.

Para mais detalhes, consulte [https://github.com/kubernetes/kubernetes/issues/43916](https://github.com/kubernetes/kubernetes/issues/43916)

Você pode contornar esse comportamento definindo o limite de memória e a solicitação de memória
iguais para contêineres propensos a realizar atividades intensivas de I/O. Você precisará
estimar ou medir um valor ótimo de limite de memória para esse contêiner.

## {{% heading "whatsnext" %}}

- Saiba mais sobre a [eviction iniciada pela API](/docs/concepts/scheduling-eviction/api-eviction/)
- Saiba mais sobre a [prioridade e preempção de Pods](/pt-br/docs/concepts/scheduling-eviction/pod-priority-preemption/)
- Saiba mais sobre [PodDisruptionBudgets](/docs/tasks/run-application/configure-pdb/)
- Saiba mais sobre [Qualidade de Serviço](/docs/tasks/configure-pod-container/quality-service-pod/) (QoS)
- Confira a [API Eviction](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)
