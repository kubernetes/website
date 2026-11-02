---
title: Objetos da API de DRA
content_type: concept
weight: 10
api_metadata:
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceClaim"
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceClaimTemplate"
- apiVersion: "resource.k8s.io/v1"
  kind: "DeviceClass"
- apiVersion: "resource.k8s.io/v1"
  kind: "ResourceSlice"
---

<!-- overview -->

Esta página descreve os tipos da API do Kubernetes que a alocação dinâmica de
recursos (DRA) utiliza para categorizar, solicitar e alocar dispositivos.

<!-- body -->

## Terminologia de DRA {#terminology}

A DRA utiliza os seguintes tipos da API do Kubernetes para fornecer a
funcionalidade principal de alocação. Todos esses tipos da API estão incluídos no
{{< glossary_tooltip text="grupo de API" term_id="api-group" >}}
`resource.k8s.io/v1`.

DeviceClass
: Define uma categoria de dispositivos que podem ser requisitados e como selecionar
  atributos específicos de dispositivos nas requisições. Os parâmetros da DeviceClass
  podem corresponder a zero ou mais dispositivos em ResourceSlices. Para requisitar
  dispositivos de uma DeviceClass, as ResourceClaims selecionam atributos específicos
  de dispositivos.

ResourceClaim
: Descreve uma solicitação de acesso a recursos anexados, como
  dispositivos, no cluster. As ResourceClaims fornecem aos Pods acesso a
  um recurso específico. As ResourceClaims podem ser criadas por operadores de cargas
  de trabalho ou geradas pelo Kubernetes com base em um ResourceClaimTemplate.

ResourceClaimTemplate
: Define um modelo que o Kubernetes utiliza para criar ResourceClaims
  por Pod para uma carga de trabalho. Os ResourceClaimTemplates fornecem aos Pods
  acesso a recursos separados e semelhantes. Cada ResourceClaim que o Kubernetes
  gera a partir do modelo é vinculada a um Pod específico. Quando o Pod
  é encerrado, o Kubernetes exclui a ResourceClaim correspondente.

ResourceSlice
: Representa um ou mais recursos anexados aos nós, como dispositivos.
  Os drivers criam e gerenciam ResourceSlices no cluster. Quando uma ResourceClaim
  é criada e utilizada em um Pod, o Kubernetes utiliza ResourceSlices para encontrar
  nós que tenham acesso aos recursos requisitados. O Kubernetes aloca recursos para
  a ResourceClaim e faz a alocação do Pod em um nó que possa acessar os
  recursos.

### DeviceClass {#deviceclass}

Uma DeviceClass permite que administradores do cluster ou drivers de dispositivos
definam categorias de dispositivos no cluster. As DeviceClasses informam aos
operadores quais dispositivos eles podem solicitar e como podem solicitar esses
dispositivos. Você pode utilizar a
[common expression language (CEL)](https://cel.dev) para selecionar dispositivos
com base em atributos específicos. Uma ResourceClaim que referencia a DeviceClass
pode então solicitar configurações específicas dentro da DeviceClass.

Para criar uma DeviceClass, consulte
[Configurar a DRA em um Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster).

### ResourceClaims e ResourceClaimTemplates {#resourceclaims-templates}

Uma ResourceClaim define os recursos de que uma carga de trabalho precisa. Toda
ResourceClaim possui _solicitações_ que referenciam uma DeviceClass e selecionam
dispositivos dessa DeviceClass. As ResourceClaims também podem utilizar _seletores_
para filtrar dispositivos que atendam a requisitos específicos e podem utilizar
_restrições_ para limitar os dispositivos que podem satisfazer uma solicitação. As
ResourceClaims podem ser criadas por operadores de cargas de trabalho ou podem ser
geradas pelo Kubernetes com base em um ResourceClaimTemplate. Um
ResourceClaimTemplate define um modelo que o Kubernetes pode utilizar para gerar
ResourceClaims automaticamente para Pods.

#### Casos de uso para ResourceClaims e ResourceClaimTemplates {#when-to-use-rc-rct}

O método que você utiliza depende dos seus requisitos, conforme a seguir:

* **ResourceClaim**: você deseja que vários Pods compartilhem o acesso a
  dispositivos específicos. Você gerencia manualmente o ciclo de vida das
  ResourceClaims que cria.
* **ResourceClaimTemplate**: você deseja que os Pods tenham acesso independente a
  dispositivos separados e configurados de forma semelhante. O Kubernetes gera
  ResourceClaims a partir da especificação no ResourceClaimTemplate. O tempo de vida
  de cada ResourceClaim gerada está vinculado ao tempo de vida do Pod correspondente.
* [**ResourceClaimTemplate de PodGroup**](#workload-resource-claims): você deseja que
  {{< glossary_tooltip text="PodGroups" term_id="podgroup" >}} tenham
  acesso independente a dispositivos separados e configurados de forma semelhante,
  que possam ser compartilhados por seus Pods. O Kubernetes gera uma ResourceClaim
  para o PodGroup a partir da especificação no ResourceClaimTemplate. O tempo de
  vida de cada ResourceClaim gerada está vinculado ao tempo de vida do PodGroup
  correspondente. Isso requer que a funcionalidade
  [`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
  esteja habilitada.

Ao definir uma carga de trabalho, você pode utilizar a
{{< glossary_tooltip term_id="cel" text="Common Expression Language (CEL)" >}}
para filtrar atributos ou capacidades específicas de dispositivos. Os parâmetros
disponíveis para filtragem dependem do dispositivo e dos drivers.

Se você referenciar diretamente uma ResourceClaim específica em um Pod, essa
ResourceClaim já deve existir no mesmo namespace que o Pod. Se a ResourceClaim
não existir no namespace, o Pod não será alocado. Esse comportamento é semelhante
à forma como uma PersistentVolumeClaim deve existir no mesmo namespace que um Pod
que a referencia.

Você pode referenciar uma ResourceClaim gerada automaticamente em um Pod, mas isso
não é recomendado, porque ResourceClaims geradas automaticamente estão vinculadas
ao tempo de vida do Pod ou do PodGroup que acionou a geração.

Para saber como requisitar recursos utilizando um desses métodos, consulte
[Alocar Dispositivos para Cargas de Trabalho com DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra/).

#### Lista priorizada {#prioritized-list}

{{< feature-state feature_gate_name="DRAPrioritizedList" >}}

Você pode fornecer uma lista priorizada de subsolicitações para as solicitações em
uma ResourceClaim ou em um ResourceClaimTemplate. O escalonador então selecionará a
primeira subsolicitação que puder ser alocada. Isso permite que os usuários
especifiquem dispositivos alternativos que podem ser utilizados pela carga de
trabalho caso a escolha principal não esteja disponível.

No exemplo abaixo, o ResourceClaimTemplate solicitou um dispositivo com a cor preta
e o tamanho grande. Se um dispositivo com esses atributos não estiver disponível, o
Pod não poderá ser alocado. Com a funcionalidade de lista priorizada, uma segunda
alternativa pode ser especificada, que solicita dois dispositivos com a cor branca
e o tamanho pequeno. O dispositivo grande e preto será alocado se estiver
disponível. Caso não esteja, mas dois dispositivos pequenos e brancos estejam
disponíveis, o Pod ainda poderá ser executado.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: prioritized-list-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        firstAvailable:
        - name: large-black
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "black" &&
                device.attributes["resource-driver.example.com"].size == "large"
        - name: small-white
          deviceClassName: resource.example.com
          selectors:
          - cel:
              expression: |-
                device.attributes["resource-driver.example.com"].color == "white" &&
                device.attributes["resource-driver.example.com"].size == "small"
          count: 2
```

Se o Pod for elegível para vários nós no cluster, o escalonador utilizará o índice
das subsolicitações escolhidas de quaisquer listas priorizadas como uma das entradas
ao pontuar cada nó. Assim, nós que podem alocar dispositivos solicitados em uma
subsolicitação de classificação mais alta têm maior probabilidade de serem
escolhidos do que nós que só podem alocar dispositivos para subsolicitações de
classificação mais baixa.

A decisão é tomada por Pod, portanto, se o Pod for membro de um ReplicaSet ou de
um agrupamento semelhante, você não pode presumir que todos os membros do grupo
terão a mesma subsolicitação escolhida. Sua carga de trabalho deve ser capaz de
acomodar isso.

#### ResourceClaims de carga de trabalho {#workload-resource-claims}

{{< feature-state feature_gate_name="DRAWorkloadResourceClaims" >}}

Ao organizar Pods com a
[API Workload](/docs/concepts/workloads/workload-api/),
você pode reservar ResourceClaims para
{{< glossary_tooltip text="PodGroups" term_id="podgroup" >}}
inteiros em vez de Pods individuais e gerar ResourceClaimTemplates para um
PodGroup em vez de um único Pod, permitindo que os Pods dentro de um PodGroup
compartilhem o acesso aos dispositivos alocados para a ResourceClaim gerada.

Essa funcionalidade aborda dois problemas:

- A lista `status.reservedFor` da API ResourceClaim pode conter apenas 256 itens.
  Como o kube-scheduler registra apenas Pods individuais nessa lista, somente 256
  Pods podem compartilhar uma ResourceClaim. Ao permitir que PodGroups sejam
  registrados em `status.reservedFor`, muito mais do que 256 Pods podem compartilhar
  uma ResourceClaim.
- Os Pods só podem compartilhar uma ResourceClaim quando seu nome exato é conhecido.
  Para cargas de trabalho complexas que replicam _grupos_ de Pods, as ResourceClaims
  compartilhadas pelos Pods em cada grupo precisam ser criadas e excluídas
  explicitamente quando o conjunto de grupos passa por escalonamento para cima ou
  para baixo. Ao gerar ResourceClaims para cada PodGroup, um único
  ResourceClaimTemplate pode servir de base para ResourceClaims que são tanto
  replicadas automaticamente quanto compartilháveis entre os Pods de um PodGroup.

A API PodGroup define um campo `spec.resourceClaims` com a mesma estrutura
e significado semelhante ao do campo `spec.resourceClaims` na API Pod:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

Assim como as requisições feitas por Pods, as requisições de PodGroups que definem
um `resourceClaimName` referenciam uma ResourceClaim pelo nome. Requisições que
definem um `resourceClaimTemplateName` referenciam um ResourceClaimTemplate que é
replicado em uma única ResourceClaim para todo o PodGroup, que pode ser
compartilhada entre seus Pods.

Quando um Pod define uma requisição com `name`, `resourceClaimName` e
`resourceClaimTemplateName` que correspondem a uma das `spec.resourceClaims` do
seu PodGroup, o kube-scheduler reserva a ResourceClaim para o PodGroup em vez do
Pod. Se a requisição do Pod não corresponder a uma feita pelo seu PodGroup, o
kube-scheduler reserva a ResourceClaim para o Pod. Em ambos os casos, a reserva é
registrada em `status.reservedFor` da ResourceClaim. As reservas de PodGroup e a
alocação de recursos correspondente persistem na ResourceClaim até que o PodGroup
seja excluído, mesmo que o grupo não tenha mais nenhum Pod.

Quando uma requisição de Pod que corresponde a uma requisição de PodGroup define um
`resourceClaimTemplateName`, uma ResourceClaim é gerada para o PodGroup. Outros
Pods no grupo que definem a mesma requisição compartilharão essa ResourceClaim
gerada, em vez de acionar a geração de uma nova ResourceClaim para cada Pod.
Independentemente de uma requisição `resourceClaimTemplateName` corresponder ou não
a uma requisição de PodGroup, o nome da ResourceClaim gerada é registrado em
`status.resourceClaimStatuses` do Pod.

Uma requisição de PodGroup correspondente para um ResourceClaimTemplate só aciona a
criação de uma ResourceClaim quando a funcionalidade
[`DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
está habilitada. Em vez de criar ResourceClaims por Pod quando a funcionalidade
está desabilitada, nenhuma ResourceClaim é criada, para evitar a criação de
ResourceClaims por Pod indevidas durante atualizações do cluster ou durante a
implantação/reversão da funcionalidade entre o `kube-apiserver` e o
`kube-controller-manager`.

As ResourceClaims geradas a partir de um ResourceClaimTemplate para um
PodGroup seguem o ciclo de vida do PodGroup. A ResourceClaim é criada pela
primeira vez quando tanto o PodGroup quanto seu ResourceClaimTemplate existem. A
ResourceClaim é excluída depois que o PodGroup é excluído e a ResourceClaim não
está mais reservada.

Considere o exemplo a seguir:

```yaml
apiVersion: scheduling.k8s.io/v1beta1
kind: PodGroup
metadata:
  name: training-group
  namespace: some-ns
spec:
  ...
  resourceClaims:
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
---
apiVersion: v1
kind: Pod
metadata:
  name: training-group-pod-1
  namespace: some-ns
spec:
  ...
  schedulingGroup:
    podGroupName: training-group
  resourceClaims:
  - name: pod-claim
    resourceClaimName: my-pod-claim
  - name: pod-claim-template
    resourceClaimTemplateName: my-pod-template
  - name: pg-claim
    resourceClaimName: my-pg-claim
  - name: pg-claim-template
    resourceClaimTemplateName: my-pg-template
```

Neste exemplo, o PodGroup `training-group` possui um Pod chamado `training-group-pod-1`.
As requisições `pod-claim` e `pod-claim-template` do Pod não correspondem a
nenhuma requisição feita pelo PodGroup, portanto essas requisições não são afetadas
pelo PodGroup: a ResourceClaim `my-pod-claim` fica reservada para o Pod e uma
ResourceClaim é gerada a partir do ResourceClaimTemplate `my-pod-template` e também
fica reservada para o Pod. As requisições `pg-claim` e `pg-claim-template`
correspondem a requisições feitas pelo PodGroup. A ResourceClaim `my-pg-claim` fica
reservada para o PodGroup e uma ResourceClaim é gerada a partir do
ResourceClaimTemplate `my-pg-template` e também fica reservada para o PodGroup.

A associação de ResourceClaims a recursos da API Workload é controlada pelo
[feature gate `DRAWorkloadResourceClaims`](/docs/reference/command-line-tools-reference/feature-gates/#DRAWorkloadResourceClaims)
no `kube-apiserver`, no `kube-controller-manager`, no `kube-scheduler` e no `kubelet`.

### ResourceSlice {#resourceslice}

Cada ResourceSlice representa um ou mais
{{< glossary_tooltip term_id="device" text="dispositivos" >}} em um pool. O pool é
gerenciado por um driver de dispositivo, que cria e gerencia ResourceSlices. Os
recursos em um pool podem ser representados por um único ResourceSlice ou se
estender por vários ResourceSlices.

Os ResourceSlices fornecem informações úteis aos usuários de dispositivos e ao
escalonador, e são essenciais para a alocação dinâmica de recursos. Todo
ResourceSlice deve incluir as seguintes informações:

* **Pool de recursos**: um grupo de um ou mais recursos que o driver gerencia.
  O pool pode se estender por mais de um ResourceSlice. Alterações nos recursos de
  um pool devem ser propagadas por todos os ResourceSlices desse pool. O driver de
  dispositivo que gerencia o pool é responsável por garantir que essa propagação
  aconteça.
* **Dispositivos**: dispositivos no pool gerenciado. Um ResourceSlice pode listar
  todos os dispositivos de um pool ou um subconjunto dos dispositivos de um pool. O
  ResourceSlice define informações do dispositivo, como atributos, versões e
  capacidade. Os usuários de dispositivos podem selecionar dispositivos para alocação
  filtrando pelas informações do dispositivo em ResourceClaims ou em DeviceClasses.
* **Nós**: os nós que podem acessar os recursos. Os drivers podem escolher quais
  nós podem acessar os recursos, sejam todos os nós do cluster, um único nó
  nomeado ou nós que possuam labels de nó específicos.

Os drivers utilizam um {{< glossary_tooltip text="controlador" term_id="controller" >}}
para reconciliar os ResourceSlices no cluster com as informações que o driver
precisa publicar. Esse controlador sobrescreve quaisquer alterações manuais, como
usuários do cluster criando ou modificando ResourceSlices.

Considere o seguinte exemplo de ResourceSlice:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceSlice
metadata:
  name: cat-slice
spec:
  driver: "resource-driver.example.com"
  pool:
    generation: 1
    name: "black-cat-pool"
    resourceSliceCount: 1
  # O campo allNodes define se qualquer nó do cluster pode acessar o dispositivo.
  allNodes: true
  devices:
  - name: "large-black-cat"
    attributes:
      color:
        string: "black"
      size:
        string: "large"
      cat:
        bool: true
```
Este ResourceSlice é gerenciado pelo driver `resource-driver.example.com` no pool
`black-cat-pool`. O campo `allNodes: true` indica que qualquer nó do cluster pode
acessar os dispositivos. Há um dispositivo no ResourceSlice, chamado
`large-black-cat`, com os seguintes atributos:

* `color`: `black`
* `size`: `large`
* `cat`: `true`

Uma DeviceClass poderia selecionar este ResourceSlice utilizando esses atributos, e
uma ResourceClaim poderia filtrar dispositivos específicos nessa DeviceClass.

#### Nomenclatura e priorização {#resourceslice-naming-and-prioritization}

A ordem na qual o escalonador do Kubernetes avalia os dispositivos para alocação é
determinada pela ordenação lexicográfica dos nomes de ResourceSlices e de pools de
recursos. O escalonador utiliza uma estratégia de primeiro ajuste (_first-fit_), o
que significa que ele seleciona o primeiro dispositivo disponível que satisfaça os
requisitos da requisição.

Isso permite que a prioridade da alocação de recursos seja influenciada pelos nomes
atribuídos aos pools e aos ResourceSlices. Observe que pools sem
[condições de vinculação](/docs/concepts/resource-management/dynamic-resource-allocation/how-dra-works/#device-binding-conditions)
são sempre avaliados antes daqueles
com condições de vinculação, independentemente de seus nomes.

Para drivers construídos utilizando o pacote Go `k8s.io/dynamic-resources/kubeletplugin`
ou o controlador de ResourceSlice desse módulo, esses componentes tratam
automaticamente a nomenclatura dos ResourceSlices para garantir que sejam avaliados
na ordem especificada pelo driver.

## Acesso administrativo {#admin-access}

{{< feature-state feature_gate_name="DRAAdminAccess" >}}

Você pode marcar uma solicitação em uma ResourceClaim ou em um ResourceClaimTemplate
como tendo funcionalidades privilegiadas para tarefas de manutenção e de solução de
problemas. Uma solicitação com acesso administrativo concede acesso a dispositivos
em uso e pode habilitar permissões adicionais ao disponibilizar o dispositivo em um
contêiner:

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaimTemplate
metadata:
  name: large-black-cat-claim-template
spec:
  spec:
    devices:
      requests:
      - name: req-0
        exactly:
          deviceClassName: resource.example.com
          allocationMode: All
          adminAccess: true
```

O acesso administrativo é um modo privilegiado e não deve ser concedido a usuários
comuns em clusters multi-inquilino. Somente usuários autorizados a
criar objetos ResourceClaim ou ResourceClaimTemplate em namespaces com o label
`resource.kubernetes.io/admin-access: "true"` (diferencia maiúsculas de minúsculas)
podem utilizar o campo `adminAccess`. Isso garante que usuários não administradores
não possam fazer uso indevido da funcionalidade.

O acesso administrativo é controlado pelo
[feature gate `DRAAdminAccess`](/docs/reference/command-line-tools-reference/feature-gates/#DRAAdminAccess)
no `kube-apiserver`, no `kube-scheduler` e no `kubelet`.


## Atributos do tipo lista {#list-type-attributes}

{{< feature-state feature_gate_name="DRAListTypeAttributes" >}}

Esta funcionalidade aprimora a API ResourceSlice, permitindo que drivers de DRA especifiquem valores de lista para atributos de dispositivos, em vez de apenas valores escalares.
Isso é útil para modelar topologias internas de nós mais complexas, por exemplo, quando uma CPU tem adjacência a várias raízes PCIe.

Para os autores de ResourceClaims (usuários finais), isso significa que `matchAttribute` e `distinctAttribute` funcionam melhor nesses casos.

- `matchAttribute` — os dois atributos devem ter uma *interseção de listas não vazia*, em vez de serem idênticos (valores escalares são tratados como listas de um único item).
  Isso significa simplesmente que, se um driver publicar um único valor para, digamos, a raiz PCIe, e outro driver publicar uma lista, a restrição é atendida desde que
  o valor único apareça em algum lugar da lista.
- `distinctAttribute` — os valores dos atributos devem ser *disjuntos dois a dois* (nenhum valor compartilhado entre quaisquer dois dispositivos)

Para ajudar os autores de ResourceClaims a utilizar atributos que podem ser listas dentro de expressões CEL, esta funcionalidade também introduz uma função CEL `includes()`.

```
# Atributo escalar (retrocompatível)
# suponha: device.attributes["dra.example.com"].model = "model-a"
device.attributes["dra.example.com"].model.includes("model-a")  # true
device.attributes["dra.example.com"].model.includes("model-b")  # false

# Atributo do tipo lista (requer DRAListTypeAttributes)
# suponha: device.attributes["dra.example.com"].supported-models= ["model-a", "model-b"]
device.attributes["dra.example.com"].supported-models.includes("model-a")  # true
device.attributes["dra.example.com"].supported-models.includes("model-c")  # false
```

### Detalhes para autores de drivers de DRA

Por padrão, cada `DeviceAttribute` contém exatamente um valor escalar: um booleano, um inteiro,
uma string ou uma string de versão semântica. O feature gate `DRAListTypeAttributes` estende
o `DeviceAttribute` com quatro campos do tipo lista, permitindo que um dispositivo anuncie vários
valores para um único atributo:

- **`bools`** — uma lista de valores booleanos
- **`ints`** — uma lista de valores inteiros de 64 bits
- **`strings`** — uma lista de strings (cada uma com no máximo 64 caracteres)
- **`versions`** — uma lista de strings de versão semântica conforme a especificação 2.0.0 de semver.org
  (cada uma com no máximo 64 caracteres)

O número total de valores individuais de atributos por dispositivo (campos escalares mais todos os
elementos de listas combinados) é limitado a **48**. Quando qualquer dispositivo em um ResourceSlice utiliza esta funcionalidade ou outras funcionalidades avançadas, como taints,
o ResourceSlice será limitado a no máximo **64** dispositivos.

Aqui está um exemplo de um dispositivo anunciando vários modelos suportados utilizando um atributo
do tipo lista de strings:

```yaml
kind: ResourceSlice
apiVersion: resource.k8s.io/v1
metadata:
  name: example-resourceslice
spec:
  nodeName: worker-1
  pool:
    name: pool
    generation: 1
    resourceSliceCount: 1
  driver: dra.example.com
  devices:
  - name: gpu-0
    attributes:
      dra.example.com/supported-models:
        strings:
        - model-a
        - model-b
```

Os atributos do tipo lista são controlados pelo
[feature gate `DRAListTypeAttributes`](/docs/reference/command-line-tools-reference/feature-gates/#DRAListTypeAttributes)
no `kube-apiserver` e no `kube-scheduler`.

## Atributos derivados {#derived-attributes}

{{< feature-state feature_gate_name="DRADerivedAttributes" >}}

As restrições `matchAttribute` e `distinctAttribute` normalmente exigem que os
dispositivos publiquem atributos exatamente com o mesmo nome. Se um driver de GPU
publicar `pcie_locality` e um driver de NIC publicar `pcie_root` (ou incorporar
a mesma informação em uma string como `numa0-pcie1`), o escalonador não tem
como reconhecer que esses atributos representam a mesma coisa, portanto os
dispositivos dos dois drivers não podem ser colocalizados sem que antes se chegue a
um acordo sobre um nome de atributo compartilhado.

O `derivedAttributes` permite que você resolva essa lacuna diretamente na
requisição, sem esperar que os drivers padronizem nomes de atributos compartilhados.
Adicione uma ou mais entradas `derivedAttributes` a uma solicitação, em
`.spec.devices.requests[].exactly` ou
`.spec.devices.requests[].firstAvailable[]`. Cada entrada define uma expressão
CEL que o escalonador avalia em relação a cada dispositivo candidato para
essa solicitação. O resultado se torna um atributo virtual que pode ser referenciado
a partir de uma restrição `matchAttribute` ou `distinctAttribute` exatamente como um
atributo de dispositivo fornecido pelo driver.

```yaml
apiVersion: resource.k8s.io/v1
kind: ResourceClaim
metadata:
  name: gpu-nic-numa-alignment
spec:
  devices:
    requests:
    - name: gpu
      exactly:
        deviceClassName: gpu.example.com
        count: 1
        derivedAttributes:
        - name: derived/numa
          expression: device.attributes["gpu.example.com"].numa
    - name: nic
      exactly:
        deviceClassName: nic.example.com
        count: 1
        derivedAttributes:
        - name: derived/numa
          expression: device.attributes["nic.example.com"].numaNode
    constraints:
    - requests: ["gpu", "nic"]
      matchAttribute: derived/numa
```

Neste exemplo, os drivers `gpu` e `nic` publicam informações de topologia
sob nomes de atributos diferentes (`numa` e `numaNode`). Cada solicitação
calcula um valor comum `derived/numa` a partir dos atributos do seu próprio
dispositivo, e a restrição `matchAttribute` alinha as duas solicitações com base
nesse atributo virtual, mesmo que os drivers subjacentes nunca tenham acordado um
nome de atributo compartilhado.

Algumas coisas que você deve saber sobre `derivedAttributes`:

- **Nomenclatura**: `name` deve ser um subdomínio DNS seguido de uma `/` e de um
  identificador C, o mesmo formato utilizado para nomes de atributos fornecidos por
  drivers (por exemplo, `example.com/numaNode` ou `derived/numaNode`). Se o nome
  corresponder a um atributo fornecido pelo driver e já publicado por ele,
  o valor do atributo derivado se sobrepõe ao fornecido pelo driver para
  a correspondência de restrições. Utilize um prefixo de domínio que nenhum driver
  utilizaria, como `derived/`, se quiser evitar uma sobreposição não intencional.
  Você pode definir até 32 atributos derivados por solicitação.
- **Devem ser utilizados por uma restrição**: todo atributo derivado deve ser
  referenciado por pelo menos uma restrição `matchAttribute` ou `distinctAttribute`
  que se aplique à solicitação (ou subsolicitação) que o define.
  Caso contrário, a ResourceClaim falha na validação.
- **Escopo e ordem de avaliação**: `expression` é avaliada uma vez por
  dispositivo candidato, depois que os próprios seletores CEL da solicitação
  (`.selectors[].cel`) já filtraram esse dispositivo. Como resultado,
  atributos derivados não podem ser referenciados a partir de expressões de seletores
  e não são expostos por meio de `device.attributes` no ambiente CEL.
- **Tipo de retorno**: `expression` deve resultar em um valor escalar (`string`,
  `int`, `bool` ou uma versão semântica) ou, quando o feature gate
  `DRAListTypeAttributes` também estiver habilitado, em uma lista de um desses tipos
  escalares.
- **Limites de custo**: cada expressão possui um comprimento máximo e um limite para
  seu custo estimado de avaliação CEL. Além disso, o custo estimado combinado
  de todas as expressões `derivedAttributes` em uma ResourceClaim também é limitado,
  para restringir a sobrecarga total adicionada a uma única tentativa de alocação. A
  ResourceClaim é rejeitada se qualquer um desses limites for excedido.
- **Erros em tempo de execução interrompem a alocação**: se a avaliação de uma
  expressão falhar para um dispositivo candidato, por exemplo, porque ela referencia
  um atributo que o dispositivo não possui, o escalonador interrompe a alocação e o
  Pod não é alocado, em vez de ignorar silenciosamente esse dispositivo. Escreva
  expressões de forma defensiva, por exemplo, verificando se um atributo existe antes
  de lê-lo.

Os atributos derivados são controlados pelo
[feature gate `DRADerivedAttributes`](/docs/reference/command-line-tools-reference/feature-gates/#DRADerivedAttributes)
no `kube-apiserver` e no `kube-scheduler`.

Para obter uma lista de atributos de dispositivo padrão que os drivers de DRA podem
publicar, consulte a referência
[Atributos de Dispositivo Padrão](/docs/reference/node/dra-standard-device-attributes/).

## Alocação de recursos estendidos por DRA {#extended-resource}

{{< feature-state feature_gate_name="DRAExtendedResource" >}}

Você pode fornecer um nome de recurso estendido para uma DeviceClass. O escalonador
então selecionará os dispositivos correspondentes à classe para as solicitações de
recursos estendidos. Isso permite que os usuários continuem utilizando solicitações
de recursos estendidos em um Pod para solicitar recursos estendidos fornecidos por
um plugin de dispositivo ou dispositivos de DRA.
O mesmo recurso estendido pode ser fornecido por um plugin de dispositivo ou por DRA em um único nó do cluster.
O mesmo recurso estendido pode ser fornecido por um plugin de dispositivo em alguns nós e por DRA em outros nós do mesmo cluster.

No exemplo abaixo, a DeviceClass recebe o extendedResourceName `example.com/gpu`.
Se um Pod solicitar o recurso estendido `example.com/gpu: 2`, ele poderá ser alocado
em um nó com dois ou mais dispositivos correspondentes à DeviceClass.

```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceClass
metadata:
  name: gpu.example.com
spec:
  selectors:
  - cel:
      expression: device.driver == 'gpu.example.com' && device.attributes['gpu.example.com'].type
        == 'gpu'
  extendedResourceName: example.com/gpu
```

Além disso, os usuários podem utilizar um recurso estendido especial para alocar
dispositivos sem precisar criar explicitamente uma ResourceClaim, utilizando o
prefixo de nome de recurso estendido `deviceclass.resource.kubernetes.io/` e o nome
da DeviceClass. Isso funciona para qualquer DeviceClass, mesmo que ela não
especifique um nome de recurso estendido. A ResourceClaim resultante conterá uma
solicitação do tipo `ExactCount` para o número especificado de dispositivos dessa
DeviceClass.

A alocação de recursos estendidos por DRA é controlada pelo
[feature gate `DRAExtendedResource`](/docs/reference/command-line-tools-reference/feature-gates/#DRAExtendedResource)
no `kube-apiserver`, no `kube-scheduler`, no `kube-controller-manager` e no `kubelet`.

Para um passo a passo prático sobre como solicitar recursos estendidos, consulte
[Atribuir Recursos Estendidos a um Contêiner](/docs/tasks/configure-pod-container/extended-resource/).
