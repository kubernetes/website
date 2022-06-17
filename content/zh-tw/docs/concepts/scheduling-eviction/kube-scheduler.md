---
title: Kubernetes 排程器
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
在 Kubernetes 中，_排程_ 是指將 {{< glossary_tooltip text="Pod" term_id="pod" >}} 放置到合適的
{{< glossary_tooltip text="Node" term_id="node" >}} 上，然後對應 Node 上的
{{< glossary_tooltip term_id="kubelet" >}} 才能夠執行這些 pod。

<!-- body -->
<!--
## Scheduling overview {#scheduling}
-->
## 排程概覽 {#scheduling}

<!--
A scheduler watches for newly created Pods that have no Node assigned. For
every Pod that the scheduler discovers, the scheduler becomes responsible
for finding the best Node for that Pod to run on. The scheduler reaches
this placement decision taking into account the scheduling principles
described below.
-->
排程器透過 kubernetes 的監測（Watch）機制來發現叢集中新建立且尚未被排程到 Node 上的 Pod。
排程器會將發現的每一個未排程的 Pod 排程到一個合適的 Node 上來執行。
排程器會依據下文的排程原則來做出排程選擇。

<!--
If you want to understand why Pods are placed onto a particular Node,
or if you're planning to implement a custom scheduler yourself, this
page will help you learn about scheduling.
-->
如果你想要理解 Pod 為什麼會被排程到特定的 Node 上，或者你想要嘗試實現
一個自定義的排程器，這篇文章將幫助你瞭解排程。

<!--
## kube-scheduler
-->
## kube-scheduler

<!--
[kube-scheduler](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-scheduler/)
is the default scheduler for Kubernetes and runs as part of the
{{< glossary_tooltip text="control plane" term_id="control-plane" >}}.
kube-scheduler is designed so that, if you want and need to, you can
write your own scheduling component and use that instead.
-->
[kube-scheduler](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
是 Kubernetes 叢集的預設排程器，並且是叢集
{{< glossary_tooltip text="控制面" term_id="control-plane" >}} 的一部分。
如果你真的希望或者有這方面的需求，kube-scheduler 在設計上是允許
你自己寫一個排程元件並替換原有的 kube-scheduler。

<!--
For every newly created pods or other unscheduled pods, kube-scheduler
selects a optimal node for them to run on.  However, every container in
pods has different requirements for resources and every pod also has
different requirements. Therefore, existing nodes need to be filtered
according to the specific scheduling requirements.
-->
對每一個新建立的 Pod 或者是未被排程的 Pod，kube-scheduler 會選擇一個最優的
Node 去執行這個 Pod。然而，Pod 內的每一個容器對資源都有不同的需求，而且
Pod 本身也有不同的資源需求。因此，Pod 在被排程到 Node 上之前，
根據這些特定的資源排程需求，需要對叢集中的 Node 進行一次過濾。

<!--
In a cluster, Nodes that meet the scheduling requirements for a Pod
are called _feasible_ nodes. If none of the nodes are suitable, the pod
remains unscheduled until the scheduler is able to place it.
-->
在一個叢集中，滿足一個 Pod 排程請求的所有 Node 稱之為 _可排程節點_。
如果沒有任何一個 Node 能滿足 Pod 的資源請求，那麼這個 Pod 將一直停留在
未排程狀態直到排程器能夠找到合適的 Node。

<!--
The scheduler finds feasible Nodes for a Pod and then runs a set of
functions to score the feasible Nodes and picks a Node with the highest
score among the feasible ones to run the Pod. The scheduler then notifies
the API server about this decision in a process called _binding_.
-->
排程器先在叢集中找到一個 Pod 的所有可排程節點，然後根據一系列函式對這些可排程節點打分，
選出其中得分最高的 Node 來執行 Pod。之後，排程器將這個排程決定通知給
kube-apiserver，這個過程叫做 _繫結_。

<!--
Factors that need to be taken into account for scheduling decisions include
individual and collective resource requirements, hardware / software /
policy constraints, affinity and anti-affinity specifications, data
locality, inter-workload interference, and so on.
-->
在做排程決定時需要考慮的因素包括：單獨和整體的資源請求、硬體/軟體/策略限制、
親和以及反親和要求、資料局域性、負載間的干擾等等。

<!--
## Scheduling with kube-scheduler {#kube-scheduler-implementation}
-->
## kube-scheduler 排程流程 {#kube-scheduler-implementation}

<!--
kube-scheduler selects a node for the pod in a 2-step operation:

1. Filtering
2. Scoring
-->
kube-scheduler 給一個 pod 做排程選擇包含兩個步驟：

1. 過濾
2. 打分

<!--
The _filtering_ step finds the set of Nodes where it's feasible to
schedule the Pod. For example, the PodFitsResources filter checks whether a
candidate Node has enough available resource to meet a Pod's specific
resource requests. After this step, the node list contains any suitable
Nodes; often, there will be more than one. If the list is empty, that
Pod isn't (yet) schedulable.
-->
過濾階段會將所有滿足 Pod 排程需求的 Node 選出來。
例如，PodFitsResources 過濾函式會檢查候選 Node 的可用資源能否滿足 Pod 的資源請求。
在過濾之後，得出一個 Node 列表，裡面包含了所有可排程節點；通常情況下，
這個 Node 列表包含不止一個 Node。如果這個列表是空的，代表這個 Pod 不可排程。

<!--
In the _scoring_ step, the scheduler ranks the remaining nodes to choose
the most suitable Pod placement. The scheduler assigns a score to each Node
that survived filtering, basing this score on the active scoring rules.
-->
在打分階段，排程器會為 Pod 從所有可排程節點中選取一個最合適的 Node。
根據當前啟用的打分規則，排程器會給每一個可排程節點進行打分。

<!--
Finally, kube-scheduler assigns the Pod to the Node with the highest ranking.
If there is more than one node with equal scores, kube-scheduler selects
one of these at random.
-->
最後，kube-scheduler 會將 Pod 排程到得分最高的 Node 上。
如果存在多個得分最高的 Node，kube-scheduler 會從中隨機選取一個。

<!--
There are two supported ways to configure the filtering and scoring behavior
of the scheduler:
-->
支援以下兩種方式配置排程器的過濾和打分行為：

<!--
1. [Scheduling Policies](/docs/reference/scheduling/policies) allow you to
  configure _Predicates_ for filtering and _Priorities_ for scoring.
1. [Scheduling Profiles](/docs/reference/scheduling/config/#profiles) allow you to
  configure Plugins that implement different scheduling stages, including:
  `QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit`, and others. You
  can also configure the kube-scheduler to run different profiles.
 -->
1. [排程策略](/zh-cn/docs/reference/scheduling/policies) 允許你配置過濾的 _斷言(Predicates)_
   和打分的 _優先順序(Priorities)_ 。
2. [排程配置](/zh-cn/docs/reference/scheduling/config/#profiles) 允許你配置實現不同調度階段的外掛，
   包括：`QueueSort`, `Filter`, `Score`, `Bind`, `Reserve`, `Permit` 等等。
   你也可以配置 kube-scheduler 執行不同的配置檔案。

## {{% heading "whatsnext" %}}
<!--
* Read about [scheduler performance tuning](/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* Read about [Pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* Read the [reference documentation](/docs/reference/command-line-tools-reference/kube-scheduler/) for kube-scheduler
* Read the [kube-scheduler config (v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/) reference
* Learn about [configuring multiple schedulers](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)
* Learn about [topology management policies](/docs/tasks/administer-cluster/topology-manager/)
* Learn about [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
-->
* 閱讀關於 [排程器效能調優](/zh-cn/docs/concepts/scheduling-eviction/scheduler-perf-tuning/)
* 閱讀關於 [Pod 拓撲分佈約束](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/)
* 閱讀關於 kube-scheduler 的 [參考文件](/zh-cn/docs/reference/command-line-tools-reference/kube-scheduler/)
* 閱讀 [kube-scheduler 配置參考 (v1beta3)](/zh-cn/docs/reference/config-api/kube-scheduler-config.v1beta3/)
* 瞭解關於 [配置多個排程器](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/) 的方式
* 瞭解關於 [拓撲結構管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)
* 瞭解關於 [Pod 額外開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
