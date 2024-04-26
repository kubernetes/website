---
title: DefaultHostNetworkHostPortsInPodTemplates
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.28"  
---
<!--
Changes when the default value of
`PodSpec.containers[*].ports[*].hostPort`
is assigned. The default is to only set a default value in Pods.

Enabling this means a default will be assigned even to embedded
PodSpecs (e.g. in a Deployment), which is the historical default.
-->
更改何时设置 `PodSpec.containers[*].ports[*].hostPort` 的默认值。
默认仅在 Pod 中设置默认值。

启用此特性意味着即使在嵌套的 PodSpec（例如 Deployment 中）中也会设置默认值，
这是以前的默认行为。
