---
# Removed from Kubernetes
title: ResourceLimitsPriorityFunction
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.18"
  - stage: deprecated
    fromVersion: "1.19"
    toVersion: "1.19"

removed: true
---
Enable a scheduler priority function that
assigns a lowest possible score of 1 to a node that satisfies at least one of
the input Pod's cpu and memory limits. The intent is to break ties between
nodes with same scores.
