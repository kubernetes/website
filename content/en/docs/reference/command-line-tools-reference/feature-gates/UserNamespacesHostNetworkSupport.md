---
title: UserNamespacesHostNetworkSupport
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.35"
---
When enabled, pods are allowed to use both `hostNetwork` and [User Namespaces](/docs/concepts/workloads/pods/user-namespaces) simultaneously.