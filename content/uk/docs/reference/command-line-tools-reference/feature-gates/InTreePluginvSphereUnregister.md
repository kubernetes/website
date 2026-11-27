---
title: InTreePluginvSphereUnregister
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
Припиняє реєстрацію вбудованого втулка vSphere у kubelet та контролерах томів.
