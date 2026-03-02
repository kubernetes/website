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
Дозволяє вузлам змінювати `cpuCFSQuotaPeriod` в
[конфігурації kubelet](/docs/tasks/administer-cluster/kubelet-config-file/).
