---
title: CSI 卷克隆
content_type: concept
weight: 70
---

<!--
reviewers:
- jsafrane
- saad-ali
- thockin
- msau42
title: CSI Volume Cloning
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
This document describes the concept of cloning existing CSI Volumes in Kubernetes.  
Familiarity with [Volumes](/docs/concepts/storage/volumes) is suggested.
-->
本文檔介紹 Kubernetes 中克隆現有 CSI 卷的概念。閱讀前建議先熟悉
[卷](/zh-cn/docs/concepts/storage/volumes)。

<!-- body -->

<!--
## Introduction

The {{< glossary_tooltip text="CSI" term_id="csi" >}} Volume Cloning feature adds 
support for specifying existing {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}s 
in the `dataSource` field to indicate a user would like to clone a {{< glossary_tooltip term_id="volume" >}}.
-->
## 介紹

{{< glossary_tooltip text="CSI" term_id="csi" >}} 卷克隆功能增加了通過在
`dataSource` 字段中指定存在的
{{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}，
來表示使用者想要克隆的 {{< glossary_tooltip term_id="volume" >}}。

<!--
A Clone is defined as a duplicate of an existing Kubernetes Volume that can be 
consumed as any standard Volume would be.  The only difference is that upon 
provisioning, rather than creating a "new" empty Volume, the back end device 
creates an exact duplicate of the specified Volume.
-->
克隆（Clone），意思是爲已有的 Kubernetes 卷創建副本，它可以像任何其它標準卷一樣被使用。
唯一的區別就是設定後，後端設備將創建指定完全相同的副本，而不是創建一個“新的”空卷。

<!--
The implementation of cloning, from the perspective of the Kubernetes API, adds 
the ability to specify an existing PVC as a dataSource during new PVC creation. 
The source PVC must be bound and available (not in use).

Users need to be aware of the following when using this feature:
-->
從 Kubernetes API 的角度看，克隆的實現只是在創建新的 PVC 時，
增加了指定一個現有 PVC 作爲資料源的能力。源 PVC 必須是 bound
狀態且可用的（不在使用中）。

使用者在使用該功能時，需要注意以下事項：

<!--
* Cloning support (`VolumePVCDataSource`) is only available for CSI drivers.
* Cloning support is only available for dynamic provisioners.
* CSI drivers may or may not have implemented the volume cloning functionality.
* You can only clone a PVC when it exists in the same namespace as the destination PVC 
  (source and destination must be in the same namespace).
* Cloning is supported with a different Storage Class.
    - Destination volume can be the same or a different storage class as the source.
    - Default storage class can be used and storageClassName omitted in the spec.
* Cloning can only be performed between two volumes that use the same VolumeMode setting 
  (if you request a block mode volume, the source MUST also be block mode)
-->
* 克隆支持（`VolumePVCDataSource`）僅適用於 CSI 驅動。
* 克隆支持僅適用於 動態供應器。
* CSI 驅動可能實現，也可能未實現卷克隆功能。
* 僅當 PVC 與目標 PVC 存在於同一命名空間（源和目標 PVC 必須在相同的命名空間）時，纔可以克隆 PVC。
* 支持用一個不同儲存類進行克隆。
    - 目標卷和源卷可以是相同的儲存類，也可以不同。
    - 可以使用預設的儲存類，也可以在 spec 中省略 storageClassName 字段。
* 克隆只能在兩個使用相同 VolumeMode 設置的卷中進行
  （如果請求克隆一個塊儲存模式的卷，源卷必須也是塊儲存模式）。

<!--
## Provisioning

Clones are provisioned like any other PVC with the exception of adding a dataSource that references an existing PVC in the same namespace.
-->
## 製備

克隆卷與其他任何 PVC 一樣設定，除了需要增加 dataSource 來引用同一命名空間中現有的 PVC。

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
    name: clone-of-pvc-1
    namespace: myns
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: cloning
  resources:
    requests:
      storage: 5Gi
  dataSource:
    kind: PersistentVolumeClaim
    name: pvc-1
```

{{< note >}}
<!--
You must specify a capacity value for `spec.resources.requests.storage`, and the 
value you specify must be the same or larger than the capacity of the source volume.
-->
你必須爲 `spec.resources.requests.storage` 指定一個值，並且你指定的值必須大於或等於源卷的值。
{{< /note >}}

<!--
The result is a new PVC with the name `clone-of-pvc-1` that has the exact same 
content as the specified source `pvc-1`.
-->
結果是一個名稱爲 `clone-of-pvc-1` 的新 PVC 與指定的源 `pvc-1` 擁有相同的內容。

<!--
## Usage

Upon availability of the new PVC, the cloned PVC is consumed the same as other PVC.  
It's also expected at this point that the newly created PVC is an independent object.  
It can be consumed, cloned, snapshotted, or deleted independently and without 
consideration for it's original dataSource PVC.  This also implies that the source 
is not linked in any way to the newly created clone, it may also be modified or 
deleted without affecting the newly created clone.
-->
## 使用

一旦新的 PVC 可用，被克隆的 PVC 像其他 PVC 一樣被使用。
可以預期的是，新創建的 PVC 是一個獨立的對象。
可以獨立使用、克隆、快照或刪除它，而不需要考慮它的原始資料源 PVC。
這也意味着，源沒有以任何方式鏈接到新創建的 PVC，它也可以被修改或刪除，而不會影響到新創建的克隆。

