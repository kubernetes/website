---
title: 卷快照類
content_type: concept
weight: 41 # 置於卷快照章節後
---

<!-- overview -->

<!--
This document describes the concept of VolumeSnapshotClass in Kubernetes. Familiarity
with [volume snapshots](/docs/concepts/storage/volume-snapshots/) and
[storage classes](/docs/concepts/storage/storage-classes) is suggested.
-->
本文件描述了 Kubernetes 中 VolumeSnapshotClass 的概念。建議熟悉
[卷快照（Volume Snapshots）](/zh-cn/docs/concepts/storage/volume-snapshots/)和
[儲存類（Storage Class）](/zh-cn/docs/concepts/storage/storage-classes)。


<!-- body -->

<!--
## Introduction

Just like StorageClass provides a way for administrators to describe the "classes"
of storage they offer when provisioning a volume, VolumeSnapshotClass provides a
way to describe the "classes" of storage when provisioning a volume snapshot.
-->
## 介紹 {#introduction}

就像 StorageClass 為管理員提供了一種在配置卷時描述儲存“類”的方法，
VolumeSnapshotClass 提供了一種在配置卷快照時描述儲存“類”的方法。

<!--
## The VolumeSnapshotClass Resource

Each VolumeSnapshotClass contains the fields `driver`, `deletionPolicy`, and `parameters`,
which are used when a VolumeSnapshot belonging to the class needs to be
dynamically provisioned.

The name of a VolumeSnapshotClass object is significant, and is how users can
request a particular class. Administrators set the name and other parameters
of a class when first creating VolumeSnapshotClass objects, and the objects cannot
be updated once they are created.

{{< note >}}
Installation of the CRDs is the responsibility of the Kubernetes distribution. Without the required CRDs present, the creation of a VolumeSnapshotClass fails.  
{{< /note >}}

-->
## VolumeSnapshotClass 資源  {#the-volumesnapshortclass-resource}

每個 VolumeSnapshotClass 都包含 `driver`、`deletionPolicy` 和 `parameters` 欄位，
在需要動態配置屬於該類的 VolumeSnapshot 時使用。

VolumeSnapshotClass 物件的名稱很重要，是使用者可以請求特定類的方式。
管理員在首次建立 VolumeSnapshotClass 物件時設定類的名稱和其他引數，
物件一旦建立就無法更新。

{{< note >}}
CRD 的安裝是 Kubernetes 發行版的責任。 如果不存在所需的 CRD，則 VolumeSnapshotClass 的建立將失敗。
{{< /note >}}

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

<!--
Administrators can specify a default VolumeSnapshotClass for VolumeSnapshots
that don't request any particular class to bind to by adding the
`snapshot.storage.kubernetes.io/is-default-class: "true"` annotation:
-->
管理員可以為未請求任何特定類繫結的 VolumeSnapshots 指定預設的 VolumeSnapshotClass，
方法是設定註解 `snapshot.storage.kubernetes.io/is-default-class: "true"`：

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: csi-hostpath-snapclass
  annotations:
    snapshot.storage.kubernetes.io/is-default-class: "true"
driver: hostpath.csi.k8s.io
deletionPolicy: Delete
parameters:
```

<!--
### Driver

Volume snapshot classes have a driver that determines what CSI volume plugin is
used for provisioning VolumeSnapshots. This field must be specified.
-->
### 驅動程式 {#driver}

卷快照類有一個驅動程式，用於確定配置 VolumeSnapshot 的 CSI 卷外掛。
此欄位必須指定。

<!--
### DeletionPolicy

Volume snapshot classes have a deletionPolicy. It enables you to configure what happens to a VolumeSnapshotContent when the VolumeSnapshot object it is bound to is to be deleted. The deletionPolicy of a volume snapshot class can either be `Retain` or `Delete`. This field must be specified.

If the deletionPolicy is `Delete`, then the underlying storage snapshot will be deleted along with the VolumeSnapshotContent object. If the deletionPolicy is `Retain`, then both the underlying snapshot and VolumeSnapshotContent remain.
-->
### 刪除策略 {#deletion-policy}

卷快照類具有 `deletionPolicy` 屬性。使用者可以配置當所繫結的 VolumeSnapshot
物件將被刪除時，如何處理 VolumeSnapshotContent 物件。
卷快照類的這個策略可以是 `Retain` 或者 `Delete`。這個策略欄位必須指定。

如果刪除策略是 `Delete`，那麼底層的儲存快照會和 VolumeSnapshotContent 物件
一起刪除。如果刪除策略是 `Retain`，那麼底層快照和 VolumeSnapshotContent
物件都會被保留。

<!--
## Parameters

Volume snapshot classes have parameters that describe volume snapshots belonging to
the volume snapshot class. Different parameters may be accepted depending on the
`driver`.
-->
## 引數 {#parameters}

卷快照類具有描述屬於該卷快照類的卷快照的引數，可根據 `driver` 接受不同的引數。
