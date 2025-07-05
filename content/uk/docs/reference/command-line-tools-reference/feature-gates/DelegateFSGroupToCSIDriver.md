---
title: DelegateFSGroupToCSIDriver
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.22"
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.25"
  - stage: stable
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"

removed: true
---
Якщо підтримується драйвером CSI, делегує роль застосовуючи `fsGroup` з `securityContext` Pod до драйвера, передаючи `fsGroup` через виклики CSI NodeStageVolume та NodePublishVolume.
