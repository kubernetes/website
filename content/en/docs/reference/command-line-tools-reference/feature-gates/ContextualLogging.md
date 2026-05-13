---
title: ContextualLogging
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.24"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.30"
---

Enables extra details in log output of Kubernetes components that support
contextual logging.
