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
ou para colocalizar Pods de dois serviços diferentes que se comunicam frequentemente na mesma zona de disponibilidade.

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
[anexar rótulos manualmente](/docs/tasks/configure-pod-container/assign-pods-nodes/#adicione-um-rótulo-a-um-nó).
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

1. Certifique-se de estar usando o [Node authorizer](/docs/reference/access-authn-authz/node/) e ter _habilitado_ o plugin de admissão `NodeRestriction`.
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

## Afinidade e antiafinidade {#affinity-and-anti-affinity}

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
  podem ser colocalizados em um nó.

A funcionalidade de afinidade consiste em dois tipos de afinidade:

- *Afinidade de nó* funciona como o campo `nodeSelector`, mas é mais expressiva e
  permite especificar regras flexíveis.
- *Afinidade/antiafinidade entre Pods* permite restringir Pods com base em rótulos
  de outros Pods.

### Afinidade de nó {#node-affinity}

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
[Rótulos, Anotações e Taints bem conhecidos](/docs/reference/labels-annotations-taints/).

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
colocalizar Pods de dois serviços na mesma zona do provedor de nuvem porque eles
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
Isso garante que não haverá um _deadlock_ mesmo se todos os Pods tiverem afinidade entre Pods
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

#### Seletor de Namespace

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Você também pode selecionar namespaces correspondentes usando `namespaceSelector`, que é uma consulta de rótulos sobre o conjunto de namespaces.
O termo de afinidade é aplicado aos namespaces selecionados tanto pelo `namespaceSelector` quanto pelo campo `namespaces`.
Note que um `namespaceSelector` vazio ({}) corresponde a todos os namespaces, enquanto uma lista `namespaces` nula ou vazia e
um `namespaceSelector` nulo correspondem ao namespace do Pod onde a regra é definida.

#### matchLabelKeys

{{< feature-state feature_gate_name="MatchLabelKeysInPodAffinity" >}}

{{< note >}}
<!-- ATUALIZE ISTO AO PROMOVER PARA ESTÁVEL -->
O campo `matchLabelKeys` é um campo de nível beta e está habilitado por padrão no
Kubernetes {{< skew currentVersion >}}.
Quando você quiser desabilitá-lo, você deve desabilitá-lo explicitamente através do
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `MatchLabelKeysInPodAffinity`.
{{< /note >}}

O Kubernetes inclui um campo opcional `matchLabelKeys` para afinidade
ou antiafinidade de Pod. O campo especifica chaves para os rótulos que devem corresponder aos rótulos do Pod de entrada,
ao satisfazer a (anti)afinidade de Pod.

As chaves são usadas para buscar valores dos rótulos do Pod; esses rótulos de chave-valor são combinados
(usando `AND`) com as restrições de correspondência definidas usando o campo `labelSelector`. A filtragem
combinada seleciona o conjunto de Pods existentes que será considerado no cálculo de (anti)afinidade de Pod.

{{< caution >}}
Não é recomendado usar `matchLabelKeys` com rótulos que possam ser atualizados diretamente nos pods.
Mesmo se você editar o rótulo do pod que está especificado em `matchLabelKeys` **diretamente** (isto é, não através de um Deployment),
o kube-apiserver não reflete a atualização do rótulo no `labelSelector` mesclado.
{{< /caution >}}

Um caso de uso comum é usar `matchLabelKeys` com `pod-template-hash` (definido em Pods
gerenciados como parte de um Deployment, onde o valor é único para cada revisão).
Usar `pod-template-hash` em `matchLabelKeys` permite direcionar os Pods que pertencem
à mesma revisão que o Pod de entrada, para que uma atualização gradual não quebre a afinidade.

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
            # Apenas Pods de um determinado rollout são considerados ao calcular a afinidade de pod.
            # Se você atualizar o Deployment, os Pods substitutos seguem suas próprias regras de afinidade
            # (se houver alguma definida no novo template de Pod)
            matchLabelKeys:
            - pod-template-hash
```

#### mismatchLabelKeys

{{< feature-state feature_gate_name="MatchLabelKeysInPodAffinity" >}}

{{< note >}}
<!-- ATUALIZE ISTO AO PROMOVER PARA ESTÁVEL -->
O campo `mismatchLabelKeys` é um campo de nível beta e está habilitado por padrão no
Kubernetes {{< skew currentVersion >}}.
Quando você quiser desabilitá-lo, você deve desabilitá-lo explicitamente através do
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `MatchLabelKeysInPodAffinity`.
{{< /note >}}

O Kubernetes inclui um campo opcional `mismatchLabelKeys` para afinidade
ou antiafinidade de Pod. O campo especifica chaves para os rótulos que não devem corresponder aos rótulos do Pod de entrada,
ao satisfazer a (anti)afinidade de Pod.

{{< caution >}}
Não é recomendado usar `mismatchLabelKeys` com rótulos que possam ser atualizados diretamente nos pods.
Mesmo se você editar o rótulo do pod que está especificado em `mismatchLabelKeys` **diretamente** (isto é, não através de um Deployment),
o kube-apiserver não reflete a atualização do rótulo no `labelSelector` mesclado.
{{< /caution >}}

Um exemplo de caso de uso é garantir que os Pods vão para o domínio topológico (nó, zona, etc.) onde apenas Pods do mesmo locatário ou equipe são alocados.
Em outras palavras, você quer evitar executar Pods de dois locatários diferentes no mesmo domínio topológico ao mesmo tempo.

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    # Assume que todos os Pods relevantes têm um rótulo "tenant" definido
    tenant: tenant-a
...
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # garante que os Pods associados a este locatário sejam alocados no pool de nós correto
      - matchLabelKeys:
          - tenant
        labelSelector: {}
        topologyKey: node-pool
    podAntiAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      # garante que os Pods associados a este locatário não possam ser alocados em nós usados por outro locatário
      - mismatchLabelKeys:
        - tenant # qualquer que seja o valor do rótulo "tenant" para este Pod, impede
                 # a alocação em nós de qualquer pool onde qualquer Pod de um
                 # locatário diferente esteja em execução.
        labelSelector:
          # Precisamos ter o labelSelector que seleciona apenas Pods com o rótulo tenant,
          # caso contrário, este Pod teria antiafinidade contra Pods de DaemonSets também, por exemplo,
          # que não deveriam ter o rótulo tenant.
          matchExpressions:
          - key: tenant
            operator: Exists
        topologyKey: node-pool
```

#### Casos de uso mais práticos

Afinidade e antiafinidade entre Pods podem ser ainda mais úteis quando são usadas com coleções
de nível superior, como ReplicaSets, StatefulSets, Deployments, etc. Essas
regras permitem configurar que um conjunto de cargas de trabalho deve
ser colocalizado na mesma topologia definida; por exemplo, preferindo alocar dois Pods
relacionados no mesmo nó.

Por exemplo: imagine um cluster de três nós. Você usa o cluster para executar uma aplicação web
e também um cache em memória (como Redis). Para este exemplo, assuma também que a latência entre
a aplicação web e o cache em memória deve ser a mais baixa possível. Você poderia usar afinidade
e antiafinidade entre Pods para colocalizar os servidores web com o cache tanto quanto possível.

No seguinte exemplo de Deployment para o cache Redis, as réplicas recebem o rótulo `app=store`. A
regra `podAntiAffinity` diz ao escalonador para evitar alocar múltiplas réplicas
com o rótulo `app=store` em um único nó. Isso cria cada cache em um
nó separado.

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

O seguinte exemplo de Deployment para os servidores web cria réplicas com o rótulo `app=web-store`.
A regra de afinidade de Pod diz ao escalonador para alocar cada réplica em um nó que tenha um Pod
com o rótulo `app=store`. A regra de antiafinidade de Pod diz ao escalonador para nunca alocar
múltiplos servidores `app=web-store` em um único nó.

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

Criar os dois Deployments anteriores resulta no seguinte layout de cluster,
onde cada servidor web é colocalizado com um cache, em três nós separados.

|    node-1     |    node-2     |    node-3     |
| :-----------: | :-----------: | :-----------: |
| *webserver-1* | *webserver-2* | *webserver-3* |
|   *cache-1*   |   *cache-2*   |   *cache-3*   |

O efeito geral é que cada instância de cache provavelmente será acessada por um único cliente que
está executando no mesmo nó. Esta abordagem visa minimizar tanto a assimetria (carga desbalanceada) quanto a latência.

Você pode ter outras razões para usar antiafinidade de Pod.
Consulte o [tutorial do ZooKeeper](/docs/tutorials/stateful-application/zookeeper/#tolerating-node-failure)
para um exemplo de um StatefulSet configurado com antiafinidade para alta
disponibilidade, usando a mesma técnica deste exemplo.

## nodeName

`nodeName` é uma forma mais direta de seleção de nó do que afinidade ou
`nodeSelector`. `nodeName` é um campo na especificação do Pod. Se o campo `nodeName`
não estiver vazio, o escalonador ignora o Pod e o kubelet no nó nomeado
tenta alocar o Pod naquele nó. Usar `nodeName` sobrepõe o uso de
`nodeSelector` ou regras de afinidade e antiafinidade.

Algumas das limitações de usar `nodeName` para selecionar nós são:

- Se o nó nomeado não existir, o Pod não será executado e, em
  alguns casos, pode ser automaticamente excluído.
- Se o nó nomeado não tiver os recursos para acomodar o
  Pod, o Pod falhará e seu motivo indicará o porquê,
  por exemplo OutOfmemory ou OutOfcpu.
- Nomes de nós em ambientes de nuvem nem sempre são previsíveis ou estáveis.

{{< warning >}}
`nodeName` é destinado para uso por escalonadores personalizados ou casos de uso avançados onde
você precisa ignorar quaisquer escalonadores configurados. Ignorar os escalonadores pode levar a
Pods com falha se os nós atribuídos ficarem sobrecarregados. Você pode usar [afinidade de nó](#node-affinity)
ou o [campo `nodeSelector`](#nodeselector) para atribuir um Pod a um nó específico sem ignorar os escalonadores.
{{</ warning >}}

Aqui está um exemplo de uma especificação de Pod usando o campo `nodeName`:

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

O Pod acima será executado apenas no nó `kube-01`.

## nominatedNodeName

{{< feature-state feature_gate_name="NominatedNodeNameForExpectation" >}}

`nominatedNodeName` pode ser usado por componentes externos para nomear um nó para um pod pendente.
Esta nomeação é de melhor esforço: ela pode ser ignorada se o escalonador determinar que o pod não pode ir para o nó nomeado.

Além disso, este campo pode ser escrito (ou sobrescrito) pelo escalonador:
- Se o escalonador encontrar um nó para nomear através da preempção.
- Se o escalonador decidir para onde o pod vai e movê-lo para o ciclo de binding.
  - Note que, neste caso, `nominatedNodeName` é definido apenas quando o pod precisa passar pelos pontos de extensão `WaitOnPermit` ou `PreBind`.

Aqui está um exemplo de um status de Pod usando o campo `nominatedNodeName`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
...
status:
  nominatedNodeName: kube-01
```

## Restrições de distribuição de topologia de Pod {#pod-topology-spread-constraints}

Você pode usar _restrições de distribuição de topologia_ para controlar como os {{< glossary_tooltip text="Pods" term_id="Pod" >}}
são distribuídos pelo seu cluster entre domínios de falha como regiões, zonas, nós, ou entre quaisquer outros
domínios de topologia que você definir. Você pode fazer isso para melhorar o desempenho, a disponibilidade esperada ou
a utilização geral.

Leia [Restrições de distribuição de topologia de Pod](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
para saber mais sobre como elas funcionam.

## Rótulos de topologia de Pod

{{< feature-state feature_gate_name="PodTopologyLabelsAdmission" >}}

Os Pods herdam os rótulos de topologia (`topology.kubernetes.io/zone` e `topology.kubernetes.io/region`) do nó atribuído se esses rótulos estiverem presentes. Esses rótulos podem então ser utilizados através da Downward API para fornecer à carga de trabalho a consciência da topologia do nó.

Aqui está um exemplo de um Pod usando a Downward API para sua zona e região:
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

## Operadores {#operators}

A seguir estão todos os operadores lógicos que você pode usar no campo `operator` para `nodeAffinity` e `podAffinity` mencionados acima.

|    Operador    |    Comportamento     |
| :------------: | :-------------: |
| `In` | O valor do rótulo está presente no conjunto de strings fornecido |
|   `NotIn`   | O valor do rótulo não está contido no conjunto de strings fornecido |
| `Exists` | Um rótulo com esta chave existe no objeto |
| `DoesNotExist` | Nenhum rótulo com esta chave existe no objeto |

Os seguintes operadores só podem ser usados com `nodeAffinity`.

|    Operador    |    Comportamento    |
| :------------: | :-------------: |
| `Gt` | O valor do campo será interpretado como um inteiro, e esse inteiro é maior que o inteiro resultante da interpretação do valor de um rótulo nomeado por este seletor |
| `Lt` | O valor do campo será interpretado como um inteiro, e esse inteiro é menor que o inteiro resultante da interpretação do valor de um rótulo nomeado por este seletor |

{{<note>}}

Os operadores `Gt` e `Lt` não funcionarão com valores não inteiros. Se o valor fornecido
não puder ser interpretado como um inteiro, o Pod não conseguirá ser alocado. Além disso, `Gt` e `Lt`
não estão disponíveis para `podAffinity`.
{{</note>}}

## {{% heading "whatsnext" %}}

- Leia mais sobre [taints e tolerâncias](/docs/concepts/scheduling-eviction/taint-and-toleration/).
- Leia os documentos de design para [afinidade de nó](https://git.k8s.io/design-proposals-archive/scheduling/nodeaffinity.md)
  e para [afinidade/antiafinidade entre Pods](https://git.k8s.io/design-proposals-archive/scheduling/podaffinity.md).
- Aprenda como o [gerenciador de topologia](/docs/tasks/administer-cluster/topology-manager/) participa nas decisões de
  alocação de recursos em nível de nó.
- Aprenda a usar [nodeSelector](/docs/tasks/configure-pod-container/assign-pods-nodes/).
- Aprenda a usar [afinidade e antiafinidade](/docs/tasks/configure-pod-container/assign-pods-nodes-using-node-affinity/).