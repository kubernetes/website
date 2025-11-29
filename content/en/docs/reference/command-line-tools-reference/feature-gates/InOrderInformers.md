---
title: InOrderInformers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.33"
---
Force the informers to deliver watch stream events in order instead of out of order.
