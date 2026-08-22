---
title: DownwardAPIAssignedResources
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---

<!--
Use `DownwardAPIAssignedResources` to control if kube-apiserver allows for mounting new fields in downwardAPI volume for container's CPU desired assignments.
-->
使用 `DownwardAPIAssignedResources` 来控制 kube-apiserver 是否允许在 downwardAPI 卷中挂载新字段，用于容器的 CPU 期望分配。
