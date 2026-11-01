---
title: DRAResourcePoolStatus
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
Enables the ResourcePoolStatusRequest API for querying the
[availability of devices in DRA resource pools](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resource-pool-status).
When enabled, users can create ResourcePoolStatusRequest objects to get a
point-in-time snapshot of device availability (total, allocated, available, and
unavailable devices) for a specific driver and optionally a specific pool.
A controller in kube-controller-manager processes these one-time requests and
populates the status with pool information.
-->
启用 ResourcePoolStatusRequest API 以查询
[DRA 资源池中的设备可用性](/zh-cn/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resource-pool-status)。
启用后，用户可以创建 ResourcePoolStatusRequest 对象，以获取特定驱动程序（以及可选的特定池）
的设备可用性（总数、已分配、可用和不可用设备）的时间点快照。
kube-controller-manager 中的控制器处理这些一次性请求并使用池信息填充状态。

