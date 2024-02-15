---
title: NameGenerationRetries
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.30"

removed: true
---
Create requests using generateName are retried automatically by the apiserver when the generated name conflicts with an existing resource name, up to a max limit of 7 retries.
