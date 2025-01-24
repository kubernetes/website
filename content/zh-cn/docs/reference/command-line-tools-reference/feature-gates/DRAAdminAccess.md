---
title: DRAAdminAccess
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enables support for requesting [admin access](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access)
in a ResourceClaim. A ResourceClaim
with admin access grants access to devices which are in use and may enable
additional access permissions when making the device available in a container.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
-->
启用在 ResourceClaim
中对请求[管理员访问权限](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access)的支持。
具有管理员访问权限的 ResourceClaim 允许访问正在使用的设备，并且可以在允许容器访问设备时启用额外的访问权限。

想要此特性门控生效，你还需启用 `DynamicResourceAllocation` 特性门控。
