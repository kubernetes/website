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
使用雲基礎設施技術，你可以在公有云、私有云或者混合雲環境中執行 Kubernetes。
Kubernetes 的信條是基於自動化的、API 驅動的基礎設施，同時避免元件間緊密耦合。

{{< glossary_definition term_id="cloud-controller-manager" length="all" prepend="元件 cloud-controller-manager 是指雲控制器管理器，">}}

<!--
The cloud-controller-manager is structured using a plugin
mechanism that allows different cloud providers to integrate their platforms with Kubernetes.
-->
`cloud-controller-manager` 元件是基於一種外掛機制來構造的，
這種機制使得不同的雲廠商都能將其平臺與 Kubernetes 整合。

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

![Kubernetes 元件](/images/docs/components-of-kubernetes.svg)

雲控制器管理器以一組多副本的程序集合的形式執行在控制面中，通常表現為 Pod
中的容器。每個 `cloud-controller-manager` 在同一程序中實現多個
{{< glossary_tooltip text="控制器" term_id="controller" >}}。

<!--
You can also run the cloud controller manager as a Kubernetes
{{< glossary_tooltip text="addon" term_id="addons" >}} rather than as part
of the control plane.
-->
{{< note >}}
你也可以用 Kubernetes {{< glossary_tooltip text="外掛" term_id="addons" >}} 
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

節點控制器負責在雲基礎設施中建立了新伺服器時為之 更新
{{< glossary_tooltip text="節點（Node）" term_id="node" >}}物件。
節點控制器從雲提供商獲取當前租戶中主機的資訊。節點控制器執行以下功能：

<!--
1. Update a Node object with the corresponding server's unique identifier obtained from the cloud provider API.
2. Annotating and labelling the Node object with cloud-specific information, such as the region the node
   is deployed into and the resources (CPU, memory, etc) that it has available.
3. Obtain the node's hostname and network addresses.
4. Verifying the node's health. In case a node becomes unresponsive, this controller checks with
   your cloud provider's API to see if the server has been deactivated / deleted / terminated.
   If the node has been deleted from the cloud, the controller deletes the Node object from your Kubernetes
   cluster.
-->
1. 使用從雲平臺 API 獲取的對應伺服器的唯一識別符號更新 Node 物件；
2. 利用特定雲平臺的資訊為 Node 物件添加註解和標籤，例如節點所在的
   區域（Region）和所具有的資源（CPU、記憶體等等）；
3. 獲取節點的網路地址和主機名；
4. 檢查節點的健康狀況。如果節點無響應，控制器透過雲平臺 API 檢視該節點是否
   已從雲中禁用、刪除或終止。如果節點已從雲中刪除，則控制器從 Kubernetes 叢集
   中刪除 Node 物件。

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

Route 控制器負責適當地配置雲平臺中的路由，以便 Kubernetes 叢集中不同節點上的
容器之間可以相互通訊。

取決於雲驅動本身，路由控制器可能也會為 Pod 網路分配 IP 地址塊。

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
IP 地址、網路包過濾、目標健康檢查等雲基礎設施元件整合。
服務控制器與雲驅動的 API 互動，以配置負載均衡器和其他基礎設施元件。
你所建立的 Service 資源會需要這些元件服務。

<!--
## Authorization

This section breaks down the access that the cloud controller manager requires
on various API objects, in order to perform its operations.
-->
## 鑑權   {#authorization}

本節分別講述雲控制器管理器為了完成自身工作而產生的對各類 API 物件的訪問需求。

<!--
### Node controller {#authorization-node-controller}

The Node controller only works with Node objects. It requires full access
to read and modify Node objects.
-->
### 節點控制器  {#authorization-node-controller}

節點控制器只操作 Node 物件。它需要讀取和修改 Node 物件的完全訪問許可權。

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

路由控制器會監聽 Node 物件的建立事件，並據此配置路由設施。
它需要讀取 Node 物件的 Get 許可權。

`v1/Node`:

- Get

<!--
### Service controller {#authorization-service-controller}

The service controller listens to Service object Create, Update and Delete events and then configures Endpoints for those Services appropriately.

To access Services, it requires List, and Watch access. To update Services, it requires Patch and Update access.

To set up Endpoints resources for the Services, it requires access to Create, List, Get, Watch, and Update.
-->
### 服務控制器 {#authorization-service-controller}

服務控制器監測 Service 物件的 Create、Update 和 Delete 事件，並配置
對應服務的 Endpoints 物件。
為了訪問 Service 物件，它需要 List、Watch 訪問許可權；為了更新 Service 物件
它需要 Patch 和 Update 訪問許可權。
為了能夠配置 Service 對應的 Endpoints 資源，它需要 Create、List、Get、Watch
和 Update 等訪問許可權。

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

雲控制器管理器的實現中，其核心部分需要建立 Event 物件的訪問許可權以及
建立 ServiceAccount 資源以保證操作安全性的許可權。

`v1/Event`:

- Create
- Patch
- Update

`v1/ServiceAccount`:

- Create

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

To upgrade a HA control plane to use the cloud controller manager, see [Migrate Replicated Control Plane To Use Cloud Controller Manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/).

Want to know how to implement your own cloud controller manager, or extend an existing project?
-->
[雲控制器管理器的管理](/zh-cn/docs/tasks/administer-cluster/running-cloud-controller/#cloud-controller-manager)
給出了執行和管理雲控制器管理器的指南。

要升級 HA 控制平面以使用雲控制器管理器，請參見 [將複製的控制平面遷移以使用雲控制器管理器](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/)

想要了解如何實現自己的雲控制器管理器，或者對現有專案進行擴充套件麼？

<!--
The cloud controller manager uses Go interfaces to allow implementations from any cloud to be plugged in. Specifically, it uses the `CloudProvider` interface defined in [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69) from [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider).
-->
雲控制器管理器使用 Go 語言的介面，從而使得針對各種雲平臺的具體實現都可以接入。
其中使用了在 [kubernetes/cloud-provider](https://github.com/kubernetes/cloud-provider)
專案中 [`cloud.go`](https://github.com/kubernetes/cloud-provider/blob/release-1.21/cloud.go#L42-L69)
檔案所定義的 `CloudProvider` 介面。

<!--
The implementation of the shared controllers highlighted in this document (Node, Route, and Service), and some scaffolding along with the shared cloudprovider interface, is part of the Kubernetes core. Implementations specific to cloud providers are outside the core of Kubernetes and implement the `CloudProvider` interface.

For more information about developing plugins, see [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager/).
-->
本文中列舉的共享控制器（節點控制器、路由控制器和服務控制器等）的實現以及
其他一些生成具有 CloudProvider 介面的框架的程式碼，都是 Kubernetes 的核心程式碼。
特定於雲驅動的實現雖不是 Kubernetes 核心成分，仍要實現 `CloudProvider` 介面。

關於如何開發外掛的詳細資訊，可參考
[開發雲控制器管理器](/zh-cn/docs/tasks/administer-cluster/developing-cloud-controller-manager/)
文件。

