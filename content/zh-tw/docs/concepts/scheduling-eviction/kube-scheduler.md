---
title: Kubernetes 調度器
content_type: concept
weight: 10
---

<!--
title: Kubernetes Scheduler
content_type: concept
weight: 10
-->
<!-- overview -->

<!--
In Kubernetes, _scheduling_ refers to making sure that {{< glossary_tooltip text="Pods" term_id="pod" >}}
are matched to {{< glossary_tooltip text="Nodes" term_id="node" >}} so that
{{< glossary_tooltip term_id="kubelet" >}} can run them.
-->
在 Kubernetes 中，**調度**是指將 {{< glossary_tooltip text="Pod" term_id="pod" >}}
放置到合適的{{< glossary_tooltip text="節點" term_id="node" >}}上，以便對應節點上的
{{< glossary_tooltip term_id="kubelet" >}} 能夠運行這些 Pod。

<!-- body -->
<!--
## Scheduling overview {#scheduling}
-->
## 調度概覽 {#scheduling}

<!--
A scheduler watches for newly created Pods that have no Node assigned. For
every Pod that the scheduler discovers, the scheduler becomes responsible
for finding the best Node for that Pod to run on. The scheduler reaches
this placement decision taking into account the scheduling principles
described below.
-->
調度器通過 Kubernetes 的監測（Watch）機制來發現集羣中新創建且尚未被調度到節點上的 Pod。
調度器會將所發現的每一個未調度的 Pod 調度到一個合適的節點上來運行。
調度器會依據下文的調度原則來做出調度選擇。

<!--
If you want to understand why Pods are placed onto a particular Node,
or if you're planning to implement a custom scheduler yourself, this
page will help you learn about scheduling.
-->
如果你想要理解 Pod 爲什麼會被調度到特定的節點上，
或者你想要嘗試實現一個自定義的調度器，這篇文章將幫助你瞭解調度。

<!--
## kube-scheduler
-->
## kube-scheduler

<!--
[kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/)
is the default scheduler for Kubernetes and runs as part of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
kube-scheduler is designed so that, if you want and need to, you can
write your own scheduling component and use that instead.
-->
[kube-scheduler](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
是 Kubernetes 集羣的默認調度器，並且是集羣
{{< glossary_tooltip text="控制面" term_id="control-plane" >}} 的一部分。
如果你真的希望或者有這方面的需求，kube-scheduler
在設計上允許你自己編寫一個調度組件並替換原有的 kube-scheduler。

<!--
Kube-scheduler selects an optimal node to run newly created or not yet
scheduled (unscheduled) pods. Since containers in pods - and pods themselves -
can have different requirements, the scheduler filters out any nodes that
don't meet a Pod's specific scheduling needs. Alternatively, the API lets
you specify a node for a Pod when you create it, but this is unusual
and is only done in special cases.
-->
Kube-scheduler 選擇一個最佳節點來運行新創建的或尚未調度（unscheduled）的 Pod。
由於 Pod 中的容器和 Pod 本身可能有不同的要求，調度程序會過濾掉任何不滿足 Pod 特定調度需求的節點。
或者，API 允許你在創建 Pod 時爲它指定一個節點，但這並不常見，並且僅在特殊情況下才會這樣做。

<!--
In a cluster, Nodes that meet the scheduling requirements for a Pod
are called _feasible_ nodes. If none of the nodes are suitable, the pod
remains unscheduled until the scheduler is able to place it.
-->
在一個集羣中，滿足一個 Pod 調度請求的所有節點稱之爲**可調度節點**。
如果沒有任何一個節點能滿足 Pod 的資源請求，
那麼這個 Pod 將一直停留在未調度狀態直到調度器能夠找到合適的 Node。

<!--
The scheduler finds feasible Nodes for a Pod and then runs a set of
functions to score the feasible Nodes and picks a Node with the highest
score among the feasible ones to run the Pod. The scheduler then notifies
the API server about this decision in a process called _binding_.
-->
調度器先在集羣中找到一個 Pod 的所有可調度節點，然後根據一系列函數對這些可調度節點打分，
選出其中得分最高的節點來運行 Pod。之後，調度器將這個調度決定通知給
kube-apiserver，這個過程叫做**綁定**。

<!--
Factors that need to be taken into account for scheduling decisions include
individual and collective resource requirements, hardware / software /
policy constraints, affinity and anti-affinity specifications, data
locality, inter-workload interference, and so on.
-->
在做調度決定時需要考慮的因素包括：單獨和整體的資源請求、硬件/軟件/策略限制、
親和以及反親和要求、數據局部性、負載間的干擾等等。

<!--
### Node selection in kube-scheduler {#kube-scheduler-implementation}
-->
### kube-scheduler 中的節點選擇 {#kube-scheduler-implementation}

<!--
kube-scheduler selects a node for the pod in a 2-step operation:

1. Filtering
1. Scoring
-->
kube-scheduler 給一個 Pod 做調度選擇時包含兩個步驟：

1. 過濾
2. 打分

<!--
The _filtering_ step finds the set of Nodes where it's feasible to
schedule the Pod. For example, the PodFitsResources filter checks whether a
candidate Node has enough available resources to meet a Pod's specific
resource requests. After this step, the node list contains any suitable
Nodes; often, there will be more than one. If the list is empty, that
Pod isn't (yet) schedulable.
-->
過濾階段會將所有滿足 Pod 調度需求的節點選出來。
例如，PodFitsResources 過濾函數會檢查候選節點的可用資源能否滿足 Pod 的資源請求。
在過濾之後，得出一個節點列表，裏面包含了所有可調度節點；通常情況下，
這個節點列表包含不止一個節點。如果這個列表是空的，代表這個 Pod 不可調度。

<!--
In the _scoring_ step, the scheduler ranks the remaining nodes to choose
the most suitable Pod placement. The scheduler assigns a score to each Node
that survived filtering, basing this score on the active scoring rules.
-->
在打分階段，調度器會爲 Pod 從所有可調度節點中選取一個最合適的節點。
根據當前啓用的打分規則，調度器會給每一個可調度節點進行打分。

<!--
Finally, kube-scheduler assigns the Pod to the Node with the highest ranking.
If there is more than one node with equal scores, kube-scheduler selects
one of these at random.
-->
最後，kube-scheduler 會將 Pod 調度到得分最高的節點上。
如果存在多個得分最高的節點，kube-scheduler 會從中隨機選取一個。

<!--
There are two supported ways to configure the filtering and scoring behavior
of the scheduler:
-->
支持以下兩種方式配置調度器的過濾和打分行爲：

<!--
1. [Scheduling Policies](/docs/reference/scheduling/policies) allow you to
  configure _Predicates_ for filtering and _Priorities_ for scoring.
1. [Scheduling Profiles](/docs/reference/scheduling/config/#profiles) allow you to
  configure Plugins that implement different scheduling stages, including:
  `QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit`, and others. You
  can also configure the kube-scheduler to run different profiles.
 -->
1. [調度策略](/zh-cn/docs/reference/scheduling/policies)
   允許你配置過濾所用的 **斷言（Predicates）** 和打分所用的 **優先級（Priorities）**。
2. [調度配置](/zh-cn/docs/reference/scheduling/config/#profiles) 允許你配置實現不同調度階段的插件，
   包括：`QueueSort`、`Filter`、`Score`、`Bind`、`Reserve`、`Permit` 等等。
   你也可以配置 kube-scheduler 運行不同的配置文件。

## {{% heading "whatsnext" %}}
<!--
* Read about [scheduler performance tuning](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* Read about [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* Read the [reference documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) for kube-scheduler
* Read the [kube-scheduler config (v1)](/docs/reference/config-api/kube-scheduler-config.v1/) reference
* Learn about [configuring multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
* Learn about [topology management policies](/docs/tasks/administer-cluster/topology-manager/)
* Learn about [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
* Learn about scheduling of Pods that use volumes in:
  * [Volume Topology Support](/docs/concepts/storage/storage-classes/#volume-binding-mode)
  * [Storage Capacity Tracking](/docs/concepts/storage/storage-capacity/)
  * [Node-specific Volume Limits](/docs/concepts/storage/storage-limits/)
-->
* 閱讀關於[調度器性能調優](/zh-cn/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* 閱讀關於 [Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)
* 閱讀關於 kube-scheduler 的[參考文檔](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
* 閱讀 [kube-scheduler 配置參考（v1）](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1/)
* 瞭解關於[配置多個調度器](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/) 的方式
* 瞭解關於[拓撲結構管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)
* 瞭解關於 [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
* 瞭解關於如何在以下情形使用捲來調度 Pod：
  * [卷拓撲支持](/zh-cn/docs/concepts/storage/storage-classes/#volume-binding-mode)
  * [存儲容量跟蹤](/zh-cn/docs/concepts/storage/storage-capacity/)
  * [特定於節點的卷數限制](/zh-cn/docs/concepts/storage/storage-limits/)
