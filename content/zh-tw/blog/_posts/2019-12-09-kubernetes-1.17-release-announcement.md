---
layout: blog
title: "Kubernetes 1.17：穩定"
date: 2019-12-09T13:00:00-08:00
slug: kubernetes-1-17-release-announcement
evergreen: true
---

<!-- ---
layout: blog
title: "Kubernetes 1.17: Stability"
date: 2019-12-09T13:00:00-08:00
slug: kubernetes-1-17-release-announcement
evergreen: true
--- -->
**作者:** [Kubernetes 1.17發佈團隊](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md)

<!--
**Authors:** [Kubernetes 1.17 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md)
-->
我們高興的宣佈Kubernetes 1.17版本的交付，它是我們2019年的第四個也是最後一個發佈版本。Kubernetes v1.17包含22個增強功能：有14個增強已經逐步穩定(stable)，4個增強功能已經進入公開測試版(beta)，4個增強功能剛剛進入內部測試版(alpha)。
<!--
We’re pleased to announce the delivery of Kubernetes 1.17, our fourth and final release of 2019! Kubernetes v1.17 consists of 22 enhancements: 14 enhancements have graduated to stable, 4 enhancements are moving to beta, and 4 enhancements are entering alpha.
-->
## 主要的主題
<!--
## Major Themes
-->
### 雲服務提供商標籤基本可用
<!--
### Cloud Provider Labels reach General Availability
-->
作爲公開測試版特性添加到 v1.2 ，v1.17 中可以看到雲提供商標籤達到基本可用。
<!--
Added as a beta feature way back in v1.2, v1.17 sees the general availability of cloud provider labels.
-->
### 卷快照進入公開測試版
<!--
### Volume Snapshot Moves to Beta
-->
在 v1.17 中，Kubernetes卷快照特性是公開測試版。這個特性是在 v1.12 中以內部測試版引入的，第二個有重大變化的內部測試版是 v1.13 。
<!--
The Kubernetes Volume Snapshot feature is now beta in Kubernetes v1.17. It was introduced as alpha in Kubernetes v1.12, with a second alpha with breaking changes in Kubernetes v1.13.
-->
## 容器儲存介面遷移公開測試版
<!--
### CSI Migration Beta
 -->
在 v1.17 中，Kubernetes樹內儲存插件到容器儲存介面(CSI)的遷移基礎架構是公開測試版。容器儲存介面遷移最初是在Kubernetes v1.14 中以內部測試版引入的。
<!--
The Kubernetes in-tree storage plugin to Container Storage Interface (CSI) migration infrastructure is now beta in Kubernetes v1.17. CSI migration was introduced as alpha in Kubernetes v1.14.
-->
## 雲服務提供商標籤基本可用
<!--
## Cloud Provider Labels reach General Availability
-->
當節點和卷被創建，會基於基礎雲提供商的Kubernetes叢集打上一系列標準標籤。節點會獲得一個實例類型標籤。節點和卷都會得到兩個描述資源在雲提供商拓撲的位置標籤,通常是以區域和地區的方式組織。
<!--
When nodes and volumes are created, a set of standard labels are applied based on the underlying cloud provider of the Kubernetes cluster. Nodes get a label for the instance type. Both nodes and volumes get two labels describing the location of the resource in the cloud provider topology, usually organized in zones and regions.
-->

Kubernetes組件使用標準標籤來支持一些特性。例如，調度者會保證pods和它們所聲明的卷放置在相同的區域；當調度部署的pods時，調度器會優先將它們分佈在不同的區域。你還可以在自己的pods標準中利用標籤來設定，如節點親和性，之類的事。標準標籤使得你寫的pod規範在不同的雲提供商之間是可移植的。
<!--
Standard labels are used by Kubernetes components to support some features. For example, the scheduler would ensure that pods are placed on the same zone as the volumes they claim; and when scheduling pods belonging to a deployment, the scheduler would prioritize spreading them across zones. You can also use the labels in your pod specs to configure things as such node affinity. Standard labels allow you to write pod specs that are portable among different cloud providers.
-->

在這個版本中，標籤已經達到基本可用。Kubernetes組件都已經更新，可以填充基本可用和公開測試版標籤，並對兩者做出反應。然而，如果你的pod規範或自定義的控制器正在使用公開測試版標籤，如節點親和性，我們建議你可以將它們遷移到新的基本可用標籤中。你可以從如下地方找到新標籤的文檔：
<!--
The labels are reaching general availability in this release. Kubernetes components have been updated to populate the GA and beta labels and to react to both. However, if you are using the beta labels in your pod specs for features such as node affinity, or in your custom controllers, we recommend that you start migrating them to the new GA labels. You can find the documentation for the new labels here:
-->

- [實例類型](/zh-cn/docs/reference/labels-annotations-taints/#nodekubernetesioinstance-type)
- [地區](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesioregion)
- [區域](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesiozone)

<!--
- [node.kubernetes.io/instance-type](/docs/reference/labels-annotations-taints/#nodekubernetesioinstance-type)
- [topology.kubernetes.io/region](/docs/reference/labels-annotations-taints/#topologykubernetesioregion)
- [topology.kubernetes.io/zone](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)
-->
## 卷快照進入公開測試版
<!--
## Volume Snapshot Moves to Beta
-->
在 v1.17 中，Kubernetes卷快照是是公開測試版。最初是在 v1.12 中以內部測試版引入的，第二個有重大變化的內部測試版是 v1.13 。這篇文章總結它在公開版本中的變化。
<!--
The Kubernetes Volume Snapshot feature is now beta in Kubernetes v1.17. It was introduced as alpha in Kubernetes v1.12, with a second alpha with breaking changes in Kubernetes v1.13.  This post summarizes the changes in the beta release.
-->
### 卷快照是什麼？
<!--
### What is a Volume Snapshot?
-->
許多的儲存系統(如谷歌雲持久化磁盤，亞馬遜彈性塊儲存和許多的內部儲存系統)支持爲持久卷創建快照。快照代表卷在一個時間點的複製。它可用於設定新卷(使用快照資料提前填充)或恢復捲到一個之前的狀態(用快照表示)。
<!--
Many storage systems (like Google Cloud Persistent Disks, Amazon Elastic Block Storage, and many on-premise storage systems) provide the ability to create a “snapshot” of a persistent volume. A snapshot represents a point-in-time copy of a volume. A snapshot can be used either to provision a new volume (pre-populated with the snapshot data) or to restore an existing volume to a previous state (represented by the snapshot).
-->
### 爲什麼給Kubernetes加入卷快照？
<!--
### Why add Volume Snapshots to Kubernetes?
-->
Kubernetes卷插件系統已經提供了功能強大的抽象用於自動設定、附加和掛載塊檔案系統。
<!--
The Kubernetes volume plugin system already provides a powerful abstraction that automates the provisioning, attaching, and mounting of block and file storage.
-->

支持所有這些特性是Kubernetes負載可移植的目標：Kubernetes旨在分佈式系統應用和底層叢集之間創建一個抽象層,使得應用可以不感知其運行叢集的具體資訊並且部署也不需特定叢集的知識。
<!--
Underpinning all these features is the Kubernetes goal of workload portability: Kubernetes aims to create an abstraction layer between distributed systems applications and underlying clusters so that applications can be agnostic to the specifics of the cluster they run on and application deployment requires no “cluster specific” knowledge.
-->

Kubernetes儲存特別興趣組(SIG)將快照操作確定爲對很多有狀態負載的關鍵功能。如資料庫管理員希望在操作資料庫前保存資料庫卷快照。
<!--
The Kubernetes Storage SIG identified snapshot operations as critical functionality for many stateful workloads. For example, a database administrator may want to snapshot a database volume before starting a database operation.
-->

在Kubernetes介面中提供一種標準的方式觸發快照操作，Kubernetes使用者可以處理這種使用者場景，而不必使用Kubernetes API(並手動執行儲存系統的具體操作)。
<!--
By providing a standard way to trigger snapshot operations in the Kubernetes API, Kubernetes users can now handle use cases like this without having to go around the Kubernetes API (and manually executing storage system specific operations).
-->

取而代之的是，Kubernetes使用者現在被授權以與叢集無關的方式將快照操作放進他們的工具和策略中，並且確信它將對任意的Kubernetes叢集有效，而與底層儲存無關。
<!--
Instead, Kubernetes users are now empowered to incorporate snapshot operations in a cluster agnostic way into their tooling and policy with the comfort of knowing that it will work against arbitrary Kubernetes clusters regardless of the underlying storage.
-->

此外，Kubernetes 快照原語作爲基礎構建能力解鎖了爲Kubernetes開發高級、企業級、儲存管理特性的能力:包括應用或叢集級別的備份方案。
<!--
Additionally these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced, enterprise grade, storage administration features for Kubernetes: including application or cluster level backup solutions.
-->

你可以閱讀更多關於[發佈容器儲存介面卷快照公開測試版](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-cis-volume-snapshot-beta/)
<!--
You can read more in the blog entry about [releasing CSI volume snapshots to beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-cis-volume-snapshot-beta/).
-->
## 容器儲存介面遷移公測版
<!--
## CSI Migration Beta
-->
### 爲什麼我們遷移內建樹插件到容器儲存介面？
<!--
### Why are we migrating in-tree plugins to CSI?
-->
在容器儲存介面之前，Kubernetes提供功能強大的卷插件系統。這些卷插件是樹內的意味着它們的代碼是核心Kubernetes代碼的一部分並附帶在覈心Kubernetes二進制中。然而，爲Kubernetes添加插件支持新卷是非常有挑戰的。希望在Kubernetes上爲自己儲存系統添加支持(或修復現有卷插件的bug)的供應商被迫與Kubernetes發行進程對齊。此外，第三方儲存代碼在覈心Kubernetes二進制中會造成可靠性和安全問題，並且這些代碼對於Kubernetes的維護者來說是難以(一些場景是不可能)測試和維護的。在Kubernetes上採用容器儲存介面可以解決大部分問題。
<!--
Prior to CSI, Kubernetes provided a powerful volume plugin system. These volume plugins were “in-tree” meaning their code was part of the core Kubernetes code and shipped with the core Kubernetes binaries. However, adding support for new volume plugins to Kubernetes was challenging. Vendors that wanted to add support for their storage system to Kubernetes (or even fix a bug in an existing volume plugin) were forced to align with the Kubernetes release process. In addition, third-party storage code caused reliability and security issues in core Kubernetes binaries and the code was often difficult (and in some cases impossible) for Kubernetes maintainers to test and maintain. Using the Container Storage Interface in Kubernetes resolves these major issues.
 -->

隨着更多容器儲存介面驅動變成生產環境可用，我們希望所有的Kubernetes使用者從容器儲存介面模型中獲益。然而，我們不希望強制使用者以破壞現有基本可用的儲存介面的方式去改變負載和設定。道路很明確，我們將不得不用CSI替換樹內插件介面。什麼是容器儲存介面遷移？
<!--
As more CSI Drivers were created and became production ready, we wanted all Kubernetes users to reap the benefits of the CSI model. However, we did not want to force users into making workload/configuration changes by breaking the existing generally available storage APIs. The way forward was clear - we would have to replace the backend of the “in-tree plugin” APIs with CSI.
What is CSI migration?
-->

在容器儲存介面遷移上所做的努力使得替換現有的樹內儲存插件，如`kubernetes.io/gce-pd`或`kubernetes.io/aws-ebs`，爲相應的容器儲存介面驅動成爲可能。如果容器儲存介面遷移正常工作，Kubernetes終端使用者不會注意到任何差別。遷移過後，Kubernetes使用者可以繼續使用現有介面來依賴樹內儲存插件的功能。
<!--
The CSI migration effort enables the replacement of existing in-tree storage plugins such as `kubernetes.io/gce-pd` or `kubernetes.io/aws-ebs` with a corresponding CSI driver. If CSI Migration is working properly, Kubernetes end users shouldn’t notice a difference. After migration, Kubernetes users may continue to rely on all the functionality of in-tree storage plugins using the existing interface.
 -->

當Kubernetes叢集管理者更新叢集使得CSI遷移可用，現有的有狀態部署和工作負載照常工作；然而，在幕後Kubernetes將儲存管理操作交給了(以前是交給樹內驅動)CSI驅動。
<!--
When a Kubernetes cluster administrator updates a cluster to enable CSI migration, existing stateful deployments and workloads continue to function as they always have; however, behind the scenes Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.
-->

Kubernetes組非常努力地保證儲存介面的穩定性和平滑升級體驗的承諾。這需要細緻的考慮現有特性和行爲來確保後向兼容和介面穩定性。你可以想像成在加速行駛的直線上給賽車換輪胎。
<!--
The Kubernetes team has worked hard to ensure the stability of storage APIs and for the promise of a smooth upgrade experience. This involves meticulous accounting of all existing features and behaviors to ensure backwards compatibility and API stability. You can think of it like changing the wheels on a racecar while it’s speeding down the straightaway.
-->

你可以在這篇博客中閱讀更多關於[容器儲存介面遷移成爲公開測試版](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/).
<!--
You can read more in the blog entry about [CSI migration going to beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/).
-->
## 其它更新
<!--
## Other Updates
 -->
### 穩定💯
<!--
### Graduated to Stable 💯
-->
- [按條件污染節點](https://github.com/kubernetes/enhancements/issues/382)
- [可設定的Pod進程共享命名空間](https://github.com/kubernetes/enhancements/issues/495)
- [採用kube-scheduler調度DaemonSet Pods](https://github.com/kubernetes/enhancements/issues/548)
- [動態卷最大值](https://github.com/kubernetes/enhancements/issues/554)
- [Kubernetes容器儲存介面支持拓撲](https://github.com/kubernetes/enhancements/issues/557)
- [在SubPath掛載提供環境變量擴展](https://github.com/kubernetes/enhancements/issues/559)
- [爲Custom Resources提供預設值](https://github.com/kubernetes/enhancements/issues/575)
- [從頻繁的Kublet心跳到租約介面](https://github.com/kubernetes/enhancements/issues/589)
- [拆分Kubernetes測試Tarball](https://github.com/kubernetes/enhancements/issues/714)
- [添加Watch書籤支持](https://github.com/kubernetes/enhancements/issues/956)
- [行爲驅動一致性測試](https://github.com/kubernetes/enhancements/issues/960)
- [服務負載均衡終結保護](https://github.com/kubernetes/enhancements/issues/980)
- [避免每一個Watcher獨立序列化相同的對象](https://github.com/kubernetes/enhancements/issues/1152)

<!--
- [Taint Node by Condition](https://github.com/kubernetes/enhancements/issues/382)
- [Configurable Pod Process Namespace Sharing](https://github.com/kubernetes/enhancements/issues/495)
- [Schedule DaemonSet Pods by kube-scheduler](https://github.com/kubernetes/enhancements/issues/548)
- [Dynamic Maximum Volume Count](https://github.com/kubernetes/enhancements/issues/554)
- [Kubernetes CSI Topology Support](https://github.com/kubernetes/enhancements/issues/557)
- [Provide Environment Variables Expansion in SubPath Mount](https://github.com/kubernetes/enhancements/issues/559)
- [Defaulting of Custom Resources](https://github.com/kubernetes/enhancements/issues/575)
- [Move Frequent Kubelet Heartbeats To Lease Api](https://github.com/kubernetes/enhancements/issues/589)
- [Break Apart The Kubernetes Test Tarball](https://github.com/kubernetes/enhancements/issues/714)
- [Add Watch Bookmarks Support](https://github.com/kubernetes/enhancements/issues/956)
- [Behavior-Driven Conformance Testing](https://github.com/kubernetes/enhancements/issues/960)
- [Finalizer Protection For Service Loadbalancers](https://github.com/kubernetes/enhancements/issues/980)
- [Avoid Serializing The Same Object Independently For Every Watcher](https://github.com/kubernetes/enhancements/issues/1152)
-->
### 主要變化
<!--
### Major Changes
-->
- [添加IPv4/IPv6雙棧支持](https://github.com/kubernetes/enhancements/issues/563)

<!--
- [Add IPv4/IPv6 Dual Stack Support](https://github.com/kubernetes/enhancements/issues/563)
-->
### 其它顯著特性
<!--
### Other Notable Features
-->
- [拓撲感知路由服務(內部測試版)](https://github.com/kubernetes/enhancements/issues/536)
- [爲Windows添加RunAsUserName](https://github.com/kubernetes/enhancements/issues/1043)

<!--
- [Topology Aware Routing of Services (Alpha)](https://github.com/kubernetes/enhancements/issues/536)
- [RunAsUserName for Windows](https://github.com/kubernetes/enhancements/issues/1043)
-->
### 可用性
<!--
### Availability
-->
Kubernetes 1.17 可以[在GitHub下載](https://github.com/kubernetes/kubernetes/releases/tag/v1.17.0)。開始使用Kubernetes，看看這些[交互教學](https://kubernetes.io/docs/tutorials/)。你可以非常容易使用[kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/)安裝1.17。
<!--
Kubernetes 1.17 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.17.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/). You can also easily install 1.17 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/).
 -->
### 發佈團隊
<!--
### Release Team
-->
正是因爲有上千人參與技術或非技術內容的貢獻才使這個版本成爲可能。特別感謝由Guinevere Saenger領導的[發佈團隊](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md)。發佈團隊的35名成員在發佈版本的多方面進行了協調，從文檔到測試，校驗和特性的完善。
<!--
This release is made possible through the efforts of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md) led by Guinevere Saenger. The 35 individuals on the release team coordinated many aspects of the release, from documentation to testing, validation, and feature completeness.
-->
隨着Kubernetes社區的成長，我們的發佈流程是在開源軟體協作方面驚人的示例。Kubernetes快速並持續獲得新使用者。這一成長產生了良性的反饋循環，更多的貢獻者貢獻代碼創造了更加活躍的生態。Kubernetes已經有超過[39000位貢獻者](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1)和一個超過66000人的活躍社區。
<!--
As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid pace. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has had over [39,000 individual contributors](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1) to date and an active community of more than 66,000 people.
-->
### 網路研討會
<!--
### Webinar
-->
2020年1月7號，加入Kubernetes 1.17發佈團隊，學習關於這次發佈的主要特性。[這裏](https://zoom.us/webinar/register/9315759188139/WN_kPOZA_6RTjeGdXTG7YFO3A)註冊。
<!--
Join members of the Kubernetes 1.17 release team on Jan 7th, 2020 to learn about the major features in this release. Register [here](https://zoom.us/webinar/register/9315759188139/WN_kPOZA_6RTjeGdXTG7YFO3A).
-->
### 參與其中
<!--
### Get Involved
-->
最簡單的參與Kubernetes的方式是加入其中一個與你興趣相同的[特別興趣組](https://github.com/kubernetes/community/blob/master/sig-list.md)（SIGs)。有什麼想要廣播到Kubernetes社區嗎？通過如下的頻道，在每週的[社區會議](https://github.com/kubernetes/community/tree/master/communication)分享你的聲音。感謝你的貢獻和支持。
<!--
The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.
-->

- 在Twitter上關注我們[@Kubernetesio](https://twitter.com/kubernetesio)獲取最新的更新
- 在[Discuss](https://discuss.kubernetes.io/)參與社區的討論
- 在[Slack](http://slack.k8s.io/)加入社區
- 在[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)發佈問題(或回答問題)
- 分享你的Kubernetes[故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)

<!--
- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
 -->
