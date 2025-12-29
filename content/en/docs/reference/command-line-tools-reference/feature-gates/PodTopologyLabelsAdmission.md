---
title: PodTopologyLabelsAdmission
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Enables the `PodTopologyLabels` admission plugin.
See [Pod Topology Labels](docs/reference/access-authn-authz/admission-controllers#podtopologylabels)
for details.
