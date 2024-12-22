---
title: InTreePluginOpenStackUnregister
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.30"

removed: true
---
Stops registering the OpenStack cinder in-tree plugin in kubelet
and volume controllers.
