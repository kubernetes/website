---
title: JobPodFailurePolicy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"
---

<!--
Allow users to specify handling of pod failures based on container
exit codes and pod conditions.
-->
允许用户根据容器退出码和 Pod 状况来指定 Pod 失效的处理方法。
