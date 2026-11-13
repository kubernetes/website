---
title: InPlacePodVerticalScalingInitContainers
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
Enables in-place resize of CPU and memory resources of running non-restartable
(non-sidecar) init containers.
