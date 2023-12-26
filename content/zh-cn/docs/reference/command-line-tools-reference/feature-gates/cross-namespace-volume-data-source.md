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
<!--
Enable the usage of cross namespace volume data source
 to allow you to specify a source namespace in the `dataSourceRef` field of a
 PersistentVolumeClaim.
-->
启用跨名字空间卷数据源，以允许你在 PersistentVolumeClaim
的 `dataSourceRef` 字段中指定一个源名字空间。
