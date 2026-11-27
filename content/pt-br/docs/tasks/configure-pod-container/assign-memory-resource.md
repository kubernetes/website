---
title: Atribuir Recursos de Memória a Contêineres e Pods
content_type: task
weight: 10
---

<!-- overview -->

Esta página mostra como atribuir uma *requisição* de memória e um *limite* de memória a um
contêiner. Um contêiner tem garantida a quantidade de memória que requisita,
mas não tem permissão para usar mais memória do que o seu limite.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Cada nó do seu cluster precisa ter pelo menos 300 MiB de memória.

Algumas das etapas desta página exigem que você execute o serviço
[metrics-server](https://github.com/kubernetes-sigs/metrics-server)
no seu cluster. Se o metrics-server já estiver em execução,
você pode pular essas etapas.

Se você estiver usando o Minikube, execute o seguinte comando para habilitar o
metrics-server:

```shell
minikube addons enable metrics-server
```

Para verificar se o metrics-server, ou outro provedor da API de métricas de recursos
(`metrics.k8s.io`), está em execução, execute o seguinte comando:

```shell
kubectl get apiservices
```

Se a API de métricas de recursos estiver disponível, a saída incluirá uma
referência a `metrics.k8s.io`.

```shell
NAME
v1beta1.metrics.k8s.io
```



<!-- steps -->

## Crie um namespace

Crie um namespace para que os recursos criados neste exercício fiquem
isolados do restante do seu cluster.

```shell
kubectl create namespace mem-example
```

## Especifique uma requisição e um limite de memória

Para especificar uma requisição de memória para um contêiner, inclua o campo `resources.requests.memory`
no manifesto de recursos do contêiner. Para especificar um limite de memória, inclua `resources.limits.memory`.

Neste exercício, você cria um Pod que tem um contêiner. O contêiner tem uma requisição
de memória de 100 MiB e um limite de memória de 200 MiB. Este é o arquivo de configuração
do Pod:

{{% code_sample file="pods/resource/memory-request-limit.yaml" options="hl_lines=10-14" %}}

A seção `args` do arquivo de configuração fornece argumentos para o contêiner quando ele inicia.
Os argumentos `"--vm-bytes", "150M"` instruem o contêiner a tentar alocar 150 MiB de memória.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit.yaml --namespace=mem-example
```

Verifique se o contêiner do Pod está em execução:

```shell
kubectl get pod memory-demo --namespace=mem-example
```

Veja informações detalhadas sobre o Pod:

```shell
kubectl get pod memory-demo --output=yaml --namespace=mem-example
```

A saída mostra que o único contêiner do Pod tem uma requisição de memória de 100 MiB
e um limite de memória de 200 MiB.


```yaml
...
resources:
  requests:
    memory: 100Mi
  limits:
    memory: 200Mi
...
```

Execute `kubectl top` para obter as métricas do Pod:

```shell
kubectl top pod memory-demo --namespace=mem-example
```

A saída mostra que o Pod está usando cerca de 162.900.000 bytes de memória, o que
equivale a aproximadamente 150 MiB. Isso é maior do que a requisição de 100 MiB do Pod, mas está dentro
do limite de 200 MiB do Pod.

```
NAME                        CPU(cores)   MEMORY(bytes)
memory-demo                 <something>  162856960
```

Exclua o seu Pod:

```shell
kubectl delete pod memory-demo --namespace=mem-example
```

## Exceda o limite de memória de um contêiner

Um contêiner pode exceder a sua requisição de memória se o nó tiver memória disponível. Mas um contêiner
não tem permissão para usar mais do que o seu limite de memória. Se um contêiner alocar mais memória do que
o seu limite, ele se torna candidato a ser encerrado. Se o contêiner continuar a
consumir memória além do seu limite, ele é encerrado. Se um contêiner encerrado puder ser
reiniciado, o kubelet o reinicia, como em qualquer outro tipo de falha em tempo de execução.

Neste exercício, você cria um Pod que tenta alocar mais memória do que o seu limite.
Este é o arquivo de configuração de um Pod que tem um contêiner com uma
requisição de memória de 50 MiB e um limite de memória de 100 MiB:

{{% code_sample file="pods/resource/memory-request-limit-2.yaml" options="hl_lines=10-14" %}}

Na seção `args` do arquivo de configuração, você pode ver que o contêiner
tentará alocar 250 MiB de memória, bem acima do limite de 100 MiB.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-2.yaml --namespace=mem-example
```

Veja informações detalhadas sobre o Pod:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

Neste momento, o contêiner pode estar em execução ou ter sido encerrado. Repita o comando anterior até que o contêiner seja encerrado:

```shell
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          24s
```

Obtenha uma visão mais detalhada do status do contêiner:

```shell
kubectl get pod memory-demo-2 --output=yaml --namespace=mem-example
```

A saída mostra que o contêiner foi encerrado por falta de memória (OOM, _out of memory_):

```yaml
lastState:
   terminated:
     containerID: 65183c1877aaec2e8427bc95609cc52677a454b56fcb24340dbd22917c23b10f
     exitCode: 137
     finishedAt: 2017-06-20T20:52:19Z
     reason: OOMKilled
     startedAt: null
```

O contêiner deste exercício pode ser reiniciado, então o kubelet o reinicia. Repita
este comando várias vezes para ver que o contêiner é repetidamente encerrado e reiniciado:

```shell
kubectl get pod memory-demo-2 --namespace=mem-example
```

A saída mostra que o contêiner é encerrado, reiniciado, encerrado novamente, reiniciado novamente e assim por diante:

```
kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS      RESTARTS   AGE
memory-demo-2   0/1       OOMKilled   1          37s
```
```

kubectl get pod memory-demo-2 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-2   1/1       Running   2          40s
```

Veja informações detalhadas sobre o histórico do Pod:

```
kubectl describe pod memory-demo-2 --namespace=mem-example
```

A saída mostra que o contêiner inicia e falha repetidamente:

```
... Normal  Created   Created container with id 66a3a20aa7980e61be4922780bf9d24d1a1d8b7395c09861225b0eba1b1f8511
... Warning BackOff   Back-off restarting failed container
```

Veja informações detalhadas sobre os nós do seu cluster:

```
kubectl describe nodes
```

A saída inclui um registro do contêiner sendo encerrado por uma condição de falta de memória:

```
Warning OOMKilling Memory cgroup out of memory: Kill process 4481 (stress) score 1994 or sacrifice child
```

Exclua o seu Pod:

```shell
kubectl delete pod memory-demo-2 --namespace=mem-example
```

## Especifique uma requisição de memória grande demais para os seus nós

Requisições e limites de memória são associados a contêineres, mas é útil pensar
em um Pod como tendo uma requisição e um limite de memória. A requisição de memória do Pod é a
soma das requisições de memória de todos os contêineres do Pod. Da mesma forma, o limite
de memória do Pod é a soma dos limites de todos os contêineres do Pod.

A alocação de Pods é baseada nas requisições. Um Pod só é alocado para execução em um nó se o nó
tiver memória disponível suficiente para atender à requisição de memória do Pod.

Neste exercício, você cria um Pod com uma requisição de memória tão grande que excede a
capacidade de qualquer nó do seu cluster. Este é o arquivo de configuração de um Pod que tem um
contêiner com uma requisição de 1000 GiB de memória, o que provavelmente excede a capacidade
de qualquer nó do seu cluster.

{{% code_sample file="pods/resource/memory-request-limit-3.yaml" options="hl_lines=10-14" %}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/memory-request-limit-3.yaml --namespace=mem-example
```

Veja o status do Pod:

```shell
kubectl get pod memory-demo-3 --namespace=mem-example
```

A saída mostra que o status do Pod é PENDING. Ou seja, o Pod não está alocado para execução em nenhum nó e permanecerá no estado PENDING indefinidamente:

```
kubectl get pod memory-demo-3 --namespace=mem-example
NAME            READY     STATUS    RESTARTS   AGE
memory-demo-3   0/1       Pending   0          25s
```

Veja informações detalhadas sobre o Pod, incluindo os eventos:

```shell
kubectl describe pod memory-demo-3 --namespace=mem-example
```

A saída mostra que o contêiner não pode ser alocado por falta de memória suficiente nos nós:

```
Events:
  ...  Reason            Message
       ------            -------
  ...  FailedScheduling  No nodes are available that match all of the following predicates:: Insufficient memory (3).
```

## Unidades de memória

O recurso de memória é medido em bytes. Você pode expressar a memória como um número inteiro simples ou como um
número de ponto fixo com um destes sufixos: E, P, T, G, M, K, Ei, Pi, Ti, Gi, Mi, Ki.
Por exemplo, os valores a seguir representam aproximadamente o mesmo valor:

```
128974848, 129e6, 129M, 123Mi
```

Exclua o seu Pod:

```shell
kubectl delete pod memory-demo-3 --namespace=mem-example
```

## Se você não especificar um limite de memória

Se você não especificar um limite de memória para um contêiner, uma das seguintes situações se aplica:

* O contêiner não tem um limite superior para a quantidade de memória que usa. O contêiner
pode usar toda a memória disponível no nó em que está sendo executado, o que, por sua vez, pode acionar o OOM Killer. Além disso, em caso de um OOM Kill, um contêiner sem limites de recursos tem maior chance de ser encerrado.

* O contêiner está em execução em um namespace que tem um limite de memória padrão, e o
limite padrão é atribuído automaticamente ao contêiner. Administradores de cluster podem usar um
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core)
para especificar um valor padrão para o limite de memória.

## Motivação para requisições e limites de memória

Ao configurar requisições e limites de memória para os contêineres que são executados no seu
cluster, você pode fazer uso eficiente dos recursos de memória disponíveis nos nós do
seu cluster. Ao manter baixa a requisição de memória de um Pod, você dá ao Pod uma boa chance de ser
alocado. Ao ter um limite de memória maior do que a requisição de memória, você consegue duas coisas:

* O Pod pode ter picos de atividade em que utiliza a memória que estiver disponível no momento.
* A quantidade de memória que um Pod pode usar durante um pico fica limitada a um valor razoável.

## Limpeza

Exclua o seu namespace. Isso exclui todos os Pods que você criou para esta tarefa:

```shell
kubectl delete namespace mem-example
```



## {{% heading "whatsnext" %}}


### Para desenvolvedores de aplicações

* [Atribuir Recursos de CPU a Contêineres e Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

* [Atribuir recursos de CPU e memória no nível do Pod](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Configurar Qualidade de Serviço para Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

* [Redimensionar recursos de CPU e memória atribuídos a contêineres](/docs/tasks/configure-pod-container/resize-container-resources/)

### Para administradores de cluster

* [Configurar Requisições e Limites de Memória Padrão para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configurar Requisições e Limites de CPU Padrão para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configurar Restrições de Memória Mínima e Máxima para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configurar Restrições de CPU Mínima e Máxima para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configurar Cotas de Memória e CPU para um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configurar uma Cota de Pods para um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configurar Cotas para Objetos da API](/docs/tasks/administer-cluster/quota-api-object/)

* [Redimensionar recursos de CPU e memória atribuídos a contêineres](/docs/tasks/configure-pod-container/resize-container-resources/)
