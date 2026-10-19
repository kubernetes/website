---
title: Pipeline de métricas de recursos
content_type: concept
weight: 15
---

<!-- overview -->

Para o Kubernetes, a _API de Métricas_ oferece um conjunto básico de métricas para dar suporte ao escalonamento automático e
casos de uso similares. Esta API disponibiliza informações sobre o uso de recursos para nó e pod, incluindo métricas para CPU e memória.
Se você implantar a API de Métricas em seu cluster, os clientes da API do Kubernetes podem então consultar essas informações,
e você pode usar os mecanismos de controle de acesso do Kubernetes para gerenciar permissões ao fazê-lo.

O [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) (HPA) e o
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) (VPA)
usam dados da API de métricas para ajustar réplicas e recursos de cargas de trabalho para atender à demanda do cliente.

Você também pode visualizar as métricas de recursos usando o comando
[`kubectl top`](/docs/reference/generated/kubectl/kubectl-commands#top).

{{< note >}}
A API de Métricas e o pipeline de métricas que ela habilita oferecem apenas as métricas mínimas
de CPU e memória para habilitar o escalonamento automático usando HPA e/ou VPA.
Se você quiser fornecer um conjunto mais completo de métricas, você pode complementar
a API de Métricas mais simples implantando um segundo
[pipeline de métricas](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/#full-metrics-pipeline)
que usa a *API de Métricas Personalizadas*.
{{< /note >}}


A Figura 1 ilustra a arquitetura do pipeline de métricas de recursos.

{{< mermaid >}}
flowchart RL
subgraph cluster[Cluster]
direction RL
S[ <br><br> ]
A[Metrics-<br>Server]
subgraph B[Nós]
direction TB
D[cAdvisor] --> C[kubelet]
E[Agente de execução<br>do contêiner] --> D
E1[Agente de execução<br>do contêiner] --> D
P[dados do pod] -.- C
end
L[Servidor<br>de API]
W[HPA]
C ---->|métricas de recursos<br>no nível do nó| A -->|API de<br>métricas| L --> W
end
L ---> K[kubectl<br>top]
classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
class W,B,P,K,cluster,D,E,E1 box
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class S spacewhite
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
class A,L,C k8s
{{< /mermaid >}}

Figura 1. Pipeline de Métricas de Recursos

Os componentes da arquitetura, da direita para a esquerda na figura, consistem no seguinte:

* [cAdvisor](https://github.com/google/cadvisor): Daemon para coletar, agregar e expor
 métricas de contêiner incluído no Kubelet.
* [kubelet](/docs/concepts/architecture/#kubelet): Agente do nó para gerenciar recursos de contêiner.
As métricas de recursos são acessíveis usando os endpoints da API do kubelet `/metrics/resource` e `/stats`.
* [métricas de recursos no nível do nó](/docs/reference/instrumentation/node-metrics): API fornecida pelo kubelet para descobrir e recuperar estatísticas resumidas por nó disponíveis através do endpoint `/metrics/resource`.
* [metrics-server](#metrics-server): Componente complemento do cluster que coleta e agrega métricas de recursos extraídas de cada kubelet. O servidor de API serve a API de Métricas para uso pelo HPA, VPA e pelo comando `kubectl top`. O Metrics Server é uma implementação de referência da API de Métricas.
* [API de Métricas](#metrics-api): API do Kubernetes que oferece suporte ao acesso à CPU e memória usadas para escalonamento automático de cargas de trabalho. Para fazer isso funcionar em seu cluster, você precisa de um servidor de extensão de API que forneça a API de Métricas.

  {{< note >}}
  O cAdvisor oferece suporte à leitura de métricas de cgroups, que funciona com agentes de execução de contêiner típicos no Linux.
  Se você usar um agente de execução de contêiner que usa outro mecanismo de isolamento de recursos, por exemplo
  virtualização, então esse agente de execução de contêiner deve oferecer suporte às
  [Métricas de Contêiner CRI](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-container-stats.md)
  para que as métricas estejam disponíveis para o kubelet.
  {{< /note >}}

<!-- body -->

## API de Métricas
{{< feature-state for_k8s_version="1.8" state="beta" >}}

O metrics-server implementa a API de Métricas. Esta API permite que você acesse o uso de CPU e memória
para os nós e pods em seu cluster. Seu papel principal é fornecer métricas de uso de recursos para os componentes
de escalonamento automático do K8s.

Aqui está um exemplo da solicitação da API de Métricas para um nó `minikube` direcionada através do `jq` para facilitar
a leitura:

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/nodes/minikube" | jq '.'
```

Aqui está a mesma chamada para a API usando `curl`:

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/nodes/minikube
```

Resposta de exemplo:

```json
{
  "kind": "NodeMetrics",
  "apiVersion": "metrics.k8s.io/v1beta1",
  "metadata": {
    "name": "minikube",
    "selfLink": "/apis/metrics.k8s.io/v1beta1/nodes/minikube",
    "creationTimestamp": "2022-01-27T18:48:43Z"
  },
  "timestamp": "2022-01-27T18:48:33Z",
  "window": "30s",
  "usage": {
    "cpu": "487558164n",
    "memory": "732212Ki"
  }
}
```

Aqui está um exemplo da solicitação da API de Métricas para um pod `kube-scheduler-minikube` contido no
namespace `kube-system` e direcionada através do `jq` para facilitar a leitura:

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube" | jq '.'
```

Aqui está a mesma chamada para a API usando `curl`:

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube
```

Resposta de exemplo:

```json
{
  "kind": "PodMetrics",
  "apiVersion": "metrics.k8s.io/v1beta1",
  "metadata": {
    "name": "kube-scheduler-minikube",
    "namespace": "kube-system",
    "selfLink": "/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube",
    "creationTimestamp": "2022-01-27T19:25:00Z"
  },
  "timestamp": "2022-01-27T19:24:31Z",
  "window": "30s",
  "containers": [
    {
      "name": "kube-scheduler",
      "usage": {
        "cpu": "9559630n",
        "memory": "22244Ki"
      }
    }
  ]
}
```

A API de Métricas é definida no repositório [k8s.io/metrics](https://github.com/kubernetes/metrics).
Você deve habilitar a [camada de agregação de API](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
e registrar um [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/)
para a API `metrics.k8s.io`.

Para saber mais sobre a API de Métricas, consulte o [design da API de métricas de recursos](https://git.k8s.io/design-proposals-archive/instrumentation/resource-metrics-api.md),
o [repositório do metrics-server](https://github.com/kubernetes-sigs/metrics-server) e a
[API de métricas de recursos](https://github.com/kubernetes/metrics#resource-metrics-api).

{{< note >}}
Você deve implantar o metrics-server ou adaptador alternativo que serve a API de Métricas para poder
acessá-la.
{{< /note >}}

## Medindo o uso de recursos

### CPU

A CPU é reportada como o uso médio do núcleo medido em unidades de cpu. Uma cpu, no Kubernetes, é
equivalente a 1 vCPU/Núcleo para provedores de nuvem, e 1 hyper-thread em processadores Intel de servidor dedicado.

Este valor é derivado obtendo uma taxa sobre um contador cumulativo de CPU fornecido pelo kernel (em
kernels Linux e Windows). A janela de tempo usada para calcular a CPU é mostrada no campo window
na API de Métricas.

Para saber mais sobre como o Kubernetes aloca e mede recursos de CPU, consulte
[significado da CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).

### Memória

A memória é reportada como o conjunto de trabalho, medido em bytes, no instante em que a métrica foi coletada.

Em um mundo ideal, o "conjunto de trabalho" é a quantidade de memória em uso que não pode ser liberada sob
pressão de memória. No entanto, o cálculo do conjunto de trabalho varia por sistema operacional do host, e geralmente faz
uso pesado de heurísticas para produzir uma estimativa.

O modelo do Kubernetes para o conjunto de trabalho de um contêiner espera que o agente de execução do contêiner conte
a memória anônima associada ao contêiner em questão. A métrica do conjunto de trabalho também inclui tipicamente alguma memória em cache (baseada em arquivo), porque o sistema operacional do host nem sempre pode recuperar páginas.

Para saber mais sobre como o Kubernetes aloca e mede recursos de memória, consulte
[significado da memória](/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory).

## Metrics Server

O metrics-server obtém métricas de recursos dos kubelets e as expõe no servidor de API do Kubernetes
através da API de Métricas para uso pelo HPA e VPA. Você também pode visualizar essas métricas
usando o comando `kubectl top`.

O metrics-server usa a API do Kubernetes para rastrear nós e pods em seu cluster. O
metrics-server consulta cada nó via HTTP para obter métricas. O metrics-server também constrói uma
visão interna dos metadados do pod e mantém um cache da integridade do pod. Essa informação de integridade do pod em cache
está disponível através da API de extensão que o metrics-server disponibiliza.

Por exemplo, com uma consulta HPA, o metrics-server precisa identificar quais pods atendem aos seletores de rótulos
na implantação.

O metrics-server chama a API do [kubelet](/docs/reference/command-line-tools-reference/kubelet/) para
coletar métricas de cada nó. Dependendo da versão do metrics-server ele usa:

* Endpoint de recurso de métricas `/metrics/resource` na versão v0.6.0+ ou
* Endpoint da API de resumo `/stats/summary` em versões mais antigas

## {{% heading "whatsnext" %}}

Para saber mais sobre o metrics-server, consulte o
[repositório do metrics-server](https://github.com/kubernetes-sigs/metrics-server).

Você também pode consultar o seguinte:

* [design do metrics-server](https://git.k8s.io/design-proposals-archive/instrumentation/metrics-server.md)
* [FAQ do metrics-server](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)
* [problemas conhecidos do metrics-server](https://github.com/kubernetes-sigs/metrics-server/blob/master/KNOWN_ISSUES.md)
* [releases do metrics-server](https://github.com/kubernetes-sigs/metrics-server/releases)
* [Escalonamento Automático Horizontal de Pod](/docs/tasks/run-application/horizontal-pod-autoscale/)

Para saber sobre como o kubelet serve métricas do nó e como você pode acessá-las através
da API do Kubernetes, leia [Dados de Métricas do Nó](/docs/reference/instrumentation/node-metrics).
