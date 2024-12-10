---
# Removed from Kubernetes
title: PodAffinityNamespaceSelector
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"

removed: true
---
Вмикає функції [селектора простору імен за спорідненістю Podʼа](/uk/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector) та [CrossNamespacePodAffinity](/uk/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota) діапазону квотування.
