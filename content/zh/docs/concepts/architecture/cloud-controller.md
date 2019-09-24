---
title: 云控制器管理器的基础概念
content_template: templates/concept
weight: 30
---

<!--
---
title: Concepts Underlying the Cloud Controller Manager
content_template: templates/concept
weight: 30
---
-->


{{% capture overview %}}

<!--
The cloud controller manager (CCM) concept (not to be confused with the binary) was originally created to allow cloud specific vendor code and the Kubernetes core to evolve independent of one another. The cloud controller manager runs alongside other master components such as the Kubernetes controller manager, the API server, and scheduler. It can also be started as a Kubernetes addon, in which case it runs on top of Kubernetes.
-->

云控制器管理器（cloud controller manager，CCM）这个概念 （不要与二进制文件混淆）创建的初衷是为了让特定的云服务供应商代码和 Kubernetes 核心相互独立演化。云控制器管理器与其他主要组件（如 Kubernetes 控制器管理器，API 服务器和调度程序）一起运行。它也可以作为 Kubernetes 的插件启动，在这种情况下，它会运行在 Kubernetes 之上。

<!--
The cloud controller manager's design is based on a plugin mechanism that allows new cloud providers to integrate with Kubernetes easily by using plugins. There are plans in place for on-boarding new cloud providers on Kubernetes and for migrating cloud providers from the old model to the new CCM model.
-->

云控制器管理器基于插件机制设计，允许新的云服务供应商通过插件轻松地与 Kubernetes 集成。目前已经有在 Kubernetes 上加入新的云服务供应商计划，并为云服务供应商提供从原先的旧模式迁移到新 CCM 模式的方案。

<!--
This document discusses the concepts behind the cloud controller manager and gives details about its associated functions.
-->

本文讨论了云控制器管理器背后的概念，并提供了相关功能的详细信息。

<!--
Here's the architecture of a Kubernetes cluster without the cloud controller manager:
-->

这是没有云控制器管理器的 Kubernetes 集群的架构：

<!--
![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)
-->

![没有云控制器管理器的 Kubernetes 架构](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

<!--
## Design
-->


## 设计

<!--
In the preceding diagram, Kubernetes and the cloud provider are integrated through several different components:
-->

在上图中，Kubernetes 和云服务供应商通过几个不同的组件进行了集成，分别是：

<!--
* Kubelet
* Kubernetes controller manager
* Kubernetes API server
-->

* Kubelet
* Kubernetes 控制管理器
* Kubernetes API 服务器

<!--
The CCM consolidates all of the cloud-dependent logic from the preceding three components to create a single point of integration with the cloud. The new architecture with the CCM looks like this:
-->

CCM 整合了前三个组件中的所有依赖于云的逻辑，以创建与云的单一集成点。CCM 的新架构如下所示：

<!-- 
![CCM Kube Arch](/images/docs/post-ccm-arch.png)
-->

![含有云控制器管理器的 Kubernetes 架构](/images/docs/post-ccm-arch.png)

<!--
## Components of the CCM
-->
## CCM 的组成部分

<!--
The CCM breaks away some of the functionality of Kubernetes controller manager (KCM) and runs it as a separate process. Specifically, it breaks away those controllers in the KCM that are cloud dependent. The KCM has the following cloud dependent controller loops:
 -->

CCM 打破了 Kubernetes 控制器管理器（KCM）的一些功能，并将其作为一个单独的进程运行。具体来说，它打破了 KCM 中依赖于云的控制器。KCM 具有以下依赖于云的控制器：

<!--
 * Node controller
 * Volume controller
 * Route controller
 * Service controller
-->

* 节点控制器
* 卷控制器
* 路由控制器
* 服务控制器
<!--
In version 1.9, the CCM runs the following controllers from the preceding list:
 -->

在 1.9 版本中，CCM 运行前述列表中的以下控制器：

<!--
* Node controller
* Route controller
* Service controller
-->

* 节点控制器
* 路由控制器
* 服务控制器

{{< note >}}
<!--
Volume controller was deliberately chosen to not be a part of CCM. Due to the complexity involved and due to the existing efforts to abstract away vendor specific volume logic, it was decided that volume controller will not be moved to CCM.
-->

注意卷控制器不属于 CCM，由于其中涉及到的复杂性和对现有供应商特定卷的逻辑抽象，因此决定了卷控制器不会被移动到 CCM 之中。

{{< /note >}}

<!--
The original plan to support volumes using CCM was to use Flex volumes to support pluggable volumes. However, a competing effort known as CSI is being planned to replace Flex.
-->

使用 CCM 支持 volume 的最初计划是使用 Flex volume 来支持可插拔卷，但是现在正在计划一项名为 CSI 的项目以取代 Flex。

<!--
Considering these dynamics, we decided to have an intermediate stop gap measure until CSI becomes ready.
-->

考虑到这些正在进行中的变化，在 CSI 准备就绪之前，我们决定停止当前的工作。

<!--
## Functions of the CCM
-->

## CCM 的功能

<!--
The CCM inherits its functions from components of Kubernetes that are dependent on a cloud provider. This section is structured based on those components.
-->

CCM 从依赖于云提供商的 Kubernetes 组件继承其功能，本节基于这些组件组织。

<!--
### 1. Kubernetes controller manager
-->

### 1. Kubernetes 控制器管理器

<!--
The majority of the CCM's functions are derived from the KCM. As mentioned in the previous section, the CCM runs the following control loops:
-->

CCM 的大多数功能都来自 KCM，如上一节所述，CCM 运行以下控制器。

<!--
* Node controller
* Route controller
* Service controller
-->

* 节点控制器
* 路由控制器
* 服务控制器

<!--
#### Node controller
-->

#### 节点控制器

<!--
The Node controller is responsible for initializing a node by obtaining information about the nodes running in the cluster from the cloud provider. The node controller performs the following functions:
-->

节点控制器负责通过从云提供商获取有关在集群中运行的节点的信息来初始化节点，节点控制器执行以下功能：

<!--
1. Initialize a node with cloud specific zone/region labels.
2. Initialize a node with cloud specific instance details, for example, type and size.
3. Obtain the node's network addresses and hostname.
4. In case a node becomes unresponsive, check the cloud to see if the node has been deleted from the cloud.
If the node has been deleted from the cloud, delete the Kubernetes Node object.
-->

1. 使用特定于云的域（zone）/区（region）标签初始化节点；
2. 使用特定于云的实例详细信息初始化节点，例如，类型和大小；
3. 获取节点的网络地址和主机名；
4. 如果节点无响应，请检查云以查看该节点是否已从云中删除。如果已从云中删除该节点，请删除 Kubernetes 节点对象。

<!--
#### Route controller
-->

#### 路由控制器

<!--
The Route controller is responsible for configuring routes in the cloud appropriately so that containers on different nodes in the Kubernetes cluster can communicate with each other. The route controller is only applicable for Google Compute Engine clusters.
-->

Route 控制器负责适当地配置云中的路由，以便 Kubernetes 集群中不同节点上的容器可以相互通信。route 控制器仅适用于 Google Compute Engine 群集。

<!--
#### Service Controller
-->

#### 服务控制器

<!--
The Service controller is responsible for listening to service create, update, and delete events. Based on the current state of the services in Kubernetes, it configures cloud load balancers (such as ELB , Google LB, or Oracle Cloud Infrastructure LB) to reflect the state of the services in Kubernetes. Additionally, it ensures that service backends for cloud load balancers are up to date.
-->

服务控制器负责监听服务的创建、更新和删除事件。根据 Kubernetes 中各个服务的当前状态，它配置云负载均衡器（如 ELB, Google LB 或者 Oracle Cloud Infrastructure LB）以反映 Kubernetes 中的服务状态。此外，它还确保云负载均衡器的服务后端是最新的。

<!--
### 2. Kubelet
-->

### 2. Kubelet

<!--
The Node controller contains the cloud-dependent functionality of the kubelet. Prior to the introduction of the CCM, the kubelet was responsible for initializing a node with cloud-specific details such as IP addresses, region/zone labels and instance type information. The introduction of the CCM has moved this initialization operation from the kubelet into the CCM.
-->

节点控制器包含 kubelet 中依赖于云的功能，在引入 CCM 之前，kubelet 负责使用特定于云的详细信息（如 IP 地址，域/区标签和实例类型信息）初始化节点。CCM 的引入已将此初始化操作从 kubelet 转移到 CCM 中。

<!--
In this new model, the kubelet initializes a node without cloud-specific information. However, it adds a taint to the newly created node that makes the node unschedulable until the CCM initializes the node with cloud-specific information. It then removes this taint.
-->

在这个新模型中，kubelet 初始化一个没有特定于云的信息的节点。但是，它会为新创建的节点添加污点，使节点不可调度，直到 CCM 使用特定于云的信息初始化节点后，才会清除这种污点，便得该节点可被调度。

<!--
## Plugin mechanism
-->

## 插件机制

<!--
The cloud controller manager uses Go interfaces to allow implementations from any cloud to be plugged in. Specifically, it uses the CloudProvider Interface defined [here](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62).
-->

云控制器管理器使用 Go 接口允许插入任何云的实现。具体来说，它使用[此处](https://github.com/kubernetes/cloud-provider/blob/9b77dc1c384685cb732b3025ed5689dd597a5971/cloud.go#L42-L62)定义的 CloudProvider 接口。

<!--
The implementation of the four shared controllers highlighted above, and some scaffolding along with the shared cloudprovider interface, will stay in the Kubernetes core. Implementations specific to cloud providers will be built outside of the core and implement interfaces defined in the core.
-->

上面强调的四个共享控制器的实现，以及一些辅助设施（scaffolding）和共享的 cloudprovider 接口，将被保留在 Kubernetes 核心中。但特定于云提供商的实现将在核心之外构建，并实现核心中定义的接口。

<!--
For more information about developing plugins, see [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
 -->

有关开发插件的更多信息，请参阅[开发云控制器管理器](/docs/tasks/administer-cluster/developing-cloud-controller-manager/)。

<!--
## Authorization
-->

## 授权

<!--
This section breaks down the access required on various API objects by the CCM to perform its operations.
-->

本节分解了 CCM 执行其操作时各种 API 对象所需的访问权限。

<!--
### Node Controller
-->

### 节点控制器

<!--
The Node controller only works with Node objects. It requires full access to get, list, create, update, patch, watch, and delete Node objects.
-->

Node 控制器仅适用于 Node 对象，它需要完全访问权限来获取、列出、创建、更新、修补、监视和删除 Node 对象。

<!--
v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete
-->

v1/Node:

- Get
- List
- Create
- Update
- Patch
- Watch
- Delete

<!--
### Route controller
-->

### 路由控制器

<!--
The route controller listens to Node object creation and configures routes appropriately. It requires get access to Node objects.
-->

路由控制器侦听 Node 对象创建并适当地配置路由，它需要访问 Node 对象。

v1/Node:

- Get

<!--
### Service controller
-->

### 服务控制器

<!--
The service controller listens to Service object create, update and delete events and then configures endpoints for those Services appropriately.
-->

服务控制器侦听 Service 对象创建、更新和删除事件，然后适当地为这些服务配置端点。

<!--
To access Services, it requires list, and watch access. To update Services, it requires patch and update access.
-->

要访问服务，它需要列表和监视访问权限。要更新服务，它需要修补和更新访问权限。

<!--
To set up endpoints for the Services, it requires access to create, list, get, watch, and update.
-->

要为服务设置端点，需要访问 create、list、get、watch 和 update。

v1/Service:

- List
- Get
- Watch
- Patch
- Update

<!--
### Others
-->

### 其它

<!--
The implementation of the core of CCM requires access to create events, and to ensure secure operation, it requires access to create ServiceAccounts.
-->

CCM 核心的实现需要访问权限以创建事件，并且为了确保安全操作，它需要访问权限以创建服务账户。

v1/Event:

- Create
- Patch
- Update

v1/ServiceAccount:

- Create

<!--
The RBAC ClusterRole for the CCM looks like this:
-->

针对 CCM 的 RBAC ClusterRole 看起来像这样：

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

<!--
## Vendor Implementations
-->

## 供应商实施

<!--
The following cloud providers have implemented CCMs:
-->

以下云服务提供商已实现了 CCM：

<!--
* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)
* [OpenStack](https://github.com/kubernetes/cloud-provider-openstack)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)
-->

* [AWS](https://github.com/kubernetes/cloud-provider-aws)
* [Azure](https://github.com/kubernetes/cloud-provider-azure)
* [BaiduCloud](https://github.com/baidu/cloud-provider-baiducloud)
* [Digital Ocean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [GCP](https://github.com/kubernetes/cloud-provider-gcp)
* [Linode](https://github.com/linode/linode-cloud-controller-manager)
* [OpenStack](https://github.com/kubernetes/cloud-provider-openstack)
* [Oracle](https://github.com/oracle/oci-cloud-controller-manager)

<!--
## Cluster Administration
-->

## 群集管理

<!--
Complete instructions for configuring and running the CCM are provided
[here](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).
-->

[这里](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)提供了有关配置和运行 CCM 的完整说明。

{{% /capture %}}

