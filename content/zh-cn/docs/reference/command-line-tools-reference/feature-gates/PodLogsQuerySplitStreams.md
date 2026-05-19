---
title: PodLogsQuerySplitStreams
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enable fetching specific log streams (either stdout or stderr) from a container's log streams, using the Pod API.
-->
允许使用 Pod API 从容器的日志流中获取特定日志流（stdout 或 stderr）。
