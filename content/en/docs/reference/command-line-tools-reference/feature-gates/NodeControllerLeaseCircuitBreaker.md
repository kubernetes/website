---
title: NodeControllerLeaseCircuitBreaker
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Make the node lifecycle controller check that a node's Lease object is really stale
before it marks the node as unhealthy.
