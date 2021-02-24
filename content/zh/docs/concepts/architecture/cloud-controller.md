---
title: 云控制器管理器的基础概念
content_type: concept
weight: 40
---

<!--
title: Concepts Underlying the Cloud Controller Manager
content_type: concept
weight: 40
-->

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

<!--
Cloud infrastructure technologies let you run Kubernetes on public, private, and hybrid clouds.
Kubernetes believes in automated, API-driven infrastructure without tight coupling between
components.
-->
使用云基础设施技术，你可以在公有云、私有云或者混合云环境中运行 Kubernetes。
Kubernetes 的信条是基于自动化的、API 驱动的基础设施，同时避免组件间紧密耦合。

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="组件 cloud-controller-manager 是指云控制器管理器，">}}

<!--
The cloud-controller-manager is structured using a plugin
mechanism that allows different cloud providers to integrate their platforms with Kubernetes.
-->
`cloud-controller-manager` 组件是基于一种插件机制来构造的，
这种机制使得不同的云厂商都能将其平台与 Kubernetes 集成。

<!-- body -->
<!--
## Design

![Kubernetes components](/images/docs/components-of-kubernetes.png)

The cloud controller manager runs in the control plane as a replicated set of processes
(usually, these are containers in Pods). Each cloud-controller-manager implements
multiple {{< glossary_tooltip text="controllers" term_id="controller" >}} in a single
process.
-->
## 设计  {#design}

![Kubernetes 组件](/images/docs/components-of-kubernetes.png)

云控制器管理器以一组多副本的进程集合的形式运行在控制面中，通常表现为 Pod
中的容器。每个 `cloud-controller-manager` 在同一进程中实现多个
{{< glossary_tooltip text="控制器" term_id="controller" >}}。

<!--
You can also run the cloud controller manager as a Kubernetes
{{< glossary_tooltip text="addon" term_id="addons" >}} rather than as part
of the control plane.
-->
{{< note >}}
你也可以以 Kubernetes {{< glossary_tooltip text="插件" term_id="addons" >}} 
的形式而不是控制面中的一部分来运行云控制器管理器。
{{< /note >}}

<!--
## Cloud controller manager functions {#functions-of-the-ccm}

The controllers inside the cloud controller manager include:
-->
## 云控制器管理器的功能 {#functions-of-the-ccm}

云控制器管理器中的控制器包括：

<!--
### Node controller

The node controller is responsible for creating {{< glossary_tooltip text="Node" term_id="node" >}} objects
when new servers are created in your cloud infrastructure. The node controller obtains information about the
hosts running inside your tenancy with the cloud provider. The node controller performs the following functions:
-->
### 节点控制器   {#node-controller}

节点控制器负责在云基础设施中创建了新服务器时为之 创建
{{< glossary_tooltip text="节点（Node）" term_id="node" >}}对象。
节点控制器从云提供商获取当前租户中主机的信息。节点控制器执行以下功能：

<!--
1. Initialize a Node object for each server that the controller discovers through the cloud provider API.
2. Annotating and labelling the Node object with cloud-specific information, such as the region the node
   is deployed into and the resources (CPU, memory, etc) that it has available.
3. Obtain the node's hostname and network addresses.
4. Verifying the node's health. In case a node becomes unresponsive, this controller checks with
   your cloud provider's API to see if the server has been deactivated / deleted / terminated.
   If the node has been deleted from the cloud, the controller deletes the Node object from your Kubernetes
   cluster.
-->
1. 针对控制器通过云平台驱动的 API 所发现的每个服务器初始化一个 Node 对象；
2. 利用特定云平台的信息为 Node 对象添加注解和标签，例如节点所在的
   区域（Region）和所具有的资源（CPU、内存等等）；
3. 获取节点的网络地址和主机名；
4. 检查节点的健康状况。如果节点无响应，控制器通过云平台 API 查看该节点是否
   已从云中禁用、删除或终止。如果节点已从云中删除，则控制器从 Kubernetes 集群
   中删除 Node 对象。

<!--
Some cloud provider implementations split this into a node controller and a separate node
lifecycle controller.
-->
某些云驱动实现中，这些任务被划分到一个节点控制器和一个节点生命周期控制器中。

<!--
### Route controller

The route controller is responsible for configuring routes in the cloud
appropriately so that containers on different nodes in your Kubernetes
cluster can communicate with each other.

Depending on the cloud provider, the route controller might also allocate blocks
of IP addresses for the Pod network.
-->
### 路由控制器   {#route-controller}

Route 控制器负责适当地配置云平台中的路由，以便 Kubernetes 集群中不同节点上的
容器之间可以相互通信。

取决于云驱动本身，路由控制器可能也会为 Pod 网络分配 IP 地址块。

<!--
### Service controller

{< glossary_tooltip text="Services" term_id="service" >}} integrate with cloud
infrastructure components such as managed load balancers, IP addresses, network
packet filtering, and target health checking. The service controller interacts with your
cloud provider's APIs to set up load balancers and other infrastructure components
when you declare a Service resource that requires them.
-->
### 服务控制器   {#service-controller}

{{< glossary_tooltip text="服务（Service）" term_id="service" >}}与受控的负载均衡器、
IP 地址、网络包过滤、目标健康检查等云基础设施组件集成。
服务控制器与云驱动的 API 交互，以配置负载均衡器和其他基础设施组件。
你所创建的 Service 资源会需要这些组件服务。

<!--
## Authorization

This section breaks down the access that the cloud controller managers requires
on various API objects, in order to perform its operations.
-->
## 鉴权   {#authorization}

本节分别讲述云控制器管理器为了完成自身工作而产生的对各类 API 对象的访问需求。

<!--
### Node controller {#authorization-node-controller}

The Node controller only works with Node objects. It requires full access
to read and modify Node objects.
-->
### 节点控制器  {#authorization-node-controller}

节点控制器只操作 Node 对象。它需要读取和修改 Node 对象的完全访问权限。

`v1/Node`:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

<!--
### Route controller {#authorization-route-controller}

The route controller listens to Node object creation and configures
routes appropriately. It requires Get access to Node objects.
-->
### 路由控制器 {#authorization-route-controller}

路由控制器会监听 Node 对象的创建事件，并据此配置路由设施。
它需要读取 Node 对象的 Get 权限。

`v1/Node`:

- Get

<!--
### Service controller {#authorization-service-controller}

The service controller listens to Service object Create, Update and Delete events and then configures Endpoints for those Services appropriately.

To access Services, it requires List, and Watch access. To update Services, it requires Patch and Update access.

To set up Endpoints resources for the Services, it requires access to Create, List, Get, Watch, and Update.
-->
### 服务控制器 {#authorization-service-controller}

服务控制器监测 Service 对象的 Create、Update 和 Delete 事件，并配置
对应服务的 Endpoints 对象。
为了访问 Service 对象，它需要 List、Watch 访问权限；为了更新 Service 对象
它需要 Patch 和 Update 访问权限。
为了能够配置 Service 对应的 Endpoints 资源，它需要 Create、List、Get、Watch
和 Update 等访问权限。

`v1/Service`:

- List
- Get
- Watch
- Patch
- Update

<!--
### Others {#authorization-miscellaneous}

The implementation of the core of the cloud controller manager requires access to create Event objects, and to ensure secure operation, it requires access to create ServiceAccounts.

`v1/Event`:

- Create
- Patch
- Update

`v1/ServiceAccount`:

- Create

The {{< glossary_tooltip term_id="rbac" text="RBAC" >}} ClusterRole for the cloud
controller manager looks like:
-->
### 其他  {#authorization-miscellaneous}

云控制器管理器的实现中，其核心部分需要创建 Event 对象的访问权限以及
创建 ServiceAccount 资源以保证操作安全性的权限。

`v1/Event`:

- Create
- Patch
- Update

`v1/ServiceAccount`:

- Create

用于云控制器管理器 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}
的 ClusterRole 如下例所示：

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cloud-controller-manager
rules:
- apiGroups:
  - ""
  resources:
  - events
  verbs:
  - create
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - '*'
- apiGroups:
  - ""
  resources:
  - nodes/status
  verbs:
  - patch
- apiGroups:
  - ""
  resources:
  - services
  verbs:
  - list
  - patch
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - serviceaccounts
  verbs:
  - create
- apiGroups:
  - ""
  resources:
  - persistentvolumes
  verbs:
  - get
  - list
  - update
  - watch
- apiGroups:
  - ""
  resources:
  - endpoints
  verbs:
  - create
  - get
  - list
  - watch
  - update
```

## {{% heading "whatsnext" %}}

<!--
[Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
has instructions on running and managing the cloud controller manager.

Want to know how to implement your own cloud controller manager, or extend an existing project?
-->
[云控制器管理器的管理](/zh/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
给出了运行和管理云控制器管理器的指南。

想要了解如何实现自己的云控制器管理器，或者对现有项目进行扩展么？

<!--
The cloud controller manager uses Go interfaces to allow implementations from any cloud to be plugged in. Specifically, it uses the `CloudProvider` interface defined in [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.17/cloud.go#L42-L62) from [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider).
-->
云控制器管理器使用 Go 语言的接口，从而使得针对各种云平台的具体实现都可以接入。
其中使用了在 [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider)
项目中 [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.17/cloud.go#L42-L62)
文件所定义的 `CloudProvider` 接口。

<!--
The implementation of the shared controllers highlighted in this document (Node, Route, and Service), and some scaffolding along with the shared cloudprovider interface, is part of the Kubernetes core. Implementations specific to cloud providers are outside the core of Kubernetes and implement the `CloudProvider` interface.

For more information about developing plugins, see [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
-->
本文中列举的共享控制器（节点控制器、路由控制器和服务控制器等）的实现以及
其他一些生成具有 CloudProvider 接口的框架的代码，都是 Kubernetes 的核心代码。
特定于云驱动的实现虽不是 Kubernetes 核心成分，仍要实现 `CloudProvider` 接口。

关于如何开发插件的详细信息，可参考
[开发云控制器管理器](/zh/docs/tasks/administer-cluster/developing-cloud-controller-manager/)
文档。

