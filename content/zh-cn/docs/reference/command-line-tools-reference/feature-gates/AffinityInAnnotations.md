---
# Removed from Kubernetes
title: AffinityInAnnotations
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.6"
    toVersion: "1.7"
  - stage: deprecated
    fromVersion: "1.8"
    toVersion: "1.8"

removed: true
---

<!--
Enable setting
[Pod affinity or anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).
-->
启用
[Pod 亲和性或反亲和性](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)设置。
