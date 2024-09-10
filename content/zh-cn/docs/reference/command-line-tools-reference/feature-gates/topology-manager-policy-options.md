---
title: TopologyManagerPolicyOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---

<!--
Enable [fine-tuning](/docs/tasks/administer-cluster/topology-manager/#topology-manager-policy-options)
of topology manager policies.
-->
启用拓扑管理器策略的[微调](/zh-cn/docs/tasks/administer-cluster/topology-manager/#topology-manager-policy-options)。
