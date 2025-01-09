---
title: StorageNamespaceIndex
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.30"
---
Enables a namespace indexer for namespace scoped resources
in API server cache to accelerate list operations.

