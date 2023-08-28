---
title: Gerenciamento de recursos em Pods e contêineres
content_type: concept
weight: 40
feature:
  title: Empacotamento automático
  description: >
    Distribui contêineres automaticamente com base em requerimentos de recursos
    e em outras restrições, evitando sacrificar disponibilidade.
    Combina cargas de trabalho críticas com cargas de trabalho de prioridades
    mais baixas para melhorar a utilização e reduzir o desperdício de recursos.
---

<!-- overview -->

Ao criar a especificação de um {{< glossary_tooltip term_id="pod" >}}, você pode
opcionalmente especificar quanto de cada recurso um {{< glossary_tooltip text="contêiner" term_id="container" >}}
precisa. Os recursos mais comuns a serem especificados são CPU e memória (RAM);
há outros recursos que podem ser especificados.

Quando você especifica o _requerimento_ de recursos em um Pod, o
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} utiliza
esta informação para decidir a qual nó o Pod será atribuído. Quando você
especifica um _limite_ de recurso para um contêiner, o kubelet garante o
cumprimento de tais limites, de modo que o contêiner em execução não consiga
utilizar uma quantidade de tal recurso além do limite especificado. O kubelet
também reserva pelo menos o _requerimento_ daquele recurso de sistema
especificamente para que este contêiner utilize.

<!-- body -->

## Requerimentos e limites

Se o nó em que um Pod está rodando tem o suficiente de um recurso específico
disponível, é possível (e permitido) a um contêiner utilizar mais do que o seu
`request` para aquele recurso especifica. No entanto, não é permitido a um
contêiner consumir mais do que o seu `limit` para um recurso.

Por exemplo, se você especificar um requerimento de `memory` de 256 MiB para um
contêiner, e aquele contêiner está em um Pod atribuído a um nó com 8GiB de
memória, sem outros Pods, então este contêiner pode tentar consumir mais memória
RAM.

Se você especificar um limite de `memory` de 4GiB para aquele contêiner, o
kubelet (e o
{{< glossary_tooltip text="agente de execução de contêiner" term_id="container-runtime" >}})
vão garantir o cumprimento do limite. O agente de execução impede que o contêiner
utilize mais de um recurso do que seu limite configurado. Por exemplo, quando
um processo no contêiner tenta consumir mais que o limite permitido de memória,
o núcleo do sistema encerra o processo que tentou efetuar a alocação de memória
com um erro de memória esgotada (_out of memory (OOM) error_).

Limites podem ser implementados de forma reativa (o sistema intervém quando
uma violação ocorre) ou por garantia (o sistema previne o contêiner de exceder
o limite). Diferentes agentes de execução implementam as mesmas restrições de
maneiras diferentes.

{{< note >}}
Se um contêiner especifica seu próprio limite de memória, mas não especifica seu
requerimento de memória, o Kubernetes automaticamente cria um requerimento de
memória com o mesmo valor do limite. A mesma regra vale para o limite de CPU:
quando não há requerimento de CPU, o Kubernetes automaticamente cria um
requerimento de CPU idêntico ao limite.
{{< /note >}}

## Tipos de recursos

_CPU_ e _memória_ são _tipos de recursos_. Um tipo de recurso possui uma unidade
básica. CPU representa processamento computacional e é especificada em unidades
de [CPU do Kubernetes](#meaning-of-cpu).
Memória é especificada em bytes. Em cargas de trabalho Linux, você pode
especificar o recurso _huge pages_. _Huge pages_ são uma funcionalidade
específica do Linux que permite ao núcleo do sistema operacional alocar
blocos de memória muito maiores que o tamanho de página de memória padrão.

Por exemplo, em um sistema onde o tamanho da página de memória padrão é de 4 KiB,
você pode especificar um limite `hugepages-2Mi: 80Mi`. Se o contêiner tentar
alocar mais de 40 _huge pages_ de 2 MiB cada, ou um total de 80 MiB, essa
alocação irá falhar.

{{< note >}}
Você não pode superdimensionar (ou solicitar acima do limite físico) recursos do
tipo `hugepages-*`.
O recurso `hugepages-*` difere dos recursos `memory` e `cpu` neste aspecto.
{{< /note >}}

CPU e memória são chamados coletivamente de _recursos computacionais_, ou apenas
_recursos_. Recursos computacionais são quantidades mensuráveis que podem ser
requisitadas, alocadas, e consumidas. Estes recursos diferem dos
[recursos de API](/docs/concepts/overview/kubernetes-api/). Recursos de API,
como Pods e [Services](/docs/concepts/services-networking/service/) são objetos
que podem ser lidos e modificados através do servidor da API do Kubernetes.

## Requerimentos de recursos e limites de Pod e contêiner

Para cada contêiner, você pode especificar limites e requerimentos de recursos,
incluindo os seguintes recursos:

* `spec.containers[].resources.limits.cpu`
* `spec.containers[].resources.limits.memory`
* `spec.containers[].resources.limits.hugepages-<size>`
* `spec.containers[].resources.requests.cpu`
* `spec.containers[].resources.requests.memory`
* `spec.containers[].resources.requests.hugepages-<size>`

Embora você possa especificar apenas requerimentos e limites para contêineres
individuais, é útil também pensar sobre os requerimentos e limites gerais de um
Pod.
Para um recurso em particular, um _requerimento ou limite de recurso de um Pod_
é a soma de todos os valores dos requerimentos ou limites de um recurso daquele
tipo, especificados em cada um dos contêineres daquele Pod.

## Unidades de recursos no Kubernetes

### Unidades de recurso de CPU {#meaning-of-cpu}

Limites e requerimentos de recursos de CPU são mensurados em unidades de _cpu_.
No Kubernetes, uma unidade de CPU é equivalente a **um núcleo físico de CPU**,
ou **um núcleo virtual**, dependendo se o nó é uma máquina física ou uma máquina
virtual rodando em uma máquina física.

Requerimentos fracionários são permitidos. Quando você define um contêiner cujo
valor do campo `spec.containers[].resources.requests.cpu` é `0.5`, você está
solicitando metade da quantidade de CPU que teria sido solicitada caso o valor
fosse `1.0`.
No caso de unidades de recurso de CPU, a expressão de
[quantidade](/docs/reference/kubernetes-api/common-definitions/quantity/) `0.1`
é equivalente à expressão `100m`, que pode ser lida como "cem milicpus", ou
"cem milinúcleos". "Milicpu" ou "milinúcleo" equivalem à milésima parte de um
núcleo ou CPU, de modo que "100m" equivalem a 10% do tempo computacional de um
processador.

Recursos de CPU são sempre especificados como uma quantidade absoluta de recurso,
nunca como uma quantidade relativa. Por exemplo, `500m` de CPU representam
grosseiramente a mesma quantidade de poder computacional, independentemente do
contêiner rodar em uma máquina com processador de núcleo único, de dois núcleos
ou de 48 núcleos.

{{< note >}}
O Kubernetes não permite que você especifique recursos de CPU com uma precisão
maior que `1m`. Devido a isso, é útil especificar unidades de CPU menores do que
`1.0` ou `1000m` utilizando a notação de milicpu. Por exemplo, `5m` ao invés de
`0.005`.
{{< /note >}}

### Unidades de recurso de memória {#meaning-of-memory}

Limites e requerimentos de `memory` são medidos em bytes. Você pode expressar
memória como um número inteiro ou como um número de ponto fixo, utilizando um
destes sufixos de
[quantidade](/docs/reference/kubernetes-api/common-definitions/quantity/):
E, P, T, G, M, k. Você também pode utilizar os equivalentes de potência de dois:
Ei, Pi, Ti, Gi, Mi, Ki. Por exemplo, as quantidades abaixo representam, a grosso
modo, o mesmo valor:

```shell
128974848, 129e6, 129M, 128974848000m, 123Mi
```

Tome cuidado com os sufixos. Se você solicitar `400m` de memória, esta
quantidade estará de fato requerendo o equivalente a 0,4 byte de memória. A
intenção da pessoa que fez esta requisição provavelmente era solictar 400
mebibytes (`400Mi`) ou 400 megabytes (`400M`).

## Exemplo de recursos de contêiner {#example-1}

O Pod seguinte tem dois contêineres. Ambos os contêineres têm um requerimento de
0,25 CPU e 64 MiB (ou 2<sup>26</sup> bytes) de memória. Cada contêiner tem um
limite de 0,5 CPU e 128 MiB de memória. Você pode dizer que o Pod tem um
requerimento de 0,5 CPU e 128 MiB de memória, e um limite de 1 CPU e 256 MiB de
memória.

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## Como Pods com requerimentos de recursos são agendados

Quando você cria um Pod, o escalonador do Kubernetes seleciona um nó para que o
Pod rode. Cada nó possui uma capacidade máxima para cada um dos tipos de recurso:
a quantidade de CPU e memória que o nó pode fornecer aos Pods. O escalonador
garante que, para cada tipo de recurso, a soma dos requerimentos de recursos dos
contêineres agendados seja menor que a capacidade do nó.
Note que, embora o consumo de memória ou CPU real nos nós seja muito baixo, o
escalonador ainda irá se recusar a agendar um Pod em um nó se a verificação de
capacidade falhar. Isso protege contra a falta de um recurso em um nó quando o
consumo de recursos aumenta com o passar do tempo, como por exemplo durante o
pico diário de requisições a um serviço.

## Como o Kubernetes aplica requisições e limites de recursos {#how-pods-with-resource-limits-are-run}

Quando o kubelet inicia um contêiner como parte de um Pod, o kubelet envia as
requisições e limites de memória e de CPU ao agente de execução de contêiner.

No Linux, o agente de execução de contêiner normalmente configura os
{{< glossary_tooltip text="cgroups" term_id="cgroup" >}} que aplicam e garantem
os limites que você definiu.

- O limite de CPU determina um teto de quanto tempo de CPU o contêiner pode
  utilizar. A cada intervalo de agendamento, o núcleo do sistema operacional do
  Linux verifica se este limite foi excedido; se este for o caso, o núcleo
  aguarda antes de permitir que aquele cgroup continue sua execução.
- O requerimento de CPU normalmente define um método de balanceamento. Se vários
  contêineres diferentes (cgroups) querem rodar em um sistema disputado, cargas
  de trabalho com requerimentos maiores de CPU têm mais tempo de CPU alocado
  para si do que cargas de trabalho com pequenos requerimentos.
- O requerimento de memória é usado principalmente durante o agendamento de um
  Pod. Em um nó que utiliza cgroups v2, o agente de execução de contêiner pode
  utilizar o requerimento de memória como uma dica para definir valores para
  `memory.min` e `memory.low`.
- O limite de memória define um limite de memória para aquele cgroup. Se o
  contêiner tenta alocar mais memória que aquele limite, o subsistema
  _out-of-memory_ do núcleo do sistema operacional Linux é ativado e,
  normalmente, intervém encerrando um dos processos do contêiner que tentou
  alocar mais memória. Se o processo em questão for o PID 1 do contêiner, e o
  contêiner estiver marcado como reinicializável, então o Kubernetes irá
  reiniciar o contêiner.
- O limite de memória para um Pod ou contêiner é também aplicado a páginas em
  volumes armazenados em memória, como um `emptyDir`. O kubelet considera
  sistemas de arquivos `tmpfs` em volumes do tipo `emptyDir` como uso de memória
  em um contêiner, ao invés de armazenamento efêmero local.

Se um contêiner exceder seu requerimento de memória e o nó em que esse contêiner
está rodando ficar com pouca memória no total, é provável que o Pod a que este
contêiner pertence seja {{< glossary_tooltip text="removido" term_id="eviction" >}}.

A um contêiner pode ou não ser permitido exceder seu limite de CPU por períodos
de tempo estendidos. No entanto, agentes de execução de contêiner não encerram
Pods por uso excessivo de CPU.

A fim de determinar se um contêiner não pode ser agendado ou está sendo
encerrado devido a limites de recursos, consulte a seção de
[solução de problemas](#troubleshooting).

### Monitorando utilização de recursos computacionais e de memória

O kubelet relata a utilização de recursos de um Pod como parte do
[`status`](/docs/concepts/overview/working-with-objects/kubernetes-objects/#object-spec-and-status)
do Pod.

Se ferramentas opcionais para
[monitoramento de recursos](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
estiverem disponíveis em seu cluster, a utilização de recursos de um Pod pode
ser verificada diretamente através de
[API de métricas](/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#the-metrics-api)
ou através das suas ferramentas de monitoramento

## Armazenamento efêmero local

<!-- feature gate LocalStorageCapacityIsolation -->
{{< feature-state for_k8s_version="v1.10" state="beta" >}}

Nós possuem armazenamento efêmero local, através de dispositivos de escrita
conectados localmente ou através de RAM. "Efêmero" significa que não há garantia
de longo termo com relação a durabilidade.

Pods utilizam armazenamento local efêmero para dados temporários, cache e logs.
O kubelet pode fornecer armazenamento temporário a Pods que utilizam
armazenamento local efêmero para montar {{< glossary_tooltip term_id="volume" text="volumes" >}}
do tipo [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) em contêineres.

O kubelet também utiliza este tipo de armazenamento para
[logs de contêineres a nível de nó](/pt-br/docs/concepts/cluster-administration/logging/#logs-no-nível-do-nó),
imagens de contêiner e camadas graváveis de contêineres em execução.

{{< caution >}}
Se um nó falhar, os dados em seu armazenamento efêmero podem ser perdidos.
Suas aplicações não devem ter expectativas de cumprimento de SLAs de desempenho
(como quantidade de operações de entrada e saída de disco por segundo (IOPS),
por exemplo) pelo armazenamento local efêmero.
{{< /caution >}}

Com esta funcionalidade em fase beta, o Kubernetes permite que você rastreie,
reserve e limite quanto armazenamento local efêmero um Pod pode consumir.

### Configurações para armazenamento local efêmero {#configurations-for-local-ephemeral-storage}

O Kubernetes suporta duas formas de configuração para o armazenamento local
efêmero em um nó:

{{< tabs name="local_storage_configurations" >}}
{{% tab name="Sistema de arquivos único" %}}
Nesta configuração, você armazena todos os tipos diferentes de dados locais
efêmeros (volumes do tipo `emptyDir`, camadas graváveis, imagens de contêiner,
logs) em um sistema de arquivos único. A forma mais efetiva de configurar o
kubelet é dedicar este sistema de arquivos aos dados do Kubernetes (kubelet).

O kubelet também escreve
[logs de contêiner a nível de nó](/pt-br/docs/concepts/cluster-administration/logging/#logs-no-nível-do-nó)
e trata estes logs de maneira semelhante ao armazenamento efêmero local.

O kubelet escreve logs em arquivos dentro do seu diretório de log configurado
(`/var/log` por padrão) e possui um diretório base para outros dados armazenados
localmente (`/var/lib/kubelet` por padrão).

Normalmente, ambos os diretórios `/var/lib/kubelet` e `/var/log` encontram-se no
sistema de arquivos raiz, e o kubelet é projetado com este desenho em mente.

Seu nó pode ter tantos outros sistemas de arquivos não utilizados pelo Kubernetes
quantos você desejar.
{{% /tab %}}

{{% tab name="Dois sistemas de arquivos" %}}
Você tem um sistema de arquivos no nó que você utiliza para dados efêmeros que
vêm de Pods em execução: logs e volumes do tipo `emptyDir`. Você pode utilizar
este sistema de arquivos para outros dados (por exemplo, logs de sistema não
relacionados ao Kubernetes); este sistema de arquivos pode até mesmo ser o
sistema de arquivos raiz.

O kubelet também escreve
[logs de contêiner a nível de nó](/pt-br/docs/concepts/cluster-administration/logging/#logs-no-nível-do-nó)
no primeiro sistema de arquivos e os trata de forma semelhante ao armazenamento
local efêmero.

Você também tem um segundo sistema de arquivos, separado, conectado a um
dispositivo lógico de armazenamento distinto. Nesta configuração, o diretório
que você configurou o kubelet para armazenar as camadas de imagens de contêiner
e as camadas graváveis de contêineres em execução estará neste segundo sistema
de arquivos.

O primeiro sistema de arquivos não armazena nenhuma camada de imagens de
contêiner ou camada gravável.

Seu nó pode ter tantos outros sistemas de arquivos não utilizados pelo Kubernetes
quantos você desejar.
{{% /tab %}}
{{< /tabs >}}


O kubelet consegue medir quanto armazenamento local está sendo utilizado. O
kubelet faz isso desde que:

- o [_feature gate_](/docs/reference/command-line-tools-reference/feature-gates/)
  `LocalStorageCapacityIsolation` esteja habilitado (a funcionalidade está
  ligada por padrão), e
- você tenha configurado o nó utilizando uma das configurações suportadas para
  o armazenamento local efêmero.

Se você tiver uma configuração diferente, o kubelet não irá aplicar limites de
recursos para o armazenamento local efêmero.

{{< note >}}
O kubelet rastreia volumes `emptyDir` que utilizem o sistema de arquivos `tmpfs`
como uso de memória de contêiner, ao invés de consumo de armazenamento local
efêmero.
{{< /note >}}

### Configurando requerimentos e limites para armazenamento local efêmero

Você pode especificar o recurso `ephemeral-storage` para gerenciar o
armazenamento local efêmero. Cada contêiner de um Pod pode especificar um dos
valores abaixo, ou ambos:

* `spec.containers[].resources.limits.ephemeral-storage`
* `spec.containers[].resources.requests.ephemeral-storage`

Limites e requerimentos de `ephemeral-storage` são medidos em quantidades de
bytes. Você pode expressar armazenamento como um inteiro ou como um valor de
ponto fixo utilizando um dos seguintes sufixos: E, P, T, G, M, k. Você pode
também utilizar os equivalentes de potência de dois: Ei, Pi, Ti, Gi, Mi, Ki.
Por exemplo, as quantidades abaixo representam grosseiramente o mesmo valor:

- `128974848`
- `129e6`
- `129M`
- `123Mi`

No exemplo a seguir, o Pod tem dois contêineres. Cada contêiner tem um
requerimento de 2GiB de armazenamento efêmero local. Cada contêiner tem um
limite de 4GiB de armazenamento efêmero local. Portanto, o Pod tem um
requerimento de 4GiB e um limite de 8GiB de armazenamento efêmero local.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: frontend
spec:
  containers:
  - name: app
    image: images.my-company.example/app:v4
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  - name: log-aggregator
    image: images.my-company.example/log-aggregator:v6
    resources:
      requests:
        ephemeral-storage: "2Gi"
      limits:
        ephemeral-storage: "4Gi"
    volumeMounts:
    - name: ephemeral
      mountPath: "/tmp"
  volumes:
    - name: ephemeral
      emptyDir: {}
```

### Como Pods com requerimentos de `ephemeral-storage` são agendados

Quando você cria um Pod, o Kubernetes seleciona um nó para o Pod rodar. Cada nó
tem uma quantidade máxima de armazenamento efêmero local que pode ser fornecida
aos Pods. Para mais informações, consulte
[_Node Allocatable_](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable).

O escalonador garante que a soma dos requerimentos de recursos dos contêineres
agendados é menor que a capacidade do nó.

### Gerenciamento do consumo do armazenamento efêmero {#resource-emphemeralstorage-consumption}

Se o kubelet estiver gerenciando armazenamento local efêmero como um recurso,
o kubelet irá medir o consumo de armazenamento em:

- volumes `emptyDir`, com exceção dos volumes do tipo `tmpfs`
- diretórios que armazenem logs a nível de nó
- camadas de contêiner graváveis

Se um Pod estiver utilizando mais armazenamento efêmero do que o permitido, o
kubelet irá gerar um sinal de remoção para aquele Pod.

Para isolamento a nível de contêiner, se o consumo de armazenamento de um
contêiner em camadas graváveis e logs exceder seu limite de armazenamento, o
kubelet irá marcar o Pod para remoção.

Para isolamento a nível de Pod, o kubelet calcula um limite de armazenamento
total para um Pod somando os limites de cada contêiner naquele Pod. Neste caso,
se a soma do consumo de armazenamento efêmero local de todas os contêineres e
também dos volumes `emptyDir` de um Pod exceder o limite de armazenamento total
do Pod, então o kubelet marca o Pod para remoção.

{{< caution >}}
Se o kubelet não estiver medindo armazenamento efêmero local, um Pod que exeder
seu limite de armazenamento local não será removido por exceder os limites de
recurso de armazenamento local.

No entanto, se o espaço de um sistema de arquivos para camadas de contêiner
graváveis, logs a nível de nó, ou volumes `emptyDir` ficar reduzido, o nó irá
marcar a si próprio com um {{< glossary_tooltip text="_taint_" term_id="taint" >}}
indicando que está com armazenamento local reduzido, e esse _taint_ dispara a
remoção de Pods que não toleram o _taint_ em questão.

Veja as [configurações](#configurations-for-local-ephemeral-storage) suportadas
para armazenamento efêmero local.
{{< /caution >}}

O kubelet suporta formas diferentes de medir o uso de armazenamento dos Pods:

{{< tabs name="resource-emphemeralstorage-measurement" >}}
{{% tab name="Varredura periódica" %}}
O kubelet executa verificações agendadas, em intervalos regulares, que varrem
cada volume do tipo `emptyDir`, diretório de log de contêiner, e camada gravável
de contêiner.

A varredura mede quanto espaço está sendo utilizado.

{{< note >}}
Neste modo, o kubelet não rastreia descritores de arquivos abertos para arquivos
removidos.

Se você (ou um contêiner) criar um arquivo dentro de um volume `emptyDir`, um
processo ou usuário abrir tal arquivo, e você apagar o arquivo enquanto ele
ainda estiver aberto, o nó de índice para o arquivo apagado será mantido até que
o arquivo seja fechado novamente. O kubelet, no entanto, não computa este espaço
como espaço em uso.
{{< /note >}}

{{% /tab %}}
{{% tab name="Quota de projeto do sistema de arquivos" %}}

Quotas de projeto são uma funcionalidade a nível de sistema operacional para
gerenciamento de uso do armazenamento em sistemas de arquivos. Com o Kubernetes,
você pode habilitar quotas de projeto para o monitoramento de armazenamento em
uso. Tenha certeza que o sistema de arquivos do nó que esteja sendo utilizado em
volumes do tipo `emptyDir` possui suporte a quotas de projeto. Por exemplo,
os sistemas de arquivos XFS e ext4fs oferecem suporte a quotas de projeto.

{{< note >}}
Quotas de projeto permitem o monitoramento do uso de armazenamento, mas não
garantem limites.
{{< /note >}}

O Kubernetes utiliza IDs de projeto iniciando em `1048576`. Os IDs em uso estão
registrados nos diretórios `/etc/projects` e `/etc/projid`. Se os IDs de projeto
nestes intervalos forem utilizados para outros propósitos no sistema, estes IDs
de projeto deverão estar registrados nos diretórios especificados acima para que
o Kubernetes não os tente utilizar.

Quotas fornecem melhor desempenho e mais precisão do que varredura de diretórios.
Quando um diretório é atribuído a um projeto, todos os arquivos criados no
diretório são também criados no projeto, e o núcleo do sistema pode simplesmente
manter controle de quantos blocos estão em uso por arquivos daquele projeto. Se
um arquivo é criado e apagado, mas possui um descritor de arquivo aberto, ele
continua a consumir espaço. O rastreio de quotas registra este espaço de forma
precisa, enquanto varreduras de diretório ignoram o uso de espaço de
armazenamento por arquivos apagados.

Se você deseja utilizar quotas de projeto, você deve:

* Habilitar o [_feature gate_](/docs/reference/command-line-tools-reference/feature-gates/)
  `LocalStorageCapacityIsolationFSQuotaMonitoring=true` utilizando o campo
  `featureGates` na [configuração do kubelet](/docs/reference/config-api/kubelet-config.v1beta1/)
  ou a opção de linha de comando `--feature-gates`.

* Garantir que o sistema de arquivos raiz (ou o sistema de arquivos opcional de
  tempo de execução) tem quotas de projeto habilitadas. Todos os sistemas de
  arquivos XFS suportam quotas de projeto. Em sistemas de arquivos ext4, você
  precisa habilitar a funcionalidade de rastreio de quotas de projeto enquanto
  o sistema de arquivos ainda não está montado.

  ```bash
  # Para sistema de arquivos ext4, com o volume /dev/block-device não montado
  sudo tune2fs -O project -Q prjquota /dev/block-device
  ```

* Garanta que o sistema de arquivos raiz (ou sistema de arquivos opcional de
  tempo de execução) esteja montado com quotas de projeto habilitadas. Em ambos
  os sistemas XFS e ext4fs, a opção de montagem é chamada `prjquota`.

{{% /tab %}}
{{< /tabs >}}

## Recursos estendidos

Recursos estendidos são nomes de recursos absolutos fora do domínio
`kubernetes.io`. Estes recursos permitem a operadores de cluster anunciar e a
usuários consumir recursos que não são embutidos pelo Kubernetes.

Dois passos são necessários para a utilização de recursos estendidos.
Primeiramente, o operador do cluster deve anunciar um recurso estendido. Em
segundo lugar, os usuários devem solicitar o recurso estendido em Pods.

### Gerenciando recursos estendidos

#### Recursos estendidos a nível de nó

Recursos estendidos a nível de nó são recursos ligados ao nó.

##### Recursos gerenciados por dispositivos conectados

Veja [Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
para mais informações sobre como anunciar recursos gerenciados por dispositivos
conectados em cada nó.

##### Outros recursos

A fim de anunciar um novo recurso estendido a nível de nó, o operador do cluster
pode enviar uma requisição HTTP com o método `PATCH` para o servidor da API do
Kubernetes para especificar a quantidade disponível em um nó no cluster, através
do campo `status.capacity`. Após a realização desta operação, o campo
`status.capacity` do nó irá conter um novo recurso. O campo `status.allocatable`
é atualizado automaticamente pelo kubelet, de forma assíncrona, com o novo
recurso.

Como o escalonador utiliza o valor do campo `status.allocatable` do nó ao
verificar a saúde do Pod, o escalonador somente considerará o novo valor do
campo após esta atualização assíncrona. Pode haver um pequeno atraso entre a
atualização da capacidade do nó com um novo recurso e o momento em que o
primeiro Pod que requer o recurso poderá ser agendado naquele nó.

**Exemplo**:

Este exemplo demonstra como utilizar a ferramenta `curl` para criar uma
requisição HTTP que anuncia cinco recursos "example.com/foo" no nó `k8s-node-1`,
cujo nó da camada de gerenciamento é `k8s-master`.

```shell
curl --header "Content-Type: application/json-patch+json" \
  --request PATCH \
  --data '[{"op": "add", "path": "/status/capacity/example.com~1foo", "value": "5"}]' \
  http://k8s-master:8080/api/v1/nodes/k8s-node-1/status
```

{{< note >}}
Na requisição anterior, a notação `~1` é a codificação do caractere `/` no campo
`path` para a operação de atualização. O valor do campo `path` em JSON-Patch é
interpretado como um JSON-Pointer. Para maiores detalhes, veja
[a seção 3 da IETF RFC 6901](https://tools.ietf.org/html/rfc6901#section-3).
{{< /note >}}

#### Recursos estendidos a nível de cluster

Recursos estendidos a nível de cluster não são vinculados aos nós. Estes
recursos são normalmente gerenciados por extensões do escalonador, que manipulam
o consumo e as quotas de recursos.

Você pode especificar os recursos estendidos que são manipulados por extensões
do escalonador nas [configurações do kube-scheduler](/docs/reference/config-api/kube-scheduler-config.v1beta3/).

**Exemplo**:

A configuração abaixo para uma política do escalonador indica que o recurso
estendido a nível de cluster "example.com/foo" é manipulado pelas extensões do
escalonador.

- O escalonador envia um Pod para a extensão do escalonador somente se o Pod
    solicitar "example.com/foo".
- O campo `ignoredByScheduler` especifica que o escalonador não verifica o
    recurso "example.com/foo" em seu predicado `PodFitsResources`.

```json
{
  "kind": "Policy",
  "apiVersion": "v1",
  "extenders": [
    {
      "urlPrefix":"<extender-endpoint>",
      "bindVerb": "bind",
      "managedResources": [
        {
          "name": "example.com/foo",
          "ignoredByScheduler": true
        }
      ]
    }
  ]
}
```

### Consumindo recursos estendidos

Usuários podem consumir recursos estendidos em especificações de Pods como CPU
e memória. O escalonador controla a contagem de recursos de modo que a
quantidade alocada simultaneamente a Pods não seja maior que a quantidade
disponível.

O servidor da API limita as quantidades de recursos estendidos a números inteiros.
Exemplos de quantidades _válidas_ são `3`, `3000m` e `3Ki`. Exemplos de
quantidades _inválidas_ são `0.5` e `1500m`.

{{< note >}}
Recursos estendidos substituem os Recursos Inteiros Opacos.
Usuários podem escolher qualquer prefixo de nome de domínio, com exceção do
domínio `kubernetes.io`, que é reservado.
{{< /note >}}

Para consumir um recurso estendido em um Pod, inclua o nome do recurso como uma
chave no mapa `spec.containers[].resources.limits` na especificação do contêiner.

{{< note >}}
Recursos estendidos não podem ser superdimensionados. Portanto, `request` e
`limit` devem ser iguais se ambos estiverem presentes na especificação de um
contêiner.
{{< /note >}}

Um Pod só é agendado se todos os seus requerimentos de recursos forem
satisfeitos, incluindo CPU, memória e quaisquer recursos estendidos. O Pod
permanece no estado `PENDING` enquanto seus requerimentos de recursos não puderem
ser satisfeitos.

**Exemplo**:

O Pod abaixo requisita duas CPUs e um "example.com/foo" (um recurso estendido).

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  containers:
  - name: my-container
    image: myimage
    resources:
      requests:
        cpu: 2
        example.com/foo: 1
      limits:
        example.com/foo: 1
```

## Limitação de PID

Limites de ID de processo (PID) permitem à configuração de um kubelet limitar o
número de PIDs que um dado Pod pode consumir. Consulte
[PID Limiting](/docs/concepts/policy/pid-limiting/) para mais informações.

## Solução de problemas {#troubleshooting}

### Meus pods estão pendentes com um evento `FailedScheduling`

Se o escalonador não conseguir encontrar nenhum nó que atenda aos requisitos de
recursos do Pod, este Pod permanecerá não-agendado até que um local destino
possa ser encontrado. Um [Evento](/docs/reference/kubernetes-api/cluster-resources/event-v1/)
é produzido cada vez que o escalonador falhar em encontrar um local para agendar
o Pod. Você pode utilizar o utilitário `kubectl` para ver os eventos de um Pod.
Por exemplo:

```shell
kubectl describe pod frontend | grep -A 9999999999 Events
```
```
Events:
  Type     Reason            Age   From               Message
  ----     ------            ----  ----               -------
  Warning  FailedScheduling  23s   default-scheduler  0/42 nodes available: insufficient cpu
```

No exemplo acima, o Pod de nome "frontend" não pôde ser agendado devido à nenhum
nó possuir CPU suficiente para suprir seu requerimento de CPU. Mensagens de erro
semelhantes a essa podem sugerir falha devido a falta de memória
(`PodExceedsFreeMemory`). De maneira geral, se um Pod estiver pendente com uma
mensagem deste tipo, há diversas possibilidades de solução a serem tentadas:

- Adicione mais nós ao cluster.
- Encerre Pods desnecessários para liberar espaço para Pods pendentes.
- Verifique se o Pod não é maior que todos os nós. Por exemplo, se todos os nós
  têm uma capacidade de `cpu: 1`, um Pod que requisita `cpu: 1.1` nunca será
  agendado.
- Verifique se os nós não possuem _taints_. Se a maioria dos seus nós possuem
  _taints_, e o novo Pod não tolera tal _taint_, o escalonador somente considera
  agendar o Pod nos nós que não possuem aquele _taint_.

Você pode verificar capacidades de nós e quantidades alocadas com o comando
`kubectl describe nodes`. Por exemplo:

```shell
kubectl describe nodes e2e-test-node-pool-4lw4
```
```
Name:            e2e-test-node-pool-4lw4
[ ... linhas abreviadas para simplificação ...]
Capacity:
 cpu:                               2
 memory:                            7679792Ki
 pods:                              110
Allocatable:
 cpu:                               1800m
 memory:                            7474992Ki
 pods:                              110
[ ... linhas abreviadas para simplificação ...]
Non-terminated Pods:        (5 in total)
  Namespace    Name                                  CPU Requests  CPU Limits  Memory Requests  Memory Limits
  ---------    ----                                  ------------  ----------  ---------------  -------------
  kube-system  fluentd-gcp-v1.38-28bv1               100m (5%)     0 (0%)      200Mi (2%)       200Mi (2%)
  kube-system  kube-dns-3297075139-61lj3             260m (13%)    0 (0%)      100Mi (1%)       170Mi (2%)
  kube-system  kube-proxy-e2e-test-...               100m (5%)     0 (0%)      0 (0%)           0 (0%)
  kube-system  monitoring-influxdb-grafana-v4-z1m12  200m (10%)    200m (10%)  600Mi (8%)       600Mi (8%)
  kube-system  node-problem-detector-v0.1-fj7m3      20m (1%)      200m (10%)  20Mi (0%)        100Mi (1%)
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  CPU Requests    CPU Limits    Memory Requests    Memory Limits
  ------------    ----------    ---------------    -------------
  680m (34%)      400m (20%)    920Mi (11%)        1070Mi (13%)
```

No exemplo anterior, você pode verificar que se um Pod requisitar mais que 1,120
CPUs ou mais que 6,23Gi de memória, tal Pod não caberá neste nó.

Ao verificar a seção "Pods", você pode observar quais Pods estão consumindo
espaço neste nó.

A quantidade de recursos disponível aos Pods é menor que a capacidade do nó, pois
daemons do sistema utilizam uma parcela dos recursos disponíveis. Dentro da API
do Kubernetes, cada nó tem um campo `.status.allocatable`
(consulte [NodeStatus](/docs/reference/kubernetes-api/cluster-resources/node-v1/#NodeStatus)
para mais detalhes).

O campo `.status.allocatable` descreve a quantidade de recursos que está
disponível a Pods naquele nó (por exemplo: 15 CPUs virtuais e 7538 MiB de
memória). Para mais informações sobre recursos alocáveis do nó no Kubernetes,
veja [Reserve Compute Resources for System Daemons](/docs/tasks/administer-cluster/reserve-compute-resources/).

Você pode configurar [quotas de recursos](/docs/concepts/policy/resource-quotas/)
para limitar a quantidade total de recursos que um namespace pode consumir.
O Kubernetes garante quotas para objetos em um namespace específico quando há
uma `ResourceQuota` naquele namespace. Por exemplo, se você atribuir namespaces
específicos a times diferentes, você pode adicionar `ResourceQuota`s nestes
namespaces. Criar quotas de recursos ajuda a evitar que um time utilize tanto de
um recurso que chegue a afetar outros times utilizando o mesmo cluster.

Você deve também considerar o nível de acesso fornecido aos usuários de qualquer
namespace: acesso **completo** para escrita permite a alguém com este acesso
remover **qualquer** recurso, incluindo uma configuração de `ResourceQuota`.

### Meu contêiner foi terminado

Seu contêiner pode ser terminado se faltar recursos para que este rode. Para
verificar se um contêiner está sendo terminado por chegar no limite de algum
recurso, utilize o comando `kubectl describe pod` no Pod em questão:

```shell
kubectl describe pod simmemleak-hra99
```

A saída será semelhante a:
```
Name:                           simmemleak-hra99
Namespace:                      default
Image(s):                       saadali/simmemleak
Node:                           kubernetes-node-tf0f/10.240.216.66
Labels:                         name=simmemleak
Status:                         Running
Reason:
Message:
IP:                             10.244.2.75
Containers:
  simmemleak:
    Image:  saadali/simmemleak:latest
    Limits:
      cpu:          100m
      memory:       50Mi
    State:          Running
      Started:      Tue, 07 Jul 2019 12:54:41 -0700
    Last State:     Terminated
      Reason:       OOMKilled
      Exit Code:    137
      Started:      Fri, 07 Jul 2019 12:54:30 -0700
      Finished:     Fri, 07 Jul 2019 12:54:33 -0700
    Ready:          False
    Restart Count:  5
Conditions:
  Type      Status
  Ready     False
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  42s   default-scheduler  Successfully assigned simmemleak-hra99 to kubernetes-node-tf0f
  Normal  Pulled     41s   kubelet            Container image "saadali/simmemleak:latest" already present on machine
  Normal  Created    41s   kubelet            Created container simmemleak
  Normal  Started    40s   kubelet            Started container simmemleak
  Normal  Killing    32s   kubelet            Killing container with id ead3fb35-5cf5-44ed-9ae1-488115be66c6: Need to kill Pod
```

No exemplo acima, o campo `Restart Count:  5` indica que o contêiner `simmemleak`
deste Pod foi terminado e reiniciado cinco vezes até o momento. A razão
`OOMKilled` demonstra que o contêiner tentou consumir mais memória do que o seu
limite.

O próximo passo neste cenário seria vasculhar e depurar o código da aplicação,
procurando por vazamentos de memória. Se você determinar que a aplicação está se
comportando conforme o esperado, considere aumentar o limite (e possivelmente
o requerimento) de memória para aquele contêiner.

## {{% heading "whatsnext" %}}

* Pratique [a criação de requerimentos de recursos de memória em contêineres e Pods](/docs/tasks/configure-pod-container/assign-memory-resource/).
* Pratique [a criação de requerimentos de CPU em contêineres and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).
* Leia como a referência da API define um [contêiner](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)
  e seus [requerimentos de recursos](/docs/reference/kubernetes-api/workload-resources/pod-v1/#resources).
* Leia sobre [quotas de projeto](https://www.linux.org/docs/man8/xfs_quota.html) no XFS.
* Leia mais sobre a [referência de configuração do kube-scheduler (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/).

