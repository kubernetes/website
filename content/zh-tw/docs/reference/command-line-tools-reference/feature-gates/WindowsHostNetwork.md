---
title: WindowsHostNetwork
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enables support for joining Windows containers to a hosts' network namespace.
-->
啓用對 Windows 容器接入主機網絡名字空間的支持。
