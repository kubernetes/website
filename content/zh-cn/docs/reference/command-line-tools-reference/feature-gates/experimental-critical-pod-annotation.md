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
启用将特定 Pod 注解为 **关键负载（Critical）** 的方式，
用于[确保其被调度](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)。
从 v1.13 开始已弃用此特性，转而使用 Pod 优先级和抢占功能。
