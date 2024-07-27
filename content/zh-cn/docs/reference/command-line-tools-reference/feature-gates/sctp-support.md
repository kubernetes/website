---
# Removed from Kubernetes
title: SCTPSupport
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.12"
    toVersion: "1.18"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.19"
  - stage: stable
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.22"

removed: true
---
<!--
Enables the _SCTP_ `protocol` value in Pod, Service, Endpoints, EndpointSlice,
and NetworkPolicy definitions.
-->
在 Pod、Service、Endpoints、NetworkPolicy 定义中允许将 **SCTP**
用作 `protocol` 值。
