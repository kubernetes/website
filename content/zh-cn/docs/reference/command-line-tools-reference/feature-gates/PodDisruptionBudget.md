---
# Removed from Kubernetes
title: PodDisruptionBudget
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.3"
    toVersion: "1.4"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.5"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.25"

removed: true
---

<!--
Enable the [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) feature.
-->
启用 [PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/) 特性。
