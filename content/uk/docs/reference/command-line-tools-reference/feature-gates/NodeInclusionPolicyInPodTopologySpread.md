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
Вмикає використання `nodeAffinityPolicy` та `nodeTaintsPolicy` в [Обмеження поширення топології Podʼів](/docs/concepts/scheduling-eviction/topology-spread-constraints/) при обчисленні відхилення розповсюдження топології вузлів.
