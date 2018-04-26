---
approvers:
- crassirostris
- piosz
title: Stackdriver 中的事件
---

<!--
---
approvers:
- crassirostris
- piosz
title: Events in Stackdriver
---
-->



<!--
Kubernetes events are objects that provide insight into what is happening
inside a cluster, such as what decisions were made by scheduler or why some
pods were evicted from the node. You can read more about using events
for debugging your application in the [Application Introspection and Debugging
](/docs/tasks/debug-application-cluster/debug-application-introspection/)
section.
-->

Kubernetes 事件（event）是一种对象（object），用于展示集群内发生的情况，例如调度器做了什么决定，或为什么某些 pod 被从节点中驱逐。可以在 [应用程序自检和调试](/docs/tasks/debug-application-cluster/debug-application-introspection/) 部分中阅读更多关于使用事件调试应用程序的信息。

<!--
Since events are API objects, they are stored in the apiserver on master. To
avoid filling up master's disk, a retention policy is enforced: events are
removed one hour after the last occurrence. To provide longer history
and aggregation capabilities, a third party solution should be installed
to capture events.
-->

由于事件是 API 对象，因此他们存储在 Kuberenetes 主节点（master）上的 apiserver 中。为了避免填满主节点的磁盘，会执行一个保留策略：删除最新事件一小时以前的事件。为了提供更长的历史和聚合能力，应该安装第三方解决方案来捕获事件。 


<!--
This article describes a solution that exports Kubernetes events to
Stackdriver Logging, where they can be processed and analyzed.
-->

本文介绍将 Kubernetes 事件导出到 Stackdriver Logging 的解决方案，并使用 Stackdriver Logging 对事件进行处理和分析。

<!--
**Note:** it is not guaranteed that all events happening in a cluster will be
exported to Stackdriver. One possible scenario when events will not be
exported is when event exporter is not running (e.g. during restart or
upgrade). In most cases it's fine to use events for purposes like setting up
[metrics][sdLogMetrics] and [alerts][sdAlerts], but you should be aware
of the potential inaccuracy.
-->

**注意：** 并不保证集群中发生的所有事件都会导出到 Stackdriver 。一种可能的场景是，当事件导出器（ event exporter ）没有运行时（例如在重启或升级时），事件将不会被导出。在大多数情况下，事件可以用来设置 [metrics][sdLogMetrics] 和 [alerts][sdAlerts] ,但您应该了解潜在的不准确性。

[sdLogMetrics]: https://cloud.google.com/logging/docs/view/logs_based_metrics
[sdAlerts]: https://cloud.google.com/logging/docs/view/logs_based_metrics#creating_an_alerting_policy

* TOC
{:toc}

<!--
## Deployment

### Google Container Engine

In Google Container Engine (GKE), if cloud logging is enabled, event exporter
is deployed by default to the clusters with master running version 1.7 and
higher. To prevent disturbing your workloads, event exporter does not have
resources set and is in the best effort QOS class, which means that it will
be the first to be killed in the case of resource starvation. If you want
your events to be exported, make sure you have enough resources to facilitate
the event exporter pod. This may vary depending on the workload, but on
average, approximately 100Mb RAM and 100m CPU is needed.
-->

## 部署

### Google Container Engine

在 Google Container Engine (GKE) 中，如果启用了 cloud logging ，则默认会将事件导出器部署到 1.7 及更高版本集群的 master 服务器。为了避免影响系统负载，事件导出器并没有设置资源，只是尽力保证 QOS ，这意味着在资源不足的情况下，它将第一个被杀死。如果想持续导出所有事件，请确保给事件导出器 pod 分配足够的资源。这会因负载情况而不同，但平均而言，大约需要 100Mb RAM 和 100m CPU。

<!--
### Deploying to the Existing Cluster

Deploy event exporter to your cluster using the following command:
-->

### 在现有集群中部署

使用如下命令将事件导出器部署到集群：

```shell
kubectl create -f https://k8s.io/docs/tasks/debug-application-cluster/event-exporter-deploy.yaml
```

<!--
Since event exporter accesses the Kubernetes API, it requires permissions to
do so. The following deployment is configured to work with RBAC
authorization. It sets up a service account and a cluster role binding
to allow event exporter to read events. To make sure that event exporter
pod will not be evicted from the node, you can additionally set up resource
requests. As mentioned earlier, 100Mb RAM and 100m CPU should be enough.
-->

由于事件导出器需要访问 Kubernetes API ，因此它需要相应的权限。如下是使用 RBAC 授权的部署。它创建了一个 service account 和 cluster role binding，以允许事件导出器读取事件。为了确保事件导出器不会从节点中逐出，可以另外设置资源需求。如前所述，100Mb RAM 和 100m CPU 应该足够了。


{% include code.html language="yaml" file="event-exporter-deploy.yaml" ghlink="/docs/tasks/debug-application-cluster/event-exporter-deploy.yaml" %}

<!--
## User Guide

Events are exported to the `GKE Cluster` resource in Stackdriver Logging.
You can find them by selecting an appropriate option from a drop-down menu
of available resources:
-->

## 用户指南

事件将会被导出到 Stackdriver Logging 中的 `GKE Cluster` 资源。可以通过从可用资源的下拉菜单中选择对应的选项来找到它们：

<img src="/images/docs/stackdriver-event-exporter-resource.png" alt="Events location in the Stackdriver Logging interface" width="500">

<!--
You can filter based on the event object fields using Stackdriver Logging
[filtering mechanism](https://cloud.google.com/logging/docs/view/advanced_filters).
For example, the following query will show events from the scheduler
about pods from deployment `nginx-deployment`:
-->

可以使用 Stackdriver Logging 中的 [过滤机制](https://cloud.google.com/logging/docs/view/advanced_filters) 基于事件对象字段进行过滤。例如，以下查询将显示 `nginx-deployment` 部署中 pod 的调度事件：

```
resource.type="gke_cluster"
jsonPayload.kind="Event"
jsonPayload.source.component="default-scheduler"
jsonPayload.involvedObject.name:"nginx-deployment"
```

<img src="/images/docs/stackdriver-event-exporter-filter.png" alt="Filtered events in the Stackdriver Logging interface" width="500">
