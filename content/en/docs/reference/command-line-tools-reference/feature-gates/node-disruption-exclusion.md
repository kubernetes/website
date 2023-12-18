---
# Removed from Kubernetes
title: NodeDisruptionExclusion
content_type: feature_gate

_build:
  list: never
  render: false
---
Enable use of the Node label `node.kubernetes.io/exclude-disruption`
which prevents nodes from being evacuated during zone failures.
