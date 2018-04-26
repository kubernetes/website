---
cn-approvers:
- lichuqiang
title: 云控制器管理器的基础概念
---
<!--
---
title: Concepts Underlying the Cloud Controller Manager
---
-->

<!--
## Cloud Controller Manager

The cloud controller manager (CCM) concept (not to be confused with the binary) was originally created to allow cloud specific vendor code and the Kubernetes core to evolve independent of one another. The cloud controller manager runs alongside other master components such as the Kubernetes controller manager, the API server, and scheduler. It can also be started as a Kubernetes addon, in which case, it runs on top of Kubernetes.
-->
## 云控制器管理器

云控制器管理器（CCM）的概念（不要与二进制混淆）最初提出的目的是使得云供应商特定代码和 Kubernetes
核心代码相互独立。 云控制器管理器能够与其他管理组件（如 Kubernetes 控制器管理器、API 服务器、调度器等）一起运行，
也能够以 Kubernetes 插件的形式启动，在这种情况下，它运行在 Kubernetes 之上。

<!--
The cloud controller manager's design is based on a plugin mechanism that allows new cloud providers to integrate with Kubernetes easily by using plugins. There are plans in place for on-boarding new cloud providers on Kubernetes, and for migrating cloud provider from the old model to the new CCM model.
-->
云控制器管理器的设计基于一种插件机制，这种插件机制使得新的云提供商通过使用插件能够很容易地与 Kubernetes 集成。 目前已经有计划在 Kubernetes 中（采用 CCM）集成新的云供应商，并将已有云供应商从旧模型迁移到新的 CCM 模型。

<!--
This document discusses the concepts behind the the cloud controller manager, and gives details about its associated functions.

Here's the architecture of a Kubernetes cluster without the cloud controller manager:
-->
本文讨论了云控制器管理器背后的概念，并详细介绍了它的相关功能。

以下是没有引入云控制器管理器的 Kubernetes 集群架构：

![Pre CCM Kube Arch](/images/docs/pre-ccm-arch.png)

<!--
## Design

In the preceding diagram, Kubernetes and the cloud provider are integrated through several different components:

* Kubelet
* Kubernetes controller manager
* Kubernetes API server
-->
## 设计

在上面的图中，Kubernetes 和云提供商通过几个不同的组件集成：

* Kubelet
* Kubernetes 控制器管理器
* Kubernetes API 服务器

<!--
The CCM consolidates all of the cloud-dependent logic from the preceding three components to create a single point of integration with the cloud. The new architecture with the CCM looks like this:
-->
CCM 将前面三个组件中所有依赖云服务的逻辑进行合并，形成单一的云服务集成点，引入 CCM 的新架构如下所示：

![CCM Kube Arch](/images/docs/post-ccm-arch.png)

<!--
## Components of the CCM

The CCM breaks away some of the functionality of Kubernetes controller manager (KCM) and runs it as a separate process. Specifically, it breaks away those controllers in the KCM that are cloud dependent. The KCM has the following cloud dependent controller loops:

 * Node controller
 * Volume controller
 * Route controller
 * Service controller
-->
## CCM 的组件

CCM 将 Kubernetes 控制器管理器（KCM）的一部分功能剥离，并作为独立的进程运行。 具体地说，它将 KCM 中依赖云服务的控制器剥离，KCM 中存在以下依赖云服务的控制器：

 * 节点控制器
 * 卷控制器
 * 路由控制器
 * 服务控制器

<!--
In version 1.8, the CCM currently runs the following controllers from the preceding list:

* Node controller
* Route controller 
* Service controller
-->
在 1.8 版本中， CCM 当前运行上述列表中的以下控制器：

* 节点控制器
* 路由控制器
* 服务控制器

<!--
Additionally, it runs another controller called the PersistentVolumeLabels controller. This controller is responsible for setting the zone and region labels on PersistentVolumes created in GCP and AWS clouds. 
-->
此外，CCM 运行另一个名为 PersistentVolumeLabels 的控制器。 该控制器负责为 GCP 和 AWS 云中创建的 PersistentVolume
设置区域（zone）和地域（region）标签。

<!--
**Note:** Volume controller was deliberately chosen to not be a part of CCM. Due to the complexity involved and due to the existing efforts to abstract away vendor specific volume logic, it was decided that volume controller will not be moved to CCM. 
{: .note}
-->
**注意：** 经过深入考虑，我们没有选择将卷控制器作为 CCM 的一部分。 由于（将卷控制器移至 CCM）涉及到的复杂性和已有的对供应商特定的卷逻辑进行抽象的成果，我们决定不将卷控制器移到 CCM 中。
{: .note}

<!--
The original plan to support volumes using CCM was to use Flex volumes to support pluggable volumes. However, a competing effort known as CSI is being planned to replace Flex. 
-->
最初计划使用 CCM 支持卷的目的是使用 Flex volume 支持插件式卷。 然而，社区计划采用名为 CSI 的成果来取代 Flex
（两者为竞争关系）。

<!--
Considering these dynamics, we decided to have an intermediate stop gap measure until CSI becomes ready.
-->
考虑到这些动态，我们决定采取一种临时措施，直到 CSI 就绪。

<!--
Work is in progress by the cloud provider working group (wg-cloud-provider) to enable PersistentVolume support using CCM. See [kubernetes/kubernetes#52371](https://github.com/kubernetes/kubernetes/pull/52371).
-->
云供应商工作组（wg-cloud-provider）正致力于使用 CCM 支持 PersistentVolume。
参考 [kubernetes/kubernetes#52371](https://github.com/kubernetes/kubernetes/pull/52371).

<!--
## Functions of the CCM

The CCM inherits its functions from components of Kubernetes that are dependent on a cloud provider. This section is structured based on the components from which CCM inherits its functions.
-->
## CCM 的功能

CCM 的功能继承于 Kubernetes 中依赖云供应商的组件。 本节基于 CCM 的功能来源组件展开描述。

<!--
### 1. Kubernetes controller manager

The majority of the CCM's functions are derived from the KCM. As mentioned in the previous section, the CCM runs the following control loops:

* Node controller
* Route controller 
* Service controller
* PersistentVolumeLabels controller
-->
### 1. Kubernetes 控制器管理器

CCM 的功能大部分来自 KCM。 如前一节所述，CCM 运行以下控制回路：

* 节点控制器
* 路由控制器
* 服务控制器
* PersistentVolumeLabel 控制器

<!--
#### Node controller

The Node controller is responsible for initializing a node by obtaining information about the nodes running in the cluster from the cloud provider. The node controller performs the following functions:

1. Initialize a node with cloud specific zone/region labels.
2. Initialize a node with cloud specific instance details, for example, type and size.
3. Obtain the node's network addresses and hostname.
4. In case a node becomes unresponsive, check the cloud to see if the node has been deleted from the cloud.
If the node has been deleted from the cloud, delete the Kubernetes Node object.
-->
#### 节点控制器

节点控制器负责从云提供商获取集群中运行的节点信息，并用该信息对节点进行初始化。节点控制器执行以下功能：

1. 以云服务特定的区域/地域标签初始化节点。
2. 以云服务特定的实例详细信息（如类型、规格）初始化节点。
3. 获取节点的网络地址和 hostname。
4. 检查云服务，查看节点是否已从云服务中删除，以防止节点无法响应。
如果节点已从云服务中删除，删除 Kubernetes 中的节点对象。

<!--
#### Route controller

The Route controller is responsible for configuring routes in the cloud appropriately so that containers on different nodes in the Kubernetes cluster can communicate with each other. The route controller is only applicable for Google Compute Engine clusters.
-->
#### 路由控制器

路由控制器负责在云服务中适当地配置路由，以便 Kubernetes 中不同节点上的容器间能够互相通信。 路由控制器只适用于谷歌计算引擎集群。

<!--
#### Service Controller

The Service controller is responsible for listening to service create, update, and delete events. Based on the current state of the services in Kubernetes, it configures cloud load balancers (such as ELB, or Google LB) to reflect the state of the services in Kubernetes. Additionally, it ensures that service backends for cloud load balancers are up to date.
-->
#### 服务控制器

服务控制器负责监听服务创建、更新和删除事件。 基于当前 Kubernetes 中的服务状态，配置云负载均衡器（如 ELB 或 Google LB）
来反映 Kubernetes 中的服务状态。 此外，服务控制器保证云负载均衡器的服务后端是最新的。

<!--
#### PersistentVolumeLabels controller

The PersistentVolumeLabels controller applies labels on AWS EBS, GCE PD volumes when they are created. This removes the need for users to manually set the labels on these volumes. 

These labels are essential for the scheduling of pods, as these volumes are constrained to work only within the region/zone that they are in, and therefore any Pod using these volumes needs to be scheduled in the same region/zone.

The PersistentVolumeLabels controller was created specifically for the CCM; that is, it did not exist before the CCM was created. This was done to move the PV labelling logic in the Kubernetes API server (it was an admission controller) to the CCM. It does not run on the KCM.
-->
#### PersistentVolumeLabel 控制器

在用户创建 AWS EBS 或 GCE PD 卷时，PersistentVolumeLabel 控制器为其设置标签。 这使得用户不必手动为这些卷设置标签。

这些标签对 Pod 调度来说是必不可少的，因为这些卷只有在它们所在的地域/区域中才能正常工作，因此任何使用这些卷的 Pod
都需要被调度到同样的地域/区域中。

PersistentVolumeLabel 控制器是专门为 CCM 创建的，换句话说，CCM 出现之前该控制器并不存在。 我们创建该控制器，是为了将
Kubernetes API 服务器中为 PV 设置标签的逻辑（通过准入控制器）移到 CCM 中。 该逻辑并不运行在 KCM 中。

<!--
### 2. Kubelet

The Node controller contains the cloud-dependent functionality of the kubelet. Prior to the introduction of the CCM, the kubelet was responsible for initializing a node with cloud-specific details such as IP addresses, region/zone labels and instance type information. The introduction of the CCM has moved this initialization operation from the kubelet into the CCM. 
-->
### 2. Kubelet

节点控制器中包含了 kubelet 中依赖云服务的功能。 引入 CCM 之前， kubelet 负责以特定云服务的详细信息（如 IP 地址、
地域/区域标签和实例类型信息）对节点进行初始化。 引入 CCM 后，该初始化操作从 kubelet 移到了 CCM 中。

<!--
In this new model, the kubelet initializes a node without cloud-specific information. However, it adds a taint to the newly created node that makes the node unschedulable until the CCM initializes the node with cloud-specific information, and then removes this taint. 
-->
在这个新的模型中，kubelet 执行初始化节点时不感知特定云服务信息。 然而，它为新创建的节点添加 taint，使得节点处于不可调度的状态，直到 CCM 以特定云服务的信息对节点进行初始化后，才移除该 taint。 

<!--
### 3. Kubernets API server

The PersistentVolumeLabels controller moves the cloud-dependent functionality of the Kubernetes API server to the CCM as described in the preceding sections.
-->
### 3. Kubernets API 服务器

如前面的章节所述，PersistentVolumeLabel 控制器将 Kubernetes API 服务器中依赖云服务的功能移到了 CCM 中。

<!--
## Plugin mechanism

The cloud controller manager uses Go interfaces to allow implementations from any cloud to be plugged in. Specifically, it uses the CloudProvider Interface defined [here](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go)
-->
## 插件机制

云控制器管理器使用 Go 接口，容许接入任何云服务的实现。 具体地说，它使用 [这里](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go) 定义的 CloudProvider 接口。

<!--
The implementation of the four shared controllers highlighted above, and some scaffolding along with the shared cloudprovider interface, will stay in the Kubernetes core, but implementations specific to cloud providers will
be built outside of the core, and implement interfaces defined in the core.
-->
上面强调的四种共享控制器的实现以及共享 cloudprovider 接口相关的一些框架，会保留在 Kubernetes 核心代码中，
但特定云供应商的实现将在核心代码之外，并实现核心代码中定义的接口。

<!--
For more information about developing plugins, see
[Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
-->
更多插件开发相关的信息，参见
[开发云控制器管理器](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).

<!--
## Authorization

This section breaks down the access required on various API objects by the CCM to perform its operations. 
-->
## 授权

本节分解描述 CCM 执行操作所需要的对各种 API 对象的访问权限。

<!--
### Node Controller

The Node controller only works with Node objects. It requires full access to get, list, create, update, patch, watch, and delete Node objects.
-->
### 节点控制器

节点控制器只作用于节点对象。 它需要对节点对象的全部访问权限：获取、列举、创建、更新、打补丁（patch）、监视（watch）和删除

v1/Node: 
- Get
- List
- Create
- Update
- Patch
- Watch

<!--
### Route controller

The route controller listens to Node object creation and configures routes appropriately. It requires get access to Node objects. 
-->
### 路由控制器

路由控制器监听节点对象的创建，并适当地配置路由。 它需要节点对象的获取权限。

v1/Node: 
- Get

<!--
### Service controller

The service controller listens to Service object create, update and delete events and then configures endpoints for those Services appropriately. 
-->
### 服务控制器

服务控制器监听服务对象的创建、更新和删除事件，然后适当地为那些服务配置端点（endpoint）。

<!--
To access Services, it requires list, and watch access. To update Services, it requires patch and update access. 

To set up endpoints for the Services, it requires access to create, list, get, watch, and update.
-->
为访问服务，服务控制器需要列举和监视权限。为更新服务，它需要打补丁和更新权限。

为给服务设置端点，它需要创建、列举、获取、监视和更新的权限。
v1/Service:
- List
- Get
- Watch
- Patch
- Update

<!--
### PersistentVolumeLabels controller

The PersistentVolumeLabels controller listens on PersistentVolume (PV) create events and then updates them. This controller requires access to list, watch, get and update PVs.
-->
### PersistentVolumeLabel 控制器

PersistentVolumeLabel 控制器监听 PersistentVolume (PV) 创建事件，并对其进行更新。 该控制器需要 PV 对象的列举、监视、
获取和更新权限。

v1/PersistentVolume:
- Get
- List
- Watch
- Update

<!--
### Others

The implementation of the core of CCM requires access to create events, and to ensure secure operation, it requires access to create ServiceAccounts.
-->
### 其他

CCM 的核心实现需要事件对象的创建权限，同时为保证安全操作，需要创建服务账户（ServiceAccount）的权限。

v1/Event:
- Create
- Patch
- Update

v1/ServiceAccount:
- Create

<!--
The RBAC ClusterRole for the CCM looks like this:
-->
CCM 的 RBAC ClusterRole 形如：

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
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

The following cloud providers have implemented CCMs for their own clouds.  
-->
## 云供应商实现

以下云供应商已经实现了针对其自身云服务的 CCM：

* [Digital Ocean]()
* [Oracle]()
* [Azure]()
* [GCE]()
* [AWS]()

<!--
## Cluster Administration

Complete instructions for configuring and running the CCM are provided
[here](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager).
-->
## 集群管理

配置和运行 CCM 的完整说明详见
[这里](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)。
