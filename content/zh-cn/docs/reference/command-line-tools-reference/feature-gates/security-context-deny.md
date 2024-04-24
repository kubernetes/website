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
---
<!--
This gate signals that the `SecurityContextDeny` admission controller is deprecated.
-->
此门控表示 `SecurityContextDeny` 准入控制器已弃用。
