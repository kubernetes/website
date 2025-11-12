---
title: EnvFiles
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
---

<!--
Support defining container's Environment Variable Values via File.
See [Define Environment Variable Values Using An Init Container](/docs/tasks/inject-data-application/define-environment-variable-via-file) for more details.
-->
支持通过文件来定义容器的环境变量值。
更多细节参阅[使用 Init 容器定义环境变量值](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-via-file)。
