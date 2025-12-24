---
title: Atribuindo Pods a Nós
content_type: concept
weight: 20
---

<!-- overview -->

Você pode restringir um {{< glossary_tooltip text="Pod" term_id="pod" >}} para que ele seja
_limitado_ a executar em {{< glossary_tooltip text="nó(s)" term_id="node" >}} específicos,
ou para _preferir_ executar em nós específicos.
Existem várias maneiras de fazer isso e as abordagens recomendadas utilizam
[seletores de rótulos](/docs/concepts/overview/working-with-objects/labels/) para facilitar a seleção.
Frequentemente, você não precisa definir nenhuma dessas restrições; o
{{< glossary_tooltip text="escalonador" term_id="kube-scheduler" >}} fará automaticamente uma alocação adequada
(por exemplo, distribuindo seus Pods entre os nós para não alocá-los em um nó com recursos livres insuficientes).
No entanto, existem algumas circunstâncias em que você pode querer controlar em qual nó
o Pod será implantado, por exemplo, para garantir que um Pod seja alocado em um nó com um SSD conectado,
ou para co-localizar Pods de dois serviços diferentes que se comunicam frequentemente na mesma zona de disponibilidade.

<!-- body -->

Você pode usar qualquer um dos seguintes métodos para escolher onde o Kubernetes aloca
Pods específicos:

- Campo [nodeSelector](#nodeselector) correspondendo a [rótulos de nós](#built-in-node-labels)
- [Afinidade e antiafinidade](#affinity-and-anti-affinity)
- Campo [nodeName](#nodename)
- [Restrições de distribuição de topologia de Pod](#pod-topology-spread-constraints)

## Rótulos de nós {#built-in-node-labels}

Assim como muitos outros objetos do Kubernetes, os nós possuem
[rótulos](/docs/concepts/overview/working-with-objects/labels/). Você pode
[anexar rótulos manualmente](/docs/tasks/configure-pod-container/assign-pods-nodes/#add-a-label-to-a-node).
O Kubernetes também preenche um [conjunto padrão de rótulos](/docs/reference/node/node-labels/)
em todos os nós de um cluster.

{{<note>}}
O valor desses rótulos é específico do provedor de nuvem e não é garantido que seja confiável.
Por exemplo, o valor de `kubernetes.io/hostname` pode ser o mesmo que o nome do nó em alguns ambientes
e um valor diferente em outros ambientes.
{{</note>}}

### Isolamento/restrição de nós

Adicionar rótulos aos nós permite direcionar Pods para alocação em nós
ou grupos de nós específicos. Você pode usar essa funcionalidade para garantir que Pods
específicos executem apenas em nós com determinadas propriedades de isolamento,
segurança ou conformidade regulatória.

Se você usar rótulos para isolamento de nós, escolha chaves de rótulos que o {{<glossary_tooltip text="kubelet" term_id="kubelet">}}
não possa modificar. Isso impede que um nó comprometido defina esses rótulos
em si mesmo, evitando que o escalonador aloque cargas de trabalho no nó comprometido.

O [plugin de admissão `NodeRestriction`](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
impede que o kubelet defina ou modifique rótulos com o
prefixo `node-restriction.kubernetes.io/`.

Para utilizar esse prefixo de rótulo para isolamento de nós:

1. Certifique-se de estar usando o [autorizador Node](/docs/reference/access-authn-authz/node/) e ter _habilitado_ o plugin de admissão `NodeRestriction`.
2. Adicione rótulos com o prefixo `node-restriction.kubernetes.io/` aos seus nós e use esses rótulos em seus [seletores de nós](#nodeselector).
   Por exemplo, `example.com.node-restriction.kubernetes.io/fips=true` ou `example.com.node-restriction.kubernetes.io/pci-dss=true`.

## nodeSelector

`nodeSelector` é a forma recomendada mais simples de restrição de seleção de nós.
Você pode adicionar o campo `nodeSelector` à especificação do seu Pod e especificar os
[rótulos de nós](#built-in-node-labels) que você deseja que o nó de destino possua.
O Kubernetes aloca o Pod apenas em nós que possuem cada um dos rótulos que você
especificar.

Consulte [Atribuir Pods a Nós](/docs/tasks/configure-pod-container/assign-pods-nodes) para mais
informações.

## Afinidade e antiafinidade

`nodeSelector` é a maneira mais simples de restringir Pods a nós com rótulos
específicos. Afinidade e antiafinidade expandem os tipos de restrições que você pode
definir. Alguns dos benefícios da afinidade e antiafinidade incluem:

- A linguagem de afinidade/antiafinidade é mais expressiva. `nodeSelector` apenas
  seleciona nós com todos os rótulos especificados. Afinidade/antiafinidade oferece
  mais controle sobre a lógica de seleção.
- Você pode indicar que uma regra é *flexível* ou *preferencial*, para que o escalonador
  ainda aloque o Pod mesmo que não consiga encontrar um nó correspondente.
- Você pode restringir um Pod usando rótulos de outros Pods em execução no nó (ou outro domínio topológico),
  em vez de apenas rótulos de nós, o que permite definir regras para quais Pods
  podem ser co-localizados em um nó.

A funcionalidade de afinidade consiste em dois tipos de afinidade:

- *Afinidade de nó* funciona como o campo `nodeSelector`, mas é mais expressiva e
  permite especificar regras flexíveis.
- *Afinidade/antiafinidade entre Pods* permite restringir Pods com base em rótulos
  de outros Pods.

### Afinidade de nó

Afinidade de nó é conceitualmente similar a `nodeSelector`, permitindo restringir em quais nós seu
Pod pode ser alocado com base em rótulos de nós. Existem dois tipos de afinidade
de nó:

- `requiredDuringSchedulingIgnoredDuringExecution`: O escalonador não pode
  alocar o Pod a menos que a regra seja atendida. Isso funciona como `nodeSelector`,
  mas com uma sintaxe mais expressiva.
- `preferredDuringSchedulingIgnoredDuringExecution`: O escalonador tenta
  encontrar um nó que atenda à regra. Se um nó correspondente não estiver disponível, o
  escalonador ainda aloca o Pod.

{{<note>}}
Nos tipos anteriores, `IgnoredDuringExecution` significa que se os rótulos do nó
mudarem após o Kubernetes alocar o Pod, o Pod continuará em execução.
{{</note>}}

Você pode especificar afinidades de nó usando o campo `.spec.affinity.nodeAffinity` na
especificação do seu Pod.

Por exemplo, considere a seguinte especificação de Pod:

{{% code_sample file="pods/pod-with-node-affinity.yaml" %}}

Neste exemplo, as seguintes regras se aplicam:

- O nó *deve* ter um rótulo com a chave `topology.kubernetes.io/zone` e
  o valor desse rótulo *deve* ser `antarctica-east1` ou `antarctica-west1`.
- O nó *preferencialmente* tem um rótulo com a chave `another-node-label-key` e
  o valor `another-node-label-value`.

Você pode usar o campo `operator` para especificar um operador lógico para o Kubernetes usar ao
interpretar as regras. Você pode usar `In`, `NotIn`, `Exists`, `DoesNotExist`,
`Gt` e `Lt`.

Leia [Operadores](#operators)
para saber mais sobre como eles funcionam.

`NotIn` e `DoesNotExist` permitem definir o comportamento de antiafinidade de nó.
Alternativamente, você pode usar [taints de nó](/docs/concepts/scheduling-eviction/taint-and-toleration/)
para repelir Pods de nós específicos.

{{<note>}}
Se você especificar tanto `nodeSelector` quanto `nodeAffinity`, *ambos* devem ser satisfeitos
para que o Pod seja alocado em um nó.

Se você especificar múltiplos termos em `nodeSelectorTerms` associados a tipos de `nodeAffinity`,
então o Pod pode ser alocado em um nó se um dos termos especificados
puder ser satisfeito (os termos são combinados com OR).

Se você especificar múltiplas expressões em um único campo `matchExpressions` associado a um
termo em `nodeSelectorTerms`, então o Pod pode ser alocado em um nó apenas
se todas as expressões forem satisfeitas (as expressões são combinadas com AND).
{{</note>}}

Consulte [Atribuir Pods a Nós usando Afinidade de Nó](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/)
para mais informações.

#### Peso da afinidade de nó

Você pode especificar um `weight` (peso) entre 1 e 100 para cada instância do
tipo de afinidade `preferredDuringSchedulingIgnoredDuringExecution`. Quando o
escalonador encontra nós que atendem a todos os outros requisitos de alocação do Pod, o
escalonador itera por cada regra preferencial que o nó satisfaz e adiciona o
valor do `weight` dessa expressão a uma soma.

A soma final é adicionada à pontuação de outras funções de prioridade do nó.
Nós com a maior pontuação total são priorizados quando o escalonador toma uma
decisão de alocação para o Pod.

Por exemplo, considere a seguinte especificação de Pod:

{{% code_sample file="pods/pod-with-affinity-preferred-weight.yaml" %}}

Se houver dois nós possíveis que correspondem à regra
`preferredDuringSchedulingIgnoredDuringExecution`, um com o
rótulo `label-1:key-1` e outro com o rótulo `label-2:key-2`, o escalonador
considera o `weight` de cada nó e adiciona o peso às outras pontuações daquele
nó, e aloca o Pod no nó com a maior pontuação final.

{{<note>}}
Se você deseja que o Kubernetes aloque os Pods com sucesso neste exemplo, você
deve ter nós existentes com o rótulo `kubernetes.io/os=linux`.
{{</note>}}

#### Afinidade de nó por perfil de alocação

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

Ao configurar múltiplos [perfis de alocação](/docs/reference/scheduling/config/#multiple-profiles), você pode associar
um perfil a uma afinidade de nó, o que é útil se um perfil se aplica apenas a um conjunto específico de nós.
Para fazer isso, adicione um `addedAffinity` ao campo `args` do [plugin `NodeAffinity`](/docs/reference/scheduling/config/#scheduling-plugins)
na [configuração do escalonador](/docs/reference/scheduling/config/). Por exemplo:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
  - schedulerName: foo-scheduler
    pluginConfig:
      - name: NodeAffinity
        args:
          addedAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
              - matchExpressions:
                - key: scheduler-profile
                  operator: In
                  values:
                  - foo
```

O `addedAffinity` é aplicado a todos os Pods que definem `.spec.schedulerName` como `foo-scheduler`, além da
NodeAffinity especificada no PodSpec.
Ou seja, para corresponder ao Pod, os nós precisam satisfazer o `addedAffinity` e
o `.spec.NodeAffinity` do Pod.

Como o `addedAffinity` não é visível para os usuários finais, seu comportamento pode ser
inesperado para eles. Use rótulos de nós que tenham uma correlação clara com o
nome do perfil do escalonador.

{{< note >}}
O controlador DaemonSet, que [cria Pods para DaemonSets](/docs/concepts/workloads/controllers/daemonset/#how-daemon-pods-are-scheduled),
não suporta perfis de alocação. Quando o controlador DaemonSet cria
Pods, o escalonador padrão do Kubernetes aloca esses Pods e respeita quaisquer
regras de `nodeAffinity` no controlador DaemonSet.
{{< /note >}}

### Afinidade e antiafinidade entre Pods

Afinidade e antiafinidade entre Pods permitem restringir em quais nós seus
Pods podem ser alocados com base nos rótulos de Pods já em execução naquele
nó, em vez dos rótulos do nó.

#### Tipos de afinidade e antiafinidade entre Pods

Afinidade e antiafinidade entre Pods assumem a forma "este
Pod deve (ou, no caso de antiafinidade, não deve) executar em um X se esse X
já estiver executando um ou mais Pods que atendem à regra Y", onde X é um domínio
topológico como nó, rack, zona ou região do provedor de nuvem, ou similar, e Y é a
regra que o Kubernetes tenta satisfazer.

Você expressa essas regras (Y) como [seletores de rótulos](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
com uma lista opcional associada de namespaces. Pods são objetos com namespace no
Kubernetes, então rótulos de Pods também implicitamente possuem namespaces. Quaisquer seletores de rótulos
para rótulos de Pods devem especificar os namespaces nos quais o Kubernetes deve procurar esses
rótulos.

Você expressa o domínio topológico (X) usando uma `topologyKey`, que é a chave do
rótulo do nó que o sistema usa para indicar o domínio. Para exemplos, consulte
[Rótulos, Anotações e Taints Bem Conhecidos](/docs/reference/labels-annotations-taints/).

{{< note >}}
Afinidade e antiafinidade entre Pods requerem quantidades substanciais de
processamento, o que pode desacelerar significativamente a alocação em clusters grandes. Não
recomendamos usá-las em clusters maiores que algumas centenas de nós.
{{</note>}}

{{< note >}}
Antiafinidade de Pod requer que os nós sejam rotulados de forma consistente, em outras palavras,
cada nó no cluster deve ter um rótulo apropriado correspondendo à `topologyKey`.
Se alguns ou todos os nós não tiverem o rótulo `topologyKey` especificado, isso pode levar
a comportamentos não intencionais.
{{</note>}}

Similar à [afinidade de nó](#node-affinity), existem dois tipos de afinidade e
antiafinidade de Pod, como segue:

- `requiredDuringSchedulingIgnoredDuringExecution`
- `preferredDuringSchedulingIgnoredDuringExecution`

Por exemplo, você poderia usar
afinidade `requiredDuringSchedulingIgnoredDuringExecution` para dizer ao escalonador para
co-localizar Pods de dois serviços na mesma zona do provedor de nuvem porque eles
se comunicam muito entre si. Da mesma forma, você poderia usar
antiafinidade `preferredDuringSchedulingIgnoredDuringExecution` para distribuir Pods
de um serviço em múltiplas zonas do provedor de nuvem.

Para usar afinidade entre Pods, use o campo `affinity.podAffinity` na especificação do Pod.
Para antiafinidade entre Pods, use o campo `affinity.podAntiAffinity` na especificação
do Pod.

#### Comportamento de alocação

Ao alocar um novo Pod, o escalonador do Kubernetes avalia as regras de afinidade/antiafinidade do Pod no contexto do estado atual do cluster:

1. Restrições rígidas (Filtragem de nós):
   - `podAffinity.requiredDuringSchedulingIgnoredDuringExecution` e `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution`:
     - O escalonador garante que o novo Pod seja atribuído a nós que satisfaçam essas regras obrigatórias de afinidade e antiafinidade com base nos Pods existentes.

2. Restrições flexíveis (Pontuação):
   - `podAffinity.preferredDuringSchedulingIgnoredDuringExecution` e `podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution`:
     - O escalonador pontua os nós com base em quão bem eles atendem a essas regras preferenciais de afinidade e antiafinidade para otimizar a alocação do Pod.

3. Campos ignorados:
   - `podAffinity.preferredDuringSchedulingIgnoredDuringExecution` de Pods existentes:
     - Essas regras preferenciais de afinidade não são consideradas durante a decisão de alocação para novos Pods.
   - `podAntiAffinity.preferredDuringSchedulingIgnoredDuringExecution` de Pods existentes:
     - Da mesma forma, regras preferenciais de antiafinidade de Pods existentes são ignoradas durante a alocação.

#### Alocando um grupo de Pods com afinidade entre Pods para si mesmos

Se o Pod atual sendo alocado é o primeiro de uma série que tem afinidade consigo mesmos,
ele pode ser alocado se passar em todas as outras verificações de afinidade. Isso é determinado
verificando que nenhum outro Pod no cluster corresponde ao namespace e seletor deste Pod,
que o Pod corresponde aos seus próprios termos, e que o nó escolhido corresponde a todas as topologias solicitadas.
Isso garante que não haverá um deadlock mesmo se todos os Pods tiverem afinidade entre Pods
especificada.

#### Exemplo de afinidade de Pod {#an-example-of-a-pod-that-uses-pod-affinity}

Considere a seguinte especificação de Pod:

{{% code_sample file="pods/pod-with-pod-affinity.yaml" %}}

Este exemplo define uma regra de afinidade de Pod e uma regra de antiafinidade de Pod. A
regra de afinidade de Pod usa o "rígido"
`requiredDuringSchedulingIgnoredDuringExecution`, enquanto a regra de antiafinidade
usa o "flexível" `preferredDuringSchedulingIgnoredDuringExecution`.

A regra de afinidade especifica que o escalonador pode alocar o Pod de exemplo
em um nó apenas se esse nó pertencer a uma [zona](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
específica onde outros Pods foram rotulados com `security=S1`.
Por exemplo, se tivermos um cluster com uma zona designada, vamos chamá-la de "Zona V",
consistindo de nós rotulados com `topology.kubernetes.io/zone=V`, o escalonador pode
atribuir o Pod a qualquer nó dentro da Zona V, desde que haja pelo menos um Pod dentro
da Zona V já rotulado com `security=S1`. Por outro lado, se não houver Pods com rótulos
`security=S1` na Zona V, o escalonador não atribuirá o Pod de exemplo a nenhum nó nessa zona.

A regra de antiafinidade especifica que o escalonador deve tentar evitar alocar o Pod
em um nó se esse nó pertencer a uma [zona](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
específica onde outros Pods foram rotulados com `security=S2`.
Por exemplo, se tivermos um cluster com uma zona designada, vamos chamá-la de "Zona R",
consistindo de nós rotulados com `topology.kubernetes.io/zone=R`, o escalonador deve evitar
atribuir o Pod a qualquer nó dentro da Zona R, desde que haja pelo menos um Pod dentro
da Zona R já rotulado com `security=S2`. Por outro lado, a regra de antiafinidade não impacta
a alocação na Zona R se não houver Pods com rótulos `security=S2`.

Para se familiarizar mais com os exemplos de afinidade e antiafinidade de Pod,
consulte a [proposta de design](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).

Você pode usar os valores `In`, `NotIn`, `Exists` e `DoesNotExist` no
campo `operator` para afinidade e antiafinidade de Pod.

Leia [Operadores](#operators)
para saber mais sobre como eles funcionam.

Em princípio, a `topologyKey` pode ser qualquer chave de rótulo permitida, com as seguintes
exceções por razões de desempenho e segurança:

- Para afinidade e antiafinidade de Pod, um campo `topologyKey` vazio não é permitido tanto em
  `requiredDuringSchedulingIgnoredDuringExecution`
  quanto em `preferredDuringSchedulingIgnoredDuringExecution`.
- Para regras de antiafinidade de Pod `requiredDuringSchedulingIgnoredDuringExecution`,
  o controlador de admissão `LimitPodHardAntiAffinityTopology` limita
  `topologyKey` a `kubernetes.io/hostname`. Você pode modificar ou desabilitar o
  controlador de admissão se quiser permitir topologias personalizadas.

Além de `labelSelector` e `topologyKey`, você pode opcionalmente especificar uma lista
de namespaces com os quais o `labelSelector` deve corresponder usando o
campo `namespaces` no mesmo nível que `labelSelector` e `topologyKey`.
Se omitido ou vazio, `namespaces` assume como padrão o namespace do Pod onde a
definição de afinidade/antiafinidade aparece.

#### Namespace Selector

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

You can also select matching namespaces using `namespaceSelector`, which is a label query over the set of namespaces.
The affinity term is applied to namespaces selected by both `namespaceSelector` and the `namespaces` field.
Note that an empty `namespaceSelector` ({}) matches all namespaces, while a null or empty `namespaces` list and
null `namespaceSelector` matches the namespace of the Pod where the rule is defined.

#### matchLabelKeys

{{< feature-state feature_gate_name="MatchLabelKeysInPodAffinity" >}}

{{< note >}}
<!-- UPDATE THIS WHEN PROMOTING TO STABLE -->
The `matchLabelKeys` field is a beta-level field and is enabled by default in
Kubernetes {{< skew currentVersion >}}.
When you want to disable it, you have to disable it explicitly via the
`MatchLabelKeysInPodAffinity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
{{< /note >}}

Kubernetes includes an optional `matchLabelKeys` field for Pod affinity
or anti-affinity. The field specifies keys for the labels that should match with the incoming Pod's labels,
when satisfying the Pod (anti)affinity.

The keys are used to look up values from the Pod labels; those key-value labels are combined
(using `AND`) with the match restrictions defined using the `labelSelector` field. The combined
filtering selects the set of existing Pods that will be taken into Pod (anti)affinity calculation.

{{< caution >}}
It's not recommended to use `matchLabelKeys` with labels that might be updated directly on pods.
Even if you edit the pod's label that is specified at `matchLabelKeys` **directly**, (that is, not via a deployment),
kube-apiserver doesn't reflect the label update onto the merged `labelSelector`.
{{< /caution >}}

A common use case is to use `matchLabelKeys` with `pod-template-hash` (set on Pods
managed as part of a Deployment, where the value is unique for each revision).
Using `pod-template-hash` in `matchLabelKeys` allows you to target the Pods that belong
to the same revision as the incoming Pod, so that a rolling upgrade won't break affinity.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: application-server
...
spec:
  template:
    spec:
      affinity:
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - database
            topologyKey: topology.kubernetes.io/zone
            # Only Pods from a given rollout are taken into consideration when calculating pod affinity.
            # If you update the Deployment, the replacement Pods follow their own affinity rules
            # (if there are any defined in the new Pod template)
            matchLabelKeys:
            - pod-template-hash
```

#### mismatchLabelKeys

{{< feature-state feature_gate_name="MatchLabelKeysInPodAffinity" >}}

{{< note >}}
<!-- UPDATE THIS WHEN PROMOTING TO STABLE -->
The `mismatchLabelKeys` field is a beta-level field and is enabled by default in
Kubernetes {{< skew currentVersion >}}.
When you want to disable it, you have to disable it explicitly via the
`MatchLabelKeysInPodAffinity` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/).
{{< /note >}}

Kubernetes includes an optional `mismatchLabelKeys` field for Pod affinity
or anti-affinity. The field specifies keys for the labels that should not match with the incoming Pod's labels,
when satisfying the Pod (anti)affinity.

{{< caution >}}
It's not recommended to use `mismatchLabelKeys` with labels that might be updated directly on pods.
Even if you edit the pod's label that is specified at `mismatchLabelKeys` **directly**, (that is, not via a deployment),
kube-apiserver doesn't reflect the label update onto the merged `labelSelector`.
{{< /caution >}}

One example use case is to ensure Pods go to the topology domain (node, zone, etc) where only Pods from the same tenant or team are scheduled in.
In other words, you want to avoid running Pods from two different tenants on the same topology domain at the same time.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    # Assume that all relevant Pods have a "tenant" label set
    tenant: tenant-a
...
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # ensure that Pods associated with this tenant land on the correct node pool
      - matchLabelKeys:
          - tenant
        labelSelector: {}
        topologyKey: node-pool
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # ensure that Pods associated with this tenant can't schedule to nodes used for another tenant
      - mismatchLabelKeys:
        - tenant # whatever the value of the "tenant" label for this Pod, prevent
                 # scheduling to nodes in any pool where any Pod from a different
                 # tenant is running.
        labelSelector:
          # We have to have the labelSelector which selects only Pods with the tenant label,
          # otherwise this Pod would have anti-affinity against Pods from daemonsets as well, for example,
          # which aren't supposed to have the tenant label.
          matchExpressions:
          - key: tenant
            operator: Exists
        topologyKey: node-pool
```

#### More practical use-cases

Inter-pod affinity and anti-affinity can be even more useful when they are used with higher
level collections such as ReplicaSets, StatefulSets, Deployments, etc. These
rules allow you to configure that a set of workloads should
be co-located in the same defined topology; for example, preferring to place two related
Pods onto the same node.

For example: imagine a three-node cluster. You use the cluster to run a web application
and also an in-memory cache (such as Redis). For this example, also assume that latency between
the web application and the memory cache should be as low as is practical. You could use inter-pod
affinity and anti-affinity to co-locate the web servers with the cache as much as possible.

In the following example Deployment for the Redis cache, the replicas get the label `app=store`. The
`podAntiAffinity` rule tells the scheduler to avoid placing multiple replicas
with the `app=store` label on a single node. This creates each cache in a
separate node.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis-cache
spec:
  selector:
    matchLabels:
      app: store
  replicas: 3
  template:
    metadata:
      labels:
        app: store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: redis-server
        image: redis:3.2-alpine
```

The following example Deployment for the web servers creates replicas with the label `app=web-store`.
The Pod affinity rule tells the scheduler to place each replica on a node that has a Pod
with the label `app=store`. The Pod anti-affinity rule tells the scheduler never to place
multiple `app=web-store` servers on a single node.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-server
spec:
  selector:
    matchLabels:
      app: web-store
  replicas: 3
  template:
    metadata:
      labels:
        app: web-store
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - web-store
            topologyKey: "kubernetes.io/hostname"
        podAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - labelSelector:
              matchExpressions:
              - key: app
                operator: In
                values:
                - store
            topologyKey: "kubernetes.io/hostname"
      containers:
      - name: web-app
        image: nginx:1.16-alpine
```

Creating the two preceding Deployments results in the following cluster layout,
where each web server is co-located with a cache, on three separate nodes.

|    node-1     |    node-2     |    node-3     |
| :-----------: | :-----------: | :-----------: |
| *webserver-1* | *webserver-2* | *webserver-3* |
|   *cache-1*   |   *cache-2*   |   *cache-3*   |

The overall effect is that each cache instance is likely to be accessed by a single client that
is running on the same node. This approach aims to minimize both skew (imbalanced load) and latency.

You might have other reasons to use Pod anti-affinity.
See the [ZooKeeper tutorial](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
for an example of a StatefulSet configured with anti-affinity for high
availability, using the same technique as this example.

## nodeName

`nodeName` is a more direct form of node selection than affinity or
`nodeSelector`. `nodeName` is a field in the Pod spec. If the `nodeName` field
is not empty, the scheduler ignores the Pod and the kubelet on the named node
tries to place the Pod on that node. Using `nodeName` overrules using
`nodeSelector` or affinity and anti-affinity rules.

Some of the limitations of using `nodeName` to select nodes are:

- If the named node does not exist, the Pod will not run, and in
  some cases may be automatically deleted.
- If the named node does not have the resources to accommodate the
  Pod, the Pod will fail and its reason will indicate why,
  for example OutOfmemory or OutOfcpu.
- Node names in cloud environments are not always predictable or stable.

{{< warning >}}
`nodeName` is intended for use by custom schedulers or advanced use cases where
you need to bypass any configured schedulers. Bypassing the schedulers might lead to
failed Pods if the assigned Nodes get oversubscribed. You can use [node affinity](#node-affinity)
or the [`nodeSelector` field](#nodeselector) to assign a Pod to a specific Node without bypassing the schedulers.
{{</ warning >}}

Here is an example of a Pod spec using the `nodeName` field:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeName: kube-01
```

The above Pod will only run on the node `kube-01`.

## nominatedNodeName

{{< feature-state feature_gate_name="NominatedNodeNameForExpectation" >}}

`nominatedNodeName` can be used for external components to nominate node for a pending pod.
This nomination is best effort: it might be ignored if the scheduler determines the pod cannot go to a nominated node.

Also, this field can be (over)written by the scheduler:
- If the scheduler finds a node to nominate via the preemption.
- If the scheduler decides where the pod is going, and move it to the binding cycle.
  - Note that, in this case, `nominatedNodeName` is put only when the pod has to go through `WaitOnPermit` or `PreBind` extension points.

Here is an example of a Pod status using the `nominatedNodeName` field:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
...
status:
  nominatedNodeName: kube-01
```

## Pod topology spread constraints

You can use _topology spread constraints_ to control how {{< glossary_tooltip text="Pods" term_id="Pod" >}}
are spread across your cluster among failure-domains such as regions, zones, nodes, or among any other
topology domains that you define. You might do this to improve performance, expected availability, or
overall utilization.

Read [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
to learn more about how these work.

## Pod topology labels

{{< feature-state feature_gate_name="PodTopologyLabelsAdmission" >}}

Pods inherit the topology labels (`topology.kubernetes.io/zone` and `topology.kubernetes.io/region`) from their assigned Node if those labels are present. These labels can then be utilized via the Downward API to provide the workload with node topology awareness.

Here is an example of a Pod using downward API for it's zone and region:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-with-topology-labels
spec:
  containers:
    - name: app
      image: alpine
      command: ["sh", "-c", "env"]
      env:
        - name: MY_ZONE
          valueFrom:
            fieldRef:
              fieldPath: metadata.labels['topology.kubernetes.io/zone']
        - name: MY_REGION
          valueFrom:
            fieldRef:
              fieldPath: metadata.labels['topology.kubernetes.io/region']
```

## Operators

The following are all the logical operators that you can use in the `operator` field for `nodeAffinity` and `podAffinity` mentioned above.

|    Operator    |    Behavior     |
| :------------: | :-------------: |
| `In` | The label value is present in the supplied set of strings |
|   `NotIn`   | The label value is not contained in the supplied set of strings |
| `Exists` | A label with this key exists on the object |
| `DoesNotExist` | No label with this key exists on the object |

The following operators can only be used with `nodeAffinity`.

|    Operator    |    Behavior    |
| :------------: | :-------------: |
| `Gt` | The field value will be parsed as an integer, and that integer is less than the integer that results from parsing the value of a label named by this selector |
| `Lt` | The field value will be parsed as an integer, and that integer is greater than the integer that results from parsing the value of a label named by this selector |

{{<note>}}

`Gt` and `Lt` operators will not work with non-integer values. If the given value
doesn't parse as an integer, the Pod will fail to get scheduled. Also, `Gt` and `Lt`
are not available for `podAffinity`.
{{</note>}}

## {{% heading "whatsnext" %}}

- Read more about [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/).
- Read the design docs for [node affinity](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md)
  and for [inter-pod affinity/anti-affinity](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).
- Learn about how the [topology manager](/docs/tasks/administer-cluster/topology-manager/) takes part in node-level
  resource allocation decisions.
- Learn how to use [nodeSelector](/docs/tasks/configure-pod-container/assign-pods-nodes/).
- Learn how to use [affinity and anti-affinity](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/).