---
# Removed from Kubernetes
title: ServiceTopology
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.17"
    toVersion: "1.19"
  - stage: deprecated 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.22"

removed: true
---
Enable service to route traffic based upon the Node topology of the cluster.
