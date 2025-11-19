---
layout: blog
title: 'Kubernetes 1.14 穩定性改進中的進程ID限制'
date: 2019-04-15
slug: process-id-limiting-for-stability-improvements-in-kubernetes-1.14
---
<!--
title: 'Process ID Limiting for Stability Improvements in Kubernetes 1.14'
date: 2019-04-15
-->

<!--
**Author: Derek Carr**

Have you ever seen someone take more than their fair share of the cookies? The one person who reaches in and grabs a half dozen fresh baked chocolate chip chunk morsels and skitters off like Cookie Monster exclaiming “Om nom nom nom.”

In some rare workloads, a similar occurrence was taking place inside Kubernetes clusters. With each Pod and Node, there comes a finite number of possible process IDs (PIDs) for all applications to share. While it is rare for any one process or pod to reach in and grab all the PIDs, some users were experiencing resource starvation due to this type of behavior. So in Kubernetes 1.14, we introduced an enhancement to mitigate the risk of a single pod monopolizing all of the PIDs available.
-->
**作者: Derek Carr**

你是否見過有人拿走了比屬於他們那一份更多的餅乾？ 一個人走過來，抓起半打新鮮烤制的大塊巧克力餅乾然後匆匆離去，就像餅乾怪獸大喊 “Om nom nom nom”。

在一些罕見的工作負載中，Kubernetes 集羣內部也發生了類似的情況。每個 Pod 和 Node 都有有限數量的可能的進程 ID（PID），供所有應用程序共享。儘管很少有進程或 Pod 能夠進入並獲取所有 PID，但由於這種行爲，一些用戶會遇到資源匱乏的情況。 因此，在 Kubernetes 1.14 中，我們引入了一項增強功能，以降低單個  Pod 壟斷所有可用 PID 的風險。

<!--
## Can You Spare Some PIDs?

Here, we’re talking about the greed of certain containers. Outside the ideal, runaway processes occur from time to time, particularly in clusters where testing is taking place. Thus, some wildly non-production-ready activity is happening.

In such a scenario, it’s possible for something akin to a fork bomb taking place inside a node. As resources slowly erode, being taken over by some zombie-like process that continually spawns children, other legitimate workloads begin to get bumped in favor of this inflating balloon of wasted processing power. This could result in other processes on the same pod being starved of their needed PIDs. It could also lead to interesting side effects as a node could fail and a replica of that pod is scheduled to a new machine where the process repeats across your entire cluster.
-->

## 你能預留一些 PIDs 嗎？

在這裏，我們談論的是某些容器的貪婪性。 在理想情況之外，失控進程有時會發生，特別是在測試集羣中。 因此，在這些集羣中會發生一些混亂的非生產環境準備就緒的事情。

在這種情況下，可能會在節點內部發生類似於 fork 炸彈耗盡 PID 的攻擊。隨着資源的緩慢腐蝕，被一些不斷產生子進程的殭屍般的進程所接管，其他正常的工作負載會因爲這些像氣球般不斷膨脹的浪費的處理能力而開始受到衝擊。這可能導致同一 Pod 上的其他進程缺少所需的 PID。這也可能導致有趣的副作用，因爲節點可能會發生故障，並且該Pod的副本將安排到新的機器上，至此，該過程將在整個集羣中重複進行。

<!--
## Fixing the Problem

Thus, in Kubernetes 1.14, we have added a feature that allows for the configuration of a kubelet to limit the number of PIDs a given pod can consume. If that machine supports 32,768 PIDs and 100 pods, one can give each pod a budget of 300 PIDs to prevent total exhaustion of PIDs. If the admin wants to overcommit PIDs similar to cpu or memory, they may do so as well with some additional risks. Either way, no one pod can bring the whole machine down. This will generally prevent against simple fork bombs from taking over your cluster.

This change allows administrators to protect one pod from another, but does not ensure if all pods on the machine can protect the node, and the node agents themselves from falling over. Thus, we’ve introduced a feature in this release in alpha form that provides isolation of PIDs from end user workloads on a pod from the node agents (kubelet, runtime, etc.). The admin is able to reserve a specific number of PIDs--similar to how one reserves CPU or memory today--and ensure they are never consumed by pods on that machine. Once that graduates from alpha, to beta, then stable in future releases of Kubernetes, we’ll have protection against an easily starved Linux resource.

Get started with [Kubernetes 1.14](https://github.com/kubernetes/kubernetes/releases/tag/v1.14.0).
-->
## 解決問題

因此，在 Kubernetes 1.14 中，我們添加了一個特性，允許通過配置 kubelet，限制給定 Pod 可以消耗的 PID 數量。如果該機器支持 32768 個 PIDs 和 100 個 Pod，則可以爲每個 Pod 提供 300 個 PIDs 的預算，以防止 PIDs 完全耗盡。如果管理員想要像 CPU 或內存那樣過度使用 PIDs，那麼他們也可以配置超額使用，但是這樣會有一些額外風險。不管怎樣，沒有一個Pod能搞壞整個機器。這通常會防止簡單的分叉函數炸彈接管你的集羣。

此更改允許管理員保護一個 Pod 不受另一個 Pod 的影響，但不能確保計算機上的所有 Pod 都能保護節點和節點代理本身不受影響。因此，我們在這個版本中以 Alpha 的形式引入了這個一個特性，它提供了 PIDs 在節點代理（ kubelet、runtime 等）與 Pod 上的最終用戶工作負載的分離。管理員可以預定特定數量的 pid（類似於今天如何預定 CPU 或內存），並確保它們不會被該計算機上的 pod 消耗。一旦從 Alpha 進入到 Beta，然後在將來的 Kubernetes 版本中穩定下來，我們就可以使用這個特性防止 Linux 資源耗盡。

開始使用 [Kubernetes 1.14](https://github.com/Kubernetes/Kubernetes/releases/tag/v1.14.0)。
<!--
## Get Involved

If you have feedback for this feature or are interested in getting involved with the design and development, join the [Node Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-node).

### About the author:
Derek Carr is Senior Principal Software Engineer at Red Hat. He is a Kubernetes contributor and member of the Kubernetes Community Steering Committee.
-->
##參與其中

如果您對此特性有反饋或有興趣參與其設計與開發，請加入[節點特別興趣小組](https://github.com/kubernetes/community/tree/master/sig Node)。

###關於作者：
Derek Carr 是 Red Hat 高級首席軟件工程師。他也是 Kubernetes 的貢獻者和 Kubernetes 社區指導委員會的成員。
