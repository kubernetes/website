---
title: DRAWorkloadResourceClaims
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enables PodGroup resources from the
[Workload API](/docs/concepts/workloads/workload-api/) to make requests for
devices through
[Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
that can be shared by their member Pods.
-->
启用来自 [Workload API](/zh-cn/docs/concepts/workloads/workload-api/)
的 PodGroup 资源，
通过[动态资源分配](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
发出设备请求，这些设备可由其成员 Pod 共享。

