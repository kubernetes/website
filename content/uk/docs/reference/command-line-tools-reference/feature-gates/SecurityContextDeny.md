---
title: SecurityContextDeny
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.29"
removed: true
---
Ця можливість сигналізує про те, що контролер допуску `SecurityContextDeny` є застарілим.
