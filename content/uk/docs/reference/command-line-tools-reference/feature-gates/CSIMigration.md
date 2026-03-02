---
# Removed from Kubernetes
title: CSIMigration
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.14"
    toVersion: "1.16"
  - stage: beta
    defaultValue: true
    fromVersion: "1.17"
    toVersion: "1.24"
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"

removed: true
---
Вмикає shimʼи та логіку передачі для маршрутизації операцій тому з вбудованого втулка до втулка CSI.
