---
# Removed from Kubernetes
title: GenericEphemeralVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    

removed: true  
---
Enables ephemeral, inline volumes that support all features
of normal volumes (can be provided by third-party storage vendors, storage capacity tracking,
restore from snapshot, etc.).
See [Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/).
