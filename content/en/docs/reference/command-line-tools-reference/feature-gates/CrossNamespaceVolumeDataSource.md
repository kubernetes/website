---
title: CrossNamespaceVolumeDataSource
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
---
Enable the usage of cross namespace volume data source
 to allow you to specify a source namespace in the `dataSourceRef` field of a
 PersistentVolumeClaim.
