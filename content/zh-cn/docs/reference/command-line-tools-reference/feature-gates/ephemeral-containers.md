---
# Removed from Kubernetes
title: EphemeralContainers
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.16"
    toVersion: "1.22"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.23"
    toVersion: "1.24"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"    

removed: true  
---
<!--
Enable the ability to add
{{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}
to running Pods.
-->
启用添加{{< glossary_tooltip text="临时容器" term_id="ephemeral-container" >}}到正在运行的
Pod 的特性。
