---
# Removed from Kubernetes
title: NodeDisruptionExclusion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.18"
  - stage: beta
    defaultValue: true
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---
Дозволяє використовувати мітку вузла `node.kubernetes.io/exclude-disruption`, яка запобігає евакуації вузлів під час збоїв у зоні.
