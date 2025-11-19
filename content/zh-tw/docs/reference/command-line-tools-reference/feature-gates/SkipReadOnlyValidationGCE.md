---
title: SkipReadOnlyValidationGCE
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: deprecated
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"

removed: true
---

<!--
Skip validation that GCE PersistentDisk volumes are in read-only mode.
-->
跳過對 GCE PersistentDisk 卷處於只讀模式的驗證。
