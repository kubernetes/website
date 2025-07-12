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
Дозволяє використовувати значення `PreferSameZone` та `PreferSameNode` у полі Service [`trafficDistribution`](/docs/reference/networking/virtual-ips/#traffic-distribution).
