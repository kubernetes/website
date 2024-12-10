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
Вмикає [тонке налаштування](/uk/docs/tasks/administer-cluster/topology-manager/#topology-manager-policy-options) політик менеджера топології.
