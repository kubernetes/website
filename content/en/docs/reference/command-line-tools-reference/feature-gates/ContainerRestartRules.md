---
title: ContainerRestartRules
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---
Enables the ability to configure container-level restart policy and restart rules.
See [Container Restart Policy and Rules](/docs/concepts/workloads/pods/pod-lifecycle/#container-restart-rules) for more details.
