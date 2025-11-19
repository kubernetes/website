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
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---

<!--
Enables the behaviors supporting the LeaseCandidate API, and also enables
coordinated leader election for the Kubernetes control plane, deterministically.
-->
啓用支持 LeaseCandidate API 的行爲，並且以確定性的方式爲 Kubernetes 控制平面啓用協調領導者選舉。
