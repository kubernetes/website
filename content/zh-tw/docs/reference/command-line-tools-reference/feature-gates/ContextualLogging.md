---
title: ContextualLogging
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.24"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---
<!--
Enables extra details in log output of Kubernetes components that support
contextual logging.
-->
在支持上下文日誌記錄的 Kubernetes 組件的日誌輸出中啓用額外的詳細資訊。
