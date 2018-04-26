<!--
---
approvers:
- mikedanese
title: Tools for Monitoring Compute, Storage, and Network Resources
---
-->

---
approvers:
- mikedanese
cn-approvers:
- xuyang02965
cn-reviewers:
- xiaosuiba
title: 对计算、存储和网络资源进行监控的工具
---

<!--
Understanding how an application behaves when deployed is crucial to scaling the application and providing a reliable service. In a Kubernetes cluster, application performance can be examined at many different levels: containers, [pods](/docs/user-guide/pods), [services](/docs/user-guide/services), and whole clusters. As part of Kubernetes we want to provide users with detailed resource usage information about their running applications at all these levels. This will give users deep insights into how their applications are performing and where possible application bottlenecks may be found. In comes [Heapster](https://github.com/kubernetes/heapster), a project meant to provide a base monitoring platform on Kubernetes.
-->

理解应用在部署过程中如何运转，对提供可靠的服务和对应用进行扩展是至关重要的。在 Kubernetes 集群中，可以在多个层级对应用进行监测：容器级, [pod 级](/docs/user-guide/pods), [service 级](/docs/user-guide/services), 以及整个集群级。作为 Kubernetes 的一部分，我们从所有这些层面向用户提供他们运行的应用的资源详细使用信息。这样可以使用户对应用如何运行及何处可能发现瓶颈有更深刻的洞见。在[Heapster](https://github.com/kubernetes/heapster)项目中，提供了一个 Kubernetes 上的基础监控平台。

<!--
## Overview

Heapster is a cluster-wide aggregator of monitoring and event data. It currently supports Kubernetes natively and works on all Kubernetes setups. Heapster runs as a pod in the cluster, similar to how any Kubernetes application would run. The Heapster pod discovers all nodes in the cluster and queries usage information from the nodes' [Kubelet](/docs/admin/kubelet/)s, the on-machine Kubernetes agent. The Kubelet itself fetches the data from [cAdvisor](https://github.com/google/cadvisor). Heapster groups the information by pod along with the relevant labels. This data is then pushed to a configurable backend for storage and visualization. Currently supported backends include [InfluxDB](http://influxdb.com/) (with [Grafana](http://grafana.org/) for visualization), [Google Cloud Monitoring](https://cloud.google.com/monitoring/) and many others described in more details [here](https://git.k8s.io/heapster/docs/sink-configuration.md). The overall architecture of the service can be seen below:

![overall monitoring architecture](/images/docs/monitoring-architecture.png)

Let's look at some of the other components in more detail.
-->

## 概述

Heapster 汇聚整个集群范围内的所有监控和事件数据。当前，Heapster 原生支持 Kubernetes 并且可以在所有 Kubernetes 安装中运行。 与普通 Kubernetes 应用类似， Heapster 在集群中以 pod 形式运行。Heapster pod 自动发现集群中所有节点并从节点上运行的 Kubernetes 代理进程 ([Kubelet](/docs/admin/kubelet/)) 中查询资源使用信息。 Kubelet 则从 [cAdvisor](https://github.com/google/cadvisor) 获取数据。Heapster将收集的信息按照 pod 及其相关标签进行分组，然后将其推送到用于存储和可视化的后端中。当前支持的后端包括 [InfluxDB](http://influxdb.com/) (使用 [Grafana](http://grafana.org/) 进行可视化)，[Google Cloud Monitoring](https://cloud.google.com/monitoring/) ，和许多其它的后端（[详情参见](https://git.k8s.io/heapster/docs/sink-configuration.md)）。监控服务整体架构可参见下图:

![监控服务整体架构图](/images/docs/monitoring-architecture.png)

接下来让我们详细了解一下其他组件。

<!--
### cAdvisor

cAdvisor is an open source container resource usage and performance analysis agent. It is purpose-built for containers and supports Docker containers natively. In Kubernetes, cAdvisor is integrated into the Kubelet binary. cAdvisor auto-discovers all containers in the machine and collects CPU, memory, filesystem, and network usage statistics. cAdvisor also provides the overall machine usage by analyzing the 'root' container on the machine.

On most Kubernetes clusters, cAdvisor exposes a simple UI for on-machine containers on port 4194. Here is a snapshot of part of cAdvisor's UI that shows the overall machine usage:

![cAdvisor](/images/docs/cadvisor.png)
-->

### cAdvisor

cAdvisor 是一款开源的容器资源使用和性能分析代理。它是专门为容器构建的并且原生支持 Docker 容器。在 Kubernetes 中，cAdvisor 被集成在 Kubelet 里。它自动发现本机运行的所有容器并且收集 CPU，内存，文件系统和网络资源的使用统计。它也可以通过分析本机运行的 'root' 容器，来提供本机整体的资源使用统计。

在大多数 Kubernetes 集群中，cAdvisor 使用本机的4194端口对外提供了一个查看本机容器监控数据的简单UI。下面是 cAdvisor 展示整机资源使用状况的界面的部分快照：

![cAdvisor](/images/docs/cadvisor.png)

<!--
### Kubelet

The Kubelet acts as a bridge between the Kubernetes master and the nodes. It manages the pods and containers running on a machine. Kubelet translates each pod into its constituent containers and fetches individual container usage statistics from cAdvisor. It then exposes the aggregated pod resource usage statistics via a REST API.
-->

### Kubelet

Kubelet 是连接 Kubernetes mater 和 nodes 的桥梁。它管理着本机运行的 pod 和 容器。Kubelet 从 cAdvisor 获取 pod 中每个容器所用资源的统计信息，然后将该 pod 中所有容器的统计信息进行汇聚，通过 REST API 开放给外部使用。

<!--
## Storage Backends
-->

## 存储后端

<!--
### InfluxDB and Grafana
-->

### InfluxDB 和 Grafana

<!--
A Grafana setup with InfluxDB is a very popular combination for monitoring in the open source world. InfluxDB exposes an easy to use API to write and fetch time series data. Heapster is setup to use this storage backend by default on most Kubernetes clusters. A detailed setup guide can be found [here](https://github.com/GoogleCloudPlatform/heapster/blob/master/docs/influxdb.md). InfluxDB and Grafana run in Pods. The pod exposes itself as a Kubernetes service which is how Heapster discovers it.
-->

Grafana 搭配 InfluxDB 的组合是开源世界十分流行的监控方案。InfluxDB 提供了非常易用的 API 来读写时间序列数据。在大多数 Kubernetes 集群中，Heapster 默认使用它作为存储后端。详细的安装指南请参见[这里](https://github.com/GoogleCloudPlatform/heapster/blob/master/docs/influxdb.md)。InfluxDB 和 Grafana 以 Pod 形态运行并提供相应的 Kubernetes service 给 Heapster 使用。

<!--
The Grafana container serves Grafana's UI which provides an easy to configure dashboard interface. The default dashboard for Kubernetes contains an example dashboard that monitors resource usage of the cluster and the pods inside of it. This dashboard can easily be customized and expanded. Take a look at the storage schema for InfluxDB [here](https://github.com/GoogleCloudPlatform/heapster/blob/master/docs/storage-schema.md#metrics).
-->

Grafana 容器提供 WEB UI 服务，该 UI 提供了配置方便的仪表盘接口。默认的 Kubernetes 仪表盘包含了监控集群整体资源使用和集群内所有 pod 资源使用的样例仪表盘，您可以方便的基于它进行定制或扩展。请在[这里](https://github.com/GoogleCloudPlatform/heapster/blob/master/docs/storage-schema.md#metrics)查看 InfluxDB 的存储 schema。

<!--
Here is a video showing how to monitor a Kubernetes cluster using heapster, InfluxDB and Grafana:

[![How to monitor a Kubernetes cluster using heapster, InfluxDB and Grafana](http://img.youtube.com/vi/SZgqjMrxo3g/0.jpg)](http://www.youtube.com/watch?v=SZgqjMrxo3g)
-->

下面的视频展示了如何使用 heapster, InfluxDB 和 Grafana 来监控 Kubernetes 集群：

[![如何使用 heapster, InfluxDB 和 Grafana 来监控 Kubernetes 集群](http://img.youtube.com/vi/SZgqjMrxo3g/0.jpg)](http://www.youtube.com/watch?v=SZgqjMrxo3g)

<!--
Here is a snapshot of the default Kubernetes Grafana dashboard that shows the CPU and Memory usage of the entire cluster, individual pods and containers:

![snapshot of the default Kubernetes Grafana dashboard](/images/docs/influx.png)
-->

这是一个默认Kubernetes Grafana 仪表盘的快照，它展示了整个集群、单个 pod 和容器的 CPU 与内存使用情况：

![默认Kubernetes Grafana 仪表盘快照](/images/docs/influx.png)

<!--
### Google Cloud Monitoring
-->

### Google Cloud 监控

<!--
Google Cloud Monitoring is a hosted monitoring service that allows you to visualize and alert on important metrics in your application. Heapster can be setup to automatically push all collected metrics to Google Cloud Monitoring. These metrics are then available in the [Cloud Monitoring Console](https://app.google.stackdriver.com/). This storage backend is the easiest to setup and maintain. The monitoring console allows you to easily create and customize dashboards using the exported data.
-->

Google Cloud 监控是一项托管监控服务，它允许您基于应用的重要指标进行可视化和报警。可以配置 Heapster 将收集到的指标数据自动向 Google Cloud 监控推送。推送的指标信息将出现在 [云监控控制台](https://app.google.stackdriver.com/) 。该存储后端是最易于安装和维护的。在监控控制台上您可以轻松的使用导出的数据来创建和定制仪表盘。

<!--
Here is a video showing how to setup and run a Google Cloud Monitoring backed Heapster:

[![how to setup and run a Google Cloud Monitoring backed Heapster](http://img.youtube.com/vi/xSMNR2fcoLs/0.jpg)](http://www.youtube.com/watch?v=xSMNR2fcoLs)
-->

下面的视频展示了如何安装和运行基于 Heapster 的 Google Cloud 监控：

[![如何安装和运行基于 Heapster 的 Google Cloud 监控](http://img.youtube.com/vi/xSMNR2fcoLs/0.jpg)](http://www.youtube.com/watch?v=xSMNR2fcoLs)

<!--
Here is a snapshot of the Google Cloud Monitoring dashboard showing cluster-wide resource usage.

![Google Cloud Monitoring dashboard](/images/docs/gcm.png)
-->

下面是一个Google Cloud 监控仪表盘，它展示了整个集群的资源使用情况。

![Google Cloud 监控仪表盘](/images/docs/gcm.png)

<!--
## Try it out!
-->

## 动手试试吧

<!--
Now that you've learned a bit about Heapster, feel free to try it out on your own clusters! The [Heapster repository](https://github.com/kubernetes/heapster) is available on GitHub. It contains detailed instructions to setup Heapster and its storage backends. Heapster runs by default on most Kubernetes clusters, so you may already have it! Feedback is always welcome. Please let us know if you run into any issues via the troubleshooting [channels](/docs/troubleshooting/).
-->

现在您已经对 Heapster 有了一定的了解，大胆在您的集群中尝试一下吧！在 GitHub 上有[Heapster 仓库](https://github.com/kubernetes/heapster)。其中有安装 Heapster 和对应存储后端的详细指导。Heapster 在大多数 Kubernetes 集群上是默认运行的，所以您的集群里可能已经有了哦！随时欢迎您的反馈，如果在使用过程中遇到任何麻烦，请通过故障处理[通道](/docs/troubleshooting/) 知会我们。

<!--
***
*Authors: Vishnu Kannan and Victor Marmol, Google Software Engineers.*
*This article was originally posted in [Kubernetes blog](http://blog.kubernetes.io/2015/05/resource-usage-monitoring-kubernetes.html).*
-->

***
*作者: Vishnu Kannan 与 Victor Marmol, 谷歌软件工程师.*
*该文最早发布在 [Kubernetes 博客](http://blog.kubernetes.io/2015/05/resource-usage-monitoring-kubernetes.html).*
