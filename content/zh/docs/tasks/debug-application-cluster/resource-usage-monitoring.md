---
reviewers:
- mikedanese
content_template: templates/concept
title: 资源监控工具
---

<!--
---
reviewers:
- mikedanese
content_template: templates/concept
title: Tools for Monitoring Resources
---
-->

{{% capture overview %}}

<!--
To scale an application and provide a reliable service, you need to
understand how the application behaves when it is deployed. You can examine
application performance in a Kubernetes cluster by examining the containers,
[pods](/docs/user-guide/pods), [services](/docs/user-guide/services), and
the characteristics of the overall cluster. Kubernetes provides detailed
information about an application's resource usage at each of these levels.
This information allows you to evaluate your application's performance and
where bottlenecks can be removed to improve overall performance.
-->

要扩展应用程序并提供可靠的服务，您需要了解应用程序部署时的行为。
您可以通过检查容器、[pod](/docs/user-guide/pods)、[服务](/docs/user-guide/services) 和整个集群的特性来检查 Kubernetes 集群中的应用程序性能。
Kubernetes 在每一个级别上提供了关于应用程序资源使用的详细信息。
此信息允许您评估应用程序的性能，以及在何处可以消除瓶颈以提高整体性能。

{{% /capture %}}

{{% capture body %}}

<!--
In Kubernetes, application monitoring does not depend on a single monitoring
solution. On new clusters, you can use two separate pipelines to collect
monitoring statistics by default:
-->

在 Kubernetes 中，应用程序监控不依赖单个监控解决方案。
默认情况下，新集群上可以使用两个单独的管道来收集监控统计信息：

<!--
- The [**resource metrics pipeline**](#resource-metrics-pipeline) provides a limited set of metrics related
  to cluster components such as the HorizontalPodAutoscaler controller, as well
  as the `kubectl top` utility. These metrics are collected by
  [metrics-server](https://github.com/kubernetes-incubator/metrics-server)
  and are exposed via the `metrics.k8s.io` API. `metrics-server` discovers
  all nodes on the cluster and queries each node's [Kubelet](/docs/admin/kubelet)
  for CPU and memory usage. The Kubelet fetches the data from
  [cAdvisor](https://github.com/google/cadvisor). `metrics-server` is a
  lightweight short-term in-memory store.
-->

- [**资源度量管道**](#resource-metrics-pipeline)提供了一组与集群组件（如 HorizontalPodautoScaler 控制器）以及 `kubectl top` 实用程序相关的有限度量。
  这些度量由[度量服务器](https://github.com/kubernetes-incubator/metrics-server)收集，并通过 `metrics.k8s.io` API 公开。
  `度量服务器`发现群集中的所有节点，并查询每个节点的 [Kubelet](/docs/admin/kubelet) 以获取 CPU 和内存使用情况。
  Kubelet 从 [cAdvisor](https://github.com/google/cadvisor) 获取数据。
  `度量服务器`是一个轻量级的短期内存存储。

<!--
- A [**full metrics pipeline**](#full-metrics-pipelines), such as Prometheus, gives you access to richer
  metrics. In addition, Kubernetes can respond to these metrics by automatically
  scaling or adapting the cluster based on its current state, using mechanisms
  such as the Horizontal Pod Autoscaler. The monitoring pipeline fetches
  metrics from the Kubelet, and then exposes them to Kubernetes via an adapter
  by implementing either the `custom.metrics.k8s.io` or
  `external.metrics.k8s.io` API.
-->

- 一个[**完整度量管道**](#full-metrics-pipelines)，如 Prometheus，可以让您访问更丰富的度量。
  此外，Kubernetes 还可以根据集群的当前状态，使用 Pod 水平自动扩缩器等机制，通过自动调用扩展或调整集群来响应这些度量。
  监控管道从 kubelet 获取度量，然后通过适配器将它们公开给 Kubernetes，方法是实现 `custom.metrics.k8s.io` 或 `external.metrics.k8s.io` API。

<!--
## Resource metrics pipeline
-->

## 资源度量管道


### Kubelet

<!--
The Kubelet acts as a bridge between the Kubernetes master and the nodes. It manages the pods and containers running on a machine. Kubelet translates each pod into its constituent containers and fetches individual container usage statistics from cAdvisor. It then exposes the aggregated pod resource usage statistics via a REST API.
-->

Kubelet充当 Kubernetes 主节点和节点之间的桥梁。
它管理机器上运行的 Pod 和容器。
Kubelet 将每个 Pod 转换为它的组成容器，并从 cAdvisor 获取各个容器的使用统计信息。然后它通过一个 REST API 公开聚合的 Pod 资源使用统计信息。

### cAdvisor

<!--
cAdvisor is an open source container resource usage and performance analysis agent. It is purpose-built for containers and supports Docker containers natively. In Kubernetes, cAdvisor is integrated into the Kubelet binary. cAdvisor auto-discovers all containers in the machine and collects CPU, memory, filesystem, and network usage statistics. cAdvisor also provides the overall machine usage by analyzing the 'root' container on the machine.
-->

cAdvisor 是一个开源容器资源使用和性能分析代理。
它是专门为容器构造的，并原生支持 Docker 容器。
在 Kubernetes 中，cAdvisor 被集成到了 kubelet 二进制文件中。
cAdvisor 自动发现机器中的所有容器，并收集 CPU、内存、文件系统和网络使用统计信息。
cAdvisor 还通过分析机器上的 'root' 容器来提供机器的总体使用情况。

<!--
On most Kubernetes clusters, cAdvisor exposes a simple UI for on-machine containers on port 4194. Here is a snapshot of part of cAdvisor's UI that shows the overall machine usage:
-->

在大多数 Kubernetes 集群中，cAdvisor 在端口 4194 上为机上容器提供了一个简单的用户界面。以下是 cAdvisor 的部分用户界面的快照，其中显示了机器的总体使用情况：

![cAdvisor](/images/docs/cadvisor.png)

<!--
## Full metrics pipelines
-->

## 完整度量管道

<!--
Many full metrics solutions exist for Kubernetes.
-->

现有许多用于 Kubernetes 的完整度量解决方案。

### Prometheus

<!--
[Prometheus](https://prometheus.io) can natively monitor kubernetes, nodes, and prometheus itself.
The [Prometheus Operator](https://coreos.com/operators/prometheus/docs/latest/)
simplifies Prometheus setup on Kubernetes, and allows you to serve the
custom metrics API using the
[Prometheus adapter](https://github.com/directxman12/k8s-prometheus-adapter).
Prometheus provides a robust query language and a built-in dashboard for
querying and visualizing your data. Prometheus is also a supported
data source for [Grafana](https://prometheus.io/docs/visualization/grafana/).
-->

[Prometheus](https://prometheus.io) 可以原生监控 Kubernetes、节点和 Prometheus 自身。
[Prometheus Operator](https://coreos.com/operators/prometheus/docs/latest/) 简化了 Kubernetes 上的 Prometheus 安装，并允许您使用 [Prometheus adapter](https://github.com/directxman12/k8s-prometheus-adapter) 为自定义度量 API 提供支持。
Prometheus 提供了一种强大的查询语言和一个内置的仪表板，用于查询和可视化您的数据。
Prometheus 也是支持 [Grafana](https://prometheus.io/docs/visualization/grafana/) 的数据源。

### Google Cloud Monitoring

<!--
Google Cloud Monitoring is a hosted monitoring service you can use to
visualize and alert on important metrics in your application. can collect
metrics from Kubernetes, and you can access them
using the [Cloud Monitoring Console](https://app.google.stackdriver.com/).
You can create and customize dashboards to visualize the data gathered
from your Kubernetes cluster.
-->

Google Cloud Monitoring 是一个托管的监控服务，您可以使用它对应用程序中的重要指标进行可视化和警报。
可以从 Kubernetes 收集度量，并且可以使用 [Cloud Monitoring Console](https://app.google.stackdriver.com/) 访问它们。
您可以创建和自定义仪表板，从而可视化从您的 Kubernetes 集群中收集的数据。

<!--
This video shows how to configure and run a Google Cloud Monitoring backed Heapster:
-->

下面的视频介绍了如何配置和运行 Google Cloud Monitoring 支持的 Heapster：


[![how to setup and run a Google Cloud Monitoring backed Heapster](https://img.youtube.com/vi/xSMNR2fcoLs/0.jpg)](https://www.youtube.com/watch?v=xSMNR2fcoLs)


{{< figure src="/images/docs/gcm.png" alt="Google Cloud Monitoring dashboard example" title="Google Cloud Monitoring dashboard example" caption="This dashboard shows cluster-wide resource usage." >}}

<!--
## CronJob monitoring
-->

## CronJob 监控

### Kubernetes Job Monitor

<!--
With the [Kubernetes Job Monitor](https://github.com/pietervogelaar/kubernetes-job-monitor) dashboard a Cluster Administrator can see which jobs are running and view the status of completed jobs.
-->

使用 [Kubernetes Job Monitor](https://github.com/pietervogelaar/kubernetes-job-monitor) 仪表板，集群管理员可以看到哪些 job 在运行以及查看已完成 job 的状态。

<!--
### New Relic Kubernetes monitoring integration
-->

### New Recil Kubernetes 监控集成

<!--
[New Relic Kubernetes](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/kubernetes-monitoring-integration) integration provides increased visibility into the performance of your Kubernetes environment. New Relic's Kubernetes integration instruments the container orchestration layer by reporting metrics from Kubernetes objects. The integration gives you insight into your Kubernetes nodes, namespaces, deployments, replica sets, pods, and containers.
-->

[New Relic Kubernetes](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/kubernetes-monitoring-integration)集成提高了对 Kubernetes 环境性能的可视性。
New Relic 的 Kubernetes 集成通过报告来自 Kubernetes 对象的指标，为容器编排层提供参数。
该集成让您可以深入了解 Kubernetes 节点、名称空间、部署、副本集、pod 和容器。

<!--
Marquee capabilities:
View your data in pre-built dashboards for immediate insight into your Kubernetes environment.
Create your own custom queries and charts in Insights from automatically reported data.
Create alert conditions on Kubernetes data.
Learn more on this [page](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/kubernetes-monitoring-integration).
-->

移动文字功能：
在预构建的仪表板中查看数据，以便立即了解 Kubernetes 环境信息。
根据自动报告的数据创建自己的自定义查询和图表。
对 Kubernetes 数据创建警告条件。
进一步了解该功能请参考这个[页面](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/kubernetes-monitoring-integration)。


{{% /capture %}}
