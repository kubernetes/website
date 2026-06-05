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

Enable use of a FIFO queue within client-go that unlocks while processing events. If not enabled, 
the queue instead holds the lock for the entire duration of processing events, which could lead 
to performance issues in high-throughput scenarios. This feature gate can be toggled in the
kube-controller-manager and any client-go based controller.

You can only enable this feature gate if the
[AtomicFIFO](/docs/reference/command-line-tools-reference/feature-gates/#AtomicFIFO) feature gate is also enabled.