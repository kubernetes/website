---
title: PreferSameTrafficDistribution
content_type: feature_gate

_build:
  list: never
  render: false

stages:
- stage: alpha 
  defaultValue: false
  fromVersion: "1.33"
---
Allows usage of the values `PreferSameZone` and `PreferSameNode` in
the Service [`trafficDistribution`](/docs/reference/networking/virtual-ips/#traffic-distribution)
field.
