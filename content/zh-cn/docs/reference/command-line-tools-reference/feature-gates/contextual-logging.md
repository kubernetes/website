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
---
<!--
When you enable this feature gate, Kubernetes components that support
 contextual logging add extra detail to log output.
-->
当你启用这个特性门控，支持日志上下文记录的 Kubernetes
组件会为日志输出添加额外的详细内容。
