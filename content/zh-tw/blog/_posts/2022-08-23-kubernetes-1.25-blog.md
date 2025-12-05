---
layout: blog
title: "Kubernetes v1.25: Combiner"
date: 2022-08-23
slug: kubernetes-v1-25-release
---
<!--
layout: blog
title: "Kubernetes v1.25: Combiner"
date: 2022-08-23
slug: kubernetes-v1-25-release
-->

<!--
**Authors**: [Kubernetes 1.25 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.25/release-team.md)
-->
**作者**: [Kubernetes 1.25 發佈團隊](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.25/release-team.md)

<!--
Announcing the release of Kubernetes v1.25!
-->
宣佈 Kubernetes v1.25 的發版！

<!--
This release includes a total of 40 enhancements. Fifteen of those enhancements are entering Alpha, ten are graduating to Beta, and thirteen are graduating to Stable. We also have two features being deprecated or removed.
-->
這個版本總共包括 40 項增強功能。
其中 15 項增強功能進入 Alpha，10 項進入 Beta，13 項進入 Stable。
我們也廢棄/移除了兩個功能。

<!--
## Release theme and logo

**Kubernetes 1.25: Combiner**

{{< figure src="/images/blog/2022-08-23-kubernetes-1.25-release/kubernetes-1.25.png" alt="Combiner logo" class="release-logo" >}}

The theme for Kubernetes v1.25 is _Combiner_.

The Kubernetes project itself is made up of many, many individual components that, when combined, take the form of the project you see today. It is also built and maintained by many individuals, all of them with different skills, experiences, histories, and interests, who join forces not just as the release team but as the many SIGs that support the project and the community year-round.

With this release, we wish to honor the collaborative, open spirit that takes us from isolated developers, writers, and users spread around the globe to a combined force capable of changing the world. Kubernetes v1.25 includes a staggering 40 enhancements, none of which would exist without the incredible power we have when we work together.

Inspired by our release lead's son, Albert Song, Kubernetes v1.25 is named for each and every one of you, no matter how you choose to contribute your unique power to the combined force that becomes Kubernetes.
-->
## 版本主題和徽標
**Kubernetes 1.25: Combiner**

{{< figure src="/images/blog/2022-08-23-kubernetes-1.25-release/kubernetes-1.25.png" alt="Combiner logo" class="release-logo" >}}

Kubernetes v1.25 的主題是 **Combiner**，即組合器。

Kubernetes 項目本身是由特別多單獨的組件組成的，這些組件組合起來就形成了你今天看到的這個項目。
同時它也是由許多個人建立和維護的，這些人擁有不同的技能、經驗、歷史和興趣，
他們不僅作爲發佈團隊成員，而且作爲許多 SIG 成員，常年通力合作支持項目和社區。

通過這次發版，我們希望向協作和開源的精神致敬，
這種精神使我們從分散在世界各地的獨立開發者、作者和使用者變成了能夠改變世界的聯合力量。
Kubernetes v1.25 包含了驚人的 40 項增強功能，
如果沒有我們在一起工作時擁有的強大力量，這些增強功能都不會存在。

受我們的發佈負責人的兒子 Albert Song 的啓發，Kubernetes v1.25 是以你們每一個人命名的，
無論你們選擇如何作爲 Kubernetes 的聯合力量貢獻自己的獨有力量。

<!--
## What's New (Major Themes)

### PodSecurityPolicy is removed; Pod Security Admission graduates to Stable {#pod-security-changes}

PodSecurityPolicy was initially [deprecated in v1.21](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/), and with the release of v1.25, it has been removed. The updates required to improve its usability would have introduced breaking changes, so it became necessary to remove it in favor of a more friendly replacement. That replacement is [Pod Security Admission](/docs/concepts/security/pod-security-admission/), which graduates to Stable with this release. If you are currently relying on PodSecurityPolicy, please follow the instructions for [migration to Pod Security Admission](/docs/tasks/configure-pod-container/migrate-from-psp/).
-->
## 新增內容（主要主題）
### 移除 PodSecurityPolicy；Pod Security Admission 成長爲 Stable {#pod-security-changes}

PodSecurityPolicy 是在 [1.21 版本中被棄用](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)，到 1.25 版本被移除。
因爲提升其可用性的變更會帶來破壞性的變化，所以有必要將其刪除，以支持一個更友好的替代品。
這個替代品就是 [Pod Security Admission](/zh-cn/docs/concepts/security/pod-security-admission/)，它在這個版本里成長爲 Stable。
如果你最近依賴於 PodSecurityPolicy，請參考 [Pod Security Admission 遷移說明](/zh-cn/docs/tasks/configure-pod-container/migrate-from-psp/)。

<!--
### Ephemeral Containers Graduate to Stable

[Ephemeral Containers](/docs/concepts/workloads/pods/ephemeral-containers/) are containers that exist for only a limited time within an existing pod. This is particularly useful for troubleshooting when you need to examine another container but cannot use `kubectl exec` because that container has crashed or its image lacks debugging utilities. Ephemeral containers graduated to Beta in Kubernetes v1.23, and with this release, the feature graduates to Stable.
-->
### Ephemeral Containers 成長爲 Stable

[臨時容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)是在現有的 Pod 中存在有限時間的容器。
當你需要檢查另一個容器，但因爲該容器已經崩潰或其映像檔缺乏調試工具不能使用 `kubectl exec` 時，它對故障排除特別有用。
臨時容器在 Kubernetes v1.23 中成長爲 Beta，並在這個版本中，該功能成長爲 Stable。

<!--
### Support for cgroups v2 Graduates to Stable

It has been more than two years since the Linux kernel cgroups v2 API was declared stable. With some distributions now defaulting to this API, Kubernetes must support it to continue operating on those distributions. cgroups v2 offers several improvements over cgroups v1, for more information see the [cgroups v2](https://kubernetes.io/docs/concepts/architecture/cgroups/) documentation. While cgroups v1 will continue to be supported, this enhancement puts us in a position to be ready for its eventual deprecation and replacement.
-->
### 對 cgroups v2 的支持進入 Stable 階段

自 Linux 內核 cgroups v2 API 宣佈穩定以來，已經有兩年多的時間了。
隨着一些發行版現在預設使用該 API，Kubernetes 必須支持它以繼續在這些發行版上運行。
cgroups v2 比 cgroups v1 提供了一些改進，更多資訊參見 [cgroups v2](/zh-cn/docs/concepts/architecture/cgroups/) 文檔。
雖然 cgroups v1 將繼續受到支持，但這一改進使我們能夠爲其最終的廢棄和替代做好準備。


<!--
### Improved Windows support

- [Performance dashboards](http://perf-dash.k8s.io/#/?jobname=soak-tests-capz-windows-2019) added support for Windows
- [Unit tests](https://github.com/kubernetes/kubernetes/issues/51540) added support for Windows
- [Conformance tests](https://github.com/kubernetes/kubernetes/pull/108592) added support for Windows
- New GitHub repository created for [Windows Operational Readiness](https://github.com/kubernetes-sigs/windows-operational-readiness)
-->
### 改善對 Windows 系統的支持
- [性能儀表板](http://perf-dash.k8s.io/#/?jobname=soak-tests-capz-windows-2019)增加了對 Windows 系統的支持
- [單元測試](https://github.com/kubernetes/kubernetes/issues/51540)增加了對 Windows 系統的支持
- [一致性測試](https://github.com/kubernetes/kubernetes/pull/108592)增加了對 Windows 系統的支持
- 爲 [Windows Operational Readiness](https://github.com/kubernetes-sigs/windows-operational-readiness) 創建了新的 GitHub 倉庫

<!--
### Moved container registry service from k8s.gcr.io to registry.k8s.io

[Moving container registry from k8s.gcr.io to registry.k8s.io](https://github.com/kubernetes/kubernetes/pull/109938) got merged. For more details, see the [wiki page](https://github.com/kubernetes/k8s.io/wiki/New-Registry-url-for-Kubernetes-\(registry.k8s.io\)), [announcement](https://groups.google.com/a/kubernetes.io/g/dev/c/DYZYNQ_A6_c/m/oD9_Q8Q9AAAJ) was sent to the kubernetes development mailing list.
-->
### 將容器註冊服務從 k8s.gcr.io 遷移至 registry.k8s.io
[將容器註冊服務從 k8s.gcr.io 遷移至 registry.k8s.io](https://github.com/kubernetes/kubernetes/pull/109938) 的 PR 已經被合併。
更多細節參考 [wiki 頁面](https://github.com/kubernetes/k8s.io/wiki/New-Registry-url-for-Kubernetes-\(registry.k8s.io\))，
同時[公告](https://groups.google.com/a/kubernetes.io/g/dev/c/DYZYNQ_A6_c/m/oD9_Q8Q9AAAJ)已發送到 kubernetes 開發郵件列表。

<!--
### Promoted SeccompDefault to Beta

SeccompDefault promoted to beta, see the tutorial [Restrict a Container's Syscalls with seccomp](https://kubernetes.io/docs/tutorials/security/seccomp/#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads) for more details.
-->
### SeccompDefault 升級爲 Beta

SeccompDefault 升級爲 Beta，
更多細節參考教程[用 seccomp 限制一個容器的系統調用](/zh-cn/docs/tutorials/security/seccomp/#enable-the-use-of-runtimedefault-as-the-default-seccomp-profile-for-all-workloads)。

<!--
### Promoted endPort in Network Policy to Stable

Promoted `endPort` in [Network Policy](https://kubernetes.io/docs/concepts/services-networking/network-policies/#targeting-a-range-of-ports) to GA. Network Policy providers that support `endPort` field now can use it to specify a range of ports to apply a Network Policy. Previously, each Network Policy could only target a single port.

Please be aware that `endPort` field **must be supported** by the Network Policy provider. If your provider does not support `endPort`, and this field is specified in a Network Policy, the Network Policy will be created covering only the port field (single port).
-->
### 網路策略中 endPort 升級爲 Stable

[網路策略](/zh-cn/docs/concepts/services-networking/network-policies/#targeting-a-range-of-ports)中的 
`endPort` 已經迎來 GA 正式發佈。
支持 `endPort` 字段的網路策略提供程式現在可使用該字段來指定端口範圍，應用網路策略。
在之前的版本中，每個網路策略只能指向單一端口。

請注意，網路策略提供程式 **必須支持** `endPort` 字段。
如果提供程式不支持 `endPort`，又在網路策略中指定了此字段，
則會創建出僅覆蓋端口字段（單端口）的網路策略。

<!--
### Promoted Local Ephemeral Storage Capacity Isolation to Stable
The [Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/361-local-ephemeral-storage-isolation) feature moved to GA. This was introduced as alpha in 1.8, moved to beta in 1.10, and it is now a stable feature. It provides support for capacity isolation of local ephemeral storage between pods, such as `EmptyDir`, so that a pod can be hard limited in its consumption of shared resources by evicting Pods if its consumption of local ephemeral storage exceeds that limit.
-->
### 本地臨時容器儲存容量隔離升級爲 Stable
[本地臨時儲存容量隔離功能](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/361-local-ephemeral-storage-isolation)已經迎來 GA 正式發佈版本。
該功能在 1.8 版中作爲 alpha 版本引入，在 1.10 中升級爲 beta，現在終於成爲了穩定功能。
它提供了對 Pod 之間本地臨時儲存容量隔離的支持，如 `EmptyDir`，
因此，如果一個 Pod 對本地臨時儲存容量的消耗超過該限制，就可以通過驅逐 Pod 來硬性限制其對共享資源的消耗。

<!--
### Promoted core CSI Migration to Stable

[CSI Migration](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/#quick-recap-what-is-csi-migration-and-why-migrate) is an ongoing effort that SIG Storage has been working on for a few releases. The goal is to move in-tree volume plugins to out-of-tree CSI drivers and eventually remove the in-tree volume plugins. The [core CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration) feature moved to GA. CSI Migration for GCE PD and AWS EBS also moved to GA. CSI Migration for vSphere remains in beta (but is on by default). CSI Migration for Portworx moved to Beta (but is off-by-default).
-->
### 核心 CSI 遷移爲穩定版

[CSI 遷移](https://kubernetes.io/blog/2021/12/10/storage-in-tree-to-csi-migration-status-update/#quick-recap-what-is-csi-migration-and-why-migrate)是 SIG Storage 在之前多個版本中做出的持續努力。
目標是將樹內資料卷插件轉移到樹外 CSI 驅動程式並最終移除樹內資料卷插件。
此次[核心 CSI 遷移](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration)已迎來 GA。
同樣，GCE PD 和 AWS EBS 的 CSI 遷移也進入 GA 階段。
vSphere 的 CSI 遷移仍爲 beta（但也預設啓用）。
Portworx 的 CSI 遷移同樣處於 beta 階段（但預設不啓用）。

<!--
### Promoted CSI Ephemeral Volume to Stable

The [CSI Ephemeral Volume](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/596-csi-inline-volumes) feature allows CSI volumes to be specified directly in the pod specification for ephemeral use cases. They can be used to inject arbitrary states, such as configuration, secrets, identity, variables or similar information, directly inside pods using a mounted volume. This was initially introduced in 1.15 as an alpha feature, and it moved to GA. This feature is used by some CSI drivers such as the [secret-store CSI driver](https://github.com/kubernetes-sigs/secrets-store-csi-driver).
-->
### CSI 臨時資料卷升級爲穩定版

[CSI 臨時資料卷](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/596-csi-inline-volumes)
功能允許在臨時使用的情況下在 Pod 裏直接指定 CSI 資料卷。
因此可以直接用它們在使用掛載卷的 Pod 內注入任意狀態，如設定、祕密、身份、變量或類似資訊。
這個功能最初是作爲 alpha 功能在 1.15 版本中引入，現在已升級爲 GA 通用版。
某些 CSI 驅動程式會使用此功能，例如[儲存密碼的 CSI 驅動程式](https://github.com/kubernetes-sigs/secrets-store-csi-driver)。

<!--
### Promoted CRD Validation Expression Language to Beta

[CRD Validation Expression Language](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md) is promoted to beta, which makes it possible to declare how custom resources are validated using the [Common Expression Language (CEL)](https://github.com/google/cel-spec). Please see the [validation rules](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules) guide.
-->
### CRD 驗證表達式語言升級爲 Beta

[CRD 驗證表達式語言](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/2876-crd-validation-expression-language/README.md)已升級爲 beta 版本，
這使得聲明如何使用[通用表達式語言（CEL）](https://github.com/google/cel-spec)驗證自定義資源成爲可能。
請參考[驗證規則](https://kubernetes.io/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-rules)指導。


<!--
### Promoted Server Side Unknown Field Validation to Beta

Promoted the `ServerSideFieldValidation` feature gate to beta (on by default). This allows optionally triggering schema validation on the API server that errors when unknown fields are detected. This allows the removal of client-side validation from kubectl while maintaining the same core functionality of erroring out on requests that contain unknown or invalid fields.
-->
### 伺服器端未知字段驗證升級爲 Beta

`ServerSideFieldValidation` 特性門控已升級爲 beta（預設開啓）。
它允許在檢測到未知字段時，有選擇地觸發 API 伺服器上的模式驗證機制。
因此這允許從 kubectl 中移除客戶端驗證的同時保持相同的核心功能，即對包含未知或無效字段的請求進行錯誤處理。


<!--
###  Introduced KMS v2 API

Introduce KMS v2alpha1 API to add performance, rotation, and observability improvements. Encrypt data at rest (ie Kubernetes `Secrets`) with DEK using AES-GCM instead of AES-CBC for kms data encryption. No user action is required. Reads with AES-GCM and AES-CBC will continue to be allowed. See the guide [Using a KMS provider for data encryption](https://kubernetes.io/docs/tasks/administer-cluster/kms-provider/) for more information.
-->
### 引入 KMS v2 API

引入 KMS v2 alpha1 API 以提升性能，實現輪替與可觀察性改進。
此 API 使用 AES-GCM 替代了 AES-CBC，通過 DEK 實現靜態資料（即 Kubernetes Secrets）加密。
過程中無需額外使用者操作，而且仍然支持通過 AES-GCM 和 AES-CBC 進行讀取。
更多資訊參考[使用 KMS provider 進行資料加密](/zh-cn/docs/tasks/administer-cluster/kms-provider/)指南。

<!--
### Kube-proxy images are now based on distroless images

In previous releases, kube-proxy container images were built using Debian as the base image. Starting with this release, the images are now built using [distroless](https://github.com/GoogleContainerTools/distroless). This change reduced image size by almost 50% and decreased the number of installed packages and files to only those strictly required for kube-proxy to do its job.
-->
### Kube-proxy 映像檔當前基於無發行版映像檔

在以前的版本中，kube-proxy 的容器映像檔是以 Debian 作爲基礎映像檔構建的。
從這個版本開始，其映像檔現在使用 [distroless](https://github.com/GoogleContainerTools/distroless) 來構建。
這一改變將映像檔的大小減少了近 50%，並將安裝的軟體包和檔案的數量減少到只有 kube-proxy 工作所需的那些。


<!--
## Other Updates

### Graduations to Stable

This release includes a total of thirteen enhancements promoted to stable:

* [Ephemeral Containers](https://github.com/kubernetes/enhancements/issues/277)
* [Local Ephemeral Storage Resource Management](https://github.com/kubernetes/enhancements/issues/361)
* [CSI Ephemeral Volumes](https://github.com/kubernetes/enhancements/issues/596)
* [CSI Migration - Core](https://github.com/kubernetes/enhancements/issues/625)
* [Graduate the kube-scheduler ComponentConfig to GA](https://github.com/kubernetes/enhancements/issues/785)
* [CSI Migration - AWS](https://github.com/kubernetes/enhancements/issues/1487)
* [CSI Migration - GCE](https://github.com/kubernetes/enhancements/issues/1488)
* [DaemonSets Support MaxSurge](https://github.com/kubernetes/enhancements/issues/1591)
* [NetworkPolicy Port Range](https://github.com/kubernetes/enhancements/issues/2079)
* [cgroups v2](https://github.com/kubernetes/enhancements/issues/2254)
* [Pod Security Admission](https://github.com/kubernetes/enhancements/issues/2579)
* [Add `minReadySeconds` to Statefulsets](https://github.com/kubernetes/enhancements/issues/2599)
* [Identify Windows pods at API admission level authoritatively](https://github.com/kubernetes/enhancements/issues/2802)
-->
## 其他更新

### 穩定版升級

1.25 版本共包含 13 項升級至穩定版的增強功能：

* [臨時容器](https://github.com/kubernetes/enhancements/issues/277)
* [本地臨時儲存資源管理](https://github.com/kubernetes/enhancements/issues/361)
* [CSI 臨時資料卷](https://github.com/kubernetes/enhancements/issues/596)
* [CSI 遷移 -- 核心](https://github.com/kubernetes/enhancements/issues/625)
* [kube-scheduler ComponentConfig 升級爲 GA 通用版](https://github.com/kubernetes/enhancements/issues/785)
* [CSI 遷移 -- AWS](https://github.com/kubernetes/enhancements/issues/1487)
* [CSI 遷移 -- GCE](https://github.com/kubernetes/enhancements/issues/1488)
* [DaemonSets 支持 MaxSurge](https://github.com/kubernetes/enhancements/issues/1591)
* [網路策略端口範圍](https://github.com/kubernetes/enhancements/issues/2079)
* [cgroups v2](https://github.com/kubernetes/enhancements/issues/2254)
* [Pod Security Admission](https://github.com/kubernetes/enhancements/issues/2579)
* [Statefulsets 增加 `minReadySeconds`](https://github.com/kubernetes/enhancements/issues/2599)
* [在 API 准入層級權威識別 Windows Pod](https://github.com/kubernetes/enhancements/issues/2802)

<!--
### Deprecations and Removals

Two features were [deprecated or removed](/blog/2022/08/04/upcoming-changes-in-kubernetes-1-25/) from Kubernetes with this release.

* [PodSecurityPolicy is removed](https://github.com/kubernetes/enhancements/issues/5)
* [GlusterFS plugin deprecated from available in-tree drivers](https://github.com/kubernetes/enhancements/issues/3446)
-->
### 棄用和移除

1.25 版本[廢棄/移除](/blog/2022/08/04/upcoming-changes-in-kubernetes-1-25/)兩個功能。

* [移除 PodSecurityPolicy](https://github.com/kubernetes/enhancements/issues/5)
* [從樹內驅動程式移除 GlusterFS 插件](https://github.com/kubernetes/enhancements/issues/3446)

<!--
### Release Notes

The complete details of the Kubernetes v1.25 release are available in our [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md).
-->
### 發行版說明
Kubernetes 1.25 版本的完整資訊可參考[發行版說明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.25.md)。


<!--
### Availability

Kubernetes v1.25 is available for download on [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.25.0).
To get started with Kubernetes, check out these [interactive tutorials](/docs/tutorials/) or run local
Kubernetes clusters using containers as “nodes”, with [kind](https://kind.sigs.k8s.io/).
You can also easily install 1.25 using [kubeadm](/docs/setup/independent/create-cluster-kubeadm/).
-->
### 獲取

Kubernetes 1.25 版本可在 [GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.25.0) 下載獲取。
開始使用 Kubernetes 請查看這些[交互式教程](/zh-cn/docs/tutorials/)或者使用
 [kind](https://kind.sigs.k8s.io/) 把容器當作 “節點” 來運行本地 Kubernetes 叢集。
你也可以使用 [kubeadm](/zh-cn/docs/setup/independent/create-cluster-kubeadm/) 來簡單的安裝 1.25 版本。

<!--
### Release Team

Kubernetes is only possible with the support, commitment, and hard work of its community. Each release team is made up of dedicated community volunteers who work together to build the many pieces that, when combined, make up the Kubernetes releases you rely on. This requires the specialized skills of people from all corners of our community, from the code itself to its documentation and project management.

We would like to thank the entire release team for the hours spent hard at work to ensure we deliver a solid Kubernetes v1.25 release for our community. Every one of you had a part to play in building this, and you all executed beautifully. We would like to extend special thanks to our fearless release lead, Cici Huang, for all she did to guarantee we had what we needed to succeed.
-->
### 發佈團隊

Kubernetes 的發展離不開其社區的支持、承諾和辛勤工作。
每個發佈團隊都是由專門的社區志願者組成的，他們共同努力，建立了許多模塊，這些模塊結合起來，就構成了你所依賴的 Kubernetes。
從代碼本身到文檔和項目管理，這需要我們社區每一個人的專業技能。

<!--
### User Highlights

* Finleap Connect operates in a highly regulated environment. [In 2019, they had five months to implement mutual TLS (mTLS) across all services in their clusters for their business code to comply with the new European PSD2 payment directive](https://www.cncf.io/case-studies/finleap-connect/).
* PNC sought to develop a way to ensure new code would meet security standards and audit compliance requirements automatically—replacing the cumbersome 30-day manual process they had in place. Using Knative, [PNC developed internal tools to automatically check new code and changes to existing code](https://www.cncf.io/case-studies/pnc-bank/).
* Nexxiot needed highly-reliable, secure, performant, and cost efficient Kubernetes clusters. [They turned to Cilium as the CNI to lock down their clusters and enable resilient networking with reliable day two operations](https://www.cncf.io/case-studies/nexxiot/).
* Because the process of creating cyber insurance policies is a complicated multi-step process, At-Bay sought to improve operations by using asynchronous message-based communication patterns/facilities. [They determined that Dapr fulfilled its desired list of requirements and much more](https://www.cncf.io/case-studies/at-bay/).
-->
### 重要使用者

* Finleap Connect 在一個高度規範的環境中運作。
[2019年，他們有五個月的時間在其叢集的所有服務中實施交互 TLS（mTLS），以使其業務代碼符合新的歐洲 PSD2 支付指令](https://www.cncf.io/case-studies/finleap-connect/)。
* PNC 試圖開發一種方法，以確保新的代碼能夠自動滿足安全標準和審計合規性要求--取代他們現有的 30 天的繁瑣的人工流程。
使用 Knative，[PNC 開發了內部工具來自動檢查新代碼和對修改現有代碼](https://www.cncf.io/case-studies/pnc-bank/)。
* Nexxiot 公司需要高可用、安全、高性能以及低成本的
 Kubernetes 叢集。[他們求助於 Cilium 作爲 CNI 來鎖定他們的叢集，並通過可靠的 Day2 操作實現彈性網路](https://www.cncf.io/case-studies/nexxiot/)。
* 因爲創建網路安全策略的過程是一個複雜的多步驟過程，
At-Bay 試圖通過使用基於異步消息的通信模式/設施來改善運營。[他們確定 Dapr 滿足了其所需的要求清單，且遠超預期](https://www.cncf.io/case-studies/at-bay/)。

<!--
### Ecosystem Updates

* KubeCon + CloudNativeCon North America 2022 will take place in Detroit, Michigan from 24 – 28 October 2022! You can find more information about the conference and registration on the [event site](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/).
* KubeDay event series kicks off with KubeDay Japan on December 7! Register or submit a proposal on the [event site](https://events.linuxfoundation.org/kubeday-japan/)
* In the [2021 Cloud Native Survey](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/), the CNCF saw record Kubernetes and container adoption. Take a look at the [results of the survey](https://www.cncf.io/reports/cncf-annual-survey-2021/).
-->
###  生態系統更新
* 2022 北美 KubeCon + CloudNativeCon 將於 2022 年 10 月 24 - 28 日在密歇根州的底特律舉行! 
你可以在[活動網站](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/)找到更多關於會議和註冊的資訊。
* KubeDay 系列活動將於 12 月 7 日在日本 KubeDay 拉開帷幕!
在[活動網站](https://events.linuxfoundation.org/kubeday-japan/)上註冊或提交提案。
* 在 [2021 雲原生調查](https://www.cncf.io/announcements/2022/02/10/cncf-sees-record-kubernetes-and-container-adoption-in-2021-cloud-native-survey/)中，CNCF 看見了創紀錄的 Kubernetes 和容器應用。
請參考[調查結果](https://www.cncf.io/reports/cncf-annual-survey-2021/)。

<!--
### Project Velocity

The [CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) project
aggregates a number of interesting data points related to the velocity of Kubernetes and various
sub-projects. This includes everything from individual contributions to the number of companies that
are contributing, and is an illustration of the depth and breadth of effort that goes into evolving this ecosystem.

In the v1.25 release cycle, which [ran for 14 weeks](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25) (May 23 to August 23), we saw contributions from [1065 companies](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions) and [1620 individuals](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes).
-->
### 項目進度

[CNCF K8s DevStats](https://k8s.devstats.cncf.io/d/12/dashboards?orgId=1&refresh=15m) 項目彙集了大量關於 
Kubernetes 和各種子項目研發進度相關性的有趣的資料點。
其中包括從個人貢獻到參與貢獻的公司數量的全面資訊，
並證明了爲發展 Kubernetes 生態系統所做努力的深度和廣度。

在 1.25 版本的發佈週期中，
該週期[運行了 14 周](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25) (May 23 to August 23)，
我們看到來着 [1065 家公司](https://k8s.devstats.cncf.io/d/9/companies-table?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions) 
以及 [1620 位個人](https://k8s.devstats.cncf.io/d/66/developer-activity-counts-by-companies?orgId=1&var-period_name=v1.24.0%20-%20v1.25.0&var-metric=contributions&var-repogroup_name=Kubernetes&var-country_name=All&var-companies=All&var-repo_name=kubernetes%2Fkubernetes)所做出的貢獻。

<!--
## Upcoming Release Webinar

Join members of the Kubernetes v1.25 release team on Thursday September 22, 2022 10am – 11am PT to learn about
the major features of this release, as well as deprecations and removals to help plan for upgrades.
For more information and registration, visit the [event page](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-v125-release/).
-->
## 即將舉行的網路發佈研討會

加入 Kubernetes 1.25 版本發佈團隊的成員，將於 2022 年 9 月 22 日星期四上午 10 點至 11 點(太平洋時間)瞭解該版本的主要功能，
以及棄用和刪除的內容，以幫助制定升級計劃。
欲瞭解更多資訊和註冊，請訪問[活動頁面](https://community.cncf.io/events/details/cncf-cncf-online-programs-presents-cncf-live-webinar-kubernetes-v125-release/)。

<!--
## Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests.
Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below:

* Find out more about contributing to Kubernetes at the [Kubernetes Contributors](https://www.kubernetes.dev/) website
* Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for the latest updates
* Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
* Join the community on [Slack](http://slack.k8s.io/)
* Post questions (or answer questions) on [Server Fault](https://serverfault.com/questions/tagged/kubernetes).
* Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* Read more about what’s happening with Kubernetes on the [blog](https://kubernetes.io/blog/)
* Learn more about the [Kubernetes Release Team](https://github.com/kubernetes/sig-release/tree/master/release-team)
-->
## 參與其中

參與 Kubernetes 最簡單的方法就是加入衆多[特殊興趣小組](https://github.com/kubernetes/community/blob/master/sig-list.md)(SIGs) 中你感興趣的一個。
你有什麼東西想要跟 Kubernetes 社區溝通嗎？
來我們每週的[社區會議](https://github.com/kubernetes/community/tree/master/communication)分享你的想法，並參考一下渠道：

* 在 [Kubernetes 貢獻者](https://www.kubernetes.dev/)網站了解更多關於爲 Kubernetes 做貢獻的資訊。
* 在 Twitter [@Kubernetesio](https://twitter.com/kubernetesio) 上關注我們，瞭解最新動態。
* 在 [Discuss](https://discuss.kubernetes.io/) 上加入社區討論。
* 在 [Slack](http://slack.k8s.io/) 上加入社區。
* 在 [Server Fault](https://serverfault.com/questions/tagged/kubernetes) 上發佈問題（或者回答問題）。
* 分享你的 Kubernetes [故事](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
* 在[博客](https://kubernetes.io/blog/)上閱讀更多關於 Kubernetes 的情況。
* 瞭解更多關於 [Kubernetes 發佈團隊](https://github.com/kubernetes/sig-release/tree/master/release-team)的資訊。