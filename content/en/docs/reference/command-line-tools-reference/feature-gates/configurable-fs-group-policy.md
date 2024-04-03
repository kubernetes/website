---
# Removed from Kubernetes
title: ConfigurableFSGroupPolicy
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.18"
    toVersion: "1.19"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.22"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.25"

removed: true  
---
Allows user to configure volume permission change policy
for fsGroups when mounting a volume in a Pod. See
[Configure volume permission and ownership change policy for Pods](/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)
for more details.
