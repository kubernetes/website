---
title: "Kubernetes 架构"
weight: 30
description: >
  Kubernetes 背后的架构概念。
---
<!--
title: "Cluster Architecture"
weight: 30
description: >
  The architectural concepts behind Kubernetes.
-->

<!--
A Kubernetes cluster consists of a control plane plus a set of worker machines, called nodes,
that run containerized applications. Every cluster needs at least one worker node in order to run Pods.

The worker node(s) host the Pods that are the components of the application workload.
The control plane manages the worker nodes and the Pods in the cluster. In production
environments, the control plane usually runs across multiple computers and a cluster
usually runs multiple nodes, providing fault-tolerance and high availability.

This document outlines the various components you need to have for a complete and working Kubernetes cluster.
-->
Kubernetes 集群由一个控制平面和一组用于运行容器化应用的工作机器组成，这些工作机器称作节点（Node）。
每个集群至少需要一个工作节点来运行 Pod。

工作节点托管着组成应用负载的 Pod。控制平面管理集群中的工作节点和 Pod。
在生产环境中，控制平面通常跨多台计算机运行，而一个集群通常运行多个节点，以提供容错和高可用。

本文概述了构建一个完整且可运行的 Kubernetes 集群所需的各种组件。

<!--
{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="The control plane (kube-apiserver, etcd, kube-controller-manager, kube-scheduler) and several nodes. Each node is running a kubelet and kube-proxy."
title="Kubernetes cluster components"
caption="**Note:** This diagram presents an example reference architecture for a Kubernetes cluster. The actual distribution of components can vary based on specific cluster setups and requirements." class="diagram-large" >}}
-->
{{< figure src="/images/docs/kubernetes-cluster-architecture.svg" alt="控制平面（kube-apiserver、etcd、kube-controller-manager、kube-scheduler）和多个节点。每个节点运行 kubelet 和 kube-proxy。"
title="Kubernetes 集群组件"
caption="**注意：** 此图展示了 Kubernetes 集群的参考架构示例。这些组件的实际分布可能会基于特定的集群设置和要求而有所不同。" class="diagram-large" >}}

<!--
## Control plane components

The control plane's components make global decisions about the cluster (for example, scheduling),
as well as detecting and responding to cluster events (for example, starting up a new
{{< glossary_tooltip text="pod" term_id="pod">}} when a Deployment's
`{{< glossary_tooltip text="replicas" term_id="replica" >}}` field is unsatisfied).
-->
## 控制平面组件   {#control-plane-components}

控制平面组件会为集群做出全局决策，比如资源的调度。
以及检测和响应集群事件，例如当不满足 Deployment 的 `{{< glossary_tooltip text="replicas" term_id="replica" >}}`
字段时，要启动新的 {{< glossary_tooltip text="Pod" term_id="pod">}}）。

<!--
Control plane components can be run on any machine in the cluster. However, for simplicity, setup scripts
typically start all control plane components on the same machine, and do not run user containers on this machine.
See [Creating Highly Available clusters with kubeadm](/docs/setup/production-environment/tools/kubeadm/high-availability/)
for an example control plane setup that runs across multiple machines.
-->
控制平面组件可以在集群中的任何节点上运行。
然而，为了简单起见，安装脚本通常会在同一个计算机上启动所有控制平面组件，
并且不会在此计算机上运行用户容器。
请参阅[使用 kubeadm 构建高可用性集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/high-availability/)中关于跨多机器安装控制平面的示例。

### kube-apiserver

{{< glossary_definition term_id="kube-apiserver" length="all" >}}

### etcd

{{< glossary_definition term_id="etcd" length="all" >}}

### kube-scheduler

{{< glossary_definition term_id="kube-scheduler" length="all" >}}

### kube-controller-manager

{{< glossary_definition term_id="kube-controller-manager" length="all" >}}

<!--
There are many different types of controllers. Some examples of them are:

- Node controller: Responsible for noticing and responding when nodes go down.
- Job controller: Watches for Job objects that represent one-off tasks, then creates Pods to run those tasks to completion.
- EndpointSlice controller: Populates EndpointSlice objects (to provide a link between Services and Pods).
- ServiceAccount controller: Create default ServiceAccounts for new namespaces.

The above is not an exhaustive list.
-->
控制器有许多不同类型。以下是一些例子：

* Node 控制器：负责在节点出现故障时进行通知和响应
* Job 控制器：监测代表一次性任务的 Job 对象，然后创建 Pod 来运行这些任务直至完成
* EndpointSlice 控制器：填充 EndpointSlice 对象（以提供 Service 和 Pod 之间的链接）。
* ServiceAccount 控制器：为新的命名空间创建默认的 ServiceAccount。

以上并不是一个详尽的列表。

### cloud-controller-manager

{{< glossary_definition term_id="cloud-controller-manager" length="short" >}}

<!--
The cloud-controller-manager only runs controllers that are specific to your cloud provider.
If you are running Kubernetes on your own premises, or in a learning environment inside your
own PC, the cluster does not have a cloud controller manager.

As with the kube-controller-manager, the cloud-controller-manager combines several logically
independent control loops into a single binary that you run as a single process. You can scale
horizontally (run more than one copy) to improve performance or to help tolerate failures.
-->
`cloud-controller-manager` 仅运行特定于云平台的控制器。
因此如果你在自己的环境中运行 Kubernetes，或者在本地计算机中运行学习环境，
所部署的集群不包含云控制器管理器。

与 `kube-controller-manager` 类似，`cloud-controller-manager`
将若干逻辑上独立的控制回路组合到同一个可执行文件中，以同一进程的方式供你运行。
你可以对其执行水平扩容（运行不止一个副本）以提升性能或者增强容错能力。

<!--
The following controllers can have cloud provider dependencies:

- Node controller: For checking the cloud provider to determine if a node has been
  deleted in the cloud after it stops responding
- Route controller: For setting up routes in the underlying cloud infrastructure
- Service controller: For creating, updating and deleting cloud provider load balancers
-->
下面的控制器都包含对云平台驱动的依赖：

- Node 控制器：用于在节点终止响应后检查云平台以确定节点是否已被删除
- Route 控制器：用于在底层云基础架构中设置路由
- Service 控制器：用于创建、更新和删除云平台上的负载均衡器

<!--
## Node components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.
-->
## 节点组件   {#node-components}

节点组件会在每个节点上运行，负责维护运行的 Pod 并提供 Kubernetes 运行时环境。

### kubelet

{{< glossary_definition term_id="kubelet" length="all" >}}

<!--
### kube-proxy (optional) {#kube-proxy}

If you use a [network plugin](#network-plugins) that implements packet forwarding for Services
by itself, and providing equivalent behavior to kube-proxy, then you do not need to run
kube-proxy on the nodes in your cluster.

### Container runtime
-->
### kube-proxy（可选）  {#kube-proxy}

{{< glossary_definition term_id="kube-proxy" length="all" >}}
如果你使用[网络插件](#network-plugins)为 Service 实现本身的数据包转发，
并提供与 kube-proxy 等效的行为，那么你不需要在集群中的节点上运行 kube-proxy。

### 容器运行时   {#container-runtime}

{{< glossary_definition term_id="container-runtime" length="all" >}}

<!--
## Addons

Addons use Kubernetes resources ({{< glossary_tooltip term_id="daemonset" >}},
{{< glossary_tooltip term_id="deployment" >}}, etc) to implement cluster features.
Because these are providing cluster-level features, namespaced resources for
addons belong within the `kube-system` namespace.

Selected addons are described below; for an extended list of available addons,
please see [Addons](/docs/concepts/cluster-administration/addons/).
-->
## 插件（Addons）    {#addons}

插件使用 Kubernetes 资源（{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}、
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 等）实现集群功能。
因为这些插件提供集群级别的功能，插件中命名空间域的资源属于 `kube-system` 命名空间。

下面描述众多插件中的几种。有关可用插件的完整列表，
请参见[插件（Addons）](/zh-cn/docs/concepts/cluster-administration/addons/)。

### DNS

<!--
While the other addons are not strictly required, all Kubernetes clusters should have
[cluster DNS](/docs/concepts/services-networking/dns-pod-service/), as many examples rely on it.

Cluster DNS is a DNS server, in addition to the other DNS server(s) in your environment,
which serves DNS records for Kubernetes services.

Containers started by Kubernetes automatically include this DNS server in their DNS searches.
-->
尽管其他插件都并非严格意义上的必需组件，但几乎所有 Kubernetes
集群都应该有[集群 DNS](/zh-cn/docs/concepts/services-networking/dns-pod-service/)，
因为很多示例都需要 DNS 服务。

集群 DNS 是一个 DNS 服务器，和环境中的其他 DNS 服务器一起工作，它为 Kubernetes 服务提供 DNS 记录。

Kubernetes 启动的容器自动将此 DNS 服务器包含在其 DNS 搜索列表中。

<!--
### Web UI (Dashboard)

[Dashboard](/docs/tasks/access-application-cluster/web-ui-dashboard/) is a general purpose,
web-based UI for Kubernetes clusters. It allows users to manage and troubleshoot applications
running in the cluster, as well as the cluster itself.
-->
### Web 界面（仪表盘）   {#web-ui-dashboard}

[Dashboard](/zh-cn/docs/tasks/access-application-cluster/web-ui-dashboard/)
是 Kubernetes 集群的通用的、基于 Web 的用户界面。
它使用户可以管理集群中运行的应用程序以及集群本身，并进行故障排除。

<!--
### Container resource monitoring

[Container Resource Monitoring](/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
records generic time-series metrics about containers in a central database, and provides a UI for browsing that data.

### Cluster-level Logging

A [cluster-level logging](/docs/concepts/cluster-administration/logging/) mechanism is responsible
for saving container logs to a central log store with a search/browsing interface.
-->
### 容器资源监控   {#container-resource-monitoring}

[容器资源监控](/zh-cn/docs/tasks/debug/debug-cluster/resource-usage-monitoring/)
将关于容器的一些常见的时序度量值保存到一个集中的数据库中，并提供浏览这些数据的界面。

### 集群层面日志   {#cluster-level-logging}

[集群层面日志](/zh-cn/docs/concepts/cluster-administration/logging/)机制负责将容器的日志数据保存到一个集中的日志存储中，
这种集中日志存储提供搜索和浏览接口。

<!--
### Network plugins

[Network plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)
are software components that implement the container network interface (CNI) specification.
They are responsible for allocating IP addresses to pods and enabling them to communicate
with each other within the cluster.
-->
### 网络插件   {#network-plugins}

[网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins)
是实现容器网络接口（CNI）规范的软件组件。它们负责为 Pod 分配 IP 地址，并使这些 Pod 能在集群内部相互通信。

<!--
## Architecture variations

While the core components of Kubernetes remain consistent, the way they are deployed and
managed can vary. Understanding these variations is crucial for designing and maintaining
Kubernetes clusters that meet specific operational needs.
-->
## 架构变种    {#architecture-variations}

虽然 Kubernetes 的核心组件保持一致，但它们的部署和管理方式可能有所不同。
了解这些变化对于设计和维护满足特定运营需求的 Kubernetes 集群至关重要。

<!--
### Control plane deployment options

The control plane components can be deployed in several ways:

Traditional deployment
: Control plane components run directly on dedicated machines or VMs, often managed as systemd services.

Static Pods
: Control plane components are deployed as static Pods, managed by the kubelet on specific nodes.
  This is a common approach used by tools like kubeadm.
-->
### 控制平面部署选项    {#control-plane-deployment-options}

控制平面组件可以通过以下几种方式部署：

传统部署
: 控制平面组件直接在专用机器或虚拟机上运行，通常作为 systemd 服务进行管理。

静态 Pod
: 控制平面组件作为静态 Pod 部署，由特定节点上的 kubelet 管理。
  这是像 kubeadm 这样的工具常用的方法。

<!--
Self-hosted
: The control plane runs as Pods within the Kubernetes cluster itself, managed by Deployments
  and StatefulSets or other Kubernetes primitives.

Managed Kubernetes services
: Cloud providers often abstract away the control plane, managing its components as part of their service offering.
-->
自托管
: 控制平面在 Kubernetes 集群本身内部作为 Pod 运行，
  由 Deployments、StatefulSets 或其他 Kubernetes 原语管理。

托管 Kubernetes 服务
: 云平台通常将控制平面抽象出来，将其组件作为其服务的一部分进行管理。

<!--
### Workload placement considerations

The placement of workloads, including the control plane components, can vary based on cluster size,
performance requirements, and operational policies:

- In smaller or development clusters, control plane components and user workloads might run on the same nodes.
- Larger production clusters often dedicate specific nodes to control plane components,
  separating them from user workloads.
- Some organizations run critical add-ons or monitoring tools on control plane nodes.
-->
### 工作负载调度说明   {#workload-placement-considerations}

含控制平面组件在内的工作负载的调度可能因集群大小、性能要求和操作策略而有所不同：

- 在较小或开发集群中，控制平面组件和用户工作负载可能在同一节点上运行。
- 较大的生产集群通常将特定节点专用于控制平面组件，将其与用户工作负载隔离。
- 一些组织在控制平面节点上运行关键组件或监控工具。

<!--
### Cluster management tools

Tools like kubeadm, kops, and Kubespray offer different approaches to deploying and managing clusters,
each with its own method of component layout and management.

The flexibility of Kubernetes architecture allows organizations to tailor their clusters to specific needs,
balancing factors such as operational complexity, performance, and management overhead.
-->
### 集群管理工具   {#cluster-management-tools}

像 kubeadm、kops 和 Kubespray 这样的工具提供了不同的集群部署和管理方法，每种方法都有自己的组件布局和管理方式。

Kubernetes 架构的灵活性使各组织能够根据特定需求调整其集群，平衡操作复杂性、性能和管理开销等因素。

<!--
### Customization and extensibility

Kubernetes architecture allows for significant customization:

- Custom schedulers can be deployed to work alongside the default Kubernetes scheduler or to replace it entirely.
- API servers can be extended with CustomResourceDefinitions and API Aggregation.
- Cloud providers can integrate deeply with Kubernetes using the cloud-controller-manager.

The flexibility of Kubernetes architecture allows organizations to tailor their clusters to specific needs,
balancing factors such as operational complexity, performance, and management overhead.
-->
### 定制和可扩展性   {#customization-and-extensibility}

Kubernetes 架构允许大幅度的定制：

- 你可以部署自定义的调度器与默认的 Kubernetes 调度器协同工作，也可以完全替换掉默认的调度器。
- API 服务器可以通过 CustomResourceDefinition 和 API 聚合进行扩展。
- 云平台可以使用 cloud-controller-manager 与 Kubernetes 深度集成。

Kubernetes 架构的灵活性使各组织能够根据特定需求调整其集群，平衡操作复杂性、性能和管理开销等因素。

## {{% heading "whatsnext" %}}

<!--
Learn more about the following:

- [Nodes](/docs/concepts/architecture/nodes/) and
  [their communication](/docs/concepts/architecture/control-plane-node-communication/)
  with the control plane.
- Kubernetes [controllers](/docs/concepts/architecture/controller/).
- [kube-scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) which is the default scheduler for Kubernetes.
- Etcd's official [documentation](https://etcd.io/docs/).
- Several [container runtimes](/docs/setup/production-environment/container-runtimes/) in Kubernetes.
- Integrating with cloud providers using [cloud-controller-manager](/docs/concepts/architecture/cloud-controller/).
- [kubectl](/docs/reference/generated/kubectl/kubectl-commands) commands.
-->
了解更多内容：

- [节点](/zh-cn/docs/concepts/architecture/nodes/)及其与控制平面的[通信](/zh-cn/docs/concepts/architecture/control-plane-node-communication/)。
- Kubernetes [控制器](/zh-cn/docs/concepts/architecture/controller/)。
- Kubernetes 的默认调度器 [kube-scheduler](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)。
- Etcd 的官方[文档](https://etcd.io/docs/)。
- Kubernetes 中的几个[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)。
- 使用 [cloud-controller-manager](/zh-cn/docs/concepts/architecture/cloud-controller/) 与云平台集成。
- [kubectl](/zh-cn/docs/reference/generated/kubectl/kubectl-commands) 命令。
