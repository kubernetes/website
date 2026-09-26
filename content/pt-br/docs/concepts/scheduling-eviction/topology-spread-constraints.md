---
title: Restrições de distribuição de topologia de Pod
content_type: concept
weight: 40
---


<!-- overview -->

Você pode usar as _restrições de distribuição de topologia_ (topology spread constraints) para controlar como
os {{< glossary_tooltip text="Pods" term_id="Pod" >}} são distribuídos pelo seu cluster
entre domínios de falha, como regiões, zonas, nós e outros domínios de topologia definidos
pelo usuário. Isso pode ajudar a alcançar alta disponibilidade, bem como uma utilização
eficiente de recursos.

Você pode definir [restrições no nível do cluster](#cluster-level-default-constraints) como padrão,
ou configurar restrições de distribuição de topologia para cargas de trabalho individuais.

<!-- body -->

## Motivação

Imagine que você tem um cluster de até vinte nós e deseja executar uma
{{< glossary_tooltip text="carga de trabalho" term_id="workload" >}}
que escala automaticamente quantas réplicas usa. Podem ser apenas
dois Pods ou até quinze.
Quando há apenas dois Pods, você prefere não ter os dois Pods em execução no
mesmo nó: você correria o risco de uma falha de um único nó deixar sua carga de trabalho
offline.

Além desse uso básico, há alguns exemplos de uso avançado que
permitem que suas cargas de trabalho se beneficiem de alta disponibilidade e da utilização do cluster.

À medida que você escala e executa mais Pods, uma preocupação diferente se torna importante. Imagine
que você tem três nós executando cinco Pods cada. Os nós têm capacidade suficiente
para executar essa quantidade de réplicas; no entanto, os clientes que interagem com essa carga de trabalho
estão divididos em três datacenters diferentes (ou zonas de infraestrutura). Agora
você se preocupa menos com uma falha de nó único, mas percebe que a latência é
mais alta do que gostaria, e você está pagando pelos custos de rede associados ao
envio de tráfego de rede entre as diferentes zonas.

Você decide que, sob operação normal, prefere ter um número semelhante de réplicas
[agendadas](/docs/concepts/scheduling-eviction/) em cada zona de infraestrutura,
e gostaria que o cluster se autorrecuperasse caso haja um problema.

As restrições de distribuição de topologia de Pod oferecem uma maneira declarativa de configurar isso.

## Campo `topologySpreadConstraints` {#topologyspreadconstraints-field}

A API do Pod inclui um campo, `spec.topologySpreadConstraints`. O uso deste campo tem a
seguinte aparência:

```yaml
---
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
spec:
  # Configura uma restrição de distribuição de topologia
  topologySpreadConstraints:
    - maxSkew: <integer>
      minDomains: <integer> # opcional
      topologyKey: <string>
      whenUnsatisfiable: <string>
      labelSelector: <object>
      matchLabelKeys: <list> # opcional; beta desde a v1.27
      nodeAffinityPolicy: [Honor|Ignore] # opcional; beta desde a v1.26
      nodeTaintsPolicy: [Honor|Ignore] # opcional; beta desde a v1.26
  ### outros campos do Pod vão aqui
```

{{< note >}}
Pode haver apenas uma `topologySpreadConstraint` para um determinado valor de `topologyKey` e `whenUnsatisfiable`. Por exemplo, se você tiver definido uma `topologySpreadConstraint` que usa a `topologyKey` "kubernetes.io/hostname" e o valor de `whenUnsatisfiable` "DoNotSchedule", você só poderá adicionar outra `topologySpreadConstraint` para a `topologyKey` "kubernetes.io/hostname" se usar um valor de `whenUnsatisfiable` diferente.
{{< /note >}}

Você pode ler mais sobre este campo executando `kubectl explain Pod.spec.topologySpreadConstraints` ou
consultar a seção de [agendamento](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling)
da referência da API do Pod.

### Definição da restrição de distribuição

Você pode definir uma ou várias entradas de `topologySpreadConstraints` para instruir o
kube-scheduler sobre como posicionar cada Pod recebido em relação aos Pods existentes em todo o
seu cluster. Esses campos são:

- **maxSkew** descreve o grau em que os Pods podem ser distribuídos de forma desigual. Você deve
  especificar este campo e o número deve ser maior que zero. Sua semântica difere
  de acordo com o valor de `whenUnsatisfiable`:

  - se você selecionar `whenUnsatisfiable: DoNotSchedule`, então `maxSkew` define a
    diferença máxima permitida entre o número de pods correspondentes na topologia de destino e o _mínimo global_
    (o número mínimo de pods correspondentes em um domínio elegível, ou zero se o número de domínios elegíveis for menor que MinDomains).
    Por exemplo, se você tem 3 zonas com 2, 2 e 1 pods correspondentes, respectivamente,
    e `MaxSkew` está definido como 1, então o mínimo global é 1.
  - se você selecionar `whenUnsatisfiable: ScheduleAnyway`, o agendador dá maior
    precedência às topologias que ajudariam a reduzir a distorção (skew).

- **minDomains** indica um número mínimo de domínios elegíveis. Este campo é opcional.
  Um domínio é uma instância particular de uma topologia. Um domínio elegível é um domínio cujos
  nós correspondem ao node selector.

  <!-- OK to remove this note once v1.29 Kubernetes is out of support -->
  {{< note >}}
  Antes do Kubernetes v1.30, o campo `minDomains` estava disponível apenas se o
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates-removed/) `MinDomainsInPodTopologySpread`
  estivesse habilitado (padrão desde a v1.28). Em clusters Kubernetes mais antigos, ele pode estar explicitamente
  desabilitado ou o campo pode não estar disponível.
  {{< /note >}}

  - O valor de `minDomains` deve ser maior que 0, quando especificado.
    Você só pode especificar `minDomains` em conjunto com `whenUnsatisfiable: DoNotSchedule`.
  - Quando o número de domínios elegíveis com chaves de topologia correspondentes for menor que `minDomains`,
    a distribuição de topologia de Pod trata o mínimo global como 0, e então o cálculo de `skew` é realizado.
    O mínimo global é o número mínimo de Pods correspondentes em um domínio elegível,
    ou zero se o número de domínios elegíveis for menor que `minDomains`.
  - Quando o número de domínios elegíveis com chaves de topologia correspondentes for igual ou maior que
    `minDomains`, este valor não tem efeito sobre o agendamento.
  - Se você não especificar `minDomains`, a restrição se comporta como se `minDomains` fosse 1.

- **topologyKey** é a chave dos [rótulos de nós](#node-labels). Nós que têm um rótulo com esta chave
  e valores idênticos são considerados estarem na mesma topologia.
  Chamamos cada instância de uma topologia (em outras palavras, um par <chave, valor>) de domínio. O agendador
  tentará colocar um número equilibrado de pods em cada domínio.
  Além disso, definimos um domínio elegível como um domínio cujos nós atendem aos requisitos de
  nodeAffinityPolicy e nodeTaintsPolicy.

- **whenUnsatisfiable** indica como lidar com um Pod se ele não satisfizer a restrição de distribuição:
  - `DoNotSchedule` (padrão) instrui o agendador a não agendá-lo.
  - `ScheduleAnyway` instrui o agendador a ainda agendá-lo, priorizando nós que minimizam a distorção.

- **labelSelector** é usado para encontrar Pods correspondentes. Pods
  que correspondem a este seletor de labels são contados para determinar o
  número de Pods em seu domínio de topologia correspondente.
  Consulte [Seletores de Labels](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
  para obter mais detalhes.

- **matchLabelKeys** é uma lista de chaves de labels de pods para selecionar o grupo de pods sobre o qual
  a distorção de distribuição será calculada. Na criação de um pod,
  o kube-apiserver usa essas chaves para buscar valores dos labels do pod recebido,
  e esses labels de chave-valor serão mesclados com qualquer `labelSelector` existente.
  É proibido que a mesma chave exista tanto em `matchLabelKeys` quanto em `labelSelector`.
  `matchLabelKeys` não pode ser definido quando `labelSelector` não está definido.
  Chaves que não existem nos labels do pod serão ignoradas.
  Uma lista nula ou vazia significa corresponder apenas ao `labelSelector`.

  {{< caution >}}
  Não é recomendado usar `matchLabelKeys` com labels que possam ser atualizados diretamente nos pods.
  Mesmo que você edite o label do pod especificado em `matchLabelKeys` **diretamente**
  (ou seja, você edita o Pod e não um Deployment),
  o kube-apiserver não reflete a atualização do label no `labelSelector` mesclado.
  {{< /caution >}}

  Com `matchLabelKeys`, você não precisa atualizar o `pod.spec` entre revisões diferentes.
  O controlador/operador só precisa definir valores diferentes para a mesma chave de label para revisões
  diferentes. Por exemplo, se você estiver configurando um Deployment, você pode usar o label com a chave
  [pod-template-hash](/docs/concepts/workloads/controllers/deployment/#pod-template-hash-label), que
  é adicionado automaticamente pelo controlador do Deployment, para distinguir entre revisões diferentes
  em um único Deployment.

  ```yaml
      topologySpreadConstraints:
          - maxSkew: 1
            topologyKey: kubernetes.io/hostname
            whenUnsatisfiable: DoNotSchedule
            labelSelector:
              matchLabels:
                app: foo
            matchLabelKeys:
              - pod-template-hash
  ```

  {{< note >}}
  O campo `matchLabelKeys` é um campo de nível beta e está habilitado por padrão na 1.27. Você pode desabilitá-lo desabilitando o
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `MatchLabelKeysInPodTopologySpread`.

  Antes da v1.34, `matchLabelKeys` era tratado implicitamente.
  Desde a v1.34, os labels de chave-valor correspondentes a `matchLabelKeys` são explicitamente mesclados ao `labelSelector`.
  Você pode desabilitá-lo e reverter para o comportamento anterior desabilitando o
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `MatchLabelKeysInPodTopologySpreadSelectorMerge`
  do kube-apiserver.
  {{< /note >}}

- **nodeAffinityPolicy** indica como trataremos a nodeAffinity/nodeSelector do Pod
  ao calcular a distorção da distribuição de topologia do pod. As opções são:
  - Honor: apenas os nós que correspondem à nodeAffinity/nodeSelector são incluídos nos cálculos.
  - Ignore: nodeAffinity/nodeSelector são ignorados. Todos os nós são incluídos nos cálculos.

  Se este valor for nulo, o comportamento é equivalente à política Honor.

  {{< note >}}
  O `nodeAffinityPolicy` tornou-se beta na 1.26 e se graduou para GA na 1.33.
  Ele é habilitado por padrão no beta; você pode desabilitá-lo desabilitando o
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `NodeInclusionPolicyInPodTopologySpread`.
  {{< /note >}}

- **nodeTaintsPolicy** indica como trataremos os taints dos nós ao calcular
  a distorção da distribuição de topologia do pod. As opções são:
  - Honor: nós sem taints, junto com nós com taints para os quais o pod recebido
    tem uma tolerância (toleration), são incluídos.
  - Ignore: os taints dos nós são ignorados. Todos os nós são incluídos.

  Se este valor for nulo, o comportamento é equivalente à política Ignore.

  {{< note >}}
  O `nodeTaintsPolicy` tornou-se beta na 1.26 e se graduou para GA na 1.33.
  Ele é habilitado por padrão no beta; você pode desabilitá-lo desabilitando o
  [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `NodeInclusionPolicyInPodTopologySpread`.
  {{< /note >}}

Quando um Pod define mais de uma `topologySpreadConstraint`, essas restrições são
combinadas usando uma operação lógica AND: o kube-scheduler procura um nó para o Pod recebido
que satisfaça todas as restrições configuradas.

### Rótulos de nós {#node-labels}

As restrições de distribuição de topologia dependem dos rótulos dos nós para identificar o(s)
domínio(s) de topologia em que cada {{< glossary_tooltip text="nó" term_id="node" >}} está.
Por exemplo, um nó pode ter os rótulos:
```yaml
  region: us-east-1
  zone: us-east-1a
```

{{< note >}}
Por brevidade, este exemplo não usa as chaves de rótulo
[conhecidas](/docs/reference/labels-annotations-taints/)
`topology.kubernetes.io/zone` e `topology.kubernetes.io/region`. No entanto,
essas chaves de rótulo registradas são, ainda assim, recomendadas em vez das chaves de rótulo privadas
(não qualificadas) `region` e `zone` que são usadas aqui.

Você não pode fazer uma suposição confiável sobre o significado de uma chave de rótulo privada
entre contextos diferentes.
{{< /note >}}

Suponha que você tenha um cluster de 4 nós com os seguintes rótulos:

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

Então o cluster é visualizado logicamente como abaixo:

{{<mermaid>}}
graph TB
    subgraph "zoneB"
        n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        n1(Node1)
        n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

## Consistência

Você deve definir as mesmas restrições de distribuição de topologia de Pod em todos os pods de um grupo.

Normalmente, se você estiver usando um controlador de carga de trabalho, como um Deployment, o template
do pod cuida disso para você. Se você misturar restrições de distribuição diferentes, o Kubernetes
segue a definição da API do campo; no entanto, o comportamento tende a ficar mais
confuso e a solução de problemas é menos direta.

Você precisa de um mecanismo para garantir que todos os nós em um domínio de topologia (como uma
região do provedor de nuvem) estejam rotulados de forma consistente.
Para evitar que você precise rotular os nós manualmente, a maioria dos clusters preenche automaticamente
rótulos conhecidos, como `kubernetes.io/hostname`. Verifique se
o seu cluster suporta isso.

## Exemplos de restrições de distribuição de topologia

### Exemplo: uma restrição de distribuição de topologia {#example-one-topologyspreadconstraint}

Suponha que você tenha um cluster de 4 nós onde 3 Pods com o label `foo: bar` estão localizados em
node1, node2 e node3, respectivamente:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Se você quiser que um Pod recebido seja distribuído uniformemente com os Pods existentes pelas zonas, você
pode usar um manifesto semelhante a:

{{% code_sample file="pods/topology-spread-constraints/one-constraint.yaml" %}}

Desse manifesto, `topologyKey: zone` implica que a distribuição uniforme será aplicada apenas
aos nós que têm o label `zone: <qualquer valor>` (nós que não têm um label `zone`
são ignorados). O campo `whenUnsatisfiable: DoNotSchedule` diz ao agendador para manter o
Pod recebido pendente se o agendador não conseguir encontrar uma maneira de satisfazer a restrição.

Se o agendador colocasse este Pod recebido na zona `A`, a distribuição dos Pods se
tornaria `[3, 1]`. Isso significa que a distorção real seria então 2 (calculada como `3 - 1`), o que
viola `maxSkew: 1`. Para satisfazer as restrições e o contexto deste exemplo, o
Pod recebido só pode ser colocado em um nó na zona `B`:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

OU

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        p4(mypod) --> n3
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Você pode ajustar a spec do Pod para atender a vários tipos de requisitos:

- Alterar `maxSkew` para um valor maior — como `2` — para que o Pod recebido também possa
  ser colocado na zona `A`.
- Alterar `topologyKey` para `node` para distribuir os Pods uniformemente pelos nós
  em vez de pelas zonas. No exemplo acima, se `maxSkew` permanecer `1`, o Pod
  recebido só pode ser colocado no nó `node4`.
- Alterar `whenUnsatisfiable: DoNotSchedule` para `whenUnsatisfiable: ScheduleAnyway`
  para garantir que o Pod recebido esteja sempre agendável (supondo que outras APIs de
  agendamento estejam satisfeitas). No entanto, é preferível que ele seja colocado no domínio de topologia que
  tem menos Pods correspondentes. (Esteja ciente de que essa preferência é normalizada em conjunto
  com outras prioridades internas de agendamento, como a proporção de uso de recursos).

### Exemplo: múltiplas restrições de distribuição de topologia {#example-multiple-topologyspreadconstraints}

Este exemplo se baseia no anterior. Suponha que você tenha um cluster de 4 nós onde 3
Pods existentes com o label `foo: bar` estão localizados em node1, node2 e node3, respectivamente:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3 k8s;
    class p4 plain;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Você pode combinar duas restrições de distribuição de topologia para controlar a distribuição dos Pods tanto
por nó quanto por zona:

{{% code_sample file="pods/topology-spread-constraints/two-constraints.yaml" %}}

Neste caso, para corresponder à primeira restrição, o Pod recebido só pode ser colocado em
nós na zona `B`; enquanto, em termos da segunda restrição, o Pod recebido só pode ser
agendado no nó `node4`. O agendador considera apenas as opções que satisfazem todas as
restrições definidas, então o único posicionamento válido é no nó `node4`.

### Exemplo: restrições de distribuição de topologia conflitantes {#example-conflicting-topologyspreadconstraints}

Múltiplas restrições podem levar a conflitos. Suponha que você tenha um cluster de 3 nós em 2 zonas:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p4(Pod) --> n3(Node3)
        p5(Pod) --> n3
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n1
        p3(Pod) --> n2(Node2)
    end

    classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
    classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class n1,n2,n3,n4,p1,p2,p3,p4,p5 k8s;
    class zoneA,zoneB cluster;
{{< /mermaid >}}

Se você aplicasse o
[`two-constraints.yaml`](https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/pods/topology-spread-constraints/two-constraints.yaml)
(o manifesto do exemplo anterior)
a **este** cluster, você veria que o Pod `mypod` permanece no estado `Pending`.
Isso acontece porque: para satisfazer a primeira restrição, o Pod `mypod` só pode
ser colocado na zona `B`; enquanto, em termos da segunda restrição, o Pod `mypod`
só pode ser agendado no nó `node2`. A interseção das duas restrições retorna
um conjunto vazio, e o agendador não pode posicionar o Pod.

Para superar essa situação, você pode aumentar o valor de `maxSkew` ou modificar
uma das restrições para usar `whenUnsatisfiable: ScheduleAnyway`. Dependendo das
circunstâncias, você também pode decidir excluir um Pod existente manualmente — por exemplo,
se estiver solucionando por que um rollout de correção de bug não está progredindo.

#### Interação com afinidade de nó e node selectors

O agendador pulará os nós que não correspondem dos cálculos de distorção se o
Pod recebido tiver `spec.nodeSelector` ou `spec.affinity.nodeAffinity` definidos.

### Exemplo: restrições de distribuição de topologia com afinidade de nó {#example-topologyspreadconstraints-with-nodeaffinity}

Suponha que você tenha um cluster de 5 nós abrangendo as zonas A a C:

{{<mermaid>}}
graph BT
    subgraph "zoneB"
        p3(Pod) --> n3(Node3)
        n4(Node4)
    end
    subgraph "zoneA"
        p1(Pod) --> n1(Node1)
        p2(Pod) --> n2(Node2)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n1,n2,n3,n4,p1,p2,p3 k8s;
class p4 plain;
class zoneA,zoneB cluster;
{{< /mermaid >}}

{{<mermaid>}}
graph BT
    subgraph "zoneC"
        n5(Node5)
    end

classDef plain fill:#ddd,stroke:#fff,stroke-width:4px,color:#000;
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
classDef cluster fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
class n5 k8s;
class zoneC cluster;
{{< /mermaid >}}

e você sabe que a zona `C` deve ser excluída. Neste caso, você pode compor um manifesto
como o abaixo, para que o Pod `mypod` seja colocado na zona `B` em vez da zona `C`.
Da mesma forma, o Kubernetes também respeita o `spec.nodeSelector`.

{{% code_sample file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" %}}

## Convenções implícitas

Há algumas convenções implícitas que vale a pena notar aqui:

- Apenas os Pods que estão no mesmo namespace do Pod recebido podem ser candidatos correspondentes.

- O agendador considera apenas os nós que têm todas as `topologySpreadConstraints[*].topologyKey` presentes ao mesmo tempo.
  Nós sem qualquer uma dessas `topologyKeys` são ignorados. Isso implica que:

  1. quaisquer Pods localizados nesses nós ignorados não impactam o cálculo de `maxSkew` — no
     [exemplo](#example-conflicting-topologyspreadconstraints) acima, suponha que o nó `node1`
     não tenha um label "zone"; então os 2 Pods serão
     desconsiderados, e, portanto, o Pod recebido será agendado na zona `A`.
  2. o Pod recebido não tem chances de ser agendado nesse tipo de nó —
     no exemplo acima, suponha que um nó `node5` tenha o label **com erro de digitação** `zone-typo: zoneC`
     (e nenhum label `zone` definido). Depois que o nó `node5` se juntar ao cluster, ele será ignorado e
     os Pods dessa carga de trabalho não serão agendados nele.

- Esteja ciente do que acontecerá se o
  `topologySpreadConstraints[*].labelSelector` do Pod recebido não corresponder aos seus próprios labels. No
  exemplo acima, se você remover os labels do Pod recebido, ele ainda poderá ser colocado em
  nós na zona `B`, já que as restrições ainda estão satisfeitas. No entanto, depois desse
  posicionamento, o grau de desequilíbrio do cluster permanece inalterado — ainda é a zona `A`
  com 2 Pods com o label `foo: bar`, e a zona `B` com 1 Pod com o label
  `foo: bar`. Se isso não for o que você espera, atualize o
  `topologySpreadConstraints[*].labelSelector` da carga de trabalho para corresponder aos labels no template do pod.

## Restrições padrão no nível do cluster {#cluster-level-default-constraints}

É possível definir restrições de distribuição de topologia padrão para um cluster. As restrições
padrão de distribuição de topologia são aplicadas a um Pod se, e somente se:

- Ele não define nenhuma restrição em seu `.spec.topologySpreadConstraints`.
- Ele pertence a um Service, ReplicaSet, StatefulSet ou ReplicationController.

As restrições padrão podem ser definidas como parte dos argumentos do plugin `PodTopologySpread`
em um [perfil de agendamento](/docs/reference/scheduling/config/#profiles).
As restrições são especificadas com a mesma [API acima](#topologyspreadconstraints-field), exceto que
o `labelSelector` deve estar vazio. Os seletores são calculados a partir dos Services,
ReplicaSets, StatefulSets ou ReplicationControllers aos quais o Pod pertence.

Um exemplo de configuração pode ser o seguinte:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
          defaultingType: List
```
### Restrições padrão integradas {#internal-default-constraints}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

Se você não configurar nenhuma restrição padrão no nível do cluster para a distribuição de topologia de pods,
então o kube-scheduler age como se você tivesse especificado as seguintes restrições de topologia padrão:

```yaml
defaultConstraints:
  - maxSkew: 3
    topologyKey: "kubernetes.io/hostname"
    whenUnsatisfiable: ScheduleAnyway
  - maxSkew: 5
    topologyKey: "topology.kubernetes.io/zone"
    whenUnsatisfiable: ScheduleAnyway
```

Além disso, o plugin legado `SelectorSpread`, que fornece um comportamento equivalente,
está desabilitado por padrão.

{{< note >}}
O plugin `PodTopologySpread` não pontua os nós que não têm
as chaves de topologia especificadas nas restrições de distribuição. Isso pode resultar
em um comportamento padrão diferente do plugin legado `SelectorSpread` ao
usar as restrições de topologia padrão.

Se não se espera que seus nós tenham **ambos** os labels `kubernetes.io/hostname` e
`topology.kubernetes.io/zone` definidos, defina suas próprias restrições
em vez de usar os padrões do Kubernetes.
{{< /note >}}

Se você não quiser usar as restrições padrão de distribuição de Pods para o seu cluster,
você pode desabilitar esses padrões definindo `defaultingType` como `List` e deixando
`defaultConstraints` vazio na configuração do plugin `PodTopologySpread`:

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration

profiles:
  - schedulerName: default-scheduler
    pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints: []
          defaultingType: List
```

## Comparação com podAffinity e podAntiAffinity {#comparison-with-podaffinity-podantiaffinity}

No Kubernetes, a [afinidade e antiafinidade entre Pods](/pt-br/docs/concepts/scheduling-eviction/assign-pod-node/)
controla como os Pods são agendados em relação uns aos outros — seja mais agrupados
ou mais espalhados.

`podAffinity`
: atrai Pods; você pode tentar agrupar qualquer número de Pods em domínios de
  topologia qualificados.

`podAntiAffinity`
: repele Pods. Se você definir isso no modo `requiredDuringSchedulingIgnoredDuringExecution`, então
  apenas um único Pod pode ser agendado em um único domínio de topologia; se você escolher
  `preferredDuringSchedulingIgnoredDuringExecution`, então você perde a capacidade de impor a
  restrição.

Para um controle mais refinado, você pode especificar restrições de distribuição de topologia para distribuir
os Pods por diferentes domínios de topologia — para alcançar alta disponibilidade ou
economia de custos. Isso também pode ajudar em cargas de trabalho de atualização contínua (rolling update) e no
escalonamento suave de réplicas.

Para mais contexto, consulte a seção de
[Motivação](https://github.com/kubernetes/enhancements/tree/master/keps/sig-scheduling/895-pod-topology-spread#motivation)
da proposta de aprimoramento sobre as restrições de distribuição de topologia de Pod.

## Limitações conhecidas

- Não há garantia de que as restrições permaneçam satisfeitas quando os Pods são removidos. Por
  exemplo, reduzir a escala de um Deployment pode resultar em uma distribuição desequilibrada de Pods.

  Você pode usar uma ferramenta como o [Descheduler](https://github.com/kubernetes-sigs/descheduler)
  para rebalancear a distribuição dos Pods.
- Pods correspondentes em nós com taints são respeitados.
  Consulte a [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921).
- O agendador não tem conhecimento prévio de todas as zonas ou outros domínios de
  topologia que um cluster tem. Eles são determinados a partir dos nós existentes no
  cluster. Isso pode levar a um problema em clusters com autoscaling, quando um pool de nós
  (ou grupo de nós) é reduzido a zero nós, e você espera que o cluster escale,
  porque, neste caso, esses domínios de topologia não serão considerados até que haja
  pelo menos um nó neles.

  Você pode contornar isso usando um autoscaler de nós que conheça as
  restrições de distribuição de topologia de Pod e também conheça o conjunto geral de domínios de
  topologia.
- Pods que não correspondem ao seu próprio labelSelector criam "pods fantasma". Se os
  labels de um pod não corresponderem ao `labelSelector` em sua restrição de distribuição de topologia, o pod
  não se contará nos cálculos de distribuição. Isso significa:
  - Múltiplos desses pods podem simplesmente se acumular na mesma topologia (até que pods correspondentes sejam recém-criados/excluídos), porque o agendamento desses pods não altera o resultado do cálculo de distribuição.
  - A restrição de distribuição funciona de uma maneira não intencional, muito provavelmente não correspondendo às suas expectativas

  Certifique-se de que os labels do seu pod correspondam ao `labelSelector` em suas restrições de distribuição.
  Normalmente, um pod deve corresponder ao seletor de sua própria restrição de distribuição de topologia.

## {{% heading "whatsnext" %}}

- O artigo do blog [Introducing PodTopologySpread](/blog/2020/05/introducing-podtopologyspread/)
  explica `maxSkew` em alguns detalhes, além de cobrir alguns exemplos de uso avançado.
- Leia a seção de [agendamento](/docs/reference/kubernetes-api/workload-resources/pod-v1/#scheduling) da
  referência da API do Pod.
