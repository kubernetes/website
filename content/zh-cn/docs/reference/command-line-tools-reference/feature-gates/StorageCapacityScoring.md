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
特性门控 `VolumeCapacityPriority` 在 v1.32 中用于支持静态制备的存储。
从 v1.33 开始，新的特性门控 `StorageCapacityScoring` 取代了旧的 `VolumeCapacityPriority` 特性门控，
并增加了对动态制备存储的支持。当 `StorageCapacityScoring` 被启用时，
kube-scheduler 中的 VolumeBinding 插件得到了扩展，可以基于每个节点上的存储容量对 Node 进行评分。
此特性适用于已支持[存储容量](/zh-cn/docs/concepts/storage/storage-capacity/) 的
CSI 卷，包括由 CSI 驱动所支持的本地存储。
