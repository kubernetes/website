---
layout: blog
title: "聚焦 SIG Storage"
slug: sig-storage-spotlight
date: 2022-08-22
---
<!--
layout: blog
title: "Spotlight on SIG Storage"
slug: sig-storage-spotlight
date: 2022-08-22
canonicalUrl: https://www.kubernetes.dev/blog/2022/08/22/sig-storage-spotlight-2022/
-->

<!--
**Author**: Frederico Muñoz (SAS)
-->
**作者**：Frederico Muñoz (SAS)

<!--
Since the very beginning of Kubernetes, the topic of persistent data and how to address the requirement of stateful applications has been an important topic. Support for stateless deployments was natural, present from the start, and garnered attention, becoming very well-known. Work on better support for stateful applications was also present from early on, with each release increasing the scope of what could be run on Kubernetes.
-->
自 Kubernetes 誕生之初，持久數據以及如何解決有狀態應用程序的需求一直是一個重要的話題。
對無狀態部署的支持是很自然的、從一開始就存在的，並引起了人們的關注，變得衆所周知。
從早期開始，我們也致力於更好地支持有狀態應用程序，每個版本都增加了可以在 Kubernetes 上運行的範圍。

<!--
Message queues, databases, clustered filesystems: these are some examples of the solutions that have different storage requirements and that are, today, increasingly deployed in Kubernetes. Dealing with ephemeral and persistent storage, local or remote, file or block, from many different vendors, while considering how to provide the needed resiliency and data consistency that users expect, all of this is under SIG Storage's umbrella.
-->
消息隊列、數據庫、集羣文件系統：這些是具有不同存儲要求的解決方案的一些示例，
如今這些解決方案越來越多地部署在 Kubernetes 中。
處理來自許多不同供應商的臨時和持久存儲（本地或遠程、文件或塊），同時考慮如何提供用戶期望的所需彈性和數據一致性，
所有這些都在 SIG Storage 的整體負責範圍之內。

<!--
In this SIG Storage spotlight, [Frederico Muñoz](https://twitter.com/fredericomunoz) (Cloud & Architecture Lead at SAS) talked with [Xing Yang](https://twitter.com/2000xyang), Tech Lead at VMware and co-chair of SIG Storage, on how the SIG is organized, what are the current challenges and how anyone can get involved and contribute.
-->
在這次 SIG Storage 採訪報道中，[Frederico Muñoz](https://twitter.com/fredericomunoz)
（SAS 的雲和架構負責人）與 VMware 技術負責人兼 SIG Storage 聯合主席
[Xing Yang](https://twitter.com/2000xyang)，討論了 SIG 的組織方式、當前的挑戰是什麼以及如何進行參與和貢獻。

<!--
## About SIG Storage

**Frederico (FSM)**: Hello, thank you for the opportunity of learning more about SIG Storage. Could you tell us a bit about yourself, your role, and how you got involved in SIG Storage.
-->
## 關於 SIG Storage

**Frederico (FSM)**：你好，感謝你給我這個機會了解更多關於 SIG Storage 的情況。
你能否介紹一下你自己、你的角色以及你是如何參與 SIG Storage 的。

<!--
**Xing Yang (XY)**: I am a Tech Lead at VMware, working on Cloud Native Storage. I am also a Co-Chair of SIG Storage. I started to get involved in K8s SIG Storage at the end of 2017, starting with contributing to the [VolumeSnapshot](https://kubernetes.io/docs/concepts/storage/volume-snapshots/) project. At that time, the VolumeSnapshot project was still in an experimental, pre-alpha stage. It needed contributors. So I volunteered to help. Then I worked with other community members to bring VolumeSnapshot to Alpha in K8s 1.12 release in 2018, Beta in K8s 1.17 in 2019, and eventually GA in 1.20 in 2020.
-->
**Xing Yang (XY)**：我是 VMware 的技術主管，從事雲原生存儲方面的工作。我也是 SIG Storage 的聯合主席。
我從 2017 年底開始參與 K8s SIG Storage，開始爲
[VolumeSnapshot](https://kubernetes.io/zh-cn/docs/concepts/storage/volume-snapshots/) 項目做貢獻。
那時，VolumeSnapshot 項目仍處於實驗性的 pre-alpha 階段。它需要貢獻者。所以我自願提供幫助。
然後我與其他社區成員合作，在 2018 年的 K8s 1.12 版本中將 VolumeSnapshot 帶入 Alpha，
2019 年在 K8s 1.17 版本中帶入 Beta，並最終在 2020 年在 1.20 版本中帶入 GA。

<!--
**FSM**: Reading the [SIG Storage charter](https://github.com/kubernetes/community/blob/master/sig-storage/charter.md) alone it’s clear that SIG Storage covers a lot of ground, could you describe how the SIG is organised?
-->
**FSM**：僅僅閱讀 [SIG Storage 章程](https://github.com/kubernetes/community/blob/master/sig-storage/charter.md)
就可以看出，SIG Storage 涵蓋了很多領域，你能描述一下 SIG 的組織方式嗎？

<!--
**XY**: In SIG Storage, there are two Co-Chairs and two Tech Leads. Saad Ali from Google and myself are Co-Chairs. Michelle Au from Google and Jan Šafránek from Red Hat are Tech Leads.
-->
**XY**：在 SIG Storage 中，有兩位聯合主席和兩位技術主管。來自 Google 的 Saad Ali 和我是聯合主席。
來自 Google 的 Michelle Au 和來自 Red Hat 的 Jan Šafránek 是技術主管。

<!--
We have bi-weekly meetings where we go through features we are working on for each particular release, getting the statuses, making sure each feature has dev owners and reviewers working on it, and reminding people about the release deadlines, etc. More information on the SIG is on the [community page](https://github.com/kubernetes/community/tree/master/sig-storage). People can also add PRs that need attention, design proposals that need discussion, and other topics to the meeting agenda doc. We will go over them after project tracking is done.
-->
我們每兩週召開一次會議，討論我們正在爲每個特定版本開發的功能，獲取狀態，確保每個功能都有開發人員和審閱人員在處理它，
並提醒人們發佈截止日期等。有關 SIG 的更多信息，請查閱[社區頁面](https://github.com/kubernetes/community/tree/master/sig-storage)。
人們還可以將需要關注的 PR、需要討論的設計提案和其他議題添加到會議議程文檔中。
我們將在項目跟蹤完成後對其進行審查。

<!--
We also have other regular meetings, i.e., CSI Implementation meeting, Object Bucket API design meeting, and one-off meetings for specific topics if needed. There is also a [K8s Data Protection Workgroup](https://github.com/kubernetes/community/blob/master/wg-data-protection/README.md) that is sponsored by SIG Storage and SIG Apps. SIG Storage owns or co-owns features that are being discussed at the Data Protection WG.
-->
我們還舉行其他的定期會議，如 CSI 實施會議，Object Bucket API 設計會議，以及在需要時針對特定議題的一次性會議。
還有一個由 SIG Storage 和 SIG Apps 贊助的
[K8s 數據保護工作組](https://github.com/kubernetes/community/blob/master/wg-data-protection/README.md)。
SIG Storage 擁有或共同擁有數據保護工作組正在討論的功能特性。

<!--
## Storage and Kubernetes

**FSM**: Storage is such a foundational component in so many things, not least in Kubernetes: what do you think are the Kubernetes-specific challenges in terms of storage management?
-->
## 存儲和 Kubernetes

**FSM**：存儲是很多模塊的基礎組件，尤其是 Kubernetes：你認爲 Kubernetes 在存儲管理方面的具體挑戰是什麼?

<!--
**XY**: In Kubernetes, there are multiple components involved for a volume operation. For example, creating a Pod to use a PVC has multiple components involved. There are the Attach Detach Controller and the external-attacher working on attaching the PVC to the pod. There’s the Kubelet that works on mounting the PVC to the pod. Of course the CSI driver is involved as well. There could be race conditions sometimes when coordinating between multiple components.
-->
**XY**：在 Kubernetes 中，卷操作涉及多個組件。例如，創建一個使用 PVC 的 Pod 涉及多個組件。
有 Attach Detach Controller 和 external-attacher 負責將 PVC 連接到 Pod。
還有 Kubelet 可以將 PVC 掛載到 Pod 上。當然，CSI 驅動程序也參與其中。
在多個組件之間進行協調時，有時可能會出現競爭狀況。

<!--
Another challenge is regarding core vs [Custom Resource Definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRD), not really storage specific. CRD is a great way to extend Kubernetes capabilities while not adding too much code to the Kubernetes core itself. However, this also means there are many external components that are needed when running a Kubernetes cluster.
-->
另一個挑戰是關於核心與 [Custom Resource Definitions](https://kubernetes.io/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)（CRD），
這並不是特定於存儲的。CRD 是一種擴展 Kubernetes 功能的好方法，同時又不會向 Kubernetes 核心本身添加太多代碼。
然而，這也意味着運行 Kubernetes 集羣時需要許多外部組件。

<!--
From the SIG Storage side, one most notable example is Volume Snapshot. Volume Snapshot APIs are defined as CRDs. API definitions and controllers are out-of-tree. There is a common snapshot controller and a snapshot validation webhook that should be deployed on the control plane, similar to how kube-controller-manager is deployed. Although Volume Snapshot is a CRD, it is a core feature of SIG Storage.  It is recommended for the K8s cluster distros to deploy Volume Snapshot CRDs, the snapshot controller, and the snapshot validation webhook, however, most of the time we don’t see distros deploy them. So this becomes a problem for the storage vendors: now it becomes their responsibility to deploy these non-driver specific common components. This could cause conflicts if a customer wants to use more than one storage system and deploy more than one CSI driver.
-->
在 SIG Storage 方面，一個最好的例子是卷快照。卷快照 API 被定義爲 CRD。
API 定義和控制器是 out-of-tree。有一個通用的快照控制器和一個快照驗證 Webhook
應該部署在控制平面上，類似於 kube-controller-manager 的部署方式。
雖然 Volume Snapshot 是一個 CRD，但它是 SIG Storage 的核心特性。
建議 K8s 集羣發行版部署卷快照 CRD、快照控制器和快照驗證 Webhook，然而，大多數時候我們沒有看到發行版部署它們。
因此，這對存儲供應商來說就成了一個問題：現在部署這些非驅動程序特定的通用組件成爲他們的責任。
如果客戶需要使用多個存儲系統，且部署多個 CSI 驅動，可能會導致衝突。

<!--
**FSM**: Not only the complexity of a single storage system, you have to consider how they will be used together in Kubernetes?
-->
**FSM**：不僅要考慮單個存儲系統的複雜性，還要考慮它們在 Kubernetes 中如何一起使用？

<!--
**XY**: Yes, there are many different storage systems that can provide storage to containers in Kubernetes. They don’t work the same way. It is challenging to find a solution that works for everyone.
-->
**XY**：是的，有許多不同的存儲系統可以爲 Kubernetes 中的容器提供存儲。它們的工作方式不同。找到適合所有人的解決方案是具有挑戰性的。

<!--
**FSM**: Storage in Kubernetes also involves interacting with external solutions, perhaps more so than other parts of Kubernetes. Is this interaction with vendors and external providers challenging? Has it evolved with time in any way?
-->
**FSM**：Kubernetes 中的存儲還涉及與外部解決方案的交互，可能比 Kubernetes 的其他部分更多。
這種與供應商和外部供應商的互動是否具有挑戰性？它是否以任何方式隨着時間而演變？

<!--
**XY**: Yes, it is definitely challenging. Initially Kubernetes storage had in-tree volume plugin interfaces. Multiple storage vendors implemented in-tree interfaces and have volume plugins in the Kubernetes core code base.  This caused lots of problems.  If there is a bug in a volume plugin, it affects the entire Kubernetes code base.  All volume plugins must be released together with Kubernetes. There was no flexibility if storage vendors need to fix a bug in their plugin or want to align with their own product release.
-->
**XY**：是的，這絕對是具有挑戰性的。最初 Kubernetes 存儲具有 in-tree 卷插件接口。
多家存儲供應商實現了 in-tree 接口，並在 Kubernetes 核心代碼庫中擁有卷插件。這引起了很多問題。
如果卷插件中存在錯誤，它會影響整個 Kubernetes 代碼庫。所有卷插件必須與 Kubernetes 一起發佈。
如果存儲供應商需要修復其插件中的錯誤或希望與他們自己的產品版本保持一致，這是不靈活的。

<!--
**FSM**: That’s where CSI enters the game?
-->
**FSM**：這就是 CSI 加入的原因？

<!--
**XY**: Exactly, then there comes [Container Storage Interface](https://kubernetes-csi.github.io/docs/) (CSI). This is an industry standard trying to design common storage interfaces so that a storage vendor can write one plugin and have it work across a range of container orchestration systems (CO). Now Kubernetes is the main CO, but back when CSI just started, there were Docker, Mesos, Cloud Foundry, in addition to Kubernetes. CSI drivers are out-of-tree so bug fixes and releases can happen at their own pace.
-->
**XY**：沒錯，接下來就是[容器存儲接口](https://kubernetes-csi.github.io/docs/)（CSI）。
這是一個試圖設計通用存儲接口的行業標準，以便存儲供應商可以編寫一個插件並讓它在一系列容器編排系統（CO）中工作。
現在 Kubernetes 是主要的 CO，但是在 CSI 剛開始的時候，除了 Kubernetes 之外，還有 Docker、Mesos、Cloud Foundry。
CSI 驅動程序是 out-of-tree 的，因此可以按照自己的節奏進行錯誤修復和發佈。

<!--
CSI is definitely a big improvement compared to in-tree volume plugins. Kubernetes implementation of CSI has been GA [since the 1.13 release](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/).  It has come a long way.  SIG Storage has been working on moving in-tree volume plugins to out-of-tree CSI drivers for several releases now.
-->
與 in-tree 卷插件相比，CSI 絕對是一個很大的改進。CSI 的 Kubernetes
實現[自 1.13 版本以來](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/)就達到 GA。
它已經發展了很長時間。SIG Storage 一直致力於將 in-tree 卷插件遷移到 out-of-tree 的 CSI 驅動，已經有幾個版本了。

<!--
**FSM**: Moving drivers away from the Kubernetes main tree and into CSI was an important improvement.
-->
**FSM**：將驅動程序從 Kubernetes 主倉移到 CSI 中是一項重要的改進。

<!--
**XY**: CSI interface is an improvement over the in-tree volume plugin interface, however, there are still challenges. There are lots of storage systems. Currently [there are more than 100 CSI drivers listed in CSI driver docs](https://kubernetes-csi.github.io/docs/drivers.html). These storage systems are also very diverse.  So it is difficult to design a common API that works for all.  We introduced capabilities at CSI driver level, but we also have challenges when volumes provisioned by the same driver have different behaviors.  The other day we just had a meeting discussing Per Volume CSI Driver Capabilities. We have a problem differentiating some CSI driver capabilities when the same driver supports both block and file volumes.  We are going to have follow up meetings to discuss this problem.
-->
**XY**： CSI 接口是對 in-tree 卷插件接口的改進，但是仍然存在挑戰。有很多存儲系統。
目前在 [CSI 驅動程序文檔中列出了 100 多個 CSI 驅動程序](https://kubernetes-csi.github.io/docs/drivers.html)。
這些存儲系統也非常多樣化。因此，很難設計一個適用於所有人的通用 API。
我們在 CSI 驅動層面引入了功能，但當同一驅動配置的卷具有不同的行爲時，我們也會面臨挑戰。
前幾天我們剛剛開會討論每種卷 CSI 驅動程序功能。
當同一個驅動程序同時支持塊卷和文件卷時，我們在區分某些 CSI 驅動程序功能時遇到了問題。
我們將召開後續會議來討論這個問題。

<!--
## Ongoing challenges

**FSM**: Specifically for the [1.25 release](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25) we can see that there are a relevant number of storage-related [KEPs](https://bit.ly/k8s125-enhancements) in the pipeline, would you say that this release is particularly important for the SIG?
-->
## 持續的挑戰

**FSM**：具體來說，對於 [1.25 版本](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25)
們可以看到管道中有一些與存儲相關的 [KEPs](https://bit.ly/k8s125-enhancements)。
你是否認爲這個版本對 SIG 特別重要？

<!--
**XY**: I wouldn’t say one release is more important than other releases. In any given release, we are working on a few very important things.
-->
**XY**：我不會說一個版本比其他版本更重要。在任何給定的版本中，我們都在做一些非常重要的事情。

<!--
**FSM**: Indeed, but are there any 1.25 specific specificities and highlights you would like to point out though?
-->
**FSM**：確實如此，但你是否想指出 1.25 版本的特定特性和亮點呢？

<!--
**XY**: Yes. For the 1.25 release, I want to highlight the following:
-->
**XY**：好的。對於 1.25 版本，我想強調以下幾點：

<!--
* [CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration) is an on-going effort that SIG Storage has been working on for a few releases now. The goal is to move in-tree volume plugins to out-of-tree CSI drivers and eventually remove the in-tree volume plugins.  There are 7 KEPs that we are targeting in 1.25 are related to CSI migration. There is one core KEP for the general CSI Migration feature. That is targeting GA in 1.25. CSI Migration for GCE PD and AWS EBS are targeting GA. CSI Migration for vSphere is targeting to have the feature gate on by default while staying in 1.25 that are in Beta. Ceph RBD and PortWorx are targeting Beta, with feature gate off by default. Ceph FS is targeting Alpha.
-->
* [CSI 遷移](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration)
  是一項持續的工作，SIG Storage 已經工作了幾個版本了。目標是將 in-tree 卷插件移動到 out-of-tree 的
  CSI 驅動程序，並最終刪除 in-tree 卷插件。在 1.25 版本中，有 7 個 KEP 與 CSI 遷移有關。
  有一個核心 KEP 用於通用的 CSI 遷移功能。它的目標是在 1.25 版本中達到 GA。
  GCE PD 和 AWS EBS 的 CSI 遷移以 GA 爲目標。vSphere 的 CSI 遷移的目標是在默認情況下啓用特性門控，
  在 1.25 版本中達到 Beta。Ceph RBD 和 PortWorx 的目標是達到 Beta，默認關閉特性門控。
  Ceph FS 的目標是達到 Alpha。

<!--
* The second one I want to highlight is [COSI, the Container Object Storage Interface](https://github.com/kubernetes-sigs/container-object-storage-interface-spec). This is a sub-project under SIG Storage. COSI proposes object storage Kubernetes APIs to support orchestration of object store operations for Kubernetes workloads. It also introduces gRPC interfaces for object storage providers to write drivers to provision buckets. The COSI team has been working on this project for more than two years now. The COSI feature is targeting Alpha in 1.25. The KEP just got merged. The COSI team is working on updating the implementation based on the updated KEP.
-->
* 我要強調的第二個是 [COSI，容器對象存儲接口](https://github.com/kubernetes-sigs/container-object-storage-interface-spec)。
  這是 SIG Storage 下的一個子項目。COSI 提出對象存儲 Kubernetes API 來支持 Kubernetes 工作負載的對象存儲操作的編排。
  它還爲對象存儲提供商引入了 gRPC 接口，以編寫驅動程序來配置存儲桶。COSI 團隊已經在這個項目上工作兩年多了。
  COSI 功能的目標是 1.25 版本中達到 Alpha。KEP 剛剛合入。COSI 團隊正在根據更新後的 KEP 更新實現。

<!--
* Another feature I want to mention is [CSI Ephemeral Volume](https://github.com/kubernetes/enhancements/issues/596) support. This feature allows CSI volumes to be specified directly in the pod specification for ephemeral use cases. They can be used to inject arbitrary states, such as configuration, secrets, identity, variables or similar information, directly inside pods using a mounted volume.  This was initially introduced in 1.15 as an alpha feature, and it is now targeting GA in 1.25.
-->
* 我要提到的另一個功能是 [CSI 臨時卷](https://github.com/kubernetes/enhancements/issues/596)支持。
  此功能允許在臨時用例的 Pod 規約中直接指定 CSI 卷。它們可用於使用已安裝的卷直接在 Pod 內注入任意狀態，
  例如配置、Secrets、身份、變量或類似信息。這最初是在 1.15 版本中作爲一個 Alpha 功能引入的，現在它的目標是在 1.25 版本中達到 GA。

<!--
**FSM**: If you had to single something out, what would be the most pressing areas the SIG is working on?
-->
**FSM**：如果你必須單獨列出一些內容，那麼 SIG 正在研究的最緊迫的領域是什麼?

<!--
**XY**: CSI migration is definitely one area that the SIG has put in lots of effort and it has been on-going for multiple releases now. It involves work from multiple cloud providers and storage vendors as well.
-->
**XY**：CSI 遷移絕對是 SIG 投入大量精力的領域之一，並且現在已經進行了多個版本。它還涉及來自多個雲提供商和存儲供應商的工作。

<!--
## Community involvement

**FSM**: Kubernetes is a community-driven project. Any recommendation for anyone looking into getting involved in SIG Storage work? Where should they start?
-->
## 社區參與

**FSM**：Kubernetes 是一個社區驅動的項目。對任何希望參與 SIG Storage 工作的人有什麼建議嗎？他們應該從哪裏開始？

<!--
**XY**: Take a look at the [SIG Storage community page](https://github.com/kubernetes/community/tree/master/sig-storage), it has lots of information on how to get started. There are [SIG annual reports](https://github.com/kubernetes/community/blob/master/sig-storage/annual-report-2021.md) that tell you what we did each year. Take a look at the Contributing guide. It has links to presentations that can help you get familiar with Kubernetes storage concepts.
-->
**XY**：查看 [SIG Storage 社區頁面](https://github.com/kubernetes/community/tree/master/sig-storage)，
它有很多關於如何開始的信息。[SIG 年度報告](https://github.com/kubernetes/community/blob/master/sig-storage/annual-report-2021.md)告訴你我們每年做了什麼。
查看貢獻指南。它有一些演示的鏈接，可以幫助你熟悉 Kubernetes 存儲概念。

<!--
Join our [bi-weekly meetings on Thursdays](https://github.com/kubernetes/community/tree/master/sig-storage#meetings). Learn how the SIG operates and what we are working on for each release. Find a project that you are interested in and help out. As I mentioned earlier, I got started in SIG Storage by contributing to the Volume Snapshot project.
-->
參加我們[在星期四舉行的雙週會議](https://github.com/kubernetes/community/tree/master/sig-storage#meetings)。
瞭解 SIG 的運作方式以及我們爲每個版本所做的工作。找到你感興趣的項目並提供貢獻。
正如我之前提到的，我通過參與 Volume Snapshot 項目開始了 SIG Storage。

<!--
**FSM**: Any closing thoughts you would like to add?
-->
**FSM**：你有什麼要補充的結束語嗎？

<!--
**XY**: SIG Storage always welcomes new contributors. We need contributors to help with building new features, fixing bugs, doing code reviews, writing tests, monitoring test grid health, and improving documentation, etc.
-->
**XY**：SIG Storage 總是歡迎新的貢獻者。
我們需要貢獻者來幫助構建新功能、修復錯誤、進行代碼審查、編寫測試、監控測試網格的健康狀況以及改進文檔等。

<!--
**FSM**: Thank you so much for your time and insights into the workings of SIG Storage!
-->
**FSM**：非常感謝你抽出寶貴時間讓我們深入瞭解 SIG Storage！