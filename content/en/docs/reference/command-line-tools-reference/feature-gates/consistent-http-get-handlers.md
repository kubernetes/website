---
title: ConsistentHTTPGetHandlers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"  
---
Normalize HTTP get URL and Header passing for lifecycle
handlers with probers.
