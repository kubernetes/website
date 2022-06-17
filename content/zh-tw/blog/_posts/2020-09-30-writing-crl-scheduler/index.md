---
layout: blog
title: "一個編排高可用應用的 Kubernetes 自定義排程器"
date: 2020-12-21
slug: writing-crl-scheduler
---
<!--
---
layout: blog
title: "A Custom Kubernetes Scheduler to Orchestrate Highly Available Applications"
date: 2020-12-21
slug: writing-crl-scheduler
---
-->
**作者**: Chris Seto (Cockroach Labs)
<!--
**Author**: Chris Seto (Cockroach Labs)
-->

<!--
As long as you're willing to follow the rules, deploying on Kubernetes and air travel can be quite pleasant. More often than not, things will "just work". However, if one is interested in travelling with an alligator that must remain alive or scaling a database that must remain available, the situation is likely to become a bit more complicated. It may even be easier to build one's own plane or database for that matter. Travelling with reptiles aside, scaling a highly available stateful system is no trivial task.
-->
只要你願意遵守規則，那麼在 Kubernetes 上的部署和探索可以是相當愉快的。更多時候，事情會 "順利進行"。
然而，如果一個人對與必須保持存活的鱷魚一起旅行或者是對必須保持可用的資料庫進行擴充套件有興趣，
情況可能會變得更復雜一點。
相較於這個問題，建立自己的飛機或資料庫甚至還可能更容易一些。撇開與鱷魚的旅行不談，擴充套件一個高可用的有狀態系統也不是一件小事。

<!--
Scaling any system has two main components:
1. Adding or removing infrastructure that the system will run on, and
2. Ensuring that the system knows how to handle additional instances of itself being added and removed.
-->
任何系統的擴充套件都有兩個主要組成部分。
1. 增加或刪除系統將執行的基礎架構，以及
2. 確保系統知道如何處理自身額外例項的新增和刪除。

<!--
Most stateless systems, web servers for example, are created without the need to be aware of peers. Stateful systems, which includes databases like CockroachDB, have to coordinate with their peer instances and shuffle around data. As luck would have it, CockroachDB handles data redistribution and replication. The tricky part is being able to tolerate failures during these operations by ensuring that data and instances are distributed across many failure domains (availability zones).
-->
大多數無狀態系統，例如網路伺服器，在建立時不需要意識到對等例項。而有狀態的系統，包括像 CockroachDB 這樣的資料庫，
必須與它們的對等例項協調，並對資料進行 shuffle。運氣好的話，CockroachDB 可以處理資料的再分佈和複製。
棘手的部分是在確保資料和例項分佈在許多故障域（可用性區域）的操作過程中能夠容忍故障的發生。

<!--
One of Kubernetes' responsibilities is to place "resources" (e.g, a disk or container) into the cluster and satisfy the constraints they request. For example: "I must be in availability zone _A_" (see [Running in multiple zones](/docs/setup/best-practices/multiple-zones/#nodes-are-labeled)), or "I can't be placed onto the same node as this other Pod" (see [Affinity and anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)).
-->
Kubernetes 的職責之一是將 "資源"（如磁碟或容器）放入叢集中，並滿足其請求的約束。
例如。"我必須在可用性區域 _A_"（見[在多個區域執行](/zh-cn/docs/setup/best-practices/multiple-zone/#nodes-are-labeled)），
或者 "我不能被放置到與某個 Pod 相同的節點上"
（見[親和與反親和](/zh-cn/docs/setup/best-practices/multiple-zone/#nodes-are-labeled)）。

<!--
As an addition to those constraints, Kubernetes offers [Statefulsets](/docs/concepts/workloads/controllers/statefulset/) that provide identity to Pods as well as persistent storage that "follows" these identified pods. Identity in a StatefulSet is handled by an increasing integer at the end of a pod's name. It's important to note that this integer must always be contiguous: in a StatefulSet, if pods 1 and 3 exist then pod 2 must also exist.
-->
作為對這些約束的補充，Kubernetes 提供了 [StatefulSets](/zh-cn/docs/concepts/workloads/controllers/statefulset/)，
為 Pod 提供身份，以及 "跟隨" 這些指定 Pod 的持久化儲存。
在 StatefulSet 中，身份是由 Pod 名稱末尾一個呈增序的整數處理的。
值得注意的是，這個整數必須始終是連續的：在一個 StatefulSet 中，
如果 Pod 1 和 3 存在，那麼 Pod 2 也必須存在。

<!--
Under the hood, CockroachCloud deploys each region of CockroachDB as a StatefulSet in its own Kubernetes cluster - see [Orchestrate CockroachDB in a Single Kubernetes Cluster](https://www.cockroachlabs.com/docs/stable/orchestrate-cockroachdb-with-kubernetes.html).
In this article, I'll be looking at an individual region, one StatefulSet and one Kubernetes cluster which is distributed across at least three availability zones.
-->
在架構上，CockroachCloud 將 CockroachDB 的每個區域作為 StatefulSet 部署在自己的 Kubernetes 叢集中 -- 
參見 [Orchestrate CockroachDB in a Single Kubernetes Cluster](https://www.cockroachlabs.com/docs/stable/orchestrate-cockroachdb-with-kubernetes.html)。
在這篇文章中，我將著眼於一個單獨的區域，一個 StatefulSet 和一個至少分佈有三個可用區的 Kubernetes 叢集。

<!--
A three-node CockroachCloud cluster would look something like this:
-->
一個三節點的 CockroachCloud 叢集如下所示：

<!--
![3-node, multi-zone cockroachdb cluster](image01.png)
-->
![3-node, multi-zone cockroachdb cluster](image01.png)

<!--
When adding additional resources to the cluster we also distribute them across zones. For the speediest user experience, we add all Kubernetes nodes at the same time and then scale up the StatefulSet.
-->
在向叢集增加額外的資源時，我們也會將它們分佈在各個區域。
為了獲得最快的使用者體驗，我們同時新增所有 Kubernetes 節點，然後擴大 StatefulSet 的規模。

<!--
![illustration of phases: adding Kubernetes nodes to the multi-zone cockroachdb cluster](image02.png)
-->
![illustration of phases: adding Kubernetes nodes to the multi-zone cockroachdb cluster](image02.png)

<!--
Note that anti-affinities are satisfied no matter the order in which pods are assigned to Kubernetes nodes. In the example, pods 0, 1 and 2 were assigned to zones A, B, and C respectively, but pods 3 and 4 were assigned in a different order, to zones B and A respectively. The anti-affinity is still satisfied because the pods are still placed in different zones.
-->
請注意，無論 Pod 被分配到 Kubernetes 節點的順序如何，都會滿足反親和性。
在這個例子中，Pod 0、1 、2 分別被分配到 A、B 、C 區，但 Pod 3 和 4 以不同的順序被分配到 B 和 A 區。
反親和性仍然得到滿足，因為 Pod 仍然被放置在不同的區域。

<!--
To remove resources from a cluster, we perform these operations in reverse order.
-->
要從叢集中移除資源，我們以相反的順序執行這些操作。

<!--
We first scale down the StatefulSet and then remove from the cluster any nodes lacking a CockroachDB pod.
-->
我們首先縮小 StatefulSet 的規模，然後從叢集中移除任何缺少 CockroachDB Pod 的節點。

<!--
![illustration of phases: scaling down pods in a multi-zone cockroachdb cluster in Kubernetes](image03.png)
-->
![illustration of phases: scaling down pods in a multi-zone cockroachdb cluster in Kubernetes](image03.png)

<!--
Now, remember that pods in a StatefulSet of size _n_ must have ids in the range `[0,n)`. When scaling down a StatefulSet by _m_, Kubernetes removes _m_ pods, starting from the highest ordinals and moving towards the lowest, [the reverse in which they were added](/docs/concepts/workloads/controllers/statefulset/#deployment-and-scaling-guarantees).
Consider the cluster topology below:
-->
現在，請記住，規模為 _n_ 的 StatefulSet 中的 Pods 一定具有 `[0,n)` 範圍內的 id。
當把一個 StatefulSet 規模縮減了 _m_ 時，Kubernetes 會移除 _m_ 個 Pod，從最高的序號開始，向最低的序號移動，
[與它們被新增的順序相反](/zh-cn/docs/concepts/workloads/controllers/statefulset/#deployment-and-scaling-guarantees)。
考慮一下下面的叢集拓撲結構。

<!--
![illustration: cockroachdb cluster: 6 nodes distributed across 3 availability zones](image04.png)
-->
![illustration: cockroachdb cluster: 6 nodes distributed across 3 availability zones](image04.png)

<!--
As ordinals 5 through 3 are removed from this cluster, the statefulset continues to have a presence across all 3 availability zones.
-->
當從這個叢集中移除 5 號到 3 號 Pod 時，這個 StatefulSet 仍然橫跨三個可用區。

<!--
![illustration: removing 3 nodes from a 6-node, 3-zone cockroachdb cluster](image05.png)
-->
![illustration: removing 3 nodes from a 6-node, 3-zone cockroachdb cluster](image05.png)

<!--
However, Kubernetes' scheduler doesn't _guarantee_ the placement above as we expected at first.
-->
然而，Kubernetes 的排程器並不像我們一開始預期的那樣 _保證_ 上面的分佈。

<!--
Our combined knowledge of the following is what lead to this misconception.
* Kubernetes' ability to [automatically spread Pods across zone](/docs/setup/best-practices/multiple-zones/#pods-are-spread-across-zones)
* The behavior that a StatefulSet with _n_ replicas, when Pods are being deployed, they are created sequentially, in order from `{0..n-1}`. See [StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/#deployment-and-scaling-guarantees) for more details.
-->
我們對以下內容的綜合認識是導致這種誤解的原因。
* Kubernetes [自動跨區分配 Pod](/zh-cn/docs/setup/best-practices/multiple-zone/#pods-are-spread-across-zone) 的能力
* 一個有 _n_ 個副本的 StatefulSet，當 Pod 被部署時，它們會按照 `{0...n-1}` 的順序依次建立。
更多細節見 [StatefulSet](/zh-cn/docs/concepts/workloads/controllers/statefulset/#deployment-and-scaling-guarantees)。

<!--
Consider the following topology:
-->
考慮以下拓撲結構：

<!--
![illustration: 6-node cockroachdb cluster distributed across 3 availability zones](image06.png)
-->
![illustration: 6-node cockroachdb cluster distributed across 3 availability zones](image06.png)

<!--
These pods were created in order and they are spread across all availability zones in the cluster. When ordinals 5 through 3 are terminated, this cluster will lose its presence in zone C!
-->
這些 Pod 是按順序建立的，它們分佈在集群裡所有可用區。當序號 5 到 3 的 Pod 被終止時，
這個叢集將從 C 區消失!

<!--
![illustration: terminating 3 nodes in 6-node cluster spread across 3 availability zones, where 2/2 nodes in the same availability zone are terminated, knocking out that AZ](image07.png)
-->
![illustration: terminating 3 nodes in 6-node cluster spread across 3 availability zones, where 2/2 nodes in the same availability zone are terminated, knocking out that AZ](image07.png)

<!--
Worse yet, our automation, at the time, would remove Nodes A-2, B-2, and C-2. Leaving CRDB-1 in an unscheduled state as persistent volumes are only available in the zone they are initially created in.
-->
更糟糕的是，在這個時候，我們的自動化機制將刪除節點 A-2，B-2，和 C-2。
並讓 CRDB-1 處於未排程狀態，因為永續性卷只在其建立時所處的區域內可用。

<!--
To correct the latter issue, we now employ a "hunt and peck" approach to removing machines from a cluster. Rather than blindly removing Kubernetes nodes from the cluster, only nodes without a CockroachDB pod would be removed. The much more daunting task was to wrangle the Kubernetes scheduler.
-->
為了糾正後一個問題，我們現在採用了一種“狩獵和啄食”的方法來從叢集中移除機器。
與其盲目地從叢集中移除 Kubernetes 節點，不如只移除沒有 CockroachDB Pod 的節點。
更為艱鉅的任務是管理 Kubernetes 的排程器。

<!--
## A session of brainstorming left us with 3 options:

### 1. Upgrade to kubernetes 1.18 and make use of Pod Topology Spread Constraints

While this seems like it could have been the perfect solution, at the time of writing Kubernetes 1.18 was unavailable on the two most common managed Kubernetes services in public cloud, EKS and GKE.
Furthermore, [pod topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/) were still a [beta feature in 1.18](https://v1-18.docs.kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/) which meant that it [wasn't guaranteed to be available in managed clusters](https://cloud.google.com/kubernetes-engine/docs/concepts/types-of-clusters#kubernetes_feature_choices) even when v1.18 became available.
The entire endeavour was concerningly reminiscent of checking [caniuse.com](https://caniuse.com/) when Internet Explorer 8 was still around.
-->
## 一場頭腦風暴後我們有了 3 個選擇。

### 1. 升級到 kubernetes 1.18 並利用 Pod 拓撲分佈約束

雖然這似乎是一個完美的解決方案，但在寫這篇文章的時候，Kubernetes 1.18 在公有云中兩個最常見的
託管 Kubernetes 服務（ EKS 和 GKE ）上是不可用的。
此外，[Pod 拓撲分佈約束](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/)在 
[1.18 中仍是測試版功能](https://v1-18.docs.kubernetes.io/docs/concepts/workloads/pods/pod-topology-spread-constraints/)，
這意味著即使在 v1.18 可用時，它[也不能保證在託管叢集中可用](https://cloud.google.com/kubernetes-engine/docs/concepts/types-of-clusters#kubernetes_feature_choices)。
整個努力讓人聯想到在 Internet Explorer 8 還存在的時候訪問 [caniuse.com](https://caniuse.com/)。

<!--
### 2. Deploy a statefulset _per zone_.

Rather than having one StatefulSet distributed across all availability zones, a single StatefulSet with node affinities per zone would allow manual control over our zonal topology.
Our team had considered this as an option in the past which made it particularly appealing.
Ultimately, we decided to forego this option as it would have required a massive overhaul to our codebase and performing the migration on existing customer clusters would have been an equally large undertaking.
-->
### 2. 在每個區部署一個 StatefulSet。

與跨所有可用區部署一個 StatefulSet 相比，在每個區部署一個帶有節點親和性的 StatefulSet 可以實現手動控制分割槽拓撲結構。
我們的團隊過去曾考慮過這個選項，我們也傾向此選項。
但最終，我們決定放棄這個方案，因為這需要對我們的程式碼庫進行大規模的修改，而且在現有的客戶叢集上進行遷移也是一個同樣大的工程。

<!--
### 3. Write a custom Kubernetes scheduler.

Thanks to an example from [Kelsey Hightower](https://github.com/kelseyhightower/scheduler) and a blog post from [Banzai Cloud](https://banzaicloud.com/blog/k8s-custom-scheduler/), we decided to dive in head first and write our own [custom Kubernetes scheduler](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/).
Once our proof-of-concept was deployed and running, we quickly discovered that the Kubernetes' scheduler is also responsible for mapping persistent volumes to the Pods that it schedules.
The output of [`kubectl get events`](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/#verifying-that-the-pods-were-scheduled-using-the-desired-schedulers) had led us to believe there was another system at play.
In our journey to find the component responsible for storage claim mapping, we discovered the [kube-scheduler plugin system](/docs/concepts/scheduling-eviction/scheduling-framework/). Our next POC was a `Filter` plugin that determined the appropriate availability zone by pod ordinal, and it worked flawlessly!

Our [custom scheduler plugin](https://github.com/cockroachlabs/crl-scheduler) is open source and runs in all of our CockroachCloud clusters.
Having control over how our StatefulSet pods are being scheduled has let us scale out with confidence.
We may look into retiring our plugin once pod topology spread constraints are available in GKE and EKS, but the maintenance overhead has been surprisingly low.
Better still: the plugin's implementation is orthogonal to our business logic. Deploying it, or retiring it for that matter, is as simple as changing the `schedulerName` field in our StatefulSet definitions.

---

_[Chris Seto](https://twitter.com/_ostriches) is a software engineer at Cockroach Labs and works on their Kubernetes automation for [CockroachCloud](https://cockroachlabs.cloud), CockroachDB._
-->

### 3. 編寫一個自定義的 Kubernetes 排程器

感謝 [Kelsey Hightower](https://github.com/kelseyhightower/scheduler) 的例子和 
[Banzai Cloud](https://banzaicloud.com/blog/k8s-custom-scheduler/) 的博文，我們決定投入進去，編寫自己的[自定義 Kubernetes 排程器](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)。
一旦我們的概念驗證被部署和執行，我們很快就發現，Kubernetes 的排程器也負責將持久化卷對映到它所排程的 Pod 上。
[`kubectl get events`](/zh-cn/docs/tasks/extend-kubernetes/configure-multiple-schedulers/#verifying-that-the-pods-wer-scheduled-using-the-desired-schedulers)
的輸出讓我們相信有另一個系統在發揮作用。
在我們尋找負責儲存宣告對映的元件的過程中，我們發現了 
[kube-scheduler 外掛系統](/zh-cn/docs/concepts/scheduling-eviction/scheduling-framework/)。
我們的下一個 POC 是一個"過濾器"外掛，它透過 Pod 的序號來確定適當的可用區域，並且工作得非常完美。

我們的[自定義排程器外掛](https://github.com/cockroachlabs/crl-scheduler)是開源的，並在我們所有的 CockroachCloud 叢集中執行。
對 StatefulSet Pod 的排程方式有掌控力，讓我們有信心擴大規模。
一旦 GKE 和 EKS 中的 Pod 拓撲分佈約束可用，我們可能會考慮讓我們的外掛退役，但其維護的開銷出乎意料地低。
更好的是：該外掛的實現與我們的業務邏輯是橫向的。部署它，或取消它，就像改變 StatefulSet 定義中的 "schedulerName" 欄位一樣簡單。

---

[Chris Seto](https://twitter.com/_ostriches) 是 Cockroach 實驗室的一名軟體工程師，負責 
[CockroachCloud](https://cockroachlabs.cloud) CockroachDB 的 Kubernetes 自動化。
