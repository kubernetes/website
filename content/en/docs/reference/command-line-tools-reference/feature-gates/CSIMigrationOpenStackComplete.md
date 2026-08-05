---
# Removed from Kubernetes
title: CSIMigrationOpenStackComplete
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
Stops registering the Cinder in-tree plugin in
kubelet and volume controllers and enables shims and translation logic to route
volume operations from the Cinder in-tree plugin to Cinder CSI plugin.
Requires CSIMigration and CSIMigrationOpenStack feature flags enabled and Cinder
CSI plugin installed and configured on all nodes in the cluster. This flag has
been deprecated in favor of the `InTreePluginOpenStackUnregister` feature flag
which prevents the registration of in-tree openstack cinder plugin.
