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
    toVersion: "1.35"
  - stage: stable
    defaultValue: true
    fromVersion: "1.36"
---
Enable nodes to change `cpuCFSQuotaPeriod` in
[kubelet config](/docs/tasks/administer-cluster/kubelet-config-file/).
