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
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Enables support for requesting [admin access](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access)
in a ResourceClaim or a ResourceClaimTemplate. Admin access grants access to
in-use devices and may enable additional permissions when making the device
available in a container. Starting with Kubernetes v1.33, only users authorized
to create ResourceClaim or ResourceClaimTemplate objects in namespaces labeled
with `resource.kubernetes.io/admin-access: "true"` (case-sensitive) can use the
`adminAccess` field. This ensures that non-admin users cannot misuse the
feature. Starting with Kubernetes v1.34, this label has been updated to `resource.kubernetes.io/admin-access: "true"`.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
-->
啓用在 ResourceClaim 或 ResourceClaimTemplate
中對請求[管理員訪問權限](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access)的支持。
管理員訪問權限允許訪問正在使用的設備，並且可以在允許容器訪問設備時啓用額外的訪問權限。
從 Kubernetes v1.33 開始，只有被授權在帶有標籤 `resource.kubernetes.io/admin-access: "true"`
（區分大小寫）的命名空間中創建 `ResourceClaim` 或 `ResourceClaimTemplate` 對象的用戶，
才能使用 `adminAccess` 字段。這一機制確保了非管理員用戶不會濫用此特性。從 Kubernetes v1.34
開始，此標籤已更新爲 `resource.kubernetes.io/admin-access: "true"`。

想要此特性門控生效，你還需啓用 `DynamicResourceAllocation` 特性門控。
