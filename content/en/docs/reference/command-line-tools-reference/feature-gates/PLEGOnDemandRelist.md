---
title: PLEGOnDemandRelist
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
    toVersion: "1.36"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.37"
---
Allow the kubelet to ask its Pod Lifecycle Event Generator (PLEG) to relist
an individual Pod on demand, in addition to the periodic relist of all Pods.
