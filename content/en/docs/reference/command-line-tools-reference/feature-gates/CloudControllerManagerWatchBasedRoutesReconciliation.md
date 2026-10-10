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
Enables a watch-based route reconciliation mechanism (rather than reconciling at a fixed interval)
within the cloud-controller-manager library.
