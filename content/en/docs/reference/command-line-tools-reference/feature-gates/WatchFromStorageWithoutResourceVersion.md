---
title: WatchFromStorageWithoutResourceVersion
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    locked: true
    fromVersion: "1.33"
---
Enables watches without `resourceVersion` to be served from storage.
