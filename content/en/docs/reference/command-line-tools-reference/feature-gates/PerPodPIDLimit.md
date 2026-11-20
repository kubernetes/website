---
# Removed from Kubernetes
title: PerPodPIDLimit
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Support for setting process ID (PID) limits at the pod level via `spec.resources.limits.pids`.

This feature requires cgroupsv2 and allows pods to declare their own PID limit,
which is enforced as min(node podPidsLimit, pod pids limit). PIDs is a limit-only
resource (no `requests.pids`) and does not affect QoS class or scheduling.

See [Per-pod PID limits](/docs/concepts/policy/pid-limiting/#per-pod-pid-limits) for details.
