---
title: Configurando Qualidade do Serviço Para Pods
content_type: task
weight: 30
---


<!-- overview -->

Esta página mostra como configurar os Pods para que, a eles sejam atribuídos particularmente classes de
Qualidade de Serviço (QoS). O Kubernetes usa classes QoS para tomar decisões sobre
agendamento e despejo de Pods.




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}




<!-- steps -->

## Classes QoS

Quando o Kubernetes cria um Pod, ele atribui uma dessas classes de QoS ao Pod:

* Guaranteed
* Burstable
* BestEffort

## Crie um namespace

Crie um namespace, assim os seus recursos criados neste exercício estarão 
isolados do resto do seu cluster.

```shell
kubectl create namespace qos-example
```

## Crie um Pod ao qual seja atribuída uma classe de QoS `Guaranteed`

Para que um Pod receba uma classe de QoS `Guaranteed`:

* Todo contêiner no Pod deve ter um limite de memória e um requisito de memória.
* Para cada contêiner no Pod, o limite de memória deve ser igual ao requisito de memória.
* Todo contêiner no Pod deve ter um limite de CPU e um requisito de CPU.
* Para cada contêiner no Pod, o limite de CPU deve ser igual ao requisito de CPU.

Essas restrições se aplicam igualmente a contêineres de inicialização bem como de aplicativos.

Aqui está o arquivo de configuração para um pod que possui um contêiner. O contêiner tem um limite de memória e um requisito de memória, ambos iguais a 200 MiB. O contêiner tem um limite de CPU e uma solicitação de CPU, ambos iguais a 700 miliCPU:

{{% codenew file="pods/qos/qos-pod.yaml" %}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod.yaml --namespace=qos-example
```

Veja informações detalhadas sobre o pod:

```shell
kubectl get pod qos-demo --namespace=qos-example --output=yaml
```

A saída mostra que o Kubernetes forneceu ao pod uma classe de QoS `Guaranteed`. A saída também
verifica se o contêiner do Pod tem um requisito de memória que corresponde ao seu limite de memória, e possui
um requisito de CPU que corresponde ao seu limite de CPU.

```yaml
spec:
  containers:
    ...
    resources:
      limits:
        cpu: 700m
        memory: 200Mi
      requests:
        cpu: 700m
        memory: 200Mi
    ...
status:
  qosClass: Guaranteed
```

{{< note >}}
Se um contêiner especificar seu próprio limite de memória, mas não especificar um requisito de memória, o Kubernetes
automaticamente atribui um requisito de memória que corresponda ao limite. Similarmente, se um contêiner especifica o seu próprio
limite de CPU, mas não especifica um requisito de CPU, o Kubernetes atribui automaticamente uma solicitação de CPU que corresponde
ao limite.
{{< /note >}}

Apague seu Pod:

```shell
kubectl delete pod qos-demo --namespace=qos-example
```

## Crie um Pod ao qual seja atribuída uma classe de QoS `Burstable`

Um Pod recebe uma classe de QoS `Burstable` se:

* O Pod não atende aos critérios para a classe de QoS `Guaranteed`.
* Pelo menos um contêiner no Pod tem um requisito ou limite de memória ou CPU.

Aqui está o arquivo de configuração para um Pod que possui um contêiner. O contêiner tem um limite de memória de 200 MiB
e um requisito de memória de 100 MiB.

{{% codenew file="pods/qos/qos-pod-2.yaml" %}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-2.yaml --namespace=qos-example
```

Veja informações detalhadas sobre o Pod:

```shell
kubectl get pod qos-demo-2 --namespace=qos-example --output=yaml
```

A saída mostra que o Kubernetes forneceu ao pod uma classe de QoS `Burstable`.

```yaml
spec:
  containers:
  - image: nginx
    imagePullPolicy: Always
    name: qos-demo-2-ctr
    resources:
      limits:
        memory: 200Mi
      requests:
        memory: 100Mi
  ...
status:
  qosClass: Burstable
```

Apague seu Pod:

```shell
kubectl delete pod qos-demo-2 --namespace=qos-example
```

## Crie um Pod ao qual seja atribuída uma classe de QoS `BestEffort`

Para que um Pod receba uma classe de QoS `BestEffort`, os contêineres no pod não devem
ter quaisquer requisitos ou limites de CPU ou memória.

Aqui está o arquivo de configuração para um Pod que possui um contêiner. O contêiner não tem requisitos ou limites de memória ou CPU:

{{% codenew file="pods/qos/qos-pod-3.yaml" %}}

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-3.yaml --namespace=qos-example
```

Veja informações detalhadas sobre o Pod:

```shell
kubectl get pod qos-demo-3 --namespace=qos-example --output=yaml
```

A saída mostra que o Kubernetes forneceu ao Pod uma classe de QoS `BestEffort`.

```yaml
spec:
  containers:
    ...
    resources: {}
  ...
status:
  qosClass: BestEffort
```

Apague seu Pod:

```shell
kubectl delete pod qos-demo-3 --namespace=qos-example
```

## Crie um Pod que tenha dois contêineres

Aqui está o arquivo de configuração para um Pod que possui dois contêineres. Um contêiner especifica um requisito de memória de 200 MiB. O outro contêiner não especifica nenhum requisito ou limite.

{{% codenew file="pods/qos/qos-pod-4.yaml" %}}

Observe que este Pod atende aos critérios para a classe de QoS `Burstable`. Isto é, ele não atende aos
critérios para a classe de QoS `Guaranteed`, e um de seus contêineres tem um requisito de memória.

Crie o Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/qos/qos-pod-4.yaml --namespace=qos-example
```

Veja informações detalhadas sobre o Pod:

```shell
kubectl get pod qos-demo-4 --namespace=qos-example --output=yaml
```

A saída mostra que o Kubernetes forneceu ao pod uma classe de QoS `Burstable`:

```yaml
spec:
  containers:
    ...
    name: qos-demo-4-ctr-1
    resources:
      requests:
        memory: 200Mi
    ...
    name: qos-demo-4-ctr-2
    resources: {}
    ...
status:
  qosClass: Burstable
```

Apague seu Pod:

```shell
kubectl delete pod qos-demo-4 --namespace=qos-example
```

## Limpeza

Apague seu namespace:

```shell
kubectl delete namespace qos-example
```



## {{% heading "whatsnext" %}}



### Para desenvolvedores de App

* [Atribuir Recursos de Memória a Contêineres e Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)

* [Atribuir Recursos de CPU a Contêineres e Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)

### Para administradores de cluster

* [Configurar Requisitos e Limites de Memória Padrão Para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)

* [Configurar Requisitos e Limites Padrão de CPU Para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)

* [Configurar Restrições de Memória Mínima e Máxima Para um Namespace](/docs/tasks/administer-cluster/manage-resources/memory-constraint-namespace/)

* [Configurar Restrições Mínimas e Máximas de CPU Para um Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-constraint-namespace/)

* [Configurar Cotas de Memória e CPU Para um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-memory-cpu-namespace/)

* [Configurar uma Cota de Pod Para um Namespace](/docs/tasks/administer-cluster/manage-resources/quota-pod-namespace/)

* [Configurar Cotas Para Objetos de Api](/docs/tasks/administer-cluster/quota-api-object/)

* [Topologia de Controle de Gerenciamento de Politicas em um Nó](/docs/tasks/administer-cluster/topology-manager/)

