---
title: CloudControllerManagerWatchBasedRoutesReconciliation
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Enables a watch-based route reconciliation mechanism in the cloud-controller-manager that reacts to node changes instead of using a static reconciliation interval.
