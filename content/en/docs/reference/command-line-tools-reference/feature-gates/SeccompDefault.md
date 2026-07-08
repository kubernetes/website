---
title: SeccompDefault
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.25"  
    toVersion: "1.26" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"     

removed: true
---
Enables the use of `RuntimeDefault` as the default seccomp profile
for all workloads.
The seccomp profile is specified in the `securityContext` of a Pod and/or a Container.
