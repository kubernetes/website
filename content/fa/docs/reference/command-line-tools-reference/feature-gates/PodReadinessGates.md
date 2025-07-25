---
# Removed from Kubernetes
title: PodReadinessGates
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.12"
    toVersion: "1.13"
  - stage: stable
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"

removed: true
---
تنظیم فیلد `PodReadinessGate` را برای گسترش ارزیابی آمادگی پاد فعال کنید. برای جزئیات بیشتر به [Pod readygate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate) مراجعه کنید.
