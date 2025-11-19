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
    toVersion: "1.30"

removed: true 
---
<!--
Normalize HTTP get URL and Header passing for lifecycle
handlers with probers.
-->
使用探測器爲生命週期處理程序規範化 HTTP get URL 和標頭傳遞。
