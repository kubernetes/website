---
layout: blog
title: 'Kubernetes v1.33 預覽'
date: 2025-03-26T10:30:00-08:00
slug: kubernetes-v1-33-upcoming-changes
author: >
  Agustina Barbetta,
  Aakanksha Bhende,
  Udi Hofesh,
  Ryota Sawada,
  Sneha Yadav
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: 'Kubernetes v1.33 sneak peek'
date: 2025-03-26T10:30:00-08:00
slug: kubernetes-v1-33-upcoming-changes
author: >
  Agustina Barbetta,
  Aakanksha Bhende,
  Udi Hofesh,
  Ryota Sawada,
  Sneha Yadav
-->

<!--
As the release of Kubernetes v1.33 approaches, the Kubernetes project continues to evolve. Features may be deprecated, removed, or replaced to improve the overall health of the project. This blog post outlines some planned changes for the v1.33 release, which the release team believes you should be aware of to ensure the continued smooth operation of your Kubernetes environment and to keep you up-to-date with the latest developments.  The information below is based on the current status of the v1.33 release and is subject to change before the final release date.
-->
隨着 Kubernetes v1.33 版本的發佈臨近，Kubernetes 項目仍在不斷發展。
爲了提升項目的整體健康狀況，某些特性可能會被棄用、移除或替換。
這篇博客文章概述了 v1.33 版本的一些計劃變更，發佈團隊認爲你有必要了解這些內容，
以確保 Kubernetes 環境的持續平穩運行，並讓你掌握最新的發展動態。
以下信息基於 v1.33 版本的當前狀態，在最終發佈日期之前可能會有所變化。

<!--
## The Kubernetes API removal and deprecation process

The Kubernetes project has a well-documented [deprecation policy](/docs/reference/using-api/deprecation-policy/) for features. This policy states that stable APIs may only be deprecated when a newer, stable version of that same API is available and that APIs have a minimum lifetime for each stability level. A deprecated API has been marked for removal in a future Kubernetes release. It will continue to function until removal (at least one year from the deprecation), but usage will result in a warning being displayed. Removed APIs are no longer available in the current version, at which point you must migrate to using the replacement.
-->
## Kubernetes API 的移除與棄用流程

Kubernetes 項目針對特性的棄用有一套完善的[棄用政策](/zh-cn/docs/reference/using-api/deprecation-policy/)。
該政策規定，只有在有更新的、穩定的同名 API 可用時，才能棄用穩定的 API，
並且每個穩定性級別的 API 都有最低的生命週期要求。被棄用的 API 已被標記爲將在未來的
Kubernetes 版本中移除。在移除之前（自棄用起至少一年內），它仍然可以繼續使用，
但使用時會顯示警告信息。已被移除的 API 在當前版本中不再可用，屆時你必須遷移到使用替代方案。

<!--
* Generally available (GA) or stable API versions may be marked as deprecated but must not be removed within a major version of Kubernetes.

* Beta or pre-release API versions must be supported for 3 releases after the deprecation.

* Alpha or experimental API versions may be removed in any release without prior deprecation notice; this process can become a withdrawal in cases where a different implementation for the same feature is already in place.
-->
* 一般可用（GA）或穩定 API 版本可以被標記爲已棄用，但在 Kubernetes
  的一個主要版本內不得移除。

* 測試版或預發佈 API 版本在棄用後必須支持至少三個發行版本。

* Alpha 或實驗性 API 版本可以在任何版本中被移除，且無需事先發出棄用通知；
  如果同一特性已經有了不同的實現，這個過程可能會變爲撤回。

<!--
Whether an API is removed as a result of a feature graduating from beta to stable, or because that API simply did not succeed, all removals comply with this deprecation policy. Whenever an API is removed, migration options are communicated in the [deprecation guide](/docs/reference/using-api/deprecation-guide/).
-->
無論是由於某個特性從測試階段升級爲穩定階段而導致 API 被移除，還是因爲該
API 未能成功，所有的移除操作都遵循此棄用政策。每當一個 API 被移除時，
遷移選項都會在[棄用指南](/zh-cn/docs/reference/using-api/deprecation-guide/)中進行說明。

<!--
## Deprecations and removals for Kubernetes v1.33

### Deprecation of the stable Endpoints API

The [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) API has been stable since v1.21, which effectively replaced the original Endpoints API. While the original Endpoints API was simple and straightforward, it also posed some challenges when scaling to large numbers of network endpoints. The EndpointSlices API has introduced new features such as dual-stack networking, making the original Endpoints API ready for deprecation.
-->
## Kubernetes v1.33 的棄用與移除

### 穩定版 Endpoints API 的棄用

[EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/) API
自 v1.21 起已穩定，實際上取代了原有的 Endpoints API。雖然原有的 Endpoints API 簡單直接，
但在擴展到大量網路端點時也帶來了一些挑戰。EndpointSlices API 引入了諸如雙棧網路等新特性，
使得原有的 Endpoints API 已準備好被棄用。

<!--
This deprecation only impacts those who use the Endpoints API directly from workloads or scripts; these users should migrate to use EndpointSlices instead. There will be a dedicated blog post with more details on the deprecation implications and migration plans in the coming weeks.

You can find more in [KEP-4974: Deprecate v1.Endpoints](https://kep.k8s.io/4974).
-->
此棄用僅影響那些直接在工作負載或腳本中使用 Endpoints API 的使用者；
這些使用者應遷移到使用 EndpointSlices。未來幾周內將發佈一篇專門的博客文章，
詳細介紹棄用的影響和遷移計劃。

你可以在 [KEP-4974: Deprecate v1.Endpoints](https://kep.k8s.io/4974)
中找到更多信息。

<!--
### Removal of kube-proxy version information in node status

Following its deprecation in v1.31, as highlighted in the [release announcement](/blog/2024/07/19/kubernetes-1-31-upcoming-changes/#deprecation-of-status-nodeinfo-kubeproxyversion-field-for-nodes-kep-4004-https-github-com-kubernetes-enhancements-issues-4004), the `status.nodeInfo.kubeProxyVersion` field will be removed in v1.33. This field was set by kubelet, but its value was not consistently accurate. As it has been disabled by default since v1.31, the v1.33 release will remove this field entirely.
-->
### 節點狀態中 kube-proxy 版本信息的移除

繼在 v1.31 中被棄用，並在[發佈說明](/blog/2024/07/19/kubernetes-1-31-upcoming-changes/#deprecation-of-status-nodeinfo-kubeproxyversion-field-for-nodes-kep-4004-https-github-com-kubernetes-enhancements-issues-4004)中強調後，
`status.nodeInfo.kubeProxyVersion` 字段將在 v1.33 中被移除。
此字段由 kubelet 設置，但其值並不總是準確的。由於自 v1.31
起該字段默認已被禁用，v1.33 發行版將完全移除此字段。

<!--
You can find more in [KEP-4004: Deprecate status.nodeInfo.kubeProxyVersion field](https://kep.k8s.io/4004).

### Removal of host network support for Windows pods
-->
你可以在 [KEP-4004: Deprecate status.nodeInfo.kubeProxyVersion field](https://kep.k8s.io/4004)
中找到更多信息。

### 移除對 Windows Pod 的主機網路支持

<!--
Windows Pod networking aimed to achieve feature parity with Linux and provide better cluster density by allowing containers to use the Node’s networking namespace.
The original implementation landed as alpha with v1.26, but as it faced unexpected containerd behaviours,
and alternative solutions were available, the Kubernetes project has decided to withdraw the associated
KEP. We're expecting to see support fully removed in v1.33.
-->
Windows Pod 網路旨在通過允許容器使用節點的網路命名空間來實現與 Linux 的特性對等，
並提供更高的叢集密度。最初的實現作爲 Alpha 版本在 v1.26 中引入，但由於遇到了未預期的
containerd 行爲，且存在替代方案，Kubernetes 項目決定撤回相關的 KEP。
我們預計在 v1.33 中完全移除對該特性的支持。

<!--
You can find more in [KEP-3503: Host network support for Windows pods](https://kep.k8s.io/3503).

## Featured improvement of Kubernetes v1.33

As authors of this article, we picked one improvement as the most significant change to call out!
-->
你可以在 [KEP-3503: Host network support for Windows pods](https://kep.k8s.io/3503)
中找到更多信息。

## Kubernetes v1.33 的特色改進

作爲本文的作者，我們挑選了一項改進作爲最重要的變更來特別提及！

<!--
### Support for user namespaces within Linux Pods

One of the oldest open KEPs today is [KEP-127](https://kep.k8s.io/127), Pod security improvement by using Linux [User namespaces](/docs/concepts/workloads/pods/user-namespaces/) for Pods. This KEP was first opened in late 2016, and after multiple iterations, had its alpha release in v1.25, initial beta in v1.30 (where it was disabled by default), and now is set to be a part of v1.33, where the feature is available by default.
-->
### Linux Pods 中使用者命名空間的支持

當前最古老的開放 KEP 之一是 [KEP-127](https://kep.k8s.io/127)，
通過使用 Linux [使用者命名空間](/zh-cn/docs/concepts/workloads/pods/user-namespaces/)爲
Pod 提供安全性改進。該 KEP 最初在 2016 年末提出，經過多次迭代，在 v1.25 中發佈了 Alpha 版本，
在 v1.30 中首次進入 Beta 階段（在此版本中默認禁用），現在它將成爲 v1.33 的一部分，
默認情況下即可使用該特性。

<!--
This support will not impact existing Pods unless you manually specify `pod.spec.hostUsers` to opt in. As highlighted in the [v1.30 sneak peek blog](/blog/2024/03/12/kubernetes-1-30-upcoming-changes/), this is an important milestone for mitigating vulnerabilities.

You can find more in [KEP-127: Support User Namespaces in pods](https://kep.k8s.io/127).
-->
除非你手動指定 `pod.spec.hostUsers` 以選擇使用此特性，否則此支持不會影響現有的 Pod。
正如在 [v1.30 預覽博客](/blog/2024/03/12/kubernetes-1-30-upcoming-changes/)中強調的那樣，
就緩解漏洞的影響而言，這是一個重要里程碑。

你可以在 [KEP-127: Support User Namespaces in pods](https://kep.k8s.io/127)
中找到更多信息。

<!--
## Selected other Kubernetes v1.33 improvements

The following list of enhancements is likely to be included in the upcoming v1.33 release. This is not a commitment and the release content is subject to change.
-->
## 精選的其他 Kubernetes v1.33 改進

以下列出的改進很可能會包含在即將到來的 v1.33 發行版中。
這些改進尚無法承諾，發行內容仍有可能發生變化。

<!--
### In-place resource resize for vertical scaling of Pods

When provisioning a Pod, you can use various resources such as Deployment, StatefulSet, etc. Scalability requirements may need horizontal scaling by updating the Pod replica count, or vertical scaling by updating resources allocated to Pod’s container(s). Before this enhancement, container resources defined in a Pod's `spec` were immutable, and updating any of these details within a Pod template would trigger Pod replacement.
-->
### Pod 垂直擴展的就地資源調整

在製備某個 Pod 時，你可以使用諸如 Deployment、StatefulSet 等多種資源。
爲了滿足可擴縮性需求，可能需要通過更新 Pod 副本數量進行水平擴縮，或通過更新分配給
Pod 容器的資源進行垂直擴縮。在此增強特性之前，Pod 的 `spec`
中定義的容器資源是不可變的，更新 Pod 模板中的這類細節會觸發 Pod 的替換。

<!--
But what if you could dynamically update the resource configuration for your existing Pods without restarting them?

The [KEP-1287](https://kep.k8s.io/1287) is precisely to allow such in-place Pod updates. It opens up various possibilities of vertical scale-up for stateful processes without any downtime, seamless scale-down when the traffic is low, and even allocating larger resources during startup that is eventually reduced once the initial setup is complete. This was released as alpha in v1.27, and is expected to land as beta in v1.33.
-->
但是如果可以在不重啓的情況下動態更新現有 Pod 的資源設定，那會怎樣呢？

[KEP-1287](https://kep.k8s.io/1287) 正是爲了實現這種就地 Pod 更新而設計的。
它爲無狀態進程的垂直擴縮開闢了多種可能性，例如在不停機的情況下進行擴容、
在流量較低時無縫縮容，甚至在啓動時分配更多資源，待初始設置完成後減少資源分配。
該特性在 v1.27 中以 Alpha 版本發佈，並預計在 v1.33 中進入 beta 階段。

<!--
You can find more in [KEP-1287: In-Place Update of Pod Resources](https://kep.k8s.io/1287).

### DRA’s ResourceClaim Device Status graduates to beta
-->
你可以在 [KEP-1287：Pod 資源的就地更新](https://kep.k8s.io/1287)中找到更多信息。

### DRA 的 ResourceClaim 設備狀態升級爲 Beta

<!--
The `devices` field in ResourceClaim `status`, originally introduced in the v1.32 release, is likely to graduate to beta in v1.33. This field allows drivers to report device status data, improving both observability and troubleshooting capabilities.
-->
在 v1.32 版本中首次引入的 ResourceClaim `status` 中的 `devices` 字段，
預計將在 v1.33 中升級爲 beta 階段。此字段允許驅動程序報告設備狀態數據，
從而提升可觀測性和故障排查能力。

<!--
For example, reporting the interface name, MAC address, and IP addresses of network interfaces in the status of a ResourceClaim can significantly help in configuring and managing network services, as well as in debugging network related issues. You can read more about ResourceClaim Device Status in [Dynamic Resource Allocation: ResourceClaim Device Status](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status) document.
-->
例如，在 ResourceClaim 的狀態中報告網路接口的接口名稱、MAC 地址和 IP 地址，
可以顯著幫助設定和管理網路服務，並且在調試網路相關問題時也非常有用。
你可以在[動態資源分配：ResourceClaim 設備狀態](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status)
文檔中閱讀關於 ResourceClaim 設備狀態的更多信息。

<!--
Also, you can find more about the planned enhancement in [KEP-4817: DRA: Resource Claim Status with possible standardized network interface data](https://kep.k8s.io/4817).
-->
此外，你可以在
[KEP-4817: DRA: Resource Claim Status with possible standardized network interface data](https://kep.k8s.io/4817)
中找到更多關於此計劃增強特性的信息。

<!--
### Ordered namespace deletion

This KEP introduces a more structured deletion process for Kubernetes namespaces to ensure secure and deterministic resource removal. The current semi-random deletion order can create security gaps or unintended behaviour, such as Pods persisting after their associated NetworkPolicies are deleted. By enforcing a structured deletion sequence that respects logical and security dependencies, this approach ensures Pods are removed before other resources. The design improves Kubernetes’s security and reliability by mitigating risks associated with non-deterministic deletions.
-->
### 有序的命名空間刪除

此 KEP 爲 Kubernetes 命名空間引入了一種更爲結構化的刪除流程，
以確保更爲安全且更爲確定的資源移除。當前半隨機的刪除順序可能會導致安全漏洞或意外行爲，
例如在相關的 NetworkPolicy 被刪除後，Pod 仍然存在。
通過強制執行尊重邏輯和安全依賴關係的結構化刪除順序，此方法確保在刪除其他資源之前先刪除 Pod。
這種設計通過減少與非確定性刪除相關的風險，提升了 Kubernetes 的安全性和可靠性。

<!--
You can find more in [KEP-5080: Ordered namespace deletion](https://kep.k8s.io/5080).
-->
你可以在 [KEP-5080: Ordered namespace deletion](https://kep.k8s.io/5080)
中找到更多信息。

<!--
### Enhancements for indexed job management

These two KEPs are both set to graduate to GA to provide better reliability for job handling, specifically for indexed jobs. [KEP-3850](https://kep.k8s.io/3850) provides per-index backoff limits for indexed jobs, which allows each index to be fully independent of other indexes. Also, [KEP-3998](https://kep.k8s.io/3998) extends Job API to define conditions for making an indexed job as successfully completed when not all indexes are succeeded.
-->
### 針對帶索引作業（Indexed Job）管理的增強

這兩個 KEP 都計劃升級爲 GA，以提供更好的作業處理可靠性，特別是針對索引作業。
[KEP-3850](https://kep.k8s.io/3850) 爲索引作業中的不同索引分別支持獨立的回退限制，
這使得每個索引可以完全獨立於其他索引。此外，[KEP-3998](https://kep.k8s.io/3998)
擴展了 Job API，定義了在並非所有索引都成功的情況下將索引作業標記爲成功完成的條件。

<!--
You can find more in [KEP-3850: Backoff Limit Per Index For Indexed Jobs](https://kep.k8s.io/3850) and [KEP-3998: Job success/completion policy](https://kep.k8s.io/3998).
-->
你可以在 [KEP-3850: Backoff Limit Per Index For Indexed Jobs](https://kep.k8s.io/3850) 和
[KEP-3998: Job success/completion policy](https://kep.k8s.io/3998) 中找到更多信息。

<!--
## Want to know more?

New features and deprecations are also announced in the Kubernetes release notes. We will formally announce what's new in [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md) as part of the CHANGELOG for that release.
-->
## 想了解更多？

新特性和棄用也會在 Kubernetes 發行說明中宣佈。我們將在該版本的
CHANGELOG 中正式宣佈 [Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)
的新內容。

<!--
Kubernetes v1.33 release is planned for **Wednesday, 23rd April, 2025**. Stay tuned for updates!

You can also see the announcements of changes in the release notes for:
-->
Kubernetes v1.33 版本計劃於 **2025年4月23日星期三**發佈。請持續關注以獲取更新！

你也可以在以下版本的發行說明中查看變更公告：

* [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)

* [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)


<!--
## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.
-->
## 參與進來

參與 Kubernetes 最簡單的方式是加入與你興趣相符的衆多[特別興趣小組](https://github.com/kubernetes/community/blob/master/sig-list.md)（SIG）
之一。你有什麼想向 Kubernetes 社區廣播的內容嗎？
通過我們每週的[社區會議](https://github.com/kubernetes/community/tree/master/communication)和以下渠道分享你的聲音。
感謝你持續的反饋和支持。

<!--
- Follow us on Bluesky [@kubernetes.io](https://bsky.app/profile/kubernetes.io) for the latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes) or [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
- 在 Bluesky 上關注我們 [@kubernetes.io](https://bsky.app/profile/kubernetes.io) 以獲取最新更新
- 在 [Discuss](https://discuss.kubernetes.io/) 上參與社區討論
- 在 [Slack](http://slack.k8s.io/) 上加入社區
- 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 或
  [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上提問（或回答問題）
- 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- 在[博客](https://kubernetes.io/zh-cn/blog/)上閱讀更多關於 Kubernetes 最新動態的內容
- 瞭解更多關於 [Kubernetes 發佈團隊](https://github.com/kubernetes/sig-release/tree/master/release-team)的信息
