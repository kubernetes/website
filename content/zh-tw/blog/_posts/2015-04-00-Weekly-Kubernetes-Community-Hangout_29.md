---
title: " Kubernetes 社區每週聚會筆記- 2015年4月24日 "
date: 2015-04-30
slug: weekly-kubernetes-community-hangout_29
---

<!--
---
title: " Weekly Kubernetes Community Hangout Notes - April 24 2015 "
date: 2015-04-30
slug: weekly-kubernetes-community-hangout_29
url: /zh/blog/2015/04/Weekly-Kubernetes-Community-Hangout_29
---

-->

<!--
Every week the Kubernetes contributing community meet virtually over Google Hangouts. We want anyone who's interested to know what's discussed in this forum.
-->
每個星期，Kubernetes 貢獻者社區幾乎都會在谷歌 Hangouts 上聚會。我們希望任何對此感興趣的人都能瞭解這個論壇的討論內容。

<!--
Agenda:

* Flocker and Kubernetes integration demo

-->
日程安排：

* Flocker 和 Kubernetes 集成演示

<!--
Notes:

* flocker and kubernetes integration demo
* * Flocker Q/A

    * Does the file still exists on node1 after migration?

    * Brendan: Any plan this to make it a volume? So we don't need powerstrip?

        * Luke:  Need to figure out interest to decide if we want to make it a first-class persistent disk provider in kube.

        * Brendan: Removing need for powerstrip would make it simple to use. Totally go for it.

        * Tim: Should take no more than 45 minutes to add it to kubernetes:)

-->
筆記：

* flocker 和 kubernetes 集成演示
* * Flocker Q/A

    * 遷移後文件是否仍存在於node1上？

    * Brendan: 有沒有計劃把它做成一本書？我們不需要 powerstrip？

        * Luke:  需要找出感興趣的來決定我們是否想讓它成爲 kube 中的一個一流的持久性磁盤提供商。

        * Brendan: 刪除對 powerstrip 的需求會使其易於使用。完全去做。

        * Tim: 將它添加到 kubernetes 應該不超過45分鐘:)

<!--

    * Derek: Contrast this with persistent volumes and claims?

        * Luke: Not much difference, except for the novel ZFS based backend. Makes workloads really portable.

        * Tim: very different than network-based volumes. Its interesting that it is the only offering that allows upgrading media.

        * Brendan: claims, how does it look for replicated claims? eg Cassandra wants to have replicated data underneath. It would be efficient to scale up and down. Create storage on the fly based on load dynamically. Its step beyond taking snapshots - programmatically creating replicas with preallocation.

        * Tim: helps with auto-provisioning.

-->

    * Derek: 持久卷和請求相比呢?

        * Luke: 除了基於 ZFS 的新後端之外，差別不大。使工作負載真正可移植。

        * Tim: 與基於網絡的卷非常不同。有趣的是，它是唯一允許升級媒體的產品。

        * Brendan: 請求，它如何查找重複請求？Cassandra 希望在底層複製數據。向上和向下擴縮是有效的。根據負載動態地創建存儲。它的步驟不僅僅是快照——通過編程使用預分配創建副本。

        * Tim: 幫助自動配置。

<!--

    * Brian: Does flocker requires any other component?

        * Kai: Flocker control service co-located with the master.  (dia on blog post). Powerstrip + Powerstrip Flocker. Very interested in mpersisting state in etcd. It keeps metadata about each volume.

        * Brendan: In future, flocker can be a plugin and we'll take care of persistence. Post v1.0.

        * Brian: Interested in adding generic plugin for services like flocker.

        * Luke: Zfs can become really valuable when scaling to lot of containers on a single node.

-->

    * Brian: flocker 是否需要其他組件？

        * Kai: Flocker 控制服務與主服務器位於同一位置。(dia 在博客上)。Powerstrip + Powerstrip Flocker。對在 etcd 中持久化狀態非常有趣。它保存關於每個卷的元數據。

        * Brendan: 在未來，flocker 可以是一個插件，我們將負責持久性。發佈 v1.0。

        * Brian: 有興趣爲 flocker 等服務添加通用插件。

        * Luke: 當擴展到單個節點上的許多容器時，Zfs 會變得非常有價值。

<!--

    * Alex: Can flocker service can be run as a pod?

        * Kai: Yes, only requirement is the flocker control service should be able to talk to zfs agent. zfs agent needs to be installed on the host and zfs binaries need to be accessible.

        * Brendan: In theory, all zfs bits can be put it into a container with devices.

        * Luke: Yes, still working through cross-container mounting issue.

        * Tim: pmorie is working through it to make kubelet work in a container. Possible re-use.

    * Kai: Cinder support is coming. Few days away.
* Bob: What's the process of pushing kube to GKE? Need more visibility for confidence.

-->

    * Alex: flocker 服務可以作爲 pod 運行嗎？

        * Kai: 是的，唯一的要求是 flocker 控制服務應該能夠與 zfs 代理對話。需要在主機上安裝 zfs 代理，並且需要訪問 zfs 二進制文件。

        * Brendan: 從理論上講，所有 zfs 位都可以與設備一起放入容器中。

        * Luke: 是的，仍然在處理跨容器安裝問題。

        * Tim: pmorie 正在通過它使 kubelet 在容器中工作。可能重複使用。

    * Kai: Cinder 支持即將到來。幾天之後。
* Bob: 向 GKE 推送 kube 的過程是怎樣的？需要更多的可見度。


