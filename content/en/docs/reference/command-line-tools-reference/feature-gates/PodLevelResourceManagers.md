---
title: PodLevelResourceManagers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Enable _Pod-level resource managers_: the ability for the Topology, CPU, and
Memory managers to use information from `.spec.resources` to perform NUMA
alignment for an entire pod and manage resources flexibly for the containers
within that pod.
