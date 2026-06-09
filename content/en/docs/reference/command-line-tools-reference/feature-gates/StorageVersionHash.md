---
title: StorageVersionHash
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.14"
    toVersion: "1.14"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.15"
---

Allow API servers to expose the storage version hash in the
discovery.
