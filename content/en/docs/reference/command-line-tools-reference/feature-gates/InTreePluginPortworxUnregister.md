---
title: InTreePluginPortworxUnregister
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.35"

removed: true
---
Stops registering the Portworx in-tree plugin in kubelet
and volume controllers.
