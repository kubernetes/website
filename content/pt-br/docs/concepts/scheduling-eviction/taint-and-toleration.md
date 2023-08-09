---
title: Taints e Tolerâncias
content_type: concept
weight: 40
---


<!-- overview -->
[_Afinidade de nó_](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
é uma propriedade dos {{< glossary_tooltip text="Pods" term_id="pod" >}} que os *associa* a um conjunto de {{< glossary_tooltip text="nós" term_id="node" >}} (seja como uma preferência ou uma exigência). _Taints_ são o oposto -- eles permitem que um nó repudie um conjunto de pods.

_Tolerâncias_ são aplicadas em pods e permitem, mas não exigem, que os pods sejam alocados em nós com _taints_ correspondentes.

Taints e tolerâncias trabalham juntos para garantir que pods não sejam alocados em nós inapropriados. Um ou mais taints são aplicados em um nó; isso define que o nó não deve aceitar nenhum pod que não tolera essas taints.


<!-- body -->

## Conceitos

Você adiciona um taint a um nó utilizando [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint).
Por exemplo,

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

define um taint no nó `node1`. O taint tem a chave `key1`, valor `value1` e o efeito `NoSchedule`.
Isso significa que nenhum pod conseguirá ser executado no nó `node1` a menos que possua uma tolerância correspondente.

Para remover o taint adicionado pelo comando acima, você pode executar:
```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```

Você especifica uma tolerância para um pod na [especificação do Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1#PodSpec). Ambas as seguintes tolerâncias "correspondem" ao taint criado pelo `kubectl taint` acima, e assim um pod com qualquer uma delas poderia ser executado no `node1`:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key1"
  operator: "Exists"
  effect: "NoSchedule"
```

Aqui está um exemplo de um pod que utiliza tolerâncias:

{{% codenew file="pods/pod-with-toleration.yaml" %}}

O valor padrão de `operator` é `Equal`.

Uma tolerância "casa" um taint se as chaves e efeitos são os mesmos, e:

* o valor de `operator` é `Exists` (no caso nenhum `value` deve ser especificado), ou
* o valor de `operator` é `Equal` e os valores de `value` são iguais.

{{< note >}}

Existem dois casos especiais:

Uma `key` vazia com o operador `Exists` "casa" todas as chaves, valores e efeitos, o que significa que o pod irá tolerar tudo.

Um `effect` vazio "casa" todos os efeitos com a chave `key1`.

{{< /note >}}

O exemplo acima usou `effect` de `NoSchedule`. De forma alternativa, você pode usar `effect` de `PreferNoSchedule`.
Nesse efeito, o sistema *tentará* evitar que o pod seja alocado ao nó caso ele não tolere os taints definidos, contudo a alocação não será evitada de forma obrigatória. Pode-se dizer que o `PreferNoSchedule` é uma versão permissiva do `NoSchedule`. O terceiro tipo de `effect` é o `NoExecute` que será descrito posteriormente.

Você pode colocar múltiplos taints no mesmo nó e múltiplas tolerâncias no mesmo pod.
O jeito que o Kubernetes processa múltiplos taints e tolerâncias é como um filtro: começa com todos os taints de um nó, em seguida ignora aqueles para os quais o pod tem uma tolerância relacionada; os taints restantes que não foram ignorados indicam o efeito no pod. Mais especificamente,

* se existe pelo menos um taint não tolerado com o efeito `NoSchedule`, o Kubernetes não alocará o pod naquele nó
* se existe um taint não tolerado com o efeito `NoSchedule`, mas existe pelo menos um taint não tolerado com o efeito `PreferNoSchedule`, o Kubernetes *tentará* não alocar o pod no nó
* se existe pelo menos um taint não tolerado com o efeito `NoExecute`, o pod será expulso do nó (caso já esteja em execução) e não será alocado ao nó (caso ainda não esteja em execução).

Por exemplo, imagine que você tem um nó com os seguintes taints

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

E um pod com duas tolerâncias:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

Nesse caso, o pod não será alocado ao nó porque não possui uma tolerância para o terceiro taint. Porém, se ele já estiver rodando no nó quando o taint foi adicionado, não será afetado e continuará rodando, tendo em vista que o terceiro taint é o único não tolerado pelo pod. 

Normalmente, se um taint com o efeito `NoExecute` é adicionado a um nó, qualquer pod que não o tolere será expulso imediatamente e pods que o toleram nunca serão expulsos. Contudo, uma tolerância com efeito `NoExecute` pode especificar de forma opcional o campo `tolerationSeconds`, que determina quanto tempo o pod continuará alocado ao nó depois que o taint é adicionado. Por exemplo,

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

significa que se esse pod está sendo executado e um taint correspondente é adicionado ao nó, o pod irá continuar rodando neste nó por 3600 segundos e depois será expulso. Se o taint for removido antes desse tempo acabar, o pod não será expulso.

## Exemplos de Casos de Uso

Taints e tolerâncias são um modo flexível de conduzir pods para *fora* dos nós ou expulsar pods que não deveriam estar sendo executados. Alguns casos de uso são

* **Nós Dedicados**: Se você quiser dedicar um conjunto de nós para uso exclusivo de um conjunto específico de usuários, poderá adicionar um taint nesses nós. (digamos, `kubectl taint nodes nodename dedicated=groupName:NoSchedule`) e em seguida adicionar uma tolerância correspondente para seus pods (isso seria feito mais facilmente com a escrita de um [controlador de admissão](/docs/reference/access-authn-authz/admission-controllers/) customizado).
Os pods com tolerância terão sua execução permitida nos nós com taints (dedicados), assim como em qualquer outro nó no cluster. Se você quiser dedicar nós a esses pods *e garantir* que eles usem *apenas* os nós dedicados, precisará adicionar uma label similar ao taint para o mesmo conjunto de nós (por exemplo, `dedicated=groupName`), e o controle de admissão deverá adicionar uma afinidade de nó para exigir que os pods podem ser executados apenas nos nós definidos com a label `dedicated=groupName`.

* **Nós com hardware especial**: Em um cluster no qual um pequeno grupo de nós possui hardware especializado (por exemplo, GPUs), é desejável manter pods que não necessitem desse tipo de hardware fora desses nós, dessa forma o recurso estará disponível para pods que precisem do hardware especializado.  Isso pode ser feito aplicando taints nos nós com o hardware especializado (por exemplo, `kubectl taint nodes nodename special=true:NoSchedule` or `kubectl taint nodes nodename special=true:PreferNoSchedule`) e aplicando uma tolerância correspondente nos pods que usam o hardware especial. Assim como no caso de uso de nós dedicados, é provavelmente mais fácil aplicar as tolerâncias utilizando um [controlador de admissão](/docs/reference/access-authn-authz/admission-controllers/).
Por exemplo, é recomendado usar [Extended Resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources) para representar hardware especial, adicione um taint ao seus nós de hardware especializado com o nome do recurso estendido e execute o controle de admissão [ExtendedResourceToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration). Agora, tendo em vista que os nós estão marcados com um taint, nenhum pod sem a tolerância será executado neles. Porém, quando você submete um pod que requisita o recurso estendido, o controlador de admissão `ExtendedResourceToleration` irá adicionar automaticamente as tolerâncias necessárias ao pod que irá, por sua vez, ser alocado no nó com hardware especial. Isso garantirá que esses nós de hardware especial serão dedicados para os pods que requisitarem tal recurso e você não precisará adicionar manualmente as tolerâncias aos seus pods.

* **Expulsões baseadas em Taint**: Um comportamento de expulsão configurada por pod quando problemas existem em um nó, o qual será descrito na próxima seção.

## Expulsões baseadas em Taint

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

O efeito de taint `NoExecute`, mencionado acima, afeta pods que já estão rodando no nó da seguinte forma

 * pods que não toleram o taint são expulsos imediatamente
 * pods que toleram o taint sem especificar `tolerationSeconds` em sua especificação de tolerância, ficam alocados para sempre
 * pods que toleram o taint com um `tolerationSeconds` especificado, permanecem alocados pela quantidade de tempo definida

O controlador de nó automaticamente adiciona um taint ao Nó quando certas condições se tornam verdadeiras. Os seguintes taints são embutidos:

 * `node.kubernetes.io/not-ready`: Nó não está pronto. Isso corresponde ao NodeCondition `Ready` com o valor "`False`".
 * `node.kubernetes.io/unreachable`: Nó é inalcançável a partir do controlador de nó. Isso corresponde ao NodeCondition `Ready` com o valor "`Unknown`".
 * `node.kubernetes.io/memory-pressure`: Nó possui pressão de memória.
 * `node.kubernetes.io/disk-pressure`: Nó possui pressão de disco.
 * `node.kubernetes.io/pid-pressure`: Nó possui pressão de PID.
 * `node.kubernetes.io/network-unavailable`: A rede do nó está indisponível.
 * `node.kubernetes.io/unschedulable`: Nó não é alocável.
 * `node.cloudprovider.kubernetes.io/uninitialized`: Quando o kubelet é iniciado com um provedor de nuvem "externo", esse taint é adicionado ao nó para que ele seja marcado como não utilizável. Após o controlador do cloud-controller-manager inicializar o nó, o kubelet remove esse taint.

No caso de um nó estar prestes a ser expulso, o controlador de nó ou kubelet adicionam os taints relevantes com o efeito `NoExecute`. Se a condição de falha retorna ao normal, o kubelet ou controlador de nó podem remover esses taints.

{{< note >}}
A camada de gerenciamento limita a taxa de adição de novos taints aos nós. Esse limite gerencia o número de expulsões que são disparadas quando muitos nós se tornam inalcançáveis ao mesmo tempo (por exemplo: se ocorre uma falha na rede).
{{< /note >}}

Você pode especificar `tolerationSeconds` em um Pod para definir quanto tempo ele ficará alocado em um nó que está falhando ou está sem resposta.

Por exemplo, você talvez queira manter uma aplicação com vários estados salvos localmente alocado em um nó por um longo período na ocorrência de uma divisão na rede, esperando que essa divisão se recuperará e assim a expulsão do pod pode ser evitada.
A tolerância que você define para esse Pod poderia ficar assim:

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

{{< note >}}
O Kubernetes automaticamente adiciona uma tolerância para `node.kubernetes.io/not-ready` e `node.kubernetes.io/unreachable` com `tolerationSeconds=300`, a menos que você, ou um controlador, defina essas tolerâncias explicitamente.

Essas tolerâncias adicionadas automaticamente significam que Pods podem continuar alocados aos Nós por 5 minutos após um desses problemas ser detectado.
{{< /note >}}

Pods do tipo [DaemonSet](/docs/concepts/workloads/controllers/daemonset/) são criados com tolerâncias `NoExecute` sem a propriedade `tolerationSeconds` para os seguintes taints:

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

Isso garante que esses pods do DaemonSet nunca sejam expulsos por conta desses problemas.

## Taints por condições de nó

A camada de gerenciamento, usando o {{<glossary_tooltip text="controlador" term_id="controller">}} do nó, cria taints automaticamente com o efeito `NoSchedule` para [condições de nó](/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions).

O agendador verifica taints, não condições de nó, quando realiza suas decisões de agendamento. Isso garante que as condições de nó não afetem diretamente o agendamento.
Por exemplo, se a condição de nó `DiskPressure` está ativa, a camada de gerenciamento adiciona o taint `node.kubernetes.io/disk-pressure` e não aloca novos pods no nó afetado. Se a condição `MemoryPressure` está ativa, a camada de gerenciamento adiciona o taint `node.kubernetes.io/memory-pressure`. 

Você pode ignorar condições de nó para pods recém-criados adicionando tolerâncias correspondentes. A camada de controle também adiciona a tolerância `node.kubernetes.io/memory-pressure` em pods que possuem uma {{< glossary_tooltip text="classe de QoS" term_id="qos-class" >}}  diferente de `BestEffort`. Isso ocorre porque o Kubernetes trata pods nas classes de QoS `Guaranteed` ou `Burstable` (até mesmo pods sem requisitos de memória definidos) como se fossem capazes de lidar com pressão de memória, enquanto novos pods com `BestEffort` não são alocados no nó afetado.

O controlador DaemonSet adiciona automaticamente as seguintes tolerâncias de `NoSchedule` para todos os daemons, prevenindo que DaemonSets quebrem.

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/pid-pressure` (1.14 ou superior)
  * `node.kubernetes.io/unschedulable` (1.10 ou superior)
  * `node.kubernetes.io/network-unavailable` (*somente rede do host*)

Adicionando essas tolerâncias garante retro compatibilidade. Você também pode adicionar tolerâncias de forma arbitrária aos DaemonSets.

## {{% heading "whatsnext" %}}

* Leia sobre [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/) e como você pode configurá-la
* Leia sobre [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/)


