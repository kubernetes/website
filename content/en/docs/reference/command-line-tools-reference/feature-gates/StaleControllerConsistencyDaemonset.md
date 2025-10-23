---
title: StaleControllerConsistencyDaemonset
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
A kube-controller-manager flag that enables the daemonset controller to ensure that prior writes to
the API server are observed before proceeding with additional reconciliation for the same daemonset.
This is to prevent stale cache from causing incorrect or spurious updates to the daemonset.