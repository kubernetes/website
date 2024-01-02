---
title: SidecarContainers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
---
<!--
Allow setting the `restartPolicy` of an init container to
`Always` so that the container becomes a sidecar container (restartable init containers).
See [Sidecar containers and restartPolicy](/docs/concepts/workloads/pods/sidecar-containers/)
for more details.
-->
允许将 Init 容器的 `restartPolicy` 设置为 `Always`，
以便该容器成为一个边车容器（可重启的 Init 容器）。
详情参见[边车容器和 restartPolicy](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)。
