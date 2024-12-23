---
title: ServiceTrafficDistribution
content_type: feature_gate

_build:
  list: never
  render: false

stages:
- stage: alpha 
  defaultValue: false
  fromVersion: "1.30"
  toVersion: "1.30"
- stage: beta
  defaultValue: true
  fromVersion: "1.31"
---
Allows usage of the optional `spec.trafficDistribution` field in Services. The
field offers a way to express preferences for how traffic is distributed to
Service endpoints.
