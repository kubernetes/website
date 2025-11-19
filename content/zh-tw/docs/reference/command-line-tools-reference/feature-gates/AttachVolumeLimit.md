---
# Removed from Kubernetes
title: AttachVolumeLimit
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.16"
  - stage: stable
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.21"

removed: true
---

<!--
Enable volume plugins to report limits on number of volumes
that can be attached to a node.
See [dynamic volume limits](/docs/concepts/storage/storage-limits/#dynamic-volume-limits)
for more details.
-->
啓用卷插件用於報告可連接到節點的卷數限制。
更多細節參閱[動態卷限制](/zh-cn/docs/concepts/storage/storage-limits/#dynamic-volume-limits)。
