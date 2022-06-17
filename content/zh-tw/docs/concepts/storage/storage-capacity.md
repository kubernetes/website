---
title: 儲存容量
content_type: concept
weight: 70
---

<!-- overview -->
<!--
Storage capacity is limited and may vary depending on the node on
which a pod runs: network-attached storage might not be accessible by
all nodes, or storage is local to a node to begin with.

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

This page describes how Kubernetes keeps track of storage capacity and
how the scheduler uses that information to [schedule Pods](/docs/concepts/scheduling-eviction/) onto nodes
that have access to enough storage capacity for the remaining missing
volumes. Without storage capacity tracking, the scheduler may choose a
node that doesn't have enough capacity to provision a volume and
multiple scheduling retries will be needed.
-->
儲存容量是有限的，並且會因為執行 Pod 的節點不同而變化：
網路儲存可能並非所有節點都能夠訪問，或者對於某個節點儲存是本地的。

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

本頁面描述了 Kubernetes 如何跟蹤儲存容量以及排程程式如何為了餘下的尚未掛載的卷使用該資訊將
[Pod 排程](/zh-cn/docs/concepts/scheduling-eviction/)到能夠訪問到足夠儲存容量的節點上。
如果沒有跟蹤儲存容量，排程程式可能會選擇一個沒有足夠容量來提供卷的節點，並且需要多次排程重試。

## {{% heading "prerequisites" %}}

<!--
Kubernetes v{{< skew currentVersion >}} includes cluster-level API support for
storage capacity tracking. To use this you must also be using a CSI driver that
supports capacity tracking. Consult the documentation for the CSI drivers that
you use to find out whether this support is available and, if so, how to use
it. If you are not running Kubernetes v{{< skew currentVersion >}}, check the
documentation for that version of Kubernetes.
-->
Kubernetes v{{< skew currentVersion >}} 包含了對儲存容量跟蹤的叢集級 API 支援。
要使用它，你還必須使用支援容量跟蹤的 CSI 驅動程式。請查閱你使用的 CSI 驅動程式的文件，
以瞭解此支援是否可用，如果可用，該如何使用它。如果你執行的不是
Kubernetes v{{< skew currentVersion >}}，請檢視對應版本的 Kubernetes 文件。

<!-- body -->
<!--
## API

There are two API extensions for this feature:
- [CSIStorageCapacity](/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/) objects:
  these get produced by a CSI driver in the namespace
  where the driver is installed. Each object contains capacity
  information for one storage class and defines which nodes have
  access to that storage.
- [The `CSIDriverSpec.StorageCapacity` field](/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/#CSIDriverSpec):
  when set to `true`, the Kubernetes scheduler will consider storage
  capacity for volumes that use the CSI driver.
-->
## API

這個特性有兩個 API 擴充套件介面：
- [CSIStorageCapacity](/docs/reference/kubernetes-api/config-and-storage-resources/csi-storage-capacity-v1/) 物件：這些物件由
  CSI 驅動程式在安裝驅動程式的名稱空間中產生。
  每個物件都包含一個儲存類的容量資訊，並定義哪些節點可以訪問該儲存。
- [`CSIDriverSpec.StorageCapacity` 欄位](/docs/reference/kubernetes-api/config-and-storage-resources/csi-driver-v1/#CSIDriverSpec)：
  設定為 true 時，Kubernetes 排程程式將考慮使用 CSI 驅動程式的卷的儲存容量。

<!--
## Scheduling

Storage capacity information is used by the Kubernetes scheduler if:
- a Pod uses a volume that has not been created yet,
- that volume uses a {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} which references a CSI driver and
  uses `WaitForFirstConsumer` [volume binding
  mode](/docs/concepts/storage/storage-classes/#volume-binding-mode),
  and
- the `CSIDriver` object for the driver has `StorageCapacity` set to
  true.

In that case, the scheduler only considers nodes for the Pod which
have enough storage available to them. This check is very
simplistic and only compares the size of the volume against the
capacity listed in `CSIStorageCapacity` objects with a topology that
includes the node.

For volumes with `Immediate` volume binding mode, the storage driver
decides where to create the volume, independently of Pods that will
use the volume. The scheduler then schedules Pods onto nodes where the
volume is available after the volume has been created.

For [CSI ephemeral volumes](/docs/concepts/storage/volumes/#csi),
scheduling always happens without considering storage capacity. This
is based on the assumption that this volume type is only used by
special CSI drivers which are local to a node and do not need
significant resources there.
-->
## 排程

如果有以下情況，儲存容量資訊將會被 Kubernetes 排程程式使用：
- Pod 使用的卷還沒有被建立，
- 卷使用引用了 CSI 驅動的 {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}}，
並且使用了 `WaitForFirstConsumer` [卷繫結模式](/zh-cn/docs/concepts/storage/storage-classes/#volume-binding-mode)，
- 驅動程式的 `CSIDriver` 物件的 `StorageCapacity` 被設定為 true。

在這種情況下，排程程式僅考慮將 Pod 排程到有足夠儲存容量的節點上。這個檢測非常簡單，
僅將卷的大小與 `CSIStorageCapacity` 物件中列出的容量進行比較，並使用包含該節點的拓撲。

對於具有 `Immediate` 卷繫結模式的卷，儲存驅動程式將決定在何處建立該卷，而不取決於將使用該卷的 Pod。
然後，排程程式將 Pod 排程到建立卷後可使用該卷的節點上。

對於 [CSI 臨時卷](/zh-cn/docs/concepts/storage/volumes/#csi)，排程總是在不考慮儲存容量的情況下進行。
這是基於這樣的假設：該卷型別僅由節點本地的特殊 CSI 驅動程式使用，並且不需要大量資源。

<!--
## Rescheduling

When a node has been selected for a Pod with `WaitForFirstConsumer`
volumes, that decision is still tentative. The next step is that the
CSI storage driver gets asked to create the volume with a hint that the
volume is supposed to be available on the selected node.

Because Kubernetes might have chosen a node based on out-dated
capacity information, it is possible that the volume cannot really be
created. The node selection is then reset and the Kubernetes scheduler
tries again to find a node for the Pod.
-->
## 重新排程

當為帶有 `WaitForFirstConsumer` 的卷的 Pod 來選擇節點時，該決定仍然是暫定的。
下一步是要求 CSI 儲存驅動程式建立卷，並提示該卷在被選擇的節點上可用。

因為 Kubernetes 可能會根據已經過時的儲存容量資訊來選擇一個節點，因此可能無法真正建立卷。
然後就會重置節點選擇，Kubernetes 排程器會再次嘗試為 Pod 查詢節點。

<!--
## Limitations

Storage capacity tracking increases the chance that scheduling works
on the first try, but cannot guarantee this because the scheduler has
to decide based on potentially out-dated information. Usually, the
same retry mechanism as for scheduling without any storage capacity
information handles scheduling failures.

One situation where scheduling can fail permanently is when a Pod uses
multiple volumes: one volume might have been created already in a
topology segment which then does not have enough capacity left for
another volume. Manual intervention is necessary to recover from this,
for example by increasing capacity or deleting the volume that was
already created.
-->
## 限制

儲存容量跟蹤增加了排程器第一次嘗試即成功的機會，但是並不能保證這一點，因為排程器必須根據可能過期的資訊來進行決策。
通常，與沒有任何儲存容量資訊的排程相同的重試機制可以處理排程失敗。

當 Pod 使用多個卷時，排程可能會永久失敗：一個卷可能已經在拓撲段中建立，而該卷又沒有足夠的容量來建立另一個卷，
要想從中恢復，必須要進行手動干預，比如透過增加儲存容量或者刪除已經建立的卷。

## {{% heading "whatsnext" %}}

<!--
- For more information on the design, see the
[Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1472-storage-capacity-tracking/README.md).
-->
- 想要獲得更多該設計的資訊，檢視
  [Storage Capacity Constraints for Pod Scheduling KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/1472-storage-capacity-tracking/README.md)。
