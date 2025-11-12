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
允许将从 `matchLabelKeys` 构建的选择算符合并到
[Pod 拓扑分布约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)的 `labelSelector` 中。
当 `matchLabelKeys` 特性通过 `MatchLabelKeysInPodTopologySpread` 特性标志启用时，此特性门控可以被启用。
