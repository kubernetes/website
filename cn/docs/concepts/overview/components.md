<!--
---
approvers:
- lavalamp
title: Kubernetes Components
---
-->
---
approvers:
- lavalamp
title: Kubernetes 组件
---

{% capture overview %}
<!--
This document outlines the various binary components needed to
deliver a functioning Kubernetes cluster.-->
本文档概述了 Kubernetes 所需的各种二进制组件, 用于提供齐全的功能。
{% endcapture %}

{% capture body %}
<!--
## Master Components

Master components provide the cluster's control plane. Master components make global decisions about the
cluster (for example, scheduling), and detecting and responding to cluster events (starting up a new pod when a replication controller's 'replicas' field is unsatisfied).

Master components can be run on any node in the cluster. However,
for simplicity, set up scripts typically start all master components on
the same VM, and do not run user containers on this VM. See
[Building High-Availability Clusters](/docs/admin/high-availability) for an example multi-master-VM setup.
-->
## Master 组件

Master 组件提供的集群控制。Master 组件对集群做出全局性决策(例如：调度)，以及检测和响应集群事件(副本控制器的`replicas`字段不满足时,启动新的副本)。

Master 组件可以在集群中的任何节点上运行。然而，为了简单起见，设置脚本通常会启动同一个虚拟机上所有 Master 组件，并且不会在此虚拟机上运行用户容器。请参阅[构建高可用性群集](/docs/admin/high-availability)示例对于多主机 VM 的设置。
<!--
### kube-apiserver

[kube-apiserver](/docs/admin/kube-apiserver) exposes the Kubernetes API. It is the front-end for the
Kubernetes control plane. It is designed to scale horizontally -- that is, it scales by deploying more instances. See [Building High-Availability Clusters](/docs/admin/high-availability).
-->
### API服务器

[kube-apiserver](/docs/admin/kube-apiserver)对外暴露了Kubernetes API。它是的 Kubernetes 前端控制层。它被设计为水平扩展，即通过部署更多实例来缩放。请参阅[构建高可用性群集](/docs/admin/high-availability).

<!--
### etcd

[etcd](/docs/tasks/administer-cluster/configure-upgrade-etcd) is used as Kubernetes' backing store. All cluster data is stored here. Always have a backup plan for etcd's data for your Kubernetes cluster.
-->
### etcd

[etcd](/docs/tasks/administer-cluster/configure-upgrade-etcd) 用于 Kubernetes 的后端存储。所有集群数据都存储在此处，始终为您的 Kubernetes 集群的 etcd 数据提供备份计划。
<!--
### kube-controller-manager

[kube-controller-manager](/docs/admin/kube-controller-manager) runs controllers, which are the background threads that handle routine tasks in the cluster. Logically, each controller is a separate process, but to reduce complexity, they are all compiled into a single binary and run in a single process.

These controllers include:

  * Node Controller: Responsible for noticing and responding when nodes go down.
  * Replication Controller: Responsible for maintaining the correct number of pods for every replication
  controller object in the system.
  * Endpoints Controller: Populates the Endpoints object (that is, joins Services & Pods).
  * Service Account & Token Controllers: Create default accounts and API access tokens for new namespaces.
-->
### kube-controller-manager

[kube-controller-manager](/docs/admin/kube-controller-manager)运行控制器，它们是处理集群中常规任务的后台线程。逻辑上，每个控制器是一个单独的进程，但为了降低复杂性，它们都被编译成独立的可执行文件，并在单个进程中运行。

这些控制器包括:

* 节点控制器: 当节点移除时，负责注意和响应。
* 副本控制器: 负责维护系统中每个副本控制器对象正确数量的 Pod。
* 端点控制器: 填充 端点(Endpoints) 对象(即连接 Services & Pods)。
* 服务帐户和令牌控制器: 为新的命名空间创建默认帐户和 API 访问令牌。
<!--
### cloud-controller-manager

cloud-controller-manager runs controllers that interact with the underlying cloud providers. The cloud-controller-manager binary is an alpha feature introduced in Kubernetes release 1.6.

cloud-controller-manager runs cloud-provider-specific controller loops only. You must disable these controller loops in the kube-controller-manager. You can disable the controller loops by setting the `--cloud-provider` flag to `external` when starting the kube-controller-manager.

cloud-controller-manager allows cloud vendors code and the Kubernetes core to evolve independent of each other. In prior releases, the core Kubernetes code was dependent upon cloud-provider-specific code for functionality. In future releases, code specific to cloud vendors should be maintained by the cloud vendor themselves, and linked to cloud-controller-manager while running Kubernetes.

The following controllers have cloud provider dependencies:

  * Node Controller: For checking the cloud provider to determine if a node has been deleted in the cloud after it stops responding
  * Route Controller: For setting up routes in the underlying cloud infrastructure
  * Service Controller: For creating, updating and deleting cloud provider load balancers
  * Volume Controller: For creating, attaching, and mounting volumes, and interacting with the cloud provider to orchestrate volumes
-->
### 云控制器管理器-(cloud-controller-manager)

云控制器管理器是用于与底层云提供商交互的控制器。云控制器管理器二进制是 Kubernetes v1.6 版本中引入的 Alpha 功能。

云控制器管理器仅运行云提供商特定的控制器循环。您必须在 kube-controller-manager 中禁用这些控制器循环，您可以通过在启动 kube-controller-manager 时将 `--cloud-provider` 标志设置为`external`来禁用控制器循环。

云控制器管理器允许云供应商代码和 Kubernetes 核心彼此独立发展，在以前的版本中，Kubernetes 核心代码依赖于云提供商特定的功能代码。在未来的版本中，云供应商的特定代码应由云供应商自己维护，并与运行 Kubernetes 的云控制器管理器相关联。

以下控制器具有云提供商依赖关系:

* 节点控制器: 用于检查云提供商以确定节点是否在云中停止响应后被删除
* 路由控制器: 用于在底层云基础架构中设置路由
* 服务控制器: 用于创建，更新和删除云提供商负载平衡器
* 数据卷控制器: 用于创建，附加和装载卷，并与云提供商进行交互以协调卷
<!--
### kube-scheduler

[kube-scheduler](/docs/admin/kube-scheduler) watches newly created pods that have no node assigned, and
selects a node for them to run on.
-->
### 调度器 - (kube-scheduler)

[kube-scheduler](/docs/admin/kube-scheduler)监视没有分配节点的新创建的 Pod，选择一个节点供他们运行。
<!--
### addons

Addons are pods and services that implement cluster features. The pods may be managed
by Deployments, ReplicationControllers, and so on. Namespaced addon objects are created in
the `kube-system` namespace.

Addon manager creates and maintains addon resources. See [here](http://releases.k8s.io/HEAD/cluster/addons) for more details.
-->
### 插件(addons)

插件是实现集群功能的 Pod 和 Service。 Pods 可以通过 Deployments，ReplicationControllers 管理。插件对象本身是受命名空间限制的，被创建于 `kube-system` 命名空间。

Addon 管理器用于创建和维护附加资源. 有关详细信息，请参阅[here](http://releases.k8s.io/HEAD/cluster/addons).
<!--
#### DNS

While the other addons are not strictly required, all Kubernetes clusters should have [cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment, which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.
-->
#### DNS

虽然其他插件并不是必需的，但所有 Kubernetes 集群都应该具有[Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)，许多示例依赖于它。

Cluster DNS 是一个 DNS 服务器，和您部署环境中的其他 DNS 服务器一起工作，为 Kubernetes 服务提供DNS记录。

Kubernetes 启动的容器自动将 DNS 服务器包含在 DNS 搜索中。
<!--
#### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose, web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications running in the cluster, as well as the cluster itself.

-->
#### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) 是 Kubernetes 集群通用基于 Web 的 UI 界面。它允许用户可视化的方式管理集群和集群上的应用程序。

dashboard 提供了集群状态的只读概述。有关更多信息，请参阅[使用HTTP代理访问 Kubernetes API](/docs/tasks/access-kubernetes-api/http-proxy-access-api/)
<!--
#### Container Resource Monitoring

[Container Resource Monitoring](/docs/tasks/debug-application-cluster/resource-usage-monitoring) records generic time-series metrics
about containers in a central database, and provides a UI for browsing that data.
-->
#### 容器资源监控

[容器资源监控](/docs/tasks/debug-application-cluster/resource-usage-monitoring)将关于容器的一些常见的时间序列度量值保存到一个集中的数据库中，并提供用于浏览这些数据的界面。
<!--
#### Cluster-level Logging

A [Cluster-level logging](/docs/concepts/cluster-administration/logging) mechanism is responsible for
saving container logs to a central log store with search/browsing interface.
-->
#### 集群层面日志

[集群层面日志](/docs/concepts/cluster-administration/logging) 机制负责将容器的日志数据保存到一个集中的日志存储中，该存储能够提供搜索和浏览接口。
<!--
## Node components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

### kubelet

[kubelet](/docs/admin/kubelet) is the primary node agent. It watches for pods that have been assigned to its node (either by apiserver or via local configuration file) and:

  * Mounts the pod's required volumes.
  * Downloads the pod's secrets.
  * Runs the pod's containers via docker (or, experimentally, rkt).
  * Periodically executes any requested container liveness probes.
  * Reports the status of the pod back to the rest of the system, by creating a *mirror pod* if necessary.
  * Reports the status of the node back to the rest of the system.
-->
## 节点组件

节点组件在每个节点上运行，维护运行的 Pod 并提供 Kubernetes 运行时环境。

### kubelet

[kubelet](/docs/admin/kubelet)是主要的节点代理,它监测已分配给其节点的 Pod(通过 apiserver 或通过本地配置文件)，提供如下功能:

* 挂载 Pod 所需要的数据卷(Volume)。
* 下载 Pod 的 secrets。
* 通过 Docker 运行(或通过 rkt)运行 Pod 的容器。
* 周期性的对容器生命周期进行探测。
* 如果需要，通过创建 *镜像 Pod（Mirror Pod）* 将 Pod 的状态报告回系统的其余部分。
* 将节点的状态报告回系统的其余部分。
<!--
### kube-proxy

[kube-proxy](/docs/admin/kube-proxy) enables the Kubernetes service abstraction by maintaining
network rules on the host and performing connection forwarding.


### docker

`docker` is used for running containers.

### rkt

`rkt` is supported experimentally for running containers as an alternative to docker.

### supervisord

`supervisord` is a lightweight process monitoring and control system that can be used to keep kubelet and docker
running.

### fluentd

`fluentd` is a daemon which helps provide [cluster-level logging](#cluster-level-logging).
-->
### kube-proxy

[kube-proxy](/docs/admin/kube-proxy)通过维护主机上的网络规则并执行连接转发，实现了Kubernetes服务抽象。

### docker

`Docker` 用于运行容器。

### rkt

支持 `rkt` 运行容器作为 Docker 的试验性替代方案。

### supervisord

`supervisord` 是一个轻量级的进程监控系统，可以用来保证 kubelet 和 docker 运行。

### fluentd

`fluentd` 是一个守护进程，它有助于提供[集群层面日志](#cluster-level-logging) 集群层面的日志。

{% endcapture %}

{% include templates/concept.md %}
