---
# Removed from Kubernetes
title: PodSecurity
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.27"

removed: true
---

<!--
Enables the `PodSecurity` admission plugin.
-->
启用 `PodSecurity` 准入插件。
