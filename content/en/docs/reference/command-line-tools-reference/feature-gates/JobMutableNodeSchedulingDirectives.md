---
title: JobMutableNodeSchedulingDirectives
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta 
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.26"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"    

removed: true
---
Allows updating node scheduling directives in
the pod template of [Job](/docs/concepts/workloads/controllers/job).
