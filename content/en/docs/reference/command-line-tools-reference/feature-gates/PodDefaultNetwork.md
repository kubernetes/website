---
title: PodDefaultNetwork
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Allow Pods to opt out of automatic cluster network plumbing, providing a dedicated network namespace with strict network isolation.
