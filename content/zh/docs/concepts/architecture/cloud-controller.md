---
title: 云控制器管理器的基本概念
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

云控制器管理器（CCM）这个概念创建的初衷是为了让特定的云服务供应商代码和 Kubernetes 核心相互独立演化。云控制器管理器与其他主要组件如 Kubernetes 控制器管理器，API 服务器和调度程序同时运行。云控制器管理器也可以作为 Kubernetes 的插件启动，这种情况下，CCM 运行在 Kubernetes 系统之上。

云控制器管理器基于插件机制设计，允许新的云服务供应商通过插件轻松地与 Kubernetes 集成。目前已经有在 Kubernetes 上加入新的云服务供应商计划，并为云服务供应商提供从原先的旧模式迁移到新 CCM 模式的方案。

本文讨论了云控制器管理器背后的概念，并提供了相关功能的详细信息。

下面这张图描述了没有云控制器管理器的 Kubernetes 集群架构：

![无云控制器管理器的 K8s 集群架构](/images/docs/pre-ccm-arch.png)

{{% /capture %}}


{{% capture body %}}

## 设计

在上图中，Kubernetes 和云服务供应商通过几个不同的组件进行了集成，分别是：

* Kubelet
* Kubernetes 控制管理器
* Kubernetes API 服务器

而 CCM 整合了前三个组件中的所有依赖于云的逻辑，用来创建与云的单点集成。新架构如下图所示：

![有云控制器管理器的 Kubernetes 集群架构](/images/docs/post-ccm-arch.png)

## CCM 的组件

CCM 突破了 Kubernetes 控制器管理器（KCM）的一些功能，并将其作为一个独立的进程运行。具体而言，它打破了 KCM 中与云相关的控制器。KCM 具有以下依赖于云的控制器引擎：

* 节点控制器
* 卷控制器
* 路由控制器
* 服务控制器

在1.8版本中，当前运行中的 CCM 从上面的列表中运行以下控制器：

* 节点控制器
* 路由控制器
* 服务控制器

另外，它运行另一个名为 PersistentVolumeLabels Controller 的控制器。这个控制器负责对在 GCP 和 AWS 云里创建的 PersistentVolumes 的域（Zone）和区（Region）标签进行设置。

**注意**：卷控制器被特意设计为 CCM 之外的一部分。由于其中涉及到的复杂性和对现有供应商特定卷的逻辑抽象，因此决定了卷控制器不会被移动到 CCM 之中。

原本计划使用 CCM 来支持卷的目的是为了引入 FlexVolume 卷来支持可插拔卷。然而，官方正在计划使用更具备竞争力的 CSI 来取代 FlexVolume 卷。

考虑到这些正在进行中的变化，我们决定暂时停止当前工作直至 CSI 准备就绪。

云服务供应商工作组（wg-cloud-provider）正在开展相关工作，以实现通过 CCM 支持 PersistentVolume 的功能。详细信息请参见[kubernetes/kubernetes＃52371](https://github.com/kubernetes/kubernetes/pull/52371)。

## CCM 的功能

CCM 从 Kubernetes 组件中继承了与云服务供应商相关的功能。本节基于被 CCM 继承其功能的组件展开描述。

### 1. Kubernetes 控制器管理器

CCM 的大部分功能都来自 KCM。 如上一节所述，CCM 运行以下控制引擎：

* 节点控制器
* 路由控制器
* 服务控制器
* PersistentVolumeLabels 控制器

#### 节点控制器

节点控制器负责通过从云服务供应商获得有关在集群中运行的节点的信息来初始化节点。节点控制器执行以下功能：

1.使用云特定域（Zone）/区（Region）标签初始化节点。

1.使用特定于云的实例详细信息初始化节点，例如类型和大小。

1.获取节点的网络地址和主机名。

1.如果节点无响应，检查该节点是否已从云中删除。如果该节点已从云中删除，则删除 Kubernetes 节点对象。

#### 路由控制器

路由控制器负责为云配置正确的路由，以便 Kubernetes 集群中不同节点上的容器可以相互通信。路由控制器仅适用于 Google Compute Engine 平台。

#### 服务控制器

服务控制器负责监听服务的创建、更新和删除事件。根据Kubernetes中各个服务的当前状态，它将配置云负载平衡器（如 ELB 或 Google LB）以反映 Kubernetes 中的服务状态。此外，它还确保云负载均衡器的服务后端保持最新。

#### PersistentVolumeLabels 控制器

PersistentVolumeLabels 控制器在 AWS 的 EBS 卷、GCE 的 PD 卷创建时申请标签，这使得用户不再需要手动设置这些卷标签。

这些标签对于pod的调度工作是非常重要的，因为这些卷只能在它们所在的域（Zone）/区（Region）内工作，因此所有使用这些卷的pod都必须要在同一个域/区中才能保证进行调度正常进行。

PersistentVolumeLabels 控制器是专门为 CCM 创建的; 也就是说，在 CCM 创建之前它是不存在的。这样做是为了将 Kubernetes API 服务器（它是一个许可控制器）中的PV标签逻辑移动到 CCM。 它不在 KCM 上运行。

### 2. Kubelet

Node控制器包含kubelet中依赖于云的功能。在系统引入 CCM 组件之前，是由 kubelet 采用包含云特定信息的方式对节点进行初始化，如 IP 地址、区（Region）/域（Zone）标签和实例类型信息；引入 CCM 之后，这部分的初始化操作就从 kubelet 转移到了 CCM 中。

在引入CCM后的新的模型中，kubelet 采用不包含云特定信息的方式初始化一个节点。但是，它会为新创建的节点添加一个污点，使得该节点不可被立即调度，直到 CCM 使用包含云的特定信息初始化节点后，才会删除该污点，使得该节点可被调度。

### 3. Kubernetes API 服务器

PersistentVolumeLabels 控制器将 Kubernetes API 服务器的依赖于云的功能移至 CCM，如前面部分所述。

## 插件机制

云控制器管理器使用 Go 接口与外部对接从而实现功能扩展。具体来说，它使用了[这里](https://github.com/kubernetes/kubernetes/blob/master/pkg/cloudprovider/cloud.go)定义的 CloudProvider 接口。

上面强调的四个共享控制器的实现，以及一些辅助设施（scaffolding）和共享的云服务供应商接口，将被保留在 Kubernetes 核心当中。但云服务供应商特有的实现将会建立在核心之外，并实现核心中定义的接口。

有关开发插件的更多信息，请参阅
[开发云控制器管理器](/docs/tasks/administrators-cluster/developing-cloud-controller-manager/)。

## 授权

本节分解了 CCM 对各种 API 对象的访问，以执行其操作。

### 节点控制器

节点控制器仅适用于节点对象。它需要完全访问权限来获取、列出、创建、更新、修补、监视和删除节点对象。

v1/Node: 
- Get
- List
- Create
- Update
- Patch
- Watch

### 路由控制器

路由控制器监听节点对象的创建并配置合适的路由。它需要对节点对象的访问权限。

v1/Node: 
- Get

### 服务控制器

服务控制器侦听服务对象创建、更新和删除事件，然后对这些服务的端点进行恰当的配置。

要访问服务，它需要罗列和监控权限。要更新服务，它需要修补和更新权限。

要为服务设置端点，需要访问创建、列表、获取、监视和更新。

v1/Service:
- List
- Get
- Watch
- Patch
- Update

### PersistentVolumeLabels 控制器

PersistentVolumeLabels 控制器监听 PersistentVolume（PV）创建事件并更新它们。该控制器需要访问列表、查看、获取和更新 PV 的权限。

v1/PersistentVolume:
- Get
- List
- Watch
- Update

### 其它

CCM 核心的实现需要创建事件的权限，为了确保安全操作，需要创建 ServiceAccounts 的权限。

v1/Event:
- Create
- Patch
- Update

v1/ServiceAccount:
- Create

针对 CCM 的 RBAC ClusterRole 如下所示：

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

## 供应商实施

以下云服务供应商为自己的云部署了 CCM。

* [Digital Ocean]()
* [Oracle]()
* [Azure]()
* [GCE]()
* [AWS]()

## 群集管理

[这里](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)提供了配置和运行 CCM 的完整说明。
