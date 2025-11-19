---
layout: blog
title: "Kubernetes 1.24: 觀星者"
date: 2022-05-03
slug: kubernetes-1-24-release-announcement
---

<!--
layout: blog
title: "Kubernetes 1.24: Stargazer"
date: 2022-05-03
slug: kubernetes-1-24-release-announcement
-->

<!--
**Authors**: [Kubernetes 1.24 Release Team](https://git.k8s.io/sig-release/releases/release-1.24/release-team.md)

We are excited to announce the release of Kubernetes 1.24, the first release of 2022!

This release consists of 46 enhancements: fourteen enhancements have graduated to stable,
fifteen enhancements are moving to beta, and thirteen enhancements are entering alpha.
Also, two features have been deprecated, and two features have been removed.
-->
**作者**: [Kubernetes 1.24 發佈團隊](https://git.k8s.io/sig-release/releases/release-1.24/release-team.md)

我們很高興地宣佈 Kubernetes 1.24 的發佈，這是 2022 年的第一個版本！

這個版本包括 46 個增強功能：14 個增強功能已經升級到穩定版，15 個增強功能正在進入 Beta 版，
13 個增強功能正在進入 Alpha 階段。另外，有兩個功能被廢棄了，還有兩個功能被刪除了。

<!--
## Major Themes

### Dockershim Removed from kubelet

After its deprecation in v1.20, the dockershim component has been removed from the kubelet in Kubernetes v1.24.
From v1.24 onwards, you will need to either use one of the other [supported runtimes](/docs/setup/production-environment/container-runtimes/) (such as containerd or CRI-O)
or use cri-dockerd if you are relying on Docker Engine as your container runtime.
For more information about ensuring your cluster is ready for this removal, please
see [this guide](/blog/2022/03/31/ready-for-dockershim-removal/).
-->
## 主要議題

### 從 kubelet 中刪除 Dockershim

在 v1.20 版本中被廢棄後，dockershim 組件已被從 Kubernetes v1.24 版本的 kubelet 中移除。
從 v1.24 開始，如果你依賴 Docker Engine 作爲容器運行時，
則需要使用其他[受支持的運行時](/zh-cn/docs/setup/production-environment/container-runtimes/)之一
（如 containerd 或 CRI-O）或使用 CRI dockerd。
有關確保集羣已準備好進行此刪除的更多信息，請參閱[本指南](/zh-cn/blog/2022/03/31/ready-for-dockershim-removal/)。

<!--
### Beta APIs Off by Default

[New beta APIs will not be enabled in clusters by default](https://github.com/kubernetes/enhancements/issues/3136).
Existing beta APIs and new versions of existing beta APIs will continue to be enabled by default.
-->
### 默認情況下關閉 Beta API

[新的 beta API 默認不會在集羣中啓用](https://github.com/kubernetes/enhancements/issues/3136)。
默認情況下，現有 Beta API 和及其更新版本將繼續被啓用。

<!--
### Signing Release Artifacts

Release artifacts are [signed](https://github.com/kubernetes/enhancements/issues/3031) using [cosign](https://github.com/sigstore/cosign)
signatures,
and there is experimental support for [verifying image signatures](/docs/tasks/administer-cluster/verify-signed-images/).
Signing and verification of release artifacts is part of [increasing software supply chain security for the Kubernetes release process](https://github.com/kubernetes/enhancements/issues/3027).
-->
### 簽署發佈工件

發佈工件使用 [cosign](https://github.com/sigstore/cosign) 簽名進行[簽名](https://github.com/kubernetes/enhancements/issues/3031)，
並且有[驗證圖像簽名](/zh-cn/docs/tasks/administer-cluster/verify-signed-images/)的實驗性支持。
發佈工件的簽名和驗證是[提高 Kubernetes 發佈過程的軟件供應鏈安全性](https://github.com/kubernetes/enhancements/issues/3027)
的一部分。

<!--
### OpenAPI v3

Kubernetes 1.24 offers beta support for publishing its APIs in the [OpenAPI v3 format](https://github.com/kubernetes/enhancements/issues/2896).
-->
### OpenAPI v3

Kubernetes 1.24 提供了以 [OpenAPI v3 格式](https://github.com/kubernetes/enhancements/issues/2896)發佈其 API 的 Beta 支持。

<!--
### Storage Capacity and Volume Expansion Are Generally Available

[Storage capacity tracking](https://github.com/kubernetes/enhancements/issues/1472)
supports exposing currently available storage capacity via [CSIStorageCapacity objects](/docs/concepts/storage/storage-capacity/#api)
and enhances scheduling of pods that use CSI volumes with late binding.

[Volume expansion](https://github.com/kubernetes/enhancements/issues/284) adds support 
for resizing existing persistent volumes. 
-->
### 存儲容量和卷擴展普遍可用

[存儲容量跟蹤](https://github.com/kubernetes/enhancements/issues/1472)支持通過
[CSIStorageCapacity 對象](/zh-cn/docs/concepts/storage/storage-capacity/#api)公開當前可用的存儲容量，
並增強使用具有後期綁定的 CSI 卷的 Pod 的調度。

[卷的擴展](https://github.com/kubernetes/enhancements/issues/284)增加了對調整現有持久性卷大小的支持。

<!--
### NonPreemptingPriority to Stable

This feature adds [a new option to PriorityClasses](https://github.com/kubernetes/enhancements/issues/902),
which can enable or disable pod preemption.
-->
### NonPreemptingPriority 到穩定

此功能[爲 PriorityClasses 添加了一個新選項](https://github.com/kubernetes/enhancements/issues/902)，可以啓用或禁用 Pod 搶佔。

<!--
### Storage Plugin Migration

Work is underway to [migrate the internals of in-tree storage plugins](https://github.com/kubernetes/enhancements/issues/625) to call out to CSI Plugins
while maintaining the original API.
The [Azure Disk](https://github.com/kubernetes/enhancements/issues/1490)
and [OpenStack Cinder](https://github.com/kubernetes/enhancements/issues/1489) plugins
have both been migrated.
-->
### 存儲插件遷移

目前正在進行[遷移樹內存儲插件的內部組件](https://github.com/kubernetes/enhancements/issues/625)工作，
以便在保持原有 API 的同時調用 CSI 插件。[Azure Disk](https://github.com/kubernetes/enhancements/issues/1490)
和 [OpenStack Cinder](https://github.com/kubernetes/enhancements/issues/1489) 插件都已遷移。

<!--
### gRPC Probes Graduate to Beta

With Kubernetes 1.24, the [gRPC probes functionality](https://github.com/kubernetes/enhancements/issues/2727)
has entered beta and is available by default. You can now [configure startup, liveness, and readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) for your gRPC app
natively within Kubernetes without exposing an HTTP endpoint or
using an extra executable.
-->
### gRPC 探針升級到 Beta

在 Kubernetes 1.24 中，[gRPC 探測功能](https://github.com/kubernetes/enhancements/issues/2727)
已進入測試版，默認可用。現在，你可以在 Kubernetes 中爲你的 gRPC
應用程序原生地[配置啓動、存活和就緒性探測](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes)，
而無需暴露 HTTP 端點或使用額外的可執行文件。

<!--
### Kubelet Credential Provider Graduates to Beta

Originally released as Alpha in Kubernetes 1.20, the kubelet's support for
[image credential providers](/docs/tasks/kubelet-credential-provider/kubelet-credential-provider/)
has now graduated to Beta.
This allows the kubelet to dynamically retrieve credentials for a container image registry
using exec plugins rather than storing credentials on the node's filesystem.
-->
### Kubelet 憑證提供者畢業至 Beta

kubelet 最初在 Kubernetes 1.20 中作爲 Alpha 發佈，現在它對[鏡像憑證提供者](/zh-cn/docs/tasks/kubelet-credential-provider/kubelet-credential-provider/)
的支持已升級到 Beta。這允許 kubelet 使用 exec 插件動態檢索容器鏡像倉庫的憑據，而不是將憑據存儲在節點的文件系統上。

<!--
### Contextual Logging in Alpha

Kubernetes 1.24 has introduced [contextual logging](https://github.com/kubernetes/enhancements/issues/3077)
that enables the caller of a function to control all aspects of logging (output formatting, verbosity, additional values, and names).
-->
### Alpha 中的上下文日誌記錄

Kubernetes 1.24 引入了[上下文日誌](https://github.com/kubernetes/enhancements/issues/3077)
這使函數的調用者能夠控制日誌記錄的所有方面（輸出格式、詳細程度、附加值和名稱）。

<!--
### Avoiding Collisions in IP allocation to Services

Kubernetes 1.24 introduces a new opt-in feature that allows you to
[soft-reserve a range for static IP address assignments](/docs/concepts/services-networking/service/#service-ip-static-sub-range)
to Services.
With the manual enablement of this feature, the cluster will prefer automatic assignment from
the pool of  Service IP addresses, thereby reducing the risk of collision.
-->
### 避免 IP 分配給服務的衝突

Kubernetes 1.24 引入了一項新的選擇加入功能，
允許你[爲服務的靜態 IP 地址分配軟保留範圍](/zh-cn/docs/concepts/services-networking/service/#service-ip-static-sub-range)。
通過手動啓用此功能，集羣將更喜歡從服務 IP 地址池中自動分配，從而降低衝突風險。

<!--
A Service `ClusterIP` can be assigned:

* dynamically, which means the cluster will automatically pick a free IP within the configured Service IP range.
* statically, which means the user will set one IP within the configured Service IP range.

Service `ClusterIP` are unique; hence, trying to create a Service with a `ClusterIP` that has already been allocated will return an error.
-->
服務的 `ClusterIP` 可以按照以下兩種方式分配：

* 動態，這意味着集羣將自動在配置的服務 IP 範圍內選擇一個空閒 IP。
* 靜態，這意味着用戶將在配置的服務 IP 範圍內設置一個 IP。

服務 `ClusterIP` 是唯一的；因此，嘗試使用已分配的 `ClusterIP` 創建服務將返回錯誤。

<!--
### Dynamic Kubelet Configuration is Removed from the Kubelet

After being deprecated in Kubernetes 1.22, Dynamic Kubelet Configuration has been removed from the kubelet. The feature will be removed from the API server in Kubernetes 1.26.
-->
### 從 Kubelet 中移除動態 Kubelet 配置

在 Kubernetes 1.22 中被棄用後，動態 Kubelet 配置已從 kubelet 中移除。
該功能將從 Kubernetes 1.26 的 API 服務器中移除。

<!--
## CNI Version-Related Breaking Change

Before you upgrade to Kubernetes 1.24, please verify that you are using/upgrading to a container
runtime that has been tested to work correctly with this release.

For example, the following container runtimes are being prepared, or have already been prepared, for Kubernetes:

* containerd v1.6.4 and later, v1.5.11 and later
* CRI-O 1.24 and later
-->
## CNI 版本相關的重大更改

在升級到 Kubernetes 1.24 之前，請確認你正在使用/升級到經過測試可以在此版本中正常工作的容器運行時。

例如，以下容器運行時正在爲 Kubernetes 準備，或者已經準備好了。

* containerd v1.6.4 及更高版本，v1.5.11 及更高版本
* CRI-O 1.24 及更高版本

<!--
Service issues exist for pod CNI network setup and tear down in containerd
v1.6.0–v1.6.3 when the CNI plugins have not been upgraded and/or the CNI config
version is not declared in the CNI config files. The containerd team reports, "these issues are resolved in containerd v1.6.4."

With containerd v1.6.0–v1.6.3, if you do not upgrade the CNI plugins and/or
declare the CNI config version, you might encounter the following "Incompatible
CNI versions" or "Failed to destroy network for sandbox" error conditions.
-->
當 CNI 插件尚未升級和/或 CNI 配置版本未在 CNI 配置文件中聲明時，在 containerd v1.6.0–v1.6.3
中存在 Pod CNI 網絡設置和拆除的服務問題。containerd 團隊報告說，“這些問題在 containerd v1.6.4 中得到解決。”

在 containerd v1.6.0-v1.6.3 版本中，如果你不升級 CNI 插件和/或聲明 CNI 配置版本，
你可能會遇到以下 “Incompatible CNI versions” 或 “Failed to destroy network for sandbox” 的錯誤情況。

<!--
## CSI Snapshot

_This information was added after initial publication._

[VolumeSnapshot v1beta1 CRD has been removed](https://github.com/kubernetes/enhancements/issues/177). 
Volume snapshot and restore functionality for Kubernetes and the Container Storage Interface (CSI), which provides standardized APIs design (CRDs) and adds PV snapshot/restore support for CSI volume drivers, moved to GA in v1.20. VolumeSnapshot v1beta1 was deprecated in v1.20 and is now unsupported. Refer to [KEP-177: CSI Snapshot](https://git.k8s.io/enhancements/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot) and [Volume Snapshot GA blog](/blog/2020/12/10/kubernetes-1.20-volume-snapshot-moves-to-ga/) for more information.
-->
## CSI 快照

**此信息是在首次發佈後添加的。**

[VolumeSnapshot v1beta1 CRD 已被移除](https://github.com/kubernetes/enhancements/issues/177)。
Kubernetes 和容器存儲接口 (CSI) 的卷快照和恢復功能，提供標準化的 API 設計 (CRD) 並添加了對 CSI 卷驅動程序的
PV 快照/恢復支持，在 v1.20 中升級至 GA。VolumeSnapshot v1beta1 在 v1.20 中被棄用，現在不受支持。
有關詳細信息，請參閱 [KEP-177: CSI 快照](https://git.k8s.io/enhancements/keps/sig-storage/177-volume-snapshot#kep-177-csi-snapshot)
和[卷快照 GA 博客](/blog/2020/12/10/kubernetes-1.20-volume-snapshot-moves-to-ga/)。

<!--
## Other Updates

### Graduations to Stable

This release saw fourteen enhancements promoted to stable:
-->
## 其他更新

### 畢業到穩定版

在此版本中，有 14 項增強功能升級爲穩定版：

<!--
* [Container Storage Interface (CSI) Volume Expansion](https://github.com/kubernetes/enhancements/issues/284)
* [Pod Overhead](https://github.com/kubernetes/enhancements/issues/688): Account for resources tied to the pod sandbox but not specific containers.
* [Add non-preempting option to PriorityClasses](https://github.com/kubernetes/enhancements/issues/902)
* [Storage Capacity Tracking](https://github.com/kubernetes/enhancements/issues/1472)
* [OpenStack Cinder In-Tree to CSI Driver Migration](https://github.com/kubernetes/enhancements/issues/1489)
* [Azure Disk In-Tree to CSI Driver Migration](https://github.com/kubernetes/enhancements/issues/1490)
* [Efficient Watch Resumption](https://github.com/kubernetes/enhancements/issues/1904): Watch can be efficiently resumed after kube-apiserver reboot.
* [Service Type=LoadBalancer Class Field](https://github.com/kubernetes/enhancements/issues/1959): Introduce a new Service annotation `service.kubernetes.io/load-balancer-class` that allows multiple implementations of `type: LoadBalancer` Services in the same cluster.
* [Indexed Job](https://github.com/kubernetes/enhancements/issues/2214): Add a completion index to Pods of Jobs with a fixed completion count.
* [Add Suspend Field to Jobs API](https://github.com/kubernetes/enhancements/issues/2232): Add a suspend field to the Jobs API to allow orchestrators to create jobs with more control over when pods are created.
* [Pod Affinity NamespaceSelector](https://github.com/kubernetes/enhancements/issues/2249): Add a `namespaceSelector` field for to pod affinity/anti-affinity spec.
* [Leader Migration for Controller Managers](https://github.com/kubernetes/enhancements/issues/2436): kube-controller-manager and cloud-controller-manager can apply new controller-to-controller-manager assignment in HA control plane without downtime.
* [CSR Duration](https://github.com/kubernetes/enhancements/issues/2784): Extend the CertificateSigningRequest API with a mechanism to allow clients to request a specific duration for the issued certificate.
-->
* [容器存儲接口（CSI）卷擴展](https://github.com/kubernetes/enhancements/issues/284)
* [Pod 開銷](https://github.com/kubernetes/enhancements/issues/688): 覈算與 Pod 沙箱綁定的資源，但不包括特定的容器。
* [向 PriorityClass 添加非搶佔選項](https://github.com/kubernetes/enhancements/issues/902)
* [存儲容量跟蹤](https://github.com/kubernetes/enhancements/issues/1472)
* [OpenStack Cinder In-Tree 到 CSI 驅動程序遷移](https://github.com/kubernetes/enhancements/issues/1489)
* [Azure 磁盤樹到 CSI 驅動程序遷移](https://github.com/kubernetes/enhancements/issues/1490)
* [高效的監視恢復](https://github.com/kubernetes/enhancements/issues/1904)：
  kube-apiserver 重新啓動後，可以高效地恢復監視。
* [Service Type=LoadBalancer 類字段](https://github.com/kubernetes/enhancements/issues/1959)：
  引入新的服務註解 `service.kubernetes.io/load-balancer-class`，
  允許在同一個集羣中提供 `type: LoadBalancer` 服務的多個實現。
* [帶索引的 Job](https://github.com/kubernetes/enhancements/issues/2214)：爲帶有固定完成計數的 Job 的 Pod 添加完成索引。
* [在 Job API 中增加 suspend 字段](https://github.com/kubernetes/enhancements/issues/2232)：
  在 Job API 中增加一個 suspend 字段，允許協調者在創建作業時對 Pod 的創建進行更多控制。
* [Pod 親和性 NamespaceSelector](https://github.com/kubernetes/enhancements/issues/2249)：
  爲 Pod 親和性/反親和性規約添加一個 `namespaceSelector` 字段。
* [控制器管理器的領導者遷移](https://github.com/kubernetes/enhancements/issues/2436)：
  kube-controller-manager 和 cloud-controller-manager 可以在 HA 控制平面中重新分配新的控制器到控制器管理器，而無需停機。
* [CSR 期限](https://github.com/kubernetes/enhancements/issues/2784)：
  用一種機制來擴展證書籤名請求 API，允許客戶爲簽發的證書請求一個特定的期限。

<!--
### Major Changes

This release saw two major changes:

* [Dockershim Removal](https://github.com/kubernetes/enhancements/issues/2221)
* [Beta APIs are off by Default](https://github.com/kubernetes/enhancements/issues/3136)
-->
### 主要變更

此版本有兩個主要變更：

* [移除 Dockershim](https://github.com/kubernetes/enhancements/issues/2221)
* [默認關閉 Beta API](https://github.com/kubernetes/enhancements/issues/3136)

<!--
### Release Notes

Check out the full details of the Kubernetes 1.24 release in our [release notes](https://git.k8s.io/kubernetes/CHANGELOG/CHANGELOG-1.24.md).
-->
### 發行說明

在我們的[發行說明](https://git.k8s.io/kubernetes/CHANGELOG/CHANGELOG-1.24.md) 中查看 Kubernetes 1.24 版本的完整詳細信息。

<!--
### Availability

Kubernetes 1.24 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.24.0).
To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local
Kubernetes clusters using containers as “nodes”, with [kind](https://kind.sigs.k8s.io/).
You can also easily install 1.24 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).
-->
### 可用性

Kubernetes 1.24 可在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.24.0) 上下載。
要開始使用 Kubernetes，請查看這些[交互式教程](/zh-cn/docs/tutorials/)或在本地運行。
使用 [kind](https://kind.sigs.k8s.io/)，可以將容器作爲 Kubernetes 集羣的 “節點”。
你還可以使用 [kubeadm](/zh-cn/docs/setup/independent/create-cluster-kubeadm/) 輕鬆安裝 1.24。

<!--
### Release Team

This release would not have been possible without the combined efforts of committed individuals
comprising the Kubernetes 1.24 release team. This team came together to deliver all of the components
that go into each Kubernetes release, including code, documentation, release notes, and more.

Special thanks to James Laverack, our release lead, for guiding us through a successful release cycle,
and to all of the release team members for the time and effort they put in to deliver the v1.24
release for the Kubernetes community.
-->
### 發佈團隊

如果沒有 Kubernetes 1.24 發佈團隊每個人做出的共同努力，這個版本是不可能實現的。
該團隊齊心協力交付每個 Kubernetes 版本中的所有組件，包括代碼、文檔、發行說明等。

特別感謝我們的發佈負責人 James Laverack 指導我們完成了一個成功的發佈週期，
並感謝所有發佈團隊成員投入時間和精力爲 Kubernetes 社區提供 v1.24 版本。

<!--
### Release Theme and Logo

**Kubernetes 1.24: Stargazer**

{{< figure src="/images/blog/2022-05-03-kubernetes-release-1.24/kubernetes-1.24.png" alt="" class="release-logo" >}}

The theme for Kubernetes 1.24 is _Stargazer_.
-->
### 發佈主題和徽標

**Kubernetes 1.24: 觀星者**

{{< figure src="/images/blog/2022-05-03-kubernetes-release-1.24/kubernetes-1.24.png" alt="" class="release-logo" >}}

Kubernetes 1.24 的主題是**觀星者（Stargazer）**。

<!--
Generations of people have looked to the stars in awe and wonder, from ancient astronomers to the
scientists who built the James Webb Space Telescope. The stars have inspired us, set our imagination
alight, and guided us through long nights on difficult seas.

With this release we gaze upwards, to what is possible when our community comes together. Kubernetes
is the work of hundreds of contributors across the globe and thousands of end-users supporting
applications that serve millions. Every one is a star in our sky, helping us chart our course.
-->
古代天文學家到建造 James Webb 太空望遠鏡的科學家，幾代人都懷着敬畏和驚奇的心情仰望星空。
是這些星辰啓發了我們，點燃了我們的想象力，引導我們在艱難的海上度過了漫長的夜晚。

通過此版本，我們向上凝視，當我們的社區聚集在一起時可能發生的事情。
Kubernetes 是全球數百名貢獻者和數千名最終用戶支持的成果，
是一款爲數百萬人服務的應用程序。每個人都是我們天空中的一顆星星，幫助我們規劃路線。
<!--
The release logo is made by [Britnee Laverack](https://www.instagram.com/artsyfie/), and depicts a telescope set upon starry skies and the
[Pleiades](https://en.wikipedia.org/wiki/Pleiades), often known in mythology as the “Seven Sisters”. The number seven is especially auspicious
for the Kubernetes project, and is a reference back to our original “Project Seven” name.

This release of Kubernetes is named for those that would look towards the night sky and wonder — for
all the stargazers out there. ✨
-->
發佈標誌由 [Britnee Laverack](https://www.instagram.com/artsyfie/) 製作，
描繪了一架位於星空和[昴星團](https://en.wikipedia.org/wiki/Pleiades)的望遠鏡，在神話中通常被稱爲“七姐妹”。
數字 7 對於 Kubernetes 項目特別吉祥，是對我們最初的“項目七”名稱的引用。

這個版本的 Kubernetes 爲那些仰望夜空的人命名——爲所有的觀星者命名。 ✨

<!--
### User Highlights

* Check out how leading retail e-commerce company [La Redoute used Kubernetes, alongside other CNCF projects, to transform and streamline its software delivery lifecycle](https://www.cncf.io/case-studies/la-redoute/) - from development to operations.
* Trying to ensure no change to an API call would cause any breaks, [Salt Security built its microservices entirely on Kubernetes, and it communicates via gRPC while Linkerd ensures messages are encrypted](https://www.cncf.io/case-studies/salt-security/).
* In their effort to migrate from private to public cloud, [Allainz Direct engineers redesigned its CI/CD pipeline in just three months while managing to condense 200 workflows down to 10-15](https://www.cncf.io/case-studies/allianz/).
* Check out how [Bink, a UK based fintech company, updated its in-house Kubernetes distribution with Linkerd to build a cloud-agnostic platform that scales as needed whilst allowing them to keep a close eye on performance and stability](https://www.cncf.io/case-studies/bink/).
* Using Kubernetes, the Dutch organization [Stichting Open Nederland](http://www.stichtingopennederland.nl/) created a testing portal in just one-and-a-half months to help safely reopen events in the Netherlands. The [Testing for Entry (Testen voor Toegang)](https://www.testenvoortoegang.org/) platform [leveraged the performance and scalability of Kubernetes to help individuals book over 400,000 COVID-19 testing appointments per day. ](https://www.cncf.io/case-studies/true/)
* Working alongside SparkFabrik and utilizing Backstage, [Santagostino created the developer platform Samaritan to centralize services and documentation, manage the entire lifecycle of services, and simplify the work of Santagostino developers](https://www.cncf.io/case-studies/santagostino/).
-->
### 用戶亮點

* 瞭解領先的零售電子商務公司
  [La Redoute 如何使用 Kubernetes 以及其他 CNCF 項目來轉變和簡化](https://www.cncf.io/case-studies/la-redoute/)
  其從開發到運營的軟件交付生命週期。
* 爲了確保對 API 調用的更改不會導致任何中斷，[Salt Security 完全在 Kubernetes 上構建了它的微服務，
  它通過 gRPC 進行通信，而 Linkerd 確保消息是加密的](https://www.cncf.io/case-studies/salt-security/)。
* 爲了從私有云遷移到公共雲，[Alllainz Direct 工程師在短短三個月內重新設計了其 CI/CD 管道，
  同時設法將 200 個工作流壓縮到 10-15 個](https://www.cncf.io/case-studies/allianz/)。
* 看看[英國金融科技公司 Bink 是如何用 Linkerd 更新其內部的 Kubernetes 分佈，以建立一個雲端的平臺，
  根據需要進行擴展，同時允許他們密切關注性能和穩定性](https://www.cncf.io/case-studies/bink/)。
* 利用Kubernetes，荷蘭組織 [Stichting Open Nederland](http://www.stichtingopennederland.nl/)
  在短短一個半月內創建了一個測試門戶網站，以幫助安全地重新開放荷蘭的活動。
  [入門測試 (Testen voor Toegang)](https://www.testenvoortoegang.org/)
  平臺[利用 Kubernetes 的性能和可擴展性來幫助個人每天預訂超過 400,000 個 COVID-19 測試預約](https://www.cncf.io/case-studies/true/)。
* 與 SparkFabrik 合作並利用 Backstage，[Santagostino 創建了開發人員平臺 Samaritan 來集中服務和文檔，
  管理服務的整個生命週期，並簡化 Santagostino 開發人員的工作](https://www.cncf.io/case-studies/santagostino/)。

<!--
### Ecosystem Updates

* KubeCon + CloudNativeCon Europe 2022 will take place in Valencia, Spain, from 16 – 20 May 2022! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/).
* In the [2021 Cloud Native Survey](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/), the CNCF saw record Kubernetes and container adoption. Take a look at the [results of the survey](https://www.cncf.io/reports/cncf-annual-survey-2021/).
* The [Linux Foundation](https://www.linuxfoundation.org/) and [The Cloud Native Computing Foundation](https://www.cncf.io/) (CNCF) announced the availability of a new [Cloud Native Developer Bootcamp](https://training.linuxfoundation.org/training/cloudnativedev-bootcamp/?utm_source=lftraining&utm_medium=pr&utm_campaign=clouddevbc0322) to provide participants with the knowledge and skills to design, build, and deploy cloud native applications. Check out the [announcement](https://www.cncf.io/announcements/2022/03/15/new-cloud-native-developer-bootcamp-provides-a-clear-path-to-cloud-native-careers/) to learn more.
-->
### 生態系統更新

* KubeCon + CloudNativeCon Europe 2022 於 2022 年 5 月 16 日至 20 日在西班牙巴倫西亞舉行！
  你可以在[活動網站](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/)上找到有關會議和註冊的更多信息。
* 在 [2021 年雲原生調查](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/)
  中，CNCF 看到了創紀錄的 Kubernetes 和容器採用。參閱[調查結果](https://www.cncf.io/reports/cncf-annual-survey-2021/)。
* [Linux 基金會](https://www.linuxfoundation.org/)和[雲原生計算基金會](https://www.cncf.io/) (CNCF)
  宣佈推出新的 [雲原生開發者訓練營](https://training.linuxfoundation.org/training/cloudnativedev-bootcamp/?utm_source=lftraining&utm_medium=pr&utm_campaign=clouddevbc0322)
  爲參與者提供設計、構建和部署雲原生應用程序的知識和技能。查看[公告](https://www.cncf.io/announcements/2022/03/15/new-cloud-native-developer-bootcamp-provides-a-clear-path-to-cloud-native-careers/)以瞭解更多信息。

<!--
### Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project
aggregates a number of interesting data points related to the velocity of Kubernetes and various
sub-projects. This includes everything from individual contributions to the number of companies that
are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.24 release cycle, which [ran for 17 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.24) (January 10 to May 3), we saw contributions from [1029 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions) and [1179 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).
-->
### 項目速度

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) 項目
彙總了許多與 Kubernetes 和各種子項目的速度相關的有趣數據點。這包括從個人貢獻到做出貢獻的公司數量的所有內容，
並且說明了爲發展這個生態系統而付出的努力的深度和廣度。

在[運行 17 周](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.24)
（ 1 月 10 日至 5 月 3 日）的 v1.24 發佈週期中，我們看到 [1029 家公司](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions)
和 [1179 人](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.23.0%20-%20v1.24.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes) 的貢獻。

<!--
## Upcoming Release Webinar

Join members of the Kubernetes 1.24 release team on Tue May 24, 2022 9:45am – 11am PT to learn about
the major features of this release, as well as deprecations and removals to help plan for upgrades.
For more information and registration, visit the [event page](https://community.cncf.io/e/mck3kd/)
on the CNCF Online Programs site.
-->
## 即將發佈的網絡研討會

在太平洋時間 2022 年 5 月 24 日星期二上午 9:45 至上午 11 點加入 Kubernetes 1.24 發佈團隊的成員，
瞭解此版本的主要功能以及棄用和刪除，以幫助規劃升級。有關更多信息和註冊，
請訪問 CNCF 在線計劃網站上的[活動頁面](https://community.cncf.io/e/mck3kd/)。

<!--
## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://git.k8s.io/community/sig-list.md) (SIGs) that align with your interests. 
Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://git.k8s.io/community/communication), and through the channels below:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributors](https://www.kubernetes.dev/) website
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes).
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://git.k8s.io/sig-release/release-team)
-->
## 參與進來

參與 Kubernetes 的最簡單方法是加入符合你興趣的衆多[特別興趣組](https://git.k8s.io/community/sig-list.md)（SIG）之一。
你有什麼想向 Kubernetes 社區廣播的內容嗎？
在我們的每週的[社區會議](https://git.k8s.io/community/communication)上分享你的聲音，並通過以下渠道：

* 在 [Kubernetes Contributors](https://www.kubernetes.dev/) 網站上了解有關爲 Kubernetes 做出貢獻的更多信息
* 在 Twitter 上關注我們 [@Kubernetesio](https://twitter.com/kubernetesio) 以獲取最新更新
* 加入社區討論 [Discuss](https://discuss.kubernetes.io/)
* 加入 [Slack](http://slack.k8s.io/) 社區
* 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 上發佈問題（或回答問題）。
* 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 在[博客](/zh-cn/blog/)上閱讀有關 Kubernetes 正在發生的事情的更多信息
* 詳細瞭解 [Kubernetes 發佈團隊](https://git.k8s.io/sig-release/release-team)
