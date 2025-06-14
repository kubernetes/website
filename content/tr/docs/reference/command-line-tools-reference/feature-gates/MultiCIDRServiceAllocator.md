---
title: MultiCIDRServiceAllocator
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.30"
  - stage: beta
    defaultValue: false
    fromVersion: "1.31"
---
Track IP address allocations for Service cluster IPs using IPAddress objects.
