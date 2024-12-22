---
title: CSIMigrationGCE
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: beta
    defaultValue: false
    fromVersion: "1.17"  
    toVersion: "1.22" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"  
    toVersion: "1.24" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.27" 

removed: true
---
Enables shims and translation logic to route volume
operations from the GCE-PD in-tree plugin to PD CSI plugin. Supports falling
back to in-tree GCE plugin for mount operations to nodes that have the
feature disabled or that do not have PD CSI plugin installed and configured.
Does not support falling back for provision operations, for those the CSI
plugin must be installed and configured. Requires CSIMigration feature flag
enabled.
