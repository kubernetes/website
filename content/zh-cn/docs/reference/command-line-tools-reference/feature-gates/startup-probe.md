---
# Removed from Kubernetes
title: StartupProbe
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.17"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.19"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.23"    

removed: true
---
<!--
Enable the [startup](/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)
probe in the kubelet.
-->
在 kubelet 中启用[启动探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)。
