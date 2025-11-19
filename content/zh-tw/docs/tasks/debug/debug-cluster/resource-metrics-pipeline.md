---
title: 資源指標管道
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

對於 Kubernetes，**Metrics API** 提供了一組基本的指標，以支持自動伸縮和類似的用例。
該 API 提供有關節點和 Pod 的資源使用情況的信息，
包括 CPU 和內存的指標。如果將 Metrics API 部署到叢集中，
那麼 Kubernetes API 的客戶端就可以查詢這些信息，並且可以使用 Kubernetes 的訪問控制機制來管理權限。

[HorizontalPodAutoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/) (HPA) 和
[VerticalPodAutoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) (VPA)
使用 metrics API 中的數據調整工作負載副本和資源，以滿足客戶需求。

你也可以通過 [`kubectl top`](/docs/reference/generated/kubectl/kubectl-commands#top) 命令來查看資源指標。

{{< note >}}
<!--
The Metrics API, and the metrics pipeline that it enables, only offers the minimum
CPU and memory metrics to enable automatic scaling using HPA and / or VPA.
If you would like to provide a more complete set of metrics, you can complement
the simpler Metrics API by deploying a second
[metrics pipeline](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/#full-metrics-pipeline)
that uses the _Custom Metrics API_.
-->
Metrics API 及其啓用的指標管道僅提供最少的 CPU 和內存指標，以啓用使用 HPA 和/或 VPA 的自動擴展。
如果你想提供更完整的指標集，你可以通過部署使用 **Custom Metrics API**
的第二個[指標管道](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/#full-metrics-pipeline)來作爲簡單的
Metrics API 的補充。
{{< /note >}}

<!--
Figure 1 illustrates the architecture of the resource metrics pipeline.
-->
圖 1 說明了資源指標管道的架構。

{{< mermaid >}}
flowchart RL
subgraph cluster[叢集]
direction RL
S[ <br><br> ]
A[Metrics-<br>Server]
subgraph B[節點]
direction TB
D[cAdvisor] --> C[kubelet]
E[容器<br>運行時] --> D
E1[容器<br>運行時] --> D
P[Pod 數據] -.- C
end
L[API<br>伺服器]
W[HPA]
C ---->|節點層面<br>資源指標| A -->|metrics<br>API| L --> W
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
圖 1. 資源指標管道

圖中從右到左的架構組件包括以下內容：

* [cAdvisor](https://github.com/google/cadvisor): 用於收集、聚合和公開 Kubelet 中包含的容器指標的守護程序。
* [kubelet](/zh-cn/docs/concepts/architecture/#kubelet): 用於管理容器資源的節點代理。
  可以使用 `/metrics/resource` 和 `/stats` kubelet API 端點訪問資源指標。
* [節點層面資源指標](/zh-cn/docs/reference/instrumentation/node-metrics): kubelet 提供的 API，用於發現和檢索可通過 `/metrics/resource` 端點獲得的每個節點的彙總統計信息。
* [metrics-server](#metrics-server): 叢集插件組件，用於收集和聚合從每個 kubelet 中提取的資源指標。
  API 伺服器提供 Metrics API 以供 HPA、VPA 和 `kubectl top` 命令使用。Metrics Server 是 Metrics API 的參考實現。
* [Metrics API](#metrics-api): Kubernetes API 支持訪問用於工作負載自動縮放的 CPU 和內存。
  要在你的叢集中進行這項工作，你需要一個提供 Metrics API 的 API 擴展伺服器。

  <!--
  cAdvisor supports reading metrics from cgroups, which works with typical container runtimes on Linux.
  If you use a container runtime that uses another resource isolation mechanism, for example
  virtualization, then that container runtime must support
  [CRI Container Metrics](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-container-stats.md)
  in order for metrics to be available to the kubelet.
  -->
  {{< note >}}
  cAdvisor 支持從 cgroups 讀取指標，它適用於 Linux 上的典型容器運行時。
  如果你使用基於其他資源隔離機制的容器運行時，例如虛擬化，那麼該容器運行時必須支持
  [CRI 容器指標](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/cri-container-stats.md)
  以便 kubelet 可以使用指標。
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

metrics-server 實現了 Metrics API。此 API 允許你訪問叢集中節點和 Pod 的 CPU 和內存使用情況。
它的主要作用是將資源使用指標提供給 K8s 自動縮放器組件。

下面是一個 `minikube` 節點的 Metrics API 請求示例，通過 `jq` 管道處理以便於閱讀：

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/nodes/minikube" | jq '.'
```

<!--
Here is the same API call using `curl`:
-->
這是使用 `curl` 來執行的相同 API 調用：

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/nodes/minikube
```

<!--
Sample response:
-->
響應示例：

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
下面是一個 `kube-system` 命名空間中的 `kube-scheduler-minikube` Pod 的 Metrics API 請求示例，
通過 `jq` 管道處理以便於閱讀：

```shell
kubectl get --raw "/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube" | jq '.'
```

<!--
Here is the same API call using `curl`:
-->
這是使用 `curl` 來完成的相同 API 調用：

```shell
curl http://localhost:8080/apis/metrics.k8s.io/v1beta1/namespaces/kube-system/pods/kube-scheduler-minikube
```

<!--
Sample response:
-->
響應示例：

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
Metrics API 在 [k8s.io/metrics](https://github.com/kubernetes/metrics) 代碼庫中定義。
你必須啓用 [API 聚合層](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)併爲 
`metrics.k8s.io` API 註冊一個 [APIService](/zh-cn/docs/reference/kubernetes-api/cluster-resources/api-service-v1/)。

要了解有關 Metrics API 的更多信息，
請參閱資源 [Resource Metrics API Design](https://git.k8s.io/design-proposals-archive/instrumentation/resource-metrics-api.md)、
[metrics-server 代碼庫](https://github.com/kubernetes-sigs/metrics-server) 和
[Resource Metrics API](https://github.com/kubernetes/metrics#resource-metrics-api)。

{{< note >}}
<!--
You must deploy the metrics-server or alternative adapter that serves the Metrics API to be able
to access it.
-->
你必須部署提供 Metrics API 服務的 metrics-server 或其他適配器才能訪問它。
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
## 度量資源用量   {#measuring-resource-usage}

### CPU

CPU 報告爲以 cpu 爲單位測量的平均核心使用率。在 Kubernetes 中，
一個 cpu 相當於雲提供商的 1 個 vCPU/Core，以及裸機 Intel 處理器上的 1 個超線程。

該值是通過對內核提供的累積 CPU 計數器（在 Linux 和 Windows 內核中）取一個速率得出的。
用於計算 CPU 的時間窗口顯示在 Metrics API 的窗口字段下。

要了解更多關於 Kubernetes 如何分配和測量 CPU 資源的信息，請參閱
[CPU 的含義](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-cpu)。

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
### 內存  {#memory}

內存報告爲在收集度量標準的那一刻的工作集大小，以字節爲單位。

在理想情況下，“工作集”是在內存壓力下無法釋放的正在使用的內存量。
然而，工作集的計算因主機操作系統而異，並且通常大量使用啓發式算法來產生估計。

Kubernetes 模型中，容器工作集是由容器運行時計算的與相關容器關聯的匿名內存。
工作集指標通常還包括一些緩存（文件支持）內存，因爲主機操作系統不能總是回收頁面。

要了解有關 Kubernetes 如何分配和測量內存資源的更多信息，
請參閱[內存的含義](/zh-cn/docs/concepts/configuration/manage-resources-containers/#meaning-of-memory)。

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
## Metrics 伺服器    {#metrics-server}

metrics-server 從 kubelet 中獲取資源指標，並通過 Metrics API 在 Kubernetes API 伺服器中公開它們，以供 HPA 和 VPA 使用。
你還可以使用 `kubectl top` 命令查看這些指標。

metrics-server 使用 Kubernetes API 來跟蹤叢集中的節點和 Pod。metrics-server 伺服器通過 HTTP 查詢每個節點以獲取指標。
metrics-server 還構建了 Pod 元數據的內部視圖，並維護 Pod 健康狀況的緩存。
緩存的 Pod 健康信息可通過 metrics-server 提供的擴展 API 獲得。

例如，對於 HPA 查詢，metrics-server 需要確定哪些 Pod 滿足 Deployment 中的標籤選擇器。

<!--
The metrics-server calls the [kubelet](/docs/reference/command-line-tools-reference/kubelet/) API
to collect metrics from each node. Depending on the metrics-server version it uses:

* Metrics resource endpoint `/metrics/resource` in version v0.6.0+ or
* Summary API endpoint `/stats/summary` in older versions
-->
metrics-server 調用 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) API
從每個節點收集指標。根據它使用的 metrics-server 版本：

* 版本 v0.6.0+ 中，使用指標資源端點 `/metrics/resource`
* 舊版本中使用 Summary  API 端點 `/stats/summary`

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
瞭解更多 metrics-server，參閱 [metrics-server 代碼庫](https://github.com/kubernetes-sigs/metrics-server)。

你還可以查看以下內容：

* [metrics-server 設計](https://git.k8s.io/design-proposals-archive/instrumentation/metrics-server.md)
* [metrics-server FAQ](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md)
* [metrics-server known issues](https://github.com/kubernetes-sigs/metrics-server/blob/master/KNOWN_ISSUES.md)
* [metrics-server releases](https://github.com/kubernetes-sigs/metrics-server/releases)
* [水平自動擴縮](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)

<!--
To learn about how the kubelet serves node metrics, and how you can access those via
the Kubernetes API, read [Node Metrics Data](/docs/reference/instrumentation/node-metrics).
-->
若要了解 kubelet 如何提供節點指標以及你可以如何通過 Kubernetes API 訪問這些指標，
請閱讀[節點指標數據](/zh-cn/docs/reference/instrumentation/node-metrics)。
