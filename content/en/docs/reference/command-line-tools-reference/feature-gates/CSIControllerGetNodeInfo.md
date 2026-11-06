---
title: CSIControllerGetNodeInfo
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Allow CSI drivers to report node topology and volume attach limits from their
controller instead of from each node.
Enables the `spec.driverRegistrations` field of CSINode.
See [Controller-side node information](/docs/concepts/storage/storage-limits/#controller-side-node-information)
for more information.
