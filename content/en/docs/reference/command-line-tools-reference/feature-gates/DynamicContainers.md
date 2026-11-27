---
title: DynamicContainers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Enables adding and removing app containers in a running Pod through the Pod's
`dynamic` subresource.
This feature requires the `InPlacePodLevelResourcesVerticalScaling` and
`NodeDeclaredFeatures` feature gates to be enabled as well.
See [Dynamic Containers](/docs/concepts/workloads/pods/dynamic-containers/) for more details.
