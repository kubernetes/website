---
title: ReplicaSet
content_type: concept
weight: 20
---

<!-- overview -->

O propósito de um ReplicaSet é gerenciar um conjunto de réplicas de Pods em execução a qualquer momento. Por isso, é geralmente utilizado para garantir a disponibilidade de um certo número de Pods idênticos.


<!-- body -->

## Como um ReplicaSet funciona

Um ReplicaSet é definido por campos, incluindo um seletor que identifica quais Pods podem ser adquiridos, um número de réplicas indicando quantos Pods devem ser mantidos, e um pod template especificando as definições para novos Pods que devem ser criados para atender ao número de réplicas estipuladas. Um ReplicaSet cumpre seu propósito criando e deletando Pods conforme for preciso para atingir o número desejado. Quando um ReplicaSet precisa criar novos Pods, ele usa o seu podTemplate.

Um ReplicaSet é conectado ao seus Pods pelo campo do Pod [metadata.ownerReferences](/docs/concepts/workloads/controllers/garbage-collection/#owners-and-dependents), que especifíca qual recurso é dono do objeto atual. Todos os Pods adquiridos por um ReplicaSet possuem as informações de identificação do ReplicaSet vinculado no campo ownerReferences. É por esse elo que o ReplicaSet tem conhecimento do estado dos Pods que está mantendo e assim faz seu planejamento.

Um ReplicaSet identifica novos Pods a serem adquiridos utilizando o seu seletor. Caso exista um Pod que não tenha OwnerReference ou se o OwnerReference não for um {{< glossary_tooltip term_id="controller" >}} e o seu seletor corresponde com o do ReplicaSet, o Pod é adquirido imediatamente por esse ReplicaSet.

## Quando usar um ReplicaSet

Um ReplicaSet garante que um número de réplicas de um Pod estão executando em qualquer momento. Entretanto, um Deployment é um conceito de nível superior que gerencia ReplicaSets e fornece atualizações declarativas aos Pods assim como várias outras funções úteis. Portanto, nós recomendamos a utilização de Deployments ao invés do uso direto de ReplicaSets, exceto se for preciso uma orquestração de atualização customizada ou que nenhuma atualização seja necessária.

Isso na realidade significa que você pode nunca precisar manipular objetos ReplicaSet:
prefira usar um Deployment, e defina sua aplicação na seção spec.

## Exemplo

{{% codenew file="controllers/frontend.yaml" %}}

Salvando esse manifesto como `frontend.yaml` e submetendo no cluster Kubernetes irá criar o ReplicaSet definido e os Pods mantidos pelo mesmo.

```shell
kubectl apply -f https://kubernetes.io/pt-br/examples/controllers/frontend.yaml
```

Você pode então retornar os ReplicaSets atualmente existentes atualmente no cluster:

```shell
kubectl get rs
```

E observar o ReplicaSet com o nome de frontend que você criou:

```shell
NAME       DESIRED   CURRENT   READY   AGE
frontend   3         3         3       6s
```

Você também pode checar o estado do ReplicaSet:

```shell
kubectl describe rs/frontend
```

E você deve ver uma saída similar a esta:

```shell
Name:         frontend
Namespace:    default
Selector:     tier=frontend
Labels:       app=guestbook
              tier=frontend
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"apps/v1","kind":"ReplicaSet","metadata":{"annotations":{},"labels":{"app":"guestbook","tier":"frontend"},"name":"frontend",...
Replicas:     3 current / 3 desired
Pods Status:  3 Running / 0 Waiting / 0 Succeeded / 0 Failed
Pod Template:
  Labels:  tier=frontend
  Containers:
   php-redis:
    Image:        gcr.io/google_samples/gb-frontend:v3
    Port:         <none>
    Host Port:    <none>
    Environment:  <none>
    Mounts:       <none>
  Volumes:        <none>
Events:
  Type    Reason            Age   From                   Message
  ----    ------            ----  ----                   -------
  Normal  SuccessfulCreate  117s  replicaset-controller  Created pod: frontend-wtsmm
  Normal  SuccessfulCreate  116s  replicaset-controller  Created pod: frontend-b2zdv
  Normal  SuccessfulCreate  116s  replicaset-controller  Created pod: frontend-vcmts
```

E por fim você consegue verificar os Pods que foram criados:

```shell
kubectl get pods
```

Você deve ver uma informação do Pod similar à esta:

```shell
NAME             READY   STATUS    RESTARTS   AGE
frontend-b2zdv   1/1     Running   0          6m36s
frontend-vcmts   1/1     Running   0          6m36s
frontend-wtsmm   1/1     Running   0          6m36s
```

Você consegue também validar que a referência de dono desses pods está definida para o ReplicaSet frontend.
Para fazer isso, retorne o yaml de um dos Pods que estão executando:

```shell
kubectl get pods frontend-b2zdv -o yaml
```

O output será semelhante ao exibido abaixo, com as informações do ReplicaSet frontend definidas no campo ownerReferences dentro da metadata do Pod:

```shell
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: "2020-02-12T07:06:16Z"
  generateName: frontend-
  labels:
    tier: frontend
  name: frontend-b2zdv
  namespace: default
  ownerReferences:
  - apiVersion: apps/v1
    blockOwnerDeletion: true
    controller: true
    kind: ReplicaSet
    name: frontend
    uid: f391f6db-bb9b-4c09-ae74-6a1f77f3d5cf
...
```

## Aquisições de Pod sem Template

Enquanto você pode criar Pods diretamente sem problemas, é fortemente recomendado que você se certifique que esses Pods não tenham labels que combinem com o seletor de um dos seus ReplicaSets. O motivo para isso é que um ReplicaSet não é limitado a possuir apenas Pods estipulados por seu template -- ele pode adquirir outros Pods na maneira descrita nas seções anteriores.

Observe o exemplo anterior do ReplicaSet frontend, e seus Pods especificados no seguinte manifesto:

{{% codenew file="pods/pod-rs.yaml" %}}

Como esses Pods não possuem um Controller (ou qualquer objeto) referenciados como seu dono e possuem labels que combinam com o seletor do ReplicaSet frontend, eles serão imediatamente adquiridos pelo ReplicaSet.

Imagine que você crie os Pods depois que o ReplicaSet frontend foi instalado e criou as réplicas de Pod inicial definida para cumprir o número de réplicas requiridas:

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

Os novos Pods serão adquiridos pelo ReplicaSet, e logo depois terminados já que o ReplicaSet estará acima do número desejado.

Buscando os Pods:

```shell
kubectl get pods
```

O output mostra que os novos Pods ou já estão terminados, ou estão no processo de ser terminados.

```shell
NAME             READY   STATUS        RESTARTS   AGE
frontend-b2zdv   1/1     Running       0          10m
frontend-vcmts   1/1     Running       0          10m
frontend-wtsmm   1/1     Running       0          10m
pod1             0/1     Terminating   0          1s
pod2             0/1     Terminating   0          1s
```

Se você criar os Pods primeiro:

```shell
kubectl apply -f https://kubernetes.io/examples/pods/pod-rs.yaml
```

mas em seguida criar o ReplicaSet:

```shell
kubectl apply -f https://kubernetes.io/examples/controllers/frontend.yaml
```

Você vai perceber que o ReplicaSet adquiriu os Pods e criou apenas novos de acordo com o seu spec até que o número de novo Pods e os Pods iniciais seja igual a ao número desejado. Listando os Pods:

```shell
kubectl get pods
```

Irá retornar a seguinte saída:
```shell
NAME             READY   STATUS    RESTARTS   AGE
frontend-hmmj2   1/1     Running   0          9s
pod1             1/1     Running   0          36s
pod2             1/1     Running   0          36s
```

Nesse sentido, um ReplicaSet pode possuir um grupo não-homogêneo de Pods
## Escrevendo um manifesto ReplicaSet

Como todos os outros objetos de Kubernetes API, um ReplicaSet necessita dos campos `apiVersion`, `kind`, e `metadata`. 
Para ReplicaSets, o `kind` sempre será um ReplicaSet.

O nome de um objeto ReplicaSet precisa ser [nome de subdomínio de DNS](/pt-br/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) válido.

Um ReplicaSet também precisa de uma [seção `.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Template de Pod

O `.spec.template` é um [template de pod](/docs/concepts/workloads/pods/#pod-templates) que também necessita de labels configurados. No nosso exemplo `frontend.yaml` nós temos uma label: `tier: frontend`.
Fique atento para não sobrepor com seletores de outros controllers, para que eles não tentem adquirir esse Pod.

Para o campo de [restart policy](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) do template, `.spec.template.spec.restartPolicy`, o único valor permitido é `Always`, que é o padrão.

### Seletor de Pod

O campo `.spec.selector` é um [seletor de labels](/docs/concepts/overview/working-with-objects/labels/). Como discutido [anteriormente](#como-um-replicaset-funciona) esses são os labels usados para identificar Pods em potencial para aquisição. No nosso exemplo `frontend.yaml`, o seletor era:

```yaml
matchLabels:
  tier: frontend
```

No ReplicaSet, `.spec.template.metadata.labels` precisa combinar com `spec.selector`, ou será rejeitado pela API.

{{< note >}}
Para 2 ReplicaSets definindo o mesmo `.spec.selector` mas diferentes campos de `.spec.template.metadata.labels` e `.spec.template.spec`, cada ReplicaSet ignorará os Pods criados pelo outro ReplicaSet.
{{< /note >}}

### Replicas

Você pode definir quantos Pods devem executar simultaneamente determinando `.spec.replicas`. O ReplicaSet irá criar/deletar os Pods para igualar à esse número.

Se você não especificar o `.spec.replicas`, seu padrão é 1. 

## Trabalhando com ReplicaSets

### Deletando um ReplicaSet e seus Pods

Para deletar um ReplicaSet e todos os seus Pods, use [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete). O [Garbage collector](/docs/concepts/workloads/controllers/garbage-collection/) automaticamente deleta todos os Pods dependentes por padrão.

Quando usar a API REST ou a biblioteca `client-go`, você precisa definir `propagationPolicy` para `Background` ou `Foreground` na opção -d.
Por exemplo:
```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
> -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Foreground"}' \
> -H "Content-Type: application/json"
```

### Deletando apenas o ReplicaSet

Você consegue deletar um ReplicaSet sem afetar qualquer um dos Pods usando [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands#delete) com a opção `--cascade=orphan`.
Quando usar a API REST ou a biblioteca `client-go`, você precisa definir `propagationPolicy` para `Orphan`.
Por exemplo:
```shell
kubectl proxy --port=8080
curl -X DELETE  'localhost:8080/apis/apps/v1/namespaces/default/replicasets/frontend' \
> -d '{"kind":"DeleteOptions","apiVersion":"v1","propagationPolicy":"Orphan"}' \
> -H "Content-Type: application/json"
```

Quando o ReplicaSet original for deletado, você pode criar um novo ReplicaSet para substituí-lo. Contanto que o `.spec.selector` do antigo e do atual sejam o mesmo, o novo irá adquirir os Pods antigos. Porém, o ReplicaSet não atualizará as definições dos Pods existentes caso surja um novo e diferente template de pod.
Para atualizar esses Pods para um novo spec de um modo controlado, use um [Deployment](/docs/concepts/workloads/controllers/deployment/#creating-a-deployment), já que ReplicaSets não suportam um atualização gradual diretamente.

### Isolando Pods de um ReplicaSet

Você pode remover Pods de um Replicaset trocando suas labels. Essa técnica pode ser usada para remover Pods de um serviço para depuração, recuperação de dados, etc. Pods que forem removidos por esse método serão substituídos imediatamente (assumindo que o número de replicas não tenha sido alterado).

### Escalonando um ReplicaSet

Um ReplicaSet pode ser facilmente escalonado para cima ou para baixo simplesmente atualizando o campo de `.spec.replicas`. O Replicaset controller garante que o número desejado de Pods com um seletor de label correspondente estejam disponíveis e operando.

Ao escalonar para baixo, o Replicaset controller escolhe quais pods irá deletar ordenando os pods disponíveis para priorizar quais pods seram escalonados para baixo seguindo o seguinte algoritmo geral:
 1. Pods pendentes (e não agendáveis) são decaídos primeiro
 2. Se a anotação `controller.kubernetes.io/pod-deletion-cost` estiver definida, então o pod com o menor valor será priorizado primeiro.
 3. Pods em nós com mais réplicas são decaídos primeiro que pods em nodes com menos réplicas.
 4. Se a data de criação dos pods for diferente, o pod que foi criado mais recentemente vem antes que o pod mais antigo (as datas de criação são guardados em uma escala logarítmica caso o [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) `LogarithmicScaleDown` esteja habilitado)

Se o Pod obedecer todos os items acima simultaneamente, a seleção é aleatória.

### Custo de deleção de Pods
{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Utilizando a anotação [`controller.kubernetes.io/pod-deletion-cost`](/docs/reference/labels-annotations-taints/#pod-deletion-cost),
usuários podem definir uma preferência em relação à quais pods serão removidos primeiro caso o ReplicaSet precise escalonar para baixo.

A anotação deve ser definida no pod, com uma variação de [-2147483648, 2147483647]. Isso representa o custo de deletar um pod comparado com outros pods que pertencem à esse mesmo ReplicaSet. Pods com um custo de deleção menor são eleitos para deleção antes de pods com um custo maior.

O valor implícito para essa anotação para pods que não a tem definida é 0;  valores negativos são permitidos.
Valores inválidos serão rejeitados pelo servidor API.

Esse recurso está em beta e é habilitado por padrão. Você consegue desabilita-lo usando o 
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`PodDeletionCost` ambos no kube-apiserver e no kube-controller-manager.

{{< note >}}
- Esse recurso é honrado baseado no melhor esforço, portanto não oferece qualquer garantia na ordem de deleção dos pods.
- Usuários são recomendados à evitar atualizações frequentes em anotações, como gerar atualizações baseando-se em alguma métrica, porque fazendo isso irá criar um número significante de atualizações de pod para o apiserver.
{{< /note >}}

#### Exemplo de caso de uso
Os diferentes Pods de uma aplicação podem ter níveis de utilização divergentes. Ao escalonar para baixo, a aplicação pode preferir remover os pods com a menor utilização. Para evitar atualizações frequentes nos pods, a aplicação deve atualizar `controller.kubernetes.io/pod-deletion-cost` uma vez antes de expedir o escalonamento para baixo das réplicas (configurando a anotação para um valor proporcional ao nível de utilização do Pod). Isso funciona se a própria aplicação controlar o escalonamento; por exemplo, o pod condutor de um Deployment de Spark.

### ReplicaSet como um Horizontal Pod Autoscaler Target

Um ReplicaSet pode também ser controlado por um
[Horizontal Pod Autoscalers (HPA)](/docs/tasks/run-application/horizontal-pod-autoscale/). Isto é,
um ReplicaSet pode ser automaticamente escalonado por um HPA. Aqui está um exemplo de um HPA controlando o ReplicaSet que nós criamos no exemplo anterior.

{{% codenew file="controllers/hpa-rs.yaml" %}}

Salvando esse manifesto como `hpa-rs.yaml` e enviando para o cluster Kubernetes deve 
criar um HPA definido que autoescalona o ReplicaSet controlado dependendo do uso de CPU 
dos Pods replicados.

```shell
kubectl apply -f https://k8s.io/examples/controllers/hpa-rs.yaml
```


Alternativamente, você pode usar o comando `kubectl autoscale` para realizar a mesma coisa
(e é bem mais simples!)

```shell
kubectl autoscale rs frontend --max=10 --min=3 --cpu-percent=50
```

## Alternativas ao ReplicaSet

### Deployment (recomendado)

[`Deployment`](/docs/concepts/workloads/controllers/deployment/) é um objeto o qual pode possuir ReplicaSets, atualizá-los e por consequência seus Pods via atualizações declarativas, gradativas do lado do servidor.
Enquanto ReplicaSets conseguem ser usados independentemente, hoje eles são principalmente usados por Deployments como um mecanismo para orquestrar a criação, deleção e atualização de um Pod. Quando você usa Deployments você não precisa se preocupar com o gerenciamento de ReplicaSets que são criados por ele. Deployments controlam e gerenciam seus ReplicaSets.
Por isso, é recomendado o uso de Deployments quando você deseja ReplicaSets.

### Bare Pods

Diferente do caso onde um usuário cria Pods diretamente, um ReplicaSet substitui Pods que forem deletados ou terminados por qualquer motivo, como em caso de falha de nó ou manutenção disruptiva de nó, como uma atualização de kernel. Por esse motivo, nós recomendamos que você use um ReplicaSet mesmo que sua aplicação necessite apenas de um único Pod. Pense na semelhança com um supervisor de processos, apenas que ele supervisione vários Pods em múltiplos nós ao invés de apenas um Pod. Um ReplicaSet delega reinicializações de um container local para algum agente do nó (Kubelet ou Docker, por exemplo).

### Job

Use um [`Job`](/docs/concepts/workloads/controllers/job/) no lugar de um ReplicaSet para Pods que tem por objetivo sua terminação no final da execução (como batch jobs).

### DaemonSet

Use um [`DaemonSet`](/docs/concepts/workloads/controllers/daemonset/) no lugar de um ReplicaSet para Pods que precisam prover funções no nível de sistema, como monitoramento do sistema ou logs do sistema. Esses Pods tem um tempo de vida ligado à vida útil do sistema:
os Pods precisam estar executando na máquina antes de outros Pods inicializarem, e são seguros de terminarem quando a máquina esta preparada para reiniciar/desligar.

### ReplicationController
ReplicaSets são sucessores ao [_ReplicationControllers_](/docs/concepts/workloads/controllers/replicationcontroller/).
Os dois servem para o mesmo propósito, e tem comportamentos semelhantes, exceto que um ReplicationController não suporta os requerimentos de um seletor baseado em definição como descrito no [guia de usuário de label](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
Portanto, ReplicaSets são preferíveis à ReplicationControllers


## {{% heading "whatsnext" %}}

* Aprenda sobre [Pods](/docs/concepts/workloads/pods).
* Aprenda sobre [Deployments](/docs/concepts/workloads/controllers/deployment/).
* [Executar uma aplicação Stateless usando um Deployment](/docs/tasks/run-application/run-stateless-application-deployment/),
  o qual necessita de ReplicaSets para funcionar.
* `ReplicaSet` é um recurso alto nível na API REST do Kubernetes.
  Leia a {{< api-reference page="workload-resources/replica-set-v1" >}}
  definição de objeto para entender a API para replica sets.
* Leia sobre [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/) e como
  você consegue usá-lo para gerenciar disponibilidade de aplicação durante interrupções.
