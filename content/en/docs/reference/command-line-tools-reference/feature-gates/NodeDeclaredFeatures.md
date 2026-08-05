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
Enables Nodes to report supported features via their `.status`. This enables the 
scheduler and admission controller to prevent operations on nodes lacking features
required by the pod. See [Node Declared Features](/docs/concepts/scheduling-eviction/node-declared-features/).