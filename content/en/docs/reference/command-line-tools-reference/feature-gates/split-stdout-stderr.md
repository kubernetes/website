---
title: SplitStdoutAndStderr
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Allow retrieving either stdout or stderr log stream of the given container.
