---
title: ResourceHealthStatusMessage
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Add a `message` field to the entries of `allocatedResourcesStatus` in the container status,
with extra human-readable details about the health of each assigned device.
