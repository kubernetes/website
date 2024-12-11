---
title: ComponentFlagz
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.32"
---
Enables the component's flagz endpoint.
See [zpages](/docs/reference/instrumentation/zpages/) for more information.
