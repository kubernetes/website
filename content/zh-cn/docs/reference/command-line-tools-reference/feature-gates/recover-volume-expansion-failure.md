---
title: RecoverVolumeExpansionFailure
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
---

<!--
Enables users to edit their PVCs to smaller
sizes so as they can recover from previously issued volume expansion failures.
See [Recovering from Failure when Expanding Volumes](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)
for more details.
-->
允许用户编辑自己的 PVC 来缩容，以便从之前卷扩容引发的失败中恢复。
更多细节可参见[处理扩充卷过程中的失败](/zh-cn/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)。
