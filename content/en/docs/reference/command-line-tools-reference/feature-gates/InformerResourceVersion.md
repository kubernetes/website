---
title: InformerResourceVersion
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.34"
  - stage: stable 
    defaultValue: true
    fromVersion: "1.35"
---
Allow clients to use the `LastSyncResourceVersion()` call on informers, enabling
them to perform actions based on the current resource version. When disabled,
`LastSyncResourceVersion()` succeeds but returns an empty string. Used by
kube-controller-manager for StorageVersionMigration.
