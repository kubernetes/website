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
    toVersion: "1.32"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.33"
---

<!--
Allow setting the `restartPolicy` of an init container to
`Always` so that the container becomes a sidecar container (restartable init containers).
See [Sidecar containers and restartPolicy](/docs/concepts/workloads/pods/sidecar-containers/)
for more details.
-->
允許將 Init 容器的 `restartPolicy` 設置爲 `Always`，
以便該容器成爲一個邊車容器（可重啓的 Init 容器）。
詳情參見[邊車容器和 restartPolicy](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)。
