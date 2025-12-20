---
title: InPlacePodLevelResourcesVerticalScaling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.35"
---
Enables the in-place vertical scaling of resources for a Pod (For example, changing a
running Pod's pod-level CPU or memory requests/limits without needing to restart
it). For details, see the documentation on [In-place Pod-level Resources Vertical Scaling](/docs/tasks/configure-pod-container/resize-pod-resources/).