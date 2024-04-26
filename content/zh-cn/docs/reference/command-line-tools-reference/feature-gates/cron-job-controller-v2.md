---
# Removed from Kubernetes
title: CronJobControllerV2
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"

removed: true  
---
<!--
Use an alternative implementation of the
{{< glossary_tooltip text="CronJob" term_id="cronjob" >}} controller. Otherwise,
version 1 of the same controller is selected.
-->
使用 {{< glossary_tooltip text="CronJob" term_id="cronjob" >}}
控制器的一种替代实现。否则，系统会选择同一控制器的 v1 版本。
