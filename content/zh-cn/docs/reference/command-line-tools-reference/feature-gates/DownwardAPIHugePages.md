---
title: DownwardAPIHugePages
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
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"    
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.26"      
  - stage: stable
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.28"    

removed: true  
---
<!--
Enables usage of hugepages in
[downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information).
-->
允许在[下行（Downward）API](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information)
中使用巨页信息。

