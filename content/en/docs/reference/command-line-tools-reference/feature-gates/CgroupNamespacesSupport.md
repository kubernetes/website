---
title: CgroupNamespacesSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"

---
Enable cgroup namespace support for containers.
