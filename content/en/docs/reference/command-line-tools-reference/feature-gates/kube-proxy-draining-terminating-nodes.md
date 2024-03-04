---
title: KubeProxyDrainingTerminatingNodes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
---
Implement connection draining for
terminating nodes for `externalTrafficPolicy: Cluster` services.
