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
---

<!--
Track IP address allocations for Service cluster IPs using IPAddress objects.
-->
使用 IPAddress 对象跟踪为 Service 的集群 IP 分配的 IP 地址。
