---
layout: blog
title: 'Kubernetes v1.31: Elli'
date: 2024-08-13
slug: kubernetes-v1-31-release
author: >
  [Kubernetes v1.31 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)
translator: >
  [RifeWang](https://github.com/RifeWang)
---
<!--
---
layout: blog
title: 'Kubernetes v1.31: Elli'
date: 2024-08-13
slug: kubernetes-v1-31-release
author: >
  [Kubernetes v1.31 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)
---
-->

<!--
**Editors:** Matteo Bianchi, Yigit Demirbas, Abigail McCarthy, Edith Puclla, Rashan Smith

Announcing the release of Kubernetes v1.31: Elli!

Similar to previous releases, the release of Kubernetes v1.31 introduces new
stable, beta, and alpha features. 
The consistent delivery of high-quality releases underscores the strength of our development cycle and the vibrant support from our community.
This release consists of 45 enhancements.
Of those enhancements, 11 have graduated to Stable, 22 are entering Beta, 
and 12 have graduated to Alpha.
-->

**編輯:** Matteo Bianchi, Yigit Demirbas, Abigail McCarthy, Edith Puclla, Rashan Smith

Kubernetes v1.31：Elli 宣佈發佈！

與之前的版本類似，Kubernetes v1.31 的發佈中引入了新的穩定版、Beta 版和 Alpha 特性功能。
持續提供高質量的版本彰顯了我們開發週期的強勁實力以及社區的大力支持。
此版本包含 45 項增強功能。
在這些增強功能中，11 項已升級到穩定版，22 項正在進入 Beta 版，12 項已升級到 Alpha 版。


<!--
## Release theme and logo
-->
## 發佈主題和 logo
{{< figure src="/images/blog/2024-08-13-kubernetes-1.31-release/k8s-1.31.png" alt="Kubernetes v1.31 Elli logo" class="release-logo" >}}

<!--
The Kubernetes v1.31 Release Theme is "Elli".

Kubernetes v1.31's Elli is a cute and joyful dog, with a heart of gold and a nice sailor's cap, as a playful wink to the huge and diverse family of Kubernetes contributors.
-->
Kubernetes v1.31 的發佈主題是 "Elli"。

Kubernetes v1.31 的 Elli 是一隻可愛歡快的小狗，戴着一頂漂亮的水手帽，這是對龐大而多樣化的 Kubernetes 貢獻者家族的一個俏皮致意。

<!--
Kubernetes v1.31 marks the first release after the project has successfully celebrated [its first 10 years](/blog/2024/06/06/10-years-of-kubernetes/). 
Kubernetes has come a very long way since its inception, and it's still moving towards exciting new directions with each release. 
After 10 years, it is awe-inspiring to reflect on the effort, dedication, skill, wit and tiring work of the countless Kubernetes contributors who have made this a reality.
-->

Kubernetes v1.31 標誌着該項目成功慶祝其[誕生十週年](/blog/2024/06/06/10-years-of-kubernetes/)後的首次發佈。
自誕生以來，Kubernetes 已經走過了漫長的道路，並且每次發佈都在朝着令人興奮的新方向前進。
十年後，回顧無數 Kubernetes 貢獻者爲實現這一目標所付出的努力、奉獻、技能、智慧和辛勤工作，令人敬畏。

<!--
And yet, despite the herculean effort needed to run the project, there is no shortage of people who show up, time and again, with enthusiasm, smiles and a sense of pride for contributing and being part of the community. 
This "spirit" that we see from new and old contributors alike is the sign of a vibrant community, a "joyful" community, if we might call it that.
-->
還有，儘管運營項目需要付出巨大的努力，仍然有大量的人不斷以熱情、微笑和自豪感出現，爲社區做出貢獻併成爲其中的一員。
我們從新老貢獻者那裏看到的這種"精神"是一個充滿活力的社區的標誌，我們可以稱之爲"歡樂"的社區。

<!--
Kubernetes v1.31's Elli is all about celebrating this wonderful spirit! Here's to the next decade of Kubernetes!
-->
Kubernetes v1.31 的 Elli 就是爲了慶祝這種美好的精神!讓我們爲 Kubernetes 的下一個十年乾杯!

<!--
## Highlights of features graduating to Stable

_This is a selection of some of the improvements that are now stable following the v1.31 release._
-->
## 晉級爲穩定版的功能亮點

_以下是 v1.31 發佈後晉級爲穩定版的部分改進。_

<!--
### AppArmor support is now stable
-->
### AppArmor 支持現已穩定

<!--
Kubernetes support for AppArmor is now GA. Protect your containers using AppArmor by setting the `appArmorProfile.type` field in the container's `securityContext`. 
Note that before Kubernetes v1.30, AppArmor was controlled via annotations; starting in v1.30 it is controlled using fields. 
It is recommended that you should migrate away from using annotations and start using the `appArmorProfile.type` field.
-->
Kubernetes 對 AppArmor 的支持現已正式發佈。通過在容器的 `securityContext` 中設置 `appArmorProfile.type` 字段，可以使用 AppArmor 保護您的容器。
請注意，在 Kubernetes v1.30 之前，AppArmor 是通過註解控制的；從 v1.30 開始，它是通過字段控制的。
建議您停止使用註解，開始使用 `appArmorProfile.type` 字段。

<!--
To learn more read the [AppArmor tutorial](/docs/tutorials/security/apparmor/). 
This work was done as a part of [KEP #24](https://github.com/kubernetes/enhancements/issues/24), by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
-->
要了解更多資訊，請閱讀 [AppArmor 教程](/zh-cn/docs/tutorials/security/apparmor/)。
這項工作是作爲 [KEP #24](https://github.com/kubernetes/enhancements/issues/24) 的一部分由
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 完成的。

<!--
### Improved ingress connectivity reliability for kube-proxy
-->
### 改進 kube-proxy 的入站連接可靠性

<!--
Kube-proxy improved ingress connectivity reliability is stable in v1.31. 
One of the common problems with load balancers in Kubernetes is the synchronization between the different components involved to avoid traffic drop. 
This feature implements a mechanism in kube-proxy for load balancers to do connection draining for terminating Nodes exposed by services of `type: LoadBalancer` and `externalTrafficPolicy: Cluster` and establish some best practices for cloud providers and Kubernetes load balancers implementations.
-->
kube-proxy 改進的入站連接可靠性在 v1.31 中已穩定。
Kubernetes 中負載均衡器的一個常見問題是爲避免流量丟失而在不同組件之間進行同步的機制。
此特性在 kube-proxy 中實現了一種機制，用於負載均衡器對 `type: LoadBalancer` 和 `externalTrafficPolicy: Cluster`
服務所公開的、進入終止進程的 Node 進行連接排空，併爲雲提供商和 Kubernetes 負載均衡器實現建立了一些最佳實踐。

<!--
To use this feature, kube-proxy needs to run as default service proxy on the cluster and the load balancer needs to support connection draining. 
There are no specific changes required for using this feature, it has been enabled by default in kube-proxy since v1.30 and been promoted to stable in v1.31.
-->
要使用此特性，kube-proxy 需要在叢集上作爲預設服務代理運行，並且負載均衡器需要支持連接排空。
使用此特性不需要進行特定的更改，它自 v1.30 以來在 kube-proxy 中預設啓用，並在 v1.31 中晉級爲穩定版。

<!--
For more details about this feature please visit the [Virtual IPs and Service Proxies documentation page](/docs/reference/networking/virtual-ips/#external-traffic-policy).
-->
有關此特性的更多詳細資訊，請訪問[虛擬 IP 和服務代理文檔頁面](/zh-cn/docs/reference/networking/virtual-ips/#external-traffic-policy)。

<!--
This work was done as part of [KEP #3836](https://github.com/kubernetes/enhancements/issues/3836) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
這項工作是作爲 [KEP #3836](https://github.com/kubernetes/enhancements/issues/3836) 的一部分由
[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 完成的。
    

<!--
### Persistent Volume last phase transition time
-->
### 持久卷最近階段轉換時間

<!--
Persistent Volume last phase transition time feature moved to GA in v1.31. 
This feature adds a `PersistentVolumeStatus` field which holds a timestamp of when a PersistentVolume last transitioned to a different phase.
With this feature enabled, every PersistentVolume object will have a new field `.status.lastTransitionTime`, that holds a timestamp of
when the volume last transitioned its phase. 
This change is not immediate; the new field will be populated whenever a PersistentVolume is updated and first transitions between phases (`Pending`, `Bound`, or `Released`) after upgrading to Kubernetes v1.31.
This allows you to measure time between when a PersistentVolume moves from `Pending` to `Bound`. This can be also useful for providing metrics and SLOs.
-->
持久卷最近階段轉換時間功能在 v1.31 中晉級爲正式版（GA）。
此特性添加了一個 `PersistentVolumeStatus` 字段，用於保存 PersistentVolume 最近轉換到不同階段的時間戳。
啓用此特性後，每個 PersistentVolume 對象將有一個新字段 `.status.lastTransitionTime` 保存卷最近轉換階段的時間戳。
這種變化並不是立即的；新字段將在 PersistentVolume 更新並在升級到 Kubernetes v1.31 後首次在各階段（`Pending`、`Bound` 或 `Released`）之間轉換時填充。
這允許您測量 PersistentVolume 從 `Pending` 移動到 `Bound` 之間的時間。這對於提供指標和 SLO 也很有用。

<!--
For more details about this feature please visit the [PersistentVolume documentation page](/docs/concepts/storage/persistent-volumes/).
-->
有關此特性的更多詳細資訊，請訪問 [PersistentVolume 文檔頁面](/zh-cn/docs/concepts/storage/persistent-volumes/)。

<!--

his work was done as a part of [KEP #3762](https://github.com/kubernetes/enhancements/issues/3762) by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
這項工作是作爲 [KEP #3762](https://github.com/kubernetes/enhancements/issues/3762) 的一部分由
[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 完成的。


<!--
## Highlights of features graduating to Beta
-->
## 晉級爲 Beta 版的功能亮點

<!--
_This is a selection of some of the improvements that are now beta following the v1.31 release._
-->
_以下是 v1.31 發佈後晉級爲 Beta 版的部分改進。_
    
<!--
### nftables backend for kube-proxy
-->
### kube-proxy 的 nftables 後端

<!--
The nftables backend moves to beta in v1.31, behind the `NFTablesProxyMode` feature gate which is now enabled by default.
-->
nftables 後端在 v1.31 中晉級爲 Beta 版，由 `NFTablesProxyMode` 特性門控控制，現在預設啓用。

<!--
The nftables API is the successor to the iptables API and is designed to provide better performance and scalability than iptables. 
The `nftables` proxy mode is able to process changes to service endpoints faster and more efficiently than the `iptables` mode, and is also able to more efficiently process packets in the kernel (though this only
becomes noticeable in clusters with tens of thousands of services).
-->
nftables API 是 iptables API 的繼任者，旨在提供比 iptables 更好的性能和可擴展性。
`nftables` 代理模式能夠比 `iptables` 模式更快、更高效地處理服務端點的變化，並且在內核中也能更高效地處理資料包（儘管這只有在擁有數萬個服務的叢集中才會顯著）。

<!--
As of Kubernetes v1.31, the `nftables` mode is still relatively new, and may not be compatible with all network plugins; consult the documentation for your network plugin. 
This proxy mode is only available on Linux nodes, and requires kernel 5.13 or later.
Before migrating, note that some features, especially around NodePort services, are not implemented exactly the same in nftables mode as they are in iptables mode. 
Check the [migration guide](/docs/reference/networking/virtual-ips/#migrating-from-iptables-mode-to-nftables) to see if you need to override the default configuration.
-->
截至 Kubernetes v1.31，nftables 模式仍相對較新，可能與某些網路插件不兼容；請查閱您的網路插件文檔。
此代理模式僅在 Linux 節點上可用，並且需要內核 5.13 或更高版本。
在遷移之前，請注意某些功能，特別是與 NodePort 服務相關的功能，在 nftables 模式下的實現方式與 iptables 模式不完全相同。
查看[遷移指南](/zh-cn/docs/reference/networking/virtual-ips/#migrating-from-iptables-mode-to-nftables)以瞭解是否需要覆蓋預設設定。

<!--
This work was done as part of [KEP #3866](https://github.com/kubernetes/enhancements/issues/3866) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
這項工作是作爲 [KEP #3866](https://github.com/kubernetes/enhancements/issues/3866) 的一部分由
[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 完成的。

<!--
### Changes to reclaim policy for PersistentVolumes
-->
### PersistentVolumes 回收策略的變更

<!--
The Always Honor PersistentVolume Reclaim Policy feature has advanced to beta in Kubernetes v1.31. 
This enhancement ensures that the PersistentVolume (PV) reclaim policy is respected even after the associated PersistentVolumeClaim (PVC) is deleted, thereby preventing the leakage of volumes.
-->
始終遵循 PersistentVolume 回收策略這一特性在 Kubernetes v1.31 中晉級爲 Beta 版。
這項增強確保即使在所關聯的 PersistentVolumeClaim (PVC) 被刪除後，PersistentVolume (PV) 回收策略也會被遵循，從而防止卷的泄漏。

<!--
Prior to this feature, the reclaim policy linked to a PV could be disregarded under specific conditions, depending on whether the PV or PVC was deleted first. 
Consequently, the corresponding storage resource in the external infrastructure might not be removed, even if the reclaim policy was set to "Delete". 
This led to potential inconsistencies and resource leaks.
-->
在此特性之前，與 PV 相關聯的回收策略可能在特定條件下被忽視，這取決於 PV 或 PVC 是否先被刪除。
因此，即使回收策略設置爲 "Delete"，外部基礎設施中相應的儲存資源也可能不會被刪除。
這導致了潛在的不一致性和資源泄漏。

<!--
With the introduction of this feature, Kubernetes now guarantees that the "Delete" reclaim policy will be enforced, ensuring the deletion of the underlying storage object from the backend infrastructure, regardless of the deletion sequence of the PV and PVC.
-->
隨着這項功能的引入，Kubernetes 現在保證 "Delete" 回收策略將被執行，確保底層儲存對象從後端基礎設施中刪除，無論 PV 和 PVC 的刪除順序如何。

<!--
This work was done as a part of [KEP #2644](https://github.com/kubernetes/enhancements/issues/2644) and by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
這項工作是作爲 [KEP #2644](https://github.com/kubernetes/enhancements/issues/2644) 的一部分由
[SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 完成的。
    
<!--
### Bound service account token improvements
-->
### 綁定服務賬戶令牌的改進

<!--
The `ServiceAccountTokenNodeBinding` feature is promoted to beta in v1.31. 
This feature allows requesting a token bound only to a node, not to a pod, which includes node information in claims in the token and validates the existence of the node when the token is used. 
For more information, read the [bound service account tokens documentation](/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-tokens).
-->
`ServiceAccountTokenNodeBinding` 功能在 v1.31 中晉級爲 Beta 版。
此特性允許請求僅綁定到節點而不是 Pod 的令牌，在令牌中包含節點資訊的聲明，並在使用令牌時驗證節點的存在。
有關更多資訊，請閱讀[綁定服務賬戶令牌文檔](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/#bound-service-account-tokens)。

<!--
This work was done as part of [KEP #4193](https://github.com/kubernetes/enhancements/issues/4193) by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).
-->
這項工作是作爲 [KEP #4193](https://github.com/kubernetes/enhancements/issues/4193) 的一部分由
[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth) 完成的。


<!--
### Multiple Service CIDRs
-->
### 多個 Service CIDR

<!--
Support for clusters with multiple Service CIDRs moves to beta in v1.31 (disabled by default).
-->
支持具有多個服務 CIDR 的叢集在 v1.31 中晉級爲 Beta 版(預設禁用)。

<!--
There are multiple components in a Kubernetes cluster that consume IP addresses: Nodes, Pods and Services. 
Nodes and Pods IP ranges can be dynamically changed because depend on the infrastructure or the network plugin respectively. 
However, Services IP ranges are defined during the cluster creation as a hardcoded flag in the kube-apiserver. 
IP exhaustion has been a problem for long lived or large clusters, as admins needed to expand, shrink or even replace entirely the assigned Service CIDR range. 
These operations were never supported natively and were performed via complex and delicate maintenance operations, often causing downtime on their clusters. This new feature allows users and cluster admins to dynamically modify Service CIDR ranges with zero downtime.
-->
Kubernetes 叢集中有多個組件消耗 IP 地址: Node、Pod 和 Service。
Node 和 Pod 的 IP 範圍可以動態更改，因爲它們分別取決於基礎設施或網路插件。
然而，Service IP 範圍是在叢集創建期間作爲 kube-apiserver 中的硬編碼標誌定義的。
IP 耗盡一直是長期存在或大型叢集的問題，因爲管理員需要擴展、縮小甚至完全替換分配的服務 CIDR 範圍。
這些操作從未得到原生支持，並且是通過複雜和精細的維護操作執行的，經常導致叢集無法正常服務。
這個新特性允許使用者和叢集管理員以零中斷時間動態修改服務 CIDR 範圍。

<!--
For more details about this feature please visit the
[Virtual IPs and Service Proxies](/docs/reference/networking/virtual-ips/#ip-address-objects) documentation page.
-->
有關此特性的更多詳細資訊，請訪問[虛擬 IP 和服務代理](/zh-cn/docs/reference/networking/virtual-ips/#ip-address-objects)文檔頁面。

<!--
This work was done as part of [KEP #1880](https://github.com/kubernetes/enhancements/issues/1880) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
這項工作是作爲 [KEP #1880](https://github.com/kubernetes/enhancements/issues/1880) 的一部分由
[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 完成的。


<!--
### Traffic distribution for Services
-->
### Service 的流量分配

<!--
Traffic distribution for Services moves to beta in v1.31 and is enabled by default. 
-->
Service 的流量分配在 v1.31 中晉級爲 Beta 版，並預設啓用。

<!--
After several iterations on finding the best user experience and traffic engineering capabilities for Services networking, SIG Networking implemented the `trafficDistribution` field in the Service specification, which serves as a guideline for the underlying implementation to consider while making routing decisions.
-->
爲實現 Service 聯網的最佳使用者體驗和流量工程能力，經過多次迭代後，SIG Networking 在服務規約中實現了
`trafficDistribution` 字段，作爲底層實現在做出路由決策時考慮的指導原則。

<!--
For more details about this feature please read the
[1.30 Release Blog](/blog/2024/04/17/kubernetes-v1-30-release/#traffic-distribution-for-services-sig-network-https-github-com-kubernetes-community-tree-master-sig-network)
or visit the [Service](/docs/concepts/services-networking/service/#traffic-distribution) documentation page.
-->
有關此特性的更多詳細資訊，請閱讀 [1.30 發佈博客](/blog/2024/04/17/kubernetes-v1-30-release/#traffic-distribution-for-services-sig-network-https-github-com-kubernetes-community-tree-master-sig-network) 或訪問 [Service](/zh-cn/docs/concepts/services-networking/service/#traffic-distribution) 文檔頁面。

<!--
This work was done as part of [KEP #4444](https://github.com/kubernetes/enhancements/issues/4444) by [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
這項工作是作爲 [KEP #4444](https://github.com/kubernetes/enhancements/issues/4444) 的一部分由
[SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 完成的。


<!--
### Kubernetes VolumeAttributesClass ModifyVolume
-->
### Kubernetes VolumeAttributesClass ModifyVolume

<!--
[VolumeAttributesClass](/docs/concepts/storage/volume-attributes-classes/) API is moving to beta in v1.31.
The VolumeAttributesClass provides a generic,
Kubernetes-native API for modifying dynamically volume parameters like provisioned IO.
This allows workloads to vertically scale their volumes on-line to balance cost and performance, if supported by their provider.
This feature had been alpha since Kubernetes 1.29.
-->
[VolumeAttributesClass](/zh-cn/docs/concepts/storage/volume-attributes-classes/) API 在 v1.31 中晉級爲 Beta 版。
VolumeAttributesClass 提供了一個通用的、Kubernetes 原生的 API，用於修改動態卷參數，如所提供的 IO 能力。
這允許工作負載在線垂直擴展其卷，以平衡成本和性能（如果提供商支持）。
該功能自 Kubernetes 1.29 以來一直處於 Alpha 狀態。

<!--
This work was done as a part of [KEP #3751](https://github.com/kubernetes/enhancements/issues/3751) and lead by [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
這項工作是作爲 [KEP #3751](https://github.com/kubernetes/enhancements/issues/3751) 的一部分完成的，由 [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 領導。


<!--
## New features in Alpha
-->
## Alpha 版的新功能

<!--
_This is a selection of some of the improvements that are now alpha following the v1.31 release._
-->
_以下是 v1.31 發佈後晉級爲 Alpha 版的部分改進。_
    
<!--
### New DRA APIs for better accelerators and other hardware management
-->
### 用於更好管理加速器和其他硬件的新 DRA API

<!--
Kubernetes v1.31 brings an updated dynamic resource allocation (DRA) API and design. 
The main focus in the update is on structured parameters because they make resource information and requests transparent to Kubernetes and clients and enable implementing features like cluster autoscaling. 
DRA support in the kubelet was updated such that version skew between kubelet and the control plane is possible. With structured parameters, the scheduler allocates ResourceClaims while scheduling a pod. 
Allocation by a DRA driver controller is still supported through what is now called "classic DRA".
-->
Kubernetes v1.31 帶來了更新的動態資源分配（DRA）API 和設計。
此次更新的主要焦點是結構化參數，因爲它們使資源資訊和請求對 Kubernetes 和客戶端透明，並能夠實現叢集自動擴縮容等功能。
kubelet 中的 DRA 支持已更新，使得 kubelet 和控制平面之間的版本偏差成爲可能。通過結構化參數，調度器在調度 Pod 時分配 ResourceClaims。
通過現在稱爲"經典 DRA"的方式，仍然支持由 DRA 驅動程式控制器進行分配。

<!--
With Kubernetes v1.31, classic DRA has a separate feature gate named `DRAControlPlaneController`, which you need to enable explicitly. 
With such a control plane controller, a DRA driver can implement allocation policies that are not supported yet through structured parameters.
-->
從 Kubernetes v1.31 開始,經典 DRA 有一個單獨的特性門控名爲 `DRAControlPlaneController`，您需要顯式啓用它。
通過這樣的控制平面控制器，DRA 驅動程式可以實現尚未通過結構化參數支持的分配策略。

<!--
This work was done as part of [KEP #3063](https://github.com/kubernetes/enhancements/issues/3063) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
-->
這項工作是作爲 [KEP #3063](https://github.com/kubernetes/enhancements/issues/3063) 的一部分由
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 完成的。
    
<!--
### Support for image volumes
-->
### 對映像檔卷的支持

<!--
The Kubernetes community is moving towards fulfilling more Artificial Intelligence (AI) and Machine Learning (ML) use cases in the future. 
-->
Kubernetes 社區正在朝着在未來滿足更多人工智能(AI)和機器學習(ML)用例的方向發展。

<!--
One of the requirements to fulfill these use cases is to support Open Container Initiative (OCI) compatible images and artifacts (referred as OCI objects) directly as a native volume source. 
This allows users to focus on OCI standards as well as enables them to store and distribute any content using OCI registries.
-->
滿足這些用例的要求之一是直接將開放容器倡議(OCI)兼容的映像檔和工件(稱爲 OCI 對象)作爲原生卷源支持。
這允許使用者專注於 OCI 標準，並使他們能夠使用 OCI 註冊表儲存和分發任何內容。

<!--
Given that, v1.31 adds a new alpha feature to allow using an OCI image as a volume in a Pod.
This feature allows users to specify an image reference as volume in a pod while reusing it as volume
mount within containers. You need to enable the `ImageVolume` feature gate to try this out.
-->
鑑於此，v1.31 添加了一個新的 Alpha 特性，允許在 Pod 中使用 OCI 映像檔作爲卷。
此特性允許使用者在 pod 中指定映像檔引用作爲卷，同時在容器內重用它作爲卷掛載。您需要啓用 `ImageVolume` 特性門控才能嘗試此特性。

<!--
This work was done as part of [KEP #4639](https://github.com/kubernetes/enhancements/issues/4639) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) and [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage).
-->
這項工作是作爲 [KEP #4639](https://github.com/kubernetes/enhancements/issues/4639) 的一部分由 [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 和 [SIG Storage](https://github.com/kubernetes/community/tree/master/sig-storage) 完成的。

<!--
### Exposing device health information through Pod status
-->
### 通過 Pod 狀態暴露設備健康資訊

<!--
Expose device health information through the Pod Status is added as a new alpha feature in v1.31, disabled by default.
-->
通過 Pod 狀態暴露設備健康資訊作爲新的 Alpha 特性添加到 v1.31 中，預設被禁用。

<!--
Before Kubernetes v1.31, the way to know whether or not a Pod is associated with the failed device is to use the [PodResources API](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources). 
-->
在 Kubernetes v1.31 之前，瞭解 Pod 是否與故障設備關聯的方法是使用 [PodResources API](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)。

<!--
By enabling this feature, the field `allocatedResourcesStatus` will be added to each container status, within the `.status` for each Pod. The `allocatedResourcesStatus` field reports health information for each device assigned to the container.
-->
通過啓用此特性，字段 `allocatedResourcesStatus` 將添加到每個容器狀態中，在每個 Pod 的 `.status` 內。
`allocatedResourcesStatus` 字段報告分配給容器的各個設備的健康資訊。

<!--
This work was done as part of [KEP #4680](https://github.com/kubernetes/enhancements/issues/4680) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
-->
這項工作是作爲 [KEP #4680](https://github.com/kubernetes/enhancements/issues/4680) 的一部分由
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 完成的。


<!--
### Finer-grained authorization based on selectors
-->
### 基於選擇算符的細粒度鑑權

<!--
This feature allows webhook authorizers and future (but not currently designed) in-tree authorizers to
allow **list** and **watch** requests, provided those requests use label and/or field selectors.
For example, it is now possible for an authorizer to express: this user cannot list all pods, but can list all pods where `.spec.nodeName` matches some specific value. Or to allow a user to watch all Secrets in a namespace
that are _not_ labelled as `confidential: true`.
Combined with CRD field selectors (also moving to beta in v1.31), it is possible to write more secure
per-node extensions.
-->
此特性允許 Webhook 鑑權組件和未來（但目前尚未設計）的樹內鑑權組件允許 **list** 和 **watch** 請求，
前提是這些請求使用標籤和/或字段選擇算符。
例如，現在鑑權組件可以表達：此使用者不能列出所有 Pod，但可以列舉所有 `.spec.nodeName` 匹配某個特定值的 Pod。
或者允許使用者監視命名空間中所有**未**標記爲 `confidential: true` 的 Secret。
結合 CRD 字段選擇器（在 v1.31 中也晉級爲 Beta 版），可以編寫更安全的節點級別擴展。
    
<!--
This work was done as part of [KEP #4601](https://github.com/kubernetes/enhancements/issues/4601) by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).
-->
這項工作是作爲 [KEP #4601](https://github.com/kubernetes/enhancements/issues/4601) 的一部分由
[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth) 完成的。
    

<!--
### Restrictions on anonymous API access
-->
### 對匿名 API 訪問的限制

<!--
By enabling the feature gate `AnonymousAuthConfigurableEndpoints` users can now use the authentication configuration file to configure the endpoints that can be accessed by anonymous requests. 
This allows users to protect themselves against RBAC misconfigurations that can give anonymous users broad access to the cluster.
-->
通過啓用特性門控 `AnonymousAuthConfigurableEndpoints`，使用者現在可以使用身份認證設定檔案來設定可以通過匿名請求訪問的端點。
這允許使用者保護自己免受 RBAC 錯誤設定的影響；錯誤的設定可能會給匿名使用者提供對叢集的更多訪問權限。
    
<!--
This work was done as a part of [KEP #4633](https://github.com/kubernetes/enhancements/issues/4633) and by [SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth).
-->
這項工作是作爲 [KEP #4633](https://github.com/kubernetes/enhancements/issues/4633) 的一部分由
[SIG Auth](https://github.com/kubernetes/community/tree/master/sig-auth) 完成的。


<!--
## Graduations, deprecations, and removals in 1.31
-->
## 1.31 中的晉級、棄用和移除

<!--
### Graduations to Stable
-->
### 晉級爲穩定版

<!--
This lists all the features that graduated to stable (also known as _general availability_). For a full list of updates including new features and graduations from alpha to beta, see the release notes.
-->
以下列出了所有晉級爲穩定版（也稱爲 _正式可用_ ）的功能。有關包括新功能和從 Alpha 晉級到 Beta 的完整列表，請參閱發行說明。

<!--
This release includes a total of 11 enhancements promoted to Stable:
-->
此版本包括總共 11 項晉級爲穩定版的增強:

<!--
* [PersistentVolume last phase transition time](https://github.com/kubernetes/enhancements/issues/3762)
* [Metric cardinality enforcement](https://github.com/kubernetes/enhancements/issues/2305)
* [Kube-proxy improved ingress connectivity reliability](https://github.com/kubernetes/enhancements/issues/3836)
* [Add CDI devices to device plugin API](https://github.com/kubernetes/enhancements/issues/4009)
* [Move cgroup v1 support into maintenance mode](https://github.com/kubernetes/enhancements/issues/4569)
* [AppArmor support](https://github.com/kubernetes/enhancements/issues/24)
* [PodHealthyPolicy for PodDisruptionBudget](https://github.com/kubernetes/enhancements/issues/3017)
* [Retriable and non-retriable Pod failures for Jobs](https://github.com/kubernetes/enhancements/issues/3329)
* [Elastic Indexed Jobs](https://github.com/kubernetes/enhancements/issues/3715)
* [Allow StatefulSet to control start replica ordinal numbering](https://github.com/kubernetes/enhancements/issues/3335)
* [Random Pod selection on ReplicaSet downscaling](https://github.com/kubernetes/enhancements/issues/2185)
-->
* [PersistentVolume 最後階段轉換時間](https://github.com/kubernetes/enhancements/issues/3762)
* [Metric 基數強制執行](https://github.com/kubernetes/enhancements/issues/2305)
* [Kube-proxy 改進的入站連接可靠性](https://github.com/kubernetes/enhancements/issues/3836)
* [將 CDI 設備添加到設備插件 API](https://github.com/kubernetes/enhancements/issues/4009)
* [將 cgroup v1 支持移入維護模式](https://github.com/kubernetes/enhancements/issues/4569)
* [AppArmor 支持](https://github.com/kubernetes/enhancements/issues/24)
* [PodDisruptionBudget 的 PodHealthyPolicy](https://github.com/kubernetes/enhancements/issues/3017)
* [Job 的可重試和不可重試 Pod 失敗](https://github.com/kubernetes/enhancements/issues/3329)
* [彈性的帶索引的 Job](https://github.com/kubernetes/enhancements/issues/3715)
* [允許 StatefulSet 控制起始副本序號編號](https://github.com/kubernetes/enhancements/issues/3335)
* [ReplicaSet 縮小時隨機選擇 Pod](https://github.com/kubernetes/enhancements/issues/2185)
    
<!--
### Deprecations and Removals 
-->
### 棄用和移除

<!--
As Kubernetes develops and matures, features may be deprecated, removed, or replaced with better ones for the project's overall health. 
See the Kubernetes [deprecation and removal policy](/docs/reference/using-api/deprecation-policy/) for more details on this process.
-->
隨着 Kubernetes 的發展和成熟，某些特性可能會被棄用、移除或替換爲更好的特性，以確保項目的整體健康。
有關此過程的更多詳細資訊，請參閱 Kubernetes [棄用和移除策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
    
<!--
#### Cgroup v1 enters the maintenance mode
-->
#### Cgroup v1 進入維護模式

<!--
As Kubernetes continues to evolve and adapt to the changing landscape of container orchestration, the community has decided to move cgroup v1 support into maintenance mode in v1.31.
This shift aligns with the broader industry's move towards [cgroup v2](/docs/concepts/architecture/cgroups/), offering improved functionality, scalability, and a more consistent interface. 
Kubernetes maintance mode means that no new features will be added to cgroup v1 support. 
Critical security fixes will still be provided, however, bug-fixing is now best-effort, meaning major bugs may be fixed if feasible, but some issues might remain unresolved.
-->
隨着 Kubernetes 繼續發展並適應容器編排不斷變化的格局，社區決定在 v1.31 中將 cgroup v1 支持移入維護模式。
這一轉變與行業中普遍向 [cgroup v2](/zh-cn/docs/concepts/architecture/cgroups/) 遷移的趨勢一致，
提供了改進的功能、可擴展性和更一致的介面。
Kubernetes 維護模式意味着不會向 cgroup v1 支持添加新功能。
社區仍將提供關鍵的安全修復，但是，錯誤修復現在是盡力而爲。
這意味着如果可行，可能會修復重大錯誤，但某些問題可能保持未解決狀態。

<!--
It is recommended that you start switching to use cgroup v2 as soon as possible. 
This transition depends on your architecture, including ensuring the underlying operating systems and container runtimes support cgroup v2 and testing workloads to verify that workloads and applications function correctly with cgroup v2.
-->
建議您儘快開始切換到使用 cgroup v2。
這種轉變取決於您的架構，包括確保底層操作系統和容器運行時支持 cgroup v2，以及測試工作負載以驗證工作負載和應用程式在 cgroup v2 下是否正常運行。

<!--
Please report any problems you encounter by filing an [issue](https://github.com/kubernetes/kubernetes/issues/new/choose).
-->
如果遇到任何問題,請通過提交 [issue](https://github.com/kubernetes/kubernetes/issues/new/choose) 進行報告。

<!--
This work was done as part of [KEP #4569](https://github.com/kubernetes/enhancements/issues/4569) by [SIG Node](https://github.com/kubernetes/community/tree/master/sig-node).
-->
這項工作是作爲 [KEP #4569](https://github.com/kubernetes/enhancements/issues/4569) 的一部分由
[SIG Node](https://github.com/kubernetes/community/tree/master/sig-node) 完成的。

<!--
#### A note about SHA-1 signature support
-->
#### 關於 SHA-1 簽名支持的說明

<!--
In [go1.18](https://go.dev/doc/go1.18#sha1) (released in March 2022), the crypto/x509 library started to reject certificates signed with a SHA-1 hash function. 
While SHA-1 is established to be unsafe and publicly trusted Certificate Authorities have not issued SHA-1 certificates since 2015, there might still be cases in the context of Kubernetes where user-provided certificates are signed using a SHA-1 hash function through private authorities with them being used for Aggregated API Servers or webhooks. 
If you have relied on SHA-1 based certificates, you must explicitly opt back into its support by setting `GODEBUG=x509sha1=1` in your environment.
-->
在 [go1.18](https://go.dev/doc/go1.18#sha1)（2022 年 3 月發佈）中，crypto/x509 庫開始拒絕使用 SHA-1 哈希函數簽名的證書。
雖然 SHA-1 已被確定爲不安全，並且公共信任的證書頒發機構自 2015 年以來就不再頒發 SHA-1 證書，
但在 Kubernetes 語境中可能仍然存在使用者提供的證書通過私有機構使用 SHA-1 哈希函數簽名的情況，
這些證書用於聚合 API 伺服器或 Webhook。
如果您依賴基於 SHA-1 的證書，必須通過在環境變量中設置 `GODEBUG=x509sha1=1` 來明確選擇重新啓用其支持。

<!--
Given Go's [compatibility policy for GODEBUGs](https://go.dev/blog/compat), the `x509sha1` GODEBUG and the support for SHA-1 certificates will [fully go away in go1.24](https://tip.golang.org/doc/go1.23) which will be released in the first half of 2025. 
If you rely on SHA-1 certificates, please start moving off them.
-->
鑑於 Go 的 [GODEBUG 兼容性策略](https://go.dev/blog/compat)，`x509sha1` GODEBUG 和對 SHA-1
證書的支持[將在 go1.24 中完全消失](https://tip.golang.org/doc/go1.23)，
而 go1.24 將在 2025 年上半年發佈。
如果您依賴 SHA-1 證書,請開始遷移離開它們。

<!--
Please see [Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689) to get a better idea of timelines around the support for SHA-1 going away, when Kubernetes releases plans to adopt go1.24, and for more details on how to detect usage of SHA-1 certificates via metrics and audit logging. 
-->
請查看 [Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689)
以瞭解有關 SHA-1 支持消失的時間線、Kubernetes 發佈計劃何時採用 go1.24，
以及如何通過指標和審計日誌檢測 SHA-1 證書使用情況的更多詳細資訊。

<!--
#### Deprecation of `status.nodeInfo.kubeProxyVersion` field for Nodes ([KEP 4004](https://github.com/kubernetes/enhancements/issues/4004))
-->
#### 棄用 Node 節點的 `status.nodeInfo.kubeProxyVersion` 字段 ([KEP 4004](https://github.com/kubernetes/enhancements/issues/4004))

<!--
The `.status.nodeInfo.kubeProxyVersion` field of Nodes has been deprecated in Kubernetes v1.31,
and will be removed in a later release.
It's being deprecated because the value of this field wasn't (and isn't) accurate.
This field is set by the kubelet, which does not have reliable information about the kube-proxy version or whether kube-proxy is running. 
-->
節點的 `.status.nodeInfo.kubeProxyVersion` 字段在 Kubernetes v1.31 中已被棄用,
並將在以後的版本中刪除。
它被棄用是因爲這個字段的值不準確（現在也不準確）。
這個字段是由 kubelet 設置的，而 kubelet 沒有關於 kube-proxy 版本或 kube-proxy 是否正在運行的可靠資訊。

<!--
The `DisableNodeKubeProxyVersion` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) will be set to `true` in by default in v1.31 and the kubelet will no longer attempt to set the `.status.kubeProxyVersion` field for its associated Node.
-->
`DisableNodeKubeProxyVersion` [特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)將在 v1.31
中預設設置爲 `true`，kubelet 將不再嘗試爲其關聯的節點設置 `.status.kubeProxyVersion` 字段。

<!--
#### Removal of all in-tree integrations with cloud providers
-->
#### 移除所有樹內雲提供商集成

<!--
As highlighted in a [previous article](/blog/2024/05/20/completing-cloud-provider-migration/), the last remaining in-tree support for cloud provider integration has been removed as part of the v1.31 release.
This doesn't mean you can't integrate with a cloud provider, however you now **must** use the
recommended approach using an external integration. Some integrations are part of the Kubernetes
project and others are third party software.
-->
正如之前的文章中強調的那樣，作爲 v1.31 發佈的一部分，最後剩餘的樹內雲平臺集成支持已被移除。
這並不意味着您不能與雲平臺集成，但是您現在**必須**使用推薦的方法使用外部集成。一些集成是 Kubernetes 項目的一部分，而其他則是第三方軟體。

<!--
This milestone marks the completion of the externalization process for all cloud providers' integrations from the Kubernetes core ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)), a process started with Kubernetes v1.26. 
This change helps Kubernetes to get closer to being a truly vendor-neutral platform.
-->
這一里程碑標誌着所有云提供商集成從 Kubernetes 核心外部化過程的完成（[KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)），這個過程始於 Kubernetes v1.26。
這一變化有助於 Kubernetes 更接近成爲一個真正供應商中立的平臺。

<!--
For further details on the cloud provider integrations, read our [v1.29 Cloud Provider Integrations feature blog](/blog/2023/12/14/cloud-provider-integration-changes/). 
For additional context about the in-tree code removal, we invite you to check the ([v1.29 deprecation blog](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)).
-->
有關雲提供商集成的更多詳細資訊，請閱讀我們的 [v1.29 雲提供商集成功能博客](/blog/2023/12/14/cloud-provider-integration-changes/)。
有關樹內代碼移除的額外背景，我們邀請您查看（[v1.29 棄用博客](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395)）。

<!--
The latter blog also contains useful information for users who need to migrate to version v1.29 and later.
-->
後者的博客還包含了需要遷移到 v1.29 及更高版本的使用者的有用資訊。

<!--
#### Removal of in-tree provider feature gates
-->
#### 移除樹內供應商特性門控

<!--
In Kubernetes v1.31, the following alpha feature gates `InTreePluginAWSUnregister`, `InTreePluginAzureDiskUnregister`, `InTreePluginAzureFileUnregister`, `InTreePluginGCEUnregister`, `InTreePluginOpenStackUnregister`, and `InTreePluginvSphereUnregister` have been removed. These feature gates were introduced to facilitate the testing of scenarios where in-tree volume plugins were removed from the codebase, without actually removing them. Since Kubernetes 1.30 had deprecated these in-tree volume plugins, these feature gates were redundant and no longer served a purpose. The only CSI migration gate still standing is `InTreePluginPortworxUnregister`, which will remain in alpha until the CSI migration for Portworx is completed and its in-tree volume plugin will be ready for removal.
-->
在 Kubernetes v1.31 中，以下 Alpha 特性門控 `InTreePluginAWSUnregister`、`InTreePluginAzureDiskUnregister`、
`InTreePluginAzureFileUnregister`、`InTreePluginGCEUnregister`、`InTreePluginOpenStackUnregister`
和 `InTreePluginvSphereUnregister` 已被移除。
這些特性門控的引入是爲了便於測試從代碼庫中移除樹內卷插件的場景，而無需實際移除它們。
由於 Kubernetes 1.30 已棄用這些樹內卷插件，這些特性門控變得多餘，不再有用。
唯一仍然存在的 CSI 遷移門控是 `InTreePluginPortworxUnregister`，它將保持 Alpha 狀態，
直到 Portworx 的 CSI 遷移完成，其樹內卷插件準備好被移除。


<!--
#### Removal of kubelet `--keep-terminated-pod-volumes` command line flag
-->
#### 移除 kubelet 的 `--keep-terminated-pod-volumes` 命令列標誌

<!--
The kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, has been removed as
part of the v1.31 release.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).
-->
作爲 v1.31 版本的一部分，已移除 kubelet 標誌 `--keep-terminated-pod-volumes`。該標誌於 2017 年被棄用。

您可以在拉取請求 [#122082](https://github.com/kubernetes/kubernetes/pull/122082) 中找到更多詳細資訊。

<!--
#### Removal of CephFS volume plugin 

[CephFS volume plugin](/docs/concepts/storage/volumes/#cephfs) was removed in this release and the `cephfs` volume type became non-functional. 

It is recommended that you use the [CephFS CSI driver](https://github.com/ceph/ceph-csi/) as a third-party storage driver instead. If you were using the CephFS volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

CephFS volume plugin was formally marked as deprecated in v1.28.
-->
#### 移除 CephFS 卷插件

本次發佈中移除了 [CephFS 卷插件](/zh-cn/docs/concepts/storage/volumes/#cephfs)，`cephfs` 卷類型變爲不可用。

建議您改用 [CephFS CSI 驅動](https://github.com/ceph/ceph-csi/) 作爲第三方儲存驅動程式。
如果您在將叢集版本升級到 v1.31 之前使用了 CephFS 卷插件，則必須重新部署應用程式以使用新的驅動程式。

CephFS 卷插件在 v1.28 中正式標記爲廢棄。

<!--
#### Removal of Ceph RBD volume plugin

The v1.31 release removes the [Ceph RBD volume plugin](/docs/concepts/storage/volumes/#rbd) and its CSI migration support, making the `rbd` volume type non-functional.

It's recommended that you use the [RBD CSI driver](https://github.com/ceph/ceph-csi/) in your clusters instead. 
If you were using Ceph RBD volume plugin before upgrading the cluster version to v1.31, you must re-deploy your application to use the new driver.

The Ceph RBD volume plugin was formally marked as deprecated in v1.28.
-->
#### 移除 Ceph RBD 卷插件

v1.31 版本移除了 [Ceph RBD volume plugin](/zh-cn/docs/concepts/storage/volumes/#rbd) 及其 CSI 遷移支持，使 `rbd` 卷類型變爲不可用。

建議您在叢集中改用 [RBD CSI driver](https://github.com/ceph/ceph-csi/)。
如果您在將叢集版本升級到 v1.31 之前使用了 Ceph RBD 卷插件，則必須重新部署應用程式以使用新的驅動程式。

Ceph RBD 卷插件在 v1.28 中正式標記爲廢棄。

<!--
#### Deprecation of non-CSI volume limit plugins in kube-scheduler
-->
#### 廢棄 kube-scheduler 中的非 CSI 卷限制插件

<!--
The v1.31 release will deprecate all non-CSI volume limit scheduler plugins, and will remove some
already deprected plugins from the [default plugins](/docs/reference/scheduling/config/), including:

- `AzureDiskLimits`
- `CinderLimits`
- `EBSLimits`
- `GCEPDLimits`
-->
v1.31 版本將廢棄所有非 CSI 卷限制調度器插件，並將從[預設插件](/zh-cn/docs/reference/scheduling/config/)中移除一些已廢棄的插件，包括：

- `AzureDiskLimits`
- `CinderLimits`
- `EBSLimits`
- `GCEPDLimits`


<!--
It's recommended that you use the `NodeVolumeLimits` plugin instead because it can handle the same functionality as the removed plugins since those volume types have been migrated to CSI. 
Please replace the deprecated plugins with the `NodeVolumeLimits` plugin if you explicitly use them in the [scheduler config](/docs/reference/scheduling/config/). 
The `AzureDiskLimits`, `CinderLimits`, `EBSLimits`, and `GCEPDLimits` plugins will be removed in a future release.
-->
建議您改用 `NodeVolumeLimits` 插件，因爲自從這些卷類型遷移到 CSI 後，該插件可以處理與已移除插件相同的功能。
如果您在調度器設定中明確使用了已廢棄的插件，請將它們替換爲 `NodeVolumeLimits` 插件。
`AzureDiskLimits`、`CinderLimits`、`EBSLimits` 和 `GCEPDLimits` 插件將在未來的版本中被移除。

<!--
These plugins will be removed from the default scheduler plugins list as they have been deprecated since Kubernetes v1.14.
-->
這些插件自 Kubernetes v1.14 以來已被廢棄，將從預設調度器插件列表中移除。

<!--
### Release notes and upgrade actions required

Check out the full details of the Kubernetes v1.31 release in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md).
-->
### 發佈說明和所需的升級操作

請在我們的[發佈說明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)中查看 Kubernetes v1.31 版本的完整詳細資訊。

<!--
#### Scheduler now uses QueueingHint when `SchedulerQueueingHints` is enabled
Added support to the scheduler to start using a QueueingHint registered for Pod/Updated events,
to determine whether updates to  previously unschedulable Pods have made them schedulable.
The new support is active when the feature gate `SchedulerQueueingHints` is enabled.

Previously, when unschedulable Pods were updated, the scheduler always put Pods back to into a queue
(`activeQ` / `backoffQ`). However not all updates to Pods make Pods schedulable, especially considering
many scheduling constraints nowadays are immutable. Under the new behaviour, once unschedulable Pods
are updated, the scheduling queue checks with QueueingHint(s) whether the update may make the
pod(s) schedulable, and requeues them to `activeQ` or `backoffQ` only when at least one
QueueingHint returns `Queue`.
-->
#### 啓用 `SchedulerQueueingHints` 時，調度器現在使用 QueueingHint

社區爲調度器添加了支持，以便在啓用 `SchedulerQueueingHints` 功能門控時，開始使用爲 Pod/Updated
事件註冊的 QueueingHint，以確定對先前不可調度的 Pod 的更新是否使其變得可調度。
以前，當不可調度的 Pod 被更新時，調度器總是將 Pod 放回隊列（`activeQ` / `backoffQ`）。
然而，並非所有對 Pod 的更新都會使 Pod 變得可調度，特別是考慮到現在許多調度約束是不可變更的。
在新的行爲下，一旦不可調度的 Pod 被更新，調度隊列會通過 QueueingHint 檢查該更新是否可能使 Pod 變得可調度，
並且只有當至少一個 QueueingHint 返回 Queue 時，纔將它們重新排隊到 `activeQ` 或 `backoffQ`。

<!--
**Action required for custom scheduler plugin developers**: 
Plugins have to implement a QueueingHint for Pod/Update event if the rejection from them could be resolved by updating unscheduled Pods themselves. Example: suppose you develop a custom plugin that denies Pods that have a `schedulable=false` label. Given Pods with a `schedulable=false` label will be schedulable if the `schedulable=false` label is removed, this plugin would implement QueueingHint for Pod/Update event that returns Queue when such label changes are made in unscheduled Pods. You can find more details in the pull request [#122234](https://github.com/kubernetes/kubernetes/pull/122234).
-->
**自定義調度器插件開發者需要採取的操作**：
如果插件的拒絕可以通過更新未調度的 Pod 本身來解決，那麼插件必須爲 Pod/Update 事件實現 QueueingHint。
例如：假設您開發了一個自定義插件，該插件拒絕具有 `schedulable=false` 標籤的 Pod。
鑑於帶有 `schedulable=false` 標籤的 Pod 在移除該標籤後將變得可調度，這個插件將爲 Pod/Update
事件實現 QueueingHint，當在未調度的 Pod 中進行此類標籤更改時返回 Queue。
您可以在 pull request [#122234](https://github.com/kubernetes/kubernetes/pull/122234) 中找到更多詳細資訊。

<!--
#### Removal of kubelet --keep-terminated-pod-volumes command line flag
The kubelet flag `--keep-terminated-pod-volumes`, which was deprecated in 2017, was removed as part of the v1.31 release.

You can find more details in the pull request [#122082](https://github.com/kubernetes/kubernetes/pull/122082).
-->
#### 移除 kubelet --keep-terminated-pod-volumes 命令列標誌

作爲 v1.31 版本的一部分，已移除 kubelet 標誌 `--keep-terminated-pod-volumes`。該標誌於 2017 年被棄用。
您可以在拉取請求 [#122082](https://github.com/kubernetes/kubernetes/pull/122082) 中找到更多詳細資訊。

<!--
## Availability

Kubernetes v1.31 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.31.0) or on the [Kubernetes download page](/releases/download/). 

To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local Kubernetes clusters using [minikube](https://minikube.sigs.k8s.io/). You can also easily install v1.31 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/). 
-->
## 可用性

Kubernetes v1.31 可在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.31.0) 或 [Kubernetes 下載頁面](/releases/download/)上下載。

要開始使用 Kubernetes，請查看這些[交互式教程](/zh-cn/docs/tutorials/)或使用 [minikube](https://minikube.sigs.k8s.io/)
運行本地 Kubernetes 叢集。您還可以使用 [kubeadm](/zh-cn/docs/setup/independent/create-cluster-kubeadm/) 輕鬆安裝 v1.31。

<!--
## Release team

Kubernetes is only possible with the support, commitment, and hard work of its community. 
Each release team is made up of dedicated community volunteers who work together to build the many pieces that make up the Kubernetes releases you rely on. 
This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md) for the hours spent hard at work to deliver the Kubernetes v1.31 release to our community. 
The Release Team's membership ranges from first-time shadows to returning team leads with experience forged over several release cycles. 
A very special thanks goes out our release lead, Angelos Kolaitis, for supporting us through a successful release cycle, advocating for us, making sure that we could all contribute in the best way possible, and challenging us to improve the release process.
-->
## 發佈團隊

Kubernetes 的實現離不開社區的支持、投入和辛勤工作。
每個發佈團隊由致力於構建 Kubernetes 發佈版本各個部分的專門社區志願者組成。
這需要來自我們社區各個角落的人員的專業技能，從代碼本身到文檔和項目管理。

我們要感謝整個[發佈團隊](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.31/release-team.md)爲向我們的社區交付 Kubernetes v1.31 版本所付出的時間和努力。
發佈團隊的成員從首次參與的影子成員到經歷多個發佈週期的迴歸團隊負責人不等。
特別感謝我們的發佈負責人 Angelos Kolaitis，他支持我們完成了一個成功的發佈週期，爲我們發聲，確保我們都能以最佳方式貢獻，並挑戰我們改進發布過程。


<!--
## Project velocity
-->
## 項目速度

<!--
The CNCF K8s DevStats project aggregates a number of interesting data points related to the velocity of Kubernetes and various sub-projects. This includes everything from individual contributions to the number of companies that are contributing and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.
-->
CNCF K8s DevStats 項目彙總了許多與 Kubernetes 及各個子項目速度相關的有趣資料點。
這包括從個人貢獻到貢獻公司數量的所有內容，展示了進化這個生態系統所投入的深度和廣度。

<!--
In the v1.31 release cycle, which ran for 14 weeks (May 7th to August 13th), we saw contributions to Kubernetes from 113 different companies and 528 individuals.
-->
在爲期 14 周的 v1.31 發佈週期（5 月 7 日至 8 月 13 日）中，我們看到來自 113 家不同公司和 528 個個人對 Kubernetes 的貢獻。

<!--
In the whole Cloud Native ecosystem we have 379 companies counting 2268 total contributors - which means that respect to the previous release cycle we experienced an astounding 63% increase on individuals contributing! 
-->
在整個雲原生生態系統中，我們有 379 家公司，共計 2268 名貢獻者 - 這意味着相比上一個發佈週期，個人貢獻者數量驚人地增加了 63%！

<!--
Source for this data: 
- [Companies contributing to Kubernetes](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [Overall ecosystem contributions](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)
-->
資料來源：
- [爲 Kubernetes 貢獻的公司](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=Kubernetes&var-repo_name=kubernetes%2Fkubernetes)
- [整體生態系統貢獻](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&from=1715032800000&to=1723586399000&var-period=d28&var-repogroup_name=All&var-repo_name=kubernetes%2Fkubernetes)

<!--
By contribution we mean when someone makes a commit, code review, comment, creates an issue or PR, reviews a PR (including blogs and documentation) or comments on issues and PRs.
-->
貢獻指的是當某人進行提交、代碼審查、評論、創建問題或 PR、審查 PR（包括博客和文檔）或對問題和 PR 進行評論。

<!--
If you are interested in contributing visit [this page](https://www.kubernetes.dev/docs/guide/#getting-started) to get started. 
-->
如果您有興趣貢獻，請訪問[此頁面](https://www.kubernetes.dev/docs/guide/#getting-started)開始。

<!--
[Check out DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) to learn more about the overall velocity of the Kubernetes project and community.
-->
[查看 DevStats](https://k8s.devstats.cncf.io/d/11/companies-contributing-in-repository-groups?orgId=1&var-period=m&var-repogroup_name=All) 以瞭解更多關於 Kubernetes 項目和社區整體速度的資訊。

<!--
## Event update

Explore the upcoming Kubernetes and cloud-native events from August to November 2024, featuring KubeCon, KCD, and other notable conferences worldwide. Stay informed and engage with the Kubernetes community.
-->
## 活動更新

探索 2024 年 8 月至 11 月即將舉行的 Kubernetes 和雲原生活動，包括 KubeCon、KCD 和其他全球知名會議。保持瞭解並參與 Kubernetes 社區。

<!--
**August 2024**
- [**KubeCon + CloudNativeCon + Open Source Summit China 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-open-source-summit-ai-dev-china/): August 21-23, 2024 | Hong Kong
- [**KubeDay Japan**](https://events.linuxfoundation.org/kubeday-japan/): August 27, 2024 | Tokyo, Japan
-->
**2024 年 8 月**
- [**KubeCon + CloudNativeCon + 開源峯會中國 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-open-source-summit-ai-dev-china/)：2024 年 8 月 21-23 日 | 中國香港
- [**KubeDay Japan**](https://events.linuxfoundation.org/kubeday-japan/)：2024 年 8 月 27 日 | 東京，日本


<!--
**September 2024**
- [**KCD Lahore - Pakistan 2024**](https://community.cncf.io/events/details/cncf-kcd-lahore-presents-kcd-lahore-pakistan-2024/): September 1, 2024 | Lahore, Pakistan
- [**KuberTENes Birthday Bash Stockholm**](https://community.cncf.io/events/details/cncf-stockholm-presents-kubertenes-birthday-bash-stockholm-a-couple-of-months-late/): September 5, 2024 | Stockholm, Sweden
- [**KCD Sydney ’24**](https://community.cncf.io/events/details/cncf-kcd-australia-presents-kcd-sydney-24/): September 5-6, 2024 | Sydney, Australia
- [**KCD Washington DC 2024**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2024/): September 24, 2024 | Washington, DC, United States
- [**KCD Porto 2024**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2024/): September 27-28, 2024 | Porto, Portugal
-->
**2024 年 9 月**
- [**KCD 拉合爾 - 巴基斯坦 2024**](https://community.cncf.io/events/details/cncf-kcd-lahore-presents-kcd-lahore-pakistan-2024/): 2024 年 9 月 1 日 | 拉合爾，巴基斯坦
- [**KuberTENes 生日慶典 斯德哥爾摩**](https://community.cncf.io/events/details/cncf-stockholm-presents-kubertenes-birthday-bash-stockholm-a-couple-of-months-late/): 2024 年 9 月 5 日 | 斯德哥爾摩，瑞典
- [**KCD Sydney ’24**](https://community.cncf.io/events/details/cncf-kcd-australia-presents-kcd-sydney-24/): 2024 年 9 月 5-6 日 | 悉尼，澳大利亞
- [**KCD Washington DC 2024**](https://community.cncf.io/events/details/cncf-kcd-washington-dc-presents-kcd-washington-dc-2024/): 2024 年 9 月 24 日 | 華盛頓特區，美國
- [**KCD Porto 2024**](https://community.cncf.io/events/details/cncf-kcd-porto-presents-kcd-porto-2024/): 2024 年 9 月 27-28 日 | 波爾圖，葡萄牙

<!--
**October 2024**
- [**KCD Austria 2024**](https://community.cncf.io/events/details/cncf-kcd-austria-presents-kcd-austria-2024/): October 8-10, 2024 | Wien, Austria 
- [**KubeDay Australia**](https://events.linuxfoundation.org/kubeday-australia/): October 15, 2024 | Melbourne, Australia
- [**KCD UK - London 2024**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-london-2024/): October 22-23, 2024 | Greater London, United Kingdom
-->
**2024 年 10 月**
- [**KCD Austria 2024**](https://community.cncf.io/events/details/cncf-kcd-austria-presents-kcd-austria-2024/): 2024 年 10 月 8-10 日 | 維也納，奧地利
- [**KubeDay Australia**](https://events.linuxfoundation.org/kubeday-australia/): 2024 年 10 月 15 日 | 墨爾本，澳大利亞
- [**KCD UK - London 2024**](https://community.cncf.io/events/details/cncf-kcd-uk-presents-kubernetes-community-days-uk-london-2024/): 2024 年 10 月 22-23 日 | 倫敦，英國

<!--
**November 2024**
- [**KubeCon + CloudNativeCon North America 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): November 12-15, 2024 | Salt Lake City, United States
- [**Kubernetes on EDGE Day North America**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/co-located-events/kubernetes-on-edge-day/): November 12, 2024 | Salt Lake City, United States
-->
**2024 年 11 月**
- [**KubeCon + CloudNativeCon North America 2024**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/): 2024 年 11 月 12-15 日 | 鹽湖城，美國
- [**Kubernetes on EDGE Day North America**](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/co-located-events/kubernetes-on-edge-day/): 2024 年 11 月 12 日 | 鹽湖城，美國

<!--
## Upcoming release webinar

Join members of the Kubernetes v1.31 release team on Thursday, Thu Sep 12, 2024 10am PT to learn about the major features of this release, as well as deprecations and removals to help plan for upgrades. 
For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-131-release/) on the CNCF Online Programs site.
-->
## 即將舉行的發佈網路研討會

加入 Kubernetes v1.31 發佈團隊成員，於 2024 年 9 月 12 日星期四太平洋時間上午 10 點了解此版本的主要特性，以及廢棄和移除的內容，以幫助規劃升級。
有關更多資訊和註冊，請訪問 CNCF 在線項目網站上的[活動頁面](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-131-release/)。


<!--
## Get involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. 
Have something you’d like to broadcast to the Kubernetes community? 
Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. 
Thank you for your continued feedback and support.

- Follow us on X [@Kubernetesio](https://x.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
- Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
## 參與其中

參與 Kubernetes 的最簡單方式是加入與您興趣相符的衆多特殊興趣小組（[SIG](https://github.com/kubernetes/community/blob/master/sig-list.md)）之一。
您有什麼想向 Kubernetes 社區廣播的內容嗎？
在我們的每週[社區會議](https://github.com/kubernetes/community/tree/master/communication)上分享您的聲音，並通過以下渠道。
感謝您持續的反饋和支持。

- 在 X 上關注我們 [@Kubernetesio](https://x.com/kubernetesio) 獲取最新更新
- 在 [Discuss](https://discuss.kubernetes.io/) 上加入社區討論
- 在 [Slack](http://slack.k8s.io/) 上加入社區
- 在 [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes) 上發佈問題（或回答問題）
- 分享您的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
- 在[博客](https://kubernetes.io/blog/)上閱讀更多關於 Kubernetes 的最新動態
- 瞭解更多關於 [Kubernetes 發佈團隊](https://github.com/kubernetes/sig-release/tree/master/release-team)的資訊
