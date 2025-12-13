---
title: DRADeviceTaintRules
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Enables support for
[tainting devices through DeviceTaintRule objects](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#device-taints-and-tolerations)
when using dynamic resource allocation to manage devices.

This feature gate has no effect unless you also enable the `DRADeviceTaint` feature gate.
