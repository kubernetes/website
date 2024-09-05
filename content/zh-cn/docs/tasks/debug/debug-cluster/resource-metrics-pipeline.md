---
title: 资源指标管道
content_type: concept
weight: 15
---
<!--
reviewers:
- fgrzadkowski
- piosz
title: Resource metrics pipeline
content_type: concept
weight: 15
-->

<!-- overview -->

<!--
For Kubernetes, the _Metrics API_ offers a basic set of metrics to support automatic scaling and
similar use cases.  This API makes information available about resource usage for node and pod,
including metrics for CPU and memory.  If you deploy the Metrics API into your cluster, clients of
the Kubernetes API can then query for this information, and you can use Kubernetes' access control
mechanisms to manage permissions to do so.

The [HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)  (HPA) and
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) (VPA)
use data from the metrics API to adjust workload replicas and resources to meet customer demand.

You can also view the resource metrics using the
[`kubectl top`](/docs/reference/generated/kubectl/kubectl-commands#top)
command.
-->

对于 Kubernetes，**Metrics API** 提供了一组基本的指标，以支持自动伸缩和类似的用例。
该 API 提供有关节点和 Pod 的资源使用情况的信息，
包括 CPU 和内存的指标。如果将 Metrics API 部署到集群中，
那么 Kubernetes API 的客户端就可以查询这些信息，并且可以使用 Kubernetes 的访问控制机制来管理权限。

[HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/) (HPA) 和
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) (VPA)
使用 metrics API 中的数据调整工作负载副本和资源，以满足客户需求。

你也可以通过 [`kubectl top`](/docs/reference/generated/kubectl/kubectl-commands#top) 命令来查看资源指标。

{{< note >}}
<!--
The Metrics API, and the metrics pipeline that it enables, only offers the minimum
CPU and memory metrics to enable automatic scaling using HPA and / or VPA.
If you would like to provide a more complete set of metrics, you can complement
the simpler Metrics API by deploying a second
[metrics pipeline](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/#full-metrics-pipeline)
that uses the _Custom Metrics API_.
-->
Metrics API 及其启用的指标管道仅提供最少的 CPU 和内存指标，以启用使用 HPA 和/或 VPA 的自动扩展。
如果你想提供更完整的指标集，你可以通过部署使用 **Custom Metrics API**
的第二个[指标管道](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/#full-metrics-pipeline)来作为简单的
Metrics API 的补充。
{{< /note >}}

<!--
Figure 1 illustrates the architecture of the resource metrics pipeline.
-->
图 1 说明了资源指标管道的架构。

{{< mermaid >}}
flowchart RL
subgraph cluster[集群]
direction RL
S[ <br><br> ]
A[Metrics-<br>Server]
subgraph B[节点]
direction TB
D[cAdvisor] --> C[kubelet]
E[容器<br>运行时] --> D
E1[容器<br>运行时] --> D
P[Pod 数据] -.- C
end
L[API<br>服务器]
W[HPA]
C ---->|节点层面<br>资源指标| A -->|metrics<br>API| L --> W
end
L ---> K[kubectl<br>top]
classDef box fill:#fff,stroke:#000,stroke-width:1px,color:#000;
class W,B,P,K,cluster,D,E,E1 box
classDef spacewhite fill:#ffffff,stroke:#fff,stroke-width:0px,color:#000
class S spacewhite
classDef k8s fill:#326ce5,stroke:#fff,stroke-width:1px,color:#fff;
class A,L,C k8s
{{< /mermaid >}}

<!--
Figure 1. Resource Metrics Pipeline

The architecture components, from right to left in the figure, consist of the following:

* [cAdvisor](https://github.com/google/cadvisor): Daemon for collecting, aggregating and exposing
  container metrics included in Kubelet.
* [kubelet](/docs/concepts/architecture/#kubelet): Node agent for managing container
  resources. Resource metrics are accessible using the `/metrics/resource` and `/stats` kubelet
  API endpoints.
* [node level resource metrics](/docs/reference/instrumentation/node-metrics): API provided by the kubelet for discovering and retrieving
  per-node summarized stats available through the `/metrics/resource` endpoint.
* [metrics-server](#metrics-server): Cluster addon component that collects and aggregates resource
  metrics pulled from each kubelet. The API server serves Metrics API for use by HPA, VPA, and by
  the `kubectl top` command. Metrics Server is a reference implementation of the Metrics API.
* [Metrics API](#metrics-api): Kubernetes API supporting access to CPU and memory used for
  workload autoscaling. To make this work in your cluster, you need an API extension server that
  provides the Metrics API.
-->
图 1. 资源指标管道

图中从右到左的架构组件包括以下内容：

* [cAdvisor](https://github.com/google/cadvisor): 用于收集、聚合和公开 Kubelet 中包含的容器指标的守护程序。
* [kubelet](/zh-cn/docs/concepts/architecture/#kubelet): 用于管理容器资源的节点代理。
  可以使用 `/metrics/resource` 和 `/stats` kubelet API 端点访问资源指标。
* [节点层面资源指标](/zh-cn/docs/reference/instrumentation/node-metrics): kubelet 提供的 API，用于发现和检索可通过 `/metrics/resource` 端点获得的每个节点的汇总统计信息。
* [metrics-server](#metrics-server): 集群插件组件，用于收集和聚合从每个 kubelet 中提取的资源指标。
  API 服务器提供 Metrics API 以供 HPA、VPA 和 `kubectl top` 命令使用。Metrics Server 是 Metrics API 的参考实现。
* [Metrics API](#metrics-api): Kubernetes API 支持访问用于工作负载自动缩放的 CPU 和内存。
  要在你的集群中进行这项工作，你需要一个提供 Metrics API 的 API 扩展服务器。

  <!--
  cAdvisor supports reading metrics from cgroups, which works with typical container runtimes on Linux.
  If you use a container runtime that uses another resource isolation mechanism, for example
  virtualization, then that container runtime must support
  [CRI Container Metrics](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-container-stats.md)
  in order for metrics to be available to the kubelet.
  -->
  {{< note >}}
  cAdvisor 支持从 cgroups 读取指标，它适用于 Linux 上的典型容器运行时。
  如果你使用基于其他资源隔离机制的容器运行时，例如虚拟化，那么该容器运行时必须支持
  [CRI 容器指标](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-container-stats.md)
  以便 kubelet 可以使用指标。
  {{< /note >}}

<!-- body -->

<!--
## Metrics API

The metrics-server implements the Metrics API. This API allows you to access CPU and memory usage
for the nodes and pods in your cluster. Its primary role is to feed resource usage metrics to K8s
autoscaler components.

Here is an example of the Metrics API request for a `minikube` node piped through `jq` for easier
reading:
-->
## Metrics API   {#metrics-api}

{{< feature-state for_k8s_version="1.8" state="beta" >}}

metrics-server 实现了 Metrics API。此 API 允许你访问集群中节点和 Pod 的 CPU 和内存使用情况。
它的主要作用是将资源使用指标提供给 K8s 自动缩放器组件。

下面是一个 `minikube` 节点的 Metrics API 请求示例，通过 `jq` 管道处理以便于阅读：

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/nodes/minikube" | jq '.'
```

<!--
Here is the same API call using `curl`:
-->
这是使用 `curl` 来执行的相同 API 调用：

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/nodes/minikube
```

<!--
Sample response:
-->
响应示例：

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

<!--
Here is an example of the Metrics API request for a `kube-scheduler-minikube` pod contained in the
`kube-system` namespace and piped through `jq` for easier reading:
-->
下面是一个 `kube-system` 命名空间中的 `kube-scheduler-minikube` Pod 的 Metrics API 请求示例，
通过 `jq` 管道处理以便于阅读：

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube" | jq '.'
```

<!--
Here is the same API call using `curl`:
-->
这是使用 `curl` 来完成的相同 API 调用：

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube
```

<!--
Sample response:
-->
响应示例：

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

<!--
The Metrics API is defined in the [k8s.io/metrics](https://github.com/kubernetes/metrics)
repository. You must enable the [API aggregation layer](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
and register an [APIService](/docs/reference/kubernetes-api/cluster-resources/api-service-v1/)
for the `metrics.k8s.io` API.

To learn more about the Metrics API, see [resource metrics API design](https://git.k8s.io/design-proposals-archive/instrumentation/resource-metrics-api.md),
the [metrics-server repository](https://github.com/kubernetes-sigs/metrics-server) and the
[resource metrics API](https://github.com/kubernetes/metrics#resource-metrics-api).
-->
Metrics API 在 [k8s.io/metrics](https://github.com/kubernetes/metrics) 代码库中定义。
你必须启用 [API 聚合层](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)并为 
`metrics.k8s.io` API 注册一个 [APIService](/zh-cn/docs/reference/kubernetes-api/cluster-resources/api-service-v1/)。

要了解有关 Metrics API 的更多信息，
请参阅资源 [Resource Metrics API Design](https://git.k8s.io/design-proposals-archive/instrumentation/resource-metrics-api.md)、
[metrics-server 代码库](https://github.com/kubernetes-sigs/metrics-server) 和
[Resource Metrics API](https://github.com/kubernetes/metrics#resource-metrics-api)。

{{< note >}}
<!--
You must deploy the metrics-server or alternative adapter that serves the Metrics API to be able
to access it.
-->
你必须部署提供 Metrics API 服务的 metrics-server 或其他适配器才能访问它。
{{< /note >}}

<!--
## Measuring resource usage

### CPU

CPU is reported as the average core usage measured in cpu units. One cpu, in Kubernetes, is
equivalent to 1 vCPU/Core for cloud providers, and 1 hyper-thread on bare-metal Intel processors.

This value is derived by taking a rate over a cumulative CPU counter provided by the kernel (in
both Linux and Windows kernels). The time window used to calculate CPU is shown under window field
in Metrics API.

To learn more about how Kubernetes allocates and measures CPU resources, see
[meaning of CPU](/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu).
-->
## 度量资源用量   {#measuring-resource-usage}

### CPU

CPU 报告为以 cpu 为单位测量的平均核心使用率。在 Kubernetes 中，
一个 cpu 相当于云提供商的 1 个 vCPU/Core，以及裸机 Intel 处理器上的 1 个超线程。

该值是通过对内核提供的累积 CPU 计数器（在 Linux 和 Windows 内核中）取一个速率得出的。
用于计算 CPU 的时间窗口显示在 Metrics API 的窗口字段下。

要了解更多关于 Kubernetes 如何分配和测量 CPU 资源的信息，请参阅
[CPU 的含义](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)。

<!--
### Memory

Memory is reported as the working set, measured in bytes, at the instant the metric was collected.

In an ideal world, the "working set" is the amount of memory in-use that cannot be freed under
memory pressure. However, calculation of the working set varies by host OS, and generally makes
heavy use of heuristics to produce an estimate.

The Kubernetes model for a container's working set expects that the container runtime counts
anonymous memory associated with the container in question. The working set metric typically also
includes some cached (file-backed) memory, because the host OS cannot always reclaim pages.

To learn more about how Kubernetes allocates and measures memory resources, see
[meaning of memory](/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory).
-->
### 内存  {#memory}

内存报告为在收集度量标准的那一刻的工作集大小，以字节为单位。

在理想情况下，“工作集”是在内存压力下无法释放的正在使用的内存量。
然而，工作集的计算因主机操作系统而异，并且通常大量使用启发式算法来产生估计。

Kubernetes 模型中，容器工作集是由容器运行时计算的与相关容器关联的匿名内存。
工作集指标通常还包括一些缓存（文件支持）内存，因为主机操作系统不能总是回收页面。

要了解有关 Kubernetes 如何分配和测量内存资源的更多信息，
请参阅[内存的含义](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)。

<!--
## Metrics Server

The metrics-server fetches resource metrics from the kubelets and exposes them in the Kubernetes
API server through the Metrics API for use by the HPA and VPA. You can also view these metrics
using the `kubectl top` command.

The metrics-server uses the Kubernetes API to track nodes and pods in your cluster. The
metrics-server queries each node over HTTP to fetch metrics. The metrics-server also builds an
internal view of pod metadata, and keeps a cache of pod health. That cached pod health information
is available via the extension API that the metrics-server makes available.

For example with an HPA query, the metrics-server needs to identify which pods fulfill the label
selectors in the deployment.
-->
## Metrics 服务器    {#metrics-server}

metrics-server 从 kubelet 中获取资源指标，并通过 Metrics API 在 Kubernetes API 服务器中公开它们，以供 HPA 和 VPA 使用。
你还可以使用 `kubectl top` 命令查看这些指标。

metrics-server 使用 Kubernetes API 来跟踪集群中的节点和 Pod。metrics-server 服务器通过 HTTP 查询每个节点以获取指标。
metrics-server 还构建了 Pod 元数据的内部视图，并维护 Pod 健康状况的缓存。
缓存的 Pod 健康信息可通过 metrics-server 提供的扩展 API 获得。

例如，对于 HPA 查询，metrics-server 需要确定哪些 Pod 满足 Deployment 中的标签选择器。

<!--
The metrics-server calls the [kubelet](/docs/reference/command-line-tools-reference/kubelet/) API
to collect metrics from each node. Depending on the metrics-server version it uses:

* Metrics resource endpoint `/metrics/resource` in version v0.6.0+ or
* Summary API endpoint `/stats/summary` in older versions
-->
metrics-server 调用 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) API
从每个节点收集指标。根据它使用的 metrics-server 版本：

* 版本 v0.6.0+ 中，使用指标资源端点 `/metrics/resource`
* 旧版本中使用 Summary  API 端点 `/stats/summary`

## {{% heading "whatsnext" %}}

<!--
To learn more about the metrics-server, see the
[metrics-server repository](https://github.com/kubernetes-sigs/metrics-server).

You can also check out the following:

* [metrics-server design](https://git.k8s.io/design-proposals-archive/instrumentation/metrics-server.md)
* [metrics-server FAQ](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)
* [metrics-server known issues](https://github.com/kubernetes-sigs/metrics-server/blob/master/KNOWN_ISSUES.md)
* [metrics-server releases](https://github.com/kubernetes-sigs/metrics-server/releases)
* [Horizontal Pod Autoscaling](/docs/tasks/run-application/horizontal-pod-autoscale/)
-->
了解更多 metrics-server，参阅 [metrics-server 代码库](https://github.com/kubernetes-sigs/metrics-server)。

你还可以查看以下内容：

* [metrics-server 设计](https://git.k8s.io/design-proposals-archive/instrumentation/metrics-server.md)
* [metrics-server FAQ](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)
* [metrics-server known issues](https://github.com/kubernetes-sigs/metrics-server/blob/master/KNOWN_ISSUES.md)
* [metrics-server releases](https://github.com/kubernetes-sigs/metrics-server/releases)
* [水平自动扩缩](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)

<!--
To learn about how the kubelet serves node metrics, and how you can access those via
the Kubernetes API, read [Node Metrics Data](/docs/reference/instrumentation/node-metrics).
-->
若要了解 kubelet 如何提供节点指标以及你可以如何通过 Kubernetes API 访问这些指标，
请阅读[节点指标数据](/zh-cn/docs/reference/instrumentation/node-metrics)。
