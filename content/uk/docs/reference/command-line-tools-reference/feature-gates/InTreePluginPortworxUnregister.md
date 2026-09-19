---
title: InTreePluginPortworxUnregister
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.35"

removed: true
---
Припиняє реєстрацію вбудованого втулка Portworx у kubelet та контролерах томів.
