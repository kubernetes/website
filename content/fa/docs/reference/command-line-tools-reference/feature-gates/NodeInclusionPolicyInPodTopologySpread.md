---
title: NodeInclusionPolicyInPodTopologySpread
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---
فعال کردن استفاده از `nodeAffinityPolicy` و `nodeTaintsPolicy` در [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
هنگام محاسبه انحراف گسترش توپولوژی پاد.