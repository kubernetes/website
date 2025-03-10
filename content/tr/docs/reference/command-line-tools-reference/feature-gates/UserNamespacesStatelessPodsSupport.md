---
title: UserNamespacesStatelessPodsSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.27"

removed: true
---
Enable user namespace support for stateless Pods. This feature gate was superseded
by the `UserNamespacesSupport` feature gate in the Kubernetes v1.28 release.
