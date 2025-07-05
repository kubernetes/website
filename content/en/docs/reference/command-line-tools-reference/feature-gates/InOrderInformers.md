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
 
---
When enabled, informers in the client-go package will deliver watch stream events in order instead of out of order.

