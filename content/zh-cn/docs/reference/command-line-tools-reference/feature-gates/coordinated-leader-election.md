---
title: CoordinatedLeaderElection
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
---

<!--
Enables the behaviors supporting the LeaseCandidate API, and also enables
coordinated leader election for the Kubernetes control plane, deterministically.
-->
启用支持 LeaseCandidate API 的行为，并且以确定性的方式为 Kubernetes 控制平面启用协调领导者选举。
