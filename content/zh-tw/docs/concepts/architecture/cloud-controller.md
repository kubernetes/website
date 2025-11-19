---
title: 雲控制器管理器
content_type: concept
weight: 40
---
<!--
title: Cloud Controller Manager
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
使用雲基礎設施技術，你可以在公有云、私有云或者混合雲環境中運行 Kubernetes。
Kubernetes 的信條是基於自動化的、API 驅動的基礎設施，同時避免組件間緊密耦合。

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="組件 cloud-controller-manager 是指雲控制器管理器，">}}

<!--
The cloud-controller-manager is structured using a plugin
mechanism that allows different cloud providers to integrate their platforms with Kubernetes.
-->
`cloud-controller-manager` 組件是基於一種插件機制來構造的，
這種機制使得不同的雲廠商都能將其平臺與 Kubernetes 集成。

<!-- body -->
<!--
## Design

![Kubernetes components](/images/docs/components-of-kubernetes.svg)

The cloud controller manager runs in the control plane as a replicated set of processes
(usually, these are containers in Pods). Each cloud-controller-manager implements
multiple {{< glossary_tooltip text="controllers" term_id="controller" >}} in a single
process.
-->
## 設計  {#design}

{{< figure src="/zh-cn/docs/images/components-of-kubernetes.svg" alt="此圖展示了 Kubernetes 集羣的組件" class="diagram-medium" >}}

雲控制器管理器以一組多副本的進程集合的形式運行在控制面中，通常表現爲 Pod
中的容器。每個 `cloud-controller-manager`
在同一進程中實現多個{{< glossary_tooltip text="控制器" term_id="controller" >}}。

{{< note >}}
<!--
You can also run the cloud controller manager as a Kubernetes
{{< glossary_tooltip text="addon" term_id="addons" >}} rather than as part
of the control plane.
-->
你也可以用 Kubernetes {{< glossary_tooltip text="插件" term_id="addons" >}}
的形式而不是控制面中的一部分來運行雲控制器管理器。
{{< /note >}}

<!--
## Cloud controller manager functions {#functions-of-the-ccm}

The controllers inside the cloud controller manager include:
-->
## 雲控制器管理器的功能 {#functions-of-the-ccm}

雲控制器管理器中的控制器包括：

<!--
### Node controller

The node controller is responsible for updating {{< glossary_tooltip text="Node" term_id="node" >}} objects
when new servers are created in your cloud infrastructure. The node controller obtains information about the
hosts running inside your tenancy with the cloud provider. The node controller performs the following functions:
-->
### 節點控制器   {#node-controller}

節點控制器負責在雲基礎設施中創建了新服務器時爲之更新{{< glossary_tooltip text="節點（Node）" term_id="node" >}}對象。
節點控制器從雲提供商獲取當前租戶中主機的信息。節點控制器執行以下功能：

<!--
1. Update a Node object with the corresponding server's unique identifier obtained from the cloud provider API.
1. Annotating and labelling the Node object with cloud-specific information, such as the region the node
   is deployed into and the resources (CPU, memory, etc) that it has available.
1. Obtain the node's hostname and network addresses.
1. Verifying the node's health. In case a node becomes unresponsive, this controller checks with
   your cloud provider's API to see if the server has been deactivated / deleted / terminated.
   If the node has been deleted from the cloud, the controller deletes the Node object from your Kubernetes
   cluster.
-->
1. 使用從雲平臺 API 獲取的對應服務器的唯一標識符更新 Node 對象；
2. 利用特定雲平臺的信息爲 Node 對象添加註解和標籤，例如節點所在的區域
   （Region）和所具有的資源（CPU、內存等等）；
3. 獲取節點的網絡地址和主機名；
4. 檢查節點的健康狀況。如果節點無響應，控制器通過雲平臺 API
   查看該節點是否已從雲中禁用、刪除或終止。如果節點已從雲中刪除，
   則控制器從 Kubernetes 集羣中刪除 Node 對象。

<!--
Some cloud provider implementations split this into a node controller and a separate node
lifecycle controller.
-->
某些雲驅動實現中，這些任務被劃分到一個節點控制器和一個節點生命週期控制器中。

<!--
### Route controller

The route controller is responsible for configuring routes in the cloud
appropriately so that containers on different nodes in your Kubernetes
cluster can communicate with each other.

Depending on the cloud provider, the route controller might also allocate blocks
of IP addresses for the Pod network.
-->
### 路由控制器   {#route-controller}

Route 控制器負責適當地配置雲平臺中的路由，以便 Kubernetes 集羣中不同節點上的容器之間可以相互通信。

取決於雲驅動本身，路由控制器可能也會爲 Pod 網絡分配 IP 地址塊。

<!--
### Service controller

{{< glossary_tooltip text="Services" term_id="service" >}} integrate with cloud
infrastructure components such as managed load balancers, IP addresses, network
packet filtering, and target health checking. The service controller interacts with your
cloud provider's APIs to set up load balancers and other infrastructure components
when you declare a Service resource that requires them.
-->
### 服務控制器   {#service-controller}

{{< glossary_tooltip text="服務（Service）" term_id="service" >}}與受控的負載均衡器、
IP 地址、網絡包過濾、目標健康檢查等雲基礎設施組件集成。
服務控制器與雲驅動的 API 交互，以配置負載均衡器和其他基礎設施組件。
你所創建的 Service 資源會需要這些組件服務。

<!--
## Authorization

This section breaks down the access that the cloud controller manager requires
on various API objects, in order to perform its operations.
-->
## 鑑權   {#authorization}

本節分別講述雲控制器管理器爲了完成自身工作而產生的對各類 API 對象的訪問需求。

<!--
### Node controller {#authorization-node-controller}

The Node controller only works with Node objects. It requires full access
to read and modify Node objects.
-->
### 節點控制器  {#authorization-node-controller}

節點控制器只操作 Node 對象。它需要讀取和修改 Node 對象的完全訪問權限。

`v1/Node`：

- get
- list
- create
- update
- patch
- watch
- delete

<!--
### Route controller {#authorization-route-controller}

The route controller listens to Node object creation and configures
routes appropriately. It requires Get access to Node objects.
-->
### 路由控制器 {#authorization-route-controller}

路由控制器會監聽 Node 對象的創建事件，並據此配置路由設施。
它需要讀取 Node 對象的 Get 權限。

`v1/Node`：

- get

<!--
### Service controller {#authorization-service-controller}

The service controller watches for Service object **create**, **update** and **delete** events and then
configures load balancers for those Services appropriately.

To access Services, it requires **list**, and **watch** access. To update Services, it requires
**patch** and **update** access to the `status` subresource.
-->
### 服務控制器 {#authorization-service-controller}

服務控制器監測 Service 對象的 **create**、**update** 和 **delete** 事件，
並配置對應 Service 的負載均衡器。

爲了訪問 Service 對象，它需要 **list** 和 **watch** 訪問權限。
爲了更新 Service 對象，它需要針對 `status` 子資源的 **patch** 和 **update** 訪問權限。

`v1/Service`：

- list
- get
- watch
- patch
- update

<!--
### Others {#authorization-miscellaneous}

The implementation of the core of the cloud controller manager requires access to create Event
objects, and to ensure secure operation, it requires access to create ServiceAccounts.
-->
### 其他  {#authorization-miscellaneous}

在雲控制器管理器的實現中，其核心部分需要創建 Event 對象的訪問權限，
並創建 ServiceAccount 資源以保證操作安全性的權限。

`v1/Event`:

- create
- patch
- update

`v1/ServiceAccount`:

- create

<!--
The {{< glossary_tooltip term_id="rbac" text="RBAC" >}} ClusterRole for the cloud
controller manager looks like:
-->
用於雲控制器管理器 {{< glossary_tooltip term_id="rbac" text="RBAC" >}}
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
  - watch
- apiGroups:
  - ""
  resources:
  - services/status
  verbs:
  - patch
  - update
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
```

## {{% heading "whatsnext" %}}

<!--
* [Cloud Controller Manager Administration](/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
  has instructions on running and managing the cloud controller manager.

* To upgrade a HA control plane to use the cloud controller manager, see
  [Migrate Replicated Control Plane To Use Cloud Controller Manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

* Want to know how to implement your own cloud controller manager, or extend an existing project?
-->
* [雲控制器管理器的管理](/zh-cn/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
給出了運行和管理雲控制器管理器的指南。

* 要升級 HA 控制平面以使用雲控制器管理器，
請參見[將複製的控制平面遷移以使用雲控制器管理器](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/)。

* 想要了解如何實現自己的雲控制器管理器，或者對現有項目進行擴展麼？

  <!--
  - The cloud controller manager uses Go interfaces, specifically, `CloudProvider` interface defined in
    [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69)
    from [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider) to allow
    implementations from any cloud to be plugged in.
  -->
  - 雲控制器管理器使用 Go 語言的接口（具體指在
    [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider)
    項目中 [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.26/cloud.go#L43-L69)
    文件中所定義的 `CloudProvider` 接口），從而使得針對各種雲平臺的具體實現都可以接入。

  <!--
  - The implementation of the shared controllers highlighted in this document (Node, Route, and Service),
    and some scaffolding along with the shared cloudprovider interface, is part of the Kubernetes core.
    Implementations specific to cloud providers are outside the core of Kubernetes and implement
    the `CloudProvider` interface.
  -->
  - 本文中列舉的共享控制器（節點控制器、路由控制器和服務控制器等）的實現以及其他一些生成具有
    CloudProvider 接口的框架的代碼，都是 Kubernetes 的核心代碼。
    特定於雲驅動的實現雖不是 Kubernetes 核心成分，仍要實現 `CloudProvider` 接口。

  <!--
  - For more information about developing plugins,
    see [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
  -->
  - 關於如何開發插件的詳細信息，
    可參考[開發雲控制器管理器](/zh-cn/docs/tasks/administer-cluster/developing-cloud-controller-manager/)文檔。
