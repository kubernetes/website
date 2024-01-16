---
title: StatefulSetStartOrdinal
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
Allow configuration of the start ordinal in a
StatefulSet. See
[Start ordinal](/docs/concepts/workloads/controllers/statefulset/#start-ordinal)
for more details.
-->
允许在 StatefulSet 中配置起始序号。
详情参见[起始序号](/zh-cn/docs/concepts/workloads/controllers/statefulset/#start-ordinal)。
