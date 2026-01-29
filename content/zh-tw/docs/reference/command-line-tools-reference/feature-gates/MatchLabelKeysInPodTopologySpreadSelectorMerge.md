---
title: MatchLabelKeysInPodTopologySpreadSelectorMerge
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enable merging of selectors built from `matchLabelKeys` into `labelSelector` of 
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
This feature gate can be enabled when `matchLabelKeys` feature is enabled with the `MatchLabelKeysInPodTopologySpread` feature flag.
-->
允許將從 `matchLabelKeys` 構建的選擇算符合併到
[Pod 拓撲分佈約束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)的 `labelSelector` 中。
當 `matchLabelKeys` 特性通過 `MatchLabelKeysInPodTopologySpread` 特性標誌啓用時，此特性門控可以被啓用。
