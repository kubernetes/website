---
content_type: concept
title: 資源監控工具
---
<!--
reviewers:
- mikedanese
content_type: concept
title: Tools for Monitoring Resources
-->

<!-- overview -->

<!--
To scale an application and provide a reliable service, you need to
understand how the application behaves when it is deployed. You can examine
application performance in a Kubernetes cluster by examining the containers,
[pods](/docs/concepts/workloads/pods/),
[services](/docs/concepts/services-networking/service/), and
the characteristics of the overall cluster. Kubernetes provides detailed
information about an application's resource usage at each of these levels.
This information allows you to evaluate your application's performance and
where bottlenecks can be removed to improve overall performance.
-->
要擴充套件應用程式並提供可靠的服務，你需要了解應用程式在部署時的行為。
你可以透過檢測容器檢查 Kubernetes 叢集中的應用程式效能，
[Pods](/zh-cn/docs/concepts/workloads/pods), 
[服務](/zh-cn/docs/concepts/services-networking/service/)
和整個叢集的特徵。
Kubernetes 在每個級別上提供有關應用程式資源使用情況的詳細資訊。
此資訊使你可以評估應用程式的效能，以及在何處可以消除瓶頸以提高整體效能。

<!-- body -->

<!--
In Kubernetes, application monitoring does not depend on a single monitoring solution.
On new clusters, you can use [resource metrics](#resource-metrics-pipeline) or
[full metrics](#full-metrics-pipeline) pipelines to collect monitoring statistics.
-->
在 Kubernetes 中，應用程式監控不依賴單個監控解決方案。
在新叢集上，你可以使用[資源度量](#resource-metrics-pipeline)或
[完整度量](#full-metrics-pipeline)管道來收集監視統計資訊。

<!--
## Resource metrics pipeline

The resource metrics pipeline provides a limited set of metrics related to
cluster components such as the
[Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale)
controller, as well as the `kubectl top` utility.
These  metrics are collected by the lightweight, short-term, in-memory 
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) and
 are exposed via the `metrics.k8s.io` API. 
-->
## 資源度量管道  {#resource-metrics-pipeline}

資源指標管道提供了一組與叢集元件，例如
[Horizontal Pod Autoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
控制器以及 `kubectl top` 實用程式相關的有限度量。
這些指標是由輕量級的、短期、記憶體儲存的
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) 收集的，
透過 `metrics.k8s.io` 公開。

<!--
metrics-server discovers all nodes on the cluster and 
queries each node's 
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) for CPU and 
memory usage. The kubelet acts as a bridge between the Kubernetes master and 
the nodes, managing the pods and containers running on a machine. The kubelet 
translates each pod into its constituent containers and fetches individual 
container usage statistics from the container runtime through the container 
runtime interface. The kubelet fetches this information from the integrated 
cAdvisor for the legacy Docker integration.  It then exposes the aggregated pod 
resource usage statistics through the metrics-server Resource Metrics API.
This API is served at `/metrics/resource/v1beta1` on the kubelet's authenticated and 
read-only ports. 
-->
度量伺服器發現叢集中的所有節點，並且查詢每個節點的
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
以獲取 CPU 和記憶體使用情況。
Kubelet 充當 Kubernetes 主節點與節點之間的橋樑，管理機器上執行的 Pod 和容器。
kubelet 將每個 Pod 轉換為其組成的容器，並在容器執行時透過容器執行時介面
獲取各個容器使用情況統計資訊。
kubelet 從整合的 cAdvisor 獲取此資訊，以進行舊式 Docker 整合。
然後，它透過 metrics-server Resource Metrics API 公開聚合的 pod 資源使用情況統計資訊。
該 API 在 kubelet 的經過身份驗證和只讀的埠上的 `/metrics/resource/v1beta1` 中提供。

<!--
## Full metrics pipeline

A full metrics pipeline gives you access to richer metrics. Kubernetes can
respond to these metrics by  automatically scaling or adapting the cluster
based on its current state, using mechanisms such as the Horizontal Pod
Autoscaler. The monitoring pipeline fetches metrics from the kubelet and
then exposes them to Kubernetes via an adapter by implementing either the
`custom.metrics.k8s.io` or `external.metrics.k8s.io` API. 
-->
## 完整度量管道  {#full-metrics-pipeline}

一個完整度量管道可以讓你訪問更豐富的度量。
Kubernetes 還可以根據叢集的當前狀態，使用 Pod 水平自動擴縮器等機制，
透過自動呼叫擴充套件或調整叢集來響應這些度量。
監控管道從 kubelet 獲取度量值，然後透過介面卡將它們公開給 Kubernetes，
方法是實現 `custom.metrics.k8s.io` 或 `external.metrics.k8s.io` API。

<!--
[Prometheus](https://prometheus.io), a CNCF project, can natively monitor Kubernetes, nodes, and Prometheus itself.
Full metrics pipeline projects that are not part of the CNCF are outside the scope of Kubernetes documentation.  
-->
[Prometheus](https://prometheus.io) 是一個 CNCF 專案，可以原生監控 Kubernetes、
節點和 Prometheus 本身。
完整度量管道專案不屬於 CNCF 的一部分，不在 Kubernetes 文件的範圍之內。

