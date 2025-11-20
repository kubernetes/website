---
layout: blog
title: "Kubernetes 1.23：樹內儲存向 CSI 卷遷移工作的進展更新"
date: 2021-12-10
slug: storage-in-tree-to-csi-migration-status-update
---
<!---
layout: blog
title: "Kubernetes 1.23: Kubernetes In-Tree to CSI Volume Migration Status Update"
date: 2021-12-10
slug: storage-in-tree-to-csi-migration-status-update
-->

<!---
**Author:** Jiawei Wang (Google)
-->
**作者**: Jiawei Wang（谷歌）

<!---
The Kubernetes in-tree storage plugin to [Container Storage Interface (CSI)](/blog/2019/01/15/container-storage-interface-ga/) migration infrastructure has already been [beta](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/) since v1.17. CSI migration was introduced as alpha in Kubernetes v1.14.
-->
自 Kubernetes v1.14 引入容器儲存介面（[Container Storage Interface, CSI](/blog/2019/01/15/container-storage-interface-ga/)）的工作達到 alpha 階段後，自 v1.17 起，Kubernetes 樹內儲存插件（in-tree storage plugin）向 CSI 的遷移基礎設施已步入 [beta 階段](/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/)。

<!---
Since then, SIG Storage and other Kubernetes special interest groups are working to ensure feature stability and compatibility in preparation for GA.
This article is intended to give a status update to the feature as well as changes between Kubernetes 1.17 and 1.23. In addition, I will also cover the future roadmap for the CSI migration feature GA for each storage plugin.
-->
自那時起，Kubernetes 儲存特別興趣組（special interest groups, SIG）及其他 Kubernetes 特別興趣組就在努力確保這一功能的穩定性和兼容性，爲正式發佈做準備。
本文旨在介紹該功能的最新開發進展，以及 Kubernetes v1.17 到 v1.23 之間的變化。此外，我還將介紹每個儲存插件的 CSI 遷移功能達到正式發佈階段的未來路線圖。

<!---
## Quick recap: What is CSI Migration, and why migrate?

The Container Storage Interface (CSI) was designed to help Kubernetes replace its existing, in-tree storage driver mechanisms - especially vendor specific plugins.
Kubernetes support for the [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md#README) has been 
[generally available](/blog/2019/01/15/container-storage-interface-ga/) since Kubernetes v1.13.
Support for using CSI drivers was introduced to make it easier to add and maintain new integrations between Kubernetes and storage backend technologies. Using CSI drivers allows for for better maintainability (driver authors can define their own release cycle and support lifecycle) and reduce the opportunity for vulnerabilities (with less in-tree code, the risks of a mistake are reduced, and cluster operators can select only the storage drivers that their cluster requires).
-->
## 快速回顧：CSI 遷移功能是什麼？爲什麼要遷移？  {#quick-recap-what-is-csi-migration-and-why-migrate}

容器儲存介面旨在幫助 Kubernetes 取代其現有的樹內儲存驅動機制──特別是供應商的特定插件。自 v1.13 起，Kubernetes 對[容器儲存介面](https://github.com/container-storage-interface/spec/blob/master/spec.md#README)的支持工作已達到[正式發佈階段](/blog/2019/01/15/container-storage-interface-ga/)。引入對 CSI 驅動的支持，將使得 Kubernetes 和儲存後端技術之間的集成工作更易建立和維護。使用 CSI 驅動可以實現更好的可維護性（驅動作者可以決定自己的發佈週期和支持生命週期）、減少出現漏洞的機會（得益於更少的樹內代碼，出現錯誤的風險會降低。另外，叢集操作員可以只選擇叢集需要的儲存驅動）。

<!---
As more CSI Drivers were created and became production ready, SIG Storage group wanted all Kubernetes users to benefit from the CSI model. However, we cannot break API compatibility with the existing storage API types. The solution we came up with was CSI migration: a feature that translates in-tree APIs to equivalent CSI APIs and delegates operations to a replacement CSI driver.
-->
隨着更多的 CSI 驅動誕生並進入生產就緒階段，Kubernetes 儲存特別興趣組希望所有 Kubernetes 使用者都能從 CSI 模型中受益──然而，我們不應破壞與現有儲存 API 類型的 API 兼容性。對此，我們給出的解決方案是 CSI 遷移：該功能實現將樹內儲存 API 翻譯成等效的 CSI API，並把操作委託給一個替換的 CSI 驅動來完成。

<!---
The CSI migration effort enables the replacement of existing in-tree storage plugins such as `kubernetes.io/gce-pd` or `kubernetes.io/aws-ebs` with a corresponding [CSI driver](https://kubernetes-csi.github.io/docs/introduction.html) from the storage backend.
If CSI Migration is working properly, Kubernetes end users shouldn’t notice a difference. Existing `StorageClass`, `PersistentVolume` and `PersistentVolumeClaim` objects should continue to work.
When a Kubernetes cluster administrator updates a cluster to enable CSI migration, existing workloads that utilize PVCs which are backed by in-tree storage plugins will continue to function as they always have. 
However, behind the scenes, Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.
-->
CSI 遷移工作使儲存後端現有的樹內儲存插件（如 `kubernetes.io/gce-pd` 或 `kubernetes.io/aws-ebs`）能夠被相應的 [CSI 驅動](https://kubernetes-csi.github.io/docs/introduction.html) 所取代。如果 CSI 遷移功能正確發揮作用，Kubernetes 終端使用者應該不會注意到有什麼變化。現有的 `StorageClass`、`PersistentVolume` 和 `PersistentVolumeClaim` 對象應繼續工作。當 Kubernetes 叢集管理員更新叢集以啓用 CSI 遷移功能時，利用到 PVCs[^1]（由樹內儲存插件支持）的現有工作負載將繼續像以前一樣運作──不過在幕後，Kubernetes 將所有儲存管理操作（以前面向樹內儲存驅動的）交給 CSI 驅動控制。

<!---
For example, suppose you are a `kubernetes.io/gce-pd` user, after CSI migration, you can still use `kubernetes.io/gce-pd` to provision new volumes, mount existing GCE-PD volumes or delete existing volumes. All existing API/Interface will still function correctly. However, the underlying function calls are all going through the [GCE PD CSI driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) instead of the in-tree Kubernetes function.
-->
舉個例子。假設你是 `kubernetes.io/gce-pd` 使用者，在啓用 CSI 遷移功能後，你仍然可以使用 `kubernetes.io/gce-pd` 來設定新卷、掛載現有的 GCE-PD 卷或刪除現有卷。所有現有的 API/介面 仍將正常工作──只不過，底層功能調用都將通向 [GCE PD CSI 驅動](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver)，而不是 Kubernetes 的樹內儲存功能。

<!---
This enables a smooth transition for end users. Additionally as storage plugin developers, we can reduce the burden of maintaining the in-tree storage plugins and eventually remove them from the core Kubernetes binary.
-->
這使得 Kubernetes 終端使用者可以順利過渡。另外，對於儲存插件的開發者，我們可以減少他們維護樹內儲存插件的負擔，並最終將這些插件從 Kubernetes 核心的二進制中移除。

<!---
## What has been changed, and what's new?

Building on the work done in Kubernetes v1.17 and earlier, the releases since then have
made a series of changes:
-->
## 改進與更新  {#what-has-been-changed-and-what-s-new}
在 Kubernetes v1.17 及更早的工作基礎上，此後的發佈有了以下一系列改變：

<!---
### New feature gates

The Kubernetes v1.21 release deprecated the `CSIMigration{provider}Complete` feature flags, and stopped honoring them. In their place came new feature flags named `InTreePlugin{vendor}Unregister`, that replace the old feature flag and retain all the functionality that `CSIMigration{provider}Complete` provided.
-->
### 新的特性門控（feature gate）  {#new-feature-gates}
Kubernetes v1.21 棄用了 `CSIMigration{provider}Complete` 特性參數（feature flag），它們不再生效。取而代之的是名爲 `InTreePlugin{vendor}Unregister` 的新特性參數，它們保留了 `CSIMigration{provider}Complete` 提供的所有功能。

<!---
`CSIMigration{provider}Complete` was introduced before as a supplementary feature gate once CSI migration is enabled on all of the nodes. This flag unregisters the in-tree storage plugin you specify with the `{provider}` part of the flag name.
-->
`CSIMigration{provider}Complete` 是作爲 CSI 遷移功能在所有節點上啓用後的補充特性門控於之前引入的。這個參數可註銷參數名稱中 `{provider}` 部分所指定的樹內儲存插件。

<!---
When you enable that feature gate, then instead of using the in-tree driver code, your cluster directly selects and uses the relevant CSI driver. This happens without any check for whether CSI migration is enabled on the node, or whether you have in fact deployed that CSI driver.
-->
當你啓用該特性門控時，你的叢集不再使用樹內驅動代碼，而是直接選擇並使用相應的 CSI 驅動。同時，叢集並不檢查節點上 CSI 遷移功能是否啓用，以及 CSI 驅動是否實際部署。

<!---
While this feature gate is a great helper, SIG Storage (and, I'm sure, lots of cluster operators) also wanted a feature gate that lets you disable an in-tree storage plugin, even without also enabling CSI migration. For example, you might want to disable the EBS storage plugin on a GCE cluster, because EBS volumes are specific to a different vendor's cloud (AWS).
-->
雖然這一特性門控是一個很好的幫手，但 Kubernetes 儲存特別興趣組（以及，我相信還有很多叢集操作員）同樣希望有一個特性門控可以讓你即使在不啓用 CSI 遷移功能時，也能禁用樹內儲存插件。例如，你可能希望在一個 GCE 叢集上禁用 EBS 儲存插件，因爲 EBS 卷是其他供應商的雲（AWS）所專有的。

<!---
To make this possible, Kubernetes v1.21 introduced a new feature flag set: `InTreePlugin{vendor}Unregister`.

`InTreePlugin{vendor}Unregister` is a standalone feature gate that can be enabled and disabled independently from CSI Migration. When enabled, the component will not register the specific in-tree storage plugin to the supported list. If the cluster operator only enables this flag, end users will get an error from PVC saying it cannot find the plugin when the plugin is used. The cluster operator may want to enable this regardless of CSI Migration if they do not want to support the legacy in-tree APIs and only support CSI moving forward.
-->
爲了使這成爲可能，Kubernetes v1.21 引入了一個新的特性參數集合：`InTreePlugin{vendor}Unregister`。

`InTreePlugin{vendor}Unregister` 是一種特性門控，可以獨立於 CSI 遷移功能來啓用或禁用。當啓用此種特性門控時，組件將不會把相應的樹內儲存插件註冊到支持的列表中。如果叢集操作員只啓用了這種參數，終端使用者將在使用該插件的 PVC[^1] 處遇到錯誤，提示其找不到插件。如果叢集操作員不想支持過時的樹內儲存 API，只支持 CSI，那麼他們可能希望啓用這種特性門控而不考慮 CSI 遷移功能。

<!---

### Observability

Kubernetes v1.21 introduced [metrics](https://github.com/kubernetes/kubernetes/issues/98279) for tracking CSI migration.
You can use these metrics to observe how your cluster is using storage services and whether access to that storage is using the legacy in-tree driver or its CSI-based replacement.
-->

### 可觀察性  {#observability}

Kubernetes v1.21 引入了跟蹤 CSI 遷移功能的[指標](https://github.com/kubernetes/kubernetes/issues/98279)。你可以使用這些指標來觀察你的叢集是如何使用儲存服務的，以及對該儲存的訪問使用的是傳統的樹內驅動還是基於 CSI 的替代。

<!---
| Components                                   | Metrics                            | Notes                                                                                                                                                                                  |
| -------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kube-Controller-Manager                      | storage_operation_duration_seconds | A new label `migrated` is added to the metric to indicate whether this storage operation is a CSI migration operation(string value `true` for enabled and `false` for not enabled).    |
| Kubelet                                      | csi_operations_seconds             | The new metric exposes labels including `driver_name`, `method_name`, `grpc_status_code` and `migrated`. The meaning of these labels is identical to `csi_sidecar_operations_seconds`. |
| CSI Sidecars(provisioner, attacher, resizer) | csi_sidecar_operations_seconds     | A new label `migrated` is added to the metric to indicate whether this storage operation is a CSI migration operation(string value `true` for enabled and `false` for not enabled).    |
-->
| 組件 | 指標 | 註釋 |
| ---- | ---- | ---- |
| Kube-Controller-Manager | storage_operation_duration_seconds | 一個新的標籤 `migrated` 被添加到指標中，以表明該儲存操作是否由 CSI 遷移功能操作（字符串值爲 `true` 表示啓用，`false` 表示未啓用）。 |
| Kubelet | csi_operations_seconds | 新的指標提供的標籤包括 `driver_name`、`method_name`、`grpc_status_code` 和 `migrated`。這些標籤的含義與 `csi_sidecar_operations_seconds` 相同。 |
| CSI Sidecars(provisioner, attacher, resizer) | csi_sidecar_operations_seconds | 一個新的標籤 `migrated` 被添加到指標中，以表明該儲存操作是否由 CSI 遷移功能操作（字符串值爲 `true` 表示啓用，`false` 表示未啓用）。 |

<!---
### Bug fixes and feature improvement

We have fixed numerous bugs like dangling attachment, garbage collection, incorrect topology label through the help of our beta testers.
-->
### 錯誤修復和功能改進  {#bug-fixes-and-feature-improvement}

籍由 beta 測試人員的幫助，我們修復了許多錯誤──如懸空附件、垃圾收集、拓撲標籤錯誤等。

<!---
### Cloud Provider && Cluster Lifecycle Collaboration

SIG Storage has been working closely with SIG Cloud Provider and SIG Cluster Lifecycle on the rollout of CSI migration.

If you are a user of a managed Kubernetes service, check with your provider if anything needs to be done. In many cases, the provider will manage the migration and no additional work is required.
-->
### 與 Kubernetes 雲提供商特別興趣組、叢集生命週期特別興趣組的合作  {#cloud-provider-cluster-lifecycle-collaboration}

Kubernetes 儲存特別興趣組與雲提供商特別興趣組和叢集生命週期特別興趣組，正爲了 CSI 遷移功能上線而密切合作。

如果你採用託管 Kubernetes 服務，請詢問你的供應商是否有什麼工作需要完成。在許多情況下，供應商將管理遷移，你不需要做額外的工作。

<!---
If you use a distribution of Kubernetes, check its official documentation for information about support for this feature. For the CSI Migration feature graduation to GA, SIG Storage and SIG Cluster Lifecycle are collaborating towards making the migration mechanisms available in tooling (such as kubeadm) as soon as they're available in Kubernetes itself.
-->
如果你使用的是 Kubernetes 的發行版，請查看其官方文檔，瞭解對該功能的支持情況。對於已進入正式發佈階段的 CSI 遷移功能，Kubernetes 儲存特別興趣組正與Kubernetes 叢集生命週期特別興趣組合作，以便在這些功能於 Kubernetes 中可用時，使遷移機制也進入到周邊工具（如 kubeadm）中。

<!---
## What is the timeline / status? {#timeline-and-status}

The current and targeted releases for each individual driver is shown in the table below:
-->
## 時間計劃及當前狀態  {#timeline-and-status}

各驅動的當前發佈及目標發佈如下表所示：

<!---
| Driver           | Alpha | Beta (in-tree deprecated) | Beta (on-by-default) | GA            | Target "in-tree plugin" removal |
| ---------------- | ----- | ------------------------- | -------------------- | ------------- | ------------------------------- |
| AWS EBS          | 1.14  | 1.17                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| GCE PD           | 1.14  | 1.17                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| OpenStack Cinder | 1.14  | 1.18                      | 1.21                 | 1.24 (Target) | 1.26 (Target)                   |
| Azure Disk       | 1.15  | 1.19                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| Azure File       | 1.15  | 1.21                      | 1.24 (Target)        | 1.25 (Target) | 1.27 (Target)                   |
| vSphere          | 1.18  | 1.19                      | 1.24 (Target)        | 1.25 (Target) | 1.27 (Target)                   |
| Ceph RBD         | 1.23  |
| Portworx         | 1.23  |
-->
| 驅動 | Alpha | Beta（啓用樹內插件） | Beta（預設啓用） | 正式發佈 | 目標：移除“樹內儲存插件” |
| ---------------- | ----- | ------------------------- | -------------------- | ------------- | ------------------------------- |
| AWS EBS          | 1.14  | 1.17                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| GCE PD           | 1.14  | 1.17                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| OpenStack Cinder | 1.14  | 1.18                      | 1.21                 | 1.24 (Target) | 1.26 (Target)                   |
| Azure Disk       | 1.15  | 1.19                      | 1.23                 | 1.24 (Target) | 1.26 (Target)                   |
| Azure File       | 1.15  | 1.21                      | 1.24 (Target)        | 1.25 (Target) | 1.27 (Target)                   |
| vSphere          | 1.18  | 1.19                      | 1.24 (Target)        | 1.25 (Target) | 1.27 (Target)                   |
| Ceph RBD         | 1.23  |
| Portworx         | 1.23  |

<!---
The following storage drivers will not have CSI migration support. The ScaleIO driver was already removed; the others are deprecated and will be removed from core Kubernetes.
-->
以下儲存驅動將不會支持 CSI 遷移功能。其中 ScaleIO 驅動已經被移除；其他驅動都被棄用，並將從 Kubernetes 核心中刪除。

<!---
| Driver    | Deprecated | Code Removal  |
| --------- | ---------- | ------------- |
| ScaleIO   | 1.16       | 1.22          |
| Flocker   | 1.22       | 1.25 (Target) |
| Quobyte   | 1.22       | 1.25 (Target) |
| StorageOS | 1.22       | 1.25 (Target) |
-->
| 驅動 | 被棄用 | 代碼移除 |
| ---- | ---- | ---- |
| ScaleIO   | 1.16 | 1.22          |
| Flocker   | 1.22 | 1.25 (Target) |
| Quobyte   | 1.22 | 1.25 (Target) |
| StorageOS | 1.22 | 1.25 (Target) |

<!---
## What's next?

With more CSI drivers graduating to GA, we hope to soon mark the overall CSI Migration feature as GA. We are expecting cloud provider in-tree storage plugins code removal to happen by Kubernetes v1.26 and v1.27.
-->
## 下一步的計劃  {#what-s-next}

隨着更多的 CSI 驅動進入正式發佈階段，我們希望儘快將整個 CSI 遷移功能標記爲正式發佈狀態。我們計劃在 Kubernetes v1.26 和 v1.27 之前移除雲提供商樹內儲存插件的代碼。

<!---
## What should I do as a user?

Note that all new features for the Kubernetes storage system (such as volume snapshotting) will only be added to the CSI interface. Therefore, if you are starting up a new cluster, creating stateful applications for the first time, or require these new features we recommend using CSI drivers natively (instead of the in-tree volume plugin API). Follow the [updated user guides for CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html) and use the new CSI APIs.
-->
## 作爲使用者，我應該做什麼？  {#what-should-i-do-as-a-user}

請注意，Kubernetes 儲存系統的所有新功能（如卷快照）將只被添加到 CSI 介面。因此，如果你正在啓動一個新的叢集、首次創建有狀態的應用程式，或者需要這些新功能，我們建議你在本地使用 CSI 驅動（而不是樹內卷插件 API）。遵循[最新的 CSI 驅動使用者指南](https://kubernetes-csi.github.io/docs/drivers.html)並使用新的 CSI API。

<!---
However, if you choose to roll a cluster forward or continue using specifications with the legacy volume APIs, CSI Migration will ensure we continue to support those deployments with the new CSI drivers. However, if you want to leverage new features like snapshot, it will require a manual migration to re-import an existing intree PV as a CSI PV.
-->
然而，如果您選擇沿用現有叢集或繼續使用傳統卷 API 的規約，CSI 遷移功能將確保我們通過新 CSI 驅動繼續支持這些部署。但是，如果您想利用快照等新功能，則需要進行手動遷移，將現有的樹內持久卷重新導入爲 CSI 持久卷。

<!---
## How do I get involved?

The Kubernetes Slack channel [#csi-migration](https://kubernetes.slack.com/messages/csi-migration) along with any of the standard [SIG Storage communication channels](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact) are great mediums to reach out to the SIG Storage and migration working group teams.
-->
## 我如何參與其中？  {#how-do-i-get-involved}
Kubernetes Slack 頻道 [#csi-migration](https://kubernetes.slack.com/messages/csi-migration) 以及任何一個標準的 [SIG Storage 通信頻道](https://github.com/kubernetes/community/blob/master/sig-storage/README.md#contact)都是與 Kubernetes 儲存特別興趣組和遷移工作組團隊聯繫的絕佳媒介。

<!---
This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. We offer a huge thank you to the contributors who stepped up these last quarters to help move the project forward:

* Michelle Au (msau42)
* Jan Šafránek (jsafrane)
* Hemant Kumar (gnufied)
-->
該項目，和其他所有 Kubernetes 項目一樣，是許多來自不同背景的貢獻者共同努力的結果。我們非常感謝在過去幾個季度裏挺身而出幫助推動項目發展的貢獻者們：

* Michelle Au (msau42)
* Jan Šafránek (jsafrane)
* Hemant Kumar (gnufied)

<!---
Special thanks to the following people for the insightful reviews, thorough consideration and valuable contribution to the CSI migration feature:

* Andy Zhang (andyzhangz)
* Divyen Patel (divyenpatel)
* Deep Debroy (ddebroy)
* Humble Devassy Chirammal (humblec)
* Jing Xu (jingxu97)
* Jordan Liggitt (liggitt)
* Matthew Cary (mattcary)
* Matthew Wong (wongma7)
* Neha Arora (nearora-msft)
* Oksana Naumov (trierra)
* Saad Ali (saad-ali)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)
-->
特別感謝以下人士對 CSI 遷移功能的精闢評論、全面考慮和寶貴貢獻：

* Andy Zhang (andyzhangz)
* Divyen Patel (divyenpatel)
* Deep Debroy (ddebroy)
* Humble Devassy Chirammal (humblec)
* Jing Xu (jingxu97)
* Jordan Liggitt (liggitt)
* Matthew Cary (mattcary)
* Matthew Wong (wongma7)
* Neha Arora (nearora-msft)
* Oksana Naumov (trierra)
* Saad Ali (saad-ali)
* Tim Bannister (sftim)
* Xing Yang (xing-yang)

<!---
Those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group (SIG)](https://github.com/kubernetes/community/tree/master/sig-storage). We’re rapidly growing and always welcome new contributors.
-->
有興趣參與 CSI 或 Kubernetes 儲存系統任何部分的設計和開發的人，請加入 [Kubernetes 儲存特別興趣組](https://github.com/kubernetes/community/tree/master/sig-storage)。我們正在迅速成長，並一直歡迎新的貢獻者。


[^1]: 持久卷申領（PersistentVolumeClaim，PVC）