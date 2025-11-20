---
title: " 每週 Kubernetes 社區例會筆記 - 2015 年 4 月 3 日 "
date: 2015-04-04
slug: weekly-kubernetes-community-hangout
---
<!--
title: " Weekly Kubernetes Community Hangout Notes - April 3 2015 "
date: 2015-04-04
slug: weekly-kubernetes-community-hangout
url: /blog/2015/04/Weekly-Kubernetes-Community-Hangout
-->

<!--
# Kubernetes: Weekly Kubernetes Community Hangout Notes
-->
# Kubernetes: 每週 Kubernetes 社區聚會筆記

<!--
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.
-->
每週，Kubernetes 貢獻社區幾乎都會通過 Google Hangouts 開會。
我們希望任何有興趣的人都知道本論壇討論的內容。

<!--
Agenda:
-->
議程：

<!--
* Quinton - Cluster federation
* Satnam - Performance benchmarking update
-->
* Quinton - 叢集聯邦
* Satnam - 性能基準測試更新

<!--
*Notes from meeting:*
-->
*會議記錄：*

<!--
1. Quinton - Cluster federation
* Ideas floating around after meetup in SF
* * Please read and comment
* Not 1.0, but put a doc together to show roadmap
* Can be built outside of Kubernetes
* API to control things across multiple clusters, include some logic
-->
1. Quinton - 叢集聯邦
* 在舊金山見面會後，想法浮出水面
* * 請閱讀、評論
* 不是 1.0，而是將文檔放在一起以顯示路線圖
* 可以在 Kubernetes 之外構建
* 用於控制多個叢集中事物的 API ，包括一些邏輯

<!--
1. Auth(n)(z)

2. Scheduling Policies

3. …
-->
1. Auth(n)(z)

2. 調度策略

3. ……
<!--
* Different reasons for cluster federation

1. Zone (un) availability : Resilient to zone failures

2. Hybrid cloud: some in cloud, some on prem. for various reasons

3. Avoid cloud provider lock-in.  For various reasons

4. "Cloudbursting" - automatic overflow into the cloud
-->
* 叢集聯邦的不同原因

1. 區域(非)可用性:對區域故障的彈性

2. 混合雲：有些在雲中，有些在本地。 由於各種原因

3. 避免鎖定雲提供商。 由於各種原因

4. "Cloudbursting" - 自動溢出到雲中

<!--
* Hard problems

1. Location affinity.  How close do pods need to be?

    1. Workload coupling

    2. Absolute location (e.g. eu data needs to be in eu)

2. Cross cluster service discovery

    1. How does service/DNS work across clusters

3. Cross cluster workload migration

    1. How do you move an application piece by piece across clusters?

4. Cross cluster scheduling

    1. How do know enough about clusters to know where to schedule

    2. Possibly use a cost function to achieve affinities with minimal complexity

    3. Can also use cost to determine where to schedule (under used clusters are cheaper than over-used clusters)
 -->
 * 困難的問題
 
 1. 位置親和性。Pod 需要多近？

    1. 工作負載的耦合

    2. 絕對位置(例如，歐盟資料需要在歐盟內)

2. 跨叢集服務發現

    1. 服務/DNS 如何跨叢集工作

3. 跨叢集工作負載遷移

    1. 如何在跨叢集中逐塊移動應用程式?

4. 跨叢集調度

    1.  如何充分了解叢集以知道在哪裏進行調度

    2. 可能使用成本函數以最小的複雜性得出親和性

    3. 還可以使用成本來確定調度位置（使用不足的叢集比過度使用的叢集便宜）

<!--
* Implicit requirements

1. Cross cluster integration shouldn't create cross-cluster failure modes

    1. Independently usable in a disaster situation where Ubernetes dies.

2. Unified visibility

    1. Want to have unified monitoring, alerting, logging, introspection, ux, etc.

3. Unified quota and identity management
 -->
 * 隱含要求

1. 跨叢集集成不應創建跨叢集故障模式

    1. 在 Ubernetes 死亡的災難情況下可以獨立使用。

2. 統一可見性

    1. 希望有統一的監控，報警，日誌，內省，使用者體驗等。

3. 統一的配額和身份管理

    1. 希望將使用者資料庫和 auth(n)/(z) 放在一個位置
    

<!--
* Important to note, most causes of software failure are not the infrastructure

1. Botched software upgrades

2. Botched config upgrades

3. Botched key distribution

4. Overload

5. Failed external dependencies
 -->
 * 需要注意的是，導致軟體故障的大多數原因不是基礎架構

1. 拙劣的軟體升級

2. 拙劣的設定升級

3. 拙劣的密鑰分發

4. 過載

5. 失敗的外部依賴

 <!--
* Discussion:

1. Where do you draw the "ubernetes" line

    1. Likely at the availability zone, but could be at the rack, or the region

2. Important to not pigeon hole and prevent other users
 -->
 * 討論：

1. ”ubernetes“ 的邊界確定

    1. 可能在可用區，但也可能在機架，或地區

2. 重要的是不要鴿子洞並防止其他使用者

 <!--
 2. Satnam - Soak Test
* Want to measure things that run for a long time to make sure that the cluster is stable over time.  Performance doesn't degrade, no memory leaks, etc.
* github.com/GoogleCloudPlatform/kubernetes/test/soak/…
* Single binary, puts lots of pods on each node, and queries each pod to make sure that it is running.
* Pods are being created much, much more quickly (even in the past week) to make things go more quickly.
* Once the pods are up running, we hit the pods via the proxy.  Decision to hit the proxy was deliberate so that we test the kubernetes apiserver.
* Code is already checked in.
* Pin pods to each node, exercise every pod, make sure that you get a response for each node.
* Single binary, run forever.
* Brian - v1beta3 is enabled by default, v1beta1 and v1beta2 deprecated, turned off  in June.  Should still work with upgrading existing clusters, etc.
 -->
 2. Satnam - 浸泡測試
* 想要測量長時間運行的事務，以確保叢集在一段時間內是穩定的。性能不會降低，不會發生內存泄漏等。
* github.com/GoogleCloudPlatform/kubernetes/test/soak/…
* 單個二進制檔案，在每個節點上放置許多 Pod，並查詢每個 Pod 以確保其正在運行。
* Pod 的創建速度越來越快（即使在過去一週內），也可以使事情進展得更快。
* Pod 運行起來後，我們通過代理點擊 Pod。決定使用代理是有意的，因此我們測試了 kubernetes apiserver。
* 代碼已經簽入。
* 將 Pod 固定在每個節點上，練習每個 Pod，確保你得到每個節點的響應。
* 單個二進制檔案，永遠運行。
* Brian - v1beta3 預設啓用， v1beta1 和 v1beta2 不支持，在6月關閉。仍應與升級現有叢集等一起使用。
