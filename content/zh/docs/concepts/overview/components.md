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
---
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
---
-->

<!--
When you deploy Kubernetes, you get a cluster.
{< glossary_definition term_id="cluster" length="all" prepend="A Kubernetes cluster consists of">}}

This document outlines the various components you need to have
a complete and working Kubernetes cluster.

Here's the diagram of a Kubernetes cluster with all the components tied together.

![Components of Kubernetes](/images/docs/components-of-kubernetes.png)
-->
<!-- overview -->
当你部署完 Kubernetes, 即拥有了一个完整的集群。
{{< glossary_definition term_id="cluster" length="all" prepend="一个 Kubernetes 集群包含">}}

本文档概述了交付正常运行的 Kubernetes 集群所需的各种组件。

这张图表展示了包含所有相互关联组件的 Kubernetes 集群。

![Components of Kubernetes](/images/docs/components-of-kubernetes.png)



<!-- body -->
<!--
## Control Plane Components
-->
## 控制平面组件（Control Plane Components）

<!--
The Control Plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events (for example, starting up a new {{< glossary_tooltip text="pod" term_id="pod">}} when a deployment's `replicas` field is unsatisfied).
 -->
控制平面的组件对集群做出全局决策(比如调度)，以及检测和响应集群事件（例如，当不满足部署的 `replicas` 字段时，启动新的 {{< glossary_tooltip text="pod" term_id="pod">}}）。

<!--
Control Plane components can be run on any machine in the cluster. However,
for simplicity, set up scripts typically start all Control Plane components on
the same machine, and do not run user containers on this machine. See
[Building High-Availability Clusters](/docs/admin/high-availability/) for an example multi-master-VM setup.
 -->
控制平面组件可以在集群中的任何节点上运行。然而，为了简单起见，设置脚本通常会在同一个计算机上启动所有控制平面组件，并且不会在此计算机上运行用户容器。请参阅[构建高可用性集群](/docs/admin/high-availability/)中对于多主机 VM 的设置示例。

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

<!--
These controllers include:

  * Node Controller: Responsible for noticing and responding when nodes go down.
  * Replication Controller: Responsible for maintaining the correct number of pods for every replication
  controller object in the system.
  * Endpoints Controller: Populates the Endpoints object (that is, joins Services & Pods).
  * Service Account & Token Controllers: Create default accounts and API access tokens for new namespaces.
-->
这些控制器包括:

* 节点控制器（Node Controller）: 负责在节点出现故障时进行通知和响应。
* 副本控制器（Replication Controller）: 负责为系统中的每个副本控制器对象维护正确数量的 Pod。
* 端点控制器（Endpoints Controller）: 填充端点(Endpoints)对象(即加入 Service 与 Pod)。
* 服务帐户和令牌控制器（Service Account & Token Controllers）: 为新的命名空间创建默认帐户和 API 访问令牌.

<!--
### cloud-controller-manager
-->
### 云控制器管理器-(cloud-controller-manager)

<!--
[cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/) runs controllers that interact with the underlying cloud providers. The cloud-controller-manager binary is an alpha feature introduced in Kubernetes release 1.6.
-->
[cloud-controller-manager](/docs/tasks/administer-cluster/running-cloud-controller/) 运行与基础云提供商交互的控制器。cloud-controller-manager 二进制文件是 Kubernetes 1.6 版本中引入的 alpha 功能。

<!--
cloud-controller-manager runs cloud-provider-specific controller loops only. You must disable these controller loops in the kube-controller-manager. You can disable the controller loops by setting the `--cloud-provider` flag to `external` when starting the kube-controller-manager.
-->
cloud-controller-manager 仅运行云提供商特定的控制器循环。您必须在 kube-controller-manager 中禁用这些控制器循环，您可以通过在启动 kube-controller-manager 时将 `--cloud-provider` 参数设置为 `external` 来禁用控制器循环。

<!--
cloud-controller-manager allows the cloud vendor's code and the Kubernetes code to evolve independently of each other. In prior releases, the core Kubernetes code was dependent upon cloud-provider-specific code for functionality. In future releases, code specific to cloud vendors should be maintained by the cloud vendor themselves, and linked to cloud-controller-manager while running Kubernetes.
-->
cloud-controller-manager 允许云供应商的代码和 Kubernetes 代码彼此独立地发展。在以前的版本中，核心的 Kubernetes 代码依赖于特定云提供商的代码来实现功能。在将来的版本中，云供应商专有的代码应由云供应商自己维护，并与运行 Kubernetes 的云控制器管理器相关联。

<!--
The following controllers have cloud provider dependencies:

  * Node Controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
  * Route Controller: For setting up routes in the underlying cloud infrastructure
  * Service Controller: For creating, updating and deleting cloud provider load balancers
  * Volume Controller: For creating, attaching, and mounting volumes, and interacting with the cloud provider to orchestrate volumes
-->
以下控制器具有云提供商依赖性:

  * 节点控制器（Node Controller）: 用于检查云提供商以确定节点是否在云中停止响应后被删除
  * 路由控制器（Route Controller）: 用于在底层云基础架构中设置路由
  * 服务控制器（Service Controller）: 用于创建、更新和删除云提供商负载均衡器
  * 数据卷控制器（Volume Controller）: 用于创建、附加和装载卷、并与云提供商进行交互以编排卷

<!--
## Node Components
-->
## Node 组件

<!--
Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.
-->
节点组件在每个节点上运行，维护运行的 Pod 并提供 Kubernetes 运行环境。

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

### kube-proxy

{{< glossary_definition term_id="kube-proxy" length="all" >}}

<!--
### Container Runtime
-->
### 容器运行环境(Container Runtime)

{{< glossary_definition term_id="container-runtime" length="all" >}}

<!--
## Addons
-->
## 插件(Addons)

<!--
Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc)
to implement cluster features. Because these are providing cluster-level features, namespaced resources
for addons belong within the `kube-system` namespace.
-->
插件使用 Kubernetes 资源 ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}等) 实现集群功能。因为这些提供集群级别的功能，所以插件的命名空间资源属于 `kube-system` 命名空间。

<!--
Selected addons are described below; for an extended list of available addons, please
see [Addons](/docs/concepts/cluster-administration/addons/).
-->
所选的插件如下所述：有关可用插件的扩展列表，请参见[插件 (Addons)](/docs/concepts/cluster-administration/addons/)。

### DNS

<!--
While the other addons are not strictly required, all Kubernetes clusters should have [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment, which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.
-->
尽管并非严格要求其他附加组件，但所有示例都依赖[集群 DNS](/docs/concepts/services-networking/dns-pod-service/)，因此所有 Kubernetes 集群都应具有 DNS。

除了您环境中的其他 DNS 服务器之外，集群 DNS 还是一个 DNS 服务器，它为 Kubernetes 服务提供 DNS 记录。

Cluster DNS 是一个 DNS 服务器，和您部署环境中的其他 DNS 服务器一起工作，为 Kubernetes 服务提供DNS记录。

Kubernetes 启动的容器自动将 DNS 服务器包含在 DNS 搜索中。

<!--
### Web UI (Dashboard)
-->
### 用户界面(Dashboard)

<!--
[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.
-->
[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) 是 Kubernetes 集群的通用基于 Web 的 UI。它使用户可以管理集群中运行的应用程序以及集群本身并进行故障排除。

<!--
### Container Resource Monitoring
-->
### 容器资源监控

<!--
[Container Resource Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring/) records generic time-series metrics
about containers in a central database, and provides a UI for browsing that data.
-->
[容器资源监控](/docs/tasks/debug-application-cluster/resource-usage-monitoring/)将关于容器的一些常见的时间序列度量值保存到一个集中的数据库中，并提供用于浏览这些数据的界面。

<!--
### Cluster-level Logging
-->
### 集群层面日志

<!--
A [Cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible for
saving container logs to a central log store with search/browsing interface.
-->
[集群层面日志](/docs/concepts/cluster-administration/logging/) 机制负责将容器的日志数据保存到一个集中的日志存储中，该存储能够提供搜索和浏览接口。


## {{% heading "whatsnext" %}}

<!--
* Learn about [Nodes](/docs/concepts/architecture/nodes/)
* Learn about [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/)
* Read etcd's official [documentation](https://etcd.io/docs/)
-->
* 进一步了解 [Nodes](/docs/concepts/architecture/nodes/)
* 进一步了解 [kube-scheduler](/docs/concepts/scheduling/kube-scheduler/)
* 阅读 etcd 官方[文档](https://etcd.io/docs/)
