---
title: RecoverVolumeExpansionFailure
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.23"
    toVersion: "1.31"
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34" 
---
Enables users to edit their PVCs to smaller
sizes so as they can recover from previously issued volume expansion failures.
See [Recovering from Failure when Expanding Volumes](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)
for more details.
