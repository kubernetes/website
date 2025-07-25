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
گره‌ها را قادر سازید تا `cpuCFSQuotaPeriod` را در [kubelet config](/docs/tasks/administer-cluster/kubelet-config-file/) تغییر دهند.