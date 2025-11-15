---
title: NodeDeclaredFeatures
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Enables the _Node Declared Features_ framework, allowing nodes to report supported features. This
enables the scheduler and admission controller to prevent operations on nodes lacking required
features. See [Node Declared Features](/docs/concepts/scheduling-eviction/node-declared-features/).