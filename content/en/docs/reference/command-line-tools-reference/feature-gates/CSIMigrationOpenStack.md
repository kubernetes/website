---
# Removed from Kubernetes
title: CSIMigrationOpenStack
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.17"  
  - stage: beta 
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"    

removed: true
---
Enables shims and translation logic to route volume
operations from the Cinder in-tree plugin to Cinder CSI plugin. Supports
falling back to in-tree Cinder plugin for mount operations to nodes that have
the feature disabled or that do not have Cinder CSI plugin installed and
configured. Does not support falling back for provision operations, for those
the CSI plugin must be installed and configured. Requires CSIMigration
feature flag enabled.
