---
title: Atribuindo Recursos de CPU aos Contêineres e Pods
content_type: task
weight: 20
update_date: 2022-07-16
origin_version: 1.24
contributors: DonatoHorn
reviewers: 
---

<!-- overview -->

Esta página mostra como atribuir um *requisito* de CPU e um *limite* de CPU a um contêiner. Os Contêineres não podem usar mais CPU do que o limite configurado. Comprovado que o sistema dispõe de tempo de CPU livre, o contêiner pode alocar tanta CPU quanto necessária para suas requisições.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Seu cluster precisa ter ao menos 1 CPU disponível para uso, a fim de executar as tarefas de exemplos.

Alguns dos passos nesta página requerem que você execute o serviço [`metrics-server`](https://github.com/kubernetes-sigs/metrics-server) no seu cluster. Se você já tiver o `metrics-server` executando, você pode pular estes passos.

Se você estiver executando {{< glossary_tooltip term_id="minikube" >}}, execute o comando a seguir para habilitar o `metrics-server`:

```shell
minikube addons enable metrics-server
```

Para ver se o `metrics-server` (ou outro fornecedor de API de métricas de recursos, `metrics.k8s.io`) está executando, digite o comando seguinte:

```shell
kubectl get apiservices
```

Se a API de métricas de recursos estiver disponível, a saída incluirá a referência à `metrics.k8s.io`.


```
NAME
v1beta1.metrics.k8s.io
```


<!-- steps -->

## Crie um namespace

Crie um {{< glossary_tooltip term_id="namespace" >}}, assim os seus recursos criados neste exercício estarão isolados do resto do seu cluster.

```shell
kubectl create namespace cpu-example
```

## Especifique requisitos de CPU e limites de CPU

Para especificar os requisitos de CPU para um contêiner, inclua o campo `resources:requests` no manifesto de recursos do Contêiner. Para especificar o limite de CPU, inclua `resources:limits`.

Neste exercício, você cria um Pod que tem um contêiner. O contêiner tem um requisito de 0,5 CPU e o limite de 1 CPU. Aqui está o arquivo de configuração do Pod:

{{< codenew file="pods/resource/cpu-request-limit.yaml" >}}

A seção `args` do arquivo de configuração fornece parâmetros para o contêiner quando ele inicia.
O parâmetro `-cpus "2"` diz ao Contêiner para tentar usar 2 CPUs.


Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit.yaml --namespace=cpu-example
```

Verifique se o Pod está executando:

```shell
kubectl get pod cpu-demo --namespace=cpu-example
```

Ver informação detalhada sobre o Pod:

```shell
kubectl get pod cpu-demo --output=yaml --namespace=cpu-example
```

A saída mostra que este contêiner no Pod tem um requisito de CPU de 500 miliCPU e um limite de CPU de 1 CPU.

```yaml
resources:
  limits:
    cpu: "1"
  requests:
    cpu: 500m
```
Use `kubectl top` para buscar as métricas do pod:


```shell
kubectl top pod cpu-demo --namespace=cpu-example
```

Este exemplo de saída mostra que o Pod está usando 974 miliCPU, 
que é ligeiramente menor que o limite de 1 CPU especificado na configuração do Pod.

```
NAME                        CPU(cores)   MEMORY(bytes)
cpu-demo                    974m         <something>
```

Lembre-se que ao especificar `-cpu "2"`, você configurou o Contêiner para tentar 
usar 2 CPUs, mas o Contêiner está apenas habilitado a usar cerca de 1 CPU. 
O uso de CPU dos contêineres está sendo limitado, 
porque o contêiner está tentando usar mais recursos de CPU que o seu limite. 

{{< note >}}
Outra possível explicação para o uso de CPU estar abaixo de 1,0, é que o Nó 
não dispõe de recuros de CPU suficientes disponíveis. Lembre-se que o pré-requisito 
para este exercício, é que o seu cluster tenha disponível ao menos 1 CPU para uso. 
Se o seu Contêiner executa em um Nó que tem apenas 1 CPU, o Contêiner não pode usar 
mais que 1 CPU, sem contar o limite de CPU especificado para o Contêiner. 

{{< /note >}}

## Unidades de CPU

Os recursos de CPU são medidos em unidades de *CPU*. Uma CPU, em Kubernetes, é equivalente a:

* 1 AWS vCPU
* 1 GCP Core
* 1 Azure vCore
* 1 Hyperthread em um processador Intel bare-metal com Hyperthreading


Valores fracionários são aceitos. Ao Contêiner que requer 0,5 CPU é garantido 
pelo menos a metade da CPU que um Contêiner que requer 1 CPU. 
Você pode usar o sufixo m para representar mili. Por exemplo 100m CPU, 100 miliCPU, 
e 0,1 CPU são todas a mesma. Precisão menor que 1m não é aceita.

CPU é sempre requisitada como uma quantidade absoluta, nunca como uma quantidade relativa; 0,1 é a mesma quantidade de CPU em uma máquina single-core, dual-core, ou 48-core.

Apague seu Pod:

```shell
kubectl delete pod cpu-demo --namespace=cpu-example
```

## Especifique um requisito de CPU que é muito grande para seus Nós

Requisitos e limites de CPU são associados aos Contêineres, mas é útil pensar num Pod como tendo requisito e limite de CPU. O requisito de CPU para um Pod é a soma dos requisitos de CPU de todos os Contêineres no Pod. Da mesma forma, o limite de CPU para um Pod é a soma dos limites de CPU para todos os Contêineres no Pod. 

O agendamento do Pod é baseado em requisições. Um Pod é agendado para executar em um Nó, somente se o Nó possuir suficiente recursos de CPU disponíveis para satisfazer os requisitos de CPU do Pod.

Neste exercício, você cria um Pod que tem um requisito de CPU tão grande, que excede a capacidade de qualquer Nó em seu cluster. Aqui está o arquivo de configuração para o Pod que tem um Contêiner. O Contêiner requer 100 CPU, que provávelmente excede a capacidade de qualquer Nó em seu cluster.

{{< codenew file="pods/resource/cpu-request-limit-2.yaml" >}}


Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/cpu-request-limit-2.yaml --namespace=cpu-example
```

Veja o status do Pod:


```shell
kubectl get pod cpu-demo-2 --namespace=cpu-example
```

A saída mostra que o status do Pod é `Pending`, demonstrando que o Pod não está 
agendado para executar em qualquer Nó, e permanecerá no estado Pendente indefinidamente.


```
NAME         READY     STATUS    RESTARTS   AGE
cpu-demo-2   0/1       Pending   0          7m
```

Para ver informações detalhadas sobre o Pod, incluindo eventos:


```shell
kubectl describe pod cpu-demo-2 --namespace=cpu-example
```

A saída mostra que o Contêiner não pode ser agendado devido a insuficiência 
de recursos de CPU nos Nós: 


```
Events:
  Reason                        Message
  ------                        -------
  FailedScheduling      No nodes are available that match all of the following predicates:: Insufficient cpu (3).
```

Apague seu Pod:

```shell
kubectl delete pod cpu-demo-2 --namespace=cpu-example
```

## Se você não especificar um limite de CPU

Se você não especificar o limite de CPU para um Contêiner, então uma destas 
situações se aplica:

* O Contêiner não possui limite superior de recursos de CPU que possa usar. 
O Contêiner poderia usar todos os recursos de CPU disponíveis no Nó em que estiver executando. 


* O Contêiner está executando em um namespace que tem um limite de CPU padrão, 
e ao Contêiner é atribuído o limite padrão automaticamente. 
Administradores de cluster podem usar [LimitRange](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#limitrange-v1-core/) 
para especificar o valor padrão do limite de CPU.


## Se você especificar um limite de CPU mas não especificar o requisito de CPU


Se você especificar o limite de CPU para um Contêiner mas não especificar 
os requisitos de CPU, o Kubernetes automaticamente irá atribuir os requisitos 
de CPU que correspondem ao limite. Similarmente, se o Contêiner especifica 
seu próprio limite de CPU mas não especifica os requisitos de CPU, 
o kubernetes automáticamente atribui os requisitos de CPU que correspondem ao limite.

## Motivos para usar requisitos e limites de CPU

Ao configurar os requisitos de CPU e limites dos Contêneres que executam no seu cluster, 
você faz um uso eficiente dos recursos de CPU disponívies nos Nós do seu cluster. 
Mantendo baixos os recursos de CPU de um Pod, você proporciona ao Pod uma boa chance 
de ser agendado. Ao especificar um limite de CPU que é maior que os requisitos de CPU, 
você estará realizando duas coisas: 

* o Pod pode ter estouros de atividade quando estiver fazendo uso de recursos de CPU 
que deveriam estar disponíveis.
* O total de recursos de CPU que um Pod pode usar durante um estouro é limitado 
a uma quantidade razoável.

## Limpeza

Apague seu namespace:

```shell
kubectl delete namespace cpu-example
```



## {{% heading "whatsnext" %}}



### Para desenvolvedores de App

* [Atribuindo Recursos de Memória a Contêineres e Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Configurando Qualidade dos Serviços aos Pods](/docs/tasks/configure-pod-container/quality-service-pod/)

### Para administradores de cluster

* [Configurando Requisitos e Limites de Memória Padrão para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configurando Requisitos e Limites de CPU para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configurando Restrições de Memória Mínima e Máxima para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configurando Restrições de CPU Mínima e Máxima para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configurando Quotas de Memória e CPU para um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configurando Quota para um Pod em um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configurando Quotas para Objetos de API](/docs/tasks/administer-cluster/quota-api-object/)

