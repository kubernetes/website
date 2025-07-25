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
اجازه استفاده از مقادیر `PreferSameZone` و `PreferSameNode` را در فیلد Service [`trafficDistribution`](/docs/reference/networking/virtual-ips/#traffic-distribution) می‌دهد.