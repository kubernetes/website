---
content_type: concept
title: 资源监控工具
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
要扩展应用程序并提供可靠的服务，你需要了解应用程序在部署时的行为。
你可以通过检测容器检查 Kubernetes 集群中的应用程序性能，
[Pods](/zh-cn/docs/concepts/workloads/pods), 
[服务](/zh-cn/docs/concepts/services-networking/service/)
和整个集群的特征。
Kubernetes 在每个级别上提供有关应用程序资源使用情况的详细信息。
此信息使你可以评估应用程序的性能，以及在何处可以消除瓶颈以提高整体性能。

<!-- body -->

<!--
In Kubernetes, application monitoring does not depend on a single monitoring solution.
On new clusters, you can use [resource metrics](#resource-metrics-pipeline) or
[full metrics](#full-metrics-pipeline) pipelines to collect monitoring statistics.
-->
在 Kubernetes 中，应用程序监控不依赖单个监控解决方案。
在新集群上，你可以使用[资源度量](#resource-metrics-pipeline)或
[完整度量](#full-metrics-pipeline)管道来收集监视统计信息。

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
## 资源度量管道  {#resource-metrics-pipeline}

资源指标管道提供了一组与集群组件，例如
[Horizontal Pod Autoscaler](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/)
控制器以及 `kubectl top` 实用程序相关的有限度量。
这些指标是由轻量级的、短期、内存存储的
[metrics-server](https://github.com/kubernetes-sigs/metrics-server) 收集的，
通过 `metrics.k8s.io` 公开。

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
度量服务器发现集群中的所有节点，并且查询每个节点的
[kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
以获取 CPU 和内存使用情况。
Kubelet 充当 Kubernetes 主节点与节点之间的桥梁，管理机器上运行的 Pod 和容器。
kubelet 将每个 Pod 转换为其组成的容器，并在容器运行时通过容器运行时接口
获取各个容器使用情况统计信息。
kubelet 从集成的 cAdvisor 获取此信息，以进行旧式 Docker 集成。
然后，它通过 metrics-server Resource Metrics API 公开聚合的 pod 资源使用情况统计信息。
该 API 在 kubelet 的经过身份验证和只读的端口上的 `/metrics/resource/v1beta1` 中提供。

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

一个完整度量管道可以让你访问更丰富的度量。
Kubernetes 还可以根据集群的当前状态，使用 Pod 水平自动扩缩器等机制，
通过自动调用扩展或调整集群来响应这些度量。
监控管道从 kubelet 获取度量值，然后通过适配器将它们公开给 Kubernetes，
方法是实现 `custom.metrics.k8s.io` 或 `external.metrics.k8s.io` API。

<!--
[Prometheus](https://prometheus.io), a CNCF project, can natively monitor Kubernetes, nodes, and Prometheus itself.
Full metrics pipeline projects that are not part of the CNCF are outside the scope of Kubernetes documentation.  
-->
[Prometheus](https://prometheus.io) 是一个 CNCF 项目，可以原生监控 Kubernetes、
节点和 Prometheus 本身。
完整度量管道项目不属于 CNCF 的一部分，不在 Kubernetes 文档的范围之内。

