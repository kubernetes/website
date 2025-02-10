---
title: MatchLabelKeysInPodAffinity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---

<!--
Enable the `matchLabelKeys` and `mismatchLabelKeys` field for
[pod (anti)affinity](/docs/concepts/scheduling-eviction/assign-pod-node/).
-->
为 [Pod（反）亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)启用
`matchLabelKeys` 和 `mismatchLabelKeys` 字段。
