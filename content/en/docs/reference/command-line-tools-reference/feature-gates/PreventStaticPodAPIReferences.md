---
title: PreventStaticPodAPIReferences
content_type: feature_gate

_build:
  list: never
  render: false

stages:
- stage: beta
  defaultValue: true
  fromVersion: "1.34"

---
Denies Pod admission if static Pods reference other API objects.
