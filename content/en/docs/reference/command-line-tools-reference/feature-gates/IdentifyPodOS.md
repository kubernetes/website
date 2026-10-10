---
# Removed from Kubernetes
title: IdentifyPodOS
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.23"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.24"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"    

removed: true  
---
Allows the Pod OS field to be specified. This helps in identifying
the OS of the pod authoritatively during the API server admission time.
