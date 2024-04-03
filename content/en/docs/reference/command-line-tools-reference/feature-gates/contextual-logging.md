---
title: ContextualLogging
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.24"
---
When you enable this feature gate, Kubernetes components that support
 contextual logging add extra detail to log output.
