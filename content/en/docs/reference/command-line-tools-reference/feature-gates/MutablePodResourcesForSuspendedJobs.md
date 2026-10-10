---
title: MutablePodResourcesForSuspendedJobs 
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.35"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
removed: false
---
Enable the ability to patch pod templates for suspended Jobs, in order to change requests or limits for infrastructure resources.

