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
支持通過檔案來定義容器的環境變量值。
更多細節參閱[使用 Init 容器定義環境變量值](/zh-cn/docs/tasks/inject-data-application/define-environment-variable-via-file)。
