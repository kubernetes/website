---
title: StorageCapacityScoring
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---

<!--
The feature gate `VolumeCapacityPriority` was used in v1.32 to support storage that are
statically provisioned. Starting from v1.33, the new feature gate `StorageCapacityScoring`
replaces the old `VolumeCapacityPriority` gate with added support to dynamically provisioned storage.
When `StorageCapacityScoring` is enabled, the VolumeBinding plugin in the kube-scheduler is extended
to score Nodes based on the storage capacity on each of them.
This feature is applicable to CSI volumes that supported [Storage Capacity](/docs/concepts/storage/storage-capacity/),
including local storage backed by a CSI driver.
-->
特性門控 `VolumeCapacityPriority` 在 v1.32 中用於支持靜態製備的存儲。
從 v1.33 開始，新的特性門控 `StorageCapacityScoring` 取代了舊的 `VolumeCapacityPriority` 特性門控，
並增加了對動態製備存儲的支持。當 `StorageCapacityScoring` 被啓用時，
kube-scheduler 中的 VolumeBinding 插件得到了擴展，可以基於每個節點上的存儲容量對 Node 進行評分。
此特性適用於已支持[存儲容量](/zh-cn/docs/concepts/storage/storage-capacity/) 的
CSI 卷，包括由 CSI 驅動所支持的本地存儲。
