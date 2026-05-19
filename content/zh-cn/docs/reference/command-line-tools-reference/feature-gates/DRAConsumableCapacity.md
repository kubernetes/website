---
title: DRAConsumableCapacity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

<!--
Enables device sharing across multiple ResourceClaims or requests.

Additionally, if a device supports sharing, its resource (capacity) can be managed through a defined sharing policy.
-->
允许在多个 ResourceClaim 或请求共享设备。

此外，如果某个设备支持共享，其资源（容量）可以通过定义的共享策略进行管理。
