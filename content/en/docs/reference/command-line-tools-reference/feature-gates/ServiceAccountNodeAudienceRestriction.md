---
title: ServiceAccountNodeAudienceRestriction
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---
Enable restricting the audience for which the kubelet can request a ServiceAccount token for.

