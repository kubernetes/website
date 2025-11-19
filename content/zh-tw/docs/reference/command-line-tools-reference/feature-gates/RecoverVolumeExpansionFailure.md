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
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34" 
---

<!--
Enables users to edit their PVCs to smaller
sizes so as they can recover from previously issued volume expansion failures.
See [Recovering from Failure when Expanding Volumes](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)
for more details.
-->
允許用戶編輯自己的 PVC 來縮容，以便從之前卷擴容引發的失敗中恢復。
更多細節可參見[處理擴充捲過程中的失敗](/zh-cn/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)。
