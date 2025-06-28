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
---
Припиняє реєстрацію вбудованого втулка Portworx у kubelet та контролерах томів.
