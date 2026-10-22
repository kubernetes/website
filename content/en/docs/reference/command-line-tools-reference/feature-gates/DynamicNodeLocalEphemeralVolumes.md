---
title: DynamicNodeLocalEphemeralVolumes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables dynamically adding and removing node-local ephemeral volumes (`configMap`,
`secret`, `projected`, `emptyDir`, and `image`) and container `volumeMounts` on
running Pods via the Pod `/dynamic` subresource. For details, see
[Dynamically Add and Remove Ephemeral Volumes](/docs/tasks/configure-pod-container/configure-dynamic-volumes/).
