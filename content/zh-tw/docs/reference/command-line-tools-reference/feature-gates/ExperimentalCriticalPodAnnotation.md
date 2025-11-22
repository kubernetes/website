---
# Removed from Kubernetes
title: ExperimentalCriticalPodAnnotation
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.5"
    toVersion: "1.12"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.16"

removed: true  
---

<!--
Enable annotating specific pods as *critical*
so that their [scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
This feature is deprecated by Pod Priority and Preemption as of v1.13.
-->
啓用將特定 Pod 註解爲 **關鍵負載（Critical）** 的方式，
用於[確保其被調度](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)。
從 v1.13 開始已棄用此特性，轉而使用 Pod 優先級和搶佔功能。
