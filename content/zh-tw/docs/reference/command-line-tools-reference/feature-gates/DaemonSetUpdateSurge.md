---
title: DaemonSetUpdateSurge
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"

removed: true 
---
<!--
Enables the DaemonSet workloads to maintain
availability during update per node.
See [Perform a Rolling Update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
-->
使 DaemonSet 工作負載在每個節點的更新期間保持可用性。
參閱[對 DaemonSet 執行滾動更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)。
