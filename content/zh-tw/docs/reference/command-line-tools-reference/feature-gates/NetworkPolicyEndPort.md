---
title: NetworkPolicyEndPort
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"

removed: true
---

<!--
Allows you to define ports in a
[NetworkPolicy](/docs/concepts/services-networking/network-policies/)
rule as a range of port numbers.
-->
允許你在 [NetworkPolicy](/zh-cn/docs/concepts/services-networking/network-policies/)
規則中將端口設置爲一個端口號範圍。
