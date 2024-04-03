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
---

<!--
Enables support for joining Windows containers to a hosts' network namespace.
-->
启用对 Windows 容器接入主机网络名字空间的支持。
