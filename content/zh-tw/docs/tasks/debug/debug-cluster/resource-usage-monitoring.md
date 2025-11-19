---
content_type: concept
title: 資源監控工具
weight: 15
---
<!--
reviewers:
- mikedanese
content_type: concept
title: Tools for Monitoring Resources
weight: 15
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
要擴展應用程序並提供可靠的服務，你需要了解應用程序在部署時的行爲。
你可以通過檢測容器、[Pod](/zh-cn/docs/concepts/workloads/pods)、
[Service](/zh-cn/docs/concepts/services-networking/service/)
和整個集羣的特徵來檢查 Kubernetes 集羣中應用程序的性能。
Kubernetes 在每個級別上提供有關應用程序資源使用情況的詳細信息。
此信息使你可以評估應用程序的性能，以及在何處可以消除瓶頸以提高整體性能。

<!-- body -->

<!--
In Kubernetes, application monitoring does not depend on a single monitoring solution.
On new clusters, you can use [resource metrics](#resource-metrics-pipeline) or
[full metrics](#full-metrics-pipeline) pipelines to collect monitoring statistics.
-->
在 Kubernetes 中，應用程序監控不依賴單個監控解決方案。在新集羣上，
你可以使用[資源度量](#resource-metrics-pipeline)或[完整度量](#full-metrics-pipeline)管道來收集監視統計信息。

<!--
## Resource metrics pipeline

The resource metrics pipeline provides a limited set of metrics related to
cluster components such as the
[Horizontal Pod Autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/)
controller, as well as the `kubectl top` utility.
These  metrics are collected by the lightweight, short-term, in-memory 
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) and
are exposed via the `metrics.k8s.io` API. 
-->
## 資源度量管道  {#resource-metrics-pipeline}

資源指標管道提供了一組與集羣組件，例如
[Horizontal Pod Autoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
控制器以及 `kubectl top` 實用程序相關的有限度量。
這些指標是由輕量級的、短期、內存存儲的
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) 收集，
並通過 `metrics.k8s.io` 公開。

<!--
metrics-server discovers all nodes on the cluster and 
queries each node's 
[kubelet](/docs/reference/command-line-tools-reference/kubelet/) for CPU and 
memory usage. The kubelet acts as a bridge between the Kubernetes master and 
the nodes, managing the pods and containers running on a machine. The kubelet 
translates each pod into its constituent containers and fetches individual 
container usage statistics from the container runtime through the container 
runtime interface. If you use a container runtime that uses Linux cgroups and
namespaces to implement containers, and the container runtime does not publish
usage statistics, then the kubelet can look up those statistics directly
(using code from [cAdvisor](https://github.com/google/cadvisor)).
No matter how those statistics arrive, the kubelet then exposes the aggregated pod
resource usage statistics through the metrics-server Resource Metrics API.
This API is served at `/metrics/resource/v1beta1` on the kubelet's authenticated and 
read-only ports. 
-->
metrics-server 發現集羣中的所有節點，並且查詢每個節點的
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
以獲取 CPU 和內存使用情況。
kubelet 充當 Kubernetes 主節點與節點之間的橋樑，管理機器上運行的 Pod 和容器。
kubelet 將每個 Pod 轉換爲其組成的容器，並通過容器運行時接口從容器運行時獲取各個容器使用情況統計信息。
如果某個容器運行時使用 Linux cgroups 和名字空間來實現容器。
並且這一容器運行時不發佈資源用量統計信息，
那麼 kubelet 可以直接查找這些統計信息（使用來自 [cAdvisor](https://github.com/google/cadvisor) 的代碼）。
無論這些統計信息如何到達，kubelet 都會通過 metrics-server Resource Metrics API 公開聚合的
Pod 資源用量統計信息。
該 API 在 kubelet 的經過身份驗證和只讀的端口上的 `/metrics/resource/v1beta1` 中提供。

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
Kubernetes 還可以根據集羣的當前狀態，使用 Pod 水平自動擴縮器等機制，
通過自動調用擴展或調整集羣來響應這些度量。
監控管道從 kubelet 獲取度量值，然後通過適配器將它們公開給 Kubernetes，
方法是實現 `custom.metrics.k8s.io` 或 `external.metrics.k8s.io` API。

<!--
Kubernetes is designed to work with [OpenMetrics](https://openmetrics.io/), 
which is one of the
[CNCF Observability and Analysis - Monitoring Projects](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring),
built upon and carefully extending [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/)
in almost 100% backwards-compatible ways.
-->
Kubernetes 在設計上保證能夠與 [OpenMetrics](https://openmetrics.io/) 一同使用，
OpenMetrics 是
[CNCF 可觀測性和分析 - 監控項目](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring)之一，
它構建於 [Prometheus 暴露格式](https://prometheus.io/docs/instrumenting/exposition_formats/)之上，
並對其進行了擴展，這些擴展幾乎 100% 向後兼容。

<!--
If you glance over at the
[CNCF Landscape](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring),
you can see a number of monitoring projects that can work with Kubernetes by _scraping_
metric data and using that to help you observe your cluster. It is up to you to select the tool
or tools that suit your needs. The CNCF landscape for observability and analytics includes a
mix of open-source software, paid-for software-as-a-service, and other commercial products.
-->
如果你瀏覽 [CNCF Landscape](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring)，
你可以看到許多監控項目，它們可以用在 Kubernetes 上，**抓取**指標數據並利用這些數據來觀測你的集羣，
選擇哪種工具或哪些工具可以滿足你的需求，這完全取決於你自己。 
CNCF 的可觀測性和分析景觀包括了各種開源軟件、付費的軟件即服務（SaaS）以及其他混合商業產品。

<!--
When you design and implement a full metrics pipeline you can make that monitoring data
available back to Kubernetes. For example, a HorizontalPodAutoscaler can use the processed
metrics to work out how many Pods to run for a component of your workload.
-->
當你設計和實現一個完整的指標監控數據管道時，你可以將監控數據反饋給 Kubernetes。
例如，HorizontalPodAutoscaler 可以使用處理過的指標數據來計算出你的工作負載組件運行了多少個 Pod。

<!--
Integration of a full metrics pipeline into your Kubernetes implementation is outside
the scope of Kubernetes documentation because of the very wide scope of possible
solutions.

The choice of monitoring platform depends heavily on your needs, budget, and technical resources.
Kubernetes does not recommend any specific metrics pipeline; [many options](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring) are available.
Your monitoring system should be capable of handling the [OpenMetrics](https://openmetrics.io/) metrics
transmission standard and needs to be chosen to best fit into your overall design and deployment of
your infrastructure platform. 
-->
將完整的指標管道集成到 Kubernetes 實現中超出了 Kubernetes
文檔的範圍，因爲可能的解決方案具有非常廣泛的範圍。

監控平臺的選擇在很大程度上取決於你的需求、預算和技術資源。
Kubernetes 不推薦任何特定的指標管道；
可使用[許多選項](https://landscape.cncf.io/?group=projects-and-products&view-mode=card#observability-and-analysis--monitoring)。
你的監控系統應能夠處理 [OpenMetrics](https://openmetrics.io/) 指標傳輸標準，
並且需要選擇最適合基礎設施平臺的整體設計和部署。

## {{% heading "whatsnext" %}}

<!--
Learn about additional debugging tools, including:

* [Logging](/docs/concepts/cluster-administration/logging/)
* [Getting into containers via `exec`](/docs/tasks/debug/debug-application/get-shell-running-container/)
* [Connecting to containers via proxies](/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [Connecting to containers via port forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [Inspect Kubernetes node with crictl](/docs/tasks/debug/debug-cluster/crictl/)
-->
瞭解其他調試工具，包括：

* [日誌記錄](/zh-cn/docs/concepts/cluster-administration/logging/)
* [通過 `exec` 進入容器](/zh-cn/docs/tasks/debug/debug-application/get-shell-running-container/)
* [通過代理連接到容器](/zh-cn/docs/tasks/extend-kubernetes/http-proxy-access-api/)
* [通過端口轉發連接到容器](/zh-cn/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* [使用 crictl 檢查 Kubernetes 節點](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)
