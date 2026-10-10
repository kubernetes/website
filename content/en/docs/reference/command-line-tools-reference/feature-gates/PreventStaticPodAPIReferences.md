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
  toVersion: "1.36"

removed: true
---
Denies Pod admission if static Pods reference other API objects.
