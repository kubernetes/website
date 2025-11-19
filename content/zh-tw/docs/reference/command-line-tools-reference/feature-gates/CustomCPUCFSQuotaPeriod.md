---
title: CustomCPUCFSQuotaPeriod
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.12"
---
<!--
Enable nodes to change `cpuCFSQuotaPeriod` in
[kubelet config](/docs/tasks/administer-cluster/kubelet-config-file/).
-->
使節點能夠更改
[kubelet 配置](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
中的 `cpuCFSQuotaPeriod`。
