---
title: MutableContainerProbes
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables in-place updates to liveness, readiness, and startup probes for regular
containers and restartable init containers through Pod update or patch operations.
The kubelet applies probe changes without recreating the Pod or restarting the container.
