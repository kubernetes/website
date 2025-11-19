---
title: Node 自動擴縮容
linkTitle: Node 自動擴縮容
description: >-
  自動在集羣中製備和整合 Node，以適應需求並優化成本。
content_type: concept
weight: 15
---
<!--
reviewers:
- gjtempleton
- jonathan-innis
- maciekpytel
title: Node Autoscaling
linkTitle: Node Autoscaling
description: >-
  Automatically provision and consolidate the Nodes in your cluster to adapt to demand and optimize cost.
content_type: concept
weight: 15
-->

<!--
In order to run workloads in your cluster, you need
{{< glossary_tooltip text="Nodes" term_id="node" >}}. Nodes in your cluster can be _autoscaled_ -
dynamically [_provisioned_](#provisioning), or [_consolidated_](#consolidation) to provide needed
capacity while optimizing cost. Autoscaling is performed by Node [_autoscalers_](#autoscalers).
-->
爲了在集羣中運行負載，你需要 {{< glossary_tooltip text="Node" term_id="node" >}}。
集羣中的 Node 可以被**自動擴縮容**：
通過動態[**製備**](#provisioning)或[**整合**](#consolidation)的方式提供所需的容量並優化成本。
自動擴縮容操作是由 Node [**Autoscaler**](#autoscalers) 執行的。

<!--
## Node provisioning {#provisioning}

If there are Pods in a cluster that can't be scheduled on existing Nodes, new Nodes can be
automatically added to the cluster&mdash;_provisioned_&mdash;to accommodate the Pods. This is
especially useful if the number of Pods changes over time, for example as a result of
[combining horizontal workload with Node autoscaling](#horizontal-workload-autoscaling).

Autoscalers provision the Nodes by creating and deleting cloud provider resources backing them. Most
commonly, the resources backing the Nodes are Virtual Machines.
-->
## Node 製備   {#provisioning}

當集羣中有 Pod 無法被調度到現有 Node 上時，系統將**製備**新的 Node 並將其添加到集羣中，以容納這些 Pod。
如果由於組合使用[水平負載和 Node 自動擴縮容](#horizontal-workload-autoscaling)使得
Pod 個數隨着時間發生變化，這種自動擴縮容機制將特別有用。

Autoscaler 通過創建和刪除雲驅動基礎資源來製備 Node。最常見的支撐 Node 的資源是虛擬機（VM）。

<!--
The main goal of provisioning is to make all Pods schedulable. This goal is not always attainable
because of various limitations, including reaching configured provisioning limits, provisioning
configuration not being compatible with a particular set of pods, or the lack of cloud provider
capacity. While provisioning, Node autoscalers often try to achieve additional goals (for example
minimizing the cost of the provisioned Nodes or balancing the number of Nodes between failure
domains).
-->
製備的主要目標是使所有 Pod 可調度。
由於各種限制（如已達到配置的製備上限、製備配置與特定 Pod 集不兼容或雲驅動容量不足），此目標不一定總是可以實現。
在製備之時，Node Autoscaler 通常還會嘗試實現其他目標（例如最小化製備 Node 的成本或在故障域之間平衡 Node 的數量）。

<!--
There are two main inputs to a Node autoscaler when determining Nodes to
provision&mdash;[Pod scheduling constraints](#provisioning-pod-constraints),
and [Node constraints imposed by autoscaler configuration](#provisioning-node-constraints).

Autoscaler configuration may also include other Node provisioning triggers (for example the number
of Nodes falling below a configured minimum limit).
-->
在決定製備 Node 時針對 Node Autoscaler 有兩個主要輸入：

- [Pod 調度約束](#provisioning-pod-constraints)
- [Autoscaler 配置所施加的 Node 約束](#provisioning-node-constraints)

Autoscaler 配置也可以包含其他 Node 製備觸發條件（例如 Node 個數低於配置的最小限制值）。

{{< note >}}
<!--
Provisioning was formerly known as _scale-up_ in Cluster Autoscaler.
-->
在 Cluster Autoscaler 中，製備以前稱爲**擴容**。
{{< /note >}}

<!--
### Pod scheduling constraints {#provisioning-pod-constraints}

Pods can express [scheduling constraints](/docs/concepts/scheduling-eviction/assign-pod-node/) to
impose limitations on the kind of Nodes they can be scheduled on. Node autoscalers take these
constraints into account to ensure that the pending Pods can be scheduled on the provisioned Nodes.
-->
### Pod 調度約束 {#provisioning-pod-constraints}

Pod 可以通過[調度約束](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)表達只能調度到特定類別 Node 的限制。
Node Autoscaler 會考慮這些約束，確保 Pending 的 Pod 可以被調度到這些製備的 Node 上。

<!--
The most common kind of scheduling constraints are the resource requests specified by Pod
containers. Autoscalers will make sure that the provisioned Nodes have enough resources to satisfy
the requests. However, they don't directly take into account the real resource usage of the Pods
after they start running. In order to autoscale Nodes based on actual workload resource usage, you
can combine [horizontal workload autoscaling](#horizontal-workload-autoscaling) with Node
autoscaling.

Other common Pod scheduling constraints include
[Node affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity),
[inter-Pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity),
or a requirement for a particular [storage volume](/docs/concepts/storage/volumes/).
-->
最常見的調度約束是通過 Pod 容器所指定的資源請求。
Autoscaler 將確保製備的 Node 具有足夠資源來滿足這些請求。
但是，Autoscaler 不會在 Pod 開始運行之後直接考慮這些 Pod 的真實資源用量。
要根據實際負載資源用量自動擴縮容 Node，
你可以組合使用[水平負載自動擴縮容](#horizontal-workload-autoscaling)和 Node 自動擴縮容。

其他常見的 Pod 調度約束包括
[Node 親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)、
[Pod 間親和性/反親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)或特定[存儲卷](/docs/concepts/storage/volumes/)的要求。

<!--
### Node constraints imposed by autoscaler configuration {#provisioning-node-constraints}

The specifics of the provisioned Nodes (for example the amount of resources, the presence of a given
label) depend on autoscaler configuration. Autoscalers can either choose them from a pre-defined set
of Node configurations, or use [auto-provisioning](#autoprovisioning).
-->
### Autoscaler 配置施加的 Node 約束    {#provisioning-node-constraints}

已製備的 Node 的具體規格（例如資源量、給定標籤的存在與否）取決於 Autoscaler 配置。
Autoscaler 可以從一組預定義的 Node 配置中進行選擇，或使用[自動製備](#autoprovisioning)。

<!--
### Auto-provisioning {#autoprovisioning}

Node auto-provisioning is a mode of provisioning in which a user doesn't have to fully configure the
specifics of the Nodes that can be provisioned. Instead, the autoscaler dynamically chooses the Node
configuration based on the pending Pods it's reacting to, as well as pre-configured constraints (for
example, the minimum amount of resources or the need for a given label).
-->
### 自動製備   {#autoprovisioning}

Node 自動製備是一種用戶無需完全配置 Node 容許製備規格的製備模式。
Autoscaler 會基於 Pending 的 Pod 和預配置的約束（例如最小資源量或給定標籤的需求）動態選擇 Node 配置。

<!--
## Node consolidation {#consolidation}

The main consideration when running a cluster is ensuring that all schedulable pods are running,
whilst keeping the cost of the cluster as low as possible. To achieve this, the Pods' resource
requests should utilize as much of the Nodes' resources as possible. From this perspective, the
overall Node utilization in a cluster can be used as a proxy for how cost-effective the cluster is.
-->
## Node 整合     {#consolidation}

運行集羣時的主要考量是確保所有可調度 Pod 都在運行，並儘可能降低集羣成本。
爲此，Pod 的資源請求應儘可能利用 Node 的更多資源。
從這個角度看，集羣中的整體 Node 利用率可以用作集羣成本效益的參考指標。

{{< note >}}
<!--
Correctly setting the resource requests of your Pods is as important to the overall
cost-effectiveness of a cluster as optimizing Node utilization.
Combining Node autoscaling with [vertical workload autoscaling](#vertical-workload-autoscaling) can
help you achieve this.
-->
對於集羣的整體成本效益而言，正確設置 Pod 的資源請求與優化 Node 的利用率同樣重要。
將 Node 自動擴縮容與[垂直負載自動擴縮容](#vertical-workload-autoscaling)結合使用有助於實現這一目標。
{{< /note >}}

<!--
Nodes in your cluster can be automatically _consolidated_ in order to improve the overall Node
utilization, and in turn the cost-effectiveness of the cluster. Consolidation happens through
removing a set of underutilized Nodes from the cluster. Optionally, a different set of Nodes can
be [provisioned](#provisioning) to replace them.

Consolidation, like provisioning, only considers Pod resource requests and not real resource usage
when making decisions.
-->
集羣中的 Node 可以被自動**整合**，以提高整體 Node 利用率以及集羣的成本效益。
整合操作通過移除一組利用率低的 Node 來實現。有時會同時[製備](#provisioning)一組不同的 Node 來替代。

與製備類似，整合操作在做出決策時僅考慮 Pod 的資源請求而非實際的資源用量。

<!--
For the purpose of consolidation, a Node is considered _empty_ if it only has DaemonSet and static
Pods running on it. Removing empty Nodes during consolidation is more straightforward than non-empty
ones, and autoscalers often have optimizations designed specifically for consolidating empty Nodes.

Removing non-empty Nodes during consolidation is disruptive&mdash;the Pods running on them are
terminated, and possibly have to be recreated (for example by a Deployment). However, all such
recreated Pods should be able to schedule on existing Nodes in the cluster, or the replacement Nodes
provisioned as part of consolidation. __No Pods should normally become pending as a result of
consolidation.__
-->
在整合過程中，如果一個 Node 上僅運行 DaemonSet 和靜態 Pod，這個 Node 就會被視爲**空的**。
在整合期間移除空的 Node 要比操作非空 Node 更簡單直接，Autoscaler 通常針對空 Node 整合進行優化。

在整合期間移除非空 Node 會有破壞性：Node 上運行的 Pod 會被終止，且可能需要被重新創建（例如由 Deployment 重新創建）。
不過，所有被重新創建的 Pod 都應該能夠被調度到集羣中的現有 Node 上，或調度到作爲整合一部分而製備的替代 Node 上。
__正常情況下，整合操作不應導致 Pod 處於 Pending 狀態。__

{{< note >}}
<!--
Autoscalers predict how a recreated Pod will likely be scheduled after a Node is provisioned or
consolidated, but they don't control the actual scheduling. Because of this, some Pods might
become pending as a result of consolidation - if for example a completely new Pod appears while
consolidation is being performed.
-->
Autoscaler 會預測在 Node 被製備或整合後重新創建的 Pod 將可能以何種方式調度，但 Autoscaler 不控制實際的調度行爲。
因此，某些 Pod 可能由於整合操作而進入 Pending 狀態。例如在執行整合過程中，出現一個全新的 Pod。
{{< /note >}}

<!--
Autoscaler configuration may also enable triggering consolidation by other conditions (for example,
the time elapsed since a Node was created), in order to optimize different properties (for example,
the maximum lifespan of Nodes in a cluster).

The details of how consolidation is performed depend on the configuration of a given autoscaler.
-->
Autoscaler 配置還可以設爲由其他狀況觸發整合（例如 Node 被創建後用掉的時間），以優化屬性（例如集羣中 Node 的最大生命期）。

執行整合的具體方式取決於給定 Autoscaler 的配置。

{{< note >}}
<!--
Consolidation was formerly known as _scale-down_ in Cluster Autoscaler.
-->
在 Cluster Autoscaler 中， 整合以前稱爲**縮容**。
{{< /note >}}

<!--
## Autoscalers {#autoscalers}

The functionalities described in previous sections are provided by Node _autoscalers_. In addition
to the Kubernetes API, autoscalers also need to interact with cloud provider APIs to provision and
consolidate Nodes. This means that they need to be explicitly integrated with each supported cloud
provider. The performance and feature set of a given autoscaler can differ between cloud provider
integrations.
-->
## Autoscaler   {#autoscalers}

上述章節中所述的功能由 Node **Autoscaler** 提供。
除了 Kubernetes API 之外，Autoscaler 還需要與雲驅動 API 交互來製備和整合 Node。
這意味着 Autoscaler 需要與每個支持的雲驅動進行顯式集成。
給定的 Autoscaler 的性能和特性集在不同雲驅動集成之間可能有所不同。

{{< mermaid >}}
graph TD
    na[Node Autoscaler]
    k8s[Kubernetes]
    cp[雲驅動]

    k8s --> |獲取 Pod/Node|na
    na --> |騰空 Node|k8s
    na --> |創建/移除支撐 Node 的資源|cp
    cp --> |獲取支撐 Node 的資源|na

    classDef white_on_blue fill:#326ce5,stroke:#fff,stroke-width:4px,color:#fff;
    classDef blue_on_white fill:#fff,stroke:#bbb,stroke-width:2px,color:#326ce5;
    class na blue_on_white;
    class k8s,cp white_on_blue;
{{</ mermaid >}}

<!--
### Autoscaler implementations

[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)
and [Karpenter](https://github.com/kubernetes-sigs/karpenter) are the two Node autoscalers currently
sponsored by [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling).

From the perspective of a cluster user, both autoscalers should provide a similar Node autoscaling
experience. Both will provision new Nodes for unschedulable Pods, and both will consolidate the
Nodes that are no longer optimally utilized.
-->
### Autoscaler 實現

[Cluster Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler)
和 [Karpenter](https://github.com/kubernetes-sigs/karpenter)
是目前由 [SIG Autoscaling](https://github.com/kubernetes/community/tree/master/sig-autoscaling)
維護的兩個 Node Autoscaler。

對於集羣用戶來說，這兩個 Autoscaler 都應提供類似的 Node 自動擴縮容體驗。
兩個 Autoscaler 都將爲不可調度的 Pod 製備新的 Node，也都會整合利用率不高的 Node。

<!--
Different autoscalers may also provide features outside the Node autoscaling scope described on this
page, and those additional features may differ between them.

Consult the sections below, and the linked documentation for the individual autoscalers to decide
which autoscaler fits your use case better.
-->
不同的 Autoscaler 還可能提供本文所述的 Node 自動擴縮容範圍之外的其他特性，且這些額外的特性也會有所不同。

請參閱以下章節和特定 Autoscaler 的關聯文檔，瞭解哪個 Autoscaler 更適合你的使用場景。

<!--
#### Cluster Autoscaler

Cluster Autoscaler adds or removes Nodes to pre-configured _Node groups_. Node groups generally map
to some sort of cloud provider resource group (most commonly a Virtual Machine group). A single
instance of Cluster Autoscaler can simultaneously manage multiple Node groups. When provisioning,
Cluster Autoscaler will add Nodes to the group that best fits the requests of pending Pods. When
consolidating, Cluster Autoscaler always selects specific Nodes to remove, as opposed to just
resizing the underlying cloud provider resource group.
-->
#### Cluster Autoscaler

Cluster Autoscaler 通過向預先配置的 **Node 組**添加或移除 Node。
Node 組通常映射爲某種雲驅動資源組（最常見的是虛擬機組）。
單實例的 Cluster Autoscaler 將可以同時管理多個 Node 組。
在製備時，Cluster Autoscaler 將把 Node 添加到最貼合 Pending Pod 請求的組。
在整合時，Cluster Autoscaler 始終選擇要移除的特定 Node，而不只是重新調整雲驅動資源組的大小。

<!--
Additional context:

* [Documentation overview](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md)
* [Cloud provider integrations](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md#faqdocumentation)
* [Cluster Autoscaler FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
* [Contact](https://github.com/kubernetes/community/tree/master/sig-autoscaling#contact)
-->
更多信息：

* [文檔概述](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md)
* [雲驅動集成](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/README.md#faqdocumentation)
* [Cluster Autoscaler FAQ](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md)
* [聯繫方式](https://github.com/kubernetes/community/tree/master/sig-autoscaling#contact)

#### Karpenter

<!--
Karpenter auto-provisions Nodes based on [NodePool](https://karpenter.sh/docs/concepts/nodepools/)
configurations provided by the cluster operator. Karpenter handles all aspects of node lifecycle,
not just autoscaling. This includes automatically refreshing Nodes once they reach a certain
lifetime, and auto-upgrading Nodes when new worker Node images are released. It works directly with
individual cloud provider resources (most commonly individual Virtual Machines), and doesn't rely on
cloud provider resource groups.
-->
Karpenter 基於集羣操作員所提供的 [NodePool](https://karpenter.sh/docs/concepts/nodepools/)
配置來自動製備 Node。Karpenter 處理 Node 生命週期的所有方面，而不僅僅是自動擴縮容。
這包括 Node 達到某個生命期後的自動刷新，以及在有新 Worker Node 鏡像被髮布時的自動升級。
Karpenter 直接與特定的雲驅動資源（通常是單獨的虛擬機）交互，不依賴雲驅動資源組。

<!--
Additional context:

* [Documentation](https://karpenter.sh/)
* [Cloud provider integrations](https://github.com/kubernetes-sigs/karpenter?tab=readme-ov-file#karpenter-implementations)
* [Karpenter FAQ](https://karpenter.sh/docs/faq/)
* [Contact](https://github.com/kubernetes-sigs/karpenter#community-discussion-contribution-and-support)
-->
更多上下文信息：

* [官方文檔](https://karpenter.sh/)
* [雲驅動集成](https://github.com/kubernetes-sigs/karpenter?tab=readme-ov-file#karpenter-implementations)
* [Karpenter FAQ](https://karpenter.sh/docs/faq/)
* [聯繫方式](https://github.com/kubernetes-sigs/karpenter#community-discussion-contribution-and-support)

<!--
#### Implementation comparison

Main differences between Cluster Autoscaler and Karpenter:

* Cluster Autoscaler provides features related to just Node autoscaling. Karpenter has a wider
  scope, and also provides features intended for managing Node lifecycle altogether (for example,
  utilizing disruption to auto-recreate Nodes once they reach a certain lifetime, or auto-upgrade
  them to new versions).
-->
#### 實現對比

Cluster Autoscaler 和 Karpenter 之間的主要差異：

* Cluster Autoscaler 僅提供與 Node 自動擴縮容相關的特性。
  而 Karpenter 的特性範圍更大，還提供 Node 生命週期管理
  （例如在 Node 達到某個生命期後利用中斷來自動重新創建 Node，或自動將 Node 升級到新版本）。

<!--
* Cluster Autoscaler doesn't support auto-provisioning, the Node groups it can provision from have
  to be pre-configured. Karpenter supports auto-provisioning, so the user only has to configure a
  set of constraints for the provisioned Nodes, instead of fully configuring homogenous groups.
* Cluster Autoscaler provides cloud provider integrations directly, which means that they're a part
  of the Kubernetes project. For Karpenter, the Kubernetes project publishes Karpenter as a library
  that cloud providers can integrate with to build a Node autoscaler.
* Cluster Autoscaler provides integrations with numerous cloud providers, including smaller and less
  popular providers. There are fewer cloud providers that integrate with Karpenter, including
  [AWS](https://github.com/aws/karpenter-provider-aws), and
  [Azure](https://github.com/Azure/karpenter-provider-azure).
-->
* Cluster Autoscaler 不支持自動製備，其可以製備的 Node 組必須被預先配置。
  Karpenter 支持自動製備，因此用戶只需爲製備的 Node 配置一組約束，而不需要完整同質化的組。
* Cluster Autoscaler 直接提供雲驅動集成，這意味着這些集成組件是 Kubernetes 項目的一部分。
  對於 Karpenter，Kubernetes 將 Karpenter 發佈爲一個庫，雲驅動可以集成這個庫來構建 Node Autoscaler。
* Cluster Autoscaler 爲衆多雲驅動提供集成，包括一些小衆的雲驅動。
  Karpenter 支持的雲驅動相對較少，目前包括
  [AWS](https://github.com/aws/karpenter-provider-aws) 和
  [Azure](https://github.com/Azure/karpenter-provider-azure)。

<!--
## Combine workload and Node autoscaling

### Horizontal workload autoscaling {#horizontal-workload-autoscaling}

Node autoscaling usually works in response to Pods&mdash;it provisions new Nodes to accommodate
unschedulable Pods, and then consolidates the Nodes once they're no longer needed.
-->
## 組合使用負載自動擴縮容與 Node 自動擴縮容   {#combine-workload-and-node-autoscaling}

### 水平負載自動擴縮容   {#horizontal-workload-autoscaling}

Node 自動擴縮容通常是爲了響應 Pod 而發揮作用的。
它會製備新的 Node 容納不可調度的 Pod，並在不再需要這些 Pod 時整合 Node。

<!--
[Horizontal workload autoscaling](/docs/concepts/workloads/autoscaling#scaling-workloads-horizontally)
automatically scales the number of workload replicas to maintain a desired average resource
utilization across the replicas. In other words, it automatically creates new Pods in response to
application load, and then removes the Pods once the load decreases.

You can use Node autoscaling together with horizontal workload autoscaling to autoscale the Nodes in
your cluster based on the average real resource utilization of your Pods.
-->
[水平負載自動擴縮容](/zh-cn/docs/concepts/workloads/autoscaling#scaling-workloads-horizontally)
自動擴縮負載副本的個數以保持各個副本達到預期的平均資源利用率。
換言之，它會基於應用負載而自動創建新的 Pod，並在負載減少時移除 Pod。

<!--
If the application load increases, the average utilization of its Pods should also increase,
prompting workload autoscaling to create new Pods. Node autoscaling should then provision new Nodes
to accommodate the new Pods.

Once the application load decreases, workload autoscaling should remove unnecessary Pods. Node
autoscaling should, in turn, consolidate the Nodes that are no longer needed.

If configured correctly, this pattern ensures that your application always has the Node capacity to
handle load spikes if needed, but you don't have to pay for the capacity when it's not needed.
-->
如果應用負載增加，其 Pod 的平均利用率也會增加，將提示負載自動擴縮容以創建新的 Pod。
Node 自動擴縮容隨之應制備新的 Node 以容納新的 Pod。

一旦應用負載減少，負載自動擴縮容應移除不必要的 Pod。
Node 自動擴縮容應按序整合不再需要的 Node。

如果配置正確，這種模式確保你的應用在需要時始終有足夠的 Node 容量處理突發負載，你也無需在閒置時爲這些 Node 容量支付費用。

<!--
### Vertical workload autoscaling {#vertical-workload-autoscaling}

When using Node autoscaling, it's important to set Pod resource requests correctly. If the requests
of a given Pod are too low, provisioning a new Node for it might not help the Pod actually run.
If the requests of a given Pod are too high, it might incorrectly prevent consolidating its Node.
-->
### 垂直負載自動擴縮容   {#vertical-workload-autoscaling}

在使用 Node 自動擴縮容時，重要的是正確設置 Pod 資源請求。
如果給定 Pod 的請求過低，爲其製備新的 Node 可能對 Pod 實際運行並無幫助。
如果給定 Pod 的請求過高，則可能對整合 Node 有所妨礙。

<!--
[Vertical workload autoscaling](/docs/concepts/workloads/autoscaling#scaling-workloads-vertically)
automatically adjusts the resource requests of your Pods based on their historical resource usage.

You can use Node autoscaling together with vertical workload autoscaling in order to adjust the
resource requests of your Pods while preserving Node autoscaling capabilities in your cluster.
-->
[垂直負載自動擴縮容](/zh-cn/docs/concepts/workloads/autoscaling#scaling-workloads-vertically)
基於其歷史資源用量來自動調整 Pod 的資源請求。

你可以一起使用 Node 自動擴縮容和垂直負載自動擴縮容，以便在集羣中保留 Node 自動擴縮容能力的同時調節 Pod 的資源請求。

{{< caution >}}
<!--
When using Node autoscaling, it's not recommended to set up vertical workload autoscaling for
DaemonSet Pods. Autoscalers have to predict what DaemonSet Pods on a new Node will look like in
order to predict available Node resources. Vertical workload autoscaling might make these
predictions unreliable, leading to incorrect scaling decisions.
-->
在使用 Node 自動擴縮容時，不推薦爲 DaemonSet Pod 配置垂直負載自動擴縮容。
Autoscaler 需要預測新 Node 上的 DaemonSet Pod 情況，才能預測可用的 Node 資源。
垂直負載自動擴縮容可能會讓這些預測不可靠，導致擴縮容決策出錯。
{{</ caution >}}

<!--
## Related components

This section describes components providing functionality related to Node autoscaling.

### Descheduler

The [descheduler](https://github.com/kubernetes-sigs/descheduler) is a component providing Node
consolidation functionality based on custom policies, as well as other features related to
optimizing Nodes and Pods (for example deleting frequently restarting Pods).
-->
## 相關組件   {#related-components}

本節以下組件提供與 Node 自動擴縮容相關的功能。

### Descheduler

[Descheduler](https://github.com/kubernetes-sigs/descheduler)
組件基於自定義策略提供 Node 整合功能，以及與優化 Node 和 Pod 相關的其他特性（例如刪除頻繁重啓的 Pod）。

<!--
### Workload autoscalers based on cluster size

[Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler)
and [Cluster Proportional Vertical
Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler) provide
horizontal, and vertical workload autoscaling based on the number of Nodes in the cluster. You can
read more in
[autoscaling based on cluster size](/docs/concepts/workloads/autoscaling#autoscaling-based-on-cluster-size).
-->
### 基於集羣規模的負載 Autoscaler

[Cluster Proportional Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-autoscaler) 和
[Cluster Proportional Vertical Autoscaler](https://github.com/kubernetes-sigs/cluster-proportional-vertical-autoscaler)
基於集羣中的 Node 個數進行水平和垂直負載自動擴縮容。
更多細節參閱[基於集羣規模自動擴縮容](/zh-cn/docs/concepts/workloads/autoscaling#autoscaling-based-on-cluster-size)。

## {{% heading "whatsnext" %}}

<!--
- Read about [workload-level autoscaling](/docs/concepts/workloads/autoscaling/)
-->
- 閱讀[負載層面的自動擴縮容](/zh-cn/docs/concepts/workloads/autoscaling/)
