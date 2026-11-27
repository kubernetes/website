---
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
Allow setting a process ID (PID) limit at the Pod level, using
`spec.resources.limits.pids`. When the node has a positive `podPidsLimit`, the
kubelet enforces the lower of the node's `podPidsLimit` and the Pod's limit on
the Pod's cgroup; with `podPidsLimit: -1` (no node limit), the Pod's limit
applies directly. Nodes must use cgroup v2.
`pids` is a limit-only resource (`requests.pids` is not allowed) and does not
affect the Pod's QoS class or scheduling.

See [Per-pod PID limits](/docs/concepts/policy/pid-limiting/#per-pod-pid-limits)
for details.
