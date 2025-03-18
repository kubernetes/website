---
title: MatchLabelKeysInPodTopologySpreadSelectorMerge
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
Enable merging of selectors built from `matchLabelKeys` into `labelSelector` of 
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).