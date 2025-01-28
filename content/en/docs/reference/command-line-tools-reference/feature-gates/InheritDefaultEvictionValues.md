---
title: InheritDefaultEvictionValues
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.32"
---
Add support for the eviction hard parameters to inherit their default values in
case any of the parameter is changed. Earlier if any parameter is changed, the other
parameters were set to 0. Disable it to use this behaviour.