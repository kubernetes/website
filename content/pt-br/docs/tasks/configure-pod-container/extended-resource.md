---
title: Atribuindo Recursos Estendidos a um Contêiner
content_type: task
weight: 40
---

<!-- overview -->

{{< feature-state state="stable" >}}

Esta página mostra como atribuir recursos estendidos a um Contêiner.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Antes de fazer este exercício, faça o exercício em
[Anunciar recursos estendidos para um Nó](/docs/tasks/administer-cluster/extended-resource-node/).
Isso configurará um de seus nós para anunciar um recurso de *dongle*.

<!-- steps -->

## Atribua um recurso estendido a um Pod

Para solicitar um recurso estendido, inclua o campo `resources:requests` no seu 
manifesto do contêiner. Recursos estendidos são totalmente qualificados 
com qualquer domínio fora do `*.kubernetes.io/`. Nomes de recursos estendidos válidos 
tem a forma de `example.com/foo`, onde `example.com` é substituído pelo domínio 
da sua organização e `foo` é um nome descritivo de recurso.

Aqui está o arquivo de configuração para um pod que possui um contêiner:

{{% codenew file="pods/resource/extended-resource-pod.yaml" %}}

No arquivo de configuração, você pode ver que o contêiner solicita 3 *dongles*.

Crie um Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod.yaml
```

Verifique se o pod está em execução:

```shell
kubectl get pod extended-resource-demo
```

Descreva o pod:

```shell
kubectl describe pod extended-resource-demo
```

A saída mostra as solicitações de *dongle*:

```yaml
Limits:
  example.com/dongle: 3
Requests:
  example.com/dongle: 3
```

## Tente criar um segundo Pod

Aqui está o arquivo de configuração para um pod que possui um contêiner. 
O contêiner solicita dois *dongles*.

{{% codenew file="pods/resource/extended-resource-pod-2.yaml" %}}

O Kubernetes não poderá satisfazer o pedido de dois *dongles*, porque o primeiro pod
usou três dos quatro *dongles* disponíveis.

Tente criar um pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/resource/extended-resource-pod-2.yaml
```

Descreva o pod:

```shell
kubectl describe pod extended-resource-demo-2
```

A saída mostra que o pod não pode ser agendado, porque não há nó que tenha
2 *dongles* disponíveis:

```
Conditions:
  Type    Status
  PodScheduled  False
...
Events:
  ...
  ... Warning   FailedScheduling  pod (extended-resource-demo-2) failed to fit in any node
fit failure summary on nodes : Insufficient example.com/dongle (1)
```

Veja o status do pod:

```shell
kubectl get pod extended-resource-demo-2
```

A saída mostra que o Pod foi criado, mas não está programado para ser executado em um nó.
Tem um status de pendente:

```yaml
NAME                       READY     STATUS    RESTARTS   AGE
extended-resource-demo-2   0/1       Pending   0          6m
```

## Limpeza

Exclua os Pods que você criou para este exercício:

```shell
kubectl delete pod extended-resource-demo
kubectl delete pod extended-resource-demo-2
```



## {{% heading "whatsnext" %}}


### Para desenvolvedores de aplicativos

* [Atribuir recursos de memória a contêineres e Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
* [Atribuir recursos de CPU a contêineres e Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Para administradores de cluster

* [Anunciar recursos estendidos para um nó](/docs/tasks/administer-cluster/extended-resource-node/)


