---
# Removed from Kubernetes
title: DynamicKubeletConfig
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.4"
    toVersion: "1.10"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.21"    
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.25"    

removed: true  
---
Enable the dynamic configuration of kubelet. The
feature is no longer supported outside of supported skew policy. The feature
gate was removed from kubelet in 1.24.
