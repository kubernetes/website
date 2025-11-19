---
layout: blog
title: "Kubernetes v1.32：QueueingHint 爲優化 Pod 調度帶來了新的可能"
date: 2024-12-12
slug: scheduler-queueinghint
Author: >
  [Kensei Nakada](https://github.com/sanposhiho) (Tetrate.io)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---

<!--
layout: blog
title: "Kubernetes v1.32: QueueingHint Brings a New Possibility to Optimize Pod Scheduling"
date: 2024-12-12
slug: scheduler-queueinghint
Author: >
  [Kensei Nakada](https://github.com/sanposhiho) (Tetrate.io)
-->

<!--
The Kubernetes [scheduler](/docs/concepts/scheduling-eviction/kube-scheduler/) is the core
component that selects the nodes on which new Pods run. The scheduler processes
these new Pods **one by one**. Therefore, the larger your clusters, the more important
the throughput of the scheduler becomes.

Over the years, Kubernetes SIG Scheduling has improved the throughput
of the scheduler in multiple enhancements. This blog post describes a major improvement to the
scheduler in Kubernetes v1.32: a 
[scheduling context element](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points)
named _QueueingHint_. This page provides background knowledge of the scheduler and explains how
QueueingHint improves scheduling throughput.
-->
Kubernetes [調度器](/zh-cn/docs/concepts/scheduling-eviction/kube-scheduler/)是爲新
Pod 選擇運行節點的核心組件，調度器會**逐一**處理這些新 Pod。
因此，集羣規模越大，調度器的吞吐量就越重要。

多年來，Kubernetes SIG Scheduling 通過多次增強改進了調度器的吞吐量。
本博客文章描述了 Kubernetes v1.32 中對調度器的一項重大改進：
一個名爲 **QueueingHint** 的[調度上下文元素](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points)。
本頁面提供了關於調度器的背景知識，並解釋了 QueueingHint 如何提升調度吞吐量。

<!--
## Scheduling queue

The scheduler stores all unscheduled Pods in an internal component called the _scheduling queue_. 

The scheduling queue consists of the following data structures:
- **ActiveQ**: holds newly created Pods or Pods that are ready to be retried for scheduling.
- **BackoffQ**: holds Pods that are ready to be retried but are waiting for a backoff period to end. The
   backoff period depends on the number of unsuccessful scheduling attempts performed by the scheduler on that Pod.
- **Unschedulable Pod Pool**: holds Pods that the scheduler won't attempt to schedule for one of the
   following reasons:
   - The scheduler previously attempted and was unable to schedule the Pods. Since that attempt, the cluster
      hasn't changed in a way that could make those Pods schedulable.
   - The Pods are blocked from entering the scheduling cycles by PreEnqueue Plugins, 
for example, they have a [scheduling gate](/docs/concepts/scheduling-eviction/pod-scheduling-readiness/#configuring-pod-schedulinggates),
and get blocked by the scheduling gate plugin.
-->
## 調度隊列

調度器將所有未調度的 Pod 存儲在一個名爲**調度隊列**的內部組件中。

調度隊列由以下數據結構組成：

- **ActiveQ**：保存新創建的 Pod 或準備重試調度的 Pod。
- **BackoffQ**：保存準備重試但正在等待退避期結束的 Pod。退避期取決於調度器對該 Pod 執行的不成功調度嘗試次數。
- **無法調度的 Pod 池**：保存調度器不會嘗試調度的 Pod，原因可能包括以下幾點：
  - 調度器之前嘗試調度這些 Pod 但未能成功。自那次嘗試以來，集羣沒有發生任何使得這些 Pod 可以被調度的變化。
  - 這些 Pod 被 [PreEnqueue 插件](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/#configuring-pod-schedulinggates)阻止進入調度週期，
    例如，它們具有一個[調度門控](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness/#configuring-pod-schedulinggates)，並被調度門控插件阻止。

<!--
## Scheduling framework and plugins

The Kubernetes scheduler is implemented following the Kubernetes
[scheduling framework](/docs/concepts/scheduling-eviction/scheduling-framework/).

And, all scheduling features are implemented as plugins
(e.g., [Pod affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)
is implemented in the `InterPodAffinity` plugin.)
-->
## 調度框架和插件

Kubernetes 調度器的實現遵循 Kubernetes 的[調度框架](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)。

並且，所有的調度特性都是以插件的形式實現的
（例如，[Pod 親和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)是在
`InterPodAffinity` 插件中實現的。）

<!--
The scheduler processes pending Pods in phases called _cycles_ as follows:
1. **Scheduling cycle**: the scheduler takes pending Pods from the activeQ component of the scheduling
    queue  _one by one_. For each Pod, the scheduler runs the filtering/scoring logic from every scheduling plugin. The
    scheduler then decides on the best node for the Pod, or decides that the Pod can't be scheduled at that time.
    
    If the scheduler decides that a Pod can't be scheduled, that Pod enters the Unschedulable Pod Pool
    component of the scheduling queue. However, if the scheduler decides to place the Pod on a node, 
    the Pod goes to the binding cycle.
    
1. **Binding cycle**: the scheduler communicates the node placement decision to the Kubernetes API
    server. This operation bounds the Pod to the selected node. 
-->
調度器按照稱爲**週期**的階段來處理待調度的 Pod，具體如下：

1. **調度週期（Scheduling cycle）**：調度器從調度隊列的 activeQ 組件中**逐一**取出待調度的 Pod。
   對於每個 Pod，調度器會運行來自每個調度插件的過濾/評分邏輯。然後，調度器決定最適合該 Pod 的節點，
   或者決定當前無法調度該 Pod。

   如果調度器決定一個 Pod 無法被調度，該 Pod 將進入調度隊列的無法調度的 Pod
   池（Unschedulable Pod Pool）組件。然而，如果調度器決定將 Pod 放置到某個節點上，
   該 Pod 將進入綁定週期（Binding cycle）。

2. **綁定週期（Binding cycle）**：調度器將節點分配決策傳達給 Kubernetes API 服務器。
   這一操作將 Pod 綁定到選定的節點。

<!--
Aside from some exceptions, most unscheduled Pods enter the unschedulable pod pool after each scheduling
cycle. The Unschedulable Pod Pool component is crucial because of how the scheduling cycle processes Pods one by one. If the scheduler had to constantly retry placing unschedulable Pods, instead of offloading those
Pods to the Unschedulable Pod Pool, multiple scheduling cycles would be wasted on those Pods.
-->
除了少數例外情況，大多數未調度的 Pod 在每次調度週期後都會進入無法調度的 Pod 池。
無法調度的 Pod 池組件至關重要，因爲調度週期是逐個處理 Pod 的。
如果調度器需要不斷重試放置那些無法調度的 Pod，而不是將這些 Pod 分載到無法調度的 Pod 池中，
將會在這些 Pod 上浪費很多調度週期。

<!--
## Improvements to retrying Pod scheduling with QueuingHint

Unschedulable Pods only move back into the ActiveQ or BackoffQ components of the scheduling
queue if changes in the cluster might allow the scheduler to place those Pods on nodes. 

Prior to v1.32, each plugin registered which cluster changes could solve their failures, an object creation, update, or deletion in the cluster (called _cluster events_),
with `EnqueueExtensions` (`EventsToRegister`),
and the scheduling queue retries a pod with an event that is registered by a plugin that rejected the pod in a previous scheduling cycle.

Additionally, we had an internal feature called `preCheck`, which helped further filtering of events for efficiency, based on Kubernetes core scheduling constraints;
For example, `preCheck` could filter out node-related events when the node status is `NotReady`. 
-->
## 使用 QueueingHint 改進 Pod 調度重試

無法調度的 Pod 僅在集羣發生可能允許調度器將這些 Pod 放置到節點上的變化時，
纔會重新移入調度隊列的 ActiveQ 或 BackoffQ 組件。

在 v1.32 之前，每個插件通過 `EnqueueExtensions`（`EventsToRegister`）註冊哪些集羣變化
（稱爲**集羣事件**，即集羣中的對象創建、更新或刪除）可以解決其失敗情況。當某個插件在之前的調度週期中拒絕了某個 Pod 後，
調度隊列會在出現該插件註冊的事件時重試該 Pod 的調度。

此外，我們還擁有一個名爲 `preCheck` 的內部特性，它基於 Kubernetes 核心調度約束進一步過濾事件以提高效率；
例如，`preCheck` 可以在節點狀態爲 `NotReady` 時過濾掉與節點相關的事件。

<!--
However, we had two issues for those approaches:
- Requeueing with events was too broad, could lead to scheduling retries for no reason.
   - A new scheduled Pod _might_ solve the `InterPodAffinity`'s failure, but not all of them do.
For example, if a new Pod is created, but without a label matching `InterPodAffinity` of the unschedulable pod, the pod wouldn't be schedulable.
- `preCheck` relied on the logic of in-tree plugins and was not extensible to custom plugins,
like in issue [#110175](https://github.com/kubernetes/kubernetes/issues/110175).
-->
然而，這些方法存在兩個問題：

- 基於事件的重新排隊過於寬泛，可能會導致毫無來由的調度重試。
  - 新調度的 Pod **可能**解決 `InterPodAffinity` 失敗的問題，但並非所有新 Pod 都能做到。
    例如，如果創建了一個新的 Pod，但該 Pod 沒有與無法調度的 Pod 的 `InterPodAffinity` 匹配的標籤，
    則該 Pod 仍然無法被調度。
- `preCheck` 依賴於 in-tree 插件的邏輯，並且不適用於自定義插件，如在問題
  [#110175](https://github.com/kubernetes/kubernetes/issues/110175) 中所述。

<!--
Here QueueingHints come into play; 
a QueueingHint subscribes to a particular kind of cluster event, and make a decision about whether each incoming event could make the Pod schedulable.

For example, consider a Pod named `pod-a` that has a required Pod affinity. `pod-a` was rejected in
the scheduling cycle by the `InterPodAffinity` plugin because no node had an existing Pod that matched
the Pod affinity specification for `pod-a`.
-->
在這裏，QueueingHints 發揮了作用；QueueingHint 訂閱特定類型的集羣事件，並決定每個傳入的事件是否可以使 Pod 變得可調度。

例如，考慮一個名爲 `pod-a` 的 Pod，它具有必需的 Pod 親和性。`pod-a` 在調度週期中被
`InterPodAffinity` 插件拒絕，因爲沒有節點上有現有的 Pod 符合 `pod-a` 的 Pod 親和性規約。

<!--
{{< figure src="queueinghint1.svg" alt="A diagram showing the scheduling queue and pod-a rejected by InterPodAffinity plugin" caption="A diagram showing the scheduling queue and pod-a rejected by InterPodAffinity plugin" >}}

`pod-a` moves into the Unschedulable Pod Pool. The scheduling queue records which plugin caused
the scheduling failure for the Pod. For `pod-a`, the scheduling queue records that the `InterPodAffinity`
plugin rejected the Pod.
-->
{{< figure src="queueinghint1.svg" alt="顯示調度隊列和被 InterPodAffinity 插件拒絕的 pod-a 的圖示" caption="顯示調度隊列和被 InterPodAffinity 插件拒絕的 pod-a 的圖示" >}}

`pod-a` 移入無法調度的 Pod 池 (Unschedulable Pod Pool)。調度隊列記錄了導致 Pod
調度失敗的插件。對於 `pod-a`，調度隊列記錄了 `InterPodAffinity` 插件拒絕了該 Pod。


<!--
`pod-a` will never be schedulable until the InterPodAffinity failure is resolved. 
There're some scenarios that the failure could be resolved, one example is an existing running pod gets a label update and becomes matching a Pod affinity.
For this scenario, the `InterPodAffinity` plugin's `QueuingHint` callback function checks every Pod label update that occurs in the cluster. 
Then, if a Pod gets a label update that matches the Pod affinity requirement of `pod-a`, the `InterPodAffinity`,
plugin's `QueuingHint` prompts the scheduling queue to move `pod-a` back into the ActiveQ or
the BackoffQ component.

{{< figure src="queueinghint2.svg" alt="A diagram showing the scheduling queue and pod-a being moved by InterPodAffinity QueueingHint" caption="A diagram showing the scheduling queue and pod-a being moved by InterPodAffinity QueueingHint" >}}
-->
`pod-a` 在 `InterPodAffinity` 失敗被解決之前將永遠不會被調度。
有一些情景可以解決這一失敗，例如，一個現有的運行中的 Pod 獲取了標籤更新並符合 Pod 親和性要求。
在這種情況下，`InterPodAffinity` 插件的 `QueuingHint` 回調函數會檢查集羣中發生的每一個 Pod 標籤更新。
然後，如果一個 Pod 的標籤更新符合 `pod-a` 的 Pod 親和性要求，`InterPodAffinity` 插件的
`QueuingHint` 會提示調度隊列將 `pod-a` 重新移入 ActiveQ 或 BackoffQ 組件。

{{< figure src="queueinghint2.svg" alt="顯示調度隊列和由 InterPodAffinity QueuingHint 移動的 pod-a 的圖示" caption="顯示調度隊列和由 InterPodAffinity QueuingHint 移動的 pod-a 的圖示" >}}

<!--
## QueueingHint's history and what's new in v1.32

At SIG Scheduling, we have been working on the development of QueueingHint since
Kubernetes v1.28.

While QueuingHint isn't user-facing, we implemented the `SchedulerQueueingHints` feature gate as a
safety measure when we originally added this feature. In v1.28, we implemented QueueingHints with a
few in-tree plugins experimentally, and made the feature gate enabled by default.
-->
## QueueingHint 的歷史及 v1.32 中的新變化

在 SIG Scheduling，我們自 Kubernetes v1.28 開始就致力於 QueueingHint 的開發。

儘管 QueueingHint 並不是面向用戶的特性，我們在最初添加此特性時還是實現了 `SchedulerQueueingHints`
特性門控作爲安全措施。在 v1.28 中，我們實驗性地爲幾個 in-tree 插件實現了 QueueingHints，並將該特性門控默認啓用。

<!--
However, users reported a memory leak, and consequently we disabled the feature gate in a
patch release of v1.28.  From v1.28 until v1.31, we kept working on the QueueingHint implementation
within the rest of the in-tree plugins and fixing bugs.

In v1.32, we made this feature enabled by default again. We finished implementing QueueingHints
in all plugins and also identified the cause of the memory leak!

We thank all the contributors who participated in the development of this feature and those who reported and investigated the earlier issues.
-->
然而，用戶報告了一個內存泄漏問題，因此我們在 v1.28 的一個補丁版本中禁用了該特性門控。從 v1.28 到 v1.31，
我們一直在其餘的 in-tree 插件中繼續開發 QueueingHint，並修複相關 bug。

在 v1.32 中，我們再次默認啓用了這一特性。我們完成了所有插件中 QueueingHints 的實現，並且找到了內存泄漏的原因！

我們感謝所有參與此特性開發的貢獻者，以及那些報告和調查早期問題的用戶。

<!--
## Getting involved

These features are managed by Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling).

Please join us and share your feedback.
-->
## 參與其中

這些特性由 Kubernetes [SIG Scheduling](https://github.com/kubernetes/community/tree/master/sig-scheduling) 管理。

請加入我們並分享你的反饋。

<!--
## How can I learn more?

- [KEP-4247: Per-plugin callback functions for efficient requeueing in the scheduling queue](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)
-->
## 如何瞭解更多？

- [KEP-4247：爲調度隊列中的高效重新排隊實現每插件回調函數](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/4247-queueinghint/README.md)
