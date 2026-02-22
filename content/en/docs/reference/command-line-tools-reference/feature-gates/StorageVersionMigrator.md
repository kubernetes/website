---
title: StorageVersionMigrator
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.34"
  - stage: beta 
    defaultValue: false
    fromVersion: "1.35"
---
Enables the migration of the [storage
version](/docs/concepts/overview/working-with-objects/storage-version) of a
resource. 
