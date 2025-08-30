---
# Removed from Kubernetes
title: DynamicVolumeProvisioning
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: true
    fromVersion: "1.3"
    toVersion: "1.7"
  - stage: stable
    defaultValue: true
    fromVersion: "1.8"
    toVersion: "1.12"    

removed: true  
---
فعال کردن [dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/) مربوط به Volumeهای دائمی برای Podها.
