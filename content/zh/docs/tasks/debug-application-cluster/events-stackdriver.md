---
content_type: concept
title: StackDriver 中的事件
---

<!--
reviewers:
- piosz
- x13n
content_type: concept
title: Events in Stackdriver
-->

<!-- overview -->

<!--
Kubernetes events are objects that provide insight into what is happening
inside a cluster, such as what decisions were made by scheduler or why some
pods were evicted from the node. You can read more about using events
for debugging your application in the [Application Introspection and Debugging
](/docs/tasks/debug-application-cluster/debug-application-introspection/)
section.
-->

Kubernetes 事件是一种对象，它为用户提供了洞察集群内发生的事情的能力，
例如调度程序做出了什么决定，或者为什么某些 Pod 被逐出节点。
你可以在[应用程序自检和调试](/zh/docs/tasks/debug-application-cluster/debug-application-introspection/)
中阅读有关使用事件调试应用程序的更多信息。

<!--
Since events are API objects, they are stored in the apiserver on master. To
avoid filling up master's disk, a retention policy is enforced: events are
removed one hour after the last occurrence. To provide longer history
and aggregation capabilities, a third party solution should be installed
to capture events.
-->
因为事件是 API 对象，所以它们存储在主控节点上的 API 服务器中。
为了避免主节点磁盘空间被填满，将强制执行保留策略：事件在最后一次发生的一小时后将会被删除。
为了提供更长的历史记录和聚合能力，应该安装第三方解决方案来捕获事件。

<!--
This article describes a solution that exports Kubernetes events to
Stackdriver Logging, where they can be processed and analyzed.
-->
本文描述了一个将 Kubernetes 事件导出为 Stackdriver Logging 的解决方案，在这里可以对它们进行处理和分析。

<!--
It is not guaranteed that all events happening in a cluster will be
exported to Stackdriver. One possible scenario when events will not be
exported is when event exporter is not running (e.g. during restart or
upgrade). In most cases it's fine to use events for purposes like setting up
[metrics][sdLogMetrics] and [alerts][sdAlerts], but you should be aware
of the potential inaccuracy.
-->
{{< note >}}
不能保证集群中发生的所有事件都将导出到 Stackdriver。
事件不能导出的一种可能情况是事件导出器没有运行（例如，在重新启动或升级期间）。
在大多数情况下，可以将事件用于设置
[metrics](https://cloud.google.com/logging/docs/view/logs_based_metrics) 和
[alerts](https://cloud.google.com/logging/docs/view/logs_based_metrics#creating_an_alerting_policy)
等目的，但你应该注意其潜在的不准确性。
{{< /note >}}

<!-- body -->

<!--
## Deployment
-->
## 部署  {#deployment}

### Google Kubernetes Engine

<!--
In Google Kubernetes Engine, if cloud logging is enabled, event exporter
is deployed by default to the clusters with master running version 1.7 and
higher. To prevent disturbing your workloads, event exporter does not have
resources set and is in the best effort QOS class, which means that it will
be the first to be killed in the case of resource starvation. If you want
your events to be exported, make sure you have enough resources to facilitate
the event exporter pod. This may vary depending on the workload, but on
average, approximately 100Mb RAM and 100m CPU is needed.
-->

在 Google Kubernetes Engine 中，如果启用了云日志，那么事件导出器默认部署在主节点运行版本为 1.7 及更高版本的集群中。
为了防止干扰你的工作负载，事件导出器没有设置资源，并且处于尽力而为的 QoS 类型中，这意味着它将在资源匮乏的情况下第一个被杀死。
如果要导出事件，请确保有足够的资源给事件导出器 Pod 使用。
这可能会因为工作负载的不同而有所不同，但平均而言，需要大约 100MB 的内存和 100m 的 CPU。

<!--
### Deploying to the Existing Cluster

Deploy event exporter to your cluster using the following command:
-->
### 部署到现有集群

使用下面的命令将事件导出器部署到你的集群：

```shell
kubectl create -f https://k8s.io/examples/debug/event-exporter.yaml
```

<!--
Since event exporter accesses the Kubernetes API, it requires permissions to
do so. The following deployment is configured to work with RBAC
authorization. It sets up a service account and a cluster role binding
to allow event exporter to read events. To make sure that event exporter
pod will not be evicted from the node, you can additionally set up resource
requests. As mentioned earlier, 100Mb RAM and 100m CPU should be enough.
-->

由于事件导出器访问 Kubernetes API，因此它需要权限才能访问。
以下的部署配置为使用 RBAC 授权。
它设置服务帐户和集群角色绑定，以允许事件导出器读取事件。
为了确保事件导出器 Pod 不会从节点中退出，你可以另外设置资源请求。
如前所述，100MB 内存和 100m CPU 应该就足够了。

{{< codenew file="debug/event-exporter.yaml" >}}

<!--
## User Guide

Events are exported to the `GKE Cluster` resource in Stackdriver Logging.
You can find them by selecting an appropriate option from a drop-down menu
of available resources:
-->
## 用户指南   {#user-guide}

事件在 Stackdriver Logging 中被导出到 `GKE Cluster` 资源。
你可以通过从可用资源的下拉菜单中选择适当的选项来找到它们：

<!--
<img src="/images/docs/stackdriver-event-exporter-resource.png" alt="Events location in the Stackdriver Logging interface" width="500">
-->
<img src="/images/docs/stackdriver-event-exporter-resource.png" alt="Stackdriver 日志接口中事件的位置" width="500">

<!--
You can filter based on the event object fields using Stackdriver Logging
[filtering mechanism](https://cloud.google.com/logging/docs/view/advanced_filters).
For example, the following query will show events from the scheduler
about pods from deployment `nginx-deployment`:
-->
你可以使用 Stackdriver Logging 的
[过滤机制](https://cloud.google.com/logging/docs/view/advanced_filters)
基于事件对象字段进行过滤。
例如，下面的查询将显示调度程序中有关 Deployment `nginx-deployment` 中的 Pod 的事件：

```
resource.type="gke_cluster"
jsonPayload.kind="Event"
jsonPayload.source.component="default-scheduler"
jsonPayload.involvedObject.name:"nginx-deployment"
```

{{< figure src="/images/docs/stackdriver-event-exporter-filter.png" alt="在 Stackdriver 接口中过滤的事件" width="500" >}}


