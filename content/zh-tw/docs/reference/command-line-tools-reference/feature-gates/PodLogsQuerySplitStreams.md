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
允許使用 Pod API 從容器的日誌流中獲取特定日誌流（stdout 或 stderr）。
