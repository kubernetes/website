---
# Removed from Kubernetes
title: CSIMigrationAzureFileComplete
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
Stops registering the Azure-File in-tree
plugin in kubelet and volume controllers and enables shims and translation
logic to route volume operations from the Azure-File in-tree plugin to
AzureFile CSI plugin. Requires CSIMigration and CSIMigrationAzureFile feature
flags  enabled and AzureFile CSI plugin installed and configured on all nodes
in the cluster. This flag has been deprecated in favor of the
`InTreePluginAzureFileUnregister` feature flag which prevents the registration
 of in-tree AzureFile plugin.
