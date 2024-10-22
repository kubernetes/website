---
title: KubeletCrashLoopBackOffMax
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Enables support for configurable per-node backoff maximums for restarting
containers (aka containers in CrashLoopBackOff)