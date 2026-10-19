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
在支持上下文日志记录的 Kubernetes 组件的日志输出中启用额外的详细信息。
