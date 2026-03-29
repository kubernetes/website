---
title: UnlockWhileProcessingFIFO
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

Client-go FIFO queue that unlocks while processing events. Previously, the queue would hold the lock
for the entire duration of processing events, which could lead to performance issues in
high-throughput scenarios. This feature gate can be toggled in the kube-controller-manager and any
client-go based controller. This feature relies on the AtomicFIFO feature gate to be enabled.