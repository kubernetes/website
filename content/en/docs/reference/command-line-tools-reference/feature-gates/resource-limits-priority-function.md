---
# Removed from Kubernetes
title: ResourceLimitsPriorityFunction
content_type: feature_gate

_build:
  list: never
  render: false
---
Enable a scheduler priority function that
assigns a lowest possible score of 1 to a node that satisfies at least one of
the input Pod's cpu and memory limits. The intent is to break ties between
nodes with same scores.
