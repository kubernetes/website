---
title: ChangeContainerStatusOnKubeletRestart
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.35"
---
This feature gate was introduced to allow you revert the behavior to previously used default.
If you are satisfied with the default behavior, you do not need to enable this
feature gate.
