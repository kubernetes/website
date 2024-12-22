---
# Removed from Kubernetes
title: DynamicProvisioningScheduling
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.11"
    toVersion: "1.11"
  - stage: deprecated
    fromVersion: "1.12"

removed: true  
---
Extend the default scheduler to be aware of
volume topology and handle PV provisioning.
This feature was superseded by the `VolumeScheduling` feature  in v1.12.
