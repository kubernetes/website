---
# Removed from Kubernetes
title: ExternalPolicyForExternalIP
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.18"
    toVersion: "1.22"

removed: true  
---
Fix a bug where ExternalTrafficPolicy is not
applied to Service ExternalIPs.
