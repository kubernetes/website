---
# Removed from Kubernetes
title: Sysctls
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"    

removed: true
---
Enable support for namespaced kernel parameters (sysctls) that can be set for each
pod. See [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) for more details.
