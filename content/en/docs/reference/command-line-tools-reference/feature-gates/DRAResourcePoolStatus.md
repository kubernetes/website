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
Enables the ResourcePoolStatusRequest API for querying the
[availability of devices in DRA resource pools](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resource-pool-status).
When enabled, users can create ResourcePoolStatusRequest objects to get a
point-in-time snapshot of device availability (total, allocated, available, and
unavailable devices) for a specific driver and optionally a specific pool.
A controller in kube-controller-manager processes these one-time requests and
populates the status with pool information.
