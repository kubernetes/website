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
Вмикає використання джерела даних тому з іншого простору імен, щоб дозволити вам вказувати простір імен джерела у полі `dataSourceRef` у PersistentVolumeClaim.
