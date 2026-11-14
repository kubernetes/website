---
title: Atribuir Recursos de CPU a Contêineres e Pods
content_type: task
weight: 20
---

<!-- overview -->

Esta página mostra como atribuir uma *requisição* de CPU e um *limite* de CPU a
um contêiner. Contêineres não podem usar mais CPU do que o limite configurado.
Desde que o sistema tenha tempo de CPU livre, é garantido que um contêiner
receba tanta CPU quanto requisita.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

O seu cluster precisa ter pelo menos 1 CPU disponível para executar os exemplos desta tarefa.

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


```
NAME
v1beta1.metrics.k8s.io
```




<!-- steps -->

## Crie um namespace

Crie um {{< glossary_tooltip term_id="namespace" >}} para que os recursos criados
neste exercício fiquem isolados do restante do seu cluster.

```shell
kubectl create namespace cpu-example
```

## Especifique uma requisição e um limite de CPU

Para especificar uma requisição de CPU para um contêiner, inclua o campo `resources.requests.cpu`
no manifesto de recursos do contêiner. Para especificar um limite de CPU, inclua `resources.limits.cpu`.

Neste exercício, você cria um Pod que tem um contêiner. O contêiner tem uma requisição
de 0,5 CPU e um limite de 1 CPU. Este é o arquivo de configuração do Pod:

{{% code_sample file="pods/resource/cpu-request-limit.yaml" options="hl_lines=10-14" %}}

A seção `args` do arquivo de configuração fornece argumentos para o contêiner quando ele inicia.
O argumento `-cpus "2"` instrui o contêiner a tentar usar 2 CPUs.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

Verifique se o Pod está em execução:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

Veja informações detalhadas sobre o Pod:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

A saída mostra que o único contêiner do Pod tem uma requisição de CPU de 500 miliCPU
e um limite de CPU de 1 CPU.

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```

Use `kubectl top` para obter as métricas do Pod:

```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

Este exemplo de saída mostra que o Pod está usando 974 miliCPU, um pouco
menos do que o limite de 1 CPU especificado na configuração do Pod.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Lembre-se de que, ao definir `-cpu "2"`, você configurou o contêiner para tentar usar 2 CPUs, mas o contêiner só tem permissão para usar cerca de 1 CPU. O uso de CPU do contêiner está sendo limitado (_throttling_), porque o contêiner está tentando usar mais recursos de CPU do que o seu limite.

{{< note >}}
Outra explicação possível para o uso de CPU abaixo de 1,0 é que o nó pode não ter
recursos de CPU suficientes disponíveis. Lembre-se de que os pré-requisitos deste exercício exigem que o seu cluster tenha pelo menos 1 CPU disponível para uso. Se o seu contêiner for executado em um nó que tem apenas 1 CPU, o contêiner não pode usar mais do que 1 CPU, independentemente do limite de CPU especificado para o contêiner.
{{< /note >}}

## Unidades de CPU

O recurso de CPU é medido em unidades de *CPU*. No Kubernetes, uma CPU equivale a:

* 1 vCPU da AWS
* 1 Core do GCP
* 1 vCore do Azure
* 1 Hyperthread em um processador Intel com Hyperthreading em um servidor dedicado

Valores fracionários são permitidos. Um contêiner que requisita 0,5 CPU tem garantida a metade
da CPU de um contêiner que requisita 1 CPU. Você pode usar o sufixo m para indicar mili. Por exemplo,
100m CPU, 100 miliCPU e 0,1 CPU são a mesma coisa. Não é permitida uma precisão mais fina do que 1m.

A CPU é sempre requisitada como uma quantidade absoluta, nunca como uma quantidade relativa; 0,1 é a mesma
quantidade de CPU em uma máquina com um, dois ou 48 núcleos.

Exclua o seu Pod:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## Especifique uma requisição de CPU grande demais para os seus nós

Requisições e limites de CPU são associados a contêineres, mas é útil pensar
em um Pod como tendo uma requisição e um limite de CPU. A requisição de CPU de um Pod é a soma
das requisições de CPU de todos os contêineres do Pod. Da mesma forma, o limite de CPU
de um Pod é a soma dos limites de CPU de todos os contêineres do Pod.

A alocação de Pods é baseada nas requisições. Um Pod só é alocado para execução em um nó se
o nó tiver recursos de CPU disponíveis suficientes para atender à requisição de CPU do Pod.

Neste exercício, você cria um Pod com uma requisição de CPU tão grande que excede
a capacidade de qualquer nó do seu cluster. Este é o arquivo de configuração de um Pod
que tem um contêiner. O contêiner requisita 100 CPUs, o que provavelmente excede a
capacidade de qualquer nó do seu cluster.

{{% code_sample file="pods/resource/cpu-request-limit-2.yaml" options="hl_lines=10-14" %}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

Veja o status do Pod:

```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

A saída mostra que o status do Pod é Pending. Ou seja, o Pod não foi
alocado para execução em nenhum nó e permanecerá no estado Pending indefinidamente:


```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

Veja informações detalhadas sobre o Pod, incluindo os eventos:


```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

A saída mostra que o contêiner não pode ser alocado por falta de recursos de CPU
suficientes nos nós:


```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

Exclua o seu Pod:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## Se você não especificar um limite de CPU

Se você não especificar um limite de CPU para um contêiner, uma das seguintes situações se aplica:

* O contêiner não tem um limite superior para os recursos de CPU que pode usar. O contêiner
pode usar todos os recursos de CPU disponíveis no nó em que está sendo executado.

* O contêiner está em execução em um namespace que tem um limite de CPU padrão, e o
limite padrão é atribuído automaticamente ao contêiner. Administradores de cluster podem usar um
[LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/)
para especificar um valor padrão para o limite de CPU.

## Se você especificar um limite de CPU, mas não especificar uma requisição de CPU

Se você especificar um limite de CPU para um contêiner, mas não especificar uma requisição de CPU, o Kubernetes
atribui automaticamente uma requisição de CPU igual ao limite. Da mesma forma, se um contêiner especificar o seu próprio
limite de memória, mas não especificar uma requisição de memória, o Kubernetes atribui automaticamente uma requisição
de memória igual ao limite.

## Motivação para requisições e limites de CPU

Ao configurar requisições e limites de CPU para os contêineres que são executados no seu
cluster, você pode fazer uso eficiente dos recursos de CPU disponíveis nos nós do seu
cluster. Ao manter baixa a requisição de CPU de um Pod, você dá ao Pod uma boa chance de ser
alocado. Ao ter um limite de CPU maior do que a requisição de CPU, você consegue duas coisas:

* O Pod pode ter picos de atividade em que utiliza os recursos de CPU que estiverem disponíveis no momento.
* A quantidade de recursos de CPU que um Pod pode usar durante um pico fica limitada a um valor razoável.

## Limpeza

Exclua o seu namespace:

```shell
kubectl delete namespace cpu-example
```



## {{% heading "whatsnext" %}}



### Para desenvolvedores de aplicações

* [Atribuir Recursos de Memória a Contêineres e Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Atribuir recursos de CPU e memória no nível do Pod](/docs/tasks/configure-pod-container/assign-pod-level-resources/)

* [Configurar Qualidade de Serviço para Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

* [Redimensionar recursos de CPU e memória atribuídos a contêineres](/docs/tasks/configure-pod-container/resize-container-resources/)

* [Redimensionar recursos de CPU e memória atribuídos a Pods](/docs/tasks/configure-pod-container/resize-pod-resources/)

### Para administradores de cluster

* [Configurar Requisições e Limites de Memória Padrão para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configurar Requisições e Limites de CPU Padrão para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configurar Restrições de Memória Mínima e Máxima para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configurar Restrições de CPU Mínima e Máxima para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configurar Cotas de Memória e CPU para um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configurar uma Cota de Pods para um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configurar Cotas para Objetos da API](/docs/tasks/administer-cluster/quota-api-object/)

* [Redimensionar recursos de CPU e memória atribuídos a contêineres](/docs/tasks/configure-pod-container/resize-container-resources/)
