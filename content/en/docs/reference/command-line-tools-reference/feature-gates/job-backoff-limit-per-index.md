---
title: JobBackoffLimitPerIndex
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
---
Allows specifying the maximal number of pod
retries per index in Indexed jobs.
