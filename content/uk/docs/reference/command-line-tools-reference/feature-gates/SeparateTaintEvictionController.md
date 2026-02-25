---
title: SeparateTaintEvictionController
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.33"
  - stage: stable
    locked: true
    defaultValue: true
    fromVersion: "1.34"
---

Дозволяє запускати _контролер виселення на основі Taint_, який виконує [виселення на основі Taint](/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions), як окремий контролер (відокремлений від _контролера життєвого циклу вузлів_).
