---
title: PerPodPIDLimit
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Enable per-pod PID limits via `spec.resources.limits.pids`, allowing individual
Pods to specify their own process ID limit. The effective limit is the minimum
of the pod-specified limit and the node-level `PodPidsLimit`. Requires the
`PodLevelResources` and `PodLevelResourcesFixKubeletQOSClass` feature gates
and cgroupsv2.
