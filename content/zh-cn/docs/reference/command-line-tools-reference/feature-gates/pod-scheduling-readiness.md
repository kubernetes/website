---
title: PodSchedulingReadiness
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---

<!--
Enable setting `schedulingGates` field to control a Pod's [scheduling readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness).
-->
允许设置 `schedulingGates` 字段以控制 Pod
的[调度就绪状态](/zh-cn/docs/concepts/scheduling-eviction/pod-scheduling-readiness)。
