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

<!--
Enable the
[Pod Affinity Namespace Selector](/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector)
and [CrossNamespacePodAffinity](/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota)
quota scope features.
-->
启用 [Pod 亲和性名字空间选择算符](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector)和
[CrossNamespacePodAffinity](/zh-cn/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota)
资源配额特性。
