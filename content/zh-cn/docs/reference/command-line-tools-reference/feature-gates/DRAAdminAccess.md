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
-->
启用在 ResourceClaim 或 ResourceClaimTemplate
中对请求[管理员访问权限](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#admin-access)的支持。
管理员访问权限允许访问正在使用的设备，并且可以在允许容器访问设备时启用额外的访问权限。
从 Kubernetes v1.33 开始，只有被授权在带有标签 `resource.kubernetes.io/admin-access: "true"`
（区分大小写）的命名空间中创建 `ResourceClaim` 或 `ResourceClaimTemplate` 对象的用户，
才能使用 `adminAccess` 字段。这一机制确保了非管理员用户不会滥用此特性。从 Kubernetes v1.34
开始，此标签已更新为 `resource.kubernetes.io/admin-access: "true"`。
