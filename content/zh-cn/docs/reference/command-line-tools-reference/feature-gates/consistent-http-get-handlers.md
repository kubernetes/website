---
title: ConsistentHTTPGetHandlers
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"  
---
<!--
Normalize HTTP get URL and Header passing for lifecycle
handlers with probers.
-->
使用探测器为生命周期处理程序规范化 HTTP get URL 和标头传递。
