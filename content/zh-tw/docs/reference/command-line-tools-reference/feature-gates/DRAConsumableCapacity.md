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
允許在多個 ResourceClaim 或請求共享設備。

此外，如果某個設備支持共享，其資源（容量）可以通過定義的共享策略進行管理。
