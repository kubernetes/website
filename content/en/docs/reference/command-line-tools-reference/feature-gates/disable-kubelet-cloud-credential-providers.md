---
title: DisableKubeletCloudCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.28"    
  - stage: beta 
    defaultValue: true
    fromVersion: "1.29"     
---
Disable the in-tree functionality in kubelet
to authenticate to a cloud provider container registry for image pull credentials.
