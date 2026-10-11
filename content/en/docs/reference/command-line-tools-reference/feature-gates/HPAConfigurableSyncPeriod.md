---
title: HPAConfigurableSyncPeriod
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables setting `spec.syncPeriodSeconds` for individual
HorizontalPodAutoscaler objects. This field overrides the cluster-wide
`--horizontal-pod-autoscaler-sync-period` value for that object. The feature
gate must be enabled for both the `kube-apiserver` and
`kube-controller-manager`.
