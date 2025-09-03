---
title: WindowsHostNetwork
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"


---
Enables support for joining Windows containers to a hosts' network namespace.
