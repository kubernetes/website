---
title: ContainerStopSignals
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.37"
  - stage: beta
    defaultValue: true
    fromVersion: "1.38"
---
Enables usage of the StopSignal lifecycle for containers for configuring custom stop signals using which the containers would be stopped.
