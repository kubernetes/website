---
title: DRAPrioritizedList
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enables support for the [Prioritized List](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list)
feature. It makes it possible to specify a prioritized list of subrequests for requests in a ResourceClaim.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
-->
啓用對[優先級列表](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#prioritized-list)特性的支持。
這允許在 ResourceClaim 的請求中指定一個子請求的優先級列表。

想要此特性門控生效，你還需啓用 `DynamicResourceAllocation` 特性門控。
