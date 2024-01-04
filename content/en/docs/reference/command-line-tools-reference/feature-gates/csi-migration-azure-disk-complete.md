---
# Removed from Kubernetes
title: CSIMigrationAzureDiskComplete
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.20"
  - stage: deprecated
    fromVersion: "1.21"
    toVersion: "1.21"

removed: true
---
Stops registering the Azure-Disk in-tree
plugin in kubelet and volume controllers and enables shims and translation
logic to route volume operations from the Azure-Disk in-tree plugin to
AzureDisk CSI plugin. Requires CSIMigration and CSIMigrationAzureDisk feature
flags enabled and AzureDisk CSI plugin installed and configured on all nodes
in the cluster. This flag has been deprecated in favor of the
`InTreePluginAzureDiskUnregister` feature flag which prevents the registration
of in-tree AzureDisk plugin.
