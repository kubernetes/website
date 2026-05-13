---
title: MatchLabelKeysInPodTopologySpread
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.27"
---

Enable the `matchLabelKeys` field for
[Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
