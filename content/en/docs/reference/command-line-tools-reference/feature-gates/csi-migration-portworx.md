---
title: CSIMigrationPortworx
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.24"
  - stage: beta
    defaultValue: false
    fromVersion: "1.25"
---
Enables shims and translation logic to route volume operations
from the Portworx in-tree plugin to Portworx CSI plugin.
Requires Portworx CSI driver to be installed and configured in the cluster.
