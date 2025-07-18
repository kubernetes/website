---
title: DRAResourceSliceMixins
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---
Enable support for Mixins in DRA ResourceSlice objects.
There are scenarios where the number of devices can be pretty large and each device might have a relatively large amount of metadata associated with it,
primarily in the form of Attributes or Capacity. The resulting objects can thus become very large.
Mixins provides a way to define shared metadata for devices or counter sets separately from devices and then include them by reference.
This enables less duplication of information in ResourceSlices and smaller footprint for each device in terms of size.

This feature gate has no effect unless you also enable the `DynamicResourceAllocation` feature gate.
