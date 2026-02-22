---
title: DRAExtendedResource
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---
Enables support for the [Extended Resource allocation by DRA](/docs/concepts/configuration/manage-resources-containers/#extended-resources-allocation-by-dra) feature.
It makes it possible to specify an extended resource name in a DeviceClass.
