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
  toVersion: "1.33"
- stage: beta
  defaultValue: true
  fromVersion: "1.34"
---

<!--
Allows usage of the values `PreferSameZone` and `PreferSameNode` in
the Service [`trafficDistribution`](/docs/reference/networking/virtual-ips/#traffic-distribution)
field.
-->
允许在 Service 的 [`trafficDistribution`](/zh-cn/docs/reference/networking/virtual-ips/#traffic-distribution)
字段中使用 `PreferSameZone` 和 `PreferSameNode` 这两个值。
