---
title: Eviction iniciada pela API
content_type: concept
weight: 110
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

Você pode solicitar uma eviction chamando a API Eviction diretamente ou programaticamente
usando um cliente do {{<glossary_tooltip term_id="kube-apiserver" text="servidor de API">}}, como o comando `kubectl drain`. Isso
cria um objeto `Eviction`, que faz com que o servidor de API termine o Pod.

As evictions iniciadas pela API respeitam os [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)
configurados por você e o [`terminationGracePeriodSeconds`](/docs/concepts/workloads/pods/pod-lifecycle#pod-termination).

Usar a API para criar um objeto Eviction para um Pod é como realizar uma
operação [`DELETE`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod)
controlada por política no Pod.

## Chamando a API Eviction

Você pode usar um [cliente de linguagem do Kubernetes](/docs/tasks/administer-cluster/access-cluster-api/#programmatic-access-to-the-api)
para acessar a API do Kubernetes e criar um objeto `Eviction`. Para fazer isso, você
envia via POST a operação desejada, semelhante ao exemplo a seguir:

{{< tabs name="Eviction_example" >}}
{{% tab name="policy/v1" %}}
{{< note >}}
A Eviction `policy/v1` está disponível na v1.22+. Use `policy/v1beta1` em versões anteriores.
{{< /note >}}

```json
{
  "apiVersion": "policy/v1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{% tab name="policy/v1beta1" %}}
{{< note >}}
Descontinuado na v1.22 em favor do `policy/v1`
{{< /note >}}

```json
{
  "apiVersion": "policy/v1beta1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

Alternativamente, você pode tentar uma operação de eviction acessando a API usando
`curl` ou `wget`, semelhante ao exemplo a seguir:

```bash
curl -v -H 'Content-type: application/json' https://your-cluster-api-endpoint.example/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

## Como funciona a eviction iniciada pela API

Quando você solicita uma eviction usando a API, o servidor de API executa verificações de
admissão e responde de uma das seguintes maneiras:

* `200 OK`: a eviction é permitida, o subrecurso `Eviction` é criado e
  o Pod é excluído, semelhante ao envio de uma solicitação `DELETE` para a URL do Pod.
* `429 Too Many Requests`: a eviction não é permitida no momento por causa do
  {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}} configurado.
  Você pode tentar a eviction novamente mais tarde. Você também pode ver esta
  resposta devido à limitação de taxa da API.
* `500 Internal Server Error`: a eviction não é permitida porque há um
  erro de configuração, como se múltiplos PodDisruptionBudgets referenciem o mesmo Pod.

Se o Pod que você deseja despejar não fizer parte de uma carga de trabalho que tenha um
PodDisruptionBudget, o servidor de API sempre retorna `200 OK` e permite a
eviction.

Se o servidor de API permitir a eviction, o Pod é excluído da seguinte forma:

1. O recurso `Pod` no servidor de API é atualizado com um timestamp de exclusão,
   após o qual o servidor de API considera o recurso `Pod` como terminado. O
   recurso `Pod` também é marcado com o período de carência (grace period) configurado.
1. O {{<glossary_tooltip term_id="kubelet" text="kubelet">}} no nó onde o Pod local está em execução percebe que o recurso `Pod`
   está marcado para terminação e começa a desligar graciosamente o
   Pod local.
1. Enquanto o kubelet está desligando o Pod, o control plane remove o Pod
   dos objetos {{<glossary_tooltip term_id="endpoint-slice" text="EndpointSlice">}}.
   Como resultado, os controladores não consideram mais o Pod como um objeto válido.
1. Depois que o período de carência do Pod expira, o kubelet encerra forçadamente
   o Pod local.
1. O kubelet informa ao servidor de API para remover o recurso `Pod`.
1. O servidor de API exclui o recurso `Pod`.

## Solução de problemas de evictions travadas

Em alguns casos, suas aplicações podem entrar em um estado quebrado, no qual a API
Eviction só retorna respostas `429` ou `500` até que você intervenha. Isso pode
acontecer se, por exemplo, um ReplicaSet criar pods para a sua aplicação, mas os novos
pods não entrarem em estado `Ready`. Você também pode notar esse comportamento em casos
em que o último Pod despejado tinha um período de carência de terminação longo.

Se você perceber evictions travadas, tente uma das seguintes soluções:

* Interrompa ou pause a operação automatizada que está causando o problema. Investigue a
  aplicação travada antes de reiniciar a operação.
* Espere um pouco e, em seguida, exclua o Pod diretamente do control plane do seu cluster
  em vez de usar a API Eviction.

## {{% heading "whatsnext" %}}

* Aprenda como proteger suas aplicações com um [Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/).
* Aprenda sobre [eviction por pressão de nó (Node-pressure Eviction)](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Aprenda sobre [prioridade e preemptão de Pods (Pod Priority and Preemption)](/pt-br/docs/concepts/scheduling-eviction/pod-priority-preemption/).
