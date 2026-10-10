---
# Removed from Kubernetes
title: CSIMigrationAzureDisk
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.15"
    toVersion: "1.18"
  - stage: beta
    defaultValue: false
    fromVersion: "1.19"  
    toVersion: "1.22" 
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"  
    toVersion: "1.23" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.26"     

removed: true
---
Enables shims and translation logic to route volume
operations from the Azure-Disk in-tree plugin to AzureDisk CSI plugin.
Supports falling back to in-tree AzureDisk plugin for mount operations to
nodes that have the feature disabled or that do not have AzureDisk CSI plugin
installed and configured. Does not support falling back for provision
operations, for those the CSI plugin must be installed and configured.
Requires CSIMigration feature flag enabled.
