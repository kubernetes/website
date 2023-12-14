---
title: ExecProbeTimeout
content_type: feature_gate
_build:
  list: never
  render: false
---
Ensure kubelet respects exec probe timeouts.
This feature gate exists in case any of your existing workloads depend on a
now-corrected fault where Kubernetes ignored exec probe timeouts. See
[readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
