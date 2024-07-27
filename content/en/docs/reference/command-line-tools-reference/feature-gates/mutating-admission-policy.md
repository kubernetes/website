---
title: MutatingAdmissionPolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"
---
In Kubernetes {{< skew currentVersion >}}, this feature gate has no effect.
A future release of Kubernetes may use this feature gate to enable
the MutatingAdmissionPolicy in admission chain.

