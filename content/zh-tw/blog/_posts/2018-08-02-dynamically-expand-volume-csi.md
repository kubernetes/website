---
layout: blog
title:  '使用 CSI 和 Kubernetes 實現卷的動態擴容'
date:   2018-08-02
---

<!--
layout: blog
title:  'Dynamically Expand Volume with CSI and Kubernetes'
date:   2018-08-02
-->

<!--
**Author**: Orain Xiong (Co-Founder, WoquTech)
-->

**作者**：Orain Xiong（聯合創始人, WoquTech）

<!--
_There is a very powerful storage subsystem within Kubernetes itself, covering a fairly broad spectrum of use cases. Whereas, when planning to build a product-grade relational database platform with Kubernetes, we face a big challenge: coming up with storage. This article describes how to extend latest Container Storage Interface 0.2.0 and integrate with Kubernetes, and demonstrates the essential facet of dynamically expanding volume capacity._
-->

_Kubernetes 本身有一個非常強大的儲存子系統，涵蓋了相當廣泛的用例。而當我們計劃使用 Kubernetes 構建產品級關係型資料庫平臺時，我們面臨一個巨大的挑戰：提供儲存。本文介紹瞭如何擴充套件最新的 Container Storage Interface 0.2.0 和與 Kubernetes 整合，並演示了捲動態擴容的基本方面。_

<!--
## Introduction
-->

## 介紹

<!--
As we focalize our customers, especially in financial space, there is a huge upswell in the adoption of container orchestration technology.
-->

當我們專注於客戶時，尤其是在金融領域，採用容器編排技術的情況大大增加。

<!--
They are looking forward to open source solutions to redesign already existing monolithic applications, which have been running for several years on virtualization infrastructure or bare metal.
-->

他們期待著能用開源解決方案重新設計已經存在的整體應用程式，這些應用程式已經在虛擬化基礎架構或裸機上運行了幾年。

<!--
Considering extensibility and the extent of technical maturity, Kubernetes and Docker are at the very top of the list. But migrating monolithic applications to a distributed orchestration like Kubernetes is challenging, the relational database is critical for the migration.
-->

考慮到可擴充套件性和技術成熟程度，Kubernetes 和 Docker 排在我們選擇列表的首位。但是將整體應用程式遷移到類似於 Kubernetes 之類的分散式容器編排平臺上很具有挑戰性，其中關係資料庫對於遷移來說至關重要。

<!--
With respect to the relational database, we should pay attention to storage. There is a very powerful storage subsystem within Kubernetes itself. It is very useful and covers a fairly broad spectrum of use cases. When planning to run a relational database with Kubernetes in production, we face a big challenge: coming up with storage. There are still some fundamental functionalities which are left unimplemented. Specifically, dynamically expanding volume. It sounds boring but is highly required, except for actions like create and delete and mount and unmount.
-->

關於關係資料庫，我們應該注意儲存。Kubernetes 本身內部有一個非常強大的儲存子系統。它非常有用，涵蓋了相當廣泛的用例。當我們計劃在生產環境中使用 Kubernetes 執行關係型資料庫時，我們面臨一個巨大挑戰：提供儲存。目前，仍有一些基本功能尚未實現。特別是，卷的動態擴容。這聽起來很無聊，但在除建立，刪除，安裝和解除安裝之類的操作外，它是非常必要的。

<!--
Currently, expanding volume is only available with those storage provisioners:
-->

目前，擴展卷僅適用於這些儲存供應商：

* gcePersistentDisk
* awsElasticBlockStore
* OpenStack Cinder
* glusterfs
* rbd

<!--
In order to enable this feature, we should set feature gate `ExpandPersistentVolumes` true and turn on the `PersistentVolumeClaimResize` admission plugin. Once `PersistentVolumeClaimResize` has been enabled, resizing will be allowed by a Storage Class whose `allowVolumeExpansion` field is set to true.
-->

為了啟用此功能，我們應該將特性開關 `ExpandPersistentVolumes` 設定為 true 並開啟 `PersistentVolumeClaimResize` 准入外掛。 一旦啟用了 `PersistentVolumeClaimResize`，則其對應的 `allowVolumeExpansion` 欄位設定為 true 的儲存類將允許調整大小。

<!--
Unfortunately, dynamically expanding volume through the Container Storage Interface (CSI) and Kubernetes is unavailable, even though the underlying storage providers have this feature.
-->

不幸的是，即使基礎儲存提供者具有此功能，也無法透過容器儲存介面（CSI）和 Kubernetes 動態擴展卷。

<!--
This article will give a simplified view of CSI, followed by a walkthrough of how to introduce a new expanding volume feature on the existing CSI and Kubernetes. Finally, the article will demonstrate how to dynamically expand volume capacity.
-->

本文將給出 CSI 的簡化檢視，然後逐步介紹如何在現有 CSI 和 Kubernetes 上引入新的擴展卷功能。最後，本文將演示如何動態擴展卷容量。

<!--
## Container Storage Interface (CSI)
-->

## 容器儲存介面（CSI）

<!--
To have a better understanding of what we're going to do, the first thing we need to know is what the Container Storage Interface is. Currently, there are still some problems for already existing storage subsystem within Kubernetes. Storage driver code is maintained in the Kubernetes core repository which is difficult to test. But beyond that, Kubernetes needs to give permissions to storage vendors to check code into the Kubernetes core repository. Ideally, that should be implemented externally.
-->

為了更好地瞭解我們將要做什麼，我們首先需要知道什麼是容器儲存介面。當前，Kubernetes 中已經存在的儲存子系統仍然存在一些問題。 儲存驅動程式程式碼在 Kubernetes 核心儲存庫中維護，這很難測試。 但是除此之外，Kubernetes 還需要授予儲存供應商許可，以將程式碼簽入 Kubernetes 核心儲存庫。 理想情況下，這些應在外部實施。

<!--
CSI is designed to define an industry standard that will enable storage providers who enable CSI to be available across container orchestration systems that support CSI.
-->

CSI 旨在定義行業標準，該標準將使支援 CSI 的儲存提供商能夠在支援 CSI 的容器編排系統中使用。

<!--
This diagram depicts a kind of high-level Kubernetes archetypes integrated with CSI:

![csi diagram](/images/blog/2018-08-02-dynamically-expand-volume-csi/csi-diagram.png)
-->

該圖描述了一種與 CSI 整合的高階 Kubernetes 原型：

![csi diagram](/images/blog/2018-08-02-dynamically-expand-volume-csi/csi-diagram.png)

<!--
* Three new external components are introduced to decouple Kubernetes and Storage Provider logic
* Blue arrows present the conventional way to call against API Server
* Red arrows present gRPC to call against Volume Driver
-->

* 引入了三個新的外部元件以解耦 Kubernetes 和儲存提供程式邏輯
* 藍色箭頭表示針對 API 伺服器進行呼叫的常規方法
* 紅色箭頭顯示 gRPC 以針對 Volume Driver 進行呼叫

<!--
For more details, please visit: https://github.com/container-storage-interface/spec/blob/master/spec.md
-->

更多詳細資訊，請訪問： https://github.com/container-storage-interface/spec/blob/master/spec.md

<!--
## Extend CSI and Kubernetes
-->

## 擴充套件 CSI 和 Kubernetes

<!--
In order to enable the feature of expanding volume atop Kubernetes, we should extend several components including CSI specification, “in-tree” volume plugin, external-provisioner and external-attacher.
-->

為了實現在 Kubernetes 上擴展卷的功能，我們應該擴充套件幾個元件，包括 CSI 規範，“in-tree” 卷外掛，external-provisioner 和 external-attacher。

<!--
## Extend CSI spec
-->

## 擴充套件CSI規範

<!--
The feature of expanding volume is still undefined in latest CSI 0.2.0. The new 3 RPCs, including `RequiresFSResize` and `ControllerResizeVolume` and `NodeResizeVolume`, should be introduced.
-->

最新的 CSI 0.2.0 仍未定義擴展卷的功能。應該引入新的3個 RPC，包括 `RequiresFSResize`， `ControllerResizeVolume` 和 `NodeResizeVolume`。

```
service Controller {
 rpc CreateVolume (CreateVolumeRequest)
   returns (CreateVolumeResponse) {}
……
 rpc RequiresFSResize (RequiresFSResizeRequest)
   returns (RequiresFSResizeResponse) {}
 rpc ControllerResizeVolume (ControllerResizeVolumeRequest)
   returns (ControllerResizeVolumeResponse) {}
}

service Node {
 rpc NodeStageVolume (NodeStageVolumeRequest)
   returns (NodeStageVolumeResponse) {}
……
 rpc NodeResizeVolume (NodeResizeVolumeRequest)
   returns (NodeResizeVolumeResponse) {}
}
```

<!--
## Extend “In-Tree” Volume Plugin
-->

## 擴充套件 “In-Tree” 卷外掛

<!--
In addition to the extend CSI specification, the `csiPlugin﻿` interface within Kubernetes should also implement `expandablePlugin`. The `csiPlugin` interface will expand `PersistentVolumeClaim` representing for `ExpanderController`.
-->

除了擴充套件的 CSI 規範之外，Kubernetes 中的 `csiPlugin` 介面還應該實現 `expandablePlugin`。`csiPlugin` 介面將擴充套件代表 `ExpanderController` 的 `PersistentVolumeClaim`。

```go
type ExpandableVolumePlugin interface {
VolumePlugin
ExpandVolumeDevice(spec Spec, newSize resource.Quantity, oldSize resource.Quantity) (resource.Quantity, error)
RequiresFSResize() bool
}
```

<!--
### Implement Volume Driver
-->

### 實現卷驅動程式

<!--
Finally, to abstract complexity of the implementation, we should hard code the separate storage provider management logic into the following functions which is well-defined in the CSI specification:
-->

最後，為了抽象化實現的複雜性，我們應該將單獨的儲存提供程式管理邏輯硬編碼為以下功能，這些功能在 CSI 規範中已明確定義：

* CreateVolume
* DeleteVolume
* ControllerPublishVolume
* ControllerUnpublishVolume
* ValidateVolumeCapabilities
* ListVolumes
* GetCapacity
* ControllerGetCapabilities
* RequiresFSResize
* ControllerResizeVolume

<!--
## Demonstration

Let’s demonstrate this feature with a concrete user case.

* Create storage class for CSI storage provisioner
-->

## 展示

讓我們以具體的使用者案例來演示此功能。

* 為 CSI 儲存供應商建立儲存類

```yaml
allowVolumeExpansion: true
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-qcfs
parameters:
  csiProvisionerSecretName: orain-test
  csiProvisionerSecretNamespace: default
provisioner: csi-qcfsplugin
reclaimPolicy: Delete
volumeBindingMode: Immediate
```

<!--
* Deploy CSI Volume Driver including storage provisioner `csi-qcfsplugin` across Kubernetes cluster

* Create PVC `qcfs-pvc` which will be dynamically provisioned by storage class `csi-qcfs`
-->

* 在 Kubernetes 叢集上部署包括儲存供應商 `csi-qcfsplugin` 在內的 CSI 卷驅動

* 建立 PVC `qcfs-pvc`，它將由儲存類 `csi-qcfs` 動態配置

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: qcfs-pvc
  namespace: default
....
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 300Gi
  storageClassName: csi-qcfs
```
<!--
* Create MySQL 5.7 instance to use PVC `qcfs-pvc`
* In order to mirror the exact same production-level scenario, there are actually two different types of workloads including:
    * Batch insert to make MySQL consuming more file system capacity
    * Surge query request
* Dynamically expand volume capacity through edit pvc `qcfs-pvc` configuration
-->

* 建立 MySQL 5.7 例項以使用 PVC `qcfs-pvc`
* 為了反映完全相同的生產級別方案，實際上有兩種不同型別的工作負載，包括：
     * 批次插入使 MySQL 消耗更多的檔案系統容量
     * 浪湧查詢請求
* 透過編輯 pvc `qcfs-pvc` 配置動態擴展卷容量

<!--
The Prometheus and Grafana integration allows us to visualize corresponding critical metrics.

![prometheus grafana](/images/blog/2018-08-02-dynamically-expand-volume-csi/prometheus-grafana.png)

We notice that the middle reading shows MySQL datafile size increasing slowly during bulk inserting. At the same time, the bottom reading shows file system expanding twice in about 20 minutes, from 300 GiB to 400 GiB and then 500 GiB. Meanwhile, the upper reading shows the whole process of expanding volume immediately completes and hardly impacts MySQL QPS.
-->

Prometheus 和 Grafana 的整合使我們可以視覺化相應的關鍵指標。

![prometheus grafana](/images/blog/2018-08-02-dynamically-expand-volume-csi/prometheus-grafana.png)

我們注意到中間的讀數顯示在批次插入期間 MySQL 資料檔案的大小緩慢增加。 同時，底部讀數顯示檔案系統在大約20分鐘內擴充套件了兩次，從 300 GiB 擴充套件到 400 GiB，然後擴充套件到 500 GiB。 同時，上半部分顯示，擴展卷的整個過程立即完成，幾乎不會影響 MySQL QPS。

<!--
## Conclusion

Regardless of whatever infrastructure applications have been running on, the database is always a critical resource. It is essential to have a more advanced storage subsystem out there to fully support database requirements. This will help drive the more broad adoption of cloud native technology.
-->

## 結論

不管執行什麼基礎結構應用程式，資料庫始終是關鍵資源。擁有更高階的儲存子系統以完全支援資料庫需求至關重要。這將有助於推動雲原生技術的更廣泛採用。
