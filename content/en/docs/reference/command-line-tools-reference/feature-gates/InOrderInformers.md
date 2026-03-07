---
title: InOrderInformers
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---
Force the informers to deliver watch stream events in order instead of out of order.

