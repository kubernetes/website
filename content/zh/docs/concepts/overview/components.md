---
title: Kubernetes 组件
content_type: concept
description: >
  Kubernetes 集群由代表控制平面的组件和一组称为节点的机器组成。
weight: 20
card:
  name: concepts
  weight: 20
---
<!--
reviewers:
- lavalamp
title: Kubernetes Components
content_type: concept
description: >
  A Kubernetes cluster consists of the components that represent the control plane
  and a set of machines called nodes
weight: 20
card:
  name: concepts
  weight: 20
-->

<!--
When you deploy Kubernetes, you get a cluster.
{{</* glossary_definition term_id="cluster" length="all" prepend="A Kubernetes cluster consists of" */>}}

This document outlines the various components you need to have
a complete and working Kubernetes cluster.

Here's the diagram of a Kubernetes cluster with all the components tied together.

![Components of Kubernetes](/images/docs/components-of-kubernetes.svg)
-->
<!-- overview -->
当你部署完 Kubernetes, 即拥有了一个完整的集群。
{{< glossary_definition term_id="cluster" length="all" prepend="一个 Kubernetes">}}

本文档概述了交付正常运行的 Kubernetes 集群所需的各种组件。

这张图表展示了包含所有相互关联组件的 Kubernetes 集群。

![Kubernetes 组件](/images/docs/components-of-kubernetes.svg)

<!-- body -->

<!--
## Control Plane Components

The control plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events (for example, starting up a new {{< glossary_tooltip text="pod" term_id="pod">}} when a deployment's `replicas` field is unsatisfied).
 -->
## 控制平面组件（Control Plane Components）    {#control-plane-components}

控制平面的组件对集群做出全局决策(比如调度)，以及检测和响应集群事件（例如，当不满足部署的 `replicas` 字段时，启动新的 {{< glossary_tooltip text="pod" term_id="pod">}}）。

<!--
Control plane components can be run on any machine in the cluster. However,
for simplicity, set up scripts typically start all control plane components on
the same machine, and do not run user containers on this machine. See
[Building High-Availability Clusters](/docs/admin/high-availability/) for an example multi-master-VM setup.
 -->
控制平面组件可以在集群中的任何节点上运行。
然而，为了简单起见，设置脚本通常会在同一个计算机上启动所有控制平面组件，并且不会在此计算机上运行用户容器。
请参阅[构建高可用性集群](/zh/docs/setup/production-environment/tools/kubeadm/high-availability/)
中对于多主机 VM 的设置示例。

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

<!--
Some types of these controllers are:

  * Node controller: Responsible for noticing and responding when nodes go down.
  * Job controller: Watches for Job objects that represent one-off tasks, then creates
    Pods to run those tasks to completion.
  * Endpoints controller: Populates the Endpoints object (that is, joins Services & Pods).
  * Service Account & Token controllers: Create default accounts and API access tokens for new namespaces.
-->
这些控制器包括:

* 节点控制器（Node Controller）: 负责在节点出现故障时进行通知和响应
* 任务控制器（Job controller）: 监测代表一次性任务的 Job 对象，然后创建 Pods 来运行这些任务直至完成
* 端点控制器（Endpoints Controller）: 填充端点(Endpoints)对象(即加入 Service 与 Pod)
* 服务帐户和令牌控制器（Service Account & Token Controllers）: 为新的命名空间创建默认帐户和 API 访问令牌

<!--
### cloud-controller-manager

The cloud-controller-manager only runs controllers that are specific to your cloud provider.
If you are running Kubernetes on your own premises, or in a learning environment inside your
own PC, the cluster does not have a cloud controller manager.

As with the kube-controller-manager, the cloud-controller-manager combines several logically
independent control loops into a single binary that you run as a single process. You can
scale horizontally (run more than one copy) to improve performance or to help tolerate failures.

The following controllers can have cloud provider dependencies:

  * Node controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
  * Route controller: For setting up routes in the underlying cloud infrastructure
  * Service controller: For creating, updating and deleting cloud provider load balancers
-->
### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

`cloud-controller-manager` 仅运行特定于云平台的控制回路。
如果你在自己的环境中运行 Kubernetes，或者在本地计算机中运行学习环境，
所部署的环境中不需要云控制器管理器。

与 `kube-controller-manager` 类似，`cloud-controller-manager` 将若干逻辑上独立的
控制回路组合到同一个可执行文件中，供你以同一进程的方式运行。
你可以对其执行水平扩容（运行不止一个副本）以提升性能或者增强容错能力。

下面的控制器都包含对云平台驱动的依赖：

  * 节点控制器（Node Controller）: 用于在节点终止响应后检查云提供商以确定节点是否已被删除
  * 路由控制器（Route Controller）: 用于在底层云基础架构中设置路由
  * 服务控制器（Service Controller）: 用于创建、更新和删除云提供商负载均衡器

<!--
## Node Components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.
-->
## Node 组件  {#node-components}

节点组件在每个节点上运行，维护运行的 Pod 并提供 Kubernetes 运行环境。

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

<!--
### Container Runtime
-->
### 容器运行时（Container Runtime）    {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

<!--
## Addons

Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc)
to implement cluster features. Because these are providing cluster-level features, namespaced resources
for addons belong within the `kube-system` namespace.
-->
## 插件（Addons）    {#addons}

插件使用 Kubernetes 资源（{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}、
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}等）实现集群功能。
因为这些插件提供集群级别的功能，插件中命名空间域的资源属于 `kube-system` 命名空间。

<!--
Selected addons are described below; for an extended list of available addons, please
see [Addons](/docs/concepts/cluster-administration/addons/).
-->
下面描述众多插件中的几种。有关可用插件的完整列表，请参见
[插件（Addons）](/zh/docs/concepts/cluster-administration/addons/)。

<!--
### DNS

While the other addons are not strictly required, all Kubernetes clusters should have [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment, which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.
-->
### DNS   {#dns}

尽管其他插件都并非严格意义上的必需组件，但几乎所有 Kubernetes 集群都应该
有[集群 DNS](/zh/docs/concepts/services-networking/dns-pod-service/)，
因为很多示例都需要 DNS 服务。

集群 DNS 是一个 DNS 服务器，和环境中的其他 DNS 服务器一起工作，它为 Kubernetes 服务提供 DNS 记录。

Kubernetes 启动的容器自动将此 DNS 服务器包含在其 DNS 搜索列表中。

<!--
### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.
-->
### Web 界面（仪表盘）   

[Dashboard](/zh/docs/tasks/access-application-cluster/web-ui-dashboard/) 是Kubernetes 集群的通用的、基于 Web 的用户界面。
它使用户可以管理集群中运行的应用程序以及集群本身并进行故障排除。

<!--
### Container Resource Monitoring

[Container Resource Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) records generic time-series metrics
about containers in a central database, and provides a UI for browsing that data.
-->
### 容器资源监控

[容器资源监控](/zh/docs/tasks/debug-application-cluster/resource-usage-monitoring/)
将关于容器的一些常见的时间序列度量值保存到一个集中的数据库中，并提供用于浏览这些数据的界面。

<!--
### Cluster-level Logging

A [cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible for
saving container logs to a central log store with search/browsing interface.
-->
### 集群层面日志

[集群层面日志](/zh/docs/concepts/cluster-administration/logging/) 机制负责将容器的日志数据
保存到一个集中的日志存储中，该存储能够提供搜索和浏览接口。

## {{% heading "whatsnext" %}}

<!--
* Learn about [Nodes](/docs/concepts/architecture/nodes/)
* Learn about [Controllers](/docs/concepts/architecture/controller/)
* Learn about [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/)
* Read etcd's official [documentation](https://etcd.io/docs/)
-->
* 进一步了解[节点](/zh/docs/concepts/architecture/nodes/)
* 进一步了解[控制器](/zh/docs/concepts/architecture/controller/)
* 进一步了解 [kube-scheduler](/zh/docs/concepts/scheduling-eviction/kube-scheduler/)
* 阅读 etcd 官方[文档](https://etcd.io/docs/)

